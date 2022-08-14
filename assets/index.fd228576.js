import{_}from"./index.f28f68ca.js";import{c as v,l as x,d as c}from"./webgl.0c8613b1.js";import{i as d}from"./webgl.f1d020b4.js";import{S as C}from"./Scene.5278479c.js";import{C as U,a as P}from"./Controls.1d4ab943.js";import{T as b}from"./Transforms.0f5de523.js";import"./mat4.a3a2a3f4.js";const R=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;
out vec3 vVertexNormal;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoords = aVertexTextureCoords;
  vVertexNormal = (uNormalMatrix * vec4(-aVertexPosition, 1.0)).xyz;
}`,f=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;
uniform samplerCube uCubeSampler;

in vec2 vTextureCoords;
in vec3 vVertexNormal;

out vec4 fragColor;

void main(void) {
    fragColor = texture(uSampler, vTextureCoords) * texture(uCubeSampler, vVertexNormal);
}`,A="https://inokawa.github.io/webgl-practice/assets/positive-x.9ddde2b4.png",M="https://inokawa.github.io/webgl-practice/assets/negative-x.995b8769.png",w="https://inokawa.github.io/webgl-practice/assets/positive-y.9bd4eaa6.png",I="https://inokawa.github.io/webgl-practice/assets/negative-y.ac4986f3.png",B="https://inokawa.github.io/webgl-practice/assets/positive-z.138b1058.png",N="https://inokawa.github.io/webgl-practice/assets/negative-z.0caf0817.png",D=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.disable(e.BLEND),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const n=v(e,R,f,["aVertexPosition","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uSampler","uCubeSampler"]),u=new C(e,n);u.add(await _(()=>import("./cube-texture.5a84f6ea.js"),[]));const o=new U("ORBITING_TYPE");o.goHome([0,0,4]),o.setFocus([0,0,0]),o.setAzimuth(45),o.setElevation(-30),new P(o,e.canvas);const s=new b(n,o,e.canvas);n.use();const T=x(e,d),r=e.createTexture();e.bindTexture(e.TEXTURE_CUBE_MAP,r),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MIN_FILTER,e.LINEAR),i(e,e.TEXTURE_CUBE_MAP_POSITIVE_X,r,A),i(e,e.TEXTURE_CUBE_MAP_NEGATIVE_X,r,M),i(e,e.TEXTURE_CUBE_MAP_POSITIVE_Y,r,w),i(e,e.TEXTURE_CUBE_MAP_NEGATIVE_Y,r,I),i(e,e.TEXTURE_CUBE_MAP_POSITIVE_Z,r,B),i(e,e.TEXTURE_CUBE_MAP_NEGATIVE_Z,r,N);function i(t,a,m,p){const E=new Image;E.src=p,E.onload=()=>{t.bindTexture(t.TEXTURE_CUBE_MAP,m),t.texImage2D(a,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,E),t.bindTexture(t.TEXTURE_CUBE_MAP,null)}}return u.start(t=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),s.updatePerspective();try{t.forEach(a=>{s.calculateModelView(),s.push(),s.setMatrixUniforms(),s.pop(),a.textureCoords&&(T.bind(0),n.setUniform("uSampler","sampler2D",0)),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_CUBE_MAP,r),n.setUniform("uCubeSampler","samplerCube",1),a.wireframe?c(e,a.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),c(e,a.vao,"TRIANGLES"),e.cullFace(e.BACK),c(e,a.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(a){console.error(a)}}),()=>{u.dispose(),T.dispose(),e.deleteTexture(r)}};export{D as init};
