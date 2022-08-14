import { draw, createProgram, loadTexture } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
import imgUrl from "../../images/webgl.png";
import img2Url from "../../images/light.png";

import { Scene } from "../../Scene";
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
    [
      "uProjectionMatrix",
      "uModelViewMatrix",
      "uNormalMatrix",
      "uSampler",
      "uSampler2",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(await import("../../models/cube-texture.json"));

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 4]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(45);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  const texture = loadTexture(gl, imgUrl);
  const texture2 = loadTexture(gl, img2Url);

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
          texture.bind(0);
          program.setUniform("uSampler", "sampler2D", 0);
          texture2.bind(1);
          program.setUniform("uSampler", "sampler2D", 1);
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
    texture.dispose();
    texture2.dispose();
  };
};
