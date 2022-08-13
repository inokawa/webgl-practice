import{_ as c,c as l}from"./index.4e49f69b.js";import{c as v,l as x,d as s}from"./webgl.35ad78b4.js";import{i as d}from"./webgl.f1d020b4.js";import{S as C}from"./Scene.b530701c.js";import{C as p,a as L}from"./Controls.826b88f4.js";import{T as h}from"./Transforms.c39cd1ae.js";import"./mat4.356e1817.js";const U=`#version 300 es
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
in vec2 aVertexTextureCoords;

out vec4 vColor;
out vec2 vTextureCoords;

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
  vTextureCoords = aVertexTextureCoords;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,T=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform sampler2D uSampler;

in vec4 vColor;
in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    fragColor = vColor * texture(uSampler, vTextureCoords);
}`,E=async e=>{let a=!1;e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const r=v(e,U,T,["aVertexPosition","aVertexNormal","aVertexColor","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uAlpha","uUseVertexColor","uUseLambert","uSampler"]),u=new C(e,r);u.add(await c(()=>import("./cube-texture.effbe9d8.js"),[]));const t=new p("ORBITING_TYPE");t.goHome([0,0,4]),t.setFocus([0,0,0]),t.setAzimuth(45),t.setElevation(-30),new L(t,e.canvas);const n=new h(r,t,e.canvas);r.use(),r.setUniform("uLightPosition","vec3",[0,5,20]),r.setUniform("uLightAmbient","vec4",[1,1,1,1]),r.setUniform("uLightDiffuse","vec4",[1,1,1,1]),r.setUniform("uAlpha","float",1),r.setUniform("uUseVertexColor","bool",a),r.setUniform("uUseLambert","bool",!0);const m=x(e,d),f=l({"Use Lambert Term":{value:!0,onChange:i=>r.setUniform("uUseLambert","bool",i)},"Use Per Vertex":{value:a,onChange:i=>a=i},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:i=>r.setUniform("uAlpha","float",i)}});return u.start(i=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),n.updatePerspective();try{i.forEach(o=>{n.calculateModelView(),n.push(),n.setMatrixUniforms(),n.pop(),r.setUniform("uMaterialDiffuse","vec4",o.diffuse),r.setUniform("uMaterialAmbient","vec4",o.ambient),r.setUniform("uWireframe","bool",o.wireframe),r.setUniform("uUseVertexColor","bool",a),o.textureCoords&&(m.bind(),r.setUniform("uSampler","sampler2D",0)),o.wireframe?s(e,o.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),s(e,o.vao,"TRIANGLES"),e.cullFace(e.BACK),s(e,o.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(o){console.error(o)}}),()=>{u.dispose(),f(),m.dispose()}};export{E as init};
