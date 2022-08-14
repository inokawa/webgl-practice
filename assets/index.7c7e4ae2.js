import{_ as u}from"./index.aa27f130.js";import{c as l,l as m,d as v}from"./webgl.0c8613b1.js";import{S as f}from"./Scene.0ac449a2.js";import{C as x,a as p}from"./Controls.de63c6e8.js";import{T as d}from"./Transforms.7c22a261.js";import"./mat4.a2b2ab51.js";const g=`#version 300 es
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
}`,h=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;

in vec2 vTextureCoords;
in vec3 vTangentLightDirection;
in vec3 vTangentEyeDirection;

out vec4 fragColor;

void main(void) {
    // Unpack tangent-space normal from texture
    vec3 normal = normalize(2.0 * (texture(uNormalSampler, vTextureCoords).rgb - 0.5));

    // Normalize the light direction and determine how much light is hitting this point
    vec3 lightDirection = normalize(vTangentLightDirection);
    float lambertTerm = max(dot(normal, lightDirection), 0.20);

    // Calculate Specular level
    vec3 eyeDirection = normalize(vTangentEyeDirection);
    vec3 reflectDir = reflect(-lightDirection, normal);
    float Is = pow(clamp(dot(reflectDir, eyeDirection), 0.0, 1.0), 8.0);

    // Combine lighting and material colors
    vec4 Ia = uLightAmbient * uMaterialAmbient;
    vec4 Id = uLightDiffuse * uMaterialDiffuse * texture(uSampler, vTextureCoords) * lambertTerm;

    fragColor = Ia + Id + Is;
}`,T="https://inokawa.github.io/webgl-practice/assets/fieldstone.4f2a53a3.jpg",D="https://inokawa.github.io/webgl-practice/assets/fieldstone-normal.06891319.jpg",V=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const t=l(e,g,h,["aVertexPosition","aVertexNormal","aVertexTangent","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uSampler","uNormalSampler"]),o=new f(e,t);o.add(await u(()=>import("./cube-texture.5a84f6ea.js"),[]));const i=new x("ORBITING_TYPE");i.goHome([0,0,2]),i.setFocus([0,0,0]),i.setAzimuth(40),i.setElevation(-30),new p(i,e.canvas);const r=new d(t,i,e.canvas);t.use(),t.setUniform("uLightPosition","vec3",[0,5,20]),t.setUniform("uLightAmbient","vec4",[1,1,1,1]),t.setUniform("uLightDiffuse","vec4",[1,1,1,1]);const a=m(e,T),s=m(e,D);return o.start(c=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),r.updatePerspective();try{c.forEach(n=>{r.calculateModelView(),r.push(),r.setMatrixUniforms(),r.pop(),t.setUniform("uMaterialDiffuse","vec4",n.diffuse),t.setUniform("uMaterialAmbient","vec4",n.ambient),n.vao.use(()=>{n.textureCoords&&(a.bind(0),t.setUniform("uSampler","sampler2D",0),s.bind(1),t.setUniform("uNormalSampler","sampler2D",1)),v(e,n.vao,"TRIANGLES")})})}catch(n){console.error(n)}}),()=>{o.dispose(),a.dispose(),s.dispose()}};export{V as init};
