import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { Scene } from "../../Scene";
import { Floor } from "../../Floor";
import { configureControls } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";
import { BouncingBall } from "../../BouncingBall";

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
      "uPerVertexColor",
      "uTranslation",
      "uTranslate",
    ]
  );

  let elapsedTime: number,
    initialTime: number,
    fixedLight = false,
    animationRate = 15;

  const scene = new Scene(gl, program);

  const gravity = 9.8;
  const ballsCount = 500;
  const balls: BouncingBall[] = [];
  scene.add(new Floor(80, 2));
  scene.add(await import("../../models/ball.json"), "ball");
  // Load the number of balls into our scene
  for (let i = 0; i < ballsCount; i++) {
    balls.push(new BouncingBall(gravity));
  }

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 2, 70]);
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

  let sceneTime = 0;

  scene.start((objects, time) => {
    elapsedTime = time - initialTime;
    if (elapsedTime < animationRate) return;

    let steps = Math.floor(elapsedTime / animationRate);
    while (steps > 0) {
      balls.forEach((ball) => ball.update(sceneTime));
      sceneTime += 33 / 1000;

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      transforms.updatePerspective();
      try {
        program.setUniform("uUpdateLight", "bool", fixedLight);

        objects.forEach((object) => {
          // Calculate local transformations
          transforms.calculateModelView();
          transforms.setMatrixUniforms();

          // If the item is a ball
          if (object.alias === "ball") {
            program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
            program.setUniform("uMaterialSpecular", "vec4", object.specular);
            program.setUniform("uMaterialAmbient", "vec4", object.ambient);
            program.setUniform("uWireframe", "bool", false);
            program.setUniform("uTranslate", "bool", true);

            balls.forEach((ball) => {
              program.setUniform("uTranslation", "vec3", ball.position);
              program.setUniform("uMaterialDiffuse", "vec4", ball.color);

              draw(gl, object.vao, "TRIANGLES");
            });

            return;
          }

          program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
          program.setUniform("uMaterialSpecular", "vec4", object.specular);
          program.setUniform("uMaterialAmbient", "vec4", object.ambient);
          program.setUniform("uWireframe", "bool", object.wireframe);
          program.setUniform("uTranslate", "bool", false);

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
