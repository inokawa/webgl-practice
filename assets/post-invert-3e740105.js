const e=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    vec4 frameColor = texture(uSampler, vTextureCoords);
    fragColor = vec4(vec3(1.0) - frameColor.rgb, frameColor.a);
}`;export{e as default};
