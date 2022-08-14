import{_ as N,c as V,b as A,e as E}from"./index.f28f68ca.js";import{c as b,d as U}from"./webgl.0c8613b1.js";import{S as F}from"./Scene.5278479c.js";import{F as O}from"./Floor.7b1674dd.js";import{A as S}from"./Axis.6bda81fc.js";import{c as d,i as u,t as x,b as h,a as y,d as L,p as W,e as T,f as I,g as _}from"./mat4.a3a2a3f4.js";const X=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec4 vFinalColor;

void main(void) {
    // If wireframe is enabled, set color to the diffuse property exclusing lights
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }
    else {
        // Normal
        vec3 N = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
        // Normalized light position
        vec3 L = normalize(-uLightPosition);
        float lambertTerm = dot(N, -L);

        if (lambertTerm == 0.0) {
            lambertTerm = 0.01;
        }

        // Ambient
        vec4 Ia = uLightAmbient;
        // Diffuse
        vec4 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;

        // Set varying to be used inside of fragment shader
        vFinalColor = vec4(vec3(Ia + Id), 1.0);
    }

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,Y=`#version 300 es
precision mediump float;

in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    fragColor = vFinalColor;
}`,Q=async o=>{o.clearColor(.9,.9,.9,1),o.clearDepth(100),o.enable(o.DEPTH_TEST),o.depthFunc(o.LEQUAL);const v="World Coordinates",P="Camera Coordinates";let c=v;const C=[0,-2,-50];let m=[0,-2,-50],r=[0,0,0];const i=d(),M=d(),e=d(),s=d(),t=b(o,X,Y,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialDiffuse","uWireframe"]),l=new F(o,t);l.add(await N(()=>import("./cone3.edde918c.js"),[]),"cone"),l.add(new O),l.add(new S),t.use(),t.setUniform("uLightPosition","vec3",[0,120,120]),t.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),t.setUniform("uLightDiffuse","vec4",[1,1,1,1]),u(e),x(e,e,C),u(i),h(e,i),u(M),u(s),y(s,e),h(s,s),L(s,s);function w(){W(M,45,o.canvas.width/o.canvas.height,.1,1e3),c===v?(u(e),x(e,e,m),T(e,e,r[0]*Math.PI/180),I(e,e,r[1]*Math.PI/180),_(e,e,r[2]*Math.PI/180)):(u(i),x(i,i,m),T(i,i,r[0]*Math.PI/180),I(i,i,r[1]*Math.PI/180),_(i,i,r[2]*Math.PI/180))}function D(){c===v?(h(i,e),t.setUniform("uModelViewMatrix","mat4",e)):h(e,i),t.setUniform("uProjectionMatrix","mat4",M),t.setUniform("uModelViewMatrix","mat4",e),L(s,i),t.setUniform("uNormalMatrix","mat4",s)}const R=V({Coordinates:{value:c,options:[v,P],onChange:n=>{c=n,A(C,m),r=[0,0,0],c===P&&E(m,m)}},Position:{...["Translate X","Translate Y","Translate Z"].reduce((n,a,p)=>(n[a]={value:m[p],min:-100,max:100,step:-.1,onChange(g,f){m=[f["Translate X"],f["Translate Y"],f["Translate Z"]]}},n),{})},Rotation:{...["Rotate X","Rotate Y","Rotate Z"].reduce((n,a,p)=>(n[a]={value:r[p],min:-180,max:180,step:.1,onChange(g,f){r=[f["Rotate X"],f["Rotate Y"],f["Rotate Z"]]}},n),{})}});return l.start(n=>{o.viewport(0,0,o.canvas.width,o.canvas.height),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT);try{w(),D(),n.forEach(a=>{t.setUniform("uMaterialDiffuse","vec4",a.diffuse),t.setUniform("uWireframe","bool",a.wireframe),U(o,a.vao,a.wireframe?"LINES":"TRIANGLES")})}catch(a){console.error(a)}}),()=>{l.dispose(),R()}};export{Q as init};
