import{b,c as k,d as T}from"./webgl.82b1ccd1.js";import{S as D}from"./Scene.91ca1a45.js";import{g as L,s as M,i as E,c as N,l as w}from"./index.c2ec5a3a.js";import{C as y,a as g}from"./Controls.0c364d11.js";import{T as V}from"./Transforms.df53a289.js";import{F as A}from"./Floor.7b1674dd.js";import{t as S,s as U}from"./mat4.30853e93.js";const R=`#version 300 es
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
}`,_=`#version 300 es
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
}`;class I{constructor(e,r,u){this.picking=!1,this.gl=e,this.canvas=e.canvas,this.scene=r,this.pickedList=[],this.callbacks=u;const{width:n,height:a}=this.canvas,h=e.createTexture();e.bindTexture(e.TEXTURE_2D,h),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,n,a,0,e.RGBA,e.UNSIGNED_BYTE,null),this.framebuffer=b(e,n,a,h)}drawToFramebuffer(e){this.framebuffer.use(e)}getHits(){return this.pickedList}update(){const{width:e,height:r}=this.canvas;this.framebuffer.resize(e,r)}compare(e,r){return Math.abs(Math.round(r[0]*255)-e[0])<=1&&Math.abs(Math.round(r[1]*255)-e[1])<=1&&Math.abs(Math.round(r[2]*255)-e[2])<=1}find(e){const r=this.gl,u=new Uint8Array(4);this.framebuffer.use(()=>{r.readPixels(e.x,e.y,1,1,r.RGBA,r.UNSIGNED_BYTE,u)});let n=!1;return this.scene.traverse(a=>{var c,m,d,t,s,f;if(a.alias==="floor")return!1;const h=(m=(c=this.callbacks).hitProperty)==null?void 0:m.call(c,a);if(!h)return!0;if(this.compare(u,h)){const l=this.pickedList.indexOf(a);return~l?(this.pickedList.splice(l,1),(t=(d=this.callbacks).removeHit)==null||t.call(d,a)):(this.pickedList.push(a),(f=(s=this.callbacks).addHit)==null||f.call(s,a)),n=!0}return!1}),n}stop(){var e,r;this.pickedList.length&&((r=(e=this.callbacks).processHits)==null||r.call(e,this.pickedList)),this.pickedList=[]}dispose(){this.framebuffer.dispose()}}const J=async i=>{i.clearColor(.9,.9,.9,1),i.clearDepth(100),i.enable(i.DEPTH_TEST),i.depthFunc(i.LESS),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);const e=k(i,R,_,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uOffscreen","uPickingColor"]),r=new D(i,e),u=async()=>{r.add(new A(80,2));for(let t=0;t<100;t++){const s=Math.floor(Math.random()*2),f={position:F(),scale:O(),diffuse:H(t),pickingColor:P()};switch(s){case 1:r.add(await w("/models/sphere1.json"),`ball_${t}`,f);break;case 0:r.add(await w("/models/cylinder.json"),`cylinder_${t}`,f);break}}};await u();const n=new y("ORBITING_TYPE");n.goHome([0,0,192]),n.setFocus([0,0,0]),n.setElevation(-22),n.setAzimuth(37);const a=new I(i,r,{hitProperty:t=>t.pickingColor,addHit:t=>{t.previous=t.diffuse.slice(0),t.diffuse=t.pickingColor},removeHit:t=>{t.diffuse=t.previous.slice(0)},processHits:t=>{t.forEach(s=>s.diffuse=s.previous)},move:(t,s,f)=>{const l=a.getHits();if(!l)return;const o=Math.max(Math.max(n.position[0],n.position[1]),n.position[2])/2e3;l.forEach(v=>{const x=L(),p=L();f?M(p,n.normal,s*o):(M(p,n.up,-s*o),M(x,n.right,t*o)),E(v.position,v.position,p),E(v.position,v.position,x)})}});new g(n,i.canvas).setPicker(a);const c=new V(e,n,i.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,5,20]),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]);let m=!1;const d=N({"Show Picking Image":{value:m,onChange:t=>m=t},"Reset Scene":async()=>{r.objects=[],await u(),n.goHome(),n.setElevation(-40),n.setAzimuth(-30)}});return r.start(t=>{a.drawToFramebuffer(()=>{e.setUniform("uOffscreen","bool",!0),s(),e.setUniform("uOffscreen","bool",m)}),s();function s(){i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),c.updatePerspective();try{const f=e.getUniform("uOffscreen"),l=m||f;t.forEach(o=>{o.alias==="floor"&&l||(c.calculateModelView(),c.push(),o.alias!=="floor"&&(S(c.modelViewMatrix,c.modelViewMatrix,o.position),U(c.modelViewMatrix,c.modelViewMatrix,o.scale)),c.setMatrixUniforms(),c.pop(),o.diffuse[3]<1&&!f?(i.disable(i.DEPTH_TEST),i.enable(i.BLEND)):(i.enable(i.DEPTH_TEST),i.disable(i.BLEND)),e.setUniform("uMaterialDiffuse","vec4",o.diffuse),e.setUniform("uMaterialAmbient","vec4",o.ambient),e.setUniform("uWireframe","bool",o.wireframe),e.setUniform("uPickingColor","vec4",o.pickingColor||[0,0,0,0]),e.setUniform("uOffscreen","bool",l),T(i,o.vao,o.wireframe?"LINES":"TRIANGLES"))})}catch(f){console.error(f)}}}),()=>{r.dispose(),d(),a.dispose()}};function F(){const i=Math.floor(Math.random()*10),e=Math.floor(Math.random()*10);let r=Math.floor(Math.random()*60),u=Math.floor(Math.random()*60);return i>=5&&(r=-r),e>=5&&(u=-u),[r,0,u]}const C={};function P(){const i=[Math.random(),Math.random(),Math.random(),1],e=i.toString();return e in C?P():(C[e]=!0,i)}function H(i){const e=i%30/60+.2;return[e,e,e,1]}function O(){const i=Math.random()+.3;return[i,i,i]}export{J as init};
