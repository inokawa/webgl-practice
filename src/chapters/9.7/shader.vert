#version 300 es
precision mediump float;

const int numLights = 4;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vLightRay[numLights];
out vec3 vEye[numLights];

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec4 lightPosition = vec4(0.0);

  // Set varyings for each individual light
  for(int i= 0; i < numLights; i++) {
    lightPosition = vec4(uLightPosition[i], 1.0);
    vLightRay[i] = vertex.xyz - lightPosition.xyz;
    vEye[i] = -vec3(vertex.xyz);
  }

  vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}