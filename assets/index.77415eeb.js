import{_ as u}from"./dynamic-import-helper.f17e3fe2.js";import{c as f,a as d,d as p}from"./webgl.0c8613b1.js";import{r as v}from"./index.e82e0eae.js";import{c,p as M,i as x,t as P,r as m}from"./mat4.564d5427.js";const h=`#version 300 es
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
`,j=async e=>{e.clearColor(0,0,0,1),e.enable(e.DEPTH_TEST);const i=f(e,h,l,["aVertexPosition"],["uProjectionMatrix","uModelViewMatrix","uModelColor"]),t=await Promise.all(v(1,179).map(o=>u(Object.assign({}),`../../models/nissan-gtr/part${o}.json`).then(a=>d(e,i,[{name:"aVertexPosition",data:a.vertices,size:3}],a.indices)))),n=c(),r=c();let s=!1;return function o(){s||(requestAnimationFrame(o),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,e.canvas.width,e.canvas.height),i.use(),M(n,45,e.canvas.width/e.canvas.height,10,1e4),x(r),P(r,r,[-10,0,-100]),m(r,r,30*Math.PI/180,[1,0,0]),m(r,r,30*Math.PI/180,[0,1,0]),e.uniformMatrix4fv(i.uniforms.uProjectionMatrix,!1,n),e.uniformMatrix4fv(i.uniforms.uModelViewMatrix,!1,r),t.forEach(a=>{p(e,a,"LINE_LOOP")}))}(),()=>{s=!0,i.dispose(),t.forEach(o=>{o.dispose()})}};export{j as init};
