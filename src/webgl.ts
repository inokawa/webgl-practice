export type Vec2 = number[] | Float32Array;
export type Vec3 = number[] | Float32Array;
export type Vec4 = number[] | Float32Array;
export type BVec2 = number[] | Float32Array;
export type BVec3 = number[] | Float32Array;
export type BVec4 = number[] | Float32Array;
export type Mat2 = number[] | Float32Array;
export type Mat3 = number[] | Float32Array;
export type Mat4 = number[] | Float32Array;
export type GLSLTypeMap = {
  int: number;
  float: number;
  bool: boolean;
  vec2: Vec2;
  vec3: Vec3;
  vec4: Vec4;
  bvec2: BVec2;
  bvec3: BVec3;
  bvec4: BVec4;
  ivec2: Vec2;
  ivec3: Vec3;
  ivec4: Vec4;
  mat2: Mat2;
  mat3: Mat3;
  mat4: Mat4;
  sampler2D: number;
  samplerCube: number;
};

type DataType = keyof GLSLTypeMap;

export type RenderingMode =
  | "TRIANGLES"
  | "LINES"
  | "POINTS"
  | "LINE_LOOP"
  | "LINE_STRIP"
  | "TRIANGLE_STRIP"
  | "TRIANGLE_FAN";

export type Vao = {
  vao: WebGLVertexArrayObject;
  // vertices: WebGLBuffer;
  // indices: IndexBuffer;
  use: (fn: (count?: number) => void) => void;
  dispose: () => void;
};

// type IndexBuffer = {
//   data: WebGLBuffer;
//   count: number;
// };

export type Program<A extends string = string, U extends string = string> = {
  data: WebGLProgram;
  uniforms: { [key in U]: WebGLUniformLocation };
  attributes: { [key in A]: number };
  use: () => void;
  dispose: () => void;
  getUniform: (name: U) => any;
  setUniform: <T extends DataType>(
    name: U,
    type: T,
    value: GLSLTypeMap[T]
  ) => void;
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

export const createProgram = <A extends string, U extends string>(
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string,
  attributes: A[],
  uniforms: U[]
): Program<A, U> => {
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

  let attributesMap: { [key in A]: number };
  if (attributes.length) {
    attributesMap = attributes.reduce((acc, k) => {
      acc[k] = gl.getAttribLocation(program, k);
      return acc;
    }, {} as { [key in A]: number });
  } else {
    const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    const temp = {} as { [key in A]: number };
    for (let i = 0; i < count; i++) {
      const attrib = gl.getActiveAttrib(program, i)!;
      temp[attrib.name as A] = gl.getAttribLocation(program, attrib.name)!;
    }
    attributesMap = temp;
  }

  let uniformsMap: { [key in U]: WebGLUniformLocation };
  if (uniforms.length) {
    uniformsMap = uniforms.reduce((acc, k) => {
      acc[k] = gl.getUniformLocation(program, k)!;
      return acc;
    }, {} as { [key in U]: WebGLUniformLocation });
  } else {
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    const temp = {} as { [key in U]: WebGLUniformLocation };
    for (let i = 0; i < count; i++) {
      const uniform = gl.getActiveUniform(program, i)!;
      temp[uniform.name as U] = gl.getUniformLocation(program, uniform.name)!;
    }
    uniformsMap = temp;
  }

  const self: Program<A, U> = {
    data: program,
    attributes: attributesMap,
    uniforms: uniformsMap,
    use: () => {
      gl.useProgram(program);
    },
    dispose: () => {
      gl.deleteProgram(program);
      Object.values(attributesMap).forEach((v) => {
        gl.disableVertexAttribArray(v as number);
      });
    },
    getUniform: (name) => {
      return gl.getUniform(program, self.uniforms[name]);
    },
    setUniform: (name, type, value) => {
      switch (type) {
        case "float":
          gl.uniform1f(self.uniforms[name], value as any);
          break;
        case "int":
          gl.uniform1i(self.uniforms[name], value as any);
          break;
        case "bool":
          gl.uniform1f(self.uniforms[name], value as any);
          break;
        case "vec2":
          gl.uniform2fv(self.uniforms[name], value as any);
          break;
        case "ivec2":
          gl.uniform2iv(self.uniforms[name], value as any);
          break;
        case "bvec2":
          gl.uniform2fv(self.uniforms[name], value as any);
          break;
        case "vec3":
          gl.uniform3fv(self.uniforms[name], value as any);
          break;
        case "ivec3":
          gl.uniform3iv(self.uniforms[name], value as any);
          break;
        case "bvec3":
          gl.uniform3fv(self.uniforms[name], value as any);
          break;
        case "vec4":
          gl.uniform4fv(self.uniforms[name], value as any);
          break;
        case "ivec4":
          gl.uniform4iv(self.uniforms[name], value as any);
          break;
        case "bvec4":
          gl.uniform4fv(self.uniforms[name], value as any);
          break;
        case "mat2":
          gl.uniformMatrix2fv(self.uniforms[name], false, value as any);
          break;
        case "mat3":
          gl.uniformMatrix3fv(self.uniforms[name], false, value as any);
          break;
        case "mat4":
          gl.uniformMatrix4fv(self.uniforms[name], false, value as any);
          break;
        case "sampler2D":
          gl.uniform1i(self.uniforms[name], value as any);
          break;
        case "samplerCube":
          gl.uniform1i(self.uniforms[name], value as any);
          break;
        default:
          break;
      }
    },
  };
  return self;
};

export type Vertex<A extends string> = {
  name: A;
  data: number[];
  size: number;
};

export const createVertexArray = <A extends string, U extends string>(
  gl: WebGL2RenderingContext,
  program: Program<A, U>,
  vertices: Vertex<A>[],
  indices?: number[]
): Vao => {
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const vertexBuffers: WebGLBuffer[] = [];
  vertices.forEach(({ name, data, size }) => {
    const vertexBuffer = gl.createBuffer()!;
    vertexBuffers.push(vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.vertexAttribPointer(
      program.attributes[name],
      size,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(program.attributes[name]);
  });

  let indexBuffer: WebGLBuffer | null = null;
  if (indices) {
    indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );
  }

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  if (indices) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  const self: Vao = {
    vao: vao,
    // vertices: vertexBuffer,
    // indices: { data: indexBuffer, count: indices.length },
    use: (fn) => {
      gl.bindVertexArray(self.vao);
      fn(indices ? indices.length : undefined);
      gl.bindVertexArray(null);
    },
    dispose: () => {
      gl.deleteVertexArray(self.vao);
      vertexBuffers.forEach((vertexBuffer) => {
        gl.deleteBuffer(vertexBuffer);
      });
      gl.deleteBuffer(indexBuffer);
    },
  };
  return self;
};

export const draw = (
  gl: WebGL2RenderingContext,
  vao: Vao,
  mode: RenderingMode
) => {
  vao.use((count) => {
    if (count != null) {
      gl.drawElements(gl[mode], count, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(gl[mode], gl.UNSIGNED_SHORT, 0);
    }
  });
};

export type Texture = {
  use: (fn: () => void) => void;
  set: (newUrl: string) => void;
  bind: (i: 0 | 1 | 2) => void;
  dispose: () => void;
};

export const loadTexture = (
  gl: WebGL2RenderingContext,
  url: string
): Texture => {
  const texture = gl.createTexture();
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_NEAREST
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  image.src = url;

  return {
    use(fn) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      fn();
      gl.bindTexture(gl.TEXTURE_2D, null);
    },
    set(newUrl) {
      image.src = newUrl;
    },
    bind(i) {
      gl.activeTexture(gl[`TEXTURE${i}`]);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    },
    dispose() {
      gl.deleteTexture(texture);
    },
  };
};

export type FrameBuffer = {
  buffer: WebGLFramebuffer;
  texture: WebGLTexture;
  use: (fn: () => void) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

export const createFramebuffer = (
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  texture: WebGLTexture
): FrameBuffer => {
  // Init Renderbuffer
  const renderbuffer = gl.createRenderbuffer()!;
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

  // Init Framebuffer
  const framebuffer = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    renderbuffer
  );

  // Clean up
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return {
    buffer: framebuffer,
    texture,
    use: (fn: () => void) => {
      // Render scene to framebuffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      fn();
      // Set up the post-process effect for rendering
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    resize: (width, height) => {
      // 1. Resize Color Texture
      gl.bindTexture(gl.TEXTURE_2D, texture);
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
      gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        width,
        height
      );

      // 3. Clean up
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    },
    dispose: () => {
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      gl.deleteRenderbuffer(renderbuffer);
    },
  };
};
