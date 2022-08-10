#version 300 es
precision mediump float;

const int numLights = 4;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uLightSource;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse[numLights];
uniform float uCutOff;

in vec3 vNormal;
in vec3 vLightRay[numLights];
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe || uLightSource){
        fragColor = uMaterialDiffuse;
    }
    else {
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Base color
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

        vec3 N = normalize(vNormal);
        vec3 L = vec3(0.0);
        float lambertTerm = 0.0;

        // Iterate for every light
        for(int i = 0; i < numLights; i++) {
            L = normalize(vLightRay[i]);
            lambertTerm = dot(N, -L);
        if (lambertTerm > uCutOff) {
            finalColor += uLightDiffuse[i] * uMaterialDiffuse * lambertTerm;
        }
    }

        fragColor = vec4(vec3(finalColor += Ia), 1.0);
    }
}