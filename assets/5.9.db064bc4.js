import{_ as g,c as x}from"./index.8873bc6e.js";import{c as U,d as M}from"./webgl.c08f1d3d.js";import{S as P}from"./Scene.38846500.js";import{F as V}from"./Floor.7b1674dd.js";import{C as E,a as S}from"./Controls.11e62dc7.js";import{T as C}from"./Transforms.c39cd1ae.js";import"./mat4.356e1817.js";const N=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uUpdateLight;
uniform vec3 uTranslation;
uniform bool uTranslate;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;
out vec4 vFinalColor;

void main(void) {
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }

    // Transformed vertex position
    vec3 vecPosition = aVertexPosition;
    if (uTranslate) {
        vecPosition += uTranslation;
    }

    vec4 vertex = uModelViewMatrix * vec4(vecPosition, 1.0);
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vec4 light = vec4(uLightPosition,1.0);

    if (uUpdateLight) {
        light = uModelViewMatrix * vec4(uLightPosition,1.0);
    }

    vLightRay = vertex.xyz - light.xyz;
    vEyeVector = -vec3(vertex.xyz);
    gl_Position = uProjectionMatrix * vertex;
}`,b=`#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform float uShininess;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);

        float lambertTerm = dot(N, -L);
        // Ambient
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Diffuse
        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
        // Specular
        vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

        if (lambertTerm > 0.0) {
            Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
            vec3 E = normalize(vEyeVector);
            vec3 R = reflect(L, N);
            float specular = pow( max(dot(R, E), 0.0), uShininess);
            Is = uLightSpecular * uMaterialSpecular * specular;
        }

        fragColor = vec4(vec3(Ia + Id + Is), 1.0);
    }
}`;class I{constructor(e){this.gravity=e,this.position=w(),this.H0=this.position[1],this.V0=0,this.VF=Math.sqrt(2*e*this.H0),this.HF=0,this.bouncingTime=0,this.BOUNCINESS=Math.random()+.5,this.color=[Math.random(),Math.random(),Math.random(),1]}update(e){const r=this.gravity,a=e-this.bouncingTime,s=this.H0+this.V0*a-.5*r*a*a;s<=0?(this.bouncingTime=e,this.V0=this.VF*this.BOUNCINESS,this.HF=this.V0*this.V0/(2*r),this.VF=Math.sqrt(2*r*this.HF),this.H0=0):this.position[1]=s}}function w(){return[Math.floor(Math.random()*50)-Math.floor(Math.random()*50),Math.floor(Math.random()*30)+50,Math.floor(Math.random()*50)]}const B=async i=>{i.clearColor(.9,.9,.9,1),i.clearDepth(100),i.enable(i.DEPTH_TEST),i.depthFunc(i.LEQUAL);const e=U(i,N,b,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe","uPerVertexColor","uTranslation","uTranslate"]);let r,a,s=!1,l=15;const u=new P(i,e),d=9.8,L=500,m=[];u.add(new V(80,2)),u.add(await g(()=>import("./ball.e8c51c02.js"),[]),"ball");for(let o=0;o<L;o++)m.push(new I(d));const t=new E("ORBITING_TYPE");t.goHome([0,2,70]),t.setFocus([0,0,0]),new S(t,i.canvas);const c=new C(e,t,i.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);const T=x({"Camera Type":{value:t.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:o=>{t.goHome(),t.type=o}},"Static Light Position":{value:s,onChange:o=>s=o},"Go Home":()=>t.goHome()});let f=0;return u.start((o,v)=>{if(r=v-a,r<l)return;let h=Math.floor(r/l);for(;h>0;){m.forEach(n=>n.update(f)),f+=33/1e3,i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),c.updatePerspective();try{e.setUniform("uUpdateLight","bool",s),o.forEach(n=>{if(c.calculateModelView(),c.setMatrixUniforms(),n.alias==="ball"){e.setUniform("uMaterialDiffuse","vec4",n.diffuse),e.setUniform("uMaterialSpecular","vec4",n.specular),e.setUniform("uMaterialAmbient","vec4",n.ambient),e.setUniform("uWireframe","bool",!1),e.setUniform("uTranslate","bool",!0),m.forEach(p=>{e.setUniform("uTranslation","vec3",p.position),e.setUniform("uMaterialDiffuse","vec4",p.color),M(i,n.vao,"TRIANGLES")});return}e.setUniform("uMaterialDiffuse","vec4",n.diffuse),e.setUniform("uMaterialSpecular","vec4",n.specular),e.setUniform("uMaterialAmbient","vec4",n.ambient),e.setUniform("uWireframe","bool",n.wireframe),e.setUniform("uTranslate","bool",!1),M(i,n.vao,n.wireframe?"LINES":"TRIANGLES")})}catch(n){console.error(n)}h-=1}a=v}),()=>{u.dispose(),T()}};export{B as init};
