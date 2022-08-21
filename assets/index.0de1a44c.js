import{c as m,d as s}from"./webgl.0c8613b1.js";import{i as c}from"./webgl.f1d020b4.js";import{S as R}from"./Scene.e3e80ced.js";import{l as x,c as d}from"./index.fd6ee1f9.js";import{C as _,a as p}from"./Controls.8b956664.js";import{T as v}from"./Transforms.2df241e6.js";import"./mat4.9401974d.js";const A=`#version 300 es
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
}`,N=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    fragColor = texture(uSampler, vTextureCoords);
}`,D=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.disable(e.BLEND),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const i=m(e,A,N,["aVertexPosition","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uSampler"]),E=new R(e,i);E.add(await x("/models/cube-texture.json"));const r=new _("ORBITING_TYPE");r.goHome([0,0,0]),r.dolly(-4),r.setFocus([0,0,0]),r.setAzimuth(45),r.setElevation(-30),new p(r,e.canvas);const a=new v(i,r,e.canvas);i.use();const n=e.createTexture(),T=new Image;T.src=c,T.onload=()=>{e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,T),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null)};const u=d({Distance:{value:0,min:0,max:20,step:.1,onChange:o=>{r.dolly(-o),r.update()}},"Mag Filter":{value:"NEAREST",options:["NEAREST","LINEAR"],onChange:o=>{e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e[o]),e.bindTexture(e.TEXTURE_2D,null)}},"Min Filter":{value:"NEAREST",options:["NEAREST","LINEAR","NEAREST_MIPMAP_NEAREST","LINEAR_MIPMAP_NEAREST","NEAREST_MIPMAP_LINEAR","LINEAR_MIPMAP_LINEAR"],onChange:o=>{e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e[o]),e.bindTexture(e.TEXTURE_2D,null)}}});return E.start(o=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{o.forEach(t=>{a.calculateModelView(),a.push(),a.setMatrixUniforms(),a.pop(),t.textureCoords&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,n),i.setUniform("uSampler","sampler2D",0)),t.wireframe?s(e,t.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),s(e,t.vao,"TRIANGLES"),e.cullFace(e.BACK),s(e,t.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(t){console.error(t)}}),()=>{E.dispose(),u(),e.deleteTexture(n)}};export{D as init};
