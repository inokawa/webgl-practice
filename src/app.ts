import * as utils from "./utils";

let renderingMode = "TRIANGLES";

type Vao = {
  vao: WebGLVertexArrayObject;
  vertices: WebGLBuffer;
  indices: IndexBuffer;
  use: (fn: (count: number) => void) => void;
  dispose: () => void;
};

type IndexBuffer = {
  data: WebGLBuffer;
  count: number;
};

type Program = {
  data: WebGLProgram;
  aVertexPosition: number;
  use: () => void;
  dispose: () => void;
};

const createShader = (
  gl: WebGL2RenderingContext,
  shaderString: string,
  type: "VERTEX_SHADER" | "FRAGMENT_SHADER"
) => {
  const shader = gl.createShader(gl[type])!;

  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
};

const initProgram = (
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string
): Program => {
  const program = gl.createProgram()!;
  const vertShader = createShader(gl, vert, "VERTEX_SHADER")!;
  const fragShader = createShader(gl, frag, "FRAGMENT_SHADER")!;
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Could not initialize shaders");
  }
  gl.deleteShader(vertShader);
  gl.deleteShader(fragShader);

  return {
    data: program,
    aVertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
    use: () => {
      gl.useProgram(program);
    },
    dispose: () => {
      gl.deleteProgram(program);
    },
  };
};

const initBuffers = (
  gl: WebGL2RenderingContext,
  program: Program,
  vertices: number[],
  indices: number[]
): Vao => {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const vertexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.aVertexPosition);

  const indexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  const self: Vao = {
    vao: vao,
    vertices: vertexBuffer,
    indices: { data: indexBuffer, count: indices.length },
    use: (fn) => {
      gl.bindVertexArray(self.vao);
      fn(self.indices.count);
      gl.bindVertexArray(null);
    },
    dispose: () => {
      gl.deleteVertexArray(self.vao);
      gl.deleteBuffer(self.vertices);
      gl.deleteBuffer(self.indices.data);
    },
  };
  return self;
};

const draw = (gl: WebGL2RenderingContext, program: Program, vao: Vao) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  program.use();

  vao.use(() => {
    switch (renderingMode) {
      case "TRIANGLES": {
        const indices = [0, 1, 2, 2, 3, 4];
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
      case "LINES": {
        const indices = [1, 3, 0, 4, 1, 2, 2, 3];
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
      case "POINTS": {
        const indices = [1, 2, 3];
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        gl.drawElements(gl.POINTS, indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
      case "LINE_LOOP": {
        const indices = [2, 3, 4, 1, 0];
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
      case "LINE_STRIP": {
        const indices = [2, 3, 4, 1, 0];
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
      case "TRIANGLE_STRIP": {
        const indices = [0, 1, 2, 3, 4];
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        gl.drawElements(
          gl.TRIANGLE_STRIP,
          indices.length,
          gl.UNSIGNED_SHORT,
          0
        );
        break;
      }
      case "TRIANGLE_FAN": {
        const indices = [0, 1, 2, 3, 4];
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        );
        gl.drawElements(gl.TRIANGLE_FAN, indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
    }
  });
};

export const init = (
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string
) => {
  gl.clearColor(0, 0, 0, 1);
  const program = initProgram(gl, vert, frag);

  const vertices = [
    -0.5, -0.5, 0, -0.25, 0.5, 0, 0.0, -0.5, 0, 0.25, 0.5, 0, 0.5, -0.5, 0,
  ];
  const indices = [0, 1, 2, 0, 2, 3, 2, 3, 4];
  const vao = initBuffers(gl, program, vertices, indices);

  (function render() {
    requestAnimationFrame(render);
    draw(gl, program, vao);
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
