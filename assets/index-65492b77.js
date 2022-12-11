import{c as U,a as S,d as V}from"./webgl-ec7981e3.js";import{l as o,a as N,c as y,n as M}from"./index-87fda849.js";import{c as l,p as b,i as T,t as x,r as g,a as E,b as A,d as C}from"./mat4-e742a724.js";const D=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vec4 light = uModelViewMatrix * vec4(uLightPosition, 1.0);

    // Set varyings to be used inside of fragment shader
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vLightRay = vertex.xyz - light.xyz;
    vEyeVector = -vec3(vertex.xyz);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,w=`#version 300 es
precision mediump float;

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

out vec4 fragColor;

void main(void) {
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
        // Update diffuse
        Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
        vec3 E = normalize(vEyeVector);
        vec3 R = reflect(L, N);
        float specular = pow( max(dot(R, E), 0.0), uShininess);
        // Update specular
        Is = uLightSpecular * uMaterialSpecular * specular;
    }

    // Final fragment color takes into account ambient, diffuse, and specular
    fragColor = vec4(vec3(Ia + Id + Is), 1.0);
}`,F=async n=>{n.clearColor(.9,.9,.9,1),n.clearDepth(100),n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL);const i=U(n,D,w,["aVertexPosition","aVertexNormal"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uLightSpecular","uMaterialAmbient","uMaterialDiffuse","uMaterialSpecular","uShininess"]),s=(await Promise.all([o("/models/plane.json"),o("/models/cone2.json"),o("/models/sphere1.json"),o("/models/sphere3.json")])).map((e,a)=>({...e,alias:a===0?"plane":a===1?"cone":a===2?"sphere":"light",vao:S(n,i,[{name:"aVertexPosition",data:e.vertices,size:3},{name:"aVertexNormal",data:N(e.vertices,e.indices),size:3}],e.indices)})),v=l(),t=l(),r=l();let L=0,f=[4.5,3,15],h=200,c=-100;function p(e){return s.find(a=>a.alias===e)}const P=y({"Sphere Color":{value:[0,255,0],onChange:e=>p("sphere").diffuse=[...M(e),1]},"Cone Color":{value:[235,0,210],onChange:e=>p("cone").diffuse=[...M(e),1]},Shininess:{value:h,min:1,max:50,step:.1,onChange:e=>i.setUniform("uShininess","float",e)},...["Translate X","Translate Y","Translate Z"].reduce((e,a,u)=>(e[a]={value:f[u],min:-50,max:50,step:-.1,onChange(I,m){i.setUniform("uLightPosition","vec3",[m["Translate X"],m["Translate Y"],m["Translate Z"]])}},e),{}),Distance:{value:c,min:-200,max:-50,step:.1,onChange:e=>c=e}});i.use(),i.setUniform("uLightPosition","vec3",f),i.setUniform("uLightAmbient","vec4",[1,1,1,1]),i.setUniform("uLightDiffuse","vec4",[1,1,1,1]),i.setUniform("uLightSpecular","vec4",[1,1,1,1]),i.setUniform("uMaterialAmbient","vec4",[.1,.1,.1,1]),i.setUniform("uMaterialDiffuse","vec4",[.5,.8,.1,1]),i.setUniform("uMaterialSpecular","vec4",[.6,.6,.6,1]),i.setUniform("uShininess","float",h);let d=!1;return function e(){if(!d){requestAnimationFrame(e),n.viewport(0,0,n.canvas.width,n.canvas.height),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),b(v,45,n.canvas.width/n.canvas.height,.1,1e3);try{s.forEach(a=>{if(T(t),x(t,t,[0,0,c]),g(t,t,30*Math.PI/180,[1,0,0]),g(t,t,L*Math.PI/180,[0,1,0]),a.alias==="light"){const u=i.getUniform("uLightPosition");x(t,t,u)}E(r,t),A(r,r),C(r,r),i.setUniform("uModelViewMatrix","mat4",t),i.setUniform("uProjectionMatrix","mat4",v),i.setUniform("uNormalMatrix","mat4",r),i.setUniform("uMaterialAmbient","vec4",a.ambient),i.setUniform("uMaterialDiffuse","vec4",a.diffuse),i.setUniform("uMaterialSpecular","vec4",a.specular),V(n,a.vao,"TRIANGLES")})}catch(a){console.error(a)}}}(),()=>{d=!0,P(),i.dispose(),s.forEach(e=>{e.vao.dispose()})}};export{F as init};
