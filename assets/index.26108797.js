import{_ as s,c as R}from"./index.a9129b05.js";import{_ as h}from"./dynamic-import-helper.f17e3fe2.js";import{c as E,l as x,d as p}from"./webgl.33373512.js";import{S as _}from"./Scene.5ae23bf0.js";import{C as b,a as A}from"./Controls.9b5bb8fc.js";import{T as F}from"./Transforms.c39cd1ae.js";import{t as g,s as D}from"./mat4.356e1817.js";const U=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform bool uUseVertexColor;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;
in vec2 aVertexTextureCoords;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;
out vec4 vFinalColor;
out vec2 vTextureCoords;

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec4 light = vec4(uLightPosition,1.0);

  vFinalColor = aVertexColor;
  vTextureCoords = aVertexTextureCoords;
  vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
  vLightRay = vertex.xyz-light.xyz;
  vEyeVector = -vec3(vertex.xyz);

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,C=`#version 300 es
precision mediump float;

uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uOffscreen;
uniform sampler2D uSampler;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;
in vec4 vFinalColor;
in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    if (uOffscreen) {
        fragColor = uMaterialDiffuse;
        return;
    }

    // Ambient
    vec4 Ia = uLightAmbient * uMaterialAmbient;

    // Diffuse
    vec3 L = normalize(vLightRay);
    vec3 N = normalize(vNormal);
    float lambertTerm = max(dot(N, -L),0.33);
    vec4 Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;

    // Specular
    vec3 E = normalize(vEyeVector);
    vec3 R = reflect(L, N);
    float specular = pow( max(dot(R, E), 0.5), 50.0);
    vec4 Is = vec4(0.5) * specular;

    vec4 finalColor = Ia + Id + Is;

    if (uMaterialDiffuse.a != 1.0) {
        finalColor.a = uMaterialDiffuse.a;
    }
    else {
        finalColor.a = 1.0;
    }

    fragColor =  finalColor * texture(uSampler, vec2(vTextureCoords.s, vTextureCoords.t));
}`,v=`#version 300 es
precision mediump float;

in vec2 aVertexPosition;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;

void main(void) {
    vTextureCoords = aVertexTextureCoords;
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}`,d=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    vec4 frameColor = texture(uSampler, vTextureCoords);
    fragColor = frameColor;
}`,B=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"})),P="https://inokawa.github.io/webgl-practice/assets/webgl.049018a7.gif",M="https://inokawa.github.io/webgl-practice/assets/noise.8c9594e0.png";class V{constructor(e,i,t){this.gl=e,this.texture=null,this.framebuffer=null,this.renderbuffer=null,this.vertexBuffer=null,this.textureBuffer=null,this.startTime=Date.now(),this.canvas=e.canvas,this.configureFramebuffer(),this.configureGeometry(),this.configureShader(i,t)}configureFramebuffer(){const e=this.gl,{width:i,height:t}=this.canvas;this.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i,t,0,e.RGBA,e.UNSIGNED_BYTE,null),this.renderbuffer=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this.renderbuffer),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,i,t),this.framebuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,this.renderbuffer),e.bindTexture(e.TEXTURE_2D,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null)}configureGeometry(){const e=this.gl,i=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1],t=[0,0,1,0,0,1,0,1,1,0,1,1];this.vertexBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(i),e.STATIC_DRAW),this.textureBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.textureBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,null)}configureShader(e,i){const t=this.gl;this.program&&this.program.dispose(),this.program=E(t,e,i,[],[])}validateSize(){const e=this.gl,{width:i,height:t}=this.canvas;e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i,t,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindRenderbuffer(e.RENDERBUFFER,this.renderbuffer),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,i,t),e.bindTexture(e.TEXTURE_2D,null),e.bindRenderbuffer(e.RENDERBUFFER,null)}bind(){const e=this.gl,{width:i,height:t}=this.canvas;this.program.use(),e.enableVertexAttribArray(this.program.attributes.aVertexPosition),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer),e.vertexAttribPointer(this.program.attributes.aVertexPosition,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(this.program.attributes.aVertexTextureCoords),e.bindBuffer(e.ARRAY_BUFFER,this.textureBuffer),e.vertexAttribPointer(this.program.attributes.aVertexTextureCoords,2,e.FLOAT,!1,0,0),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),this.program.setUniform("uSampler","sampler2D",0),this.program.uniforms.uTime&&this.program.setUniform("uTime","float",(Date.now()-this.startTime)/1e3),this.program.uniforms.uInverseTextureSize&&this.program.setUniform("uInverseTextureSize","vec2",[1/i,1/t])}draw(){const e=this.gl;e.drawArrays(e.TRIANGLES,0,6)}dispose(){this.program.dispose(),this.gl.deleteTexture(this.texture),this.gl.deleteFramebuffer(this.framebuffer),this.gl.deleteRenderbuffer(this.renderbuffer),this.gl.deleteBuffer(this.vertexBuffer),this.gl.deleteBuffer(this.textureBuffer)}}const G=async r=>{r.clearColor(.9,.9,.9,1),r.clearDepth(100),r.enable(r.DEPTH_TEST),r.depthFunc(r.LESS),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA);const e=E(r,U,C,["aVertexPosition","aVertexNormal","aVertexColor","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uAlpha","uUseVertexColor","uOffscreen","uSampler"]),i=new _(r,e);i.add({...await s(()=>import("./cube-texture.effbe9d8.js"),[]),image:P},"cube",{position:[0,0,0],scale:[6,6,6]});const t=new b("ORBITING_TYPE");t.goHome([0,0,25]),t.setFocus([0,0,0]),t.setElevation(-40),t.setAzimuth(-30),new A(t,r.canvas);const o=new F(e,t,r.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,5,20]),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uAlpha","float",1);const l=x(r,M),a=new V(r,v,d),m=["Normal","Greyscale","Invert","Wavy","Blur","Film Grain"],T=R({Filters:{value:m[0],options:m,onChange:async f=>{const u=f.replace(" ","").toLowerCase();a.configureShader(v,(await h(Object.assign({"./post-blur.frag":()=>s(()=>import("./post-blur.2cf45f24.js"),[]),"./post-filmgrain.frag":()=>s(()=>import("./post-filmgrain.2398b1d7.js"),[]),"./post-greyscale.frag":()=>s(()=>import("./post-greyscale.fc9b64f0.js"),[]),"./post-invert.frag":()=>s(()=>import("./post-invert.05b272d2.js"),[]),"./post-normal.frag":()=>s(()=>Promise.resolve().then(()=>B),void 0),"./post-wavy.frag":()=>s(()=>import("./post-wavy.78f6659c.js"),[])}),`./post-${u}.frag`)).default)}}});return i.start(f=>{a.validateSize(),r.bindFramebuffer(r.FRAMEBUFFER,a.framebuffer),r.viewport(0,0,r.canvas.width,r.canvas.height),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),o.updatePerspective();try{e.use();const u=e.getUniform("uOffscreen");f.forEach(n=>{var c;o.calculateModelView(),o.push(),n.alias!=="floor"&&(g(o.modelViewMatrix,o.modelViewMatrix,n.position),D(o.modelViewMatrix,o.modelViewMatrix,n.scale)),o.setMatrixUniforms(),o.pop(),n.diffuse[3]<1&&!u?(r.disable(r.DEPTH_TEST),r.enable(r.BLEND)):(r.enable(r.DEPTH_TEST),r.disable(r.BLEND)),e.setUniform("uMaterialDiffuse","vec4",n.diffuse),e.setUniform("uMaterialAmbient","vec4",n.ambient),e.setUniform("uUseVertexColor","bool",!1),n.textureCoords&&((c=n.texture)==null||c.bind(0),e.setUniform("uSampler","sampler2D",0)),p(r,n.vao,"TRIANGLES")})}catch(u){console.error(u)}r.bindFramebuffer(r.FRAMEBUFFER,null),a.bind(),a.program.uniforms.uNoiseSampler&&(l.bind(1),a.program.setUniform("uNoiseSampler","sampler2D",1)),a.draw()}),()=>{i.dispose(),a.dispose(),T(),l.dispose()}};export{G as init};
