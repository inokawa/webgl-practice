var v=Object.defineProperty;var A=(e,i,t)=>i in e?v(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;var f=(e,i,t)=>(A(e,typeof i!="symbol"?i+"":i,t),t);import{c as P,l as b}from"./webgl-ec7981e3.js";import{S as y}from"./Scene-25bec631.js";import{c as x}from"./index-87fda849.js";import{C as R,a as S}from"./Controls-e64bdc38.js";import{T as w}from"./Transforms-97f3a7c7.js";import"./mat4-e742a724.js";const B=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uPointSize;

in vec4 aParticle;

out float vLifespan;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aParticle.xyz, 1.0);
  vLifespan = aParticle.w;
  gl_PointSize = uPointSize * vLifespan;
}`,F=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in float vLifespan;

out vec4 fragColor;

void main(void) {
    vec4 texColor = texture(uSampler, gl_PointCoord);
    fragColor = vec4(texColor.rgb, texColor.a * vLifespan);
}`,L="https://inokawa.github.io/webgl-practice/assets/spark-7e8bf860.png";class E{constructor(i,t,r){f(this,"gl");f(this,"buffer");f(this,"lifespan");f(this,"particles");f(this,"positionArray");this.gl=i,this.buffer=i.createBuffer(),this.lifespan=r,this.particles=[],this.positionArray=new Float32Array(t*4);for(let o=0;o<t;++o){const n=l(r);this.particles.push(n);const s=o*4;this.positionArray[s]=n.position[0],this.positionArray[s+1]=n.position[1],this.positionArray[s+2]=n.position[2],this.positionArray[s+3]=n.remainingLife/n.lifespan}this.updateBuffer()}use(i){const{gl:t,buffer:r,particles:o}=this;t.bindBuffer(t.ARRAY_BUFFER,r),i(o.length),t.bindBuffer(t.ARRAY_BUFFER,null)}updateBuffer(){const{gl:i,buffer:t,positionArray:r}=this;i.bindBuffer(i.ARRAY_BUFFER,t),i.bufferData(i.ARRAY_BUFFER,r,i.STATIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,null)}updateParticles(i){this.particles.forEach((t,r)=>{t.remainingLife-=i,t.remainingLife<=0&&Object.entries(l(this.lifespan)).forEach(([n,s])=>{t[n]=s}),t.position[0]+=t.velocity[0]*i,t.position[1]+=t.velocity[1]*i,t.position[2]+=t.velocity[2]*i,t.velocity[1]-=9.8*i,t.position[1]<0&&(t.velocity[1]*=-.75,t.position[1]=0);const o=r*4;this.positionArray[o]=t.position[0],this.positionArray[o+1]=t.position[1],this.positionArray[o+2]=t.position[2],this.positionArray[o+3]=t.remainingLife/t.lifespan}),this.updateBuffer()}updateLifespan(i){this.lifespan=i}dispose(){this.gl.deleteBuffer(this.buffer)}}function l(e){const i=Math.random()*e;return{position:[0,0,0],velocity:[Math.random()*20-10,Math.random()*20,Math.random()*20-10],lifespan:i,remainingLife:i}}const O=async e=>{e.clearColor(.1,.1,.1,1),e.clearDepth(100),e.enable(e.BLEND),e.disable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.blendFunc(e.SRC_ALPHA,e.ONE);const i=P(e,B,F,["aParticle"],["uProjectionMatrix","uModelViewMatrix","uPointSize","uSampler"]);let t=Date.now();const r=new y(e,i),o=new R("ORBITING_TYPE");o.goHome([0,0,40]),o.setFocus([0,0,0]),o.setElevation(-40),o.setAzimuth(-30),new S(o,e.canvas);const n=new w(i,o,e.canvas),s=b(e,L);let u=14;const h=1024,m=3,c=new E(e,h,m);i.use();const d=x({"Particle Size":{value:u,min:5,max:50,step:.1,onChange:a=>u=a},"Particle Life Span":{value:m,min:1,max:10,step:.1,onChange:a=>c.updateLifespan(a)}});return r.start(()=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),n.updatePerspective();const a=Date.now();c.updateParticles((a-t)/1e3),t=a;try{n.calculateModelView(),n.setMatrixUniforms(),i.use(),i.setUniform("uPointSize","float",u),n.calculateModelView(),n.push(),c.use(p=>{e.vertexAttribPointer(i.attributes.aParticle,4,e.FLOAT,!1,0,0),e.enableVertexAttribArray(i.attributes.aParticle),s.bind(0),i.setUniform("uSampler","sampler2D",0),e.drawArrays(e.POINTS,0,p)})}catch(p){console.error(p)}}),()=>{r.dispose(),c.dispose(),d(),s.dispose()}};export{O as init};
