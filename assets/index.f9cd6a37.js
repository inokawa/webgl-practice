import{c as x,d as g}from"./webgl.0c8613b1.js";import{S as L}from"./Scene.2a13302e.js";import{F as M}from"./Floor.7b1674dd.js";import{A as C}from"./Axis.6bda81fc.js";import{r as P,l as T,c as w}from"./index.25777b06.js";import{C as N,a as F}from"./Controls.6a1267ae.js";import{c,i as l,a as b,b as E,d as v,p as I}from"./mat4.967e88dd.js";const D=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uFixedLight;

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

        // If true, then ensure that light position
        // is appropruately updated
        if (uFixedLight) {
          L = vec3(uNormalMatrix * vec4(L, 0.0));
        }

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
}`,U=`#version 300 es
precision mediump float;

in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    fragColor = vFinalColor;
}`,z=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL);const s=c(),t=c();let u=!1;const n=x(e,D,U,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialDiffuse","uWireframe","uFixedLight"]),a=new L(e,n);(await Promise.all(P(1,179).map(i=>T(`/models/nissan-gtr/part${i}.json`)))).forEach(i=>{a.add(i)}),a.add(new M(2e3,100)),a.add(new C(2e3));const o=new N("ORBITING_TYPE");o.goHome([0,25,300]),new F(o,e.canvas),n.use(),n.setUniform("uLightPosition","vec3",[100,100,100]),n.setUniform("uLightAmbient","vec4",[.1,.1,.1,1]),n.setUniform("uLightDiffuse","vec4",[.7,.7,.7,1]),n.setUniform("uFixedLight","bool",u),l(s),f(),l(t),b(t,o.getViewTransform()),E(t,t),v(t,t);function f(){I(s,45,e.canvas.width/e.canvas.height,.1,5e3)}function d(){n.setUniform("uModelViewMatrix","mat4",o.getViewTransform()),n.setUniform("uProjectionMatrix","mat4",s),v(t,o.matrix),n.setUniform("uNormalMatrix","mat4",t)}const h=w({"Camera Type":{value:o.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:i=>{o.goHome(),o.type=i}},Dolly:{value:0,min:-100,max:100,step:.1,onChange:i=>o.dolly(i)},Position:{...["X","Y","Z"].reduce((i,r,p)=>(i[r]={value:o.position[p],min:-100,max:300,step:.1,onChange:(y,m)=>{o.setPosition([m.X,m.Y,m.Z])}},i),{})},Rotation:{Elevation:{value:o.elevation,min:-180,max:180,step:.1,onChange:i=>o.setElevation(i)},Azimuth:{value:o.azimuth,min:-180,max:180,step:.1,onChange:i=>o.setAzimuth(i)}},"Static Light Position":{value:u,onChange:i=>n.setUniform("uFixedLight","bool",i)},"Go Home":()=>o.goHome()});return a.start(i=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);try{f(),d(),i.forEach(r=>{n.setUniform("uMaterialDiffuse","vec4",r.diffuse),n.setUniform("uWireframe","bool",r.wireframe),g(e,r.vao,r.wireframe?"LINES":"TRIANGLES")})}catch(r){console.error(r)}}),()=>{a.dispose(),h()}};export{z as init};
