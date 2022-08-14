#version 300 es
precision mediump float;

const int numLights = 3;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition[numLights];
uniform vec3 uLightDirection[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal[numLights];
out vec3 vLightRay[numLights];

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec3 normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

  // Iterate over lights
  for(int i = 0; i < numLights; i++) {
    vec4 positionLight = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
    vec3 directionLight = vec3(uNormalMatrix * vec4(uLightDirection[i], 1.0));
    vNormal[i] = normal - directionLight;
    vLightRay[i] = vertex.xyz - positionLight.xyz;
  }

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}