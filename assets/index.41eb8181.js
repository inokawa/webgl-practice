import{c as X,d as Z}from"./webgl.0c8613b1.js";import{S as q}from"./Scene.aa3140c1.js";import{F as J}from"./Floor.7b1674dd.js";import{l as T,c as Q}from"./index.15e2cb8d.js";import{C as $,a as ee}from"./Controls.d2d80294.js";import{T as ne}from"./Transforms.dee64e8a.js";import{A as oe}from"./Axis.6bda81fc.js";import{t as E}from"./mat4.1972b750.js";const te=`#version 300 es
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
}`,ie=`#version 300 es
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
}`,ve=async f=>{f.clearColor(.9,.9,.9,1),f.clearDepth(100),f.enable(f.DEPTH_TEST),f.depthFunc(f.LEQUAL);const u=X(f,te,ie,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe"]);let U=!1;const C="Linear Interpolation",y="Polynomial Interpolation",A="B-Spline Interpolation";let x=C,i=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],d=1e3;const g=new q(f,u),G=[1,1,0,1],W=[0,1,0,1],O=[0,0,1,1],S=[.5,.5,.5,1],D=[1,0,0,1],B=150;g.add(new J(B,2)),g.add(new oe(B)),g.add({...await T("/models/ball.json"),diffuse:G},"ball"),g.add({...await T("/models/flag.json"),diffuse:W},"flagStart"),g.add({...await T("/models/flag.json"),diffuse:O},"flagEnd"),g.add({...await T("/models/flag.json"),diffuse:S},"flag1"),g.add({...await T("/models/flag.json"),diffuse:S},"flag2"),g.add({...await T("/models/flag.json"),diffuse:S},"flag3");const w=new $("ORBITING_TYPE");w.goHome([0,2,80]),w.setElevation(-20),new ee(w,f.canvas);const r=new ne(u,w,f.canvas);u.use(),u.setUniform("uLightPosition","vec3",[0,120,120]),u.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),u.setUniform("uLightDiffuse","vec4",[1,1,1,1]),u.setUniform("uLightSpecular","vec4",[1,1,1,1]),u.setUniform("uShininess","float",230);let I=_();function Y(){L=0,I.length=0}function b(){const n={[C]:_,[y]:k,[A]:K}[x];I=n()}const j=Q({"Camera Type":{value:w.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:n=>{w.goHome(),w.type=n}},Points:[0,1,2,3,4].reduce((n,e)=>(n[`Point ${e+1}`]={value:i[e][0],min:-70,max:70,step:1,onChange:o=>{i[e][0]=o,b()}},n),{}),Interpolation:{value:x,options:[C,y,A],onChange:n=>{Y(),x=n,x===C?(i=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],d=1e3):x===y?(i=[[21,0,23],[-3,0,-10],[-21,0,-53],[50,0,-31],[-24,0,2]],d=1355):x===A&&(i=[[-21,0,23],[32,0,-10],[0,0,-53],[-32,0,-10],[21,0,23]],d=1e3),b()}},"Interpolation Steps":{value:d,min:10,max:1500,step:1,onChange:n=>{d=n,b()}},"Static Light Position":{value:U,onChange:n=>U=n},"Go Home":()=>w.goHome()});let L=0;return g.start(n=>{L+=1,L===d&&(L=0),f.viewport(0,0,f.canvas.width,f.canvas.height),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),r.updatePerspective();try{u.setUniform("uUpdateLight","bool",U),n.forEach(e=>{r.calculateModelView(),r.setMatrixUniforms();const{alias:o}=e;if(o==="ball"&&I[L])E(r.modelViewMatrix,r.modelViewMatrix,I[L]);else if(o==="flagStart")E(r.modelViewMatrix,r.modelViewMatrix,i[0]);else if(o==="flagEnd")E(r.modelViewMatrix,r.modelViewMatrix,i[4]);else if(o==="flag1")if(x!==C)E(r.modelViewMatrix,r.modelViewMatrix,i[1]),e.diffuse=R(i[1],I[L],3)?D:S;else{r.pop();return}else if(o==="flag2")if(x!==C)E(r.modelViewMatrix,r.modelViewMatrix,i[2]),e.diffuse=R(i[2],I[L],3)?D:S;else{r.pop();return}else if(o==="flag3")if(x!==C)E(r.modelViewMatrix,r.modelViewMatrix,i[3]),e.diffuse=R(i[3],I[L],3)?D:S;else{r.pop();return}r.setMatrixUniforms(),r.pop(),u.setUniform("uMaterialDiffuse","vec4",e.diffuse),u.setUniform("uMaterialSpecular","vec4",e.specular),u.setUniform("uMaterialAmbient","vec4",e.ambient),u.setUniform("uWireframe","bool",e.wireframe),Z(f,e.vao,e.wireframe?"LINES":"TRIANGLES")})}catch(e){console.error(e)}}),()=>{g.dispose(),j()};function _(){const n=[],[e,o,t]=i[0],[M,s,p]=i[i.length-1];for(let h=0;h<d;h++){const m=h/d;n.push([e*(1-m)+M*m,o*(1-m)+s*m,t*(1-m)+p*m])}return n}function k(){const n=[],e=i.length,o=d/(e-1),t=[];for(let s=0;s<e;s++){t[s]=1;for(let p=0;p<e;p++)s!==p&&(t[s]*=o*(s-p))}function M(s,p){const h=[];let m=0;for(let v=0;v<e;v++){h[v]=1;for(let P=0;P<e;P++)v!==P&&(h[v]*=s-P*o);h[v]/=t[v],m+=h[v]*i[v][p]}return m}for(let s=0;s<d;s++)n.push([M(s,0),M(s,1),M(s,2)]);return n}function K(){const n=[],e=i.length-1,o=3,t=[],M=e+o+1,s=1/(M-2*o);for(let a=0;a<=o;a++)t.push(0);let p=s;for(let a=o+1;a<M-o+1;a++)t.push(p),p+=s;for(let a=M-o+1;a<=M;a++)t.push(1);function h(a,l){return t[l]<=a&&a<t[l+1]?1:0}function m(a,l,c){let N=0,V=0;c-1===0?(N=h(a,l),V=h(a,l+1)):(N=m(a,l,c-1),V=m(a,l+1,c-1));let z=0,H=0;return t[l+c]-t[l]!==0&&(z=(a-t[l])/(t[l+c]-t[l])),t[l+c+1]-t[l+1]!==0&&(H=(t[l+c+1]-a)/(t[l+c+1]-t[l+1])),z*N+H*V}function v(a){const l=[];for(let c=0;c<3;c++){let N=0;for(let V=0;V<=e;V++)N+=i[V][c]*m(a,V,o);l[c]=N}return l}const P=1/d;let F=0;do n.push(v(F)),F+=P;while(F<1);return n.push(v(1)),n}function R(n,e,o){return Math.sqrt((n[0]-e[0])*(n[0]-e[0])+(n[1]-e[1])*(n[1]-e[1])+(n[2]-e[2])*(n[2]-e[2]))<=o}};export{ve as init};
