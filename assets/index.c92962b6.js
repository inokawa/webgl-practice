import{c as D,d as N}from"./webgl.0c8613b1.js";import{S as U}from"./Scene.eaecc88a.js";import{g as R,s as p,i as b,c as C,l as F}from"./index.e82e0eae.js";import{C as L,a as P}from"./Controls.5ba70678.js";import{T as A}from"./Transforms.47cefae5.js";import{F as w}from"./Floor.7b1674dd.js";import{t as k,s as B}from"./mat4.564d5427.js";const _=`#version 300 es
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
}`,y=`#version 300 es
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
}`;class S{constructor(e,i,a){this.picking=!1,this.gl=e,this.canvas=e.canvas,this.scene=i,this.pickedList=[],this.callbacks=a;const{width:t,height:s}=this.canvas;this.texture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,s,0,e.RGBA,e.UNSIGNED_BYTE,null),this.renderbuffer=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this.renderbuffer),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,s),this.framebuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.texture,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,this.renderbuffer),e.bindTexture(e.TEXTURE_2D,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null)}drawToFramebuffer(e){const i=this.gl;i.bindFramebuffer(i.FRAMEBUFFER,this.framebuffer),e(),i.bindFramebuffer(i.FRAMEBUFFER,null)}getHits(){return this.pickedList}update(){const e=this.gl,{width:i,height:a}=this.canvas;e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i,a,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindRenderbuffer(e.RENDERBUFFER,this.renderbuffer),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,i,a)}compare(e,i){return Math.abs(Math.round(i[0]*255)-e[0])<=1&&Math.abs(Math.round(i[1]*255)-e[1])<=1&&Math.abs(Math.round(i[2]*255)-e[2])<=1}find(e){const i=this.gl,a=new Uint8Array(4);i.bindFramebuffer(i.FRAMEBUFFER,this.framebuffer),i.readPixels(e.x,e.y,1,1,i.RGBA,i.UNSIGNED_BYTE,a),i.bindFramebuffer(i.FRAMEBUFFER,null);let t=!1;return this.scene.traverse(s=>{var c,l,d,n,f,u;if(s.alias==="floor")return!1;const v=(l=(c=this.callbacks).hitProperty)==null?void 0:l.call(c,s);if(!v)return!0;if(this.compare(a,v)){const m=this.pickedList.indexOf(s);return~m?(this.pickedList.splice(m,1),(n=(d=this.callbacks).removeHit)==null||n.call(d,s)):(this.pickedList.push(s),(u=(f=this.callbacks).addHit)==null||u.call(f,s)),t=!0}return!1}),t}stop(){var e,i;this.pickedList.length&&((i=(e=this.callbacks).processHits)==null||i.call(e,this.pickedList)),this.pickedList=[]}}const $=async r=>{r.clearColor(.9,.9,.9,1),r.clearDepth(100),r.enable(r.DEPTH_TEST),r.depthFunc(r.LESS),r.blendFunc(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA);const e=D(r,_,y,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uOffscreen","uPickingColor"]),i=new U(r,e),a=async()=>{i.add(new w(80,2));for(let n=0;n<100;n++){const f=Math.floor(Math.random()*2),u={position:V(),scale:I(),diffuse:H(n),pickingColor:x()};switch(f){case 1:i.add(await F("/models/sphere1.json"),`ball_${n}`,u);break;case 0:i.add(await F("/models/cylinder.json"),`cylinder_${n}`,u);break}}};await a();const t=new L("ORBITING_TYPE");t.goHome([0,0,192]),t.setFocus([0,0,0]),t.setElevation(-22),t.setAzimuth(37);const s=new S(r,i,{hitProperty:n=>n.pickingColor,addHit:n=>{n.previous=n.diffuse.slice(0),n.diffuse=n.pickingColor},removeHit:n=>{n.diffuse=n.previous.slice(0)},processHits:n=>{n.forEach(f=>f.diffuse=f.previous)},move:(n,f,u)=>{const m=s.getHits();if(!m)return;const o=Math.max(Math.max(t.position[0],t.position[1]),t.position[2])/2e3;m.forEach(h=>{const M=R(),E=R();u?p(E,t.normal,f*o):(p(E,t.up,-f*o),p(M,t.right,n*o)),b(h.position,h.position,E),b(h.position,h.position,M)})}});new P(t,r.canvas).setPicker(s);const c=new A(e,t,r.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,5,20]),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]);let l=!1;const d=C({"Show Picking Image":{value:l,onChange:n=>l=n},"Reset Scene":async()=>{i.objects=[],await a(),t.goHome(),t.setElevation(-40),t.setAzimuth(-30)}});return i.start(n=>{s.drawToFramebuffer(()=>{e.setUniform("uOffscreen","bool",!0),f(),e.setUniform("uOffscreen","bool",l)}),f();function f(){r.viewport(0,0,r.canvas.width,r.canvas.height),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),c.updatePerspective();try{const u=e.getUniform("uOffscreen"),m=l||u;n.forEach(o=>{o.alias==="floor"&&m||(c.calculateModelView(),c.push(),o.alias!=="floor"&&(k(c.modelViewMatrix,c.modelViewMatrix,o.position),B(c.modelViewMatrix,c.modelViewMatrix,o.scale)),c.setMatrixUniforms(),c.pop(),o.diffuse[3]<1&&!u?(r.disable(r.DEPTH_TEST),r.enable(r.BLEND)):(r.enable(r.DEPTH_TEST),r.disable(r.BLEND)),e.setUniform("uMaterialDiffuse","vec4",o.diffuse),e.setUniform("uMaterialAmbient","vec4",o.ambient),e.setUniform("uWireframe","bool",o.wireframe),e.setUniform("uPickingColor","vec4",o.pickingColor||[0,0,0,0]),e.setUniform("uOffscreen","bool",m),N(r,o.vao,o.wireframe?"LINES":"TRIANGLES"))})}catch(u){console.error(u)}}}),()=>{i.dispose(),d()}};function V(){const r=Math.floor(Math.random()*10),e=Math.floor(Math.random()*10);let i=Math.floor(Math.random()*60),a=Math.floor(Math.random()*60);return r>=5&&(i=-i),e>=5&&(a=-a),[i,0,a]}const T={};function x(){const r=[Math.random(),Math.random(),Math.random(),1],e=r.toString();return e in T?x():(T[e]=!0,r)}function H(r){const e=r%30/60+.2;return[e,e,e,1]}function I(){const r=Math.random()+.3;return[r,r,r]}export{$ as init};
