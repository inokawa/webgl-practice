const c=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(t){if(t.ep)return;t.ep=!0;const o=i(t);fetch(t.href,o)}};c();const s=(e,n,i)=>{const r=e.createShader(e[i]);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),null)},d=(e,n,i)=>{const r=e.createProgram(),t=s(e,n,"VERTEX_SHADER"),o=s(e,i,"FRAGMENT_SHADER");return e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)||console.error("Could not initialize shaders"),e.deleteShader(t),e.deleteShader(o),{data:r,aVertexPosition:e.getAttribLocation(r,"aVertexPosition")}},u=e=>{const n=[-.5,.5,0,-.5,-.5,0,.5,-.5,0,.5,.5,0],i=[0,1,2,0,2,3],r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array(n),e.STATIC_DRAW);const t=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(i),e.STATIC_DRAW),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),[r,{data:t,count:i.length}]},f=(e,n,i,r)=>{e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,e.canvas.width,e.canvas.height),e.useProgram(n.data),e.bindBuffer(e.ARRAY_BUFFER,i),e.vertexAttribPointer(n.aVertexPosition,3,e.FLOAT,!1,0,0),e.enableVertexAttribArray(n.aVertexPosition),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r.data),e.drawElements(e.TRIANGLES,r.count,e.UNSIGNED_SHORT,0),e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)},h=(e,n,i)=>{e.clearColor(0,0,0,1);const r=d(e,n,i),[t,o]=u(e);f(e,r,t,o)},R=e=>{const n=document.getElementById(e);return n||(console.error(`There is no canvas with id ${e} on this page.`),null)},E=e=>e.getContext("webgl2")||console.error("WebGL2 is not available in your browser."),A=` #version 300 es
precision mediump float;

// Supplied vertex position attribute
in vec3 aVertexPosition;

void main(void) {
    // Set the position in clipspace coordinates
    gl_Position = vec4(aVertexPosition, 1.0);
}
`,m=`#version 300 es
precision mediump float;

// Color that is the result of this shader
out vec4 fragColor;

void main(void) {
    // Set the result as red
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;window.onload=()=>{const e=R("app");if(!e)return;e.width=window.innerWidth,e.height=window.innerHeight;const n=E(e);!n||h(n,A,m)};
