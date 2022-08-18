import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
import imgUrl from "../../images/webgl.png";

import { Scene } from "../../Scene";
import { configureControls, loadJSON } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";

export const init = async (gl: WebGL2RenderingContext) => {
  let useVertexColors = false;

  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const program = createProgram(
    gl,
    vert,
    frag,
    [
      "aVertexPosition",
      "aVertexNormal",
      "aVertexColor",
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
      "uWireframe",
      "uAlpha",
      "uUseVertexColor",
      "uUseLambert",
      "uSampler",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(await loadJSON("/models/cube-texture.json"));

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 4]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(45);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 5, 20]);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
  program.setUniform("uAlpha", "float", 1.0);
  program.setUniform("uUseVertexColor", "bool", useVertexColors);
  program.setUniform("uUseLambert", "bool", true);

  const texture = gl.createTexture();
  const image = new Image();
  image.src = imgUrl;
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  const disposeGui = configureControls({
    "Use Lambert Term": {
      value: true,
      onChange: (v) => program.setUniform("uUseLambert", "bool", v),
    },
    "Use Per Vertex": {
      value: useVertexColors,
      onChange: (v) => (useVertexColors = v),
    },
    "Alpha Value": {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => program.setUniform("uAlpha", "float", v),
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

        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
        program.setUniform("uMaterialAmbient", "vec4", object.ambient);
        program.setUniform("uWireframe", "bool", object.wireframe);
        program.setUniform("uUseVertexColor", "bool", useVertexColors);

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
