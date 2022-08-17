#version 300 es
precision mediump float;

const int numLights = 4;

uniform vec3 uLd[numLights];
uniform vec3 uLs[numLights];
uniform vec3 uLightPosition[numLights];
uniform vec3 uKa;
uniform vec3 uKd;
uniform vec3 uKs;
uniform float uNs;
uniform float uD;
uniform int uIllum;
uniform bool uWireframe;

in vec3 vNormal;
in vec3 vLightRay[numLights];
in vec3 vEye[numLights];

out vec4 fragColor;

void main(void) {
    if (uWireframe || uIllum == 0) {
        fragColor = vec4(uKd, uD);
        return;
    }

    vec3 color = vec3(0.0);
    vec3 light = vec3(0.0);
    vec3 eye = vec3(0.0);
    vec3 reflection = vec3(0.0);
    vec3 normal = normalize(vNormal);

    if (uIllum == 1) {
        for (int i = 0; i < numLights; i++) {
            light = normalize(vLightRay[i]);
            normal = normalize(vNormal);
            color += (uLd[i] * uKd * clamp(dot(normal, -light), 0.0, 1.0));
        }
    }

    if (uIllum == 2) {
        for (int i = 0; i < numLights; i++) {
            eye = normalize(vEye[i]);
            light = normalize(vLightRay[i]);
            reflection = reflect(light, normal);
            color += (uLd[i] * uKd * clamp(dot(normal, -light), 0.0, 1.0));
            color += (uLs[i] * uKs * pow(max(dot(reflection, eye), 0.0), uNs) * 4.0);
        }
    }

    fragColor =  vec4(color, uD);
}