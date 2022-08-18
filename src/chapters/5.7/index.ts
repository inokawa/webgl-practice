import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { mat4 } from "gl-matrix";
import { Scene } from "../../Scene";
import { Floor } from "../../Floor";
import { Axis } from "../../Axis";
import { configureControls, loadJSON } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";

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
      "uModelViewMatrix",
      "uProjectionMatrix",
      "uNormalMatrix",
      "uLightPosition",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightSpecular",
      "uMaterialAmbient",
      "uMaterialDiffuse",
      "uMaterialSpecular",
      "uWireframe",
      "uUpdateLight",
      "uShininess",
    ]
  );

  let elapsedTime: number,
    initialTime: number,
    fixedLight = false,
    dxSphere = 0.5,
    dxCone = 0.15,
    spherePosition = 0,
    conePosition = 0,
    animationRate = 150,
    simulationRate = 30;

  const scene = new Scene(gl, program);

  scene.add(new Floor(80, 2));
  scene.add(new Axis(82));
  scene.add(await loadJSON("/models/sphere2.json"), "sphere");
  scene.add(await loadJSON("/models/cone3.json"), "cone");

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 2, 50]);
  camera.setFocus([0, 0, 0]);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 120, 120]);
  program.setUniform("uLightAmbient", "vec4", [0.2, 0.2, 0.2, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightSpecular", "vec4", [1, 1, 1, 1]);
  program.setUniform("uShininess", "float", 230);

  const disposeGui = configureControls({
    "Camera Type": {
      value: camera.type,
      options: ["ORBITING_TYPE", "TRACKING_TYPE"],
      onChange: (v: any) => {
        camera.goHome();
        camera.type = v;
      },
    },
    "Static Light Position": {
      value: fixedLight,
      onChange: (v) => (fixedLight = v),
    },
    "Go Home": () => camera.goHome(),
  });

  scene.start((objects, time) => {
    elapsedTime = time - initialTime;
    if (elapsedTime < animationRate) return;

    let steps = Math.floor(elapsedTime / simulationRate);
    while (steps > 0) {
      spherePosition += dxSphere;
      if (spherePosition >= 30 || spherePosition <= -30) {
        dxSphere = -dxSphere;
      }
      conePosition += dxCone;
      if (conePosition >= 35 || conePosition <= -35) {
        dxCone = -dxCone;
      }

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      transforms.updatePerspective();
      try {
        program.setUniform("uUpdateLight", "bool", fixedLight);

        objects.forEach((object) => {
          // Calculate local transformations
          transforms.calculateModelView();
          transforms.push();

          // Depending on which object, apply transformation
          if (object.alias === "sphere") {
            const sphereTransform = transforms.modelViewMatrix;
            mat4.translate(sphereTransform, sphereTransform, [
              0,
              0,
              spherePosition,
            ]);
          } else if (object.alias === "cone") {
            const coneTransform = transforms.modelViewMatrix;
            mat4.translate(coneTransform, coneTransform, [conePosition, 0, 0]);
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

      steps -= 1;
    }

    initialTime = time;
  });

  return () => {
    scene.dispose();
    disposeGui();
  };
};
