import{c as p,a as L,d as D}from"./webgl-ec7981e3.js";import{a as V}from"./index-87fda849.js";import{c,p as w,i as b,t as P,a as A,b as N,d as y}from"./mat4-e742a724.js";const E=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightDirection;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec4 vVertexColor;

void main(void) {
    vec3 N = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vec3 L = normalize(uLightDirection);
    float lambertTerm = dot(N, -L);

    // Ambient
    vec4 Ia = uLightAmbient;
    // Diffuse
    vec4 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;

    // Set varying to be used inside of fragment shader
    vVertexColor = vec4(vec3(Ia + Id), 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,I=`#version 300 es
precision mediump float;

in vec4 vVertexColor;

out vec4 fragColor;

void main(void)  {
    fragColor = vVertexColor;
}`,h=[-20,-8,20,-10,-8,0,10,-8,0,20,-8,20,-20,8,20,-10,8,0,10,8,0,20,8,20],l=[0,5,4,1,5,0,1,6,5,2,6,1,2,7,6,3,7,2],T=V(h,l),F=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL);const i=p(e,E,I,["aVertexPosition","aVertexNormal"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightDirection","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse"]),v=L(e,i,[{name:"aVertexPosition",data:h,size:3},{name:"aVertexNormal",data:T,size:3}],l);let a=0,s=0;const u=c(),o=c(),r=c(),M=m=>{const t=i.getUniform("uLightDirection"),n=10;switch(m.key){case"ArrowLeft":{a-=n;break}case"ArrowUp":{s+=n;break}case"ArrowRight":{a+=n;break}case"ArrowDown":{s-=n;break}}a%=360,s%=360;const f=s*Math.PI/180,d=a*Math.PI/180;t[0]=Math.cos(f)*Math.sin(d),t[1]=Math.sin(f),t[2]=Math.cos(f)*-Math.cos(d),e.uniform3fv(i.uniforms.uLightDirection,t)};document.addEventListener("keydown",M),i.use(),e.uniform3fv(i.uniforms.uLightDirection,[0,0,-1]),e.uniform4fv(i.uniforms.uLightAmbient,[.01,.01,.01,1]),e.uniform4fv(i.uniforms.uLightDiffuse,[.5,.5,.5,1]),e.uniform4f(i.uniforms.uMaterialDiffuse,.1,.5,.8,1);let x=!1;return function m(){if(x)return;requestAnimationFrame(m);const{width:t,height:n}=e.canvas;e.viewport(0,0,t,n),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),w(u,45,t/n,.1,1e4),b(o),P(o,o,[0,0,-40]),A(r,o),N(r,r),y(r,r),e.uniformMatrix4fv(i.uniforms.uModelViewMatrix,!1,o),e.uniformMatrix4fv(i.uniforms.uProjectionMatrix,!1,u),e.uniformMatrix4fv(i.uniforms.uNormalMatrix,!1,r),e.uniformMatrix4fv(i.uniforms.uProjectionMatrix,!1,u),e.uniformMatrix4fv(i.uniforms.uModelViewMatrix,!1,o),e.uniformMatrix4fv(i.uniforms.uNormalMatrix,!1,r),D(e,v,"TRIANGLES")}(),()=>{x=!0,document.removeEventListener("keydown",M),i.dispose(),v.dispose()}};export{F as init};
