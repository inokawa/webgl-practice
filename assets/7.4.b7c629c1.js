import{_ as v,c as x}from"./index.6ba4c711.js";import{c as T,d as m}from"./webgl.1a62ef1a.js";import{S as l}from"./Scene.60732141.js";import{C as E,a as U}from"./Controls.4ac6bf05.js";import{T as d}from"./Transforms.c39cd1ae.js";import"./mat4.356e1817.js";const p=`#version 300 es
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
}`,C=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform sampler2D uSampler;

in vec4 vColor;
in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    fragColor = vColor * texture(uSampler, vTextureCoords);
}`,L="https://inokawa.github.io/webgl-practice/assets/webgl.14634ff0.png",V=async e=>{let a=!1;e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0);const r=T(e,p,C,["aVertexPosition","aVertexNormal","aVertexColor","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uAlpha","uUseVertexColor","uUseLambert","uSampler"]),u=new l(e,r);u.add(await v(()=>import("./cube-texture.effbe9d8.js"),[]));const i=new E("ORBITING_TYPE");i.goHome([0,0,4]),i.setFocus([0,0,0]),i.setAzimuth(45),i.setElevation(-30),new U(i,e.canvas);const n=new d(r,i,e.canvas);r.use(),r.setUniform("uLightPosition","vec3",[0,5,20]),r.setUniform("uLightAmbient","vec4",[1,1,1,1]),r.setUniform("uLightDiffuse","vec4",[1,1,1,1]),r.setUniform("uAlpha","float",1),r.setUniform("uUseVertexColor","bool",a),r.setUniform("uUseLambert","bool",!0);const f=e.createTexture(),s=new Image;s.src=L,s.onload=()=>{e.bindTexture(e.TEXTURE_2D,f),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.bindTexture(e.TEXTURE_2D,null)};const c=x({"Use Lambert Term":{value:!0,onChange:t=>r.setUniform("uUseLambert","bool",t)},"Use Per Vertex":{value:a,onChange:t=>a=t},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:t=>r.setUniform("uAlpha","float",t)}});return u.start(t=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),n.updatePerspective();try{t.forEach(o=>{n.calculateModelView(),n.push(),n.setMatrixUniforms(),n.pop(),r.setUniform("uMaterialDiffuse","vec4",o.diffuse),r.setUniform("uMaterialAmbient","vec4",o.ambient),r.setUniform("uWireframe","bool",o.wireframe),r.setUniform("uUseVertexColor","bool",a),o.textureCoords&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,f),r.setUniform("uSampler","sampler2D",0)),o.wireframe?m(e,o.vao,"LINES"):(e.enable(e.CULL_FACE),e.cullFace(e.FRONT),m(e,o.vao,"TRIANGLES"),e.cullFace(e.BACK),m(e,o.vao,"TRIANGLES"),e.disable(e.CULL_FACE))})}catch(o){console.error(o)}}),()=>{u.dispose(),c()}};export{V as init};
