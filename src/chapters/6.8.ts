import { draw, createProgram } from "../webgl";
import vert from "./6.8.vert?raw";
import frag from "./6.8.frag?raw";

import { Scene } from "../Scene";
import { configureControls } from "../utils";
import { Camera } from "../Camera";
import { Controls } from "../Controls";
import { Transforms } from "../Transforms";
import { Light, LightsManager } from "../Light";
import { Floor } from "../Floor";
import { mat4, ReadonlyVec3 } from "gl-matrix";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendEquation(gl.FUNC_ADD);
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
      "uLightSource",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightDirection",
      "uMaterialAmbient",
      "uMaterialDiffuse",
      "uCutOff",
      "uWireframe",
    ]
  );

  const lightsData = [
    {
      id: "redLight",
      name: "Red Light",
      position: [0, 7, 3],
      diffuse: [1, 0, 0, 1],
      direction: [0, -2, -0.1],
    },
    {
      id: "greenLight",
      name: "Green Light",
      position: [2.5, 3, 3],
      diffuse: [0, 1, 0, 1],
      direction: [-0.5, 1, -0.1],
    },
    {
      id: "blueLight",
      name: "Blue Light",
      position: [-2.5, 3, 3],
      diffuse: [0, 0, 1, 1],
      direction: [0.5, 1, -0.1],
    },
  ];

  const scene = new Scene(gl, program);
  scene.add(new Floor(80, 2));
  scene.add(await import("../models/wall.json"), "wall");
  for (const { id } of lightsData) {
    scene.add(await import("../models/sphere3.json"), id);
  }

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 5, 30]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(0);
  camera.setElevation(-3);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  const lights = new LightsManager();
  lightsData.forEach(({ id, position, diffuse, direction }) => {
    const light = new Light(id);
    light.setPosition(position);
    light.setDiffuse(diffuse);
    light.setProperty("direction", direction);
    lights.add(light);
  });

  const lightCutOff = 0.75;

  program.use();
  program.setUniform("uLightPosition", "vec3", lights.getArray("position"));
  program.setUniform(
    "uLightDirection",
    "vec3",
    lights.getArray("direction" as any)
  );
  program.setUniform("uLightDiffuse", "vec4", lights.getArray("diffuse"));
  program.setUniform("uCutOff", "float", lightCutOff);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);

  const disposeGui = configureControls({
    "Camera Type": {
      value: camera.type,
      options: ["TRACKING_TYPE", "ORBITING_TYPE"],
      onChange: (v) => {
        camera.goHome();
        camera.type = v;
      },
    },
    ...lightsData.reduce((controls: any, light) => {
      const positionKeys = [
        `X - ${light.name}`,
        `Y - ${light.name}`,
        `Z - ${light.name}`,
      ];
      controls[light.name] = positionKeys.reduce(
        (positionControls: any, position, i) => {
          positionControls[position] = {
            value: light.position[i],
            min: -15,
            max: 15,
            step: 0.1,
            onChange: (_v: any, state: any) => {
              lights.get(light.id)!.position = positionKeys.map(
                (p) => state[p]
              ) as any;
            },
          };
          return positionControls;
        },
        {}
      );
      return controls;
    }, {}),
    "Light Cone Cut Off": {
      value: lightCutOff,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => program.setUniform("uCutOff", "float", v),
    },
    "Go Home": () => {
      camera.goHome();
      camera.type = "ORBITING_TYPE";
    },
  });

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();
    try {
      objects.forEach((object) => {
        transforms.calculateModelView();
        transforms.push();

        program.setUniform("uLightSource", "bool", false);

        const light = lightsData.find(({ id }) => object.alias === id);
        if (light) {
          const { position, diffuse } = lights.get(light.id)!;
          mat4.translate(
            transforms.modelViewMatrix,
            transforms.modelViewMatrix,
            position as ReadonlyVec3
          );
          object.diffuse = diffuse;
          program.setUniform("uLightSource", "bool", true);
        }

        transforms.setMatrixUniforms();
        transforms.pop();

        program.setUniform(
          "uLightPosition",
          "vec3",
          lights.getArray("position")
        );
        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
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
};
