import { createProgram, loadTexture } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
import imgUrl from "../../images/spark.png";

import { Scene } from "../../Scene";
import { configureControls } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";
import { Particles } from "../../Particles";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clearDepth(100);
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aParticle"],
    ["uProjectionMatrix", "uModelViewMatrix", "uPointSize", "uSampler"]
  );

  let lastFrameTime = Date.now();
  const scene = new Scene(gl, program);

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 40]);
  camera.setFocus([0, 0, 0]);
  camera.setElevation(-40);
  camera.setAzimuth(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program as any, camera, gl.canvas);

  const spriteTexture = loadTexture(gl, imgUrl);

  let particleSize = 14;
  const count = 1024;
  const lifeSpan = 3;
  const particles = new Particles(gl, count, lifeSpan);

  program.use();

  const disposeGui = configureControls({
    "Particle Size": {
      value: particleSize,
      min: 5,
      max: 50,
      step: 0.1,
      onChange: (v) => (particleSize = v),
    },
    "Particle Life Span": {
      value: lifeSpan,
      min: 1,
      max: 10,
      step: 0.1,
      onChange: (v) => particles.updateLifespan(v),
    },
  });

  scene.start(() => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();

    // Update the particle positions
    const now = Date.now();
    particles.updateParticles((now - lastFrameTime) / 1000.0);
    lastFrameTime = now;

    try {
      transforms.calculateModelView();
      transforms.setMatrixUniforms();

      program.use();

      program.setUniform("uPointSize", "float", particleSize);

      transforms.calculateModelView();
      transforms.push();

      particles.use((count) => {
        gl.vertexAttribPointer(
          program.attributes.aParticle,
          4,
          gl.FLOAT,
          false,
          0,
          0
        );
        gl.enableVertexAttribArray(program.attributes.aParticle);

        // Activate texture
        spriteTexture.bind(0);
        program.setUniform("uSampler", "sampler2D", 0);

        // Draw
        gl.drawArrays(gl.POINTS, 0, count);
      });
    } catch (error) {
      console.error(error);
    }
  });

  return () => {
    scene.dispose();
    particles.dispose();
    disposeGui();
    spriteTexture.dispose();
  };
};
