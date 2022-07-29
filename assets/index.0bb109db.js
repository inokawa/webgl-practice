const u=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(t){if(t.ep)return;t.ep=!0;const o=i(t);fetch(t.href,o)}};u();const c=(e,n,i)=>{const r=e.createShader(e[i]);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),null)},f=(e,n,i)=>{const r=e.createProgram(),t=c(e,n,"VERTEX_SHADER"),o=c(e,i,"FRAGMENT_SHADER");return e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)||console.error("Could not initialize shaders"),e.deleteShader(t),e.deleteShader(o),{data:r,aVertexPosition:e.getAttribLocation(r,"aVertexPosition")}},h=(e,n)=>{const i=[-.5,.5,0,-.5,-.5,0,.5,-.5,0,.5,.5,0],r=[0,1,2,0,2,3],t=e.createVertexArray();e.bindVertexArray(t);const o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(i),e.STATIC_DRAW),e.vertexAttribPointer(n.aVertexPosition,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(n.aVertexPosition);const a=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,a),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(r),e.STATIC_DRAW),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null);const s={vao:t,vertices:o,indices:{data:a,count:r.length},use:d=>{e.bindVertexArray(s.vao),d(s.indices.count),e.bindVertexArray(null)}};return s},A=(e,n,i)=>{e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,e.canvas.width,e.canvas.height),e.useProgram(n.data),i.use(r=>{e.drawElements(e.TRIANGLES,r,e.UNSIGNED_SHORT,0)})},m=(e,n,i)=>{e.clearColor(0,0,0,1);const r=f(e,n,i),t=h(e,r);A(e,r,t)},p=e=>{const n=document.getElementById(e);return n||(console.error(`There is no canvas with id ${e} on this page.`),null)},v=e=>e.getContext("webgl2")||console.error("WebGL2 is not available in your browser."),E=` #version 300 es
precision mediump float;

// Supplied vertex position attribute
in vec3 aVertexPosition;

void main(void) {
    // Set the position in clipspace coordinates
    gl_Position = vec4(aVertexPosition, 1.0);
}
`,R=`#version 300 es
precision mediump float;

// Color that is the result of this shader
out vec4 fragColor;

void main(void) {
    // Set the result as red
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;window.onload=()=>{const e=p("app");if(!e)return;e.width=window.innerWidth,e.height=window.innerHeight;const n=v(e);!n||m(n,E,R)};
