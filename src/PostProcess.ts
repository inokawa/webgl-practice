import {
  createFramebuffer,
  createProgram,
  FrameBuffer,
  Program,
} from "./webgl";

// Simple implementation for post-processing effects
export class PostProcess {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private framebuffer: FrameBuffer;
  private vertexBuffer: WebGLBuffer;
  private textureBuffer: WebGLBuffer;
  program!: Program<
    "aVertexPosition" | "aVertexTextureCoords",
    "uSampler" | "uTime" | "uInverseTextureSize" | "uNoiseSampler"
  >;
  private startTime: number;

  constructor(gl: WebGL2RenderingContext, vert: string, frag: string) {
    this.gl = gl;
    this.canvas = gl.canvas;

    const width = this.canvas.width;
    const height = this.canvas.height;

    // Init Color Texture
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    const framebuffer = createFramebuffer(gl, width, height, texture);
    const [vertexBuffer, textureBuffer] = createGeometry(gl);

    this.framebuffer = framebuffer;
    this.vertexBuffer = vertexBuffer;
    this.textureBuffer = textureBuffer;

    this.startTime = Date.now();

    this.configureShader(vert, frag);
  }

  configureShader(vert: string, frag: string) {
    const gl = this.gl;

    if (this.program) {
      this.program.dispose();
    }
    this.program = createProgram<
      "aVertexPosition" | "aVertexTextureCoords",
      "uSampler" | "uTime" | "uInverseTextureSize" | "uNoiseSampler"
    >(gl, vert, frag, [], []);
  }

  private validateSize() {
    const { width, height } = this.canvas;

    this.framebuffer.resize(width, height);
  }

  drawToFramebuffer(fn: () => void) {
    // Checks to see if the framebuffer needs to be re-sized to match the canvas
    this.validateSize();

    this.framebuffer.use(fn);
  }

  draw(setup?: () => void) {
    const gl = this.gl;
    const { width, height } = this.canvas;

    this.program.use();

    // Bind the quad geometry
    gl.enableVertexAttribArray(this.program.attributes.aVertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(
      this.program.attributes.aVertexPosition,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    gl.enableVertexAttribArray(this.program.attributes.aVertexTextureCoords);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.vertexAttribPointer(
      this.program.attributes.aVertexTextureCoords,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    // Bind the texture from the framebuffer
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffer.texture);
    this.program.setUniform("uSampler", "sampler2D", 0);

    // If the post process shader uses time as an input, pass it in here
    if (this.program.uniforms.uTime) {
      this.program.setUniform(
        "uTime",
        "float",
        (Date.now() - this.startTime) / 1000
      );
    }

    // The inverse texture size can be useful for effects which require precise pixel lookup
    if (this.program.uniforms.uInverseTextureSize) {
      this.program.setUniform("uInverseTextureSize", "vec2", [
        1 / width,
        1 / height,
      ]);
    }

    setup?.();

    // Draw using TRIANGLES primitive
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  dispose() {
    this.program.dispose();
    this.framebuffer.dispose();
    this.gl.deleteBuffer(this.vertexBuffer);
    this.gl.deleteBuffer(this.textureBuffer);
  }
}

const createGeometry = (
  gl: WebGL2RenderingContext
): [WebGLBuffer, WebGLBuffer] => {
  // Define the geometry for the full-screen quad
  const vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];

  const textureCoords = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];

  // Init the buffers
  const vertexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const textureBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoords),
    gl.STATIC_DRAW
  );

  // Clean up
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return [vertexBuffer, textureBuffer];
};
