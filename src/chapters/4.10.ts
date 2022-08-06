import { draw, createProgram } from "../webgl";
import vert from "./4.10.vert?raw";
import frag from "./4.10.frag?raw";

import { mat4, vec3 } from "gl-matrix";
import { Scene } from "../Scene";
import { Floor } from "../Floor";
import { Axis } from "../Axis";
import { configureControls } from "../utils";
import { Camera } from "../Camera";
import { Controls } from "../Controls";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const projectionMatrix = mat4.create();
  let modelViewMatrix = mat4.create();
  const normalMatrix = mat4.create();

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexNormal", "aVertexColor"],
    [
      "uModelViewMatrix",
      "uProjectionMatrix",
      "uNormalMatrix",
      "uLightPosition",
      "uLightAmbient",
      "uLightDiffuse",
      "uMaterialDiffuse",
      "uWireframe",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(await import("../models/cone3.json"), "cone");
  scene.add(new Floor());
  scene.add(new Axis());

  const camera = new Camera("TRACKING_TYPE");
  camera.goHome([0, 2, 50]);

  new Controls(camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 120, 120]);
  program.setUniform("uLightAmbient", "vec4", [0.2, 0.2, 0.2, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);

  modelViewMatrix = camera.getViewTransform();
  mat4.identity(projectionMatrix);
  updateTransforms();
  mat4.identity(normalMatrix);
  mat4.copy(normalMatrix, modelViewMatrix);
  mat4.invert(normalMatrix, normalMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // Update transforms
  function updateTransforms() {
    mat4.perspective(
      projectionMatrix,
      45,
      gl.canvas.width / gl.canvas.height,
      0.1,
      1000
    );
  }

  // Set the matrix uniforms
  function setMatrixUniforms() {
    program.setUniform("uModelViewMatrix", "mat4", camera.getViewTransform());
    program.setUniform("uProjectionMatrix", "mat4", projectionMatrix);
    mat4.transpose(normalMatrix, camera.matrix);
    program.setUniform("uNormalMatrix", "mat4", normalMatrix);
  }

  // const coordinatesElement = document.getElementById("coordinates");

  configureControls({
    "Camera Type": {
      value: camera.type,
      options: ["TRACKING_TYPE", "ORBITING_TYPE"],
      onChange: (v) => {
        camera.goHome();
        camera.type = v;
      },
    },
    Dolly: {
      value: 0,
      min: -100,
      max: 100,
      step: 0.1,
      onChange: (v) => camera.dolly(v),
    },
    Position: {
      ...["X", "Y", "Z"].reduce((result: any, name, i) => {
        result[name] = {
          value: camera.position[i],
          min: -100,
          max: 100,
          step: 0.1,
          onChange: (_: any, state: any) => {
            camera.setPosition([state.X, state.Y, state.Z]);
          },
        };
        return result;
      }, {}),
    },
    Rotation: {
      Elevation: {
        value: camera.elevation,
        min: -180,
        max: 180,
        step: 0.1,
        onChange: (v) => camera.setElevation(v),
      },
      Azimuth: {
        value: camera.azimuth,
        min: -180,
        max: 180,
        step: 0.1,
        onChange: (v) => camera.setAzimuth(v),
      },
    },
    "Go Home": () => camera.goHome(),
  });

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    try {
      updateTransforms();
      setMatrixUniforms();

      objects.forEach((object) => {
        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
        program.setUniform("uWireframe", "bool", object.wireframe);

        draw(gl, object.vao, object.wireframe ? "LINES" : "TRIANGLES");
      });
    } catch (error) {
      console.error(error);
    }
  });
};
