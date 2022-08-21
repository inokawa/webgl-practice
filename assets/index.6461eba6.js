import{b as F,c as P,d as k}from"./webgl.82b1ccd1.js";import{S as T}from"./Scene.25a8f8df.js";import{g as E,s as M,i as b,c as R,l as L}from"./index.54a47621.js";import{C as D,a as N}from"./Controls.dd77c90e.js";import{T as g}from"./Transforms.7a4d5f34.js";import{F as A}from"./Floor.7b1674dd.js";import{t as U,s as y}from"./mat4.1c5dccf4.js";const V=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;
out vec4 vFinalColor;

void main(void) {
  vFinalColor = uMaterialDiffuse;

  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

  vec4 light = vec4(uLightPosition,1.0);
  vLightRay = vertex.xyz-light.xyz;
  vEyeVector = -vec3(vertex.xyz);

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,S=`#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uPickingColor;
uniform bool uOffscreen;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uOffscreen) {
        fragColor = uPickingColor;
        return;
    }

    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        // Ambient
        vec4 Ia = uLightAmbient * uMaterialAmbient;

        // Diffuse
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);
        float lambertTerm = max(dot(N, -L), 0.33);
        vec4 Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;

        // Specular
        vec3 E = normalize(vEyeVector);
        vec3 R = reflect(L, N);
        float specular = pow( max(dot(R, E), 0.5), 50.0);
        vec4 Is = vec4(0.5) * specular;

        vec4 finalColor = Ia + Id + Is;

        if (uMaterialDiffuse.a != 1.0) {
            finalColor.a = uMaterialDiffuse.a;
        }
        else {
            finalColor.a = 1.0;
        }

        fragColor = finalColor;
    }
}`;class _{constructor(e,r,u){this.picking=!1,this.gl=e,this.canvas=e.canvas,this.scene=r,this.pickedList=[],this.callbacks=u;const{width:t,height:a}=this.canvas,h=e.createTexture();e.bindTexture(e.TEXTURE_2D,h),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,a,0,e.RGBA,e.UNSIGNED_BYTE,null),this.framebuffer=F(e,t,a,h)}drawToFramebuffer(e){const r=this.gl;r.bindFramebuffer(r.FRAMEBUFFER,this.framebuffer),e(),r.bindFramebuffer(r.FRAMEBUFFER,null)}getHits(){return this.pickedList}update(){const{width:e,height:r}=this.canvas;this.framebuffer.resize(e,r)}compare(e,r){return Math.abs(Math.round(r[0]*255)-e[0])<=1&&Math.abs(Math.round(r[1]*255)-e[1])<=1&&Math.abs(Math.round(r[2]*255)-e[2])<=1}find(e){const r=this.gl,u=new Uint8Array(4);r.bindFramebuffer(r.FRAMEBUFFER,this.framebuffer),r.readPixels(e.x,e.y,1,1,r.RGBA,r.UNSIGNED_BYTE,u),r.bindFramebuffer(r.FRAMEBUFFER,null);let t=!1;return this.scene.traverse(a=>{var c,m,d,n,s,f;if(a.alias==="floor")return!1;const h=(m=(c=this.callbacks).hitProperty)==null?void 0:m.call(c,a);if(!h)return!0;if(this.compare(u,h)){const l=this.pickedList.indexOf(a);return~l?(this.pickedList.splice(l,1),(n=(d=this.callbacks).removeHit)==null||n.call(d,a)):(this.pickedList.push(a),(f=(s=this.callbacks).addHit)==null||f.call(s,a)),t=!0}return!1}),t}stop(){var e,r;this.pickedList.length&&((r=(e=this.callbacks).processHits)==null||r.call(e,this.pickedList)),this.pickedList=[]}dispose(){this.framebuffer.dispose()}}const J=async i=>{i.clearColor(.9,.9,.9,1),i.clearDepth(100),i.enable(i.DEPTH_TEST),i.depthFunc(i.LESS),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);const e=P(i,V,S,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uOffscreen","uPickingColor"]),r=new T(i,e),u=async()=>{r.add(new A(80,2));for(let n=0;n<100;n++){const s=Math.floor(Math.random()*2),f={position:I(),scale:H(),diffuse:B(n),pickingColor:C()};switch(s){case 1:r.add(await L("/models/sphere1.json"),`ball_${n}`,f);break;case 0:r.add(await L("/models/cylinder.json"),`cylinder_${n}`,f);break}}};await u();const t=new D("ORBITING_TYPE");t.goHome([0,0,192]),t.setFocus([0,0,0]),t.setElevation(-22),t.setAzimuth(37);const a=new _(i,r,{hitProperty:n=>n.pickingColor,addHit:n=>{n.previous=n.diffuse.slice(0),n.diffuse=n.pickingColor},removeHit:n=>{n.diffuse=n.previous.slice(0)},processHits:n=>{n.forEach(s=>s.diffuse=s.previous)},move:(n,s,f)=>{const l=a.getHits();if(!l)return;const o=Math.max(Math.max(t.position[0],t.position[1]),t.position[2])/2e3;l.forEach(v=>{const x=E(),p=E();f?M(p,t.normal,s*o):(M(p,t.up,-s*o),M(x,t.right,n*o)),b(v.position,v.position,p),b(v.position,v.position,x)})}});new N(t,i.canvas).setPicker(a);const c=new g(e,t,i.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,5,20]),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]);let m=!1;const d=R({"Show Picking Image":{value:m,onChange:n=>m=n},"Reset Scene":async()=>{r.objects=[],await u(),t.goHome(),t.setElevation(-40),t.setAzimuth(-30)}});return r.start(n=>{a.drawToFramebuffer(()=>{e.setUniform("uOffscreen","bool",!0),s(),e.setUniform("uOffscreen","bool",m)}),s();function s(){i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),c.updatePerspective();try{const f=e.getUniform("uOffscreen"),l=m||f;n.forEach(o=>{o.alias==="floor"&&l||(c.calculateModelView(),c.push(),o.alias!=="floor"&&(U(c.modelViewMatrix,c.modelViewMatrix,o.position),y(c.modelViewMatrix,c.modelViewMatrix,o.scale)),c.setMatrixUniforms(),c.pop(),o.diffuse[3]<1&&!f?(i.disable(i.DEPTH_TEST),i.enable(i.BLEND)):(i.enable(i.DEPTH_TEST),i.disable(i.BLEND)),e.setUniform("uMaterialDiffuse","vec4",o.diffuse),e.setUniform("uMaterialAmbient","vec4",o.ambient),e.setUniform("uWireframe","bool",o.wireframe),e.setUniform("uPickingColor","vec4",o.pickingColor||[0,0,0,0]),e.setUniform("uOffscreen","bool",l),k(i,o.vao,o.wireframe?"LINES":"TRIANGLES"))})}catch(f){console.error(f)}}}),()=>{r.dispose(),d(),a.dispose()}};function I(){const i=Math.floor(Math.random()*10),e=Math.floor(Math.random()*10);let r=Math.floor(Math.random()*60),u=Math.floor(Math.random()*60);return i>=5&&(r=-r),e>=5&&(u=-u),[r,0,u]}const w={};function C(){const i=[Math.random(),Math.random(),Math.random(),1],e=i.toString();return e in w?C():(w[e]=!0,i)}function B(i){const e=i%30/60+.2;return[e,e,e,1]}function H(){const i=Math.random()+.3;return[i,i,i]}export{J as init};
