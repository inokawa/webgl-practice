import{c as V,d as b}from"./webgl-ec7981e3.js";import{S as A}from"./Scene-25bec631.js";import{F as U}from"./Floor-90ebf1f4.js";import{A as E}from"./Axis-22886cf1.js";import{l as F,c as _,b as S,e as O}from"./index-87fda849.js";import{c as v,i as c,t as x,b as h,a as y,d as L,p as W,e as T,f as w,g as I}from"./mat4-e742a724.js";const X=`#version 300 es
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
}`,J=async o=>{o.clearColor(.9,.9,.9,1),o.clearDepth(100),o.enable(o.DEPTH_TEST),o.depthFunc(o.LEQUAL);const d="World Coordinates",C="Camera Coordinates";let u=d;const P=[0,-2,-50];let m=[0,-2,-50],n=[0,0,0];const i=v(),M=v(),e=v(),s=v(),t=V(o,X,Y,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialDiffuse","uWireframe"]),l=new A(o,t);l.add(await F("/models/cone3.json"),"cone"),l.add(new U),l.add(new E),t.use(),t.setUniform("uLightPosition","vec3",[0,120,120]),t.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),t.setUniform("uLightDiffuse","vec4",[1,1,1,1]),c(e),x(e,e,P),c(i),h(e,i),c(M),c(s),y(s,e),h(s,s),L(s,s);function D(){W(M,45,o.canvas.width/o.canvas.height,.1,1e3),u===d?(c(e),x(e,e,m),T(e,e,n[0]*Math.PI/180),w(e,e,n[1]*Math.PI/180),I(e,e,n[2]*Math.PI/180)):(c(i),x(i,i,m),T(i,i,n[0]*Math.PI/180),w(i,i,n[1]*Math.PI/180),I(i,i,n[2]*Math.PI/180))}function N(){u===d?(h(i,e),t.setUniform("uModelViewMatrix","mat4",e)):h(e,i),t.setUniform("uProjectionMatrix","mat4",M),t.setUniform("uModelViewMatrix","mat4",e),L(s,i),t.setUniform("uNormalMatrix","mat4",s)}const g=_({Coordinates:{value:u,options:[d,C],onChange:r=>{u=r,S(P,m),n=[0,0,0],u===C&&O(m,m)}},Position:{...["Translate X","Translate Y","Translate Z"].reduce((r,a,p)=>(r[a]={value:m[p],min:-100,max:100,step:-.1,onChange(R,f){m=[f["Translate X"],f["Translate Y"],f["Translate Z"]]}},r),{})},Rotation:{...["Rotate X","Rotate Y","Rotate Z"].reduce((r,a,p)=>(r[a]={value:n[p],min:-180,max:180,step:.1,onChange(R,f){n=[f["Rotate X"],f["Rotate Y"],f["Rotate Z"]]}},r),{})}});return l.start(r=>{o.viewport(0,0,o.canvas.width,o.canvas.height),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT);try{D(),N(),r.forEach(a=>{t.setUniform("uMaterialDiffuse","vec4",a.diffuse),t.setUniform("uWireframe","bool",a.wireframe),b(o,a.vao,a.wireframe?"LINES":"TRIANGLES")})}catch(a){console.error(a)}}),()=>{l.dispose(),g()}};export{J as init};
