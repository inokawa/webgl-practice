import type { Camera } from "./Camera";
import type { Picker } from "./Picker";

// Abstraction over common controls for user interaction with a 3D scene
export class Controls {
  private camera: Camera;
  private canvas: HTMLCanvasElement;
  private picker: Picker | null;

  private dragging = false;
  private ctrl = false;
  private alt = false;

  private x = 0;
  private y = 0;
  private lastX = 0;
  private lastY = 0;
  private button = 0;
  private dloc = 0;
  private dstep = 0;
  private motionFactor = 10;
  private keyIncrement = 5;

  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    this.picker = null;

    canvas.onmousedown = (event) => this.onMouseDown(event);
    canvas.onmouseup = (event) => this.onMouseUp(event);
    canvas.onmousemove = (event) => this.onMouseMove(event);
    window.onkeydown = (event) => this.onKeyDown(event);
    window.onkeyup = (event) => this.onKeyUp(event);
    window.onwheel = (event) => this.onWheel(event);
  }

  // Sets picker for picking objects
  setPicker(picker: Picker) {
    this.picker = picker;
  }

  // Returns 3D coordinates
  get2DCoords(event: MouseEvent) {
    let top = 0,
      left = 0,
      canvas: HTMLElement | null = this.canvas;

    while (canvas && canvas.tagName !== "BODY") {
      top += canvas.offsetTop;
      left += canvas.offsetLeft;
      canvas = canvas.offsetParent as HTMLElement | null;
    }

    left += window.pageXOffset;
    top -= window.pageYOffset;

    return {
      x: event.clientX - left,
      y: this.canvas.height - (event.clientY - top),
    };
  }

  private onMouseUp(event: MouseEvent) {
    this.dragging = false;

    if (!this.picker) return;
    if (!event.shiftKey) {
      this.picker.picking = false;
      this.picker.stop();
    }
  }

  private onMouseDown(event: MouseEvent) {
    this.dragging = true;

    this.x = event.clientX;
    this.y = event.clientY;
    this.button = event.button;

    this.dstep =
      Math.max(
        this.camera.position[0],
        this.camera.position[1],
        this.camera.position[2]
      ) / 100;

    if (!this.picker) return;
    const coordinates = this.get2DCoords(event);
    this.picker.picking = !!this.picker.find(coordinates);

    if (!this.picker.picking) this.picker.stop();
  }

  private onMouseMove(event: MouseEvent) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.x = event.clientX;
    this.y = event.clientY;

    if (!this.dragging) return;

    this.ctrl = event.ctrlKey;
    this.alt = event.altKey;

    const dx = this.x - this.lastX;
    const dy = this.y - this.lastY;

    if (this.picker && this.picker.picking) {
      this.picker.callbacks.move?.(dx, dy, this.alt);
      return;
    }

    if (!this.button) {
      this.alt ? this.dolly(dy) : this.rotate(dx, dy);
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    this.ctrl = event.ctrlKey;
    if (this.ctrl) return;

    switch (event.key) {
      case "ArrowLeft":
        return this.camera.changeAzimuth(-this.keyIncrement);
      case "ArrowUp":
        return this.camera.changeElevation(this.keyIncrement);
      case "ArrowRight":
        return this.camera.changeAzimuth(this.keyIncrement);
      case "ArrowDown":
        return this.camera.changeElevation(-this.keyIncrement);
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    this.ctrl = event.ctrlKey;
  }

  private onWheel(event: WheelEvent) {
    this.camera.changeZoom(event.deltaY);
  }

  dolly(value: number) {
    if (value > 0) {
      this.dloc += this.dstep;
    } else {
      this.dloc -= this.dstep;
    }

    this.camera.dolly(this.dloc);
  }

  rotate(dx: number, dy: number) {
    const { width, height } = this.canvas;

    const deltaAzimuth = -20 / width;
    const deltaElevation = -20 / height;

    const azimuth = dx * deltaAzimuth * this.motionFactor;
    const elevation = dy * deltaElevation * this.motionFactor;

    this.camera.changeAzimuth(azimuth);
    this.camera.changeElevation(elevation);
  }
}
