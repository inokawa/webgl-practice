#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = uMaterialDiffuse;
    }
    else {
        fragColor = vColor;
    }
}