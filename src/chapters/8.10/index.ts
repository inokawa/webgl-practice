import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { Scene } from "../../Scene";
import { configureControls, loadJSON } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";
import { Floor } from "../../Floor";
import { Picker } from "../../Picker";
import { mat4, vec3 } from "gl-matrix";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
      "uLightAmbient",
      "uLightDiffuse",
      "uLightPosition",
      "uWireframe",
      "uOffscreen",
      "uPickingColor",
    ]
  );

  const scene = new Scene(gl, program);

  const load = async () => {
    scene.add(new Floor(80, 2));
    for (let i = 0; i < 100; i++) {
      const objectType = Math.floor(Math.random() * 2);

      const options = {
        position: positionGenerator(),
        scale: scaleGenerator(),
        diffuse: diffuseColorGenerator(i),
        pickingColor: objectLabelGenerator(),
      };

      switch (objectType) {
        case 1:
          scene.add(
            await loadJSON("/models/sphere1.json"),
            `ball_${i}`,
            options
          );
          break;
        case 0:
          scene.add(
            await loadJSON("/models/cylinder.json"),
            `cylinder_${i}`,
            options
          );
          break;
      }
    }
  };
  await load();

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 192]);
  camera.setFocus([0, 0, 0]);
  camera.setElevation(-22);
  camera.setAzimuth(37);

  const picker = new Picker(gl, scene, {
    hitProperty: (obj) => {
      return (obj as any).pickingColor;
    },
    addHit: (obj) => {
      (obj as any).previous = obj.diffuse.slice(0);
      obj.diffuse = (obj as any).pickingColor;
    },
    removeHit: (obj) => {
      obj.diffuse = (obj as any).previous.slice(0);
    },
    processHits: (hits) => {
      hits.forEach((hit) => (hit.diffuse = (hit as any).previous));
    },
    move: (dx, dy, alt) => {
      const hits = picker.getHits();

      if (!hits) return;

      // Can change factor to be dynamic on screen size
      // or hard-coded for a particular interaction
      const factor =
        Math.max(
          Math.max(camera.position[0], camera.position[1]),
          camera.position[2]
        ) / 2000;

      hits.forEach((hit) => {
        const scaleX = vec3.create();
        const scaleY = vec3.create();

        if (alt) {
          vec3.scale(scaleY, camera.normal, dy * factor);
        } else {
          vec3.scale(scaleY, camera.up, -dy * factor);
          vec3.scale(scaleX, camera.right, dx * factor);
        }

        vec3.add((hit as any).position, (hit as any).position, scaleY);
        vec3.add((hit as any).position, (hit as any).position, scaleX);
      });
    },
  });

  const controls = new Controls(camera, gl.canvas);
  controls.setPicker(picker);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 5, 20]);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);

  let showPickingImage = false;

  const disposeGui = configureControls({
    "Show Picking Image": {
      value: showPickingImage,
      onChange: (v) => (showPickingImage = v),
    },
    "Reset Scene": async () => {
      scene.objects = [];
      await load();
      camera.goHome();
      camera.setElevation(-40);
      camera.setAzimuth(-30);
    },
  });

  scene.start((objects) => {
    picker.drawToFramebuffer(() => {
      program.setUniform("uOffscreen", "bool", true);
      render();
      program.setUniform("uOffscreen", "bool", showPickingImage);
    });
    render();

    function render() {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      transforms.updatePerspective();

      try {
        const offscreen = program.getUniform("uOffscreen");
        const flatShadingMode = showPickingImage || offscreen;

        objects.forEach((object) => {
          if (object.alias === "floor" && flatShadingMode) {
            return;
          }

          transforms.calculateModelView();
          transforms.push();

          if (object.alias !== "floor") {
            mat4.translate(
              transforms.modelViewMatrix,
              transforms.modelViewMatrix,
              (object as any).position
            );
            mat4.scale(
              transforms.modelViewMatrix,
              transforms.modelViewMatrix,
              (object as any).scale
            );
          }

          transforms.setMatrixUniforms();
          transforms.pop();

          if (object.diffuse[3] < 1 && !offscreen) {
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
          } else {
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
          }

          program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
          program.setUniform("uMaterialAmbient", "vec4", object.ambient);
          program.setUniform("uWireframe", "bool", object.wireframe);
          // Default picking color if none exists
          program.setUniform(
            "uPickingColor",
            "vec4",
            (object as any).pickingColor || [0, 0, 0, 0]
          );
          program.setUniform("uOffscreen", "bool", flatShadingMode);

          draw(gl, object.vao, object.wireframe ? "LINES" : "TRIANGLES");
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  return () => {
    scene.dispose();
    disposeGui();
    picker.dispose();
  };
};

function positionGenerator() {
  const flagX = Math.floor(Math.random() * 10),
    flagZ = Math.floor(Math.random() * 10);

  let x = Math.floor(Math.random() * 60),
    z = Math.floor(Math.random() * 60);

  if (flagX >= 5) {
    x = -x;
  }
  if (flagZ >= 5) {
    z = -z;
  }

  return [x, 0, z];
}

const colorset: { [key: string]: boolean } = {};

function objectLabelGenerator(): number[] {
  const color = [Math.random(), Math.random(), Math.random(), 1],
    key = color.toString();

  if (key in colorset) {
    return objectLabelGenerator();
  } else {
    colorset[key] = true;
    return color;
  }
}

function diffuseColorGenerator(index: number) {
  const color = (index % 30) / 60 + 0.2;
  return [color, color, color, 1];
}

function scaleGenerator() {
  const scale = Math.random() + 0.3;
  return [scale, scale, scale];
}
