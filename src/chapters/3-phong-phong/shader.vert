#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vEyeVector;

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    // Set varyings to be used inside of fragment shader
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vEyeVector = -vec3(vertex.xyz);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}