import{c as U,d as R}from"./webgl.0c8613b1.js";import{S as F}from"./Scene.84c87e2c.js";import{l as M,c as O,d as x,n as b}from"./index.8f13588d.js";import{C as P,a as D}from"./Controls.9b38dbaa.js";import{T as w}from"./Transforms.d2db27e0.js";import{F as I}from"./Floor.7b1674dd.js";import{t as T,s as V}from"./mat4.90ca18bc.js";const g=`#version 300 es
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
}`,k=async e=>{let h=!0,L=!0,_=!0,m=!0,l=!0,A=[0,1,1,1],N=[.7,0,.7,1],d=[0,1,0],C=1;e.clearColor(.9,.9,.9,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.blendColor(...d,C),e.enable(e.CULL_FACE);let c=e.FUNC_ADD,f=e.SRC_ALPHA,v=e.ONE_MINUS_SRC_ALPHA;const i=U(e,g,H,["aVertexPosition","aVertexNormal"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uUseLambert"]),r=new F(e,i);r.add(new I(80,2)),r.add({...await M("/models/cone3.json"),diffuse:A},"cone"),r.add({...await M("/models/sphere2.json"),diffuse:N},"sphere");const t=new P("ORBITING_TYPE");t.goHome([0,5,35]),t.setFocus([0,0,0]),t.setAzimuth(25),t.setElevation(-25),new D(t,e.canvas);const a=new w(i,t,e.canvas);i.use(),i.setUniform("uLightPosition","vec3",[0,5,20]),i.setUniform("uLightAmbient","vec4",[1,1,1,1]),i.setUniform("uLightDiffuse","vec4",[1,1,1,1]),i.setUniform("uUseLambert","bool",m);const S=["ZERO","ONE","SRC_COLOR","DST_COLOR","SRC_ALPHA","DST_ALPHA","CONSTANT_COLOR","CONSTANT_ALPHA","ONE_MINUS_SRC_ALPHA","ONE_MINUS_DST_ALPHA","ONE_MINUS_SRC_COLOR","ONE_MINUS_DST_COLOR","ONE_MINUS_CONSTANT_COLOR","ONE_MINUS_CONSTANT_ALPHA"],p=n=>n?"enable":"disable";function u(n=!0){e[n?"enable":"disable"](e.BLEND),e.blendFunc(f,v),e.blendEquation(c),e.blendColor(...d,C)}const E=O({Blending:{value:h,onChange:u},"Depth Testing":{value:L,onChange:n=>e[p(n)](e.DEPTH_TEST)},"Back Face Culling":{value:_,onChange:n=>e[p(n)](e.CULL_FACE)},Lambert:{value:m,onChange:n=>m=n},Floor:{value:l,onChange:n=>l=n},...[{name:"Sphere",id:"sphere",color:N},{name:"Cone",id:"cone",color:A}].reduce((n,o)=>(n={...n,[`${o.name} Alpha`]:{value:1,min:0,max:1,step:.1,onChange:s=>r.get(o.id).diffuse[3]=s},[`${o.name} Color`]:{value:x(o.color),onChange:s=>r.get(o.id).diffuse=b(s)}},n),{}),"Blend Function":{value:c,options:["FUNC_ADD","FUNC_SUBTRACT","FUNC_REVERSE_SUBTRACT"],onChange:n=>{c=e[n],u()}},Source:{value:f,options:[...S,"SRC_ALPHA_SATURATE"],onChange:n=>{f=e[n],u()}},Destination:{value:v,options:S,onChange:n=>{v=e[n],u()}},"Blending Color":{value:[0,0,0],onChange:n=>{d=b(n),u()}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:n=>{C=n,u()}},"Render Order":{value:"Cone First",options:["Cone First","Sphere First"],onChange:n=>{n==="Sphere First"?(r.renderSooner("sphere"),r.renderFirst("floor")):(r.renderSooner("cone"),r.renderFirst("floor"))}},Reset:()=>{L=!0,h=!0,_=!0,m=!0,l=!0,c=e.FUNC_ADD,f=e.SRC_ALPHA,v=e.ONE_MINUS_SRC_ALPHA,t.goHome([0,5,35]),t.setFocus([0,0,0]),t.setAzimuth(25),t.setElevation(-25)}});return r.start(n=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{n.forEach(o=>{const{alias:s}=o;s==="floor"&&!l||(a.calculateModelView(),a.push(),s==="cone"&&T(a.modelViewMatrix,a.modelViewMatrix,[0,0,-3.5]),s==="sphere"&&(V(a.modelViewMatrix,a.modelViewMatrix,[.5,.5,.5]),T(a.modelViewMatrix,a.modelViewMatrix,[0,0,2.5])),a.setMatrixUniforms(),a.pop(),i.setUniform("uMaterialDiffuse","vec4",o.diffuse),i.setUniform("uMaterialAmbient","vec4",o.ambient),i.setUniform("uWireframe","bool",o.wireframe),i.setUniform("uUseLambert","bool",m),R(e,o.vao,o.wireframe?"LINES":"TRIANGLES"))})}catch(o){console.error(o)}}),()=>{r.dispose(),E()}};export{k as init};
