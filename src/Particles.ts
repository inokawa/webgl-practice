type Particle = {
  position: [number, number, number];
  velocity: [number, number, number];
  lifespan: number;
  remainingLife: number;
};

export class Particles {
  private gl: WebGL2RenderingContext;
  private buffer: WebGLBuffer;
  private lifespan: number;
  private particles: Particle[];
  private positionArray: Float32Array;

  constructor(gl: WebGL2RenderingContext, count: number, lifespan: number) {
    this.gl = gl;
    this.buffer = gl.createBuffer()!;
    this.lifespan = lifespan;
    this.particles = [];
    this.positionArray = new Float32Array(count * 4);

    for (let i = 0; i < count; ++i) {
      const particle = createParticle(lifespan);
      this.particles.push(particle);

      const index = i * 4;
      this.positionArray[index] = particle.position[0];
      this.positionArray[index + 1] = particle.position[1];
      this.positionArray[index + 2] = particle.position[2];
      this.positionArray[index + 3] =
        particle.remainingLife / particle.lifespan;
    }

    this.updateBuffer();
  }

  use(fn: (count: number) => void) {
    const { gl, buffer, particles } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    fn(particles.length);

    // Clean
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  private updateBuffer() {
    const { gl, buffer, positionArray } = this;
    // Once we are done looping through all the particles, update the buffer once
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  updateParticles(elapsed: number) {
    // Loop through all the particles in the array
    this.particles.forEach((particle, i) => {
      // Track the particles lifespan
      particle.remainingLife -= elapsed;

      if (particle.remainingLife <= 0) {
        // Once the particle expires, reset it to the origin with a new velocity
        Object.entries(createParticle(this.lifespan)).forEach(([k, v]) => {
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
      this.positionArray[index] = particle.position[0];
      this.positionArray[index + 1] = particle.position[1];
      this.positionArray[index + 2] = particle.position[2];
      this.positionArray[index + 3] =
        particle.remainingLife / particle.lifespan;
    });

    this.updateBuffer();
  }

  updateLifespan(lifespan: number) {
    this.lifespan = lifespan;
  }

  dispose() {
    this.gl.deleteBuffer(this.buffer);
  }
}

function createParticle(lifespan: number): Particle {
  const life = Math.random() * lifespan;
  return {
    position: [0, 0, 0],
    velocity: [
      Math.random() * 20 - 10,
      Math.random() * 20,
      Math.random() * 20 - 10,
    ],
    lifespan: life,
    remainingLife: life,
  };
}
