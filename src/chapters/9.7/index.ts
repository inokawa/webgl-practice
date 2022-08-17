import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { Scene, GLObject } from "../../Scene";
import {
  configureControls,
  denormalizeColor,
  normalizeColor,
  range,
} from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";
import { Light, LightsManager } from "../../Light";
import { Floor } from "../../Floor";

export const init = async (gl: WebGL2RenderingContext) => {
  let clearColor: [number, number, number] = [0.9, 0.9, 0.9];

  gl.clearColor(...clearColor, 1);
  gl.clearDepth(1);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexNormal"],
    [
      "uProjectionMatrix",
      "uModelViewMatrix",
      "uNormalMatrix",
      "uLightPosition",
      "uWireframe",
      "uLd",
      "uLs",
      "uKa",
      "uKd",
      "uKs",
      "uNs",
      "uD",
      "uIllum",
    ]
  );

  const scene = new Scene(gl, program);

  const camera = new Camera("ORBITING_TYPE");
  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  const lightPositions: { [key: string]: [number, number, number] } = {
    farLeft: [-1000, 1000, -1000],
    farRight: [1000, 1000, -1000],
    nearLeft: [-1000, 1000, 1000],
    nearRight: [1000, 1000, 1000],
  };
  const lights = new LightsManager();
  Object.keys(lightPositions).forEach((key) => {
    const light = new Light(key);
    light.setPosition(lightPositions[key]);
    light.setDiffuse([0.4, 0.4, 0.4]);
    light.setSpecular([0.8, 0.8, 0.8]);
    lights.add(light);
  });

  program.use();
  program.setUniform("uLightPosition", "vec3", lights.getArray("position"));
  program.setUniform("uLd", "vec3", lights.getArray("diffuse"));
  program.setUniform("uLs", "vec3", lights.getArray("specular"));
  program.setUniform("uKa", "vec3", [1, 1, 1]);
  program.setUniform("uKd", "vec3", [1, 1, 1]);
  program.setUniform("uKs", "vec3", [1, 1, 1]);
  program.setUniform("uNs", "float", 1);

  const floor = new Floor(200, 2);

  const carModelData = {
    "BMW i8": {
      // This is the alias that's used to determine whether the item being
      // loaded is a body panel with paint. Each object within the model has particular
      // aliases that were set by the 3D artists.
      paintAlias: "BMW",
      parts: range(1, 25).map(
        (i) => () => import(`../../models/bmw-i8/part${i}.json`)
      ),
    },
    "Audi R8": {
      paintAlias: "Lack",
      parts: range(1, 150).map(
        (i) => () => import(`../../models/audi-r8/part${i}.json`)
      ),
    },
    "Ford Mustang": {
      paintAlias: "pintura_carro",
      parts: range(1, 103).map(
        (i) => () => import(`../../models/ford-mustang/part${i}.json`)
      ),
    },
    "Lamborghini Gallardo": {
      paintAlias: "Yellow",
      parts: range(1, 66).map(
        (i) => () => import(`../../models/lamborghini-gallardo/part${i}.json`)
      ),
    },
  } as const;

  type CarType = keyof typeof carModelData;
  let selectedCar: CarType = "BMW i8";
  goHome();
  await loadCar(selectedCar);

  function goHome() {
    camera.goHome([0, 0.5, 5]);
    camera.setFocus([0, 0, 0]);
    camera.setAzimuth(25);
    camera.setElevation(-10);
  }
  async function loadCar(model: CarType) {
    scene.objects = [];
    scene.add(floor);
    const { parts } = carModelData[model];
    const models = await Promise.all(parts.map((p) => p()));
    models.forEach((m) => {
      scene.add(m);
    });
    selectedCar = model;
  }
  function eachCarPanel(cb: (item: GLObject) => void) {
    const paintAlias = carModelData[selectedCar].paintAlias;
    scene.traverse((item) => {
      if (~item.alias!.indexOf(paintAlias)) {
        cb(item);
      }
      return false;
    });
  }

  const disposeGui = configureControls({
    Car: {
      Model: {
        options: Object.keys(carModelData),
        value: selectedCar,
        onChange: loadCar,
      },
      Color: {
        value: [255, 255, 255],
        onChange: (v) => {
          const color = normalizeColor(v);
          eachCarPanel((item) => (item.Kd = color));
        },
      },
      Shininess: {
        value: 0.5,
        min: 0,
        max: 50,
        step: 0.1,
        onChange: (v) => {
          const shininess = [v, v, v];
          eachCarPanel((item) => (item.Ks = shininess));
        },
      },
    },
    ...Object.keys(lightPositions).reduce(
      (result, key) => {
        const { Lights } = result;
        const light: any = ((Lights as any)[key] = {});
        ["Diffuse", "Specular"].forEach((property) => {
          light[property] = {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.1,
            onChange: (v: any) => {
              const value = [v, v, v];
              const light = lights.get(key)!;
              switch (property) {
                case "Diffuse":
                  light.setDiffuse(value);
                  program.setUniform("uLd", "vec3", lights.getArray("diffuse"));
                  break;
                case "Specular":
                  light.setSpecular(value);
                  program.setUniform(
                    "uLs",
                    "vec3",
                    lights.getArray("specular")
                  );
                  break;
              }
            },
          };
        });
        return result;
      },
      { Lights: {} }
    ),
    Background: {
      value: denormalizeColor(clearColor),
      onChange: (v: [number, number, number]) =>
        gl.clearColor(...normalizeColor(v), 1),
    },
    Floor: {
      value: floor.visible,
      onChange: (v) => (floor.visible = v),
    },
    "Go Home": goHome,
  });

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();
    try {
      objects.forEach((object) => {
        if (!(object as any).visible) return;

        transforms.calculateModelView();
        transforms.push();
        transforms.setMatrixUniforms();
        transforms.pop();

        program.setUniform("uKa", "vec3", object.Ka);
        program.setUniform("uKd", "vec3", object.Kd);
        program.setUniform("uKs", "vec3", object.Ks);
        program.setUniform("uNs", "float", object.Ns);
        program.setUniform("uD", "float", object.d);
        program.setUniform("uIllum", "int", object.illum);

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
