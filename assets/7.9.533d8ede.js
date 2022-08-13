import{_ as p}from"./index.3657c1e4.js";import{c as d,l as u,d as n}from"./webgl.c7da4a4c.js";import{i as x}from"./webgl.f1d020b4.js";import{S as v}from"./Scene.0633bcd4.js";import{C as f,a as T}from"./Controls.32eba0ba.js";import{T as C}from"./Transforms.c39cd1ae.js";import"./mat4.356e1817.js";const _=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;

void main(void) {
  vTextureCoords = aVertexTextureCoords;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,l=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void){
    fragColor = texture(uSampler2, vTextureCoords) * texture(uSampler, vTextureCoords);
}`,E="https://inokawa.github.io/webgl-practice/assets/light.8f95d2e2.png",V=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const t=d(e,_,l,["aVertexPosition","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uSampler","uSampler2"]),i=new v(e,t);i.add(await p(()=>import("./cube-texture.effbe9d8.js"),[]));const o=new f("ORBITING_TYPE");o.goHome([0,0,4]),o.setFocus([0,0,0]),o.setAzimuth(45),o.setElevation(-30),new T(o,e.canvas);const a=new C(t,o,e.canvas);t.use();const s=u(e,x),m=u(e,E);return i.start(c=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{c.forEach(r=>{a.calculateModelView(),a.push(),a.setMatrixUniforms(),a.pop(),r.textureCoords&&(s.bind(0),t.setUniform("uSampler","sampler2D",0),m.bind(1),t.setUniform("uSampler","sampler2D",1)),r.wireframe?n(e,r.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),n(e,r.vao,"TRIANGLES"),e.cullFace(e.BACK),n(e,r.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(r){console.error(r)}}),()=>{i.dispose(),s.dispose(),m.dispose()}};export{V as init};
