import { mat4 } from "gl-matrix";
import type { Camera } from "./Camera";
import type { Program } from "./webgl";

// Encapsulates common transformations in a 3D scene
export class Transforms {
  private program: Program<
    string,
    "uModelViewMatrix" | "uProjectionMatrix" | "uNormalMatrix"
  >;
  private camera: Camera;
  private canvas: HTMLCanvasElement;
  private stack: mat4[];
  modelViewMatrix: mat4;
  projectionMatrix: mat4;
  normalMatrix: mat4;

  constructor(
    program: Program<
      string,
      "uModelViewMatrix" | "uProjectionMatrix" | "uNormalMatrix"
    >,
    camera: Camera,
    canvas: HTMLCanvasElement
  ) {
    this.stack = [];

    this.program = program;
    this.camera = camera;
    this.canvas = canvas;

    this.modelViewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.normalMatrix = mat4.create();

    this.calculateModelView();
    this.updatePerspective();
    this.calculateNormal();
  }

  // Calculates the Model-View matrix
  calculateModelView() {
    this.modelViewMatrix = this.camera.getViewTransform();
  }

  // Calculates the Normal matrix
  calculateNormal() {
    mat4.copy(this.normalMatrix, this.modelViewMatrix);
    mat4.invert(this.normalMatrix, this.normalMatrix);
    mat4.transpose(this.normalMatrix, this.normalMatrix);
  }

  // Updates perspective
  updatePerspective() {
    mat4.perspective(
      this.projectionMatrix,
      this.camera.fov,
      this.canvas.width / this.canvas.height,
      this.camera.minZ,
      this.camera.maxZ
    );
  }

  // Sets all matrix uniforms
  setMatrixUniforms() {
    this.calculateNormal();
    this.program.setUniform("uModelViewMatrix", "mat4", this.modelViewMatrix);
    this.program.setUniform("uProjectionMatrix", "mat4", this.projectionMatrix);
    this.program.setUniform("uNormalMatrix", "mat4", this.normalMatrix);
  }

  // Pushes matrix onto the stack
  push() {
    const matrix = mat4.create();
    mat4.copy(matrix, this.modelViewMatrix);
    this.stack.push(matrix);
  }

  // Pops and returns matrix off the stack
  pop() {
    return this.stack.length
      ? (this.modelViewMatrix = this.stack.pop()!)
      : null;
  }
}
