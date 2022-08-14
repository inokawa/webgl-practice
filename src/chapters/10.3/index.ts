import { draw, createProgram, loadTexture } from "../../webgl";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
import postVert from "./post-common.vert?raw";
import postFrag from "./post-normal.frag?raw";
import imgUrl from "../../images/webgl.gif";
import noiseImgUrl from "../../images/noise.png";

import { Scene } from "../../Scene";
import { configureControls } from "../../utils";
import { Camera } from "../../Camera";
import { Controls } from "../../Controls";
import { Transforms } from "../../Transforms";
import { PostProcess } from "../../PostProcess";
import { mat4 } from "gl-matrix";

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
    [
      "aVertexPosition",
      "aVertexNormal",
      "aVertexColor",
      "aVertexTextureCoords",
    ],
    [
      "uProjectionMatrix",
      "uModelViewMatrix",
      "uNormalMatrix",
      "uMaterialDiffuse",
      "uMaterialAmbient",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightPosition",
      "uAlpha",
      "uUseVertexColor",
      "uOffscreen",
      "uSampler",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(
    {
      ...(await import("../../models/cube-texture.json")),
      image: imgUrl,
    },
    "cube",
    {
      position: [0, 0, 0],
      scale: [6, 6, 6],
    }
  );

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 25]);
  camera.setFocus([0, 0, 0]);
  camera.setElevation(-40);
  camera.setAzimuth(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  program.setUniform("uLightPosition", "vec3", [0, 5, 20]);
  program.setUniform("uLightAmbient", "vec4", [1, 1, 1, 1]);
  program.setUniform("uLightDiffuse", "vec4", [1, 1, 1, 1]);
  program.setUniform("uAlpha", "float", 1.0);

  const noiseTexture = loadTexture(gl, noiseImgUrl);

  const post = new PostProcess(gl, postVert, postFrag);

  const options = [
    "Normal",
    "Greyscale",
    "Invert",
    "Wavy",
    "Blur",
    "Film Grain",
  ];
  const disposeGui = configureControls({
    Filters: {
      value: options[0],
      options,
      onChange: async (v) => {
        const effect = v.replace(" ", "").toLowerCase();
        post.configureShader(
          postVert,
          (await import(`./post-${effect}.frag?raw`)).default
        );
      },
    },
  });

  scene.start((objects) => {
    post.drawToFramebuffer(() => {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      transforms.updatePerspective();
      try {
        program.use();
        const offscreen = program.getUniform("uOffscreen");

        objects.forEach((object) => {
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
          program.setUniform("uUseVertexColor", "bool", false);

          // Activate texture
          if (object.textureCoords) {
            object.texture?.bind(0);
            program.setUniform("uSampler", "sampler2D", 0);
          }

          draw(gl, object.vao, "TRIANGLES");
        });
      } catch (error) {
        console.error(error);
      }
    });

    post.draw(() => {
      // Do any additional post-process shader uniform setup here
      if (post.program.uniforms.uNoiseSampler) {
        noiseTexture.bind(1);
        post.program.setUniform("uNoiseSampler", "sampler2D", 1);
      }
    });
  });

  return () => {
    scene.dispose();
    post.dispose();
    disposeGui();
    noiseTexture.dispose();
  };
};
