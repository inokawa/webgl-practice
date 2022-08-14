import { createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { Scene } from "../../Scene";
import { PostProcess } from "../../PostProcess";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.2, 0.2, 0.2, 1.0);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const program = createProgram(gl, vert, frag, [], []);

  const scene = new Scene(gl, program);

  const post = new PostProcess(gl, vert, frag);

  scene.start(() => {
    post.draw();
  });

  return () => {
    scene.dispose();
    post.dispose();
  };
};
