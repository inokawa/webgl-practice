#version 300 es
precision mediump float;

uniform float uAlpha;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec4 aVertexColor;

out vec4 vColor;

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  float lambertTerm = 1.0;
  vec4 Ia = uLightAmbient * uMaterialAmbient;
  vec4 Id = uLightDiffuse * aVertexColor * lambertTerm;
  vColor = vec4(vec3(Ia + Id), uAlpha);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}