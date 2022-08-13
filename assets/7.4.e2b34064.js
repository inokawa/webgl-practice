import{_ as c,c as l}from"./index.bd1470a7.js";import{c as v,l as x,d as u}from"./webgl.35ad78b4.js";import{S as d}from"./Scene.440e4328.js";import{C as p,a as C}from"./Controls.e1269ed6.js";import{T as h}from"./Transforms.c39cd1ae.js";import"./mat4.356e1817.js";const L=`#version 300 es
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
}`,U=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform sampler2D uSampler;

in vec4 vColor;
in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    fragColor = vColor * texture(uSampler, vTextureCoords);
}`,b="https://inokawa.github.io/webgl-practice/assets/webgl.14634ff0.png",D=async e=>{let a=!1;e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const r=v(e,L,U,["aVertexPosition","aVertexNormal","aVertexColor","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uAlpha","uUseVertexColor","uUseLambert","uSampler"]),s=new d(e,r);s.add(await c(()=>import("./cube-texture.effbe9d8.js"),[]));const i=new p("ORBITING_TYPE");i.goHome([0,0,4]),i.setFocus([0,0,0]),i.setAzimuth(45),i.setElevation(-30),new C(i,e.canvas);const n=new h(r,i,e.canvas);r.use(),r.setUniform("uLightPosition","vec3",[0,5,20]),r.setUniform("uLightAmbient","vec4",[1,1,1,1]),r.setUniform("uLightDiffuse","vec4",[1,1,1,1]),r.setUniform("uAlpha","float",1),r.setUniform("uUseVertexColor","bool",a),r.setUniform("uUseLambert","bool",!0);const m=x(e,b),f=l({"Use Lambert Term":{value:!0,onChange:t=>r.setUniform("uUseLambert","bool",t)},"Use Per Vertex":{value:a,onChange:t=>a=t},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:t=>r.setUniform("uAlpha","float",t)}});return s.start(t=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),n.updatePerspective();try{t.forEach(o=>{n.calculateModelView(),n.push(),n.setMatrixUniforms(),n.pop(),r.setUniform("uMaterialDiffuse","vec4",o.diffuse),r.setUniform("uMaterialAmbient","vec4",o.ambient),r.setUniform("uWireframe","bool",o.wireframe),r.setUniform("uUseVertexColor","bool",a),o.textureCoords&&(m.bind(),r.setUniform("uSampler","sampler2D",0)),o.wireframe?u(e,o.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),u(e,o.vao,"TRIANGLES"),e.cullFace(e.BACK),u(e,o.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(o){console.error(o)}}),()=>{s.dispose(),f(),m.dispose()}};export{D as init};
