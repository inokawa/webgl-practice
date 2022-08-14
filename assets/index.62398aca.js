import{_ as m,c as f}from"./index.a78d2eac.js";import{c,d as v}from"./webgl.208b2134.js";import{S as d}from"./Scene.5037f985.js";import{C as h,a as p}from"./Controls.9e343537.js";import{T as x}from"./Transforms.c39cd1ae.js";import"./mat4.356e1817.js";const C=`#version 300 es
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
}`,A=async e=>{e.clearColor(.9,.9,.9,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL);const o=c(e,C,b,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uAlpha","uUseLambert","uUseVertexColor"]);let u=!1;const t=new d(e,o);t.add({...await m(()=>import("./cube-simple.49e30b2d.js"),[]),hidden:!1},"simpleCube"),t.add({...await m(()=>import("./cube-complex.9bb7c8cf.js"),[]),hidden:!0},"complexCube");const n=new h("ORBITING_TYPE");n.goHome([0,0,3]),n.setFocus([0,0,0]),n.setAzimuth(45),n.setElevation(-30),new p(n,e.canvas);const a=new x(o,n,e.canvas);o.use(),o.setUniform("uLightPosition","vec3",[0,5,20]),o.setUniform("uLightAmbient","vec4",[1,1,1,1]),o.setUniform("uLightDiffuse","vec4",[1,1,1,1]),o.setUniform("uAlpha","float",1),o.setUniform("uUseVertexColor","bool",u),o.setUniform("uUseLambert","bool",!0);const l=f({Lambert:{value:!0,onChange:r=>o.setUniform("uUseLambert","bool",r)},"Per Vertex":{value:u,onChange:r=>u=r},"Complex Cube":{value:!0,onChange:r=>{const i=t.get("simpleCube"),s=t.get("complexCube");r?(i.hidden=!0,s.hidden=!1):(i.hidden=!1,s.hidden=!0)}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:r=>o.setUniform("uAlpha","float",r)}});return t.start(r=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),a.updatePerspective();try{r.forEach(i=>{i.hidden||(a.calculateModelView(),a.push(),a.setMatrixUniforms(),a.pop(),o.setUniform("uUseVertexColor","bool",u),o.setUniform("uMaterialDiffuse","vec4",i.diffuse),o.setUniform("uMaterialAmbient","vec4",i.ambient),v(e,i.vao,"TRIANGLES"))})}catch(i){console.error(i)}}),()=>{t.dispose(),l()}};export{A as init};
