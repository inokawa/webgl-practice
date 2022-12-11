var x=Object.defineProperty;var U=(i,e,t)=>e in i?x(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var o=(i,e,t)=>(U(i,typeof e!="symbol"?e+"":e,t),t);import{c as S,d}from"./webgl-ec7981e3.js";import{S as V}from"./Scene-25bec631.js";import{F as N}from"./Floor-90ebf1f4.js";import{l as P,c as C}from"./index-87fda849.js";import{C as E,a as b}from"./Controls-e64bdc38.js";import{T as I}from"./Transforms-97f3a7c7.js";import"./mat4-e742a724.js";const y=`#version 300 es
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
}`,F=`#version 300 es
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
}`;class w{constructor(e){o(this,"gravity");o(this,"position");o(this,"H0");o(this,"V0");o(this,"VF");o(this,"HF");o(this,"bouncingTime");o(this,"BOUNCINESS");o(this,"color");this.gravity=e,this.position=D(),this.H0=this.position[1],this.V0=0,this.VF=Math.sqrt(2*e*this.H0),this.HF=0,this.bouncingTime=0,this.BOUNCINESS=Math.random()+.5,this.color=[Math.random(),Math.random(),Math.random(),1]}update(e){const t=this.gravity,s=e-this.bouncingTime,u=this.H0+this.V0*s-.5*t*s*s;u<=0?(this.bouncingTime=e,this.V0=this.VF*this.BOUNCINESS,this.HF=this.V0*this.V0/(2*t),this.VF=Math.sqrt(2*t*this.HF),this.H0=0):this.position[1]=u}}function D(){return[Math.floor(Math.random()*50)-Math.floor(Math.random()*50),Math.floor(Math.random()*30)+50,Math.floor(Math.random()*50)]}const z=async i=>{i.clearColor(.9,.9,.9,1),i.clearDepth(100),i.enable(i.DEPTH_TEST),i.depthFunc(i.LEQUAL);const e=S(i,y,F,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe","uPerVertexColor","uTranslation","uTranslate"]);let t,s,u=!1,f=15;const l=new V(i,e),g=9.8,T=500,m=[];l.add(new N(80,2)),l.add(await P("/models/ball.json"),"ball");for(let a=0;a<T;a++)m.push(new w(g));const r=new E("ORBITING_TYPE");r.goHome([0,2,70]),r.setFocus([0,0,0]),new b(r,i.canvas);const c=new I(e,r,i.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);const L=C({"Camera Type":{value:r.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:a=>{r.goHome(),r.type=a}},"Static Light Position":{value:u,onChange:a=>u=a},"Go Home":()=>r.goHome()});let v=0;return l.start((a,h)=>{if(t=h-s,t<f)return;let p=Math.floor(t/f);for(;p>0;){m.forEach(n=>n.update(v)),v+=33/1e3,i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),c.updatePerspective();try{e.setUniform("uUpdateLight","bool",u),a.forEach(n=>{if(c.calculateModelView(),c.setMatrixUniforms(),n.alias==="ball"){e.setUniform("uMaterialDiffuse","vec4",n.diffuse),e.setUniform("uMaterialSpecular","vec4",n.specular),e.setUniform("uMaterialAmbient","vec4",n.ambient),e.setUniform("uWireframe","bool",!1),e.setUniform("uTranslate","bool",!0),m.forEach(M=>{e.setUniform("uTranslation","vec3",M.position),e.setUniform("uMaterialDiffuse","vec4",M.color),d(i,n.vao,"TRIANGLES")});return}e.setUniform("uMaterialDiffuse","vec4",n.diffuse),e.setUniform("uMaterialSpecular","vec4",n.specular),e.setUniform("uMaterialAmbient","vec4",n.ambient),e.setUniform("uWireframe","bool",n.wireframe),e.setUniform("uTranslate","bool",!1),d(i,n.vao,n.wireframe?"LINES":"TRIANGLES")})}catch(n){console.error(n)}p-=1}s=h}),()=>{l.dispose(),L()}};export{z as init};
