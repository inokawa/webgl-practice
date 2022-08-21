import{c as d,a as u,d as f}from"./webgl.0c8613b1.js";import{r as v,l as p}from"./index.fd6ee1f9.js";import{c,p as M,i as x,t as P,r as m}from"./mat4.9401974d.js";const h=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

in vec3 aVertexPosition;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,l=`#version 300 es
precision mediump float;

out vec4 fragColor;

void main(void) {
    fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`,_=async e=>{e.clearColor(0,0,0,1),e.enable(e.DEPTH_TEST);const i=d(e,h,l,["aVertexPosition"],["uProjectionMatrix","uModelViewMatrix","uModelColor"]),t=await Promise.all(v(1,179).map(o=>p(`/models/nissan-gtr/part${o}.json`).then(a=>u(e,i,[{name:"aVertexPosition",data:a.vertices,size:3}],a.indices)))),n=c(),r=c();let s=!1;return function o(){s||(requestAnimationFrame(o),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,e.canvas.width,e.canvas.height),i.use(),M(n,45,e.canvas.width/e.canvas.height,10,1e4),x(r),P(r,r,[-10,0,-100]),m(r,r,30*Math.PI/180,[1,0,0]),m(r,r,30*Math.PI/180,[0,1,0]),e.uniformMatrix4fv(i.uniforms.uProjectionMatrix,!1,n),e.uniformMatrix4fv(i.uniforms.uModelViewMatrix,!1,r),t.forEach(a=>{f(e,a,"LINE_LOOP")}))}(),()=>{s=!0,i.dispose(),t.forEach(o=>{o.dispose()})}};export{_ as init};
