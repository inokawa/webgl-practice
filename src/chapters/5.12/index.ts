import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { Scene } from "../../Scene";
import { Floor } from "../../Floor";
import { configureControls, loadJSON } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";
import { Axis } from "../../Axis";
import { mat4 } from "gl-matrix";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexNormal", "aVertexColor"],
    [
      "uProjectionMatrix",
      "uModelViewMatrix",
      "uNormalMatrix",
      "uMaterialDiffuse",
      "uMaterialAmbient",
      "uMaterialSpecular",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightSpecular",
      "uLightPosition",
      "uShininess",
      "uUpdateLight",
      "uWireframe",
    ]
  );

  let fixedLight = false;

  const linearInterpolation = "Linear Interpolation",
    polynomialInterpolation = "Polynomial Interpolation",
    bSplineInterpolation = "B-Spline Interpolation";
  let interpolationType = linearInterpolation;
  let controlPoints: [number, number, number][] = [
    [-25, 0, 20],
    [-40, 0, -10],
    [0, 0, 10],
    [25, 0, -5],
    [40, 0, -20],
  ];
  let incrementSteps = 1000;

  const scene = new Scene(gl, program);

  const ballColor = [1, 1, 0, 1],
    flagStartColor = [0, 1, 0, 1],
    flagEndColor = [0, 0, 1, 1],
    flagColor = [0.5, 0.5, 0.5, 1],
    flagColorHighlight = [1, 0, 0, 1];
  const zDimension = 150;
  scene.add(new Floor(zDimension, 2));
  scene.add(new Axis(zDimension));
  scene.add(
    { ...(await loadJSON("/models/ball.json")), diffuse: ballColor },
    "ball"
  );
  scene.add(
    { ...(await loadJSON("/models/flag.json")), diffuse: flagStartColor },
    "flagStart"
  );
  scene.add(
    { ...(await loadJSON("/models/flag.json")), diffuse: flagEndColor },
    "flagEnd"
  );
  scene.add(
    { ...(await loadJSON("/models/flag.json")), diffuse: flagColor },
    "flag1"
  );
  scene.add(
    { ...(await loadJSON("/models/flag.json")), diffuse: flagColor },
    "flag2"
  );
  scene.add(
    { ...(await loadJSON("/models/flag.json")), diffuse: flagColor },
    "flag3"
  );

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 2, 80]);
  camera.setElevation(-20);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 120, 120]);
  program.setUniform("uLightAmbient", "vec4", [0.2, 0.2, 0.2, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightSpecular", "vec4", [1, 1, 1, 1]);
  program.setUniform("uShininess", "float", 230);

  let position = doLinearInterpolation();

  function resetAnimation() {
    sceneTime = 0;
    position.length = 0;
  }
  function interpolate() {
    const interpolate = {
      [linearInterpolation]: doLinearInterpolation,
      [polynomialInterpolation]: doLagrangeInterpolation,
      [bSplineInterpolation]: doBSplineInterpolation,
    }[interpolationType];
    position = interpolate!();
  }
  const disposeGui = configureControls({
    "Camera Type": {
      value: camera.type,
      options: ["ORBITING_TYPE", "TRACKING_TYPE"],
      onChange: (v) => {
        camera.goHome();
        camera.type = v;
      },
    },
    Points: [0, 1, 2, 3, 4].reduce((result: any, i) => {
      result[`Point ${i + 1}`] = {
        value: controlPoints[i][0],
        min: -70,
        max: 70,
        step: 1,
        onChange: (v: any) => {
          controlPoints[i][0] = v;
          interpolate();
        },
      };
      return result;
    }, {}),
    Interpolation: {
      value: interpolationType,
      options: [
        linearInterpolation,
        polynomialInterpolation,
        bSplineInterpolation,
      ],
      onChange: (v: any) => {
        resetAnimation();
        interpolationType = v;
        if (interpolationType === linearInterpolation) {
          controlPoints = [
            [-25, 0, 20],
            [-40, 0, -10],
            [0, 0, 10],
            [25, 0, -5],
            [40, 0, -20],
          ];
          incrementSteps = 1000;
        } else if (interpolationType === polynomialInterpolation) {
          controlPoints = [
            [21, 0, 23],
            [-3, 0, -10],
            [-21, 0, -53],
            [50, 0, -31],
            [-24, 0, 2],
          ];
          incrementSteps = 1355;
        } else if (interpolationType === bSplineInterpolation) {
          controlPoints = [
            [-21, 0, 23],
            [32, 0, -10],
            [0, 0, -53],
            [-32, 0, -10],
            [21, 0, 23],
          ];
          incrementSteps = 1000;
        }
        interpolate();
      },
    },
    "Interpolation Steps": {
      value: incrementSteps,
      min: 10,
      max: 1500,
      step: 1,
      onChange: (v) => {
        incrementSteps = v;
        interpolate();
      },
    },
    "Static Light Position": {
      value: fixedLight,
      onChange: (v) => (fixedLight = v),
    },
    "Go Home": () => camera.goHome(),
  });

  let sceneTime = 0;

  scene.start((objects) => {
    sceneTime += 1;
    if (sceneTime === incrementSteps) sceneTime = 0;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();
    try {
      program.setUniform("uUpdateLight", "bool", fixedLight);

      objects.forEach((object) => {
        transforms.calculateModelView();
        transforms.setMatrixUniforms();

        const { alias } = object;
        if (alias === "ball" && position[sceneTime]) {
          mat4.translate(
            transforms.modelViewMatrix,
            transforms.modelViewMatrix,
            position[sceneTime]
          );
        } else if (alias === "flagStart") {
          mat4.translate(
            transforms.modelViewMatrix,
            transforms.modelViewMatrix,
            controlPoints[0]
          );
        } else if (alias === "flagEnd") {
          mat4.translate(
            transforms.modelViewMatrix,
            transforms.modelViewMatrix,
            controlPoints[4]
          );
        } else if (alias === "flag1") {
          if (interpolationType !== linearInterpolation) {
            mat4.translate(
              transforms.modelViewMatrix,
              transforms.modelViewMatrix,
              controlPoints[1]
            );
            object.diffuse = close(controlPoints[1], position[sceneTime], 3)
              ? flagColorHighlight
              : flagColor;
          } else {
            transforms.pop();
            return;
          }
        } else if (alias === "flag2") {
          if (interpolationType !== linearInterpolation) {
            mat4.translate(
              transforms.modelViewMatrix,
              transforms.modelViewMatrix,
              controlPoints[2]
            );
            object.diffuse = close(controlPoints[2], position[sceneTime], 3)
              ? flagColorHighlight
              : flagColor;
          } else {
            transforms.pop();
            return;
          }
        } else if (alias === "flag3") {
          if (interpolationType !== linearInterpolation) {
            mat4.translate(
              transforms.modelViewMatrix,
              transforms.modelViewMatrix,
              controlPoints[3]
            );
            object.diffuse = close(controlPoints[3], position[sceneTime], 3)
              ? flagColorHighlight
              : flagColor;
          } else {
            transforms.pop();
            return;
          }
        }

        transforms.setMatrixUniforms();
        transforms.pop();

        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
        program.setUniform("uMaterialSpecular", "vec4", object.specular);
        program.setUniform("uMaterialAmbient", "vec4", object.ambient);
        program.setUniform("uWireframe", "bool", object.wireframe);

        draw(gl, object.vao, object.wireframe ? "LINES" : "TRIANGLES");
      });
    } catch (error) {
      console.error(error);
    }
  });

  return () => {
    scene.dispose();
    disposeGui();
  };

  function doLinearInterpolation(): [number, number, number][] {
    const position: [number, number, number][] = [];
    const [X0, Y0, Z0] = controlPoints[0];
    const [X1, Y1, Z1] = controlPoints[controlPoints.length - 1];

    for (let i = 0; i < incrementSteps; i++) {
      const s = i / incrementSteps;
      position.push([
        X0 * (1 - s) + X1 * s,
        Y0 * (1 - s) + Y1 * s,
        Z0 * (1 - s) + Z1 * s,
      ]);
    }
    return position;
  }

  function doLagrangeInterpolation(): [number, number, number][] {
    const position: [number, number, number][] = [];

    const N = controlPoints.length;
    const dT = incrementSteps / (N - 1);
    const D: number[] = [];

    for (let i = 0; i < N; i++) {
      D[i] = 1;
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        D[i] *= dT * (i - j);
      }
    }

    function Lk(x: number, axis: number): number {
      const R: number[] = [];

      let S = 0;
      for (let i = 0; i < N; i++) {
        R[i] = 1;
        for (let j = 0; j < N; j++) {
          if (i === j) continue;
          R[i] *= x - j * dT;
        }
        R[i] /= D[i];
        S += R[i] * controlPoints[i][axis];
      }

      return S;
    }

    for (let k = 0; k < incrementSteps; k++) {
      position.push([Lk(k, 0), Lk(k, 1), Lk(k, 2)]);
    }
    return position;
  }

  // Creating the knot vector (clamped):
  // http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html
  function doBSplineInterpolation(): [number, number, number][] {
    const position: [number, number, number][] = [];

    const N = controlPoints.length - 1;
    const P = 3;
    const U: number[] = [];
    const M = N + P + 1;
    const deltaKnot = 1 / (M - 2 * P);

    for (let i = 0; i <= P; i++) {
      U.push(0);
    }

    let v = deltaKnot;
    for (let i = P + 1; i < M - P + 1; i++) {
      U.push(v);
      v += deltaKnot;
    }

    for (let i = M - P + 1; i <= M; i++) {
      U.push(1);
    }

    function No(u: number, i: number): number {
      return U[i] <= u && u < U[i + 1] ? 1 : 0;
    }

    function Np(u: number, i: number, p: number): number {
      let A = 0,
        B = 0;

      if (p - 1 === 0) {
        A = No(u, i);
        B = No(u, i + 1);
      } else {
        A = Np(u, i, p - 1);
        B = Np(u, i + 1, p - 1);
      }

      let coefficientA = 0,
        coefficientB = 0;

      if (U[i + p] - U[i] !== 0) {
        coefficientA = (u - U[i]) / (U[i + p] - U[i]);
      }
      if (U[i + p + 1] - U[i + 1] !== 0) {
        coefficientB = (U[i + p + 1] - u) / (U[i + p + 1] - U[i + 1]);
      }

      return coefficientA * A + coefficientB * B;
    }

    function C(t: number): [number, number, number] {
      const result: [number, number, number] = [] as any;

      for (let j = 0; j < 3; j++) {
        let sum = 0;
        for (let i = 0; i <= N; i++) {
          sum += controlPoints[i][j] * Np(t, i, P);
        }
        result[j] = sum;
      }

      return result;
    }

    const dT = 1 / incrementSteps;

    let t = 0;
    do {
      position.push(C(t));
      t += dT;
    } while (t < 1.0);

    position.push(C(1.0));
    return position;
  }

  function close(c1: number[], c0: number[], r: number): boolean {
    return (
      Math.sqrt(
        (c1[0] - c0[0]) * (c1[0] - c0[0]) +
          (c1[1] - c0[1]) * (c1[1] - c0[1]) +
          (c1[2] - c0[2]) * (c1[2] - c0[2])
      ) <= r
    );
  }
};
