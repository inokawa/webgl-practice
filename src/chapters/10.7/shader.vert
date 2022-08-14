#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec3 aVertexTangent;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;
out vec3 vTangentLightDirection;
out vec3 vTangentEyeDirection;

void main(void) {
  // Transformed vertex position
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

  // Transformed normal position
  vec3 normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
  vec3 tangent = vec3(uNormalMatrix * vec4(aVertexTangent, 1.0));
  vec3 bitangent = cross(normal, tangent);

  mat3 tbnMatrix = mat3(
    tangent.x, bitangent.x, normal.x,
    tangent.y, bitangent.y, normal.y,
    tangent.z, bitangent.z, normal.z
  );

  // Eye direction, from camera position to vertex
  vec3 eyeDirection = -vertex.xyz;

  // Light direction, from light position to vertex
  vec3 lightDirection = uLightPosition - vertex.xyz;
  vTangentEyeDirection = eyeDirection * tbnMatrix;

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoords = aVertexTextureCoords;
  vTangentLightDirection = lightDirection * tbnMatrix;
}