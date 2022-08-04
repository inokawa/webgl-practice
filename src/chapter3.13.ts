import { draw, createVertexArray, createProgram } from "./webgl";
import * as utils from "./utils";
import vert from "./chapter3.13.vert?raw";
import frag from "./chapter3.13.frag?raw";

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
      import("./models/plane.json"),
      import("./models/cone2.json"),
      import("./models/sphere1.json"),
      import("./models/sphere3.json"),
    ])
  ).map((d, i) => ({
    ...d,
    alias: i === 0 ? "plane" : i === 1 ? "cone" : i === 2 ? "sphere" : "light",
    vao: createVertexArray(
      gl,
      program,
      [
        { name: "aVertexPosition", data: d.vertices },
        {
          name: "aVertexNormal",
          data: utils.calculateNormals(d.vertices, d.indices),
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
  utils.configureControls({
    "Sphere Color": {
      value: [0, 255, 0],
      onChange: (v) =>
        (getObject("sphere")!.diffuse = [...utils.normalizeColor(v), 1.0]),
    },
    "Cone Color": {
      value: [235, 0, 210],
      onChange: (v) =>
        (getObject("cone")!.diffuse = [...utils.normalizeColor(v), 1.0]),
    },
    Shininess: {
      value: shininess,
      min: 1,
      max: 50,
      step: 0.1,
      onChange: (v) => gl.uniform1f(program.uniforms.uShininess, v),
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
            gl.uniform3fv(program.uniforms.uLightPosition, [
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

  gl.uniform3fv(program.uniforms.uLightPosition, lightPosition);
  gl.uniform4f(program.uniforms.uLightAmbient, 1, 1, 1, 1);
  gl.uniform4f(program.uniforms.uLightDiffuse, 1, 1, 1, 1);
  gl.uniform4f(program.uniforms.uLightSpecular, 1, 1, 1, 1);
  gl.uniform4f(program.uniforms.uMaterialAmbient, 0.1, 0.1, 0.1, 1);
  gl.uniform4f(program.uniforms.uMaterialDiffuse, 0.5, 0.8, 0.1, 1);
  gl.uniform4f(program.uniforms.uMaterialSpecular, 0.6, 0.6, 0.6, 1);
  gl.uniform1f(program.uniforms.uShininess, shininess);

  (function render() {
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
          const lightPosition = gl.getUniform(
            program.data,
            program.uniforms.uLightPosition
          );
          mat4.translate(modelViewMatrix, modelViewMatrix, lightPosition);
        }

        mat4.copy(normalMatrix, modelViewMatrix);
        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix4fv(
          program.uniforms.uModelViewMatrix,
          false,
          modelViewMatrix
        );
        gl.uniformMatrix4fv(
          program.uniforms.uProjectionMatrix,
          false,
          projectionMatrix
        );
        gl.uniformMatrix4fv(
          program.uniforms.uNormalMatrix,
          false,
          normalMatrix
        );

        // Set lighting data
        gl.uniform4fv(program.uniforms.uMaterialAmbient, object.ambient);
        gl.uniform4fv(program.uniforms.uMaterialDiffuse, object.diffuse);
        gl.uniform4fv(program.uniforms.uMaterialSpecular, object.specular);

        draw(gl, object.vao, "TRIANGLES");
      });
    } catch (error) {
      // We catch the `error` and simply output to the screen for testing/debugging purposes
      console.error(error);
    }
  })();
};
