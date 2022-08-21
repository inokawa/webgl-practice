import{c,d as f}from"./webgl.82b1ccd1.js";import{S as v}from"./Scene.d49580de.js";import{l as m,c as d}from"./index.839a71c0.js";import{C as h,a as p}from"./Controls.c85d7e5f.js";import{T as x}from"./Transforms.b67d7768.js";import"./mat4.60b4ffa4.js";const C=`#version 300 es
precision mediump float;

uniform bool uUseVertexColor;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;
uniform float uAlpha;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform bool uUseLambert;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec4 vColor;

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

    float lambertTerm = 1.0;

    if (uUseLambert) {
        vec3 normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
        vec3 lightDirection = normalize(-uLightPosition);
        lambertTerm = max(dot(normal, -lightDirection), 0.20);
    }

    vec4 Ia = uLightAmbient * uMaterialAmbient;
    vec4 Id = vec4(0.0);

    if (uUseVertexColor) {
        Id = uLightDiffuse * aVertexColor * lambertTerm;
    }
    else {
        Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
    }

    vColor = vec4(vec3(Ia + Id), uAlpha);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,b=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
    fragColor = vColor;
}`,D=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL);const o=c(e,C,b,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uAlpha","uUseLambert","uUseVertexColor"]);let s=!1;const i=new v(e,o);i.add(await m("/models/cube-simple.json"),"simpleCube",{hidden:!1}),i.add(await m("/models/cube-complex.json"),"complexCube",{hidden:!1});const t=new h("ORBITING_TYPE");t.goHome([0,0,3]),t.setFocus([0,0,0]),t.setAzimuth(45),t.setElevation(-30),new p(t,e.canvas);const a=new x(o,t,e.canvas);o.use(),o.setUniform("uLightPosition","vec3",[0,5,20]),o.setUniform("uLightAmbient","vec4",[1,1,1,1]),o.setUniform("uLightDiffuse","vec4",[1,1,1,1]),o.setUniform("uAlpha","float",1),o.setUniform("uUseVertexColor","bool",s),o.setUniform("uUseLambert","bool",!0);const l=d({Lambert:{value:!0,onChange:n=>o.setUniform("uUseLambert","bool",n)},"Per Vertex":{value:s,onChange:n=>s=n},"Complex Cube":{value:!0,onChange:n=>{const r=i.get("simpleCube"),u=i.get("complexCube");n?(r.hidden=!0,u.hidden=!1):(r.hidden=!1,u.hidden=!0)}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:n=>o.setUniform("uAlpha","float",n)}});return i.start(n=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{n.forEach(r=>{r.hidden||(a.calculateModelView(),a.push(),a.setMatrixUniforms(),a.pop(),o.setUniform("uUseVertexColor","bool",s),o.setUniform("uMaterialDiffuse","vec4",r.diffuse),o.setUniform("uMaterialAmbient","vec4",r.ambient),f(e,r.vao,"TRIANGLES"))})}catch(r){console.error(r)}}),()=>{i.dispose(),l()}};export{D as init};
