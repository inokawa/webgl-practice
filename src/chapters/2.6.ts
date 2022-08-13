import {
  draw,
  createVertexArray,
  createProgram,
  RenderingMode,
} from "../webgl";
import * as utils from "../utils";
import vert from "./2.6.vert?raw";
import frag from "./2.6.frag?raw";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  const program = createProgram(gl, vert, frag, ["aVertexPosition"], []);

  const vertices = [
    -0.5, -0.5, 0, -0.25, 0.5, 0, 0.0, -0.5, 0, 0.25, 0.5, 0, 0.5, -0.5, 0,
  ];
  const indices = [0, 1, 2, 0, 2, 3, 2, 3, 4];
  const vao = createVertexArray(
    gl,
    program,
    [{ name: "aVertexPosition", data: vertices, size: 3 }],
    indices
  );

  let renderingMode: RenderingMode = "TRIANGLES";

  program.use();

  let stop = false;
  (function render() {
    if (stop) return;
    requestAnimationFrame(render);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    draw(gl, vao, renderingMode);
  })();

  const disposeGui = utils.configureControls({
    "Rendering Mode": {
      value: renderingMode,
      options: [
        "TRIANGLES",
        "LINES",
        "POINTS",
        "LINE_LOOP",
        "LINE_STRIP",
        "TRIANGLE_STRIP",
        "TRIANGLE_FAN",
      ],
      onChange: (v) => (renderingMode = v),
    },
  });

  return () => {
    stop = true;
    disposeGui();
    program.dispose();
    vao.dispose();
  };
};
