import { draw, createProgram } from "../webgl";
import vert from "./4.8.vert?raw";
import frag from "./4.8.frag?raw";

import { mat4, vec3 } from "gl-matrix";
import { Scene } from "../Scene";
import { Floor } from "../Floor";
import { Axis } from "../Axis";
import { configureControls } from "../utils";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const WORLD_COORDINATES = "World Coordinates",
    CAMERA_COORDINATES = "Camera Coordinates";
  let coordinates = WORLD_COORDINATES;
  const home: [number, number, number] = [0, -2, -50];
  let position: [number, number, number] = [0, -2, -50],
    rotation = [0, 0, 0];

  const cameraMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  const modelViewMatrix = mat4.create();
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

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 120, 120]);
  program.setUniform("uLightAmbient", "vec4", [0.2, 0.2, 0.2, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);

  mat4.identity(modelViewMatrix);
  mat4.translate(modelViewMatrix, modelViewMatrix, home);

  mat4.identity(cameraMatrix);
  mat4.invert(modelViewMatrix, cameraMatrix);

  mat4.identity(projectionMatrix);

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

    if (coordinates === WORLD_COORDINATES) {
      mat4.identity(modelViewMatrix);
      mat4.translate(modelViewMatrix, modelViewMatrix, position);
      mat4.rotateX(
        modelViewMatrix,
        modelViewMatrix,
        (rotation[0] * Math.PI) / 180
      );
      mat4.rotateY(
        modelViewMatrix,
        modelViewMatrix,
        (rotation[1] * Math.PI) / 180
      );
      mat4.rotateZ(
        modelViewMatrix,
        modelViewMatrix,
        (rotation[2] * Math.PI) / 180
      );
    } else {
      mat4.identity(cameraMatrix);
      mat4.translate(cameraMatrix, cameraMatrix, position);
      mat4.rotateX(cameraMatrix, cameraMatrix, (rotation[0] * Math.PI) / 180);
      mat4.rotateY(cameraMatrix, cameraMatrix, (rotation[1] * Math.PI) / 180);
      mat4.rotateZ(cameraMatrix, cameraMatrix, (rotation[2] * Math.PI) / 180);
    }
  }

  // Set the matrix uniforms
  function setMatrixUniforms() {
    if (coordinates === WORLD_COORDINATES) {
      mat4.invert(cameraMatrix, modelViewMatrix);
      program.setUniform("uModelViewMatrix", "mat4", modelViewMatrix);
    } else {
      mat4.invert(modelViewMatrix, cameraMatrix);
    }

    program.setUniform("uProjectionMatrix", "mat4", projectionMatrix);
    program.setUniform("uModelViewMatrix", "mat4", modelViewMatrix);
    mat4.transpose(normalMatrix, cameraMatrix);
    program.setUniform("uNormalMatrix", "mat4", normalMatrix);
  }

  // const coordinatesElement = document.getElementById("coordinates");

  const disposeGui = configureControls({
    Coordinates: {
      value: coordinates,
      options: [WORLD_COORDINATES, CAMERA_COORDINATES],
      onChange: (v: any) => {
        coordinates = v;
        // coordinatesElement.innerText = coordinates;
        vec3.copy(home, position);
        rotation = [0, 0, 0];
        if (coordinates === CAMERA_COORDINATES) {
          vec3.negate(position, position);
        }
      },
    },
    Position: {
      ...["Translate X", "Translate Y", "Translate Z"].reduce(
        (result: any, name, i) => {
          result[name] = {
            value: position[i],
            min: -100,
            max: 100,
            step: -0.1,
            onChange(_: any, state: any) {
              position = [
                state["Translate X"],
                state["Translate Y"],
                state["Translate Z"],
              ];
            },
          };
          return result;
        },
        {}
      ),
    },
    Rotation: {
      ...["Rotate X", "Rotate Y", "Rotate Z"].reduce((result: any, name, i) => {
        result[name] = {
          value: rotation[i],
          min: -180,
          max: 180,
          step: 0.1,
          onChange(_: any, state: any) {
            rotation = [
              state["Rotate X"],
              state["Rotate Y"],
              state["Rotate Z"],
            ];
          },
        };
        return result;
      }, {}),
    },
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

  return () => {
    scene.dispose();
    disposeGui();
  };
};
