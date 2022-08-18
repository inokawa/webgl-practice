import { draw, createVertexArray, createProgram } from "../../webgl";
import {
  calculateNormals,
  configureControls,
  loadJSON,
  normalizeColor,
} from "../../utils";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { mat4 } from "gl-matrix";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexNormal"],
    [
      "uModelViewMatrix",
      "uProjectionMatrix",
      "uNormalMatrix",
      "uLightPosition",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightSpecular",
      "uMaterialAmbient",
      "uMaterialDiffuse",
      "uMaterialSpecular",
      "uShininess",
    ]
  );

  const objects = (
    await Promise.all([
      loadJSON("/models/plane.json"),
      loadJSON("/models/cone2.json"),
      loadJSON("/models/sphere1.json"),
      loadJSON("/models/sphere3.json"),
    ])
  ).map((d, i) => ({
    ...d,
    alias: i === 0 ? "plane" : i === 1 ? "cone" : i === 2 ? "sphere" : "light",
    vao: createVertexArray(
      gl,
      program,
      [
        { name: "aVertexPosition", data: d.vertices, size: 3 },
        {
          name: "aVertexNormal",
          data: calculateNormals(d.vertices, d.indices),
          size: 3,
        },
      ],
      d.indices
    ),
  }));

  const projectionMatrix = mat4.create();
  const modelViewMatrix = mat4.create();
  const normalMatrix = mat4.create();
  let angle = 0,
    lightPosition = [4.5, 3, 15],
    shininess = 200,
    distance = -100;

  function getObject(alias: string) {
    return objects.find((object) => object.alias === alias);
  }
  const disposeGui = configureControls({
    "Sphere Color": {
      value: [0, 255, 0],
      onChange: (v) =>
        (getObject("sphere")!.diffuse = [...normalizeColor(v), 1.0]),
    },
    "Cone Color": {
      value: [235, 0, 210],
      onChange: (v) =>
        (getObject("cone")!.diffuse = [...normalizeColor(v), 1.0]),
    },
    Shininess: {
      value: shininess,
      min: 1,
      max: 50,
      step: 0.1,
      onChange: (v) => program.setUniform("uShininess", "float", v),
    },
    // Spread all values from the reduce onto the controls
    ...["Translate X", "Translate Y", "Translate Z"].reduce(
      (result: any, name, i) => {
        result[name] = {
          value: lightPosition[i],
          min: -50,
          max: 50,
          step: -0.1,
          onChange(_: any, state: any) {
            program.setUniform("uLightPosition", "vec3", [
              state["Translate X"],
              state["Translate Y"],
              state["Translate Z"],
            ]);
          },
        };
        return result;
      },
      {}
    ),
    Distance: {
      value: distance,
      min: -200,
      max: -50,
      step: 0.1,
      onChange: (v) => (distance = v),
    },
  });

  program.use();

  program.setUniform("uLightPosition", "vec3", lightPosition);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightSpecular", "vec4", [1, 1, 1, 1]);
  program.setUniform("uMaterialAmbient", "vec4", [0.1, 0.1, 0.1, 1]);
  program.setUniform("uMaterialDiffuse", "vec4", [0.5, 0.8, 0.1, 1]);
  program.setUniform("uMaterialSpecular", "vec4", [0.6, 0.6, 0.6, 1]);
  program.setUniform("uShininess", "float", shininess);

  let stop = false;
  (function render() {
    if (stop) return;
    requestAnimationFrame(render);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
      projectionMatrix,
      45,
      gl.canvas.width / gl.canvas.height,
      0.1,
      1000
    );

    try {
      // Iterate over every object
      objects.forEach((object) => {
        // We will cover these operations in later chapters
        mat4.identity(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, distance]);
        mat4.rotate(
          modelViewMatrix,
          modelViewMatrix,
          (30 * Math.PI) / 180,
          [1, 0, 0]
        );
        mat4.rotate(
          modelViewMatrix,
          modelViewMatrix,
          (angle * Math.PI) / 180,
          [0, 1, 0]
        );

        // If object is the light, we update its position
        if (object.alias === "light") {
          const lightPosition = program.getUniform("uLightPosition");
          mat4.translate(modelViewMatrix, modelViewMatrix, lightPosition);
        }

        mat4.copy(normalMatrix, modelViewMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        program.setUniform("uModelViewMatrix", "mat4", modelViewMatrix);
        program.setUniform("uProjectionMatrix", "mat4", projectionMatrix);
        program.setUniform("uNormalMatrix", "mat4", normalMatrix);

        // Set lighting data
        program.setUniform("uMaterialAmbient", "vec4", object.ambient);
        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
        program.setUniform("uMaterialSpecular", "vec4", object.specular);

        draw(gl, object.vao, "TRIANGLES");
      });
    } catch (error) {
      // We catch the `error` and simply output to the screen for testing/debugging purposes
      console.error(error);
    }
  })();
  return () => {
    stop = true;
    disposeGui();
    program.dispose();
    objects.forEach((o) => {
      o.vao.dispose();
    });
  };
};
