type IndexBuffer = {
  data: WebGLBuffer;
  count: number;
};

type Program = {
  data: WebGLProgram;
  aVertexPosition: number;
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
  };
};

const initBuffers = (
  gl: WebGL2RenderingContext
): [WebGLBuffer, IndexBuffer] => {
  /*
        V0                    V3
        (-0.5, 0.5, 0)        (0.5, 0.5, 0)
        X---------------------X
        |                     |
        |                     |
        |       (0, 0)        |
        |                     |
        |                     |
        X---------------------X
        V1                    V2
        (-0.5, -0.5, 0)       (0.5, -0.5, 0)
      */
  const vertices = [-0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0];

  // Indices defined in counter-clockwise order
  const indices = [0, 1, 2, 0, 2, 3];

  const squareVertexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const squareIndexBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return [
    squareVertexBuffer,
    { data: squareIndexBuffer, count: indices.length },
  ];
};

const draw = (
  gl: WebGL2RenderingContext,
  program: Program,
  vertexBuffer: WebGLBuffer,
  indexBuffer: IndexBuffer
) => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(program.data);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.aVertexPosition);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.data);

  gl.drawElements(gl.TRIANGLES, indexBuffer.count, gl.UNSIGNED_SHORT, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

export const init = (
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string
) => {
  gl.clearColor(0, 0, 0, 1);
  const program = initProgram(gl, vert, frag);
  const [vertexBuffer, indexBuffer] = initBuffers(gl);
  draw(gl, program, vertexBuffer, indexBuffer);
};
