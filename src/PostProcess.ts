import { createProgram, Program } from "./webgl";

// Simple implementation for post-processing effects
export class PostProcess {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private texture: WebGLTexture | null;
  private framebuffer: WebGLFramebuffer | null;
  private renderbuffer: WebGLRenderbuffer | null;
  private vertexBuffer: WebGLBuffer | null;
  private textureBuffer: WebGLBuffer | null;
  program!: Program<
    "aVertexPosition" | "aVertexTextureCoords",
    "uSampler" | "uTime" | "uInverseTextureSize" | "uNoiseSampler"
  >;
  private startTime: number;

  constructor(gl: WebGL2RenderingContext, vert: string, frag: string) {
    this.gl = gl;
    this.texture = null;
    this.framebuffer = null;
    this.renderbuffer = null;
    this.vertexBuffer = null;
    this.textureBuffer = null;

    this.startTime = Date.now();
    this.canvas = gl.canvas;

    this.configureFramebuffer();
    this.configureGeometry();
    this.configureShader(vert, frag);
  }

  private configureFramebuffer() {
    const gl = this.gl;
    const { width, height } = this.canvas;

    // Init Color Texture
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
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

    // Init Renderbuffer
    this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height
    );

    // Init Framebuffer
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      this.renderbuffer
    );

    // Clean up
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private configureGeometry() {
    const gl = this.gl;
    // Define the geometry for the full-screen quad
    const vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];

    const textureCoords = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];

    // Init the buffers
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoords),
      gl.STATIC_DRAW
    );

    // Clean up
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
    const gl = this.gl;
    const { width, height } = this.canvas;

    // 1. Resize Color Texture
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
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

    // 2. Resize Render Buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      width,
      height
    );

    // 3. Clean up
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }

  drawToFramebuffer(fn: () => void) {
    const gl = this.gl;

    // Checks to see if the framebuffer needs to be re-sized to match the canvas
    this.validateSize();

    // Render scene to framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    fn();

    // Set up the post-process effect for rendering
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  draw(setup: () => void) {
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
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
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

    setup();

    // Draw using TRIANGLES primitive
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  dispose() {
    this.program.dispose();
    this.gl.deleteTexture(this.texture);
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteRenderbuffer(this.renderbuffer);
    this.gl.deleteBuffer(this.vertexBuffer);
    this.gl.deleteBuffer(this.textureBuffer);
  }
}
