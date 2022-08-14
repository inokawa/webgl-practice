#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform vec2 uInverseTextureSize;

in vec2 vTextureCoords;

out vec4 fragColor;

vec4 offsetLookup(float xOff, float yOff) {
    return texture(
        uSampler,
        vec2(
            vTextureCoords.x + xOff * uInverseTextureSize.x,
            vTextureCoords.y + yOff * uInverseTextureSize.y
        )
    );
}

void main(void) {
    vec4 frameColor = offsetLookup(-4.0, 0.0) * 0.05;
    frameColor += offsetLookup(-3.0, 0.0) * 0.09;
    frameColor += offsetLookup(-2.0, 0.0) * 0.12;
    frameColor += offsetLookup(-1.0, 0.0) * 0.15;
    frameColor += offsetLookup(0.0, 0.0) * 0.16;
    frameColor += offsetLookup(1.0, 0.0) * 0.15;
    frameColor += offsetLookup(2.0, 0.0) * 0.12;
    frameColor += offsetLookup(3.0, 0.0) * 0.09;
    frameColor += offsetLookup(4.0, 0.0) * 0.05;
    fragColor = frameColor;
}