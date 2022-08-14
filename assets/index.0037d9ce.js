import{_ as i,c as x}from"./index.183b75b1.js";import{_}from"./dynamic-import-helper.f17e3fe2.js";import{c as C,l as T,d as V}from"./webgl.0c8613b1.js";import{S as E}from"./Scene.586f267e.js";import{C as P,a as h}from"./Controls.56be8400.js";import{T as L}from"./Transforms.bfad7b1c.js";import{P as M}from"./PostProcess.b18d69c2.js";import{t as D,s as g}from"./mat4.7c6b59f8.js";const w=`#version 300 es
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
}`,b=`#version 300 es
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
}`,p=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in vec2 vTextureCoords;

out vec4 fragColor;

void main(void) {
    vec4 frameColor = texture(uSampler, vTextureCoords);
    fragColor = frameColor;
}`,A=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"})),N="https://inokawa.github.io/webgl-practice/assets/webgl.049018a7.gif",S="https://inokawa.github.io/webgl-practice/assets/noise.8c9594e0.png",H=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const o=C(e,w,b,["aVertexPosition","aVertexNormal","aVertexColor","aVertexTextureCoords"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uAlpha","uUseVertexColor","uOffscreen","uSampler"]),u=new E(e,o);u.add({...await i(()=>import("./cube-texture.5a84f6ea.js"),[]),image:N},"cube",{position:[0,0,0],scale:[6,6,6]});const t=new P("ORBITING_TYPE");t.goHome([0,0,25]),t.setFocus([0,0,0]),t.setElevation(-40),t.setAzimuth(-30),new h(t,e.canvas);const r=new L(o,t,e.canvas);o.use(),o.setUniform("uLightPosition","vec3",[0,5,20]),o.setUniform("uLightAmbient","vec4",[1,1,1,1]),o.setUniform("uLightDiffuse","vec4",[1,1,1,1]),o.setUniform("uAlpha","float",1);const c=T(e,S),a=new M(e,v,p),f=["Normal","Greyscale","Invert","Wavy","Blur","Film Grain"],d=x({Filters:{value:f[0],options:f,onChange:async m=>{const s=m.replace(" ","").toLowerCase();a.configureShader(v,(await _(Object.assign({"./post-blur.frag":()=>i(()=>import("./post-blur.2cf45f24.js"),[]),"./post-filmgrain.frag":()=>i(()=>import("./post-filmgrain.2398b1d7.js"),[]),"./post-greyscale.frag":()=>i(()=>import("./post-greyscale.fc9b64f0.js"),[]),"./post-invert.frag":()=>i(()=>import("./post-invert.05b272d2.js"),[]),"./post-normal.frag":()=>i(()=>Promise.resolve().then(()=>A),void 0),"./post-wavy.frag":()=>i(()=>import("./post-wavy.78f6659c.js"),[])}),`./post-${s}.frag`)).default)}}});return u.start(m=>{a.drawToFramebuffer(()=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),r.updatePerspective();try{o.use();const s=o.getUniform("uOffscreen");m.forEach(n=>{var l;r.calculateModelView(),r.push(),n.alias!=="floor"&&(D(r.modelViewMatrix,r.modelViewMatrix,n.position),g(r.modelViewMatrix,r.modelViewMatrix,n.scale)),r.setMatrixUniforms(),r.pop(),n.diffuse[3]<1&&!s?(e.disable(e.DEPTH_TEST),e.enable(e.BLEND)):(e.enable(e.DEPTH_TEST),e.disable(e.BLEND)),o.setUniform("uMaterialDiffuse","vec4",n.diffuse),o.setUniform("uMaterialAmbient","vec4",n.ambient),o.setUniform("uUseVertexColor","bool",!1),n.textureCoords&&((l=n.texture)==null||l.bind(0),o.setUniform("uSampler","sampler2D",0)),V(e,n.vao,"TRIANGLES")})}catch(s){console.error(s)}}),a.draw(()=>{a.program.uniforms.uNoiseSampler&&(c.bind(1),a.program.setUniform("uNoiseSampler","sampler2D",1))})}),()=>{u.dispose(),a.dispose(),d(),c.dispose()}};export{H as init};
