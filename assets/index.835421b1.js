import{c as p,l as u,d as i}from"./webgl.0c8613b1.js";import{i as d}from"./webgl.f1d020b4.js";import{S as x}from"./Scene.2a13302e.js";import{C as v,a as f}from"./Controls.6a1267ae.js";import{T as C}from"./Transforms.e4aeeb69.js";import{l as T}from"./index.25777b06.js";import"./mat4.967e88dd.js";const l=`#version 300 es
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
}`,S=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void){
    fragColor = texture(uSampler2, vTextureCoords) * texture(uSampler, vTextureCoords);
}`,E="https://inokawa.github.io/webgl-practice/assets/light.8f95d2e2.png",N=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.disable(e.BLEND),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const t=p(e,l,S,["aVertexPosition","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uSampler","uSampler2"]),n=new x(e,t);n.add(await T("/models/cube-texture.json"));const o=new v("ORBITING_TYPE");o.goHome([0,0,4]),o.setFocus([0,0,0]),o.setAzimuth(45),o.setElevation(-30),new f(o,e.canvas);const a=new C(t,o,e.canvas);t.use();const s=u(e,d),m=u(e,E);return n.start(c=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{c.forEach(r=>{a.calculateModelView(),a.push(),a.setMatrixUniforms(),a.pop(),r.textureCoords&&(s.bind(0),t.setUniform("uSampler","sampler2D",0),m.bind(1),t.setUniform("uSampler","sampler2D",1)),r.wireframe?i(e,r.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),i(e,r.vao,"TRIANGLES"),e.cullFace(e.BACK),i(e,r.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(r){console.error(r)}}),()=>{n.dispose(),s.dispose(),m.dispose()}};export{N as init};
