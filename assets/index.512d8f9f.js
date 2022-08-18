import{c as P,d as T}from"./webgl.0c8613b1.js";import{S}from"./Scene.84c87e2c.js";import{F as V}from"./Floor.7b1674dd.js";import{A as C}from"./Axis.6bda81fc.js";import{l as x,c as I}from"./index.8f13588d.js";import{C as N,a as y}from"./Controls.9b38dbaa.js";import{T as E}from"./Transforms.d2db27e0.js";import{t as L}from"./mat4.90ca18bc.js";const U=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uUpdateLight;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;
out vec4 vFinalColor;

void main(void) {
    // If wireframe is enabled, set color to the diffuse property exclusing lights
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }

    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vec4 light = vec4(uLightPosition,1.0);

    // If true, then ensure that light position
    // is appropruately updated
    if (uUpdateLight) {
        light = uModelViewMatrix * vec4(uLightPosition,1.0);
    }

    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vLightRay = vertex.xyz-light.xyz;
    vEyeVector = -vec3(vertex.xyz);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,R=`#version 300 es
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
}`,H=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL);const i=P(e,U,R,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uLightSpecular","uMaterialAmbient","uMaterialDiffuse","uMaterialSpecular","uWireframe","uUpdateLight","uShininess"]);let c,p,f=!1,l=.5,v=.15,u=0,m=0,M=150,g=30;const a=new S(e,i);a.add(new V(80,2)),a.add(new C(82)),a.add(await x("/models/sphere2.json"),"sphere"),a.add(await x("/models/cone3.json"),"cone");const o=new N("ORBITING_TYPE");o.goHome([0,2,50]),o.setFocus([0,0,0]),new y(o,e.canvas);const r=new E(i,o,e.canvas);i.use(),i.setUniform("uLightPosition","vec3",[0,120,120]),i.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),i.setUniform("uLightDiffuse","vec4",[1,1,1,1]),i.setUniform("uLightSpecular","vec4",[1,1,1,1]),i.setUniform("uShininess","float",230);const w=I({"Camera Type":{value:o.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:t=>{o.goHome(),o.type=t}},"Static Light Position":{value:f,onChange:t=>f=t},"Go Home":()=>o.goHome()});return a.start((t,h)=>{if(c=h-p,c<M)return;let d=Math.floor(c/g);for(;d>0;){u+=l,(u>=30||u<=-30)&&(l=-l),m+=v,(m>=35||m<=-35)&&(v=-v),e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),r.updatePerspective();try{i.setUniform("uUpdateLight","bool",f),t.forEach(n=>{if(r.calculateModelView(),r.push(),n.alias==="sphere"){const s=r.modelViewMatrix;L(s,s,[0,0,u])}else if(n.alias==="cone"){const s=r.modelViewMatrix;L(s,s,[m,0,0])}r.setMatrixUniforms(),r.pop(),i.setUniform("uMaterialDiffuse","vec4",n.diffuse),i.setUniform("uMaterialSpecular","vec4",n.specular),i.setUniform("uMaterialAmbient","vec4",n.ambient),i.setUniform("uWireframe","bool",n.wireframe),T(e,n.vao,n.wireframe?"LINES":"TRIANGLES")})}catch(n){console.error(n)}d-=1}p=h}),()=>{a.dispose(),w()}};export{H as init};
