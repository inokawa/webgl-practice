import type { GLObject, Scene } from "./Scene";
import { createFramebuffer, FrameBuffer } from "./webgl";

type Callbacks = Readonly<{
  hitProperty?: (o: GLObject) => [number, number, number];
  addHit?: (o: GLObject) => void;
  removeHit?: (o: GLObject) => void;
  processHits?: (list: GLObject[]) => void;
  move?: (dx: number, dy: number, alt: boolean) => void;
}>;

// Simple implementation of mouse picking on a HTML5 canvas
export class Picker {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private scene: Scene<any, any>;
  private framebuffer: FrameBuffer;
  private pickedList: GLObject[];
  callbacks: Callbacks;
  picking = false;

  constructor(
    gl: WebGL2RenderingContext,
    scene: Scene<any, any>,
    callbacks: Callbacks
  ) {
    this.gl = gl;
    this.canvas = gl.canvas;
    this.scene = scene;
    this.pickedList = [];

    this.callbacks = callbacks;

    const { width, height } = this.canvas;

    const texture = gl.createTexture()!;
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

    this.framebuffer = createFramebuffer(gl, width, height, texture);
  }

  drawToFramebuffer(fn: () => void) {
    this.framebuffer.use(fn);
  }

  getHits() {
    return this.pickedList;
  }

  update() {
    const { width, height } = this.canvas;

    this.framebuffer.resize(width, height);
  }

  // Compare whether the pixel matches the readout
  private compare(
    readout: Uint8Array,
    color: [number, number, number]
  ): boolean {
    return (
      Math.abs(Math.round(color[0] * 255) - readout[0]) <= 1 &&
      Math.abs(Math.round(color[1] * 255) - readout[1]) <= 1 &&
      Math.abs(Math.round(color[2] * 255) - readout[2]) <= 1
    );
  }

  find(coords: { x: number; y: number }) {
    const gl = this.gl;
    const readout = new Uint8Array(4);
    this.framebuffer.use(() => {
      gl.readPixels(
        coords.x,
        coords.y,
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        readout
      );
    });
    let found = false;

    this.scene.traverse((obj) => {
      if (obj.alias === "floor") return false;

      const property = this.callbacks.hitProperty?.(obj);
      if (!property) return true;

      if (this.compare(readout, property)) {
        const idx = this.pickedList.indexOf(obj);
        if (~idx) {
          this.pickedList.splice(idx, 1);
          this.callbacks.removeHit?.(obj);
        } else {
          this.pickedList.push(obj);
          this.callbacks.addHit?.(obj);
        }
        return (found = true);
      }
      return false;
    });
    return found;
  }

  stop() {
    if (this.pickedList.length) {
      this.callbacks.processHits?.(this.pickedList);
    }
    this.pickedList = [];
  }

  dispose() {
    this.framebuffer.dispose();
  }
}
