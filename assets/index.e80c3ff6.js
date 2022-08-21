import{c as d,l as T,d as c}from"./webgl.82b1ccd1.js";import{S as v}from"./Scene.25a8f8df.js";import{l as x,c as E}from"./index.54a47621.js";import{C,a as f}from"./Controls.dd77c90e.js";import{T as P}from"./Transforms.7a4d5f34.js";import"./mat4.1c5dccf4.js";const _=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoords = (aVertexTextureCoords * 3.0) - vec2(1.0, 1.0);
}`,w=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    fragColor = texture(uSampler, vTextureCoords);
}`,R="https://inokawa.github.io/webgl-practice/assets/webgl-marble.d1378514.png",L=async e=>{e.clearColor(1,1,1,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const a=d(e,_,w,["aVertexPosition","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uSampler"]),i=new v(e,a);i.add(await x("/models/cube-texture.json"));const o=new C("ORBITING_TYPE");o.goHome([0,0,3]),o.setFocus([0,0,0]),o.setAzimuth(45),o.setElevation(-30),new f(o,e.canvas);const t=new P(a,o,e.canvas);a.use();const s=T(e,R),u=["CLAMP_TO_EDGE","REPEAT","MIRRORED_REPEAT"],m=E({...["TEXTURE_WRAP_S","TEXTURE_WRAP_T"].reduce((n,r)=>(n[r]={value:u[1],options:u,onChange:p=>{s.use(()=>{e.texParameteri(e.TEXTURE_2D,e[r],e[p])})}},n),{})});return i.start(n=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),t.updatePerspective();try{n.forEach(r=>{t.calculateModelView(),t.push(),t.setMatrixUniforms(),t.pop(),r.textureCoords&&(s.bind(0),a.setUniform("uSampler","sampler2D",0)),r.wireframe?c(e,r.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),c(e,r.vao,"TRIANGLES"),e.cullFace(e.BACK),c(e,r.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(r){console.error(r)}}),()=>{i.dispose(),m(),s.dispose()}};export{L as init};
