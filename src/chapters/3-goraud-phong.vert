#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
// Lights
uniform vec3 uLightDirection;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;
// Materials
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform float uShininess;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec4 vVertexColor;

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

    // Calculate the normal vector
    vec3 N = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

    // Normalized light direction
    vec3 L = normalize(uLightDirection);

    // Dot product of the normal product and negative light direction vector
    float lambertTerm = dot(N, -L);

    // Ambient
    vec4 Ia = uLightAmbient * uMaterialAmbient;
    // Diffuse
    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
    // Specular
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    if (lambertTerm > 0.0) {
        Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
        vec3 eyeVec = -vec3(vertex.xyz);
        vec3 E = normalize(eyeVec);
        vec3 R = reflect(L, N);
        float specular = pow(max(dot(R, E), 0.0), uShininess);
        Is = uLightSpecular * uMaterialSpecular * specular;
    }

    // Set varying to be used in fragment shader
    vVertexColor = vec4(vec3(Ia + Id + Is), 1.0);
    gl_Position = uProjectionMatrix * vertex;
}
