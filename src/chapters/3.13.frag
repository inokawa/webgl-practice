#version 300 es
precision mediump float;

uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform float uShininess;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;

out vec4 fragColor;

void main(void) {
    vec3 L = normalize(vLightRay);
    vec3 N = normalize(vNormal);
    float lambertTerm = dot(N, -L);

    // Ambient
    vec4 Ia = uLightAmbient * uMaterialAmbient;
    // Diffuse
    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
    // Specular
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    if (lambertTerm > 0.0) {
    // Update diffuse
    Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
    vec3 E = normalize(vEyeVector);
    vec3 R = reflect(L, N);
    float specular = pow( max(dot(R, E), 0.0), uShininess);
    // Update specular
    Is = uLightSpecular * uMaterialSpecular * specular;
    }

    // Final fragment color takes into account ambient, diffuse, and specular
    fragColor = vec4(vec3(Ia + Id + Is), 1.0);
}