import { draw, initBuffers, initProgram, RenderingMode } from "./webgl";
import * as utils from "./utils";
import vert from "./default.vert?raw";
import frag from "./default.frag?raw";

const init = (gl: WebGL2RenderingContext, vert: string, frag: string) => {
  gl.clearColor(0, 0, 0, 1);
  const program = initProgram(gl, vert, frag);

  const vertices = [
    -0.5, -0.5, 0, -0.25, 0.5, 0, 0.0, -0.5, 0, 0.25, 0.5, 0, 0.5, -0.5, 0,
  ];
  const indices = [0, 1, 2, 0, 2, 3, 2, 3, 4];
  const vao = initBuffers(gl, program, vertices, indices);

  let renderingMode: RenderingMode = "TRIANGLES";

  (function render() {
    requestAnimationFrame(render);
    draw(gl, program, vao, renderingMode);
  })();

  utils.configureControls({
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
