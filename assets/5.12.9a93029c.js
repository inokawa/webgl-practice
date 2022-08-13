import{_ as C,c as Z}from"./index.6ba4c711.js";import{c as q,d as Q}from"./webgl.1a62ef1a.js";import{S as $}from"./Scene.60732141.js";import{F as J}from"./Floor.7b1674dd.js";import{C as j,a as ee}from"./Controls.4ac6bf05.js";import{T as te}from"./Transforms.c39cd1ae.js";import{A as ie}from"./Axis.6bda81fc.js";import{t as S}from"./mat4.356e1817.js";const oe=`#version 300 es
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
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }

    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vec4 light = vec4(uLightPosition, 1.0);

    if (uUpdateLight) {
        light = uModelViewMatrix * vec4(uLightPosition,1.0);
    }

    vLightRay = vertex.xyz-light.xyz;
    vEyeVector = -vec3(vertex.xyz);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,ne=`#version 300 es
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
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
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
}`,ve=async f=>{f.clearColor(.9,.9,.9,1),f.clearDepth(100),f.enable(f.DEPTH_TEST),f.depthFunc(f.LEQUAL);const u=q(f,oe,ne,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe"]);let A=!1;const V="Linear Interpolation",N="Polynomial Interpolation",D="B-Spline Interpolation";let x=V,n=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],d=1e3;const g=new $(f,u),H=[1,1,0,1],G=[0,1,0,1],W=[0,0,1,1],I=[.5,.5,.5,1],R=[1,0,0,1],F=150;g.add(new J(F,2)),g.add(new ie(F)),g.add({...await C(()=>import("./ball.e8c51c02.js"),[]),diffuse:H},"ball"),g.add({...await C(()=>import("./flag.1e342818.js"),[]),diffuse:G},"flagStart"),g.add({...await C(()=>import("./flag.1e342818.js"),[]),diffuse:W},"flagEnd"),g.add({...await C(()=>import("./flag.1e342818.js"),[]),diffuse:I},"flag1"),g.add({...await C(()=>import("./flag.1e342818.js"),[]),diffuse:I},"flag2"),g.add({...await C(()=>import("./flag.1e342818.js"),[]),diffuse:I},"flag3");const _=new j("ORBITING_TYPE");_.goHome([0,2,80]),_.setElevation(-20),new ee(_,f.canvas);const r=new te(u,_,f.canvas);u.use(),u.setUniform("uLightPosition","vec3",[0,120,120]),u.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),u.setUniform("uLightDiffuse","vec4",[1,1,1,1]),u.setUniform("uLightSpecular","vec4",[1,1,1,1]),u.setUniform("uShininess","float",230);let E=B();function Y(){L=0,E.length=0}function U(){const t={[V]:B,[N]:K,[D]:X}[x];E=t()}const k=Z({"Camera Type":{value:_.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:t=>{_.goHome(),_.type=t}},Points:[0,1,2,3,4].reduce((t,e)=>(t[`Point ${e+1}`]={value:n[e][0],min:-70,max:70,step:1,onChange:i=>{n[e][0]=i,U()}},t),{}),Interpolation:{value:x,options:[V,N,D],onChange:t=>{Y(),x=t,x===V?(n=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],d=1e3):x===N?(n=[[21,0,23],[-3,0,-10],[-21,0,-53],[50,0,-31],[-24,0,2]],d=1355):x===D&&(n=[[-21,0,23],[32,0,-10],[0,0,-53],[-32,0,-10],[21,0,23]],d=1e3),U()}},"Interpolation Steps":{value:d,min:10,max:1500,step:1,onChange:t=>{d=t,U()}},"Static Light Position":{value:A,onChange:t=>A=t},"Go Home":()=>_.goHome()});let L=0;return g.start(t=>{L+=1,L===d&&(L=0),f.viewport(0,0,f.canvas.width,f.canvas.height),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),r.updatePerspective();try{u.setUniform("uUpdateLight","bool",A),t.forEach(e=>{r.calculateModelView(),r.setMatrixUniforms();const{alias:i}=e;if(i==="ball"&&E[L])S(r.modelViewMatrix,r.modelViewMatrix,E[L]);else if(i==="flagStart")S(r.modelViewMatrix,r.modelViewMatrix,n[0]);else if(i==="flagEnd")S(r.modelViewMatrix,r.modelViewMatrix,n[4]);else if(i==="flag1")if(x!==V)S(r.modelViewMatrix,r.modelViewMatrix,n[1]),e.diffuse=y(n[1],E[L],3)?R:I;else{r.pop();return}else if(i==="flag2")if(x!==V)S(r.modelViewMatrix,r.modelViewMatrix,n[2]),e.diffuse=y(n[2],E[L],3)?R:I;else{r.pop();return}else if(i==="flag3")if(x!==V)S(r.modelViewMatrix,r.modelViewMatrix,n[3]),e.diffuse=y(n[3],E[L],3)?R:I;else{r.pop();return}r.setMatrixUniforms(),r.pop(),u.setUniform("uMaterialDiffuse","vec4",e.diffuse),u.setUniform("uMaterialSpecular","vec4",e.specular),u.setUniform("uMaterialAmbient","vec4",e.ambient),u.setUniform("uWireframe","bool",e.wireframe),Q(f,e.vao,e.wireframe?"LINES":"TRIANGLES")})}catch(e){console.error(e)}}),()=>{g.dispose(),k()};function B(){const t=[],[e,i,o]=n[0],[M,s,p]=n[n.length-1];for(let h=0;h<d;h++){const m=h/d;t.push([e*(1-m)+M*m,i*(1-m)+s*m,o*(1-m)+p*m])}return t}function K(){const t=[],e=n.length,i=d/(e-1),o=[];for(let s=0;s<e;s++){o[s]=1;for(let p=0;p<e;p++)s!==p&&(o[s]*=i*(s-p))}function M(s,p){const h=[];let m=0;for(let v=0;v<e;v++){h[v]=1;for(let P=0;P<e;P++)v!==P&&(h[v]*=s-P*i);h[v]/=o[v],m+=h[v]*n[v][p]}return m}for(let s=0;s<d;s++)t.push([M(s,0),M(s,1),M(s,2)]);return t}function X(){const t=[],e=n.length-1,i=3,o=[],M=e+i+1,s=1/(M-2*i);for(let a=0;a<=i;a++)o.push(0);let p=s;for(let a=i+1;a<M-i+1;a++)o.push(p),p+=s;for(let a=M-i+1;a<=M;a++)o.push(1);function h(a,l){return o[l]<=a&&a<o[l+1]?1:0}function m(a,l,c){let T=0,w=0;c-1===0?(T=h(a,l),w=h(a,l+1)):(T=m(a,l,c-1),w=m(a,l+1,c-1));let O=0,z=0;return o[l+c]-o[l]!==0&&(O=(a-o[l])/(o[l+c]-o[l])),o[l+c+1]-o[l+1]!==0&&(z=(o[l+c+1]-a)/(o[l+c+1]-o[l+1])),O*T+z*w}function v(a){const l=[];for(let c=0;c<3;c++){let T=0;for(let w=0;w<=e;w++)T+=n[w][c]*m(a,w,i);l[c]=T}return l}const P=1/d;let b=0;do t.push(v(b)),b+=P;while(b<1);return t.push(v(1)),t}function y(t,e,i){return Math.sqrt((t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1])+(t[2]-e[2])*(t[2]-e[2]))<=i}};export{ve as init};
