import { draw, createProgram } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";

import { Scene } from "../../Scene";
import { configureControls } from "../../utils";
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
      "uMaterialAmbient",
      "uMaterialDiffuse",
      "uAlpha",
      "uUseLambert",
      "uUseVertexColor",
    ]
  );

  let useVertexColors = false;

  const scene = new Scene(gl, program);

  scene.add(
    { ...(await import("../../models/cube-simple.json")), hidden: false } as any,
    "simpleCube"
  );
  scene.add(
    { ...(await import("../../models/cube-complex.json")), hidden: true } as any,
    "complexCube"
  );

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 3]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(45);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 5, 20]);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
  program.setUniform("uAlpha", "float", 1.0);
  program.setUniform("uUseVertexColor", "bool", useVertexColors);
  program.setUniform("uUseLambert", "bool", true);

  const disposeGui = configureControls({
    Lambert: {
      value: true,
      onChange: (v) => program.setUniform("uUseLambert", "bool", v),
    },
    "Per Vertex": {
      value: useVertexColors,
      onChange: (v) => (useVertexColors = v),
    },
    "Complex Cube": {
      value: true,
      onChange: (v) => {
        const simpleCube = scene.get("simpleCube")!;
        const complexCube = scene.get("complexCube")!;
        if (v) {
          (simpleCube as any).hidden = true;
          (complexCube as any).hidden = false;
        } else {
          (simpleCube as any).hidden = false;
          (complexCube as any).hidden = true;
        }
      },
    },
    "Alpha Value": {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (v) => program.setUniform("uAlpha", "float", v),
    },
  });

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();
    try {
      objects.forEach((object) => {
        if ((object as any).hidden) return;

        transforms.calculateModelView();
        transforms.push();
        transforms.setMatrixUniforms();
        transforms.pop();

        program.setUniform("uUseVertexColor", "bool", useVertexColors);
        program.setUniform("uMaterialDiffuse", "vec4", object.diffuse);
        program.setUniform("uMaterialAmbient", "vec4", object.ambient);

        draw(gl, object.vao, "TRIANGLES");
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
