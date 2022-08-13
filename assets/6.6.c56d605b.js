import{_ as l,c as p}from"./index.e18834c3.js";import{c as M,d as x}from"./webgl.c798448c.js";import{S as C}from"./vec3.ca17711d.js";import{C as P,a as _}from"./Controls.876fd011.js";import{T as w}from"./Transforms.26e8517d.js";import{L as T,a as E}from"./Light.96552d4a.js";import{F as D}from"./Floor.7b1674dd.js";import{t as N}from"./mat4.5eeb9674.js";const V=`#version 300 es
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
}`,y=`#version 300 es
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
}`,G=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.enable(e.BLEND),e.blendEquation(e.FUNC_ADD),e.depthFunc(e.LEQUAL);const t=M(e,V,y,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightSource","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uCutOff","uWireframe"]),f=[{id:"redLight",name:"Red Light",position:[0,7,3],diffuse:[1,0,0,1]},{id:"greenLight",name:"Green Light",position:[2.5,3,3],diffuse:[0,1,0,1]},{id:"blueLight",name:"Blue Light",position:[-2.5,3,3],diffuse:[0,0,1,1]},{id:"whiteLight",name:"White Light",position:[0,10,2],diffuse:[1,1,1,1]}],m=new C(e,t);m.add(new D(80,2)),m.add(await l(()=>import("./wall.3397ad8f.js"),[]),"wall");for(const{id:n}of f)m.add(await l(()=>import("./sphere3.7b3e63db.js"),[]),n);const o=new P("ORBITING_TYPE");o.goHome([0,5,30]),o.setFocus([0,0,0]),o.setAzimuth(0),o.setElevation(-3),new _(o,e.canvas);const a=new w(t,o,e.canvas),u=new T;f.forEach(({id:n,position:i,diffuse:s})=>{const r=new E(n);r.setPosition(i),r.setDiffuse(s),u.add(r)});const v=.5;t.use(),t.setUniform("uLightPosition","vec3",u.getArray("position")),t.setUniform("uLightDiffuse","vec4",u.getArray("diffuse")),t.setUniform("uCutOff","float",v),t.setUniform("uLightAmbient","vec4",[1,1,1,1]);const h=p({"Camera Type":{value:o.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:n=>{o.goHome(),o.type=n}},...f.reduce((n,i)=>{const s=[`X - ${i.name}`,`Y - ${i.name}`,`Z - ${i.name}`];return n[i.name]=s.reduce((r,c,d)=>(r[c]={value:i.position[d],min:-15,max:15,step:.1,onChange:(A,L)=>{u.get(i.id).position=s.map(g=>L[g])}},r),{}),n},{}),"Light Cone Cut Off":{value:v,min:0,max:1,step:.01,onChange:n=>t.setUniform("uCutOff","float",n)},"Go Home":()=>{o.goHome(),o.type="ORBITING_TYPE"}});return m.start(n=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{n.forEach(i=>{a.calculateModelView(),a.push(),t.setUniform("uLightSource","bool",!1);const s=f.find(({id:r})=>i.alias===r);if(s){const{position:r,diffuse:c}=u.get(s.id);N(a.modelViewMatrix,a.modelViewMatrix,r),i.diffuse=c,t.setUniform("uLightSource","bool",!0)}a.setMatrixUniforms(),a.pop(),t.setUniform("uLightPosition","vec3",u.getArray("position")),t.setUniform("uMaterialDiffuse","vec4",i.diffuse),t.setUniform("uMaterialAmbient","vec4",i.ambient),t.setUniform("uWireframe","bool",i.wireframe),x(e,i.vao,i.wireframe?"LINES":"TRIANGLES")})}catch(i){console.error(i)}}),()=>{m.dispose(),h()}};export{G as init};
