import{r as w,_ as N,c as E,n as y,d as K}from"./index.263ae97d.js";import{c as U,d as _}from"./webgl.0c8613b1.js";import{S as A}from"./Scene.ab6eb519.js";import{C as R,a as S}from"./Controls.a61745e1.js";import{T as D}from"./Transforms.5496de07.js";import{L as I,a as V}from"./Light.96552d4a.js";import{F as T}from"./Floor.7b1674dd.js";import"./mat4.9f62d3a1.js";const z=`#version 300 es
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
}`,F=`#version 300 es
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
}`,$=async i=>{let d=[.9,.9,.9];i.clearColor(...d,1),i.clearDepth(1),i.enable(i.DEPTH_TEST),i.depthFunc(i.LESS),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);const o=U(i,z,F,["aVertexPosition","aVertexNormal"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uLightPosition","uWireframe","uLd","uLs","uKa","uKd","uKs","uNs","uD","uIllum"]),a=new A(i,o),s=new R("ORBITING_TYPE");new S(s,i.canvas);const c=new D(o,s,i.canvas),m={farLeft:[-1e3,1e3,-1e3],farRight:[1e3,1e3,-1e3],nearLeft:[-1e3,1e3,1e3],nearRight:[1e3,1e3,1e3]},t=new I;Object.keys(m).forEach(e=>{const n=new V(e);n.setPosition(m[e]),n.setDiffuse([.4,.4,.4]),n.setSpecular([.8,.8,.8]),t.add(n)}),o.use(),o.setUniform("uLightPosition","vec3",t.getArray("position")),o.setUniform("uLd","vec3",t.getArray("diffuse")),o.setUniform("uLs","vec3",t.getArray("specular")),o.setUniform("uKa","vec3",[1,1,1]),o.setUniform("uKd","vec3",[1,1,1]),o.setUniform("uKs","vec3",[1,1,1]),o.setUniform("uNs","float",1);const f=new T(200,2),v={"BMW i8":{paintAlias:"BMW",partsCount:25,path:"../../models/bmw-i8/part"},"Audi R8":{paintAlias:"Lack",partsCount:150,path:"../../models/audi-r8/part"},"Ford Mustang":{paintAlias:"pintura_carro",partsCount:103,path:"../../models/ford-mustang/part"},"Lamborghini Gallardo":{paintAlias:"Yellow",partsCount:66,path:"../../models/lamborghini-gallardo/part"}};let l="BMW i8";p(),await g(l);function p(){s.goHome([0,.5,5]),s.setFocus([0,0,0]),s.setAzimuth(25),s.setElevation(-10)}async function g(e){a.objects=[],a.add(f);const{path:n,partsCount:r}=v[e];(await Promise.all(w(1,r).map(u=>N(()=>import(`${n}${u}.json`),[])))).forEach(u=>{a.add(u)}),l=e}function L(e){const n=v[l].paintAlias;a.traverse(r=>(~r.alias.indexOf(n)&&e(r),!1))}const M=E({Car:{Model:{options:Object.keys(v),value:l,onChange:g},Color:{value:[255,255,255],onChange:e=>{const n=y(e);L(r=>r.Kd=n)}},Shininess:{value:.5,min:0,max:50,step:.1,onChange:e=>{const n=[e,e,e];L(r=>r.Ks=n)}}},...Object.keys(m).reduce((e,n)=>{const{Lights:r}=e,C=r[n]={};return["Diffuse","Specular"].forEach(u=>{C[u]={value:.5,min:0,max:1,step:.1,onChange:h=>{const x=[h,h,h],P=t.get(n);switch(u){case"Diffuse":P.setDiffuse(x),o.setUniform("uLd","vec3",t.getArray("diffuse"));break;case"Specular":P.setSpecular(x),o.setUniform("uLs","vec3",t.getArray("specular"));break}}}}),e},{Lights:{}}),Background:{value:K(d),onChange:e=>i.clearColor(...y(e),1)},Floor:{value:f.visible,onChange:e=>f.visible=e},"Go Home":p});return a.start(e=>{i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),c.updatePerspective();try{e.forEach(n=>{console.log(n),n.visible&&(c.calculateModelView(),c.push(),c.setMatrixUniforms(),c.pop(),o.setUniform("uKa","vec3",n.Ka),o.setUniform("uKd","vec3",n.Kd),o.setUniform("uKs","vec3",n.Ks),o.setUniform("uNs","float",n.Ns),o.setUniform("uD","float",n.d),o.setUniform("uIllum","int",n.illum),o.setUniform("uWireframe","bool",n.wireframe),_(i,n.vao,n.wireframe?"LINES":"TRIANGLES"))})}catch(n){console.error(n)}}),()=>{a.dispose(),M()}};export{$ as init};
