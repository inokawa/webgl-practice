const c=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&t(a)}).observe(document,{childList:!0,subtree:!0});function i(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(r){if(r.ep)return;r.ep=!0;const o=i(r);fetch(r.href,o)}};c();const s=(e,n,i)=>{const t=e.createShader(e[i]);return e.shaderSource(t,n),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS)?t:(console.error(e.getShaderInfoLog(t)),null)},d=(e,n,i)=>{const t=e.createProgram(),r=s(e,n,"VERTEX_SHADER"),o=s(e,i,"FRAGMENT_SHADER");return e.attachShader(t,r),e.attachShader(t,o),e.linkProgram(t),e.getProgramParameter(t,e.LINK_STATUS)||console.error("Could not initialize shaders"),e.deleteShader(r),e.deleteShader(o),{data:t,aVertexPosition:e.getAttribLocation(t,"aVertexPosition")}},u=(e,n)=>{const i=[-.5,.5,0,-.5,-.5,0,.5,-.5,0,.5,.5,0],t=[0,1,2,0,2,3],r=e.createVertexArray();e.bindVertexArray(r);const o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(i),e.STATIC_DRAW),e.vertexAttribPointer(n.aVertexPosition,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(n.aVertexPosition);const a=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,a),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(t),e.STATIC_DRAW),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),{vao:r,vertices:o,indices:{data:a,count:t.length}}},f=(e,n,i)=>{e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,e.canvas.width,e.canvas.height),e.useProgram(n.data),e.bindVertexArray(i.vao),e.drawElements(e.TRIANGLES,i.indices.count,e.UNSIGNED_SHORT,0),e.bindVertexArray(null)},h=(e,n,i)=>{e.clearColor(0,0,0,1);const t=d(e,n,i),r=u(e,t);f(e,t,r)},A=e=>{const n=document.getElementById(e);return n||(console.error(`There is no canvas with id ${e} on this page.`),null)},m=e=>e.getContext("webgl2")||console.error("WebGL2 is not available in your browser."),p=` #version 300 es
precision mediump float;

// Supplied vertex position attribute
in vec3 aVertexPosition;

void main(void) {
    // Set the position in clipspace coordinates
    gl_Position = vec4(aVertexPosition, 1.0);
}
`,E=`#version 300 es
precision mediump float;

// Color that is the result of this shader
out vec4 fragColor;

void main(void) {
    // Set the result as red
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;window.onload=()=>{const e=A("app");if(!e)return;e.width=window.innerWidth,e.height=window.innerHeight;const n=m(e);!n||h(n,p,E)};
