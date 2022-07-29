#version 300 es
precision mediump float;

uniform vec3 uModelColor;

out vec4 fragColor;

void main(void) {
    fragColor = vec4(uModelColor, 1.0);
}