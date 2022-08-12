#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uUseLambert;

in vec3 vNormal;
in vec3 vLightRay;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);
        float lambertTerm	= clamp(dot(N, -L), 0.0, 1.0);
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        vec4 Id = uLightDiffuse * uMaterialDiffuse;
    if (uUseLambert) {
        Id = Id * lambertTerm;
    }
        fragColor = vec4(Ia.rgb + Id.rgb, uMaterialDiffuse.a);
    }
}