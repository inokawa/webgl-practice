import{c as d,l as v}from"./webgl.0c8613b1.js";import{S as A}from"./Scene.6f92c188.js";import{c as P}from"./index.62adc70a.js";import{C as b,a as y}from"./Controls.20426e33.js";import{T as x}from"./Transforms.c39cd1ae.js";import"./mat4.356e1817.js";const R=`#version 300 es
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
}`,S=`#version 300 es
precision mediump float;

uniform sampler2D uSampler;

in float vLifespan;

out vec4 fragColor;

void main(void) {
    vec4 texColor = texture(uSampler, gl_PointCoord);
    fragColor = vec4(texColor.rgb, texColor.a * vLifespan);
}`,w="https://inokawa.github.io/webgl-practice/assets/spark.7e8bf860.png";class B{constructor(i,t,r){this.gl=i,this.buffer=i.createBuffer(),this.lifespan=r,this.particles=[],this.positionArray=new Float32Array(t*4);for(let o=0;o<t;++o){const n=m(r);this.particles.push(n);const s=o*4;this.positionArray[s]=n.position[0],this.positionArray[s+1]=n.position[1],this.positionArray[s+2]=n.position[2],this.positionArray[s+3]=n.remainingLife/n.lifespan}this.updateBuffer()}use(i){const{gl:t,buffer:r,particles:o}=this;t.bindBuffer(t.ARRAY_BUFFER,r),i(o.length),t.bindBuffer(t.ARRAY_BUFFER,null)}updateBuffer(){const{gl:i,buffer:t,positionArray:r}=this;i.bindBuffer(i.ARRAY_BUFFER,t),i.bufferData(i.ARRAY_BUFFER,r,i.STATIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,null)}updateParticles(i){this.particles.forEach((t,r)=>{t.remainingLife-=i,t.remainingLife<=0&&Object.entries(m(this.lifespan)).forEach(([n,s])=>{t[n]=s}),t.position[0]+=t.velocity[0]*i,t.position[1]+=t.velocity[1]*i,t.position[2]+=t.velocity[2]*i,t.velocity[1]-=9.8*i,t.position[1]<0&&(t.velocity[1]*=-.75,t.position[1]=0);const o=r*4;this.positionArray[o]=t.position[0],this.positionArray[o+1]=t.position[1],this.positionArray[o+2]=t.position[2],this.positionArray[o+3]=t.remainingLife/t.lifespan}),this.updateBuffer()}updateLifespan(i){this.lifespan=i}dispose(){this.gl.deleteBuffer(this.buffer)}}function m(e){const i=Math.random()*e;return{position:[0,0,0],velocity:[Math.random()*20-10,Math.random()*20,Math.random()*20-10],lifespan:i,remainingLife:i}}const _=async e=>{e.clearColor(.1,.1,.1,1),e.clearDepth(100),e.enable(e.BLEND),e.disable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.blendFunc(e.SRC_ALPHA,e.ONE);const i=d(e,R,S,["aParticle"],["uProjectionMatrix","uModelViewMatrix","uPointSize","uSampler"]);let t=Date.now();const r=new A(e,i),o=new b("ORBITING_TYPE");o.goHome([0,0,40]),o.setFocus([0,0,0]),o.setElevation(-40),o.setAzimuth(-30),new y(o,e.canvas);const n=new x(i,o,e.canvas),s=v(e,w);let c=14;const l=1024,p=3,f=new B(e,l,p);i.use();const h=P({"Particle Size":{value:c,min:5,max:50,step:.1,onChange:a=>c=a},"Particle Life Span":{value:p,min:1,max:10,step:.1,onChange:a=>f.updateLifespan(a)}});return r.start(()=>{e.viewport(0,0,e.canvas.width,e.canvas.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),n.updatePerspective();const a=Date.now();f.updateParticles((a-t)/1e3),t=a;try{n.calculateModelView(),n.setMatrixUniforms(),i.use(),i.setUniform("uPointSize","float",c),n.calculateModelView(),n.push(),f.use(u=>{e.vertexAttribPointer(i.attributes.aParticle,4,e.FLOAT,!1,0,0),e.enableVertexAttribArray(i.attributes.aParticle),s.bind(0),i.setUniform("uSampler","sampler2D",0),e.drawArrays(e.POINTS,0,u)})}catch(u){console.error(u)}}),()=>{r.dispose(),f.dispose(),h(),s.dispose()}};export{_ as init};
