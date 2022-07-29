import { init } from "./app";
import * as utils from "./utils";
// @ts-expect-error
import vert from "./default.vert?raw";
// @ts-expect-error
import frag from "./default.frag?raw";

window.onload = () => {
  const canvas = utils.getCanvas("app");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = utils.getGLContext(canvas);
  if (!gl) return;

  init(gl, vert, frag);
};
