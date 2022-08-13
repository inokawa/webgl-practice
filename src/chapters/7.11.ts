import { draw, createProgram, loadTexture } from "../webgl";
import vert from "./7.11.vert?raw";
import frag from "./7.11.frag?raw";
import imgUrl from "../images/webgl.png";
import positiveX from "../images/cubemap/positive-x.png";
import negativeX from "../images/cubemap/negative-x.png";
import positiveY from "../images/cubemap/positive-y.png";
import negativeY from "../images/cubemap/negative-y.png";
import positiveZ from "../images/cubemap/positive-z.png";
import negativeZ from "../images/cubemap/negative-z.png";

import { Scene } from "../Scene";
import { Camera } from "../Camera";
import { Controls } from "../Controls";
import { Transforms } from "../Transforms";

export const init = async (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.9, 0.9, 0.9, 1);
  gl.clearDepth(100);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const program = createProgram(
    gl,
    vert,
    frag,
    ["aVertexPosition", "aVertexTextureCoords"],
    [
      "uProjectionMatrix",
      "uModelViewMatrix",
      "uNormalMatrix",
      "uSampler",
      "uCubeSampler",
    ]
  );

  const scene = new Scene(gl, program);
  scene.add(await import("../models/cube-texture.json"));

  const camera = new Camera("ORBITING_TYPE");
  camera.goHome([0, 0, 4]);
  camera.setFocus([0, 0, 0]);
  camera.setAzimuth(45);
  camera.setElevation(-30);

  new Controls(camera, gl.canvas);

  const transforms = new Transforms(program, camera, gl.canvas);

  program.use();

  const texture = loadTexture(gl, imgUrl);

  const cubeTexture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  loadCubemapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_X, cubeTexture, positiveX);
  loadCubemapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, cubeTexture, negativeX);
  loadCubemapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, cubeTexture, positiveY);
  loadCubemapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, cubeTexture, negativeY);
  loadCubemapFace(gl, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, cubeTexture, positiveZ);
  loadCubemapFace(gl, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, cubeTexture, negativeZ);

  function loadCubemapFace(
    gl: WebGL2RenderingContext,
    target: number,
    texture: WebGLTexture,
    url: string
  ) {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    };
  }

  scene.start((objects) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    transforms.updatePerspective();

    try {
      objects.forEach((object) => {
        // if (object.hidden) return;

        transforms.calculateModelView();
        transforms.push();
        transforms.setMatrixUniforms();
        transforms.pop();

        // Activate texture
        if (object.textureCoords) {
          texture.bind(0);
          program.setUniform("uSampler", "sampler2D", 0);
        }
        // Activate cube map
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture);
        program.setUniform("uCubeSampler", "samplerCube", 1);

        // Draw
        if (object.wireframe) {
          draw(gl, object.vao, "LINES");
        } else {
          gl.enable(gl.CULL_FACE);
          gl.cullFace(gl.FRONT);
          draw(gl, object.vao, "TRIANGLES");

          gl.cullFace(gl.BACK);
          draw(gl, object.vao, "TRIANGLES");
          gl.disable(gl.CULL_FACE);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
  return () => {
    scene.dispose();
    texture.dispose();
    gl.deleteTexture(cubeTexture);
  };
};
