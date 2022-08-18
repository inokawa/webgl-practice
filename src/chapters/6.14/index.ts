import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { Scene } from "../../Scene";
import { configureControls, loadJSON, normalizeColor } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";

export const init = async (gl: WebGL2RenderingContext) => {
  let lambert = true,
    showBackFace = true,
    showFrontFace = true,
    blendingColor: [number, number, number] = [0, 1, 0],
    blendingAlpha = 1;

  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.blendColor(...blendingColor, blendingAlpha);
  gl.enable(gl.CULL_FACE);

  let blendingEquation = gl.FUNC_ADD;
  let blendingSource = gl.SRC_ALPHA;
  let blendingTarget = gl.ONE_MINUS_SRC_ALPHA;

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexColor"],
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
      "uUseLambert",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(await loadJSON("/models/cube-complex.json"), "cube");

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 4]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(50);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 5, 20]);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
  program.setUniform("uAlpha", "float", 0.5);
  program.setUniform("uUseLambert", "bool", lambert);

  const blendFuncs = [
    "ZERO",
    "ONE",
    "SRC_COLOR",
    "DST_COLOR",
    "SRC_ALPHA",
    "DST_ALPHA",
    "CONSTANT_COLOR",
    "CONSTANT_ALPHA",
    "ONE_MINUS_SRC_ALPHA",
    "ONE_MINUS_DST_ALPHA",
    "ONE_MINUS_SRC_COLOR",
    "ONE_MINUS_DST_COLOR",
    "ONE_MINUS_CONSTANT_COLOR",
    "ONE_MINUS_CONSTANT_ALPHA",
  ];

  function updateBlending(value = true) {
    gl[value ? "enable" : "disable"](gl.BLEND);
    gl.blendFunc(blendingSource, blendingTarget);
    gl.blendEquation(blendingEquation);
    gl.blendColor(...blendingColor, blendingAlpha);
  }

  const disposeGui = configureControls({
    "Alpha Blending": {
      value: true,
      onChange: updateBlending,
    },
    "Render Front Face": {
      value: true,
      onChange: (v) => (showFrontFace = v),
    },
    "Render Back Face": {
      value: true,
      onChange: (v) => (showBackFace = v),
    },
    "Alpha Value": {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => program.setUniform("uAlpha", "float", v),
    },
    "Blend Function": {
      value: blendingEquation,
      options: ["FUNC_ADD", "FUNC_SUBTRACT", "FUNC_REVERSE_SUBTRACT"],
      onChange: (v) => {
        blendingEquation = (gl as any)[v];
        updateBlending();
      },
    },
    Source: {
      value: blendingSource,
      options: [...blendFuncs, "SRC_ALPHA_SATURATE"],
      onChange: (v) => {
        blendingSource = (gl as any)[v];
        updateBlending();
      },
    },
    Destination: {
      value: blendingTarget,
      options: blendFuncs,
      onChange: (v) => {
        blendingTarget = (gl as any)[v];
        updateBlending();
      },
    },
    "Blending Color": {
      value: [0, 0, 0],
      onChange: (v) => {
        blendingColor = normalizeColor(v);
        updateBlending();
      },
    },
    "Constant Alpha": {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => {
        blendingAlpha = v;
        updateBlending();
      },
    },
  });

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
        program.setUniform("uWireframe", "bool", object.wireframe);

        if (object.wireframe) {
          draw(gl, object.vao, "LINES");
        } else {
          if (showBackFace) {
            gl.cullFace(gl.FRONT);
            draw(gl, object.vao, "TRIANGLES");
          }
          if (showFrontFace) {
            gl.cullFace(gl.BACK);
            draw(gl, object.vao, "TRIANGLES");
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
  return () => {
    scene.dispose();
    disposeGui();
  };
};
