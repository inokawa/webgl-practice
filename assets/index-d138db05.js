var P=Object.defineProperty;var T=(i,e,r)=>e in i?P(i,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[e]=r;var h=(i,e,r)=>(T(i,typeof e!="symbol"?e+"":e,r),r);import{b as D,c as N,d as y}from"./webgl-ec7981e3.js";import{S as g}from"./Scene-25bec631.js";import{g as E,s as x,i as b,c as V,l as w}from"./index-87fda849.js";import{C as A,a as S}from"./Controls-e64bdc38.js";import{T as R}from"./Transforms-97f3a7c7.js";import{F as U}from"./Floor-90ebf1f4.js";import{t as _,s as I}from"./mat4-e742a724.js";const F=`#version 300 es
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
}`,H=`#version 300 es
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
}`;class B{constructor(e,r,f){h(this,"gl");h(this,"canvas");h(this,"scene");h(this,"framebuffer");h(this,"pickedList");h(this,"callbacks");h(this,"picking",!1);this.gl=e,this.canvas=e.canvas,this.scene=r,this.pickedList=[],this.callbacks=f;const{width:n,height:a}=this.canvas,d=e.createTexture();e.bindTexture(e.TEXTURE_2D,d),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,n,a,0,e.RGBA,e.UNSIGNED_BYTE,null),this.framebuffer=D(e,n,a,d)}drawToFramebuffer(e){this.framebuffer.use(e)}getHits(){return this.pickedList}update(){const{width:e,height:r}=this.canvas;this.framebuffer.resize(e,r)}compare(e,r){return Math.abs(Math.round(r[0]*255)-e[0])<=1&&Math.abs(Math.round(r[1]*255)-e[1])<=1&&Math.abs(Math.round(r[2]*255)-e[2])<=1}find(e){const r=this.gl,f=new Uint8Array(4);this.framebuffer.use(()=>{r.readPixels(e.x,e.y,1,1,r.RGBA,r.UNSIGNED_BYTE,f)});let n=!1;return this.scene.traverse(a=>{var c,m,v,t,s,u;if(a.alias==="floor")return!1;const d=(m=(c=this.callbacks).hitProperty)==null?void 0:m.call(c,a);if(!d)return!0;if(this.compare(f,d)){const l=this.pickedList.indexOf(a);return~l?(this.pickedList.splice(l,1),(t=(v=this.callbacks).removeHit)==null||t.call(v,a)):(this.pickedList.push(a),(u=(s=this.callbacks).addHit)==null||u.call(s,a)),n=!0}return!1}),n}stop(){var e,r;this.pickedList.length&&((r=(e=this.callbacks).processHits)==null||r.call(e,this.pickedList)),this.pickedList=[]}dispose(){this.framebuffer.dispose()}}const Q=async i=>{i.clearColor(.9,.9,.9,1),i.clearDepth(100),i.enable(i.DEPTH_TEST),i.depthFunc(i.LESS),i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);const e=N(i,F,H,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uOffscreen","uPickingColor"]),r=new g(i,e),f=async()=>{r.add(new U(80,2));for(let t=0;t<100;t++){const s=Math.floor(Math.random()*2),u={position:G(),scale:z(),diffuse:O(t),pickingColor:C()};switch(s){case 1:r.add(await w("/models/sphere1.json"),`ball_${t}`,u);break;case 0:r.add(await w("/models/cylinder.json"),`cylinder_${t}`,u);break}}};await f();const n=new A("ORBITING_TYPE");n.goHome([0,0,192]),n.setFocus([0,0,0]),n.setElevation(-22),n.setAzimuth(37);const a=new B(i,r,{hitProperty:t=>t.pickingColor,addHit:t=>{t.previous=t.diffuse.slice(0),t.diffuse=t.pickingColor},removeHit:t=>{t.diffuse=t.previous.slice(0)},processHits:t=>{t.forEach(s=>s.diffuse=s.previous)},move:(t,s,u)=>{const l=a.getHits();if(!l)return;const o=Math.max(Math.max(n.position[0],n.position[1]),n.position[2])/2e3;l.forEach(p=>{const L=E(),M=E();u?x(M,n.normal,s*o):(x(M,n.up,-s*o),x(L,n.right,t*o)),b(p.position,p.position,M),b(p.position,p.position,L)})}});new S(n,i.canvas).setPicker(a);const c=new R(e,n,i.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,5,20]),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]);let m=!1;const v=V({"Show Picking Image":{value:m,onChange:t=>m=t},"Reset Scene":async()=>{r.objects=[],await f(),n.goHome(),n.setElevation(-40),n.setAzimuth(-30)}});return r.start(t=>{a.drawToFramebuffer(()=>{e.setUniform("uOffscreen","bool",!0),s(!0)}),e.setUniform("uOffscreen","bool",m),s(m);function s(u){i.viewport(0,0,i.canvas.width,i.canvas.height),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),c.updatePerspective();try{const l=m||u;t.forEach(o=>{o.alias==="floor"&&l||(c.calculateModelView(),c.push(),o.alias!=="floor"&&(_(c.modelViewMatrix,c.modelViewMatrix,o.position),I(c.modelViewMatrix,c.modelViewMatrix,o.scale)),c.setMatrixUniforms(),c.pop(),o.diffuse[3]<1&&!u?(i.disable(i.DEPTH_TEST),i.enable(i.BLEND)):(i.enable(i.DEPTH_TEST),i.disable(i.BLEND)),e.setUniform("uMaterialDiffuse","vec4",o.diffuse),e.setUniform("uMaterialAmbient","vec4",o.ambient),e.setUniform("uWireframe","bool",o.wireframe),e.setUniform("uPickingColor","vec4",o.pickingColor||[0,0,0,0]),e.setUniform("uOffscreen","bool",l),y(i,o.vao,o.wireframe?"LINES":"TRIANGLES"))})}catch(l){console.error(l)}}}),()=>{r.dispose(),v(),a.dispose()}};function G(){const i=Math.floor(Math.random()*10),e=Math.floor(Math.random()*10);let r=Math.floor(Math.random()*60),f=Math.floor(Math.random()*60);return i>=5&&(r=-r),e>=5&&(f=-f),[r,0,f]}const k={};function C(){const i=[Math.random(),Math.random(),Math.random(),1],e=i.toString();return e in k?C():(k[e]=!0,i)}function O(i){const e=i%30/60+.2;return[e,e,e,1]}function z(){const i=Math.random()+.3;return[i,i,i]}export{Q as init};
