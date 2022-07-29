import { draw, createVertexArray, initProgram } from "./webgl";
import * as utils from "./utils";
import vert from "./default.vert?raw";
import frag from "./default.frag?raw";

import { mat4 } from "gl-matrix";

const init = async (gl: WebGL2RenderingContext, vert: string, frag: string) => {
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  const program = initProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition"],
    ["uProjectionMatrix", "uModelViewMatrix", "uModelColor"]
  );

  const model = await fetch("/models/cone1.json").then((r) => r.json());
  const vao = createVertexArray(gl, program, model.vertices, model.indices);

  const projectionMatrix = mat4.create();
  const modelViewMatrix = mat4.create();

  (function render() {
    requestAnimationFrame(render);

    draw(gl, program, vao, "LINE_LOOP", () => {
      mat4.perspective(
        projectionMatrix,
        45,
        gl.canvas.width / gl.canvas.height,
        0.1,
        10000
      );
      mat4.identity(modelViewMatrix);
      mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5.0]);

      gl.uniform3fv(program.uniforms.uModelColor, model.color);
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
    });
  })();

  // utils.configureControls({
  //   "Rendering Mode": {
  //     value: renderingMode,
  //     options: [
  //       "TRIANGLES",
  //       "LINES",
  //       "POINTS",
  //       "LINE_LOOP",
  //       "LINE_STRIP",
  //       "TRIANGLE_STRIP",
  //       "TRIANGLE_FAN",
  //     ],
  //     onChange: (v) => (renderingMode = v),
  //   },
  // });
};

window.onload = () => {
  const canvas = utils.getCanvas("app");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = utils.getGLContext(canvas);
  if (!gl) return;

  init(gl, vert, frag);
};
