import { draw, createProgram, loadTexture } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
import imgUrl from "../../images/fieldstone.jpg";
import imgNormalUrl from "../../images/fieldstone-normal.jpg";

import { Scene } from "../../Scene";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";
import { loadJSON } from "../../utils";

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
    [
      "aVertexPosition",
      "aVertexNormal",
      "aVertexTangent",
      "aVertexTextureCoords",
    ],
    [
      "uProjectionMatrix",
      "uModelViewMatrix",
      "uNormalMatrix",
      "uMaterialDiffuse",
      "uMaterialAmbient",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightPosition",
      "uSampler",
      "uNormalSampler",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(await loadJSON("/models/cube-texture.json"));

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 2]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(40);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 5, 20]);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);

  const texture = loadTexture(gl, imgUrl);
  const texture2 = loadTexture(gl, imgNormalUrl);

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();
    try {
      objects.forEach((object) => {
        transforms.calculateModelView();
        transforms.push();
        transforms.setMatrixUniforms();
        transforms.pop();

        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
        program.setUniform("uMaterialAmbient", "vec4", object.ambient);

        if (object.textureCoords) {
          texture.bind(0);
          program.setUniform("uSampler", "sampler2D", 0);

          texture2.bind(1);
          program.setUniform("uNormalSampler", "sampler2D", 1);
        }

        draw(gl, object.vao, "TRIANGLES");
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
