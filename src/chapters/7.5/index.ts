import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
import imgUrl from "../../images/webgl.png";

import { Scene } from "../../Scene";
import { configureControls } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.disable(gl.BLEND);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexTextureCoords"],
    ["uProjectionMatrix", "uModelViewMatrix", "uNormalMatrix", "uSampler"]
  );

  const scene = new Scene(gl, program);
  scene.add(await import("../../models/cube-texture.json"));

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 0]);
  camera.dolly(-4);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(45);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  const texture = gl.createTexture();
  const image = new Image();
  image.src = imgUrl;
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };

  const disposeGui = configureControls({
    Distance: {
      value: 0,
      min: 0,
      max: 20,
      step: 0.1,
      onChange: (v) => {
        camera.dolly(-v);
        camera.update();
      },
    },
    "Mag Filter": {
      value: "NEAREST",
      options: ["NEAREST", "LINEAR"],
      onChange: (v) => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, (gl as any)[v]);
        gl.bindTexture(gl.TEXTURE_2D, null);
      },
    },
    "Min Filter": {
      value: "NEAREST",
      options: [
        "NEAREST",
        "LINEAR",
        "NEAREST_MIPMAP_NEAREST",
        "LINEAR_MIPMAP_NEAREST",
        "NEAREST_MIPMAP_LINEAR",
        "LINEAR_MIPMAP_LINEAR",
      ],
      onChange: (v) => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, (gl as any)[v]);
        gl.bindTexture(gl.TEXTURE_2D, null);
      },
    },
  });

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();

    try {
      objects.forEach((object) => {
        // if (object.hidden) return;

        transforms.calculateModelView();
        transforms.push();
        transforms.setMatrixUniforms();
        transforms.pop();

        // Activate texture
        if (object.textureCoords) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          program.setUniform("uSampler", "sampler2D", 0);
        }

        // Draw
        if (object.wireframe) {
          draw(gl, object.vao, "LINES");
        } else {
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl.FRONT);
          draw(gl, object.vao, "TRIANGLES");

          gl.cullFace(gl.BACK);
          draw(gl, object.vao, "TRIANGLES");
          gl.disable(gl.CULL_FACE);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
  return () => {
    scene.dispose();
    disposeGui();
    gl.deleteTexture(texture);
  };
};
