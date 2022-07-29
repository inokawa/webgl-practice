#version 300 es
precision mediump float;

in vec3 aVertexPosition;

void main(void) {
    gl_PointSize = 40.0;
    gl_Position = vec4(aVertexPosition, 1.0);
}