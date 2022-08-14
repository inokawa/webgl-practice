import{_ as o,a as P,c as V,n as M}from"./index.183b75b1.js";import{c as E,a as U,d as S}from"./webgl.0c8613b1.js";import{c as l,p as T,i as A,t as x,r as L,a as D,b as y,d as I}from"./mat4.7c6b59f8.js";const N=`#version 300 es
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
}`,b=`#version 300 es
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
}`,F=async n=>{n.clearColor(.9,.9,.9,1),n.clearDepth(100),n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL);const i=E(n,N,b,["aVertexPosition","aVertexNormal"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uLightSpecular","uMaterialAmbient","uMaterialDiffuse","uMaterialSpecular","uShininess"]),s=(await Promise.all([o(()=>import("./plane.d8c65b5c.js"),[]),o(()=>import("./cone2.8ec56e7a.js"),[]),o(()=>import("./sphere1.ab751454.js"),[]),o(()=>import("./sphere3.7b3e63db.js"),[])])).map((e,t)=>({...e,alias:t===0?"plane":t===1?"cone":t===2?"sphere":"light",vao:U(n,i,[{name:"aVertexPosition",data:e.vertices,size:3},{name:"aVertexNormal",data:P(e.vertices,e.indices),size:3}],e.indices)})),v=l(),a=l(),r=l();let g=0,f=[4.5,3,15],h=200,u=-100;function p(e){return s.find(t=>t.alias===e)}const _=V({"Sphere Color":{value:[0,255,0],onChange:e=>p("sphere").diffuse=[...M(e),1]},"Cone Color":{value:[235,0,210],onChange:e=>p("cone").diffuse=[...M(e),1]},Shininess:{value:h,min:1,max:50,step:.1,onChange:e=>i.setUniform("uShininess","float",e)},...["Translate X","Translate Y","Translate Z"].reduce((e,t,c)=>(e[t]={value:f[c],min:-50,max:50,step:-.1,onChange(C,m){i.setUniform("uLightPosition","vec3",[m["Translate X"],m["Translate Y"],m["Translate Z"]])}},e),{}),Distance:{value:u,min:-200,max:-50,step:.1,onChange:e=>u=e}});i.use(),i.setUniform("uLightPosition","vec3",f),i.setUniform("uLightAmbient","vec4",[1,1,1,1]),i.setUniform("uLightDiffuse","vec4",[1,1,1,1]),i.setUniform("uLightSpecular","vec4",[1,1,1,1]),i.setUniform("uMaterialAmbient","vec4",[.1,.1,.1,1]),i.setUniform("uMaterialDiffuse","vec4",[.5,.8,.1,1]),i.setUniform("uMaterialSpecular","vec4",[.6,.6,.6,1]),i.setUniform("uShininess","float",h);let d=!1;return function e(){if(!d){requestAnimationFrame(e),n.viewport(0,0,n.canvas.width,n.canvas.height),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),T(v,45,n.canvas.width/n.canvas.height,.1,1e3);try{s.forEach(t=>{if(A(a),x(a,a,[0,0,u]),L(a,a,30*Math.PI/180,[1,0,0]),L(a,a,g*Math.PI/180,[0,1,0]),t.alias==="light"){const c=i.getUniform("uLightPosition");x(a,a,c)}D(r,a),y(r,r),I(r,r),i.setUniform("uModelViewMatrix","mat4",a),i.setUniform("uProjectionMatrix","mat4",v),i.setUniform("uNormalMatrix","mat4",r),i.setUniform("uMaterialAmbient","vec4",t.ambient),i.setUniform("uMaterialDiffuse","vec4",t.diffuse),i.setUniform("uMaterialSpecular","vec4",t.specular),S(n,t.vao,"TRIANGLES")})}catch(t){console.error(t)}}}(),()=>{d=!0,_(),i.dispose(),s.forEach(e=>{e.vao.dispose()})}};export{F as init};
