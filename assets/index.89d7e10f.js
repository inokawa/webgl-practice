import{c as S,d as C}from"./webgl.82b1ccd1.js";import{S as L}from"./Scene.d49580de.js";import{l as N,c as p,n as T}from"./index.839a71c0.js";import{C as M,a as E}from"./Controls.c85d7e5f.js";import{T as O}from"./Transforms.b67d7768.js";import"./mat4.60b4ffa4.js";const R=`#version 300 es
precision mediump float;

uniform float uAlpha;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec4 aVertexColor;

out vec4 vColor;

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  float lambertTerm = 1.0;
  vec4 Ia = uLightAmbient * uMaterialAmbient;
  vec4 Id = uLightDiffuse * aVertexColor * lambertTerm;
  vColor = vec4(vec3(Ia + Id), uAlpha);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,U=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = uMaterialDiffuse;
    }
    else {
        fragColor = vColor;
    }
}`,w=async e=>{let d=!0,v=!0,A=!0,u=[0,1,0],s=1;e.clearColor(.9,.9,.9,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.blendColor(...u,s),e.enable(e.CULL_FACE);let m=e.FUNC_ADD,c=e.SRC_ALPHA,f=e.ONE_MINUS_SRC_ALPHA;const o=S(e,R,U,["aVertexPosition","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uAlpha","uUseLambert"]),l=new L(e,o);l.add(await N("/models/cube-complex.json"),"cube");const i=new M("ORBITING_TYPE");i.goHome([0,0,4]),i.setFocus([0,0,0]),i.setAzimuth(50),i.setElevation(-30),new E(i,e.canvas);const t=new O(o,i,e.canvas);o.use(),o.setUniform("uLightPosition","vec3",[0,5,20]),o.setUniform("uLightAmbient","vec4",[1,1,1,1]),o.setUniform("uLightDiffuse","vec4",[1,1,1,1]),o.setUniform("uAlpha","float",.5),o.setUniform("uUseLambert","bool",d);const _=["ZERO","ONE","SRC_COLOR","DST_COLOR","SRC_ALPHA","DST_ALPHA","CONSTANT_COLOR","CONSTANT_ALPHA","ONE_MINUS_SRC_ALPHA","ONE_MINUS_DST_ALPHA","ONE_MINUS_SRC_COLOR","ONE_MINUS_DST_COLOR","ONE_MINUS_CONSTANT_COLOR","ONE_MINUS_CONSTANT_ALPHA"];function r(n=!0){e[n?"enable":"disable"](e.BLEND),e.blendFunc(c,f),e.blendEquation(m),e.blendColor(...u,s)}const h=p({"Alpha Blending":{value:!0,onChange:r},"Render Front Face":{value:!0,onChange:n=>A=n},"Render Back Face":{value:!0,onChange:n=>v=n},"Alpha Value":{value:.5,min:0,max:1,step:.1,onChange:n=>o.setUniform("uAlpha","float",n)},"Blend Function":{value:m,options:["FUNC_ADD","FUNC_SUBTRACT","FUNC_REVERSE_SUBTRACT"],onChange:n=>{m=e[n],r()}},Source:{value:c,options:[..._,"SRC_ALPHA_SATURATE"],onChange:n=>{c=e[n],r()}},Destination:{value:f,options:_,onChange:n=>{f=e[n],r()}},"Blending Color":{value:[0,0,0],onChange:n=>{u=T(n),r()}},"Constant Alpha":{value:1,min:0,max:1,step:.1,onChange:n=>{s=n,r()}}});return l.start(n=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),t.updatePerspective();try{n.forEach(a=>{t.calculateModelView(),t.push(),t.setMatrixUniforms(),t.pop(),o.setUniform("uMaterialDiffuse","vec4",a.diffuse),o.setUniform("uMaterialAmbient","vec4",a.ambient),o.setUniform("uWireframe","bool",a.wireframe),a.wireframe?C(e,a.vao,"LINES"):(v&&(e.cullFace(e.FRONT),C(e,a.vao,"TRIANGLES")),A&&(e.cullFace(e.BACK),C(e,a.vao,"TRIANGLES")))})}catch(a){console.error(a)}}),()=>{l.dispose(),h()}};export{w as init};
