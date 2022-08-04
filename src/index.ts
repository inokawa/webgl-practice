import { init } from "./chapter3.13";
import * as utils from "./utils";

window.onload = () => {
  const canvas = utils.getCanvas("app");
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  utils.autoResizeCanvas(canvas);

  const gl = utils.getGLContext(canvas);
  if (!gl) return;

  init(gl);
};
