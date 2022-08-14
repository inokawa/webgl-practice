#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void){
    fragColor = texture(uSampler2, vTextureCoords) * texture(uSampler, vTextureCoords);
}