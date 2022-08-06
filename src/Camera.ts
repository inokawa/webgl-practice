import { mat4, ReadonlyVec3, vec3, vec4 } from "gl-matrix";

type CameraType = "ORBITING_TYPE" | "TRACKING_TYPE";

// Abstraction over constructing and interacting with a 3D scene using a camera
export class Camera {
  type: CameraType;
  position: vec3;
  private focus: vec3;
  private home: vec3;
  private up: vec3;
  private right: vec3;
  private normal: vec3;
  matrix: mat4;
  private steps: number;
  azimuth: number;
  elevation: number;
  //   private fov: number;
  //   private minZ: number;
  //   private maxZ: number;

  constructor(type: CameraType = "ORBITING_TYPE") {
    this.type = type;
    this.position = vec3.create();
    this.focus = vec3.create();
    this.home = vec3.create();

    this.up = vec3.create();
    this.right = vec3.create();
    this.normal = vec3.create();

    this.matrix = mat4.create();

    // You could have these options be passed in via the constructor
    // or allow the consumer to change them directly
    this.steps = 0;
    this.azimuth = 0;
    this.elevation = 0;
    // this.fov = 45;
    // this.minZ = 0.1;
    // this.maxZ = 10000;
  }

  // Return whether the camera is in orbiting mode
  get isOrbiting() {
    return this.type === "ORBITING_TYPE";
  }

  // Return whether the camera is in tracking mode
  get isTracking() {
    return this.type === "TRACKING_TYPE";
  }

  // Position the camera back home
  goHome(home?: vec3) {
    if (home) {
      this.home = home;
    }

    this.setPosition(this.home);
    this.setAzimuth(0);
    this.setElevation(0);
  }

  // Dolly the camera
  dolly(stepIncrement: number) {
    const normal = vec3.create();
    const newPosition = vec3.create();
    vec3.normalize(normal, this.normal);

    const step = stepIncrement - this.steps;

    if (this.isTracking) {
      newPosition[0] = this.position[0] - step * normal[0];
      newPosition[1] = this.position[1] - step * normal[1];
      newPosition[2] = this.position[2] - step * normal[2];
    } else {
      newPosition[0] = this.position[0];
      newPosition[1] = this.position[1];
      newPosition[2] = this.position[2] - step;
    }

    this.steps = stepIncrement;
    this.setPosition(newPosition);
  }

  // Change camera position
  setPosition(position: vec3) {
    vec3.copy(this.position, position);
    this.update();
  }

  // Change camera focus
  setFocus(focus: vec3) {
    vec3.copy(this.focus, focus);
    this.update();
  }

  // Set camera azimuth
  setAzimuth(azimuth: number) {
    this.changeAzimuth(azimuth - this.azimuth);
  }

  // Change camera azimuth
  changeAzimuth(azimuth: number) {
    this.azimuth += azimuth;

    if (this.azimuth > 360 || this.azimuth < -360) {
      this.azimuth = this.azimuth % 360;
    }

    this.update();
  }

  // Set camera elevation
  setElevation(elevation: number) {
    this.changeElevation(elevation - this.elevation);
  }

  // Change camera elevation
  changeElevation(elevation: number) {
    this.elevation += elevation;

    if (this.elevation > 360 || this.elevation < -360) {
      this.elevation = this.elevation % 360;
    }

    this.update();
  }

  // Update the camera orientation
  private calculateOrientation() {
    const right = vec4.create();
    vec4.set(right, 1, 0, 0, 0);
    vec4.transformMat4(right, right, this.matrix);
    vec3.copy(this.right, right as ReadonlyVec3);

    const up = vec4.create();
    vec4.set(up, 0, 1, 0, 0);
    vec4.transformMat4(up, up, this.matrix);
    vec3.copy(this.up, up as ReadonlyVec3);

    const normal = vec4.create();
    vec4.set(normal, 0, 0, 1, 0);
    vec4.transformMat4(normal, normal, this.matrix);
    vec3.copy(this.normal, normal as ReadonlyVec3);
  }

  // Update camera values
  update() {
    mat4.identity(this.matrix);

    if (this.isTracking) {
      mat4.translate(this.matrix, this.matrix, this.position);
      mat4.rotateY(this.matrix, this.matrix, (this.azimuth * Math.PI) / 180);
      mat4.rotateX(this.matrix, this.matrix, (this.elevation * Math.PI) / 180);
    } else {
      mat4.rotateY(this.matrix, this.matrix, (this.azimuth * Math.PI) / 180);
      mat4.rotateX(this.matrix, this.matrix, (this.elevation * Math.PI) / 180);
      mat4.translate(this.matrix, this.matrix, this.position);
    }

    // We only update the position if we have a tracking camera.
    // For an orbiting camera we do not update the position. If
    // Why do you think we do not update the position?
    if (this.isTracking) {
      const position = vec4.create();
      vec4.set(position, 0, 0, 0, 1);
      vec4.transformMat4(position, position, this.matrix);
      vec3.copy(this.position, position as ReadonlyVec3);
    }

    this.calculateOrientation();
  }

  // Returns the view transform
  getViewTransform() {
    const matrix = mat4.create();
    mat4.invert(matrix, this.matrix);
    return matrix;
  }
}
