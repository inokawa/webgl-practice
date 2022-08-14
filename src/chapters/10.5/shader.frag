#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in float vLifespan;

out vec4 fragColor;

void main(void) {
    vec4 texColor = texture(uSampler, gl_PointCoord);
    fragColor = vec4(texColor.rgb, texColor.a * vLifespan);
}