import{c as p,d as M}from"./webgl.0c8613b1.js";import{S as x}from"./Scene.9356aa62.js";import{l as v,c as C}from"./index.7cf5214b.js";import{C as w,a as P}from"./Controls.f84957a7.js";import{T}from"./Transforms.0c2ec02e.js";import{L as N,a as y}from"./Light.96552d4a.js";import{F as D}from"./Floor.7b1674dd.js";import{t as E}from"./mat4.744ec60a.js";const V=`#version 300 es
precision mediump float;

const int numLights = 4;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec4 uMaterialDiffuse;
uniform vec3 uLightPosition[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay[numLights];

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

    // Iterate for every light
    for(int i = 0; i < numLights; i++) {
      vec4 lightPosition = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
      vLightRay[i] = vertex.xyz - lightPosition.xyz;
    }

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,b=`#version 300 es
precision mediump float;

const int numLights = 4;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uLightSource;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse[numLights];
uniform float uCutOff;

in vec3 vNormal;
in vec3 vLightRay[numLights];
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe || uLightSource){
        fragColor = uMaterialDiffuse;
    }
    else {
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Base color
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

        vec3 N = normalize(vNormal);
        vec3 L = vec3(0.0);
        float lambertTerm = 0.0;

        // Iterate for every light
        for(int i = 0; i < numLights; i++) {
            L = normalize(vLightRay[i]);
            lambertTerm = dot(N, -L);
            if (lambertTerm > uCutOff) {
                finalColor += uLightDiffuse[i] * uMaterialDiffuse * lambertTerm;
            }
        }

        fragColor = vec4(vec3(finalColor += Ia), 1.0);
    }
}`,G=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.enable(e.BLEND),e.blendEquation(e.FUNC_ADD),e.depthFunc(e.LEQUAL);const n=p(e,V,b,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightSource","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uCutOff","uWireframe"]),f=[{id:"redLight",name:"Red Light",position:[0,7,3],diffuse:[1,0,0,1]},{id:"greenLight",name:"Green Light",position:[2.5,3,3],diffuse:[0,1,0,1]},{id:"blueLight",name:"Blue Light",position:[-2.5,3,3],diffuse:[0,0,1,1]},{id:"whiteLight",name:"White Light",position:[0,10,2],diffuse:[1,1,1,1]}],m=new x(e,n);m.add(new D(80,2)),m.add(await v("/models/wall.json"),"wall");for(const{id:t}of f)m.add(await v("/models/sphere3.json"),t);const o=new w("ORBITING_TYPE");o.goHome([0,5,30]),o.setFocus([0,0,0]),o.setAzimuth(0),o.setElevation(-3),new P(o,e.canvas);const a=new T(n,o,e.canvas),u=new N;f.forEach(({id:t,position:i,diffuse:s})=>{const r=new y(t);r.setPosition(i),r.setDiffuse(s),u.add(r)});const l=.5;n.use(),n.setUniform("uLightPosition","vec3",u.getArray("position")),n.setUniform("uLightDiffuse","vec4",u.getArray("diffuse")),n.setUniform("uCutOff","float",l),n.setUniform("uLightAmbient","vec4",[1,1,1,1]);const h=C({"Camera Type":{value:o.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:t=>{o.goHome(),o.type=t}},...f.reduce((t,i)=>{const s=[`X - ${i.name}`,`Y - ${i.name}`,`Z - ${i.name}`];return t[i.name]=s.reduce((r,c,d)=>(r[c]={value:i.position[d],min:-15,max:15,step:.1,onChange:(A,L)=>{u.get(i.id).position=s.map(g=>L[g])}},r),{}),t},{}),"Light Cone Cut Off":{value:l,min:0,max:1,step:.01,onChange:t=>n.setUniform("uCutOff","float",t)},"Go Home":()=>{o.goHome(),o.type="ORBITING_TYPE"}});return m.start(t=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{t.forEach(i=>{a.calculateModelView(),a.push(),n.setUniform("uLightSource","bool",!1);const s=f.find(({id:r})=>i.alias===r);if(s){const{position:r,diffuse:c}=u.get(s.id);E(a.modelViewMatrix,a.modelViewMatrix,r),i.diffuse=c,n.setUniform("uLightSource","bool",!0)}a.setMatrixUniforms(),a.pop(),n.setUniform("uLightPosition","vec3",u.getArray("position")),n.setUniform("uMaterialDiffuse","vec4",i.diffuse),n.setUniform("uMaterialAmbient","vec4",i.ambient),n.setUniform("uWireframe","bool",i.wireframe),M(e,i.vao,i.wireframe?"LINES":"TRIANGLES")})}catch(i){console.error(i)}}),()=>{m.dispose(),h()}};export{G as init};
