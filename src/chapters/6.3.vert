#version 300 es
precision mediump float;

uniform bool uUseVertexColor;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;
uniform float uAlpha;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform bool uUseLambert;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec4 vColor;

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

    float lambertTerm = 1.0;

    if (uUseLambert) {
        vec3 normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
        vec3 lightDirection = normalize(-uLightPosition);
        lambertTerm = max(dot(normal, -lightDirection), 0.20);
    }

    vec4 Ia = uLightAmbient * uMaterialAmbient;
    vec4 Id = vec4(0.0);

    if (uUseVertexColor) {
        Id = uLightDiffuse * aVertexColor * lambertTerm;
    }
    else {
        Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
    }

    vColor = vec4(vec3(Ia + Id), uAlpha);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}