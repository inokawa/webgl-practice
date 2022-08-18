import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { mat4 } from "gl-matrix";
import { Scene } from "../../Scene";
import { Floor } from "../../Floor";
import { Axis } from "../../Axis";
import { configureControls, loadJSON, range } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const projectionMatrix = mat4.create();
  const normalMatrix = mat4.create();

  let fixedLight = false;

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
      "uFixedLight",
    ]
  );

  const scene = new Scene(gl, program);
  const models = await Promise.all(
    range(1, 179).map((i) => loadJSON(`/models/nissan-gtr/part${i}.json`))
  );
  models.forEach((m) => {
    scene.add(m);
  });
  scene.add(new Floor(2000, 100));
  scene.add(new Axis(2000));

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 25, 300]);

  new Controls(camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [100, 100, 100]);
  program.setUniform("uLightAmbient", "vec4", [0.1, 0.1, 0.1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [0.7, 0.7, 0.7, 1]);
  program.setUniform("uFixedLight", "bool", fixedLight);

  mat4.identity(projectionMatrix);
  updateTransforms();
  mat4.identity(normalMatrix);
  mat4.copy(normalMatrix, camera.getViewTransform());
  mat4.invert(normalMatrix, normalMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // Update transforms
  function updateTransforms() {
    mat4.perspective(
      projectionMatrix,
      45,
      gl.canvas.width / gl.canvas.height,
      0.1,
      5000
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

  const disposeGui = configureControls({
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
          max: 300,
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
    "Static Light Position": {
      value: fixedLight,
      onChange: (v) => program.setUniform("uFixedLight", "bool", v),
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

  return () => {
    scene.dispose();
    disposeGui();
  };
};
