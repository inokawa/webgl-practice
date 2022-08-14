#version 300 es
precision mediump float;

in vec2 aVertexPosition;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;

void main(void) {
    vTextureCoords = aVertexTextureCoords;
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}