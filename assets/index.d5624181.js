import{c as K,d as U}from"./webgl.0c8613b1.js";import{S as E}from"./Scene.84c87e2c.js";import{r as l,l as f,c as A,n as w,d as S}from"./index.8f13588d.js";import{C as R,a as D}from"./Controls.9b38dbaa.js";import{T as I}from"./Transforms.d2db27e0.js";import{L as V,a as _}from"./Light.96552d4a.js";import{F as z}from"./Floor.7b1674dd.js";import"./mat4.90ca18bc.js";const F=`#version 300 es
precision mediump float;

const int numLights = 4;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vLightRay[numLights];
out vec3 vEye[numLights];

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec4 lightPosition = vec4(0.0);

  // Set varyings for each individual light
  for(int i= 0; i < numLights; i++) {
    lightPosition = vec4(uLightPosition[i], 1.0);
    vLightRay[i] = vertex.xyz - lightPosition.xyz;
    vEye[i] = -vec3(vertex.xyz);
  }

  vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,T=`#version 300 es
precision mediump float;

const int numLights = 4;

uniform vec3 uLd[numLights];
uniform vec3 uLs[numLights];
uniform vec3 uLightPosition[numLights];
uniform vec3 uKa;
uniform vec3 uKd;
uniform vec3 uKs;
uniform float uNs;
uniform float uD;
uniform int uIllum;
uniform bool uWireframe;

in vec3 vNormal;
in vec3 vLightRay[numLights];
in vec3 vEye[numLights];

out vec4 fragColor;

void main(void) {
    if (uWireframe || uIllum == 0) {
        fragColor = vec4(uKd, uD);
        return;
    }

    vec3 color = vec3(0.0);
    vec3 light = vec3(0.0);
    vec3 eye = vec3(0.0);
    vec3 reflection = vec3(0.0);
    vec3 normal = normalize(vNormal);

    if (uIllum == 1) {
        for (int i = 0; i < numLights; i++) {
            light = normalize(vLightRay[i]);
            normal = normalize(vNormal);
            color += (uLd[i] * uKd * clamp(dot(normal, -light), 0.0, 1.0));
        }
    }

    if (uIllum == 2) {
        for (int i = 0; i < numLights; i++) {
            eye = normalize(vEye[i]);
            light = normalize(vLightRay[i]);
            reflection = reflect(light, normal);
            color += (uLd[i] * uKd * clamp(dot(normal, -light), 0.0, 1.0));
            color += (uLs[i] * uKs * pow(max(dot(reflection, eye), 0.0), uNs) * 4.0);
        }
    }

    fragColor =  vec4(color, uD);
}`,j=async i=>{let p=[.9,.9,.9];i.clearColor(...p,1),i.clearDepth(1),i.enable(i.DEPTH_TEST),i.depthFunc(i.LESS),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);const o=K(i,F,T,["aVertexPosition","aVertexNormal"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uLightPosition","uWireframe","uLd","uLs","uKa","uKd","uKs","uNs","uD","uIllum"]),t=new E(i,o),s=new R("ORBITING_TYPE");new D(s,i.canvas);const u=new I(o,s,i.canvas),v={farLeft:[-1e3,1e3,-1e3],farRight:[1e3,1e3,-1e3],nearLeft:[-1e3,1e3,1e3],nearRight:[1e3,1e3,1e3]},a=new V;Object.keys(v).forEach(n=>{const e=new _(n);e.setPosition(v[n]),e.setDiffuse([.4,.4,.4]),e.setSpecular([.8,.8,.8]),a.add(e)}),o.use(),o.setUniform("uLightPosition","vec3",a.getArray("position")),o.setUniform("uLd","vec3",a.getArray("diffuse")),o.setUniform("uLs","vec3",a.getArray("specular")),o.setUniform("uKa","vec3",[1,1,1]),o.setUniform("uKd","vec3",[1,1,1]),o.setUniform("uKs","vec3",[1,1,1]),o.setUniform("uNs","float",1);const d=new z(200,2),h={"BMW i8":{paintAlias:"BMW",parts:l(1,25).map(n=>()=>f(`/models/bmw-i8/part${n}.json`))},"Audi R8":{paintAlias:"Lack",parts:l(1,150).map(n=>()=>f(`/models/audi-r8/part${n}.json`))},"Ford Mustang":{paintAlias:"pintura_carro",parts:l(1,103).map(n=>()=>f(`/models/ford-mustang/part${n}.json`))},"Lamborghini Gallardo":{paintAlias:"Yellow",parts:l(1,66).map(n=>()=>f(`/models/lamborghini-gallardo/part${n}.json`))}};let c="BMW i8";L(),await x(c);function L(){s.goHome([0,.5,5]),s.setFocus([0,0,0]),s.setAzimuth(25),s.setElevation(-10)}async function x(n){t.objects=[],t.add(d);const{parts:e}=h[n];(await Promise.all(e.map(m=>m()))).forEach(m=>{t.add(m)}),c=n}function P(n){const e=h[c].paintAlias;t.traverse(r=>(~r.alias.indexOf(e)&&n(r),!1))}const N=A({Car:{Model:{options:Object.keys(h),value:c,onChange:x},Color:{value:[255,255,255],onChange:n=>{const e=w(n);P(r=>r.Kd=e)}},Shininess:{value:.5,min:0,max:50,step:.1,onChange:n=>{const e=[n,n,n];P(r=>r.Ks=e)}}},...Object.keys(v).reduce((n,e)=>{const{Lights:r}=n,m=r[e]={};return["Diffuse","Specular"].forEach(C=>{m[C]={value:.5,min:0,max:1,step:.1,onChange:g=>{const y=[g,g,g],M=a.get(e);switch(C){case"Diffuse":M.setDiffuse(y),o.setUniform("uLd","vec3",a.getArray("diffuse"));break;case"Specular":M.setSpecular(y),o.setUniform("uLs","vec3",a.getArray("specular"));break}}}}),n},{Lights:{}}),Background:{value:S(p),onChange:n=>i.clearColor(...w(n),1)},Floor:{value:d.visible,onChange:n=>d.visible=n},"Go Home":L});return t.start(n=>{i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),u.updatePerspective();try{n.forEach(e=>{!e.visible||(u.calculateModelView(),u.push(),u.setMatrixUniforms(),u.pop(),o.setUniform("uKa","vec3",e.Ka),o.setUniform("uKd","vec3",e.Kd),o.setUniform("uKs","vec3",e.Ks),o.setUniform("uNs","float",e.Ns),o.setUniform("uD","float",e.d),o.setUniform("uIllum","int",e.illum),o.setUniform("uWireframe","bool",e.wireframe),U(i,e.vao,e.wireframe?"LINES":"TRIANGLES"))})}catch(e){console.error(e)}}),()=>{t.dispose(),N()}};export{j as init};
