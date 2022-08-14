#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;
out vec3 vVertexNormal;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoords = aVertexTextureCoords;
  vVertexNormal = (uNormalMatrix * vec4(-aVertexPosition, 1.0)).xyz;
}