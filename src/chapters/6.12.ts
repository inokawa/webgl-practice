import { draw, createProgram } from "../webgl";
import vert from "./6.12.vert?raw";
import frag from "./6.12.frag?raw";

import { Scene } from "../Scene";
import { configureControls, denormalizeColor, normalizeColor } from "../utils";
import { Camera } from "../Camera";
import { Controls } from "../Controls";
import { Transforms } from "../Transforms";
import { Floor } from "../Floor";
import { mat4 } from "gl-matrix";

export const init = async (gl: WebGL2RenderingContext) => {
  let blending = true,
    depthTest = true,
    culling = true,
    lambert = true,
    floor = true,
    coneColor: [number, number, number, number] = [0, 1, 1, 1],
    sphereColor: [number, number, number, number] = [0.7, 0, 0.7, 1],
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
    ["aVertexPosition", "aVertexNormal"],
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
      "uUseLambert",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(new Floor(80, 2));
  scene.add(
    {
      ...(await import("../models/cone3.json")),
      diffuse: coneColor,
    },
    "cone"
  );
  scene.add(
    {
      ...(await import("../models/sphere2.json")),
      diffuse: sphereColor,
    },
    "sphere"
  );

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 5, 35]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(25);
  camera.setElevation(-25);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 5, 20]);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
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

  const getState = (v: boolean) => (v ? "enable" : "disable");

  function updateBlending(value = true) {
    gl[value ? "enable" : "disable"](gl.BLEND);
    gl.blendFunc(blendingSource, blendingTarget);
    gl.blendEquation(blendingEquation);
    gl.blendColor(...blendingColor, blendingAlpha);
  }

  const disposeGui = configureControls({
    Blending: {
      value: blending,
      onChange: updateBlending,
    },
    "Depth Testing": {
      value: depthTest,
      onChange: (v) => gl[getState(v)](gl.DEPTH_TEST),
    },
    "Back Face Culling": {
      value: culling,
      onChange: (v) => gl[getState(v)](gl.CULL_FACE),
    },
    Lambert: {
      value: lambert,
      onChange: (v) => (lambert = v),
    },
    Floor: {
      value: floor,
      onChange: (v) => (floor = v),
    },
    ...[
      { name: "Sphere", id: "sphere", color: sphereColor },
      { name: "Cone", id: "cone", color: coneColor },
    ].reduce((result, data) => {
      result = {
        ...result,
        [`${data.name} Alpha`]: {
          value: 1,
          min: 0,
          max: 1,
          step: 0.1,
          onChange: (v: any) => (scene.get(data.id)!.diffuse[3] = v),
        },
        [`${data.name} Color`]: {
          value: denormalizeColor(data.color),
          onChange: (v: any) =>
            (scene.get(data.id)!.diffuse = normalizeColor(v)),
        },
      };
      return result;
    }, {}),
    "Blend Function": {
      value: blendingEquation,
      options: ["FUNC_ADD", "FUNC_SUBTRACT", "FUNC_REVERSE_SUBTRACT"],
      onChange: (v: any) => {
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
      onChange: (v: any) => {
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
    "Alpha Value": {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => {
        blendingAlpha = v;
        updateBlending();
      },
    },
    "Render Order": {
      value: "Cone First",
      options: ["Cone First", "Sphere First"],
      onChange: (v) => {
        if (v === "Sphere First") {
          scene.renderSooner("sphere");
          scene.renderFirst("floor");
        } else {
          scene.renderSooner("cone");
          scene.renderFirst("floor");
        }
      },
    },
    Reset: () => {
      depthTest = true;
      blending = true;
      culling = true;
      lambert = true;
      floor = true;
      blendingEquation = gl.FUNC_ADD;
      blendingSource = gl.SRC_ALPHA;
      blendingTarget = gl.ONE_MINUS_SRC_ALPHA;
      camera.goHome([0, 5, 35]);
      camera.setFocus([0, 0, 0]);
      camera.setAzimuth(25);
      camera.setElevation(-25);
    },
  });

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();

    try {
      objects.forEach((object) => {
        const { alias } = object;

        if (alias === "floor" && !floor) return;

        transforms.calculateModelView();
        transforms.push();

        if (alias === "cone") {
          mat4.translate(
            transforms.modelViewMatrix,
            transforms.modelViewMatrix,
            [0, 0, -3.5]
          );
        }

        if (alias === "sphere") {
          mat4.scale(
            transforms.modelViewMatrix,
            transforms.modelViewMatrix,
            [0.5, 0.5, 0.5]
          );
          mat4.translate(
            transforms.modelViewMatrix,
            transforms.modelViewMatrix,
            [0, 0, 2.5]
          );
        }

        transforms.setMatrixUniforms();
        transforms.pop();

        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
        program.setUniform("uMaterialAmbient", "vec4", object.ambient);
        program.setUniform("uWireframe", "bool", object.wireframe);
        program.setUniform("uUseLambert", "bool", lambert);

        draw(gl, object.vao, object.wireframe ? "LINES" : "TRIANGLES");
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
