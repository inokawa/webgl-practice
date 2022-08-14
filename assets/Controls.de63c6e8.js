import{A as g,g as r,h as w,b as c}from"./index.aa27f130.js";import{c as f,i as v,t as d,f as y,e as x,b as z}from"./mat4.a2b2ab51.js";function m(){var h=new g(4);return g!=Float32Array&&(h[0]=0,h[1]=0,h[2]=0,h[3]=0),h}function u(h,t,i,s,e){return h[0]=t,h[1]=i,h[2]=s,h[3]=e,h}function p(h,t,i){var s=t[0],e=t[1],a=t[2],n=t[3];return h[0]=i[0]*s+i[4]*e+i[8]*a+i[12]*n,h[1]=i[1]*s+i[5]*e+i[9]*a+i[13]*n,h[2]=i[2]*s+i[6]*e+i[10]*a+i[14]*n,h[3]=i[3]*s+i[7]*e+i[11]*a+i[15]*n,h}(function(){var h=m();return function(t,i,s,e,a,n){var o,l;for(i||(i=4),s||(s=0),e?l=Math.min(e*i+s,t.length):l=t.length,o=s;o<l;o+=i)h[0]=t[o],h[1]=t[o+1],h[2]=t[o+2],h[3]=t[o+3],a(h,h,n),t[o]=h[0],t[o+1]=h[1],t[o+2]=h[2],t[o+3]=h[3];return t}})();class Y{constructor(t="ORBITING_TYPE"){this.type=t,this.position=r(),this.focus=r(),this.home=r(),this.up=r(),this.right=r(),this.normal=r(),this.matrix=f(),this.steps=0,this.azimuth=0,this.elevation=0,this.fov=45,this.minZ=.1,this.maxZ=1e4}get isOrbiting(){return this.type==="ORBITING_TYPE"}get isTracking(){return this.type==="TRACKING_TYPE"}goHome(t){t&&(this.home=t),this.setPosition(this.home),this.setAzimuth(0),this.setElevation(0)}dolly(t){const i=r(),s=r();w(i,this.normal);const e=t-this.steps;this.isTracking?(s[0]=this.position[0]-e*i[0],s[1]=this.position[1]-e*i[1],s[2]=this.position[2]-e*i[2]):(s[0]=this.position[0],s[1]=this.position[1],s[2]=this.position[2]-e),this.steps=t,this.setPosition(s)}setPosition(t){c(this.position,t),this.update()}changeZoom(t){c(this.position,[this.position[0],this.position[1],this.position[2]+t]),this.update()}setFocus(t){c(this.focus,t),this.update()}setAzimuth(t){this.changeAzimuth(t-this.azimuth)}changeAzimuth(t){this.azimuth+=t,(this.azimuth>360||this.azimuth<-360)&&(this.azimuth=this.azimuth%360),this.update()}setElevation(t){this.changeElevation(t-this.elevation)}changeElevation(t){this.elevation+=t,(this.elevation>360||this.elevation<-360)&&(this.elevation=this.elevation%360),this.update()}calculateOrientation(){const t=m();u(t,1,0,0,0),p(t,t,this.matrix),c(this.right,t);const i=m();u(i,0,1,0,0),p(i,i,this.matrix),c(this.up,i);const s=m();u(s,0,0,1,0),p(s,s,this.matrix),c(this.normal,s)}update(){if(v(this.matrix),this.isTracking?(d(this.matrix,this.matrix,this.position),y(this.matrix,this.matrix,this.azimuth*Math.PI/180),x(this.matrix,this.matrix,this.elevation*Math.PI/180)):(y(this.matrix,this.matrix,this.azimuth*Math.PI/180),x(this.matrix,this.matrix,this.elevation*Math.PI/180),d(this.matrix,this.matrix,this.position)),this.isTracking){const t=m();u(t,0,0,0,1),p(t,t,this.matrix),c(this.position,t)}this.calculateOrientation()}getViewTransform(){const t=f();return z(t,this.matrix),t}}class I{constructor(t,i){this.dragging=!1,this.ctrl=!1,this.alt=!1,this.x=0,this.y=0,this.lastX=0,this.lastY=0,this.button=0,this.dloc=0,this.dstep=0,this.motionFactor=10,this.keyIncrement=5,this.camera=t,this.canvas=i,i.onmousedown=s=>this.onMouseDown(s),i.onmouseup=s=>this.onMouseUp(s),i.onmousemove=s=>this.onMouseMove(s),window.onkeydown=s=>this.onKeyDown(s),window.onkeyup=s=>this.onKeyUp(s),window.onwheel=s=>this.onWheel(s)}get2DCoords(t){let i=0,s=0,e=this.canvas;for(;e&&e.tagName!=="BODY";)i+=e.offsetTop,s+=e.offsetLeft,e=e.offsetParent;return s+=window.pageXOffset,i-=window.pageYOffset,{x:t.clientX-s,y:this.canvas.height-(t.clientY-i)}}onMouseUp(t){this.dragging=!1}onMouseDown(t){this.dragging=!0,this.x=t.clientX,this.y=t.clientY,this.button=t.button,this.dstep=Math.max(this.camera.position[0],this.camera.position[1],this.camera.position[2])/100}onMouseMove(t){if(this.lastX=this.x,this.lastY=this.y,this.x=t.clientX,this.y=t.clientY,!this.dragging)return;this.ctrl=t.ctrlKey,this.alt=t.altKey;const i=this.x-this.lastX,s=this.y-this.lastY;this.button||(this.alt?this.dolly(s):this.rotate(i,s))}onKeyDown(t){if(this.ctrl=t.ctrlKey,!this.ctrl)switch(t.key){case"ArrowLeft":return this.camera.changeAzimuth(-this.keyIncrement);case"ArrowUp":return this.camera.changeElevation(this.keyIncrement);case"ArrowRight":return this.camera.changeAzimuth(this.keyIncrement);case"ArrowDown":return this.camera.changeElevation(-this.keyIncrement)}}onKeyUp(t){this.ctrl=t.ctrlKey}onWheel(t){this.camera.changeZoom(t.deltaY)}dolly(t){t>0?this.dloc+=this.dstep:this.dloc-=this.dstep,this.camera.dolly(this.dloc)}rotate(t,i){const{width:s,height:e}=this.canvas,a=-20/s,n=-20/e,o=t*a*this.motionFactor,l=i*n*this.motionFactor;this.camera.changeAzimuth(o),this.camera.changeElevation(l)}}export{Y as C,I as a};
