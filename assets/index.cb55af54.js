const At=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=i(r);fetch(r.href,o)}};At();const wt="modulepreload",yt=function(t){return"https://inokawa.github.io/webgl-3d-practice/"+t},Je={},u=function(e,i,n){return!i||i.length===0?e():Promise.all(i.map(r=>{if(r=yt(r),r in Je)return;Je[r]=!0;const o=r.endsWith(".css"),a=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${a}`))return;const s=document.createElement("link");if(s.rel=o?"stylesheet":wt,o||(s.as="script",s.crossOrigin=""),s.href=r,document.head.appendChild(s),o)return new Promise((l,d)=>{s.addEventListener("load",l),s.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${r}`)))})})).then(()=>e())},et=(t,e,i)=>{const n=t.createShader(t[i]);return t.shaderSource(n,e),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS)?n:(console.error(t.getShaderInfoLog(n)),null)},J=(t,e,i,n,r)=>{const o=t.createProgram(),a=et(t,e,"VERTEX_SHADER"),s=et(t,i,"FRAGMENT_SHADER");t.attachShader(o,a),t.attachShader(o,s),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS)||console.error("Could not initialize shaders"),t.deleteShader(a),t.deleteShader(s);const l={data:o,attributes:n.reduce((d,_)=>(d[_]=t.getAttribLocation(o,_),d),{}),uniforms:r.reduce((d,_)=>(d[_]=t.getUniformLocation(o,_),d),{}),use:()=>{t.useProgram(o)},dispose:()=>{t.deleteProgram(o)},getUniform:d=>t.getUniform(o,l.uniforms[d]),setUniform:(d,_,c)=>{switch(_){case"float":t.uniform1f(l.uniforms[d],c);break;case"int":t.uniform1i(l.uniforms[d],c);break;case"bool":t.uniform1f(l.uniforms[d],c);break;case"vec2":t.uniform2fv(l.uniforms[d],c);break;case"ivec2":t.uniform2iv(l.uniforms[d],c);break;case"bvec2":t.uniform2fv(l.uniforms[d],c);break;case"vec3":t.uniform3fv(l.uniforms[d],c);break;case"ivec3":t.uniform3iv(l.uniforms[d],c);break;case"bvec3":t.uniform3fv(l.uniforms[d],c);break;case"vec4":t.uniform4fv(l.uniforms[d],c);break;case"ivec4":t.uniform4iv(l.uniforms[d],c);break;case"bvec4":t.uniform4fv(l.uniforms[d],c);break;case"mat2":t.uniformMatrix2fv(l.uniforms[d],!1,c);break;case"mat3":t.uniformMatrix3fv(l.uniforms[d],!1,c);break;case"mat4":t.uniformMatrix4fv(l.uniforms[d],!1,c);break}}};return l},Tt=(t,e,i,n)=>{const r=t.createVertexArray();t.bindVertexArray(r);const o=[];i.forEach(({name:l,data:d,size:_})=>{const c=t.createBuffer();o.push(c),t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array(d),t.STATIC_DRAW),t.vertexAttribPointer(e.attributes[l],_,t.FLOAT,!1,0,0),t.enableVertexAttribArray(e.attributes[l])});let a=null;n&&(a=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,a),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(n),t.STATIC_DRAW)),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null),n&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null);const s={vao:r,use:l=>{t.bindVertexArray(s.vao),l(n?n.length:void 0),t.bindVertexArray(null)},dispose:()=>{t.deleteVertexArray(s.vao),o.forEach(l=>{t.deleteBuffer(l)}),t.deleteBuffer(a)}};return s},k=(t,e,i)=>{e.use(n=>{n!=null?t.drawElements(t[i],n,t.UNSIGNED_SHORT,0):t.drawArrays(t[i],t.UNSIGNED_SHORT,0)})},Ct=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec4 vFinalColor;

void main(void) {
    // If wireframe is enabled, set color to the diffuse property exclusing lights
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }
    else {
        // Normal
        vec3 N = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
        // Normalized light position
        vec3 L = normalize(-uLightPosition);
        float lambertTerm = dot(N, -L);

        if (lambertTerm == 0.0) {
            lambertTerm = 0.01;
        }

        // Ambient
        vec4 Ia = uLightAmbient;
        // Diffuse
        vec4 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;

        // Set varying to be used inside of fragment shader
        vFinalColor = vec4(vec3(Ia + Id), 1.0);
    }

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,Pt=`#version 300 es
precision mediump float;

in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    fragColor = vFinalColor;
}`;var Ee=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});function H(){var t=new Ee(16);return Ee!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function De(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function ie(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Te(t,e){if(t===e){var i=e[1],n=e[2],r=e[3],o=e[6],a=e[7],s=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=i,t[6]=e[9],t[7]=e[13],t[8]=n,t[9]=o,t[11]=e[14],t[12]=r,t[13]=a,t[14]=s}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t}function fe(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],a=e[4],s=e[5],l=e[6],d=e[7],_=e[8],c=e[9],m=e[10],E=e[11],b=e[12],g=e[13],p=e[14],v=e[15],w=i*s-n*a,T=i*l-r*a,R=i*d-o*a,x=n*l-r*s,C=n*d-o*s,M=r*d-o*l,X=_*g-c*b,K=_*p-m*b,j=_*v-E*b,y=c*p-m*g,A=c*v-E*g,P=m*v-E*p,L=w*P-T*A+R*y+x*j-C*K+M*X;return L?(L=1/L,t[0]=(s*P-l*A+d*y)*L,t[1]=(r*A-n*P-o*y)*L,t[2]=(g*M-p*C+v*x)*L,t[3]=(m*C-c*M-E*x)*L,t[4]=(l*j-a*P-d*K)*L,t[5]=(i*P-r*j+o*K)*L,t[6]=(p*R-b*M-v*T)*L,t[7]=(_*M-m*R+E*T)*L,t[8]=(a*A-s*j+d*X)*L,t[9]=(n*j-i*A-o*X)*L,t[10]=(b*C-g*R+v*w)*L,t[11]=(c*R-_*C-E*w)*L,t[12]=(s*K-a*y-l*X)*L,t[13]=(i*y-n*K+r*X)*L,t[14]=(g*T-b*x-p*w)*L,t[15]=(_*x-c*T+m*w)*L,t):null}function N(t,e,i){var n=i[0],r=i[1],o=i[2],a,s,l,d,_,c,m,E,b,g,p,v;return e===t?(t[12]=e[0]*n+e[4]*r+e[8]*o+e[12],t[13]=e[1]*n+e[5]*r+e[9]*o+e[13],t[14]=e[2]*n+e[6]*r+e[10]*o+e[14],t[15]=e[3]*n+e[7]*r+e[11]*o+e[15]):(a=e[0],s=e[1],l=e[2],d=e[3],_=e[4],c=e[5],m=e[6],E=e[7],b=e[8],g=e[9],p=e[10],v=e[11],t[0]=a,t[1]=s,t[2]=l,t[3]=d,t[4]=_,t[5]=c,t[6]=m,t[7]=E,t[8]=b,t[9]=g,t[10]=p,t[11]=v,t[12]=a*n+_*r+b*o+e[12],t[13]=s*n+c*r+g*o+e[13],t[14]=l*n+m*r+p*o+e[14],t[15]=d*n+E*r+v*o+e[15]),t}function Rt(t,e,i){var n=i[0],r=i[1],o=i[2];return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*o,t[9]=e[9]*o,t[10]=e[10]*o,t[11]=e[11]*o,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Me(t,e,i){var n=Math.sin(i),r=Math.cos(i),o=e[4],a=e[5],s=e[6],l=e[7],d=e[8],_=e[9],c=e[10],m=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=o*r+d*n,t[5]=a*r+_*n,t[6]=s*r+c*n,t[7]=l*r+m*n,t[8]=d*r-o*n,t[9]=_*r-a*n,t[10]=c*r-s*n,t[11]=m*r-l*n,t}function Ie(t,e,i){var n=Math.sin(i),r=Math.cos(i),o=e[0],a=e[1],s=e[2],l=e[3],d=e[8],_=e[9],c=e[10],m=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=o*r-d*n,t[1]=a*r-_*n,t[2]=s*r-c*n,t[3]=l*r-m*n,t[8]=o*n+d*r,t[9]=a*n+_*r,t[10]=s*n+c*r,t[11]=l*n+m*r,t}function tt(t,e,i){var n=Math.sin(i),r=Math.cos(i),o=e[0],a=e[1],s=e[2],l=e[3],d=e[4],_=e[5],c=e[6],m=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=o*r+d*n,t[1]=a*r+_*n,t[2]=s*r+c*n,t[3]=l*r+m*n,t[4]=d*r-o*n,t[5]=_*r-a*n,t[6]=c*r-s*n,t[7]=m*r-l*n,t}function Ot(t,e,i,n,r){var o=1/Math.tan(e/2),a;return t[0]=o/i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=o,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,r!=null&&r!==1/0?(a=1/(n-r),t[10]=(r+n)*a,t[14]=2*r*n*a):(t[10]=-1,t[14]=-2*n),t}var We=Ot;function te(){var t=new Ee(3);return Ee!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function se(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function Vt(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function Dt(t,e){var i=e[0],n=e[1],r=e[2],o=i*i+n*n+r*r;return o>0&&(o=1/Math.sqrt(o)),t[0]=e[0]*o,t[1]=e[1]*o,t[2]=e[2]*o,t}(function(){var t=te();return function(e,i,n,r,o,a){var s,l;for(i||(i=3),n||(n=0),r?l=Math.min(r*i+n,e.length):l=e.length,s=n;s<l;s+=i)t[0]=e[s],t[1]=e[s+1],t[2]=e[s+2],o(t,t,a),e[s]=t[0],e[s+1]=t[1],e[s+2]=t[2];return e}})();function Le(){var t=new Ee(4);return Ee!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function Pe(t,e,i,n,r){return t[0]=e,t[1]=i,t[2]=n,t[3]=r,t}function Re(t,e,i){var n=e[0],r=e[1],o=e[2],a=e[3];return t[0]=i[0]*n+i[4]*r+i[8]*o+i[12]*a,t[1]=i[1]*n+i[5]*r+i[9]*o+i[13]*a,t[2]=i[2]*n+i[6]*r+i[10]*o+i[14]*a,t[3]=i[3]*n+i[7]*r+i[11]*o+i[15]*a,t}(function(){var t=Le();return function(e,i,n,r,o,a){var s,l;for(i||(i=4),n||(n=0),r?l=Math.min(r*i+n,e.length):l=e.length,s=n;s<l;s+=i)t[0]=e[s],t[1]=e[s+1],t[2]=e[s+2],t[3]=e[s+3],o(t,t,a),e[s]=t[0],e[s+1]=t[1],e[s+2]=t[2],e[s+3]=t[3];return e}})();function Mt(t){if(!!t&&!(typeof window>"u")){var e=document.createElement("style");return e.setAttribute("type","text/css"),e.innerHTML=t,document.head.appendChild(e),t}}function ge(t,e){var i=t.__state.conversionName.toString(),n=Math.round(t.r),r=Math.round(t.g),o=Math.round(t.b),a=t.a,s=Math.round(t.h),l=t.s.toFixed(1),d=t.v.toFixed(1);if(e||i==="THREE_CHAR_HEX"||i==="SIX_CHAR_HEX"){for(var _=t.hex.toString(16);_.length<6;)_="0"+_;return"#"+_}else{if(i==="CSS_RGB")return"rgb("+n+","+r+","+o+")";if(i==="CSS_RGBA")return"rgba("+n+","+r+","+o+","+a+")";if(i==="HEX")return"0x"+t.hex.toString(16);if(i==="RGB_ARRAY")return"["+n+","+r+","+o+"]";if(i==="RGBA_ARRAY")return"["+n+","+r+","+o+","+a+"]";if(i==="RGB_OBJ")return"{r:"+n+",g:"+r+",b:"+o+"}";if(i==="RGBA_OBJ")return"{r:"+n+",g:"+r+",b:"+o+",a:"+a+"}";if(i==="HSV_OBJ")return"{h:"+s+",s:"+l+",v:"+d+"}";if(i==="HSVA_OBJ")return"{h:"+s+",s:"+l+",v:"+d+",a:"+a+"}"}return"unknown format"}var it=Array.prototype.forEach,be=Array.prototype.slice,h={BREAK:{},extend:function(e){return this.each(be.call(arguments,1),function(i){var n=this.isObject(i)?Object.keys(i):[];n.forEach(function(r){this.isUndefined(i[r])||(e[r]=i[r])}.bind(this))},this),e},defaults:function(e){return this.each(be.call(arguments,1),function(i){var n=this.isObject(i)?Object.keys(i):[];n.forEach(function(r){this.isUndefined(e[r])&&(e[r]=i[r])}.bind(this))},this),e},compose:function(){var e=be.call(arguments);return function(){for(var i=be.call(arguments),n=e.length-1;n>=0;n--)i=[e[n].apply(this,i)];return i[0]}},each:function(e,i,n){if(!!e){if(it&&e.forEach&&e.forEach===it)e.forEach(i,n);else if(e.length===e.length+0){var r=void 0,o=void 0;for(r=0,o=e.length;r<o;r++)if(r in e&&i.call(n,e[r],r)===this.BREAK)return}else for(var a in e)if(i.call(n,e[a],a)===this.BREAK)return}},defer:function(e){setTimeout(e,0)},debounce:function(e,i,n){var r=void 0;return function(){var o=this,a=arguments;function s(){r=null,n||e.apply(o,a)}var l=n||!r;clearTimeout(r),r=setTimeout(s,i),l&&e.apply(o,a)}},toArray:function(e){return e.toArray?e.toArray():be.call(e)},isUndefined:function(e){return e===void 0},isNull:function(e){return e===null},isNaN:function(t){function e(i){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){return isNaN(t)}),isArray:Array.isArray||function(t){return t.constructor===Array},isObject:function(e){return e===Object(e)},isNumber:function(e){return e===e+0},isString:function(e){return e===e+""},isBoolean:function(e){return e===!1||e===!0},isFunction:function(e){return e instanceof Function}},It=[{litmus:h.isString,conversions:{THREE_CHAR_HEX:{read:function(e){var i=e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return i===null?!1:{space:"HEX",hex:parseInt("0x"+i[1].toString()+i[1].toString()+i[2].toString()+i[2].toString()+i[3].toString()+i[3].toString(),0)}},write:ge},SIX_CHAR_HEX:{read:function(e){var i=e.match(/^#([A-F0-9]{6})$/i);return i===null?!1:{space:"HEX",hex:parseInt("0x"+i[1].toString(),0)}},write:ge},CSS_RGB:{read:function(e){var i=e.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return i===null?!1:{space:"RGB",r:parseFloat(i[1]),g:parseFloat(i[2]),b:parseFloat(i[3])}},write:ge},CSS_RGBA:{read:function(e){var i=e.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return i===null?!1:{space:"RGB",r:parseFloat(i[1]),g:parseFloat(i[2]),b:parseFloat(i[3]),a:parseFloat(i[4])}},write:ge}}},{litmus:h.isNumber,conversions:{HEX:{read:function(e){return{space:"HEX",hex:e,conversionName:"HEX"}},write:function(e){return e.hex}}}},{litmus:h.isArray,conversions:{RGB_ARRAY:{read:function(e){return e.length!==3?!1:{space:"RGB",r:e[0],g:e[1],b:e[2]}},write:function(e){return[e.r,e.g,e.b]}},RGBA_ARRAY:{read:function(e){return e.length!==4?!1:{space:"RGB",r:e[0],g:e[1],b:e[2],a:e[3]}},write:function(e){return[e.r,e.g,e.b,e.a]}}}},{litmus:h.isObject,conversions:{RGBA_OBJ:{read:function(e){return h.isNumber(e.r)&&h.isNumber(e.g)&&h.isNumber(e.b)&&h.isNumber(e.a)?{space:"RGB",r:e.r,g:e.g,b:e.b,a:e.a}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}},RGB_OBJ:{read:function(e){return h.isNumber(e.r)&&h.isNumber(e.g)&&h.isNumber(e.b)?{space:"RGB",r:e.r,g:e.g,b:e.b}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b}}},HSVA_OBJ:{read:function(e){return h.isNumber(e.h)&&h.isNumber(e.s)&&h.isNumber(e.v)&&h.isNumber(e.a)?{space:"HSV",h:e.h,s:e.s,v:e.v,a:e.a}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v,a:e.a}}},HSV_OBJ:{read:function(e){return h.isNumber(e.h)&&h.isNumber(e.s)&&h.isNumber(e.v)?{space:"HSV",h:e.h,s:e.s,v:e.v}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v}}}}}],xe=void 0,Oe=void 0,je=function(){Oe=!1;var e=arguments.length>1?h.toArray(arguments):arguments[0];return h.each(It,function(i){if(i.litmus(e))return h.each(i.conversions,function(n,r){if(xe=n.read(e),Oe===!1&&xe!==!1)return Oe=xe,xe.conversionName=r,xe.conversion=n,h.BREAK}),h.BREAK}),Oe},nt=void 0,Se={hsv_to_rgb:function(e,i,n){var r=Math.floor(e/60)%6,o=e/60-Math.floor(e/60),a=n*(1-i),s=n*(1-o*i),l=n*(1-(1-o)*i),d=[[n,l,a],[s,n,a],[a,n,l],[a,s,n],[l,a,n],[n,a,s]][r];return{r:d[0]*255,g:d[1]*255,b:d[2]*255}},rgb_to_hsv:function(e,i,n){var r=Math.min(e,i,n),o=Math.max(e,i,n),a=o-r,s=void 0,l=void 0;if(o!==0)l=a/o;else return{h:NaN,s:0,v:0};return e===o?s=(i-n)/a:i===o?s=2+(n-e)/a:s=4+(e-i)/a,s/=6,s<0&&(s+=1),{h:s*360,s:l,v:o/255}},rgb_to_hex:function(e,i,n){var r=this.hex_with_component(0,2,e);return r=this.hex_with_component(r,1,i),r=this.hex_with_component(r,0,n),r},component_from_hex:function(e,i){return e>>i*8&255},hex_with_component:function(e,i,n){return n<<(nt=i*8)|e&~(255<<nt)}},St=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},$=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},Y=function(){function t(e,i){for(var n=0;n<i.length;n++){var r=i[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),ae=function t(e,i,n){e===null&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,i);if(r===void 0){var o=Object.getPrototypeOf(e);return o===null?void 0:t(o,i,n)}else{if("value"in r)return r.value;var a=r.get;return a===void 0?void 0:a.call(n)}},ue=function(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},le=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t},S=function(){function t(){if($(this,t),this.__state=je.apply(this,arguments),this.__state===!1)throw new Error("Failed to interpret color arguments");this.__state.a=this.__state.a||1}return Y(t,[{key:"toString",value:function(){return ge(this)}},{key:"toHexString",value:function(){return ge(this,!0)}},{key:"toOriginal",value:function(){return this.__state.conversion.write(this)}}]),t}();function Xe(t,e,i){Object.defineProperty(t,e,{get:function(){return this.__state.space==="RGB"?this.__state[e]:(S.recalculateRGB(this,e,i),this.__state[e])},set:function(r){this.__state.space!=="RGB"&&(S.recalculateRGB(this,e,i),this.__state.space="RGB"),this.__state[e]=r}})}function Ke(t,e){Object.defineProperty(t,e,{get:function(){return this.__state.space==="HSV"?this.__state[e]:(S.recalculateHSV(this),this.__state[e])},set:function(n){this.__state.space!=="HSV"&&(S.recalculateHSV(this),this.__state.space="HSV"),this.__state[e]=n}})}S.recalculateRGB=function(t,e,i){if(t.__state.space==="HEX")t.__state[e]=Se.component_from_hex(t.__state.hex,i);else if(t.__state.space==="HSV")h.extend(t.__state,Se.hsv_to_rgb(t.__state.h,t.__state.s,t.__state.v));else throw new Error("Corrupted color state")};S.recalculateHSV=function(t){var e=Se.rgb_to_hsv(t.r,t.g,t.b);h.extend(t.__state,{s:e.s,v:e.v}),h.isNaN(e.h)?h.isUndefined(t.__state.h)&&(t.__state.h=0):t.__state.h=e.h};S.COMPONENTS=["r","g","b","h","s","v","hex","a"];Xe(S.prototype,"r",2);Xe(S.prototype,"g",1);Xe(S.prototype,"b",0);Ke(S.prototype,"h");Ke(S.prototype,"s");Ke(S.prototype,"v");Object.defineProperty(S.prototype,"a",{get:function(){return this.__state.a},set:function(e){this.__state.a=e}});Object.defineProperty(S.prototype,"hex",{get:function(){return this.__state.space!=="HEX"&&(this.__state.hex=Se.rgb_to_hex(this.r,this.g,this.b),this.__state.space="HEX"),this.__state.hex},set:function(e){this.__state.space="HEX",this.__state.hex=e}});var _e=function(){function t(e,i){$(this,t),this.initialValue=e[i],this.domElement=document.createElement("div"),this.object=e,this.property=i,this.__onChange=void 0,this.__onFinishChange=void 0}return Y(t,[{key:"onChange",value:function(i){return this.__onChange=i,this}},{key:"onFinishChange",value:function(i){return this.__onFinishChange=i,this}},{key:"setValue",value:function(i){return this.object[this.property]=i,this.__onChange&&this.__onChange.call(this,i),this.updateDisplay(),this}},{key:"getValue",value:function(){return this.object[this.property]}},{key:"updateDisplay",value:function(){return this}},{key:"isModified",value:function(){return this.initialValue!==this.getValue()}}]),t}(),Nt={HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},mt={};h.each(Nt,function(t,e){h.each(t,function(i){mt[i]=e})});var Ut=/(\d+(\.\d+)?)px/;function Q(t){if(t==="0"||h.isUndefined(t))return 0;var e=t.match(Ut);return h.isNull(e)?0:parseFloat(e[1])}var f={makeSelectable:function(e,i){e===void 0||e.style===void 0||(e.onselectstart=i?function(){return!1}:function(){},e.style.MozUserSelect=i?"auto":"none",e.style.KhtmlUserSelect=i?"auto":"none",e.unselectable=i?"on":"off")},makeFullscreen:function(e,i,n){var r=n,o=i;h.isUndefined(o)&&(o=!0),h.isUndefined(r)&&(r=!0),e.style.position="absolute",o&&(e.style.left=0,e.style.right=0),r&&(e.style.top=0,e.style.bottom=0)},fakeEvent:function(e,i,n,r){var o=n||{},a=mt[i];if(!a)throw new Error("Event type "+i+" not supported.");var s=document.createEvent(a);switch(a){case"MouseEvents":{var l=o.x||o.clientX||0,d=o.y||o.clientY||0;s.initMouseEvent(i,o.bubbles||!1,o.cancelable||!0,window,o.clickCount||1,0,0,l,d,!1,!1,!1,!1,0,null);break}case"KeyboardEvents":{var _=s.initKeyboardEvent||s.initKeyEvent;h.defaults(o,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),_(i,o.bubbles||!1,o.cancelable,window,o.ctrlKey,o.altKey,o.shiftKey,o.metaKey,o.keyCode,o.charCode);break}default:{s.initEvent(i,o.bubbles||!1,o.cancelable||!0);break}}h.defaults(s,r),e.dispatchEvent(s)},bind:function(e,i,n,r){var o=r||!1;return e.addEventListener?e.addEventListener(i,n,o):e.attachEvent&&e.attachEvent("on"+i,n),f},unbind:function(e,i,n,r){var o=r||!1;return e.removeEventListener?e.removeEventListener(i,n,o):e.detachEvent&&e.detachEvent("on"+i,n),f},addClass:function(e,i){if(e.className===void 0)e.className=i;else if(e.className!==i){var n=e.className.split(/ +/);n.indexOf(i)===-1&&(n.push(i),e.className=n.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return f},removeClass:function(e,i){if(i)if(e.className===i)e.removeAttribute("class");else{var n=e.className.split(/ +/),r=n.indexOf(i);r!==-1&&(n.splice(r,1),e.className=n.join(" "))}else e.className=void 0;return f},hasClass:function(e,i){return new RegExp("(?:^|\\s+)"+i+"(?:\\s+|$)").test(e.className)||!1},getWidth:function(e){var i=getComputedStyle(e);return Q(i["border-left-width"])+Q(i["border-right-width"])+Q(i["padding-left"])+Q(i["padding-right"])+Q(i.width)},getHeight:function(e){var i=getComputedStyle(e);return Q(i["border-top-width"])+Q(i["border-bottom-width"])+Q(i["padding-top"])+Q(i["padding-bottom"])+Q(i.height)},getOffset:function(e){var i=e,n={left:0,top:0};if(i.offsetParent)do n.left+=i.offsetLeft,n.top+=i.offsetTop,i=i.offsetParent;while(i);return n},isActive:function(e){return e===document.activeElement&&(e.type||e.href)}},ht=function(t){ue(e,t);function e(i,n){$(this,e);var r=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n)),o=r;r.__prev=r.getValue(),r.__checkbox=document.createElement("input"),r.__checkbox.setAttribute("type","checkbox");function a(){o.setValue(!o.__prev)}return f.bind(r.__checkbox,"change",a,!1),r.domElement.appendChild(r.__checkbox),r.updateDisplay(),r}return Y(e,[{key:"setValue",value:function(n){var r=ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,n);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),r}},{key:"updateDisplay",value:function(){return this.getValue()===!0?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0,this.__prev=!0):(this.__checkbox.checked=!1,this.__prev=!1),ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(_e),Ft=function(t){ue(e,t);function e(i,n,r){$(this,e);var o=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n)),a=r,s=o;if(o.__select=document.createElement("select"),h.isArray(a)){var l={};h.each(a,function(d){l[d]=d}),a=l}return h.each(a,function(d,_){var c=document.createElement("option");c.innerHTML=_,c.setAttribute("value",d),s.__select.appendChild(c)}),o.updateDisplay(),f.bind(o.__select,"change",function(){var d=this.options[this.selectedIndex].value;s.setValue(d)}),o.domElement.appendChild(o.__select),o}return Y(e,[{key:"setValue",value:function(n){var r=ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,n);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),r}},{key:"updateDisplay",value:function(){return f.isActive(this.__select)?this:(this.__select.value=this.getValue(),ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this))}}]),e}(_e),kt=function(t){ue(e,t);function e(i,n){$(this,e);var r=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n)),o=r;function a(){o.setValue(o.__input.value)}function s(){o.__onFinishChange&&o.__onFinishChange.call(o,o.getValue())}return r.__input=document.createElement("input"),r.__input.setAttribute("type","text"),f.bind(r.__input,"keyup",a),f.bind(r.__input,"change",a),f.bind(r.__input,"blur",s),f.bind(r.__input,"keydown",function(l){l.keyCode===13&&this.blur()}),r.updateDisplay(),r.domElement.appendChild(r.__input),r}return Y(e,[{key:"updateDisplay",value:function(){return f.isActive(this.__input)||(this.__input.value=this.getValue()),ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(_e);function rt(t){var e=t.toString();return e.indexOf(".")>-1?e.length-e.indexOf(".")-1:0}var pt=function(t){ue(e,t);function e(i,n,r){$(this,e);var o=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n)),a=r||{};return o.__min=a.min,o.__max=a.max,o.__step=a.step,h.isUndefined(o.__step)?o.initialValue===0?o.__impliedStep=1:o.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(o.initialValue))/Math.LN10))/10:o.__impliedStep=o.__step,o.__precision=rt(o.__impliedStep),o}return Y(e,[{key:"setValue",value:function(n){var r=n;return this.__min!==void 0&&r<this.__min?r=this.__min:this.__max!==void 0&&r>this.__max&&(r=this.__max),this.__step!==void 0&&r%this.__step!==0&&(r=Math.round(r/this.__step)*this.__step),ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,r)}},{key:"min",value:function(n){return this.__min=n,this}},{key:"max",value:function(n){return this.__max=n,this}},{key:"step",value:function(n){return this.__step=n,this.__impliedStep=n,this.__precision=rt(n),this}}]),e}(_e);function jt(t,e){var i=Math.pow(10,e);return Math.round(t*i)/i}var Ne=function(t){ue(e,t);function e(i,n,r){$(this,e);var o=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n,r));o.__truncationSuspended=!1;var a=o,s=void 0;function l(){var b=parseFloat(a.__input.value);h.isNaN(b)||a.setValue(b)}function d(){a.__onFinishChange&&a.__onFinishChange.call(a,a.getValue())}function _(){d()}function c(b){var g=s-b.clientY;a.setValue(a.getValue()+g*a.__impliedStep),s=b.clientY}function m(){f.unbind(window,"mousemove",c),f.unbind(window,"mouseup",m),d()}function E(b){f.bind(window,"mousemove",c),f.bind(window,"mouseup",m),s=b.clientY}return o.__input=document.createElement("input"),o.__input.setAttribute("type","text"),f.bind(o.__input,"change",l),f.bind(o.__input,"blur",_),f.bind(o.__input,"mousedown",E),f.bind(o.__input,"keydown",function(b){b.keyCode===13&&(a.__truncationSuspended=!0,this.blur(),a.__truncationSuspended=!1,d())}),o.updateDisplay(),o.domElement.appendChild(o.__input),o}return Y(e,[{key:"updateDisplay",value:function(){return this.__input.value=this.__truncationSuspended?this.getValue():jt(this.getValue(),this.__precision),ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(pt);function ot(t,e,i,n,r){return n+(r-n)*((t-e)/(i-e))}var Be=function(t){ue(e,t);function e(i,n,r,o,a){$(this,e);var s=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n,{min:r,max:o,step:a})),l=s;s.__background=document.createElement("div"),s.__foreground=document.createElement("div"),f.bind(s.__background,"mousedown",d),f.bind(s.__background,"touchstart",m),f.addClass(s.__background,"slider"),f.addClass(s.__foreground,"slider-fg");function d(g){document.activeElement.blur(),f.bind(window,"mousemove",_),f.bind(window,"mouseup",c),_(g)}function _(g){g.preventDefault();var p=l.__background.getBoundingClientRect();return l.setValue(ot(g.clientX,p.left,p.right,l.__min,l.__max)),!1}function c(){f.unbind(window,"mousemove",_),f.unbind(window,"mouseup",c),l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}function m(g){g.touches.length===1&&(f.bind(window,"touchmove",E),f.bind(window,"touchend",b),E(g))}function E(g){var p=g.touches[0].clientX,v=l.__background.getBoundingClientRect();l.setValue(ot(p,v.left,v.right,l.__min,l.__max))}function b(){f.unbind(window,"touchmove",E),f.unbind(window,"touchend",b),l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}return s.updateDisplay(),s.__background.appendChild(s.__foreground),s.domElement.appendChild(s.__background),s}return Y(e,[{key:"updateDisplay",value:function(){var n=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=n*100+"%",ae(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(pt),vt=function(t){ue(e,t);function e(i,n,r){$(this,e);var o=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n)),a=o;return o.__button=document.createElement("div"),o.__button.innerHTML=r===void 0?"Fire":r,f.bind(o.__button,"click",function(s){return s.preventDefault(),a.fire(),!1}),f.addClass(o.__button,"button"),o.domElement.appendChild(o.__button),o}return Y(e,[{key:"fire",value:function(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())}}]),e}(_e),He=function(t){ue(e,t);function e(i,n){$(this,e);var r=le(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n));r.__color=new S(r.getValue()),r.__temp=new S(0);var o=r;r.domElement=document.createElement("div"),f.makeSelectable(r.domElement,!1),r.__selector=document.createElement("div"),r.__selector.className="selector",r.__saturation_field=document.createElement("div"),r.__saturation_field.className="saturation-field",r.__field_knob=document.createElement("div"),r.__field_knob.className="field-knob",r.__field_knob_border="2px solid ",r.__hue_knob=document.createElement("div"),r.__hue_knob.className="hue-knob",r.__hue_field=document.createElement("div"),r.__hue_field.className="hue-field",r.__input=document.createElement("input"),r.__input.type="text",r.__input_textShadow="0 1px 1px ",f.bind(r.__input,"keydown",function(g){g.keyCode===13&&c.call(this)}),f.bind(r.__input,"blur",c),f.bind(r.__selector,"mousedown",function(){f.addClass(this,"drag").bind(window,"mouseup",function(){f.removeClass(o.__selector,"drag")})}),f.bind(r.__selector,"touchstart",function(){f.addClass(this,"drag").bind(window,"touchend",function(){f.removeClass(o.__selector,"drag")})});var a=document.createElement("div");h.extend(r.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"}),h.extend(r.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:r.__field_knob_border+(r.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1}),h.extend(r.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1}),h.extend(r.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"}),h.extend(a.style,{width:"100%",height:"100%",background:"none"}),st(a,"top","rgba(0,0,0,0)","#000"),h.extend(r.__hue_field.style,{width:"15px",height:"100px",border:"1px solid #555",cursor:"ns-resize",position:"absolute",top:"3px",right:"3px"}),Ht(r.__hue_field),h.extend(r.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:r.__input_textShadow+"rgba(0,0,0,0.7)"}),f.bind(r.__saturation_field,"mousedown",s),f.bind(r.__saturation_field,"touchstart",s),f.bind(r.__field_knob,"mousedown",s),f.bind(r.__field_knob,"touchstart",s),f.bind(r.__hue_field,"mousedown",l),f.bind(r.__hue_field,"touchstart",l);function s(g){E(g),f.bind(window,"mousemove",E),f.bind(window,"touchmove",E),f.bind(window,"mouseup",d),f.bind(window,"touchend",d)}function l(g){b(g),f.bind(window,"mousemove",b),f.bind(window,"touchmove",b),f.bind(window,"mouseup",_),f.bind(window,"touchend",_)}function d(){f.unbind(window,"mousemove",E),f.unbind(window,"touchmove",E),f.unbind(window,"mouseup",d),f.unbind(window,"touchend",d),m()}function _(){f.unbind(window,"mousemove",b),f.unbind(window,"touchmove",b),f.unbind(window,"mouseup",_),f.unbind(window,"touchend",_),m()}function c(){var g=je(this.value);g!==!1?(o.__color.__state=g,o.setValue(o.__color.toOriginal())):this.value=o.__color.toString()}function m(){o.__onFinishChange&&o.__onFinishChange.call(o,o.__color.toOriginal())}r.__saturation_field.appendChild(a),r.__selector.appendChild(r.__field_knob),r.__selector.appendChild(r.__saturation_field),r.__selector.appendChild(r.__hue_field),r.__hue_field.appendChild(r.__hue_knob),r.domElement.appendChild(r.__input),r.domElement.appendChild(r.__selector),r.updateDisplay();function E(g){g.type.indexOf("touch")===-1&&g.preventDefault();var p=o.__saturation_field.getBoundingClientRect(),v=g.touches&&g.touches[0]||g,w=v.clientX,T=v.clientY,R=(w-p.left)/(p.right-p.left),x=1-(T-p.top)/(p.bottom-p.top);return x>1?x=1:x<0&&(x=0),R>1?R=1:R<0&&(R=0),o.__color.v=x,o.__color.s=R,o.setValue(o.__color.toOriginal()),!1}function b(g){g.type.indexOf("touch")===-1&&g.preventDefault();var p=o.__hue_field.getBoundingClientRect(),v=g.touches&&g.touches[0]||g,w=v.clientY,T=1-(w-p.top)/(p.bottom-p.top);return T>1?T=1:T<0&&(T=0),o.__color.h=T*360,o.setValue(o.__color.toOriginal()),!1}return r}return Y(e,[{key:"updateDisplay",value:function(){var n=je(this.getValue());if(n!==!1){var r=!1;h.each(S.COMPONENTS,function(s){if(!h.isUndefined(n[s])&&!h.isUndefined(this.__color.__state[s])&&n[s]!==this.__color.__state[s])return r=!0,{}},this),r&&h.extend(this.__color.__state,n)}h.extend(this.__temp.__state,this.__color.__state),this.__temp.a=1;var o=this.__color.v<.5||this.__color.s>.5?255:0,a=255-o;h.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toHexString(),border:this.__field_knob_border+"rgb("+o+","+o+","+o+")"}),this.__hue_knob.style.marginTop=(1-this.__color.h/360)*100+"px",this.__temp.s=1,this.__temp.v=1,st(this.__saturation_field,"left","#fff",this.__temp.toHexString()),this.__input.value=this.__color.toString(),h.extend(this.__input.style,{backgroundColor:this.__color.toHexString(),color:"rgb("+o+","+o+","+o+")",textShadow:this.__input_textShadow+"rgba("+a+","+a+","+a+",.7)"})}}]),e}(_e),Bt=["-moz-","-o-","-webkit-","-ms-",""];function st(t,e,i,n){t.style.background="",h.each(Bt,function(r){t.style.cssText+="background: "+r+"linear-gradient("+e+", "+i+" 0%, "+n+" 100%); "})}function Ht(t){t.style.background="",t.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);",t.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}var zt={load:function(e,i){var n=i||document,r=n.createElement("link");r.type="text/css",r.rel="stylesheet",r.href=e,n.getElementsByTagName("head")[0].appendChild(r)},inject:function(e,i){var n=i||document,r=document.createElement("style");r.type="text/css",r.innerHTML=e;var o=n.getElementsByTagName("head")[0];try{o.appendChild(r)}catch{}}},Gt=`<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`,$t=function(e,i){var n=e[i];return h.isArray(arguments[2])||h.isObject(arguments[2])?new Ft(e,i,arguments[2]):h.isNumber(n)?h.isNumber(arguments[2])&&h.isNumber(arguments[3])?h.isNumber(arguments[4])?new Be(e,i,arguments[2],arguments[3],arguments[4]):new Be(e,i,arguments[2],arguments[3]):h.isNumber(arguments[4])?new Ne(e,i,{min:arguments[2],max:arguments[3],step:arguments[4]}):new Ne(e,i,{min:arguments[2],max:arguments[3]}):h.isString(n)?new kt(e,i):h.isFunction(n)?new vt(e,i,""):h.isBoolean(n)?new ht(e,i):null};function Yt(t){setTimeout(t,1e3/60)}var Wt=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||Yt,Xt=function(){function t(){$(this,t),this.backgroundElement=document.createElement("div"),h.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),f.makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),h.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);var e=this;f.bind(this.backgroundElement,"click",function(){e.hide()})}return Y(t,[{key:"show",value:function(){var i=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),h.defer(function(){i.backgroundElement.style.opacity=1,i.domElement.style.opacity=1,i.domElement.style.webkitTransform="scale(1)"})}},{key:"hide",value:function(){var i=this,n=function r(){i.domElement.style.display="none",i.backgroundElement.style.display="none",f.unbind(i.domElement,"webkitTransitionEnd",r),f.unbind(i.domElement,"transitionend",r),f.unbind(i.domElement,"oTransitionEnd",r)};f.bind(this.domElement,"webkitTransitionEnd",n),f.bind(this.domElement,"transitionend",n),f.bind(this.domElement,"oTransitionEnd",n),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"}},{key:"layout",value:function(){this.domElement.style.left=window.innerWidth/2-f.getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-f.getHeight(this.domElement)/2+"px"}}]),t}(),Kt=Mt(`.dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}
`);zt.inject(Kt);var at="dg",ut=72,lt=20,Ce="Default",Ae=function(){try{return!!window.localStorage}catch{return!1}}(),we=void 0,dt=!0,pe=void 0,ke=!1,gt=[],O=function t(e){var i=this,n=e||{};this.domElement=document.createElement("div"),this.__ul=document.createElement("ul"),this.domElement.appendChild(this.__ul),f.addClass(this.domElement,at),this.__folders={},this.__controllers=[],this.__rememberedObjects=[],this.__rememberedObjectIndecesToControllers=[],this.__listening=[],n=h.defaults(n,{closeOnTop:!1,autoPlace:!0,width:t.DEFAULT_WIDTH}),n=h.defaults(n,{resizable:n.autoPlace,hideable:n.autoPlace}),h.isUndefined(n.load)?n.load={preset:Ce}:n.preset&&(n.load.preset=n.preset),h.isUndefined(n.parent)&&n.hideable&&gt.push(this),n.resizable=h.isUndefined(n.parent)&&n.resizable,n.autoPlace&&h.isUndefined(n.scrollable)&&(n.scrollable=!0);var r=Ae&&localStorage.getItem(ve(this,"isLocal"))==="true",o=void 0,a=void 0;if(Object.defineProperties(this,{parent:{get:function(){return n.parent}},scrollable:{get:function(){return n.scrollable}},autoPlace:{get:function(){return n.autoPlace}},closeOnTop:{get:function(){return n.closeOnTop}},preset:{get:function(){return i.parent?i.getRoot().preset:n.load.preset},set:function(m){i.parent?i.getRoot().preset=m:n.load.preset=m,Jt(this),i.revert()}},width:{get:function(){return n.width},set:function(m){n.width=m,$e(i,m)}},name:{get:function(){return n.name},set:function(m){n.name=m,a&&(a.innerHTML=n.name)}},closed:{get:function(){return n.closed},set:function(m){n.closed=m,n.closed?f.addClass(i.__ul,t.CLASS_CLOSED):f.removeClass(i.__ul,t.CLASS_CLOSED),this.onResize(),i.__closeButton&&(i.__closeButton.innerHTML=m?t.TEXT_OPEN:t.TEXT_CLOSED)}},load:{get:function(){return n.load}},useLocalStorage:{get:function(){return r},set:function(m){Ae&&(r=m,m?f.bind(window,"unload",o):f.unbind(window,"unload",o),localStorage.setItem(ve(i,"isLocal"),m))}}}),h.isUndefined(n.parent)){if(this.closed=n.closed||!1,f.addClass(this.domElement,t.CLASS_MAIN),f.makeSelectable(this.domElement,!1),Ae&&r){i.useLocalStorage=!0;var s=localStorage.getItem(ve(this,"gui"));s&&(n.load=JSON.parse(s))}this.__closeButton=document.createElement("div"),this.__closeButton.innerHTML=t.TEXT_CLOSED,f.addClass(this.__closeButton,t.CLASS_CLOSE_BUTTON),n.closeOnTop?(f.addClass(this.__closeButton,t.CLASS_CLOSE_TOP),this.domElement.insertBefore(this.__closeButton,this.domElement.childNodes[0])):(f.addClass(this.__closeButton,t.CLASS_CLOSE_BOTTOM),this.domElement.appendChild(this.__closeButton)),f.bind(this.__closeButton,"click",function(){i.closed=!i.closed})}else{n.closed===void 0&&(n.closed=!0);var l=document.createTextNode(n.name);f.addClass(l,"controller-name"),a=qe(i,l);var d=function(m){return m.preventDefault(),i.closed=!i.closed,!1};f.addClass(this.__ul,t.CLASS_CLOSED),f.addClass(a,"title"),f.bind(a,"click",d),n.closed||(this.closed=!1)}n.autoPlace&&(h.isUndefined(n.parent)&&(dt&&(pe=document.createElement("div"),f.addClass(pe,at),f.addClass(pe,t.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(pe),dt=!1),pe.appendChild(this.domElement),f.addClass(this.domElement,t.CLASS_AUTO_PLACE)),this.parent||$e(i,n.width)),this.__resizeHandler=function(){i.onResizeDebounced()},f.bind(window,"resize",this.__resizeHandler),f.bind(this.__ul,"webkitTransitionEnd",this.__resizeHandler),f.bind(this.__ul,"transitionend",this.__resizeHandler),f.bind(this.__ul,"oTransitionEnd",this.__resizeHandler),this.onResize(),n.resizable&&Zt(this),o=function(){Ae&&localStorage.getItem(ve(i,"isLocal"))==="true"&&localStorage.setItem(ve(i,"gui"),JSON.stringify(i.getSaveObject()))},this.saveToLocalStorageIfPossible=o;function _(){var c=i.getRoot();c.width+=1,h.defer(function(){c.width-=1})}n.parent||_()};O.toggleHide=function(){ke=!ke,h.each(gt,function(t){t.domElement.style.display=ke?"none":""})};O.CLASS_AUTO_PLACE="a";O.CLASS_AUTO_PLACE_CONTAINER="ac";O.CLASS_MAIN="main";O.CLASS_CONTROLLER_ROW="cr";O.CLASS_TOO_TALL="taller-than-window";O.CLASS_CLOSED="closed";O.CLASS_CLOSE_BUTTON="close-button";O.CLASS_CLOSE_TOP="close-top";O.CLASS_CLOSE_BOTTOM="close-bottom";O.CLASS_DRAG="drag";O.DEFAULT_WIDTH=245;O.TEXT_CLOSED="Close Controls";O.TEXT_OPEN="Open Controls";O._keydownHandler=function(t){document.activeElement.type!=="text"&&(t.which===ut||t.keyCode===ut)&&O.toggleHide()};f.bind(window,"keydown",O._keydownHandler,!1);h.extend(O.prototype,{add:function(e,i){return ye(this,e,i,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(e,i){return ye(this,e,i,{color:!0})},remove:function(e){this.__ul.removeChild(e.__li),this.__controllers.splice(this.__controllers.indexOf(e),1);var i=this;h.defer(function(){i.onResize()})},destroy:function(){if(this.parent)throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");this.autoPlace&&pe.removeChild(this.domElement);var e=this;h.each(this.__folders,function(i){e.removeFolder(i)}),f.unbind(window,"keydown",O._keydownHandler,!1),ct(this)},addFolder:function(e){if(this.__folders[e]!==void 0)throw new Error('You already have a folder in this GUI by the name "'+e+'"');var i={name:e,parent:this};i.autoPlace=this.autoPlace,this.load&&this.load.folders&&this.load.folders[e]&&(i.closed=this.load.folders[e].closed,i.load=this.load.folders[e]);var n=new O(i);this.__folders[e]=n;var r=qe(this,n.domElement);return f.addClass(r,"folder"),n},removeFolder:function(e){this.__ul.removeChild(e.domElement.parentElement),delete this.__folders[e.name],this.load&&this.load.folders&&this.load.folders[e.name]&&delete this.load.folders[e.name],ct(e);var i=this;h.each(e.__folders,function(n){e.removeFolder(n)}),h.defer(function(){i.onResize()})},open:function(){this.closed=!1},close:function(){this.closed=!0},hide:function(){this.domElement.style.display="none"},show:function(){this.domElement.style.display=""},onResize:function(){var e=this.getRoot();if(e.scrollable){var i=f.getOffset(e.__ul).top,n=0;h.each(e.__ul.childNodes,function(r){e.autoPlace&&r===e.__save_row||(n+=f.getHeight(r))}),window.innerHeight-i-lt<n?(f.addClass(e.domElement,O.CLASS_TOO_TALL),e.__ul.style.height=window.innerHeight-i-lt+"px"):(f.removeClass(e.domElement,O.CLASS_TOO_TALL),e.__ul.style.height="auto")}e.__resize_handle&&h.defer(function(){e.__resize_handle.style.height=e.__ul.offsetHeight+"px"}),e.__closeButton&&(e.__closeButton.style.width=e.width+"px")},onResizeDebounced:h.debounce(function(){this.onResize()},50),remember:function(){if(h.isUndefined(we)&&(we=new Xt,we.domElement.innerHTML=Gt),this.parent)throw new Error("You can only call remember on a top level GUI.");var e=this;h.each(Array.prototype.slice.call(arguments),function(i){e.__rememberedObjects.length===0&&Qt(e),e.__rememberedObjects.indexOf(i)===-1&&e.__rememberedObjects.push(i)}),this.autoPlace&&$e(this,this.width)},getRoot:function(){for(var e=this;e.parent;)e=e.parent;return e},getSaveObject:function(){var e=this.load;return e.closed=this.closed,this.__rememberedObjects.length>0&&(e.preset=this.preset,e.remembered||(e.remembered={}),e.remembered[this.preset]=Ve(this)),e.folders={},h.each(this.__folders,function(i,n){e.folders[n]=i.getSaveObject()}),e},save:function(){this.load.remembered||(this.load.remembered={}),this.load.remembered[this.preset]=Ve(this),ze(this,!1),this.saveToLocalStorageIfPossible()},saveAs:function(e){this.load.remembered||(this.load.remembered={},this.load.remembered[Ce]=Ve(this,!0)),this.load.remembered[e]=Ve(this),this.preset=e,Ge(this,e,!0),this.saveToLocalStorageIfPossible()},revert:function(e){h.each(this.__controllers,function(i){this.getRoot().load.remembered?Et(e||this.getRoot(),i):i.setValue(i.initialValue),i.__onFinishChange&&i.__onFinishChange.call(i,i.getValue())},this),h.each(this.__folders,function(i){i.revert(i)}),e||ze(this.getRoot(),!1)},listen:function(e){var i=this.__listening.length===0;this.__listening.push(e),i&&bt(this.__listening)},updateDisplay:function(){h.each(this.__controllers,function(e){e.updateDisplay()}),h.each(this.__folders,function(e){e.updateDisplay()})}});function qe(t,e,i){var n=document.createElement("li");return e&&n.appendChild(e),i?t.__ul.insertBefore(n,i):t.__ul.appendChild(n),t.onResize(),n}function ct(t){f.unbind(window,"resize",t.__resizeHandler),t.saveToLocalStorageIfPossible&&f.unbind(window,"unload",t.saveToLocalStorageIfPossible)}function ze(t,e){var i=t.__preset_select[t.__preset_select.selectedIndex];e?i.innerHTML=i.value+"*":i.innerHTML=i.value}function qt(t,e,i){if(i.__li=e,i.__gui=t,h.extend(i,{options:function(a){if(arguments.length>1){var s=i.__li.nextElementSibling;return i.remove(),ye(t,i.object,i.property,{before:s,factoryArgs:[h.toArray(arguments)]})}if(h.isArray(a)||h.isObject(a)){var l=i.__li.nextElementSibling;return i.remove(),ye(t,i.object,i.property,{before:l,factoryArgs:[a]})}},name:function(a){return i.__li.firstElementChild.firstElementChild.innerHTML=a,i},listen:function(){return i.__gui.listen(i),i},remove:function(){return i.__gui.remove(i),i}}),i instanceof Be){var n=new Ne(i.object,i.property,{min:i.__min,max:i.__max,step:i.__step});h.each(["updateDisplay","onChange","onFinishChange","step","min","max"],function(o){var a=i[o],s=n[o];i[o]=n[o]=function(){var l=Array.prototype.slice.call(arguments);return s.apply(n,l),a.apply(i,l)}}),f.addClass(e,"has-slider"),i.domElement.insertBefore(n.domElement,i.domElement.firstElementChild)}else if(i instanceof Ne){var r=function(a){if(h.isNumber(i.__min)&&h.isNumber(i.__max)){var s=i.__li.firstElementChild.firstElementChild.innerHTML,l=i.__gui.__listening.indexOf(i)>-1;i.remove();var d=ye(t,i.object,i.property,{before:i.__li.nextElementSibling,factoryArgs:[i.__min,i.__max,i.__step]});return d.name(s),l&&d.listen(),d}return a};i.min=h.compose(r,i.min),i.max=h.compose(r,i.max)}else i instanceof ht?(f.bind(e,"click",function(){f.fakeEvent(i.__checkbox,"click")}),f.bind(i.__checkbox,"click",function(o){o.stopPropagation()})):i instanceof vt?(f.bind(e,"click",function(){f.fakeEvent(i.__button,"click")}),f.bind(e,"mouseover",function(){f.addClass(i.__button,"hover")}),f.bind(e,"mouseout",function(){f.removeClass(i.__button,"hover")})):i instanceof He&&(f.addClass(e,"color"),i.updateDisplay=h.compose(function(o){return e.style.borderLeftColor=i.__color.toString(),o},i.updateDisplay),i.updateDisplay());i.setValue=h.compose(function(o){return t.getRoot().__preset_select&&i.isModified()&&ze(t.getRoot(),!0),o},i.setValue)}function Et(t,e){var i=t.getRoot(),n=i.__rememberedObjects.indexOf(e.object);if(n!==-1){var r=i.__rememberedObjectIndecesToControllers[n];if(r===void 0&&(r={},i.__rememberedObjectIndecesToControllers[n]=r),r[e.property]=e,i.load&&i.load.remembered){var o=i.load.remembered,a=void 0;if(o[t.preset])a=o[t.preset];else if(o[Ce])a=o[Ce];else return;if(a[n]&&a[n][e.property]!==void 0){var s=a[n][e.property];e.initialValue=s,e.setValue(s)}}}}function ye(t,e,i,n){if(e[i]===void 0)throw new Error('Object "'+e+'" has no property "'+i+'"');var r=void 0;if(n.color)r=new He(e,i);else{var o=[e,i].concat(n.factoryArgs);r=$t.apply(t,o)}n.before instanceof _e&&(n.before=n.before.__li),Et(t,r),f.addClass(r.domElement,"c");var a=document.createElement("span");f.addClass(a,"property-name"),a.innerHTML=r.property;var s=document.createElement("div");s.appendChild(a),s.appendChild(r.domElement);var l=qe(t,s,n.before);return f.addClass(l,O.CLASS_CONTROLLER_ROW),r instanceof He?f.addClass(l,"color"):f.addClass(l,St(r.getValue())),qt(t,l,r),t.__controllers.push(r),r}function ve(t,e){return document.location.href+"."+e}function Ge(t,e,i){var n=document.createElement("option");n.innerHTML=e,n.value=e,t.__preset_select.appendChild(n),i&&(t.__preset_select.selectedIndex=t.__preset_select.length-1)}function ft(t,e){e.style.display=t.useLocalStorage?"block":"none"}function Qt(t){var e=t.__save_row=document.createElement("li");f.addClass(t.domElement,"has-save"),t.__ul.insertBefore(e,t.__ul.firstChild),f.addClass(e,"save-row");var i=document.createElement("span");i.innerHTML="&nbsp;",f.addClass(i,"button gears");var n=document.createElement("span");n.innerHTML="Save",f.addClass(n,"button"),f.addClass(n,"save");var r=document.createElement("span");r.innerHTML="New",f.addClass(r,"button"),f.addClass(r,"save-as");var o=document.createElement("span");o.innerHTML="Revert",f.addClass(o,"button"),f.addClass(o,"revert");var a=t.__preset_select=document.createElement("select");if(t.load&&t.load.remembered?h.each(t.load.remembered,function(c,m){Ge(t,m,m===t.preset)}):Ge(t,Ce,!1),f.bind(a,"change",function(){for(var c=0;c<t.__preset_select.length;c++)t.__preset_select[c].innerHTML=t.__preset_select[c].value;t.preset=this.value}),e.appendChild(a),e.appendChild(i),e.appendChild(n),e.appendChild(r),e.appendChild(o),Ae){var s=document.getElementById("dg-local-explain"),l=document.getElementById("dg-local-storage"),d=document.getElementById("dg-save-locally");d.style.display="block",localStorage.getItem(ve(t,"isLocal"))==="true"&&l.setAttribute("checked","checked"),ft(t,s),f.bind(l,"change",function(){t.useLocalStorage=!t.useLocalStorage,ft(t,s)})}var _=document.getElementById("dg-new-constructor");f.bind(_,"keydown",function(c){c.metaKey&&(c.which===67||c.keyCode===67)&&we.hide()}),f.bind(i,"click",function(){_.innerHTML=JSON.stringify(t.getSaveObject(),void 0,2),we.show(),_.focus(),_.select()}),f.bind(n,"click",function(){t.save()}),f.bind(r,"click",function(){var c=prompt("Enter a new preset name.");c&&t.saveAs(c)}),f.bind(o,"click",function(){t.revert()})}function Zt(t){var e=void 0;t.__resize_handle=document.createElement("div"),h.extend(t.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"});function i(o){return o.preventDefault(),t.width+=e-o.clientX,t.onResize(),e=o.clientX,!1}function n(){f.removeClass(t.__closeButton,O.CLASS_DRAG),f.unbind(window,"mousemove",i),f.unbind(window,"mouseup",n)}function r(o){return o.preventDefault(),e=o.clientX,f.addClass(t.__closeButton,O.CLASS_DRAG),f.bind(window,"mousemove",i),f.bind(window,"mouseup",n),!1}f.bind(t.__resize_handle,"mousedown",r),f.bind(t.__closeButton,"mousedown",r),t.domElement.insertBefore(t.__resize_handle,t.domElement.firstElementChild)}function $e(t,e){t.domElement.style.width=e+"px",t.__save_row&&t.autoPlace&&(t.__save_row.style.width=e+"px"),t.__closeButton&&(t.__closeButton.style.width=e+"px")}function Ve(t,e){var i={};return h.each(t.__rememberedObjects,function(n,r){var o={},a=t.__rememberedObjectIndecesToControllers[r];h.each(a,function(s,l){o[l]=e?s.initialValue:s.getValue()}),i[r]=o}),i}function Jt(t){for(var e=0;e<t.__preset_select.length;e++)t.__preset_select[e].value===t.preset&&(t.__preset_select.selectedIndex=e)}function bt(t){t.length!==0&&Wt.call(window,function(){bt(t)}),h.each(t,function(e){e.updateDisplay()})}var ei=O;const ti=(t,e)=>{if(e==null)return Array.from({length:t},(n,r)=>r);const i=e-t;return Array.from({length:i},(n,r)=>r+t)},ii=t=>{const e=document.getElementById(t);return e||(console.error(`There is no canvas with id ${t} on this page.`),null)},ni=t=>t.getContext("webgl2")||console.error("WebGL2 is not available in your browser."),ri=t=>{const e=()=>{t.width=window.innerWidth,t.height=window.innerHeight};e(),window.addEventListener("resize",e)},Ye=t=>t.map(e=>e/255),oi=t=>t.map(e=>e*255),si=(t,e)=>{const o=[];for(let a=0;a<t.length;a+=3)o[a+0]=0,o[a+1]=0,o[a+2]=0;for(let a=0;a<e.length;a+=3){const s=[],l=[],d=[];s[0]=t[3*e[a+2]+0]-t[3*e[a+1]+0],s[1]=t[3*e[a+2]+1]-t[3*e[a+1]+1],s[2]=t[3*e[a+2]+2]-t[3*e[a+1]+2],l[0]=t[3*e[a]+0]-t[3*e[a+1]+0],l[1]=t[3*e[a]+1]-t[3*e[a+1]+1],l[2]=t[3*e[a]+2]-t[3*e[a+1]+2],d[0]=s[1]*l[2]-s[2]*l[1],d[1]=s[2]*l[0]-s[0]*l[2],d[2]=s[0]*l[1]-s[1]*l[0];for(let _=0;_<3;_++)o[3*e[a+_]+0]=o[3*e[a+_]+0]+d[0],o[3*e[a+_]+1]=o[3*e[a+_]+1]+d[1],o[3*e[a+_]+2]=o[3*e[a+_]+2]+d[2]}for(let a=0;a<t.length;a+=3){const s=[];s[0]=o[a+0],s[1]=o[a+1],s[2]=o[a+2];let l=Math.sqrt(s[0]*s[0]+s[1]*s[1]+s[2]*s[2]);l===0&&(l=1),s[0]=s[0]/l,s[1]=s[1]/l,s[2]=s[2]/l,o[a+0]=s[0],o[a+1]=s[1],o[a+2]=s[2]}return o},W=(t,e={width:300})=>{const i=e.gui||new ei(e),n={},r=s=>typeof s=="function",o=s=>!r(s)&&typeof s=="object"&&(s.value===null||s.value===void 0),a=s=>typeof s=="string"&&~s.indexOf("#")||Array.isArray(s)&&s.length>=3;return Object.keys(t).forEach(s=>{const l=t[s];if(r(l)){n[s]=l,i.add(n,s);return}if(o(l)){W(l,{gui:i.addFolder(s)});return}const{value:d,min:_,max:c,step:m,options:E,onChange:b=()=>null}=l;n[s]=d;let g;E?g=i.add(n,s,E):a(d)?g=i.addColor(n,s):g=i.add(n,s,_,c,m),g.onChange(p=>b(p,n))}),()=>{i.destroy()}};class ee{constructor(e,i){this.gl=e,this.program=i,this.objects=[]}start(e){let i=!0,n;const r=()=>{n=requestAnimationFrame(l=>{!i||(e(this.objects,l),r())})},o=()=>{i=!1,n!=null&&cancelAnimationFrame(n)};r();const a=()=>{i=!0,r(),console.info("Clock resumed")},s=()=>{o(),console.info("Clock stopped")};return window.addEventListener("focus",a),window.addEventListener("blur",s),this.stop=()=>{window.removeEventListener("focus",a),window.removeEventListener("blur",s),o()}}get(e){return this.objects.find(i=>i.alias===e)}add(e,i){var p,v,w,T,R,x,C,M,X,K,j,y,A,P,L;const{gl:n,program:r}=this,o=(p=e.vertices)!=null?p:[],a=(v=e.indices)!=null?v:[],s=(w=e.scalars)!=null?w:[],l=(T=e.textureCoords)!=null?T:[],d=(R=e.diffuse)!=null?R:[1,1,1,1],_=(x=e.ambient)!=null?x:[.2,.2,.2,1],c=(C=e.specular)!=null?C:[1,1,1,1],m=(M=e.specularExponent)!=null?M:0,E=(X=e.d)!=null?X:1,b=[];"aVertexPosition"in r.attributes&&o.length&&b.push({name:"aVertexPosition",data:o,size:3}),"aVertexNormal"in r.attributes&&o.length&&a.length&&b.push({name:"aVertexNormal",data:si(o,a),size:3}),"aVertexColor"in r.attributes&&s.length&&b.push({name:"aVertexColor",data:s,size:4}),"aVertexTextureCoords"in r.attributes&&l.length&&b.push({name:"aVertexTextureCoords",data:l,size:2});const g={alias:(K=e.alias)!=null?K:i,vertices:o,indices:a,scalars:s,textureCoords:l,wireframe:(j=e.wireframe)!=null?j:!1,diffuse:d,Kd:(y=e.Kd)!=null?y:d.slice(0,3),ambient:_,Ka:e.Ka||_.slice(0,3),specular:c,Ks:e.Ks||c.slice(0,3),specularExponent:m,Ns:(A=e.Ns)!=null?A:m,d:E,transparency:(P=e.transparency)!=null?P:E,illum:(L=e.illum)!=null?L:1,vao:Tt(n,r,b,a)};this.objects.push(g)}traverse(e){for(let i=0;i<this.objects.length&&e(this.objects[i],i)===void 0;i++);}renderFirst(e){const i=this.get(e),n=this.objects.indexOf(i);n!==0&&(this.objects.splice(n,1),this.objects.splice(0,0,i),this.printRenderOrder())}renderLast(e){const i=this.get(e),n=this.objects.indexOf(i);n!==0&&(this.objects.splice(n,1),this.objects.push(i),this.printRenderOrder())}renderSooner(e){const i=this.get(e),n=this.objects.indexOf(i);n!==0&&(this.objects.splice(n,1),this.objects.splice(n-1,0,i),this.printRenderOrder())}printRenderOrder(){const e=this.objects.map(i=>i.alias).join(" > ");console.info("Render Order:",e)}dispose(){var e;(e=this.stop)==null||e.call(this),this.program.dispose(),this.objects.forEach(i=>{i.vao.dispose()})}}class de{constructor(e=50,i=5){this.alias="floor",this.dimension=e,this.lines=i,this.vertices=[],this.indices=[],this.wireframe=!0,this.visible=!0,this.build(this.dimension,this.lines)}build(e,i){e&&(this.dimension=e),i&&(this.lines=2*this.dimension/i);const n=2*this.dimension/this.lines,r=[],o=[];for(let a=0;a<=this.lines;a++)r[6*a]=-this.dimension,r[6*a+1]=0,r[6*a+2]=-this.dimension+a*n,r[6*a+3]=this.dimension,r[6*a+4]=0,r[6*a+5]=-this.dimension+a*n,r[6*(this.lines+1)+6*a]=-this.dimension+a*n,r[6*(this.lines+1)+6*a+1]=0,r[6*(this.lines+1)+6*a+2]=-this.dimension,r[6*(this.lines+1)+6*a+3]=-this.dimension+a*n,r[6*(this.lines+1)+6*a+4]=0,r[6*(this.lines+1)+6*a+5]=this.dimension,o[2*a]=2*a,o[2*a+1]=2*a+1,o[2*(this.lines+1)+2*a]=2*(this.lines+1)+2*a,o[2*(this.lines+1)+2*a+1]=2*(this.lines+1)+2*a+1;this.vertices=r,this.indices=o}}class Ue{constructor(e=10){this.alias="axis",this.wireframe=!0,this.indices=[0,1,2,3,4,5],this.vertices=ai(e)}}const ai=t=>(t&&(t=t),[-t,0,0,t,0,0,0,-t/2,0,0,t/2,0,0,0,-t,0,0,t]),ui=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e="World Coordinates",i="Camera Coordinates";let n=e;const r=[0,-2,-50];let o=[0,-2,-50],a=[0,0,0];const s=H(),l=H(),d=H(),_=H(),c=J(t,Ct,Pt,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialDiffuse","uWireframe"]),m=new ee(t,c);m.add(await u(()=>import("./cone3.edde918c.js"),[]),"cone"),m.add(new de),m.add(new Ue),c.use(),c.setUniform("uLightPosition","vec3",[0,120,120]),c.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),c.setUniform("uLightDiffuse","vec4",[1,1,1,1]),ie(d),N(d,d,r),ie(s),fe(d,s),ie(l),ie(_),De(_,d),fe(_,_),Te(_,_);function E(){We(l,45,t.canvas.width/t.canvas.height,.1,1e3),n===e?(ie(d),N(d,d,o),Me(d,d,a[0]*Math.PI/180),Ie(d,d,a[1]*Math.PI/180),tt(d,d,a[2]*Math.PI/180)):(ie(s),N(s,s,o),Me(s,s,a[0]*Math.PI/180),Ie(s,s,a[1]*Math.PI/180),tt(s,s,a[2]*Math.PI/180))}function b(){n===e?(fe(s,d),c.setUniform("uModelViewMatrix","mat4",d)):fe(d,s),c.setUniform("uProjectionMatrix","mat4",l),c.setUniform("uModelViewMatrix","mat4",d),Te(_,s),c.setUniform("uNormalMatrix","mat4",_)}const g=W({Coordinates:{value:n,options:[e,i],onChange:p=>{n=p,se(r,o),a=[0,0,0],n===i&&Vt(o,o)}},Position:{...["Translate X","Translate Y","Translate Z"].reduce((p,v,w)=>(p[v]={value:o[w],min:-100,max:100,step:-.1,onChange(T,R){o=[R["Translate X"],R["Translate Y"],R["Translate Z"]]}},p),{})},Rotation:{...["Rotate X","Rotate Y","Rotate Z"].reduce((p,v,w)=>(p[v]={value:a[w],min:-180,max:180,step:.1,onChange(T,R){a=[R["Rotate X"],R["Rotate Y"],R["Rotate Z"]]}},p),{})}});return m.start(p=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);try{E(),b(),p.forEach(v=>{c.setUniform("uMaterialDiffuse","vec4",v.diffuse),c.setUniform("uWireframe","bool",v.wireframe),k(t,v.vao,v.wireframe?"LINES":"TRIANGLES")})}catch(v){console.error(v)}}),()=>{m.dispose(),g()}},li=(t,e)=>{const i=t[e];return i?typeof i=="function"?i():Promise.resolve(i):new Promise((n,r)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+e)))})},di=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uFixedLight;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec4 vFinalColor;

void main(void) {
    // If wireframe is enabled, set color to the diffuse property exclusing lights
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }
    else {
        // Normal
        vec3 N = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
        // Normalized light position
        vec3 L = normalize(-uLightPosition);

        // If true, then ensure that light position
        // is appropruately updated
        if (uFixedLight) {
          L = vec3(uNormalMatrix * vec4(L, 0.0));
        }

        float lambertTerm = dot(N, -L);

        if (lambertTerm == 0.0) {
            lambertTerm = 0.01;
        }

        // Ambient
        vec4 Ia = uLightAmbient;
        // Diffuse
        vec4 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;

        // Set varying to be used inside of fragment shader
        vFinalColor = vec4(vec3(Ia + Id), 1.0);
    }

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,ci=`#version 300 es
precision mediump float;

in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    fragColor = vFinalColor;
}`;class ne{constructor(e="ORBITING_TYPE"){this.type=e,this.position=te(),this.focus=te(),this.home=te(),this.up=te(),this.right=te(),this.normal=te(),this.matrix=H(),this.steps=0,this.azimuth=0,this.elevation=0,this.fov=45,this.minZ=.1,this.maxZ=1e4}get isOrbiting(){return this.type==="ORBITING_TYPE"}get isTracking(){return this.type==="TRACKING_TYPE"}goHome(e){e&&(this.home=e),this.setPosition(this.home),this.setAzimuth(0),this.setElevation(0)}dolly(e){const i=te(),n=te();Dt(i,this.normal);const r=e-this.steps;this.isTracking?(n[0]=this.position[0]-r*i[0],n[1]=this.position[1]-r*i[1],n[2]=this.position[2]-r*i[2]):(n[0]=this.position[0],n[1]=this.position[1],n[2]=this.position[2]-r),this.steps=e,this.setPosition(n)}setPosition(e){se(this.position,e),this.update()}changeZoom(e){se(this.position,[this.position[0],this.position[1],this.position[2]+e]),this.update()}setFocus(e){se(this.focus,e),this.update()}setAzimuth(e){this.changeAzimuth(e-this.azimuth)}changeAzimuth(e){this.azimuth+=e,(this.azimuth>360||this.azimuth<-360)&&(this.azimuth=this.azimuth%360),this.update()}setElevation(e){this.changeElevation(e-this.elevation)}changeElevation(e){this.elevation+=e,(this.elevation>360||this.elevation<-360)&&(this.elevation=this.elevation%360),this.update()}calculateOrientation(){const e=Le();Pe(e,1,0,0,0),Re(e,e,this.matrix),se(this.right,e);const i=Le();Pe(i,0,1,0,0),Re(i,i,this.matrix),se(this.up,i);const n=Le();Pe(n,0,0,1,0),Re(n,n,this.matrix),se(this.normal,n)}update(){if(ie(this.matrix),this.isTracking?(N(this.matrix,this.matrix,this.position),Ie(this.matrix,this.matrix,this.azimuth*Math.PI/180),Me(this.matrix,this.matrix,this.elevation*Math.PI/180)):(Ie(this.matrix,this.matrix,this.azimuth*Math.PI/180),Me(this.matrix,this.matrix,this.elevation*Math.PI/180),N(this.matrix,this.matrix,this.position)),this.isTracking){const e=Le();Pe(e,0,0,0,1),Re(e,e,this.matrix),se(this.position,e)}this.calculateOrientation()}getViewTransform(){const e=H();return fe(e,this.matrix),e}}class re{constructor(e,i){this.dragging=!1,this.ctrl=!1,this.alt=!1,this.x=0,this.y=0,this.lastX=0,this.lastY=0,this.button=0,this.dloc=0,this.dstep=0,this.motionFactor=10,this.keyIncrement=5,this.camera=e,this.canvas=i,i.onmousedown=n=>this.onMouseDown(n),i.onmouseup=n=>this.onMouseUp(n),i.onmousemove=n=>this.onMouseMove(n),window.onkeydown=n=>this.onKeyDown(n),window.onkeyup=n=>this.onKeyUp(n),window.onwheel=n=>this.onWheel(n)}get2DCoords(e){let i=0,n=0,r=this.canvas;for(;r&&r.tagName!=="BODY";)i+=r.offsetTop,n+=r.offsetLeft,r=r.offsetParent;return n+=window.pageXOffset,i-=window.pageYOffset,{x:e.clientX-n,y:this.canvas.height-(e.clientY-i)}}onMouseUp(e){this.dragging=!1}onMouseDown(e){this.dragging=!0,this.x=e.clientX,this.y=e.clientY,this.button=e.button,this.dstep=Math.max(this.camera.position[0],this.camera.position[1],this.camera.position[2])/100}onMouseMove(e){if(this.lastX=this.x,this.lastY=this.y,this.x=e.clientX,this.y=e.clientY,!this.dragging)return;this.ctrl=e.ctrlKey,this.alt=e.altKey;const i=this.x-this.lastX,n=this.y-this.lastY;this.button||(this.alt?this.dolly(n):this.rotate(i,n))}onKeyDown(e){if(this.ctrl=e.ctrlKey,!this.ctrl)switch(e.key){case"ArrowLeft":return this.camera.changeAzimuth(-this.keyIncrement);case"ArrowUp":return this.camera.changeElevation(this.keyIncrement);case"ArrowRight":return this.camera.changeAzimuth(this.keyIncrement);case"ArrowDown":return this.camera.changeElevation(-this.keyIncrement)}}onKeyUp(e){this.ctrl=e.ctrlKey}onWheel(e){this.camera.changeZoom(e.deltaY)}dolly(e){e>0?this.dloc+=this.dstep:this.dloc-=this.dstep,this.camera.dolly(this.dloc)}rotate(e,i){const{width:n,height:r}=this.canvas,o=-20/n,a=-20/r,s=e*o*this.motionFactor,l=i*a*this.motionFactor;this.camera.changeAzimuth(s),this.camera.changeElevation(l)}}const fi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=H(),i=H();let n=!1;const r=J(t,di,ci,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialDiffuse","uWireframe","uFixedLight"]),o=new ee(t,r);(await Promise.all(ti(1,179).map(c=>li(Object.assign({"../models/nissan-gtr/part1.json":()=>u(()=>import("./part1.53bda621.js"),[]),"../models/nissan-gtr/part10.json":()=>u(()=>import("./part10.e5991015.js"),[]),"../models/nissan-gtr/part100.json":()=>u(()=>import("./part100.587a087c.js"),[]),"../models/nissan-gtr/part101.json":()=>u(()=>import("./part101.831f027d.js"),[]),"../models/nissan-gtr/part102.json":()=>u(()=>import("./part102.645c525f.js"),[]),"../models/nissan-gtr/part103.json":()=>u(()=>import("./part103.40c8ab4f.js"),[]),"../models/nissan-gtr/part104.json":()=>u(()=>import("./part104.11d5674e.js"),[]),"../models/nissan-gtr/part105.json":()=>u(()=>import("./part105.dead6148.js"),[]),"../models/nissan-gtr/part106.json":()=>u(()=>import("./part106.e98121ed.js"),[]),"../models/nissan-gtr/part107.json":()=>u(()=>import("./part107.81aaeaa8.js"),[]),"../models/nissan-gtr/part108.json":()=>u(()=>import("./part108.868935c0.js"),[]),"../models/nissan-gtr/part109.json":()=>u(()=>import("./part109.3046e381.js"),[]),"../models/nissan-gtr/part11.json":()=>u(()=>import("./part11.da1bece0.js"),[]),"../models/nissan-gtr/part110.json":()=>u(()=>import("./part110.4ddd108d.js"),[]),"../models/nissan-gtr/part111.json":()=>u(()=>import("./part111.7de6c499.js"),[]),"../models/nissan-gtr/part112.json":()=>u(()=>import("./part112.e1c2b782.js"),[]),"../models/nissan-gtr/part113.json":()=>u(()=>import("./part113.a8d3d3cf.js"),[]),"../models/nissan-gtr/part114.json":()=>u(()=>import("./part114.7f73d2ac.js"),[]),"../models/nissan-gtr/part115.json":()=>u(()=>import("./part115.5d7a98e9.js"),[]),"../models/nissan-gtr/part116.json":()=>u(()=>import("./part116.a2d4dfbb.js"),[]),"../models/nissan-gtr/part117.json":()=>u(()=>import("./part117.d6cc1b87.js"),[]),"../models/nissan-gtr/part118.json":()=>u(()=>import("./part118.ae360775.js"),[]),"../models/nissan-gtr/part119.json":()=>u(()=>import("./part119.96103710.js"),[]),"../models/nissan-gtr/part12.json":()=>u(()=>import("./part12.7b167049.js"),[]),"../models/nissan-gtr/part120.json":()=>u(()=>import("./part120.df636e9b.js"),[]),"../models/nissan-gtr/part121.json":()=>u(()=>import("./part121.4eebfbb9.js"),[]),"../models/nissan-gtr/part122.json":()=>u(()=>import("./part122.f48534e2.js"),[]),"../models/nissan-gtr/part123.json":()=>u(()=>import("./part123.241b793b.js"),[]),"../models/nissan-gtr/part124.json":()=>u(()=>import("./part124.55cd3e15.js"),[]),"../models/nissan-gtr/part125.json":()=>u(()=>import("./part125.233624a8.js"),[]),"../models/nissan-gtr/part126.json":()=>u(()=>import("./part126.0b9d65af.js"),[]),"../models/nissan-gtr/part127.json":()=>u(()=>import("./part127.bf8b9a7d.js"),[]),"../models/nissan-gtr/part128.json":()=>u(()=>import("./part128.82ee1c0f.js"),[]),"../models/nissan-gtr/part129.json":()=>u(()=>import("./part129.71ad7f2a.js"),[]),"../models/nissan-gtr/part13.json":()=>u(()=>import("./part13.99bd62c0.js"),[]),"../models/nissan-gtr/part130.json":()=>u(()=>import("./part130.33a9ca1d.js"),[]),"../models/nissan-gtr/part131.json":()=>u(()=>import("./part131.7614ca4d.js"),[]),"../models/nissan-gtr/part132.json":()=>u(()=>import("./part132.8681a137.js"),[]),"../models/nissan-gtr/part133.json":()=>u(()=>import("./part133.ef9c488f.js"),[]),"../models/nissan-gtr/part134.json":()=>u(()=>import("./part134.8a795e4b.js"),[]),"../models/nissan-gtr/part135.json":()=>u(()=>import("./part135.5c4355ab.js"),[]),"../models/nissan-gtr/part136.json":()=>u(()=>import("./part136.f9df4731.js"),[]),"../models/nissan-gtr/part137.json":()=>u(()=>import("./part137.cab02e8a.js"),[]),"../models/nissan-gtr/part138.json":()=>u(()=>import("./part138.3353891b.js"),[]),"../models/nissan-gtr/part139.json":()=>u(()=>import("./part139.a6e14144.js"),[]),"../models/nissan-gtr/part14.json":()=>u(()=>import("./part14.dd21dc41.js"),[]),"../models/nissan-gtr/part140.json":()=>u(()=>import("./part140.37100e87.js"),[]),"../models/nissan-gtr/part141.json":()=>u(()=>import("./part141.ec36c45a.js"),[]),"../models/nissan-gtr/part142.json":()=>u(()=>import("./part142.31be5e85.js"),[]),"../models/nissan-gtr/part143.json":()=>u(()=>import("./part143.df1ca4ce.js"),[]),"../models/nissan-gtr/part144.json":()=>u(()=>import("./part144.f5158e01.js"),[]),"../models/nissan-gtr/part145.json":()=>u(()=>import("./part145.552d355b.js"),[]),"../models/nissan-gtr/part146.json":()=>u(()=>import("./part146.931168cf.js"),[]),"../models/nissan-gtr/part147.json":()=>u(()=>import("./part147.6cf95fc3.js"),[]),"../models/nissan-gtr/part148.json":()=>u(()=>import("./part148.05ed3c42.js"),[]),"../models/nissan-gtr/part149.json":()=>u(()=>import("./part149.94deca90.js"),[]),"../models/nissan-gtr/part15.json":()=>u(()=>import("./part15.8d1823f9.js"),[]),"../models/nissan-gtr/part150.json":()=>u(()=>import("./part150.a4b3c419.js"),[]),"../models/nissan-gtr/part151.json":()=>u(()=>import("./part151.31692d13.js"),[]),"../models/nissan-gtr/part152.json":()=>u(()=>import("./part152.d2b128bf.js"),[]),"../models/nissan-gtr/part153.json":()=>u(()=>import("./part153.f2c80905.js"),[]),"../models/nissan-gtr/part154.json":()=>u(()=>import("./part154.bd794f0b.js"),[]),"../models/nissan-gtr/part155.json":()=>u(()=>import("./part155.7de82738.js"),[]),"../models/nissan-gtr/part156.json":()=>u(()=>import("./part156.12fc9d3c.js"),[]),"../models/nissan-gtr/part157.json":()=>u(()=>import("./part157.74648b79.js"),[]),"../models/nissan-gtr/part158.json":()=>u(()=>import("./part158.d87b59ea.js"),[]),"../models/nissan-gtr/part159.json":()=>u(()=>import("./part159.cf39214e.js"),[]),"../models/nissan-gtr/part16.json":()=>u(()=>import("./part16.53f939f5.js"),[]),"../models/nissan-gtr/part160.json":()=>u(()=>import("./part160.fc0f72d6.js"),[]),"../models/nissan-gtr/part161.json":()=>u(()=>import("./part161.dcb17061.js"),[]),"../models/nissan-gtr/part162.json":()=>u(()=>import("./part162.870f2d7a.js"),[]),"../models/nissan-gtr/part163.json":()=>u(()=>import("./part163.03369298.js"),[]),"../models/nissan-gtr/part164.json":()=>u(()=>import("./part164.f0f5b26e.js"),[]),"../models/nissan-gtr/part165.json":()=>u(()=>import("./part165.75c785ef.js"),[]),"../models/nissan-gtr/part166.json":()=>u(()=>import("./part166.648b642c.js"),[]),"../models/nissan-gtr/part167.json":()=>u(()=>import("./part167.44c27a41.js"),[]),"../models/nissan-gtr/part168.json":()=>u(()=>import("./part168.37a658f8.js"),[]),"../models/nissan-gtr/part169.json":()=>u(()=>import("./part169.129e0c85.js"),[]),"../models/nissan-gtr/part17.json":()=>u(()=>import("./part17.25131d66.js"),[]),"../models/nissan-gtr/part170.json":()=>u(()=>import("./part170.e87feb9b.js"),[]),"../models/nissan-gtr/part171.json":()=>u(()=>import("./part171.f9785e70.js"),[]),"../models/nissan-gtr/part172.json":()=>u(()=>import("./part172.32a02565.js"),[]),"../models/nissan-gtr/part173.json":()=>u(()=>import("./part173.39e6db78.js"),[]),"../models/nissan-gtr/part174.json":()=>u(()=>import("./part174.0a9bd144.js"),[]),"../models/nissan-gtr/part175.json":()=>u(()=>import("./part175.072da7ae.js"),[]),"../models/nissan-gtr/part176.json":()=>u(()=>import("./part176.23169a6a.js"),[]),"../models/nissan-gtr/part177.json":()=>u(()=>import("./part177.a62032c2.js"),[]),"../models/nissan-gtr/part178.json":()=>u(()=>import("./part178.6783af6a.js"),[]),"../models/nissan-gtr/part18.json":()=>u(()=>import("./part18.da3d20e8.js"),[]),"../models/nissan-gtr/part19.json":()=>u(()=>import("./part19.0ab98256.js"),[]),"../models/nissan-gtr/part2.json":()=>u(()=>import("./part2.f15fa7fa.js"),[]),"../models/nissan-gtr/part20.json":()=>u(()=>import("./part20.98d33dec.js"),[]),"../models/nissan-gtr/part21.json":()=>u(()=>import("./part21.02dbd122.js"),[]),"../models/nissan-gtr/part22.json":()=>u(()=>import("./part22.c1141867.js"),[]),"../models/nissan-gtr/part23.json":()=>u(()=>import("./part23.d398e202.js"),[]),"../models/nissan-gtr/part24.json":()=>u(()=>import("./part24.d7dadfa9.js"),[]),"../models/nissan-gtr/part25.json":()=>u(()=>import("./part25.32ba0c37.js"),[]),"../models/nissan-gtr/part26.json":()=>u(()=>import("./part26.dee4d81a.js"),[]),"../models/nissan-gtr/part27.json":()=>u(()=>import("./part27.d7cce42f.js"),[]),"../models/nissan-gtr/part28.json":()=>u(()=>import("./part28.cb7c8ee5.js"),[]),"../models/nissan-gtr/part29.json":()=>u(()=>import("./part29.5eae8ff0.js"),[]),"../models/nissan-gtr/part3.json":()=>u(()=>import("./part3.e1e28cee.js"),[]),"../models/nissan-gtr/part30.json":()=>u(()=>import("./part30.b70a0b07.js"),[]),"../models/nissan-gtr/part31.json":()=>u(()=>import("./part31.6b1e34f6.js"),[]),"../models/nissan-gtr/part32.json":()=>u(()=>import("./part32.189c97e1.js"),[]),"../models/nissan-gtr/part33.json":()=>u(()=>import("./part33.afaec1c5.js"),[]),"../models/nissan-gtr/part34.json":()=>u(()=>import("./part34.3d989bb7.js"),[]),"../models/nissan-gtr/part35.json":()=>u(()=>import("./part35.5b096132.js"),[]),"../models/nissan-gtr/part36.json":()=>u(()=>import("./part36.1abb0c3f.js"),[]),"../models/nissan-gtr/part37.json":()=>u(()=>import("./part37.4497ec6b.js"),[]),"../models/nissan-gtr/part38.json":()=>u(()=>import("./part38.386d7d08.js"),[]),"../models/nissan-gtr/part39.json":()=>u(()=>import("./part39.263c53af.js"),[]),"../models/nissan-gtr/part4.json":()=>u(()=>import("./part4.332c3f7a.js"),[]),"../models/nissan-gtr/part40.json":()=>u(()=>import("./part40.7b96c6d1.js"),[]),"../models/nissan-gtr/part41.json":()=>u(()=>import("./part41.bce6ea08.js"),[]),"../models/nissan-gtr/part42.json":()=>u(()=>import("./part42.e9385a1f.js"),[]),"../models/nissan-gtr/part43.json":()=>u(()=>import("./part43.b40db76a.js"),[]),"../models/nissan-gtr/part44.json":()=>u(()=>import("./part44.0445505b.js"),[]),"../models/nissan-gtr/part45.json":()=>u(()=>import("./part45.2f1b2176.js"),[]),"../models/nissan-gtr/part46.json":()=>u(()=>import("./part46.adfcc16b.js"),[]),"../models/nissan-gtr/part47.json":()=>u(()=>import("./part47.928d0d5a.js"),[]),"../models/nissan-gtr/part48.json":()=>u(()=>import("./part48.9f073918.js"),[]),"../models/nissan-gtr/part49.json":()=>u(()=>import("./part49.d54ddeb5.js"),[]),"../models/nissan-gtr/part5.json":()=>u(()=>import("./part5.f7f9c75f.js"),[]),"../models/nissan-gtr/part50.json":()=>u(()=>import("./part50.3799e52c.js"),[]),"../models/nissan-gtr/part51.json":()=>u(()=>import("./part51.c1c2ff9d.js"),[]),"../models/nissan-gtr/part52.json":()=>u(()=>import("./part52.cd10c29e.js"),[]),"../models/nissan-gtr/part53.json":()=>u(()=>import("./part53.5be987d9.js"),[]),"../models/nissan-gtr/part54.json":()=>u(()=>import("./part54.c3b8a430.js"),[]),"../models/nissan-gtr/part55.json":()=>u(()=>import("./part55.f5209e8d.js"),[]),"../models/nissan-gtr/part56.json":()=>u(()=>import("./part56.3de3de87.js"),[]),"../models/nissan-gtr/part57.json":()=>u(()=>import("./part57.0e8a6ccd.js"),[]),"../models/nissan-gtr/part58.json":()=>u(()=>import("./part58.f605581e.js"),[]),"../models/nissan-gtr/part59.json":()=>u(()=>import("./part59.fb41fbcb.js"),[]),"../models/nissan-gtr/part6.json":()=>u(()=>import("./part6.ca147581.js"),[]),"../models/nissan-gtr/part60.json":()=>u(()=>import("./part60.34dab9e7.js"),[]),"../models/nissan-gtr/part61.json":()=>u(()=>import("./part61.754b93ce.js"),[]),"../models/nissan-gtr/part62.json":()=>u(()=>import("./part62.4eb25ed1.js"),[]),"../models/nissan-gtr/part63.json":()=>u(()=>import("./part63.00dd2c7b.js"),[]),"../models/nissan-gtr/part64.json":()=>u(()=>import("./part64.154efc09.js"),[]),"../models/nissan-gtr/part65.json":()=>u(()=>import("./part65.b1454ed0.js"),[]),"../models/nissan-gtr/part66.json":()=>u(()=>import("./part66.755290dc.js"),[]),"../models/nissan-gtr/part67.json":()=>u(()=>import("./part67.7c9c8bdc.js"),[]),"../models/nissan-gtr/part68.json":()=>u(()=>import("./part68.e196c31b.js"),[]),"../models/nissan-gtr/part69.json":()=>u(()=>import("./part69.97f64a09.js"),[]),"../models/nissan-gtr/part7.json":()=>u(()=>import("./part7.0b7d9cc4.js"),[]),"../models/nissan-gtr/part70.json":()=>u(()=>import("./part70.e47af862.js"),[]),"../models/nissan-gtr/part71.json":()=>u(()=>import("./part71.3e24917e.js"),[]),"../models/nissan-gtr/part72.json":()=>u(()=>import("./part72.6e4b14fa.js"),[]),"../models/nissan-gtr/part73.json":()=>u(()=>import("./part73.953127c3.js"),[]),"../models/nissan-gtr/part74.json":()=>u(()=>import("./part74.2891097d.js"),[]),"../models/nissan-gtr/part75.json":()=>u(()=>import("./part75.2d98b527.js"),[]),"../models/nissan-gtr/part76.json":()=>u(()=>import("./part76.19793342.js"),[]),"../models/nissan-gtr/part77.json":()=>u(()=>import("./part77.0c00c819.js"),[]),"../models/nissan-gtr/part78.json":()=>u(()=>import("./part78.329ea706.js"),[]),"../models/nissan-gtr/part79.json":()=>u(()=>import("./part79.392d97cc.js"),[]),"../models/nissan-gtr/part8.json":()=>u(()=>import("./part8.c468f14b.js"),[]),"../models/nissan-gtr/part80.json":()=>u(()=>import("./part80.e5686ea6.js"),[]),"../models/nissan-gtr/part81.json":()=>u(()=>import("./part81.7bf5989b.js"),[]),"../models/nissan-gtr/part82.json":()=>u(()=>import("./part82.666449ab.js"),[]),"../models/nissan-gtr/part83.json":()=>u(()=>import("./part83.6fd06533.js"),[]),"../models/nissan-gtr/part84.json":()=>u(()=>import("./part84.6f2b8636.js"),[]),"../models/nissan-gtr/part85.json":()=>u(()=>import("./part85.44cf28a9.js"),[]),"../models/nissan-gtr/part86.json":()=>u(()=>import("./part86.ddc5e952.js"),[]),"../models/nissan-gtr/part87.json":()=>u(()=>import("./part87.46369523.js"),[]),"../models/nissan-gtr/part88.json":()=>u(()=>import("./part88.180c0276.js"),[]),"../models/nissan-gtr/part89.json":()=>u(()=>import("./part89.105e4d75.js"),[]),"../models/nissan-gtr/part9.json":()=>u(()=>import("./part9.e384502b.js"),[]),"../models/nissan-gtr/part90.json":()=>u(()=>import("./part90.5d01c4ba.js"),[]),"../models/nissan-gtr/part91.json":()=>u(()=>import("./part91.b7f6b08a.js"),[]),"../models/nissan-gtr/part92.json":()=>u(()=>import("./part92.edcac7db.js"),[]),"../models/nissan-gtr/part93.json":()=>u(()=>import("./part93.a9d9eebc.js"),[]),"../models/nissan-gtr/part94.json":()=>u(()=>import("./part94.2c188b71.js"),[]),"../models/nissan-gtr/part95.json":()=>u(()=>import("./part95.232adbea.js"),[]),"../models/nissan-gtr/part96.json":()=>u(()=>import("./part96.7b788427.js"),[]),"../models/nissan-gtr/part97.json":()=>u(()=>import("./part97.2c2abe8c.js"),[]),"../models/nissan-gtr/part98.json":()=>u(()=>import("./part98.c1d1eac7.js"),[]),"../models/nissan-gtr/part99.json":()=>u(()=>import("./part99.2ee9b736.js"),[])}),`../models/nissan-gtr/part${c}.json`)))).forEach(c=>{o.add(c)}),o.add(new de(2e3,100)),o.add(new Ue(2e3));const s=new ne("ORBITING_TYPE");s.goHome([0,25,300]),new re(s,t.canvas),r.use(),r.setUniform("uLightPosition","vec3",[100,100,100]),r.setUniform("uLightAmbient","vec4",[.1,.1,.1,1]),r.setUniform("uLightDiffuse","vec4",[.7,.7,.7,1]),r.setUniform("uFixedLight","bool",n),ie(e),l(),ie(i),De(i,s.getViewTransform()),fe(i,i),Te(i,i);function l(){We(e,45,t.canvas.width/t.canvas.height,.1,5e3)}function d(){r.setUniform("uModelViewMatrix","mat4",s.getViewTransform()),r.setUniform("uProjectionMatrix","mat4",e),Te(i,s.matrix),r.setUniform("uNormalMatrix","mat4",i)}const _=W({"Camera Type":{value:s.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:c=>{s.goHome(),s.type=c}},Dolly:{value:0,min:-100,max:100,step:.1,onChange:c=>s.dolly(c)},Position:{...["X","Y","Z"].reduce((c,m,E)=>(c[m]={value:s.position[E],min:-100,max:300,step:.1,onChange:(b,g)=>{s.setPosition([g.X,g.Y,g.Z])}},c),{})},Rotation:{Elevation:{value:s.elevation,min:-180,max:180,step:.1,onChange:c=>s.setElevation(c)},Azimuth:{value:s.azimuth,min:-180,max:180,step:.1,onChange:c=>s.setAzimuth(c)}},"Static Light Position":{value:n,onChange:c=>r.setUniform("uFixedLight","bool",c)},"Go Home":()=>s.goHome()});return o.start(c=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);try{l(),d(),c.forEach(m=>{r.setUniform("uMaterialDiffuse","vec4",m.diffuse),r.setUniform("uWireframe","bool",m.wireframe),k(t,m.vao,m.wireframe?"LINES":"TRIANGLES")})}catch(m){console.error(m)}}),()=>{o.dispose(),_()}},_i=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uUpdateLight;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;
out vec4 vFinalColor;

void main(void) {
    // If wireframe is enabled, set color to the diffuse property exclusing lights
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }

    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vec4 light = vec4(uLightPosition,1.0);

    // If true, then ensure that light position
    // is appropruately updated
    if (uUpdateLight) {
        light = uModelViewMatrix * vec4(uLightPosition,1.0);
    }

    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vLightRay = vertex.xyz-light.xyz;
    vEyeVector = -vec3(vertex.xyz);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,mi=`#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform float uShininess;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);

        float lambertTerm = dot(N, -L);

        // Ambient
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Diffuse
        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
        // Specular
        vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

        if (lambertTerm > 0.0) {
            Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
            vec3 E = normalize(vEyeVector);
            vec3 R = reflect(L, N);
            float specular = pow( max(dot(R, E), 0.0), uShininess);
            Is = uLightSpecular * uMaterialSpecular * specular;
        }

        fragColor = vec4(vec3(Ia + Id + Is), 1.0);
    }
}`;class ce{constructor(e,i,n){this.stack=[],this.program=e,this.camera=i,this.canvas=n,this.modelViewMatrix=H(),this.projectionMatrix=H(),this.normalMatrix=H(),this.calculateModelView(),this.updatePerspective(),this.calculateNormal()}calculateModelView(){this.modelViewMatrix=this.camera.getViewTransform()}calculateNormal(){De(this.normalMatrix,this.modelViewMatrix),fe(this.normalMatrix,this.normalMatrix),Te(this.normalMatrix,this.normalMatrix)}updatePerspective(){We(this.projectionMatrix,this.camera.fov,this.canvas.width/this.canvas.height,this.camera.minZ,this.camera.maxZ)}setMatrixUniforms(){this.calculateNormal(),this.program.setUniform("uModelViewMatrix","mat4",this.modelViewMatrix),this.program.setUniform("uProjectionMatrix","mat4",this.projectionMatrix),this.program.setUniform("uNormalMatrix","mat4",this.normalMatrix)}push(){const e=H();De(e,this.modelViewMatrix),this.stack.push(e)}pop(){return this.stack.length?this.modelViewMatrix=this.stack.pop():null}}const hi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=J(t,_i,mi,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uLightSpecular","uMaterialAmbient","uMaterialDiffuse","uMaterialSpecular","uWireframe","uUpdateLight","uShininess"]);let i,n,r=!1,o=.5,a=.15,s=0,l=0,d=150,_=30;const c=new ee(t,e);c.add(new de(80,2)),c.add(new Ue(82)),c.add(await u(()=>import("./sphere2.653d9a7a.js"),[]),"sphere"),c.add(await u(()=>import("./cone3.edde918c.js"),[]),"cone");const m=new ne("ORBITING_TYPE");m.goHome([0,2,50]),m.setFocus([0,0,0]),new re(m,t.canvas);const E=new ce(e,m,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);const b=W({"Camera Type":{value:m.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:g=>{m.goHome(),m.type=g}},"Static Light Position":{value:r,onChange:g=>r=g},"Go Home":()=>m.goHome()});return c.start((g,p)=>{if(i=p-n,i<d)return;let v=Math.floor(i/_);for(;v>0;){s+=o,(s>=30||s<=-30)&&(o=-o),l+=a,(l>=35||l<=-35)&&(a=-a),t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),E.updatePerspective();try{e.setUniform("uUpdateLight","bool",r),g.forEach(w=>{if(E.calculateModelView(),E.push(),w.alias==="sphere"){const T=E.modelViewMatrix;N(T,T,[0,0,s])}else if(w.alias==="cone"){const T=E.modelViewMatrix;N(T,T,[l,0,0])}E.setMatrixUniforms(),E.pop(),e.setUniform("uMaterialDiffuse","vec4",w.diffuse),e.setUniform("uMaterialSpecular","vec4",w.specular),e.setUniform("uMaterialAmbient","vec4",w.ambient),e.setUniform("uWireframe","bool",w.wireframe),k(t,w.vao,w.wireframe?"LINES":"TRIANGLES")})}catch(w){console.error(w)}v-=1}n=p}),()=>{c.dispose(),b()}},pi=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uUpdateLight;
uniform vec3 uTranslation;
uniform bool uTranslate;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;
out vec4 vFinalColor;

void main(void) {
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }

    // Transformed vertex position
    vec3 vecPosition = aVertexPosition;
    if (uTranslate) {
        vecPosition += uTranslation;
    }

    vec4 vertex = uModelViewMatrix * vec4(vecPosition, 1.0);
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vec4 light = vec4(uLightPosition,1.0);

    if (uUpdateLight) {
        light = uModelViewMatrix * vec4(uLightPosition,1.0);
    }

    vLightRay = vertex.xyz - light.xyz;
    vEyeVector = -vec3(vertex.xyz);
    gl_Position = uProjectionMatrix * vertex;
}`,vi=`#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform float uShininess;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);

        float lambertTerm = dot(N, -L);
        // Ambient
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Diffuse
        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
        // Specular
        vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

        if (lambertTerm > 0.0) {
            Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
            vec3 E = normalize(vEyeVector);
            vec3 R = reflect(L, N);
            float specular = pow( max(dot(R, E), 0.0), uShininess);
            Is = uLightSpecular * uMaterialSpecular * specular;
        }

        fragColor = vec4(vec3(Ia + Id + Is), 1.0);
    }
}`;class gi{constructor(e){this.gravity=e,this.position=Ei(),this.H0=this.position[1],this.V0=0,this.VF=Math.sqrt(2*e*this.H0),this.HF=0,this.bouncingTime=0,this.BOUNCINESS=Math.random()+.5,this.color=[Math.random(),Math.random(),Math.random(),1]}update(e){const i=this.gravity,n=e-this.bouncingTime,r=this.H0+this.V0*n-.5*i*n*n;r<=0?(this.bouncingTime=e,this.V0=this.VF*this.BOUNCINESS,this.HF=this.V0*this.V0/(2*i),this.VF=Math.sqrt(2*i*this.HF),this.H0=0):this.position[1]=r}}function Ei(){return[Math.floor(Math.random()*50)-Math.floor(Math.random()*50),Math.floor(Math.random()*30)+50,Math.floor(Math.random()*50)]}const bi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=J(t,pi,vi,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe","uPerVertexColor","uTranslation","uTranslate"]);let i,n,r=!1,o=15;const a=new ee(t,e),s=9.8,l=500,d=[];a.add(new de(80,2)),a.add(await u(()=>import("./ball.e8c51c02.js"),[]),"ball");for(let b=0;b<l;b++)d.push(new gi(s));const _=new ne("ORBITING_TYPE");_.goHome([0,2,70]),_.setFocus([0,0,0]),new re(_,t.canvas);const c=new ce(e,_,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);const m=W({"Camera Type":{value:_.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:b=>{_.goHome(),_.type=b}},"Static Light Position":{value:r,onChange:b=>r=b},"Go Home":()=>_.goHome()});let E=0;return a.start((b,g)=>{if(i=g-n,i<o)return;let p=Math.floor(i/o);for(;p>0;){d.forEach(v=>v.update(E)),E+=33/1e3,t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),c.updatePerspective();try{e.setUniform("uUpdateLight","bool",r),b.forEach(v=>{if(c.calculateModelView(),c.setMatrixUniforms(),v.alias==="ball"){e.setUniform("uMaterialDiffuse","vec4",v.diffuse),e.setUniform("uMaterialSpecular","vec4",v.specular),e.setUniform("uMaterialAmbient","vec4",v.ambient),e.setUniform("uWireframe","bool",!1),e.setUniform("uTranslate","bool",!0),d.forEach(w=>{e.setUniform("uTranslation","vec3",w.position),e.setUniform("uMaterialDiffuse","vec4",w.color),k(t,v.vao,"TRIANGLES")});return}e.setUniform("uMaterialDiffuse","vec4",v.diffuse),e.setUniform("uMaterialSpecular","vec4",v.specular),e.setUniform("uMaterialAmbient","vec4",v.ambient),e.setUniform("uWireframe","bool",v.wireframe),e.setUniform("uTranslate","bool",!1),k(t,v.vao,v.wireframe?"LINES":"TRIANGLES")})}catch(v){console.error(v)}p-=1}n=g}),()=>{a.dispose(),m()}},xi=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uUpdateLight;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;
out vec4 vFinalColor;

void main(void) {
    if (uWireframe) {
        vFinalColor = uMaterialDiffuse;
    }

    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vec4 light = vec4(uLightPosition, 1.0);

    if (uUpdateLight) {
        light = uModelViewMatrix * vec4(uLightPosition,1.0);
    }

    vLightRay = vertex.xyz-light.xyz;
    vEyeVector = -vec3(vertex.xyz);
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,Li=`#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform float uShininess;

in vec3 vNormal;
in vec3 vLightRay;
in vec3 vEyeVector;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);

        float lambertTerm = dot(N, -L);
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
        vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

        if (lambertTerm > 0.0) {
            Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
            vec3 E = normalize(vEyeVector);
            vec3 R = reflect(L, N);
            float specular = pow( max(dot(R, E), 0.0), uShininess);
            Is = uLightSpecular * uMaterialSpecular * specular;
        }

        fragColor = vec4(vec3(Ia + Id + Is), 1.0);
    }
}`,Ai=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=J(t,xi,Li,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe"]);let i=!1;const n="Linear Interpolation",r="Polynomial Interpolation",o="B-Spline Interpolation";let a=n,s=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],l=1e3;const d=new ee(t,e),_=[1,1,0,1],c=[0,1,0,1],m=[0,0,1,1],E=[.5,.5,.5,1],b=[1,0,0,1],g=150;d.add(new de(g,2)),d.add(new Ue(g)),d.add({...await u(()=>import("./ball.e8c51c02.js"),[]),diffuse:_},"ball"),d.add({...await u(()=>import("./flag.1e342818.js"),[]),diffuse:c},"flagStart"),d.add({...await u(()=>import("./flag.1e342818.js"),[]),diffuse:m},"flagEnd"),d.add({...await u(()=>import("./flag.1e342818.js"),[]),diffuse:E},"flag1"),d.add({...await u(()=>import("./flag.1e342818.js"),[]),diffuse:E},"flag2"),d.add({...await u(()=>import("./flag.1e342818.js"),[]),diffuse:E},"flag3");const p=new ne("ORBITING_TYPE");p.goHome([0,2,80]),p.setElevation(-20),new re(p,t.canvas);const v=new ce(e,p,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);let w=M();function T(){C=0,w.length=0}function R(){const y={[n]:M,[r]:X,[o]:K}[a];w=y()}const x=W({"Camera Type":{value:p.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:y=>{p.goHome(),p.type=y}},Points:[0,1,2,3,4].reduce((y,A)=>(y[`Point ${A+1}`]={value:s[A][0],min:-70,max:70,step:1,onChange:P=>{s[A][0]=P,R()}},y),{}),Interpolation:{value:a,options:[n,r,o],onChange:y=>{T(),a=y,a===n?(s=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],l=1e3):a===r?(s=[[21,0,23],[-3,0,-10],[-21,0,-53],[50,0,-31],[-24,0,2]],l=1355):a===o&&(s=[[-21,0,23],[32,0,-10],[0,0,-53],[-32,0,-10],[21,0,23]],l=1e3),R()}},"Interpolation Steps":{value:l,min:10,max:1500,step:1,onChange:y=>{l=y,R()}},"Static Light Position":{value:i,onChange:y=>i=y},"Go Home":()=>p.goHome()});let C=0;return d.start(y=>{C+=1,C===l&&(C=0),t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),v.updatePerspective();try{e.setUniform("uUpdateLight","bool",i),y.forEach(A=>{v.calculateModelView(),v.setMatrixUniforms();const{alias:P}=A;if(P==="ball"&&w[C])N(v.modelViewMatrix,v.modelViewMatrix,w[C]);else if(P==="flagStart")N(v.modelViewMatrix,v.modelViewMatrix,s[0]);else if(P==="flagEnd")N(v.modelViewMatrix,v.modelViewMatrix,s[4]);else if(P==="flag1")if(a!==n)N(v.modelViewMatrix,v.modelViewMatrix,s[1]),A.diffuse=j(s[1],w[C],3)?b:E;else{v.pop();return}else if(P==="flag2")if(a!==n)N(v.modelViewMatrix,v.modelViewMatrix,s[2]),A.diffuse=j(s[2],w[C],3)?b:E;else{v.pop();return}else if(P==="flag3")if(a!==n)N(v.modelViewMatrix,v.modelViewMatrix,s[3]),A.diffuse=j(s[3],w[C],3)?b:E;else{v.pop();return}v.setMatrixUniforms(),v.pop(),e.setUniform("uMaterialDiffuse","vec4",A.diffuse),e.setUniform("uMaterialSpecular","vec4",A.specular),e.setUniform("uMaterialAmbient","vec4",A.ambient),e.setUniform("uWireframe","bool",A.wireframe),k(t,A.vao,A.wireframe?"LINES":"TRIANGLES")})}catch(A){console.error(A)}}),()=>{d.dispose(),x()};function M(){const y=[],[A,P,L]=s[0],[q,I,z]=s[s.length-1];for(let G=0;G<l;G++){const U=G/l;y.push([A*(1-U)+q*U,P*(1-U)+I*U,L*(1-U)+z*U])}return y}function X(){const y=[],A=s.length,P=l/(A-1),L=[];for(let I=0;I<A;I++){L[I]=1;for(let z=0;z<A;z++)I!==z&&(L[I]*=P*(I-z))}function q(I,z){const G=[];let U=0;for(let B=0;B<A;B++){G[B]=1;for(let me=0;me<A;me++)B!==me&&(G[B]*=I-me*P);G[B]/=L[B],U+=G[B]*s[B][z]}return U}for(let I=0;I<l;I++)y.push([q(I,0),q(I,1),q(I,2)]);return y}function K(){const y=[],A=s.length-1,P=3,L=[],q=A+P+1,I=1/(q-2*P);for(let V=0;V<=P;V++)L.push(0);let z=I;for(let V=P+1;V<q-P+1;V++)L.push(z),z+=I;for(let V=q-P+1;V<=q;V++)L.push(1);function G(V,D){return L[D]<=V&&V<L[D+1]?1:0}function U(V,D,F){let he=0,oe=0;F-1===0?(he=G(V,D),oe=G(V,D+1)):(he=U(V,D,F-1),oe=U(V,D+1,F-1));let Qe=0,Ze=0;return L[D+F]-L[D]!==0&&(Qe=(V-L[D])/(L[D+F]-L[D])),L[D+F+1]-L[D+1]!==0&&(Ze=(L[D+F+1]-V)/(L[D+F+1]-L[D+1])),Qe*he+Ze*oe}function B(V){const D=[];for(let F=0;F<3;F++){let he=0;for(let oe=0;oe<=A;oe++)he+=s[oe][F]*U(V,oe,P);D[F]=he}return D}const me=1/l;let Fe=0;do y.push(B(Fe)),Fe+=me;while(Fe<1);return y.push(B(1)),y}function j(y,A,P){return Math.sqrt((y[0]-A[0])*(y[0]-A[0])+(y[1]-A[1])*(y[1]-A[1])+(y[2]-A[2])*(y[2]-A[2]))<=P}},wi=`#version 300 es
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
}`,yi=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
    fragColor = vColor;
}`,Ti=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=J(t,wi,yi,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uAlpha","uUseLambert","uUseVertexColor"]);let i=!1;const n=new ee(t,e);n.add({...await u(()=>import("./cube-simple.49e30b2d.js"),[]),hidden:!1},"simpleCube"),n.add({...await u(()=>import("./cube-complex.9bb7c8cf.js"),[]),hidden:!0},"complexCube");const r=new ne("ORBITING_TYPE");r.goHome([0,0,3]),r.setFocus([0,0,0]),r.setAzimuth(45),r.setElevation(-30),new re(r,t.canvas);const o=new ce(e,r,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,5,20]),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uAlpha","float",1),e.setUniform("uUseVertexColor","bool",i),e.setUniform("uUseLambert","bool",!0);const a=W({Lambert:{value:!0,onChange:s=>e.setUniform("uUseLambert","bool",s)},"Per Vertex":{value:i,onChange:s=>i=s},"Complex Cube":{value:!0,onChange:s=>{const l=n.get("simpleCube"),d=n.get("complexCube");s?(l.hidden=!0,d.hidden=!1):(l.hidden=!1,d.hidden=!0)}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:s=>e.setUniform("uAlpha","float",s)}});return n.start(s=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),o.updatePerspective();try{s.forEach(l=>{l.hidden||(o.calculateModelView(),o.push(),o.setMatrixUniforms(),o.pop(),e.setUniform("uUseVertexColor","bool",i),e.setUniform("uMaterialDiffuse","vec4",l.diffuse),e.setUniform("uMaterialAmbient","vec4",l.ambient),k(t,l.vao,"TRIANGLES"))})}catch(l){console.error(l)}}),()=>{n.dispose(),a()}},Ci=`#version 300 es
precision mediump float;

const int numLights = 4;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec4 uMaterialDiffuse;
uniform vec3 uLightPosition[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal;
out vec3 vLightRay[numLights];

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

    // Iterate for every light
    for(int i = 0; i < numLights; i++) {
      vec4 lightPosition = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
      vLightRay[i] = vertex.xyz - lightPosition.xyz;
    }

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,Pi=`#version 300 es
precision mediump float;

const int numLights = 4;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uLightSource;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse[numLights];
uniform float uCutOff;

in vec3 vNormal;
in vec3 vLightRay[numLights];
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe || uLightSource){
        fragColor = uMaterialDiffuse;
    }
    else {
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Base color
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

        vec3 N = normalize(vNormal);
        vec3 L = vec3(0.0);
        float lambertTerm = 0.0;

        // Iterate for every light
        for(int i = 0; i < numLights; i++) {
            L = normalize(vLightRay[i]);
            lambertTerm = dot(N, -L);
            if (lambertTerm > uCutOff) {
                finalColor += uLightDiffuse[i] * uMaterialDiffuse * lambertTerm;
            }
        }

        fragColor = vec4(vec3(finalColor += Ia), 1.0);
    }
}`;class xt{constructor(e){this.id=e,this.position=[0,0,0],this.ambient=[0,0,0,0],this.diffuse=[0,0,0,0],this.specular=[0,0,0,0]}setPosition(e){this.position=e.slice(0)}setDiffuse(e){this.diffuse=e.slice(0)}setAmbient(e){this.ambient=e.slice(0)}setSpecular(e){this.specular=e.slice(0)}setProperty(e,i){this[e]=i}}class Lt{constructor(){this.list=[]}add(e){this.list.push(e)}getArray(e){return this.list.reduce((i,n)=>(i=i.concat(n[e]),i),[])}get(e){return typeof e=="string"?this.list.find(i=>i.id===e):this.list[e]}}const Ri=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.depthFunc(t.LEQUAL);const e=J(t,Ci,Pi,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightSource","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uCutOff","uWireframe"]),i=[{id:"redLight",name:"Red Light",position:[0,7,3],diffuse:[1,0,0,1]},{id:"greenLight",name:"Green Light",position:[2.5,3,3],diffuse:[0,1,0,1]},{id:"blueLight",name:"Blue Light",position:[-2.5,3,3],diffuse:[0,0,1,1]},{id:"whiteLight",name:"White Light",position:[0,10,2],diffuse:[1,1,1,1]}],n=new ee(t,e);n.add(new de(80,2)),n.add(await u(()=>import("./wall.3397ad8f.js"),[]),"wall");for(const{id:d}of i)n.add(await u(()=>import("./sphere3.7b3e63db.js"),[]),d);const r=new ne("ORBITING_TYPE");r.goHome([0,5,30]),r.setFocus([0,0,0]),r.setAzimuth(0),r.setElevation(-3),new re(r,t.canvas);const o=new ce(e,r,t.canvas),a=new Lt;i.forEach(({id:d,position:_,diffuse:c})=>{const m=new xt(d);m.setPosition(_),m.setDiffuse(c),a.add(m)});const s=.5;e.use(),e.setUniform("uLightPosition","vec3",a.getArray("position")),e.setUniform("uLightDiffuse","vec4",a.getArray("diffuse")),e.setUniform("uCutOff","float",s),e.setUniform("uLightAmbient","vec4",[1,1,1,1]);const l=W({"Camera Type":{value:r.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:d=>{r.goHome(),r.type=d}},...i.reduce((d,_)=>{const c=[`X - ${_.name}`,`Y - ${_.name}`,`Z - ${_.name}`];return d[_.name]=c.reduce((m,E,b)=>(m[E]={value:_.position[b],min:-15,max:15,step:.1,onChange:(g,p)=>{a.get(_.id).position=c.map(v=>p[v])}},m),{}),d},{}),"Light Cone Cut Off":{value:s,min:0,max:1,step:.01,onChange:d=>e.setUniform("uCutOff","float",d)},"Go Home":()=>{r.goHome(),r.type="ORBITING_TYPE"}});return n.start(d=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),o.updatePerspective();try{d.forEach(_=>{o.calculateModelView(),o.push(),e.setUniform("uLightSource","bool",!1);const c=i.find(({id:m})=>_.alias===m);if(c){const{position:m,diffuse:E}=a.get(c.id);N(o.modelViewMatrix,o.modelViewMatrix,m),_.diffuse=E,e.setUniform("uLightSource","bool",!0)}o.setMatrixUniforms(),o.pop(),e.setUniform("uLightPosition","vec3",a.getArray("position")),e.setUniform("uMaterialDiffuse","vec4",_.diffuse),e.setUniform("uMaterialAmbient","vec4",_.ambient),e.setUniform("uWireframe","bool",_.wireframe),k(t,_.vao,_.wireframe?"LINES":"TRIANGLES")})}catch(_){console.error(_)}}),()=>{n.dispose(),l()}},Oi=`#version 300 es
precision mediump float;

const int numLights = 3;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition[numLights];
uniform vec3 uLightDirection[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal[numLights];
out vec3 vLightRay[numLights];

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec3 normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

  // Iterate over lights
  for(int i = 0; i < numLights; i++) {
    vec4 positionLight = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
    vec3 directionLight = vec3(uNormalMatrix * vec4(uLightDirection[i], 1.0));
    vNormal[i] = normal - directionLight;
    vLightRay[i] = vertex.xyz - positionLight.xyz;
  }

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,Vi=`#version 300 es
precision mediump float;

const int numLights= 3;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uLightSource;
uniform float uCutOff;
uniform vec4 uLightAmbient;
uniform vec3 uLightDirection[numLights];
uniform vec4 uLightDiffuse[numLights];

in vec3 vNormal[numLights];
in vec3 vLightRay[numLights];

out vec4 fragColor;

void main(void) {
    if (uWireframe || uLightSource) {
        fragColor = uMaterialDiffuse;
    }
    else {
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        // Base color
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

        vec3 L = vec3(0.0);
        vec3 N = vec3(0.0);
        float lambertTerm = 0.0;

        // Iterate over lights
        for(int i = 0; i < numLights; i++) {
            L = normalize(vLightRay[i]);
            N = normalize(vNormal[i]);
            lambertTerm	= dot(N, -L);
            if (lambertTerm > uCutOff) {
                // finalColor += uLightDiffuse[i] * uMaterialDiffuse;
                // finalColor += uLightDiffuse[i] * uMaterialDiffuse * lambertTerm;
                finalColor += uLightDiffuse[i] * uMaterialDiffuse * pow(lambertTerm, 10.0 * uCutOff);
            }
        }

        fragColor = vec4(vec3(finalColor), 1.0);
    }
}`,Di=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.depthFunc(t.LEQUAL);const e=J(t,Oi,Vi,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightSource","uLightAmbient","uLightDiffuse","uLightDirection","uMaterialAmbient","uMaterialDiffuse","uCutOff","uWireframe"]),i=[{id:"redLight",name:"Red Light",position:[0,7,3],diffuse:[1,0,0,1],direction:[0,-2,-.1]},{id:"greenLight",name:"Green Light",position:[2.5,3,3],diffuse:[0,1,0,1],direction:[-.5,1,-.1]},{id:"blueLight",name:"Blue Light",position:[-2.5,3,3],diffuse:[0,0,1,1],direction:[.5,1,-.1]}],n=new ee(t,e);n.add(new de(80,2)),n.add(await u(()=>import("./wall.3397ad8f.js"),[]),"wall");for(const{id:d}of i)n.add(await u(()=>import("./sphere3.7b3e63db.js"),[]),d);const r=new ne("ORBITING_TYPE");r.goHome([0,5,30]),r.setFocus([0,0,0]),r.setAzimuth(0),r.setElevation(-3),new re(r,t.canvas);const o=new ce(e,r,t.canvas),a=new Lt;i.forEach(({id:d,position:_,diffuse:c,direction:m})=>{const E=new xt(d);E.setPosition(_),E.setDiffuse(c),E.setProperty("direction",m),a.add(E)});const s=.75;e.use(),e.setUniform("uLightPosition","vec3",a.getArray("position")),e.setUniform("uLightDirection","vec3",a.getArray("direction")),e.setUniform("uLightDiffuse","vec4",a.getArray("diffuse")),e.setUniform("uCutOff","float",s),e.setUniform("uLightAmbient","vec4",[1,1,1,1]);const l=W({"Camera Type":{value:r.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:d=>{r.goHome(),r.type=d}},...i.reduce((d,_)=>{const c=[`X - ${_.name}`,`Y - ${_.name}`,`Z - ${_.name}`];return d[_.name]=c.reduce((m,E,b)=>(m[E]={value:_.position[b],min:-15,max:15,step:.1,onChange:(g,p)=>{a.get(_.id).position=c.map(v=>p[v])}},m),{}),d},{}),"Light Cone Cut Off":{value:s,min:0,max:1,step:.01,onChange:d=>e.setUniform("uCutOff","float",d)},"Go Home":()=>{r.goHome(),r.type="ORBITING_TYPE"}});return n.start(d=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),o.updatePerspective();try{d.forEach(_=>{o.calculateModelView(),o.push(),e.setUniform("uLightSource","bool",!1);const c=i.find(({id:m})=>_.alias===m);if(c){const{position:m,diffuse:E}=a.get(c.id);N(o.modelViewMatrix,o.modelViewMatrix,m),_.diffuse=E,e.setUniform("uLightSource","bool",!0)}o.setMatrixUniforms(),o.pop(),e.setUniform("uLightPosition","vec3",a.getArray("position")),e.setUniform("uMaterialDiffuse","vec4",_.diffuse),e.setUniform("uMaterialAmbient","vec4",_.ambient),e.setUniform("uWireframe","bool",_.wireframe),k(t,_.vao,_.wireframe?"LINES":"TRIANGLES")})}catch(_){console.error(_)}}),()=>{n.dispose(),l()}},Mi=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec4 uMaterialDiffuse;
uniform vec3 uPositionLight;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vLightRay;
out vec4 vFinalColor;

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
  vec4 positionLight = vec4(uPositionLight, 1.0);
  vLightRay = vertex.xyz - positionLight.xyz;
  vFinalColor = uMaterialDiffuse;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
`,Ii=`#version 300 es
precision mediump float;

uniform bool uWireframe;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uUseLambert;

in vec3 vNormal;
in vec3 vLightRay;
in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = vFinalColor;
    }
    else {
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);
        float lambertTerm	= clamp(dot(N, -L), 0.0, 1.0);
        vec4 Ia = uLightAmbient * uMaterialAmbient;
        vec4 Id = uLightDiffuse * uMaterialDiffuse;
    if (uUseLambert) {
        Id = Id * lambertTerm;
    }
        fragColor = vec4(Ia.rgb + Id.rgb, uMaterialDiffuse.a);
    }
}`,Si=async t=>{let e=!0,i=!0,n=!0,r=!0,o=!0,a=[0,1,1,1],s=[.7,0,.7,1],l=[0,1,0],d=1;t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LESS),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.blendColor(...l,d),t.enable(t.CULL_FACE);let _=t.FUNC_ADD,c=t.SRC_ALPHA,m=t.ONE_MINUS_SRC_ALPHA;const E=J(t,Mi,Ii,["aVertexPosition","aVertexNormal"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uUseLambert"]),b=new ee(t,E);b.add(new de(80,2)),b.add({...await u(()=>import("./cone3.edde918c.js"),[]),diffuse:a},"cone"),b.add({...await u(()=>import("./sphere2.653d9a7a.js"),[]),diffuse:s},"sphere");const g=new ne("ORBITING_TYPE");g.goHome([0,5,35]),g.setFocus([0,0,0]),g.setAzimuth(25),g.setElevation(-25),new re(g,t.canvas);const p=new ce(E,g,t.canvas);E.use(),E.setUniform("uLightPosition","vec3",[0,5,20]),E.setUniform("uLightAmbient","vec4",[1,1,1,1]),E.setUniform("uLightDiffuse","vec4",[1,1,1,1]),E.setUniform("uUseLambert","bool",r);const v=["ZERO","ONE","SRC_COLOR","DST_COLOR","SRC_ALPHA","DST_ALPHA","CONSTANT_COLOR","CONSTANT_ALPHA","ONE_MINUS_SRC_ALPHA","ONE_MINUS_DST_ALPHA","ONE_MINUS_SRC_COLOR","ONE_MINUS_DST_COLOR","ONE_MINUS_CONSTANT_COLOR","ONE_MINUS_CONSTANT_ALPHA"],w=x=>x?"enable":"disable";function T(x=!0){t[x?"enable":"disable"](t.BLEND),t.blendFunc(c,m),t.blendEquation(_),t.blendColor(...l,d)}const R=W({Blending:{value:e,onChange:T},"Depth Testing":{value:i,onChange:x=>t[w(x)](t.DEPTH_TEST)},"Back Face Culling":{value:n,onChange:x=>t[w(x)](t.CULL_FACE)},Lambert:{value:r,onChange:x=>r=x},Floor:{value:o,onChange:x=>o=x},...[{name:"Sphere",id:"sphere",color:s},{name:"Cone",id:"cone",color:a}].reduce((x,C)=>(x={...x,[`${C.name} Alpha`]:{value:1,min:0,max:1,step:.1,onChange:M=>b.get(C.id).diffuse[3]=M},[`${C.name} Color`]:{value:oi(C.color),onChange:M=>b.get(C.id).diffuse=Ye(M)}},x),{}),"Blend Function":{value:_,options:["FUNC_ADD","FUNC_SUBTRACT","FUNC_REVERSE_SUBTRACT"],onChange:x=>{_=t[x],T()}},Source:{value:c,options:[...v,"SRC_ALPHA_SATURATE"],onChange:x=>{c=t[x],T()}},Destination:{value:m,options:v,onChange:x=>{m=t[x],T()}},"Blending Color":{value:[0,0,0],onChange:x=>{l=Ye(x),T()}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:x=>{d=x,T()}},"Render Order":{value:"Cone First",options:["Cone First","Sphere First"],onChange:x=>{x==="Sphere First"?(b.renderSooner("sphere"),b.renderFirst("floor")):(b.renderSooner("cone"),b.renderFirst("floor"))}},Reset:()=>{i=!0,e=!0,n=!0,r=!0,o=!0,_=t.FUNC_ADD,c=t.SRC_ALPHA,m=t.ONE_MINUS_SRC_ALPHA,g.goHome([0,5,35]),g.setFocus([0,0,0]),g.setAzimuth(25),g.setElevation(-25)}});return b.start(x=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),p.updatePerspective();try{x.forEach(C=>{const{alias:M}=C;M==="floor"&&!o||(p.calculateModelView(),p.push(),M==="cone"&&N(p.modelViewMatrix,p.modelViewMatrix,[0,0,-3.5]),M==="sphere"&&(Rt(p.modelViewMatrix,p.modelViewMatrix,[.5,.5,.5]),N(p.modelViewMatrix,p.modelViewMatrix,[0,0,2.5])),p.setMatrixUniforms(),p.pop(),E.setUniform("uMaterialDiffuse","vec4",C.diffuse),E.setUniform("uMaterialAmbient","vec4",C.ambient),E.setUniform("uWireframe","bool",C.wireframe),E.setUniform("uUseLambert","bool",r),k(t,C.vao,C.wireframe?"LINES":"TRIANGLES"))})}catch(C){console.error(C)}}),()=>{b.dispose(),R()}},Ni=`#version 300 es
precision mediump float;

uniform float uAlpha;
uniform vec3 uLightPosition;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec4 aVertexColor;

out vec4 vColor;

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  float lambertTerm = 1.0;
  vec4 Ia = uLightAmbient * uMaterialAmbient;
  vec4 Id = uLightDiffuse * aVertexColor * lambertTerm;
  vColor = vec4(vec3(Ia + Id), uAlpha);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,Ui=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
    if (uWireframe) {
        fragColor = uMaterialDiffuse;
    }
    else {
        fragColor = vColor;
    }
}`,_t=async t=>{let e=!0,i=!0,n=!0,r=[0,1,0],o=1;t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LESS),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.blendColor(...r,o),t.enable(t.CULL_FACE);let a=t.FUNC_ADD,s=t.SRC_ALPHA,l=t.ONE_MINUS_SRC_ALPHA;const d=J(t,Ni,Ui,["aVertexPosition","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uAlpha","uUseLambert"]),_=new ee(t,d);_.add(await u(()=>import("./cube-complex.9bb7c8cf.js"),[]),"cube");const c=new ne("ORBITING_TYPE");c.goHome([0,0,4]),c.setFocus([0,0,0]),c.setAzimuth(50),c.setElevation(-30),new re(c,t.canvas);const m=new ce(d,c,t.canvas);d.use(),d.setUniform("uLightPosition","vec3",[0,5,20]),d.setUniform("uLightAmbient","vec4",[1,1,1,1]),d.setUniform("uLightDiffuse","vec4",[1,1,1,1]),d.setUniform("uAlpha","float",.5),d.setUniform("uUseLambert","bool",e);const E=["ZERO","ONE","SRC_COLOR","DST_COLOR","SRC_ALPHA","DST_ALPHA","CONSTANT_COLOR","CONSTANT_ALPHA","ONE_MINUS_SRC_ALPHA","ONE_MINUS_DST_ALPHA","ONE_MINUS_SRC_COLOR","ONE_MINUS_DST_COLOR","ONE_MINUS_CONSTANT_COLOR","ONE_MINUS_CONSTANT_ALPHA"];function b(p=!0){t[p?"enable":"disable"](t.BLEND),t.blendFunc(s,l),t.blendEquation(a),t.blendColor(...r,o)}const g=W({"Alpha Blending":{value:!0,onChange:b},"Render Front Face":{value:!0,onChange:p=>n=p},"Render Back Face":{value:!0,onChange:p=>i=p},"Alpha Value":{value:.5,min:0,max:1,step:.1,onChange:p=>d.setUniform("uAlpha","float",p)},"Blend Function":{value:a,options:["FUNC_ADD","FUNC_SUBTRACT","FUNC_REVERSE_SUBTRACT"],onChange:p=>{a=t[p],b()}},Source:{value:s,options:[...E,"SRC_ALPHA_SATURATE"],onChange:p=>{s=t[p],b()}},Destination:{value:l,options:E,onChange:p=>{l=t[p],b()}},"Blending Color":{value:[0,0,0],onChange:p=>{r=Ye(p),b()}},"Constant Alpha":{value:1,min:0,max:1,step:.1,onChange:p=>{o=p,b()}}});return _.start(p=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),m.updatePerspective();try{p.forEach(v=>{m.calculateModelView(),m.push(),m.setMatrixUniforms(),m.pop(),d.setUniform("uMaterialDiffuse","vec4",v.diffuse),d.setUniform("uMaterialAmbient","vec4",v.ambient),d.setUniform("uWireframe","bool",v.wireframe),v.wireframe?k(t,v.vao,"LINES"):(i&&(t.cullFace(t.FRONT),k(t,v.vao,"TRIANGLES")),n&&(t.cullFace(t.BACK),k(t,v.vao,"TRIANGLES")))})}catch(v){console.error(v)}}),()=>{_.dispose(),g()}},Z=(t,e,i)=>{const n=document.createElement("button");n.textContent=e,n.addEventListener("click",i),t.appendChild(n)};window.onload=async()=>{const t=ii("app");if(!t)return;t.width=window.innerWidth,t.height=window.innerHeight,ri(t);const e=ni(t);if(!e)return;let i=await _t(e);const n=document.getElementById("menu");Z(n,"4.8",async()=>{i(),i=await ui(e)}),Z(n,"4.10",async()=>{i(),i=await fi(e)}),Z(n,"5.7",async()=>{i(),i=await hi(e)}),Z(n,"5.9",async()=>{i(),i=await bi(e)}),Z(n,"5.12",async()=>{i(),i=await Ai(e)}),Z(n,"6.3",async()=>{i(),i=await Ti(e)}),Z(n,"6.6",async()=>{i(),i=await Ri(e)}),Z(n,"6.8",async()=>{i(),i=await Di(e)}),Z(n,"6.12",async()=>{i(),i=await Si(e)}),Z(n,"6.14",async()=>{i(),i=await _t(e)})};
