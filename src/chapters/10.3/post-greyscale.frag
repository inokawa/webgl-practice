#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    vec4 frameColor = texture(uSampler, vTextureCoords);
    float luminance = frameColor.r * 0.3 + frameColor.g * 0.59 + frameColor.b * 0.11;
    fragColor = vec4(luminance, luminance, luminance, frameColor.a);
}