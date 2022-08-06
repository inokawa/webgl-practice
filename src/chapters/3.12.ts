import { draw, createVertexArray, createProgram } from "../webgl";
import * as utils from "../utils";
import vert from "./3.12.vert?raw";
import frag from "./3.12.frag?raw";

import { mat4 } from "gl-matrix";

const vertices = [
  -20,
  -8,
  20, // 0
  -10,
  -8,
  0, // 1
  10,
  -8,
  0, // 2
  20,
  -8,
  20, // 3
  -20,
  8,
  20, // 4
  -10,
  8,
  0, // 5
  10,
  8,
  0, // 6
  20,
  8,
  20, // 7
];

const indices = [0, 5, 4, 1, 5, 0, 1, 6, 5, 2, 6, 1, 2, 7, 6, 3, 7, 2];

// Calculate the normals using the `calculateNormals` utility function
const normals = utils.calculateNormals(vertices, indices);

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
      "uLightDirection",
      "uLightAmbient",
      "uLightDiffuse",
      "uMaterialAmbient",
      "uMaterialDiffuse",
    ]
  );

  const vao = createVertexArray(
    gl,
    program,
    [
      { name: "aVertexPosition", data: vertices, size: 3 },
      { name: "aVertexNormal", data: normals, size: 3 },
    ],
    indices
  );

  let azimuth = 0;
  let elevation = 0;

  const projectionMatrix = mat4.create();
  const modelViewMatrix = mat4.create();
  const normalMatrix = mat4.create();

  document.onkeydown = (ev) => {
    const lightDirection = program.getUniform("uLightDirection");
    const incrementValue = 10;

    switch (ev.key) {
      // left arrow
      case "ArrowLeft": {
        azimuth -= incrementValue;
        break;
      }
      // up arrow
      case "ArrowUp": {
        elevation += incrementValue;
        break;
      }
      // right arrow
      case "ArrowRight": {
        azimuth += incrementValue;
        break;
      }
      // down arrow
      case "ArrowDown": {
        elevation -= incrementValue;
        break;
      }
    }

    azimuth %= 360;
    elevation %= 360;

    const theta = (elevation * Math.PI) / 180;
    const phi = (azimuth * Math.PI) / 180;

    // Spherical to cartesian coordinate transformation
    lightDirection[0] = Math.cos(theta) * Math.sin(phi);
    lightDirection[1] = Math.sin(theta);
    lightDirection[2] = Math.cos(theta) * -Math.cos(phi);

    gl.uniform3fv(program.uniforms.uLightDirection, lightDirection);
  };

  program.use();

  gl.uniform3fv(program.uniforms.uLightDirection, [0, 0, -1]);
  gl.uniform4fv(program.uniforms.uLightAmbient, [0.01, 0.01, 0.01, 1]);
  gl.uniform4fv(program.uniforms.uLightDiffuse, [0.5, 0.5, 0.5, 1]);
  gl.uniform4f(program.uniforms.uMaterialDiffuse, 0.1, 0.5, 0.8, 1);

  (function render() {
    requestAnimationFrame(render);
    const { width, height } = gl.canvas;

    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(projectionMatrix, 45, width / height, 0.1, 10000);
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -40]);

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
    gl.uniformMatrix4fv(program.uniforms.uNormalMatrix, false, normalMatrix);

    gl.uniformMatrix4fv(
      program.uniforms.uProjectionMatrix,
      false,
      projectionMatrix
    );
    gl.uniformMatrix4fv(
      program.uniforms.uModelViewMatrix,
      false,
      modelViewMatrix
    );
    gl.uniformMatrix4fv(program.uniforms.uNormalMatrix, false, normalMatrix);

    draw(gl, vao, "TRIANGLES");
  })();
};
