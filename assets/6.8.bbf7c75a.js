import{_ as l,c as p}from"./index.f5df6644.js";import{c as M,d as x}from"./webgl.208b2134.js";import{S as C}from"./Scene.07a21fd4.js";import{C as D,a as P}from"./Controls.803969ee.js";import{T}from"./Transforms.c39cd1ae.js";import{L as _,a as w}from"./Light.96552d4a.js";import{F as N}from"./Floor.7b1674dd.js";import{t as E}from"./mat4.356e1817.js";const A=`#version 300 es
precision mediump float;

const int numLights = 3;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition[numLights];
uniform vec3 uLightDirection[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal[numLights];
out vec3 vLightRay[numLights];

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec3 normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

  // Iterate over lights
  for(int i = 0; i < numLights; i++) {
    vec4 positionLight = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
    vec3 directionLight = vec3(uNormalMatrix * vec4(uLightDirection[i], 1.0));
    vNormal[i] = normal - directionLight;
    vLightRay[i] = vertex.xyz - positionLight.xyz;
  }

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,V=`#version 300 es
precision mediump float;

const int numLights= 3;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uLightSource;
uniform float uCutOff;
uniform vec4 uLightAmbient;
uniform vec3 uLightDirection[numLights];
uniform vec4 uLightDiffuse[numLights];

in vec3 vNormal[numLights];
in vec3 vLightRay[numLights];

out vec4 fragColor;

void main(void) {
    if (uWireframe || uLightSource) {
        fragColor = uMaterialDiffuse;
    }
    else {
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Base color
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

        vec3 L = vec3(0.0);
        vec3 N = vec3(0.0);
        float lambertTerm = 0.0;

        // Iterate over lights
        for(int i = 0; i < numLights; i++) {
            L = normalize(vLightRay[i]);
            N = normalize(vNormal[i]);
            lambertTerm	= dot(N, -L);
            if (lambertTerm > uCutOff) {
                // finalColor += uLightDiffuse[i] * uMaterialDiffuse;
                // finalColor += uLightDiffuse[i] * uMaterialDiffuse * lambertTerm;
                finalColor += uLightDiffuse[i] * uMaterialDiffuse * pow(lambertTerm, 10.0 * uCutOff);
            }
        }

        fragColor = vec4(vec3(finalColor), 1.0);
    }
}`,G=async i=>{i.clearColor(.9,.9,.9,1),i.clearDepth(1),i.enable(i.DEPTH_TEST),i.enable(i.BLEND),i.blendEquation(i.FUNC_ADD),i.depthFunc(i.LEQUAL);const t=M(i,A,V,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightSource","uLightAmbient","uLightDiffuse","uLightDirection","uMaterialAmbient","uMaterialDiffuse","uCutOff","uWireframe"]),c=[{id:"redLight",name:"Red Light",position:[0,7,3],diffuse:[1,0,0,1],direction:[0,-2,-.1]},{id:"greenLight",name:"Green Light",position:[2.5,3,3],diffuse:[0,1,0,1],direction:[-.5,1,-.1]},{id:"blueLight",name:"Blue Light",position:[-2.5,3,3],diffuse:[0,0,1,1],direction:[.5,1,-.1]}],f=new C(i,t);f.add(new N(80,2)),f.add(await l(()=>import("./wall.3397ad8f.js"),[]),"wall");for(const{id:n}of c)f.add(await l(()=>import("./sphere3.7b3e63db.js"),[]),n);const o=new D("ORBITING_TYPE");o.goHome([0,5,30]),o.setFocus([0,0,0]),o.setAzimuth(0),o.setElevation(-3),new P(o,i.canvas);const u=new T(t,o,i.canvas),s=new _;c.forEach(({id:n,position:e,diffuse:m,direction:r})=>{const a=new w(n);a.setPosition(e),a.setDiffuse(m),a.setProperty("direction",r),s.add(a)});const v=.75;t.use(),t.setUniform("uLightPosition","vec3",s.getArray("position")),t.setUniform("uLightDirection","vec3",s.getArray("direction")),t.setUniform("uLightDiffuse","vec4",s.getArray("diffuse")),t.setUniform("uCutOff","float",v),t.setUniform("uLightAmbient","vec4",[1,1,1,1]);const h=p({"Camera Type":{value:o.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:n=>{o.goHome(),o.type=n}},...c.reduce((n,e)=>{const m=[`X - ${e.name}`,`Y - ${e.name}`,`Z - ${e.name}`];return n[e.name]=m.reduce((r,a,L)=>(r[a]={value:e.position[L],min:-15,max:15,step:.1,onChange:(y,d)=>{s.get(e.id).position=m.map(g=>d[g])}},r),{}),n},{}),"Light Cone Cut Off":{value:v,min:0,max:1,step:.01,onChange:n=>t.setUniform("uCutOff","float",n)},"Go Home":()=>{o.goHome(),o.type="ORBITING_TYPE"}});return f.start(n=>{i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),u.updatePerspective();try{n.forEach(e=>{u.calculateModelView(),u.push(),t.setUniform("uLightSource","bool",!1);const m=c.find(({id:r})=>e.alias===r);if(m){const{position:r,diffuse:a}=s.get(m.id);E(u.modelViewMatrix,u.modelViewMatrix,r),e.diffuse=a,t.setUniform("uLightSource","bool",!0)}u.setMatrixUniforms(),u.pop(),t.setUniform("uLightPosition","vec3",s.getArray("position")),t.setUniform("uMaterialDiffuse","vec4",e.diffuse),t.setUniform("uMaterialAmbient","vec4",e.ambient),t.setUniform("uWireframe","bool",e.wireframe),x(i,e.vao,e.wireframe?"LINES":"TRIANGLES")})}catch(e){console.error(e)}}),()=>{f.dispose(),h()}};export{G as init};
