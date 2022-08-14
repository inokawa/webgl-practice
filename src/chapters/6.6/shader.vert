#version 300 es
precision mediump float;

const int numLights = 4;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec4 uMaterialDiffuse;
uniform vec3 uLightPosition[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay[numLights];

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

    // Iterate for every light
    for(int i = 0; i < numLights; i++) {
      vec4 lightPosition = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
      vLightRay[i] = vertex.xyz - lightPosition.xyz;
    }

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}