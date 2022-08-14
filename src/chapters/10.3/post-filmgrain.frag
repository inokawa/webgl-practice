#version 300 es
precision mediump float;

const float grainIntensity = 0.1;
const float scrollSpeed = 4000.0;

uniform sampler2D uSampler;
uniform sampler2D uNoiseSampler;
uniform vec2 uInverseTextureSize;
uniform float uTime;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    vec4 frameColor = texture(uSampler, vTextureCoords);
    vec4 grain = texture(
        uNoiseSampler,
        vTextureCoords * 2.0 + uTime * scrollSpeed * uInverseTextureSize
    );
    fragColor = frameColor - (grain * grainIntensity);
}