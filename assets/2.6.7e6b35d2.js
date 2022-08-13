import{c as a,a as c,d}from"./webgl.c08f1d3d.js";import{c as v}from"./index.8873bc6e.js";const m=`#version 300 es
precision mediump float;

in vec3 aVertexPosition;

void main(void) {
    gl_PointSize = 40.0;
    gl_Position = vec4(aVertexPosition, 1.0);
}`,p=`#version 300 es
precision mediump float;

out vec4 fragColor;

void main(void) {
    fragColor = vec4(0.5, 0.5, 1.0, 1.0);
}`,I=async e=>{e.clearColor(0,0,0,1),e.enable(e.DEPTH_TEST);const n=a(e,m,p,["aVertexPosition"],[]),r=c(e,n,[{name:"aVertexPosition",data:[-.5,-.5,0,-.25,.5,0,0,-.5,0,.25,.5,0,.5,-.5,0],size:3}],[0,1,2,0,2,3,2,3,4]);let o="TRIANGLES";n.use();let t=!1;(function i(){t||(requestAnimationFrame(i),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,e.canvas.width,e.canvas.height),d(e,r,o))})();const s=v({"Rendering Mode":{value:o,options:["TRIANGLES","LINES","POINTS","LINE_LOOP","LINE_STRIP","TRIANGLE_STRIP","TRIANGLE_FAN"],onChange:i=>o=i}});return()=>{t=!0,s(),n.dispose(),r.dispose()}};export{I as init};
