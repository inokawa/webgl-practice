import { createProgram, loadTexture } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
import imgUrl from "../../images/spark.png";

import { Scene } from "../../Scene";
import { configureControls } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";

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

  let particleSize = 14,
    particleLifespan = 3;
  const count = 1024;
  const [particles, particleArray] = configureParticles(count);
  const particleBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, particleArray, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

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
      value: particleLifespan,
      min: 1,
      max: 10,
      step: 0.1,
      onChange: (v) => (particleLifespan = v),
    },
  });

  scene.start(() => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();

    // Update the particle positions
    const now = Date.now();
    updateParticles((now - lastFrameTime) / 1000.0);
    lastFrameTime = now;

    // Once we are done looping through all the particles, update the buffer once
    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particleArray, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    try {
      transforms.calculateModelView();
      transforms.setMatrixUniforms();

      program.use();

      program.setUniform("uPointSize", "float", particleSize);

      transforms.calculateModelView();
      transforms.push();

      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
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
      gl.drawArrays(gl.POINTS, 0, particles.length);

      // Clean
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    } catch (error) {
      console.error(error);
    }
  });

  return () => {
    scene.dispose();
    gl.deleteBuffer(particleBuffer);
    disposeGui();
    spriteTexture.dispose();
  };

  type Particle = {
    position: [number, number, number];
    velocity: [number, number, number];
    lifespan: number;
    remainingLife: number;
  };

  function createParticle(): Particle {
    const lifeSpan = Math.random() * particleLifespan;
    return {
      position: [0, 0, 0],
      velocity: [
        Math.random() * 20 - 10,
        Math.random() * 20,
        Math.random() * 20 - 10,
      ],
      lifespan: lifeSpan,
      remainingLife: lifeSpan,
    };
  }

  function configureParticles(count: number): [Particle[], Float32Array] {
    const particles: Particle[] = [];
    const particleArray = new Float32Array(count * 4);

    for (let i = 0; i < count; ++i) {
      const particle = createParticle();
      particles.push(particle);

      const index = i * 4;
      particleArray[index] = particle.position[0];
      particleArray[index + 1] = particle.position[1];
      particleArray[index + 2] = particle.position[2];
      particleArray[index + 3] = particle.remainingLife / particle.lifespan;
    }

    return [particles, particleArray];
  }

  function updateParticles(elapsed: number) {
    // Loop through all the particles in the array
    particles.forEach((particle, i) => {
      // Track the particles lifespan
      particle.remainingLife -= elapsed;

      if (particle.remainingLife <= 0) {
        // Once the particle expires, reset it to the origin with a new velocity
        Object.entries(createParticle()).forEach(([k, v]) => {
          (particle as any)[k] = v;
        });
      }

      // Update the particle position
      particle.position[0] += particle.velocity[0] * elapsed;
      particle.position[1] += particle.velocity[1] * elapsed;
      particle.position[2] += particle.velocity[2] * elapsed;

      // Apply gravity to the velocity
      particle.velocity[1] -= 9.8 * elapsed;

      if (particle.position[1] < 0) {
        // Allow particles to bounce off the floor
        particle.velocity[1] *= -0.75;
        particle.position[1] = 0;
      }

      // Update the corresponding values in the array
      const index = i * 4;
      particleArray[index] = particle.position[0];
      particleArray[index + 1] = particle.position[1];
      particleArray[index + 2] = particle.position[2];
      particleArray[index + 3] = particle.remainingLife / particle.lifespan;
    });
  }
};
