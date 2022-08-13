import{_ as M,c as R,d as U,n as b}from"./index.3657c1e4.js";import{c as P,d as O}from"./webgl.c7da4a4c.js";import{S as F}from"./Scene.0633bcd4.js";import{C as x,a as D}from"./Controls.32eba0ba.js";import{T as w}from"./Transforms.c39cd1ae.js";import{F as I}from"./Floor.7b1674dd.js";import{t as E,s as V}from"./mat4.356e1817.js";const g=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec4 uMaterialDiffuse;
uniform vec3 uPositionLight;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vLightRay;
out vec4 vFinalColor;

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
  vec4 positionLight = vec4(uPositionLight, 1.0);
  vLightRay = vertex.xyz - positionLight.xyz;
  vFinalColor = uMaterialDiffuse;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
`,H=`#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uUseLambert;

in vec3 vNormal;
in vec3 vLightRay;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);
        float lambertTerm	= clamp(dot(N, -L), 0.0, 1.0);
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        vec4 Id = uLightDiffuse * uMaterialDiffuse;
    if (uUseLambert) {
        Id = Id * lambertTerm;
    }
        fragColor = vec4(Ia.rgb + Id.rgb, uMaterialDiffuse.a);
    }
}`,k=async e=>{let _=!0,L=!0,A=!0,m=!0,l=!0,h=[0,1,1,1],N=[.7,0,.7,1],d=[0,1,0],C=1;e.clearColor(.9,.9,.9,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.blendColor(...d,C),e.enable(e.CULL_FACE);let c=e.FUNC_ADD,f=e.SRC_ALPHA,v=e.ONE_MINUS_SRC_ALPHA;const i=P(e,g,H,["aVertexPosition","aVertexNormal"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uUseLambert"]),r=new F(e,i);r.add(new I(80,2)),r.add({...await M(()=>import("./cone3.edde918c.js"),[]),diffuse:h},"cone"),r.add({...await M(()=>import("./sphere2.653d9a7a.js"),[]),diffuse:N},"sphere");const a=new x("ORBITING_TYPE");a.goHome([0,5,35]),a.setFocus([0,0,0]),a.setAzimuth(25),a.setElevation(-25),new D(a,e.canvas);const t=new w(i,a,e.canvas);i.use(),i.setUniform("uLightPosition","vec3",[0,5,20]),i.setUniform("uLightAmbient","vec4",[1,1,1,1]),i.setUniform("uLightDiffuse","vec4",[1,1,1,1]),i.setUniform("uUseLambert","bool",m);const p=["ZERO","ONE","SRC_COLOR","DST_COLOR","SRC_ALPHA","DST_ALPHA","CONSTANT_COLOR","CONSTANT_ALPHA","ONE_MINUS_SRC_ALPHA","ONE_MINUS_DST_ALPHA","ONE_MINUS_SRC_COLOR","ONE_MINUS_DST_COLOR","ONE_MINUS_CONSTANT_COLOR","ONE_MINUS_CONSTANT_ALPHA"],S=n=>n?"enable":"disable";function u(n=!0){e[n?"enable":"disable"](e.BLEND),e.blendFunc(f,v),e.blendEquation(c),e.blendColor(...d,C)}const T=R({Blending:{value:_,onChange:u},"Depth Testing":{value:L,onChange:n=>e[S(n)](e.DEPTH_TEST)},"Back Face Culling":{value:A,onChange:n=>e[S(n)](e.CULL_FACE)},Lambert:{value:m,onChange:n=>m=n},Floor:{value:l,onChange:n=>l=n},...[{name:"Sphere",id:"sphere",color:N},{name:"Cone",id:"cone",color:h}].reduce((n,o)=>(n={...n,[`${o.name} Alpha`]:{value:1,min:0,max:1,step:.1,onChange:s=>r.get(o.id).diffuse[3]=s},[`${o.name} Color`]:{value:U(o.color),onChange:s=>r.get(o.id).diffuse=b(s)}},n),{}),"Blend Function":{value:c,options:["FUNC_ADD","FUNC_SUBTRACT","FUNC_REVERSE_SUBTRACT"],onChange:n=>{c=e[n],u()}},Source:{value:f,options:[...p,"SRC_ALPHA_SATURATE"],onChange:n=>{f=e[n],u()}},Destination:{value:v,options:p,onChange:n=>{v=e[n],u()}},"Blending Color":{value:[0,0,0],onChange:n=>{d=b(n),u()}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:n=>{C=n,u()}},"Render Order":{value:"Cone First",options:["Cone First","Sphere First"],onChange:n=>{n==="Sphere First"?(r.renderSooner("sphere"),r.renderFirst("floor")):(r.renderSooner("cone"),r.renderFirst("floor"))}},Reset:()=>{L=!0,_=!0,A=!0,m=!0,l=!0,c=e.FUNC_ADD,f=e.SRC_ALPHA,v=e.ONE_MINUS_SRC_ALPHA,a.goHome([0,5,35]),a.setFocus([0,0,0]),a.setAzimuth(25),a.setElevation(-25)}});return r.start(n=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),t.updatePerspective();try{n.forEach(o=>{const{alias:s}=o;s==="floor"&&!l||(t.calculateModelView(),t.push(),s==="cone"&&E(t.modelViewMatrix,t.modelViewMatrix,[0,0,-3.5]),s==="sphere"&&(V(t.modelViewMatrix,t.modelViewMatrix,[.5,.5,.5]),E(t.modelViewMatrix,t.modelViewMatrix,[0,0,2.5])),t.setMatrixUniforms(),t.pop(),i.setUniform("uMaterialDiffuse","vec4",o.diffuse),i.setUniform("uMaterialAmbient","vec4",o.ambient),i.setUniform("uWireframe","bool",o.wireframe),i.setUniform("uUseLambert","bool",m),O(e,o.vao,o.wireframe?"LINES":"TRIANGLES"))})}catch(o){console.error(o)}}),()=>{r.dispose(),T()}};export{k as init};
