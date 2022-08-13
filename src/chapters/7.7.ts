import { draw, createProgram, loadTexture } from "../webgl";
import vert from "./7.7.vert?raw";
import frag from "./7.7.frag?raw";
import imgUrl from "../images/webgl-marble.png";

import { Scene } from "../Scene";
import { configureControls } from "../utils";
import { Camera } from "../Camera";
import { Controls } from "../Controls";
import { Transforms } from "../Transforms";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(1, 1, 1, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexTextureCoords"],
    ["uProjectionMatrix", "uModelViewMatrix", "uNormalMatrix", "uSampler"]
  );

  const scene = new Scene(gl, program);
  scene.add(await import("../models/cube-texture.json"));

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 3]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(45);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  const texture = loadTexture(gl, imgUrl);

  const wrapOptions = ["CLAMP_TO_EDGE", "REPEAT", "MIRRORED_REPEAT"];

  const disposeGui = configureControls({
    ...["TEXTURE_WRAP_S", "TEXTURE_WRAP_T"].reduce((result: any, axis: any) => {
      result[axis] = {
        value: wrapOptions[1],
        options: wrapOptions,
        onChange: (v: any) => {
          texture.use(() => {
            gl.texParameteri(gl.TEXTURE_2D, (gl as any)[axis], (gl as any)[v]);
          });
        },
      };
      return result;
    }, {}),
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
          texture.bind();
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
    texture.dispose();
  };
};
