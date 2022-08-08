#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
    fragColor = vColor;
}