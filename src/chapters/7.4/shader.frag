#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform sampler2D uSampler;

in vec4 vColor;
in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    fragColor = vColor * texture(uSampler, vTextureCoords);
}