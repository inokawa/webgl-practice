const Tt=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function i(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=i(n);fetch(n.href,o)}};Tt();const Ct="modulepreload",Pt=function(t){return"https://inokawa.github.io/webgl-3d-practice/"+t},Je={},l=function(e,i,r){return!i||i.length===0?e():Promise.all(i.map(n=>{if(n=Pt(n),n in Je)return;Je[n]=!0;const o=n.endsWith(".css"),s=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${s}`))return;const a=document.createElement("link");if(a.rel=o?"stylesheet":Ct,o||(a.as="script",a.crossOrigin=""),a.href=n,document.head.appendChild(a),o)return new Promise((u,d)=>{a.addEventListener("load",u),a.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>e())},et=(t,e,i)=>{const r=t.createShader(t[i]);return t.shaderSource(r,e),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS)?r:(console.error(t.getShaderInfoLog(r)),null)},q=(t,e,i,r,n)=>{const o=t.createProgram(),s=et(t,e,"VERTEX_SHADER"),a=et(t,i,"FRAGMENT_SHADER");t.attachShader(o,s),t.attachShader(o,a),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS)||console.error("Could not initialize shaders"),t.deleteShader(s),t.deleteShader(a);const u={data:o,attributes:r.reduce((d,f)=>(d[f]=t.getAttribLocation(o,f),d),{}),uniforms:n.reduce((d,f)=>(d[f]=t.getUniformLocation(o,f),d),{}),use:()=>{t.useProgram(o)},dispose:()=>{t.deleteProgram(o)},getUniform:d=>t.getUniform(o,u.uniforms[d]),setUniform:(d,f,c)=>{switch(f){case"float":t.uniform1f(u.uniforms[d],c);break;case"int":t.uniform1i(u.uniforms[d],c);break;case"bool":t.uniform1f(u.uniforms[d],c);break;case"vec2":t.uniform2fv(u.uniforms[d],c);break;case"ivec2":t.uniform2iv(u.uniforms[d],c);break;case"bvec2":t.uniform2fv(u.uniforms[d],c);break;case"vec3":t.uniform3fv(u.uniforms[d],c);break;case"ivec3":t.uniform3iv(u.uniforms[d],c);break;case"bvec3":t.uniform3fv(u.uniforms[d],c);break;case"vec4":t.uniform4fv(u.uniforms[d],c);break;case"ivec4":t.uniform4iv(u.uniforms[d],c);break;case"bvec4":t.uniform4fv(u.uniforms[d],c);break;case"mat2":t.uniformMatrix2fv(u.uniforms[d],!1,c);break;case"mat3":t.uniformMatrix3fv(u.uniforms[d],!1,c);break;case"mat4":t.uniformMatrix4fv(u.uniforms[d],!1,c);break}}};return u},ht=(t,e,i,r)=>{const n=t.createVertexArray();t.bindVertexArray(n);const o=[];i.forEach(({name:u,data:d,size:f})=>{const c=t.createBuffer();o.push(c),t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array(d),t.STATIC_DRAW),t.vertexAttribPointer(e.attributes[u],f,t.FLOAT,!1,0,0),t.enableVertexAttribArray(e.attributes[u])});let s=null;r&&(s=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,s),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(r),t.STATIC_DRAW)),t.bindVertexArray(null),t.bindBuffer(t.ARRAY_BUFFER,null),r&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null);const a={vao:n,use:u=>{t.bindVertexArray(a.vao),u(r?r.length:void 0),t.bindVertexArray(null)},dispose:()=>{t.deleteVertexArray(a.vao),o.forEach(u=>{t.deleteBuffer(u)}),t.deleteBuffer(s)}};return a},H=(t,e,i)=>{e.use(r=>{r!=null?t.drawElements(t[i],r,t.UNSIGNED_SHORT,0):t.drawArrays(t[i],t.UNSIGNED_SHORT,0)})};function Rt(t){if(!!t&&!(typeof window>"u")){var e=document.createElement("style");return e.setAttribute("type","text/css"),e.innerHTML=t,document.head.appendChild(e),t}}function ge(t,e){var i=t.__state.conversionName.toString(),r=Math.round(t.r),n=Math.round(t.g),o=Math.round(t.b),s=t.a,a=Math.round(t.h),u=t.s.toFixed(1),d=t.v.toFixed(1);if(e||i==="THREE_CHAR_HEX"||i==="SIX_CHAR_HEX"){for(var f=t.hex.toString(16);f.length<6;)f="0"+f;return"#"+f}else{if(i==="CSS_RGB")return"rgb("+r+","+n+","+o+")";if(i==="CSS_RGBA")return"rgba("+r+","+n+","+o+","+s+")";if(i==="HEX")return"0x"+t.hex.toString(16);if(i==="RGB_ARRAY")return"["+r+","+n+","+o+"]";if(i==="RGBA_ARRAY")return"["+r+","+n+","+o+","+s+"]";if(i==="RGB_OBJ")return"{r:"+r+",g:"+n+",b:"+o+"}";if(i==="RGBA_OBJ")return"{r:"+r+",g:"+n+",b:"+o+",a:"+s+"}";if(i==="HSV_OBJ")return"{h:"+a+",s:"+u+",v:"+d+"}";if(i==="HSVA_OBJ")return"{h:"+a+",s:"+u+",v:"+d+",a:"+s+"}"}return"unknown format"}var tt=Array.prototype.forEach,xe=Array.prototype.slice,h={BREAK:{},extend:function(e){return this.each(xe.call(arguments,1),function(i){var r=this.isObject(i)?Object.keys(i):[];r.forEach(function(n){this.isUndefined(i[n])||(e[n]=i[n])}.bind(this))},this),e},defaults:function(e){return this.each(xe.call(arguments,1),function(i){var r=this.isObject(i)?Object.keys(i):[];r.forEach(function(n){this.isUndefined(e[n])&&(e[n]=i[n])}.bind(this))},this),e},compose:function(){var e=xe.call(arguments);return function(){for(var i=xe.call(arguments),r=e.length-1;r>=0;r--)i=[e[r].apply(this,i)];return i[0]}},each:function(e,i,r){if(!!e){if(tt&&e.forEach&&e.forEach===tt)e.forEach(i,r);else if(e.length===e.length+0){var n=void 0,o=void 0;for(n=0,o=e.length;n<o;n++)if(n in e&&i.call(r,e[n],n)===this.BREAK)return}else for(var s in e)if(i.call(r,e[s],s)===this.BREAK)return}},defer:function(e){setTimeout(e,0)},debounce:function(e,i,r){var n=void 0;return function(){var o=this,s=arguments;function a(){n=null,r||e.apply(o,s)}var u=r||!n;clearTimeout(n),n=setTimeout(a,i),u&&e.apply(o,s)}},toArray:function(e){return e.toArray?e.toArray():xe.call(e)},isUndefined:function(e){return e===void 0},isNull:function(e){return e===null},isNaN:function(t){function e(i){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){return isNaN(t)}),isArray:Array.isArray||function(t){return t.constructor===Array},isObject:function(e){return e===Object(e)},isNumber:function(e){return e===e+0},isString:function(e){return e===e+""},isBoolean:function(e){return e===!1||e===!0},isFunction:function(e){return e instanceof Function}},Vt=[{litmus:h.isString,conversions:{THREE_CHAR_HEX:{read:function(e){var i=e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return i===null?!1:{space:"HEX",hex:parseInt("0x"+i[1].toString()+i[1].toString()+i[2].toString()+i[2].toString()+i[3].toString()+i[3].toString(),0)}},write:ge},SIX_CHAR_HEX:{read:function(e){var i=e.match(/^#([A-F0-9]{6})$/i);return i===null?!1:{space:"HEX",hex:parseInt("0x"+i[1].toString(),0)}},write:ge},CSS_RGB:{read:function(e){var i=e.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return i===null?!1:{space:"RGB",r:parseFloat(i[1]),g:parseFloat(i[2]),b:parseFloat(i[3])}},write:ge},CSS_RGBA:{read:function(e){var i=e.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);return i===null?!1:{space:"RGB",r:parseFloat(i[1]),g:parseFloat(i[2]),b:parseFloat(i[3]),a:parseFloat(i[4])}},write:ge}}},{litmus:h.isNumber,conversions:{HEX:{read:function(e){return{space:"HEX",hex:e,conversionName:"HEX"}},write:function(e){return e.hex}}}},{litmus:h.isArray,conversions:{RGB_ARRAY:{read:function(e){return e.length!==3?!1:{space:"RGB",r:e[0],g:e[1],b:e[2]}},write:function(e){return[e.r,e.g,e.b]}},RGBA_ARRAY:{read:function(e){return e.length!==4?!1:{space:"RGB",r:e[0],g:e[1],b:e[2],a:e[3]}},write:function(e){return[e.r,e.g,e.b,e.a]}}}},{litmus:h.isObject,conversions:{RGBA_OBJ:{read:function(e){return h.isNumber(e.r)&&h.isNumber(e.g)&&h.isNumber(e.b)&&h.isNumber(e.a)?{space:"RGB",r:e.r,g:e.g,b:e.b,a:e.a}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}},RGB_OBJ:{read:function(e){return h.isNumber(e.r)&&h.isNumber(e.g)&&h.isNumber(e.b)?{space:"RGB",r:e.r,g:e.g,b:e.b}:!1},write:function(e){return{r:e.r,g:e.g,b:e.b}}},HSVA_OBJ:{read:function(e){return h.isNumber(e.h)&&h.isNumber(e.s)&&h.isNumber(e.v)&&h.isNumber(e.a)?{space:"HSV",h:e.h,s:e.s,v:e.v,a:e.a}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v,a:e.a}}},HSV_OBJ:{read:function(e){return h.isNumber(e.h)&&h.isNumber(e.s)&&h.isNumber(e.v)?{space:"HSV",h:e.h,s:e.s,v:e.v}:!1},write:function(e){return{h:e.h,s:e.s,v:e.v}}}}}],Le=void 0,Ve=void 0,He=function(){Ve=!1;var e=arguments.length>1?h.toArray(arguments):arguments[0];return h.each(Vt,function(i){if(i.litmus(e))return h.each(i.conversions,function(r,n){if(Le=r.read(e),Ve===!1&&Le!==!1)return Ve=Le,Le.conversionName=n,Le.conversion=r,h.BREAK}),h.BREAK}),Ve},it=void 0,Ie={hsv_to_rgb:function(e,i,r){var n=Math.floor(e/60)%6,o=e/60-Math.floor(e/60),s=r*(1-i),a=r*(1-o*i),u=r*(1-(1-o)*i),d=[[r,u,s],[a,r,s],[s,r,u],[s,a,r],[u,s,r],[r,s,a]][n];return{r:d[0]*255,g:d[1]*255,b:d[2]*255}},rgb_to_hsv:function(e,i,r){var n=Math.min(e,i,r),o=Math.max(e,i,r),s=o-n,a=void 0,u=void 0;if(o!==0)u=s/o;else return{h:NaN,s:0,v:0};return e===o?a=(i-r)/s:i===o?a=2+(r-e)/s:a=4+(e-i)/s,a/=6,a<0&&(a+=1),{h:a*360,s:u,v:o/255}},rgb_to_hex:function(e,i,r){var n=this.hex_with_component(0,2,e);return n=this.hex_with_component(n,1,i),n=this.hex_with_component(n,0,r),n},component_from_hex:function(e,i){return e>>i*8&255},hex_with_component:function(e,i,r){return r<<(it=i*8)|e&~(255<<it)}},Mt=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Z=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},Q=function(){function t(e,i){for(var r=0;r<i.length;r++){var n=i[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(e,i,r){return i&&t(e.prototype,i),r&&t(e,r),e}}(),ue=function t(e,i,r){e===null&&(e=Function.prototype);var n=Object.getOwnPropertyDescriptor(e,i);if(n===void 0){var o=Object.getPrototypeOf(e);return o===null?void 0:t(o,i,r)}else{if("value"in n)return n.value;var s=n.get;return s===void 0?void 0:s.call(r)}},le=function(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},de=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t},U=function(){function t(){if(Z(this,t),this.__state=He.apply(this,arguments),this.__state===!1)throw new Error("Failed to interpret color arguments");this.__state.a=this.__state.a||1}return Q(t,[{key:"toString",value:function(){return ge(this)}},{key:"toHexString",value:function(){return ge(this,!0)}},{key:"toOriginal",value:function(){return this.__state.conversion.write(this)}}]),t}();function Xe(t,e,i){Object.defineProperty(t,e,{get:function(){return this.__state.space==="RGB"?this.__state[e]:(U.recalculateRGB(this,e,i),this.__state[e])},set:function(n){this.__state.space!=="RGB"&&(U.recalculateRGB(this,e,i),this.__state.space="RGB"),this.__state[e]=n}})}function Ke(t,e){Object.defineProperty(t,e,{get:function(){return this.__state.space==="HSV"?this.__state[e]:(U.recalculateHSV(this),this.__state[e])},set:function(r){this.__state.space!=="HSV"&&(U.recalculateHSV(this),this.__state.space="HSV"),this.__state[e]=r}})}U.recalculateRGB=function(t,e,i){if(t.__state.space==="HEX")t.__state[e]=Ie.component_from_hex(t.__state.hex,i);else if(t.__state.space==="HSV")h.extend(t.__state,Ie.hsv_to_rgb(t.__state.h,t.__state.s,t.__state.v));else throw new Error("Corrupted color state")};U.recalculateHSV=function(t){var e=Ie.rgb_to_hsv(t.r,t.g,t.b);h.extend(t.__state,{s:e.s,v:e.v}),h.isNaN(e.h)?h.isUndefined(t.__state.h)&&(t.__state.h=0):t.__state.h=e.h};U.COMPONENTS=["r","g","b","h","s","v","hex","a"];Xe(U.prototype,"r",2);Xe(U.prototype,"g",1);Xe(U.prototype,"b",0);Ke(U.prototype,"h");Ke(U.prototype,"s");Ke(U.prototype,"v");Object.defineProperty(U.prototype,"a",{get:function(){return this.__state.a},set:function(e){this.__state.a=e}});Object.defineProperty(U.prototype,"hex",{get:function(){return this.__state.space!=="HEX"&&(this.__state.hex=Ie.rgb_to_hex(this.r,this.g,this.b),this.__state.space="HEX"),this.__state.hex},set:function(e){this.__state.space="HEX",this.__state.hex=e}});var me=function(){function t(e,i){Z(this,t),this.initialValue=e[i],this.domElement=document.createElement("div"),this.object=e,this.property=i,this.__onChange=void 0,this.__onFinishChange=void 0}return Q(t,[{key:"onChange",value:function(i){return this.__onChange=i,this}},{key:"onFinishChange",value:function(i){return this.__onFinishChange=i,this}},{key:"setValue",value:function(i){return this.object[this.property]=i,this.__onChange&&this.__onChange.call(this,i),this.updateDisplay(),this}},{key:"getValue",value:function(){return this.object[this.property]}},{key:"updateDisplay",value:function(){return this}},{key:"isModified",value:function(){return this.initialValue!==this.getValue()}}]),t}(),Ot={HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},pt={};h.each(Ot,function(t,e){h.each(t,function(i){pt[i]=e})});var Dt=/(\d+(\.\d+)?)px/;function J(t){if(t==="0"||h.isUndefined(t))return 0;var e=t.match(Dt);return h.isNull(e)?0:parseFloat(e[1])}var m={makeSelectable:function(e,i){e===void 0||e.style===void 0||(e.onselectstart=i?function(){return!1}:function(){},e.style.MozUserSelect=i?"auto":"none",e.style.KhtmlUserSelect=i?"auto":"none",e.unselectable=i?"on":"off")},makeFullscreen:function(e,i,r){var n=r,o=i;h.isUndefined(o)&&(o=!0),h.isUndefined(n)&&(n=!0),e.style.position="absolute",o&&(e.style.left=0,e.style.right=0),n&&(e.style.top=0,e.style.bottom=0)},fakeEvent:function(e,i,r,n){var o=r||{},s=pt[i];if(!s)throw new Error("Event type "+i+" not supported.");var a=document.createEvent(s);switch(s){case"MouseEvents":{var u=o.x||o.clientX||0,d=o.y||o.clientY||0;a.initMouseEvent(i,o.bubbles||!1,o.cancelable||!0,window,o.clickCount||1,0,0,u,d,!1,!1,!1,!1,0,null);break}case"KeyboardEvents":{var f=a.initKeyboardEvent||a.initKeyEvent;h.defaults(o,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),f(i,o.bubbles||!1,o.cancelable,window,o.ctrlKey,o.altKey,o.shiftKey,o.metaKey,o.keyCode,o.charCode);break}default:{a.initEvent(i,o.bubbles||!1,o.cancelable||!0);break}}h.defaults(a,n),e.dispatchEvent(a)},bind:function(e,i,r,n){var o=n||!1;return e.addEventListener?e.addEventListener(i,r,o):e.attachEvent&&e.attachEvent("on"+i,r),m},unbind:function(e,i,r,n){var o=n||!1;return e.removeEventListener?e.removeEventListener(i,r,o):e.detachEvent&&e.detachEvent("on"+i,r),m},addClass:function(e,i){if(e.className===void 0)e.className=i;else if(e.className!==i){var r=e.className.split(/ +/);r.indexOf(i)===-1&&(r.push(i),e.className=r.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return m},removeClass:function(e,i){if(i)if(e.className===i)e.removeAttribute("class");else{var r=e.className.split(/ +/),n=r.indexOf(i);n!==-1&&(r.splice(n,1),e.className=r.join(" "))}else e.className=void 0;return m},hasClass:function(e,i){return new RegExp("(?:^|\\s+)"+i+"(?:\\s+|$)").test(e.className)||!1},getWidth:function(e){var i=getComputedStyle(e);return J(i["border-left-width"])+J(i["border-right-width"])+J(i["padding-left"])+J(i["padding-right"])+J(i.width)},getHeight:function(e){var i=getComputedStyle(e);return J(i["border-top-width"])+J(i["border-bottom-width"])+J(i["padding-top"])+J(i["padding-bottom"])+J(i.height)},getOffset:function(e){var i=e,r={left:0,top:0};if(i.offsetParent)do r.left+=i.offsetLeft,r.top+=i.offsetTop,i=i.offsetParent;while(i);return r},isActive:function(e){return e===document.activeElement&&(e.type||e.href)}},vt=function(t){le(e,t);function e(i,r){Z(this,e);var n=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r)),o=n;n.__prev=n.getValue(),n.__checkbox=document.createElement("input"),n.__checkbox.setAttribute("type","checkbox");function s(){o.setValue(!o.__prev)}return m.bind(n.__checkbox,"change",s,!1),n.domElement.appendChild(n.__checkbox),n.updateDisplay(),n}return Q(e,[{key:"setValue",value:function(r){var n=ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,r);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),n}},{key:"updateDisplay",value:function(){return this.getValue()===!0?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0,this.__prev=!0):(this.__checkbox.checked=!1,this.__prev=!1),ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(me),It=function(t){le(e,t);function e(i,r,n){Z(this,e);var o=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r)),s=n,a=o;if(o.__select=document.createElement("select"),h.isArray(s)){var u={};h.each(s,function(d){u[d]=d}),s=u}return h.each(s,function(d,f){var c=document.createElement("option");c.innerHTML=f,c.setAttribute("value",d),a.__select.appendChild(c)}),o.updateDisplay(),m.bind(o.__select,"change",function(){var d=this.options[this.selectedIndex].value;a.setValue(d)}),o.domElement.appendChild(o.__select),o}return Q(e,[{key:"setValue",value:function(r){var n=ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,r);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),n}},{key:"updateDisplay",value:function(){return m.isActive(this.__select)?this:(this.__select.value=this.getValue(),ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this))}}]),e}(me),St=function(t){le(e,t);function e(i,r){Z(this,e);var n=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r)),o=n;function s(){o.setValue(o.__input.value)}function a(){o.__onFinishChange&&o.__onFinishChange.call(o,o.getValue())}return n.__input=document.createElement("input"),n.__input.setAttribute("type","text"),m.bind(n.__input,"keyup",s),m.bind(n.__input,"change",s),m.bind(n.__input,"blur",a),m.bind(n.__input,"keydown",function(u){u.keyCode===13&&this.blur()}),n.updateDisplay(),n.domElement.appendChild(n.__input),n}return Q(e,[{key:"updateDisplay",value:function(){return m.isActive(this.__input)||(this.__input.value=this.getValue()),ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(me);function nt(t){var e=t.toString();return e.indexOf(".")>-1?e.length-e.indexOf(".")-1:0}var gt=function(t){le(e,t);function e(i,r,n){Z(this,e);var o=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r)),s=n||{};return o.__min=s.min,o.__max=s.max,o.__step=s.step,h.isUndefined(o.__step)?o.initialValue===0?o.__impliedStep=1:o.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(o.initialValue))/Math.LN10))/10:o.__impliedStep=o.__step,o.__precision=nt(o.__impliedStep),o}return Q(e,[{key:"setValue",value:function(r){var n=r;return this.__min!==void 0&&n<this.__min?n=this.__min:this.__max!==void 0&&n>this.__max&&(n=this.__max),this.__step!==void 0&&n%this.__step!==0&&(n=Math.round(n/this.__step)*this.__step),ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setValue",this).call(this,n)}},{key:"min",value:function(r){return this.__min=r,this}},{key:"max",value:function(r){return this.__max=r,this}},{key:"step",value:function(r){return this.__step=r,this.__impliedStep=r,this.__precision=nt(r),this}}]),e}(me);function Nt(t,e){var i=Math.pow(10,e);return Math.round(t*i)/i}var Se=function(t){le(e,t);function e(i,r,n){Z(this,e);var o=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r,n));o.__truncationSuspended=!1;var s=o,a=void 0;function u(){var v=parseFloat(s.__input.value);h.isNaN(v)||s.setValue(v)}function d(){s.__onFinishChange&&s.__onFinishChange.call(s,s.getValue())}function f(){d()}function c(v){var b=a-v.clientY;s.setValue(s.getValue()+b*s.__impliedStep),a=v.clientY}function _(){m.unbind(window,"mousemove",c),m.unbind(window,"mouseup",_),d()}function p(v){m.bind(window,"mousemove",c),m.bind(window,"mouseup",_),a=v.clientY}return o.__input=document.createElement("input"),o.__input.setAttribute("type","text"),m.bind(o.__input,"change",u),m.bind(o.__input,"blur",f),m.bind(o.__input,"mousedown",p),m.bind(o.__input,"keydown",function(v){v.keyCode===13&&(s.__truncationSuspended=!0,this.blur(),s.__truncationSuspended=!1,d())}),o.updateDisplay(),o.domElement.appendChild(o.__input),o}return Q(e,[{key:"updateDisplay",value:function(){return this.__input.value=this.__truncationSuspended?this.getValue():Nt(this.getValue(),this.__precision),ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(gt);function rt(t,e,i,r,n){return r+(n-r)*((t-e)/(i-e))}var ze=function(t){le(e,t);function e(i,r,n,o,s){Z(this,e);var a=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r,{min:n,max:o,step:s})),u=a;a.__background=document.createElement("div"),a.__foreground=document.createElement("div"),m.bind(a.__background,"mousedown",d),m.bind(a.__background,"touchstart",_),m.addClass(a.__background,"slider"),m.addClass(a.__foreground,"slider-fg");function d(b){document.activeElement.blur(),m.bind(window,"mousemove",f),m.bind(window,"mouseup",c),f(b)}function f(b){b.preventDefault();var g=u.__background.getBoundingClientRect();return u.setValue(rt(b.clientX,g.left,g.right,u.__min,u.__max)),!1}function c(){m.unbind(window,"mousemove",f),m.unbind(window,"mouseup",c),u.__onFinishChange&&u.__onFinishChange.call(u,u.getValue())}function _(b){b.touches.length===1&&(m.bind(window,"touchmove",p),m.bind(window,"touchend",v),p(b))}function p(b){var g=b.touches[0].clientX,E=u.__background.getBoundingClientRect();u.setValue(rt(g,E.left,E.right,u.__min,u.__max))}function v(){m.unbind(window,"touchmove",p),m.unbind(window,"touchend",v),u.__onFinishChange&&u.__onFinishChange.call(u,u.getValue())}return a.updateDisplay(),a.__background.appendChild(a.__foreground),a.domElement.appendChild(a.__background),a}return Q(e,[{key:"updateDisplay",value:function(){var r=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=r*100+"%",ue(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"updateDisplay",this).call(this)}}]),e}(gt),Et=function(t){le(e,t);function e(i,r,n){Z(this,e);var o=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r)),s=o;return o.__button=document.createElement("div"),o.__button.innerHTML=n===void 0?"Fire":n,m.bind(o.__button,"click",function(a){return a.preventDefault(),s.fire(),!1}),m.addClass(o.__button,"button"),o.domElement.appendChild(o.__button),o}return Q(e,[{key:"fire",value:function(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())}}]),e}(me),Ge=function(t){le(e,t);function e(i,r){Z(this,e);var n=de(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,r));n.__color=new U(n.getValue()),n.__temp=new U(0);var o=n;n.domElement=document.createElement("div"),m.makeSelectable(n.domElement,!1),n.__selector=document.createElement("div"),n.__selector.className="selector",n.__saturation_field=document.createElement("div"),n.__saturation_field.className="saturation-field",n.__field_knob=document.createElement("div"),n.__field_knob.className="field-knob",n.__field_knob_border="2px solid ",n.__hue_knob=document.createElement("div"),n.__hue_knob.className="hue-knob",n.__hue_field=document.createElement("div"),n.__hue_field.className="hue-field",n.__input=document.createElement("input"),n.__input.type="text",n.__input_textShadow="0 1px 1px ",m.bind(n.__input,"keydown",function(b){b.keyCode===13&&c.call(this)}),m.bind(n.__input,"blur",c),m.bind(n.__selector,"mousedown",function(){m.addClass(this,"drag").bind(window,"mouseup",function(){m.removeClass(o.__selector,"drag")})}),m.bind(n.__selector,"touchstart",function(){m.addClass(this,"drag").bind(window,"touchend",function(){m.removeClass(o.__selector,"drag")})});var s=document.createElement("div");h.extend(n.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"}),h.extend(n.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:n.__field_knob_border+(n.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1}),h.extend(n.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1}),h.extend(n.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"}),h.extend(s.style,{width:"100%",height:"100%",background:"none"}),ot(s,"top","rgba(0,0,0,0)","#000"),h.extend(n.__hue_field.style,{width:"15px",height:"100px",border:"1px solid #555",cursor:"ns-resize",position:"absolute",top:"3px",right:"3px"}),Ft(n.__hue_field),h.extend(n.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:n.__input_textShadow+"rgba(0,0,0,0.7)"}),m.bind(n.__saturation_field,"mousedown",a),m.bind(n.__saturation_field,"touchstart",a),m.bind(n.__field_knob,"mousedown",a),m.bind(n.__field_knob,"touchstart",a),m.bind(n.__hue_field,"mousedown",u),m.bind(n.__hue_field,"touchstart",u);function a(b){p(b),m.bind(window,"mousemove",p),m.bind(window,"touchmove",p),m.bind(window,"mouseup",d),m.bind(window,"touchend",d)}function u(b){v(b),m.bind(window,"mousemove",v),m.bind(window,"touchmove",v),m.bind(window,"mouseup",f),m.bind(window,"touchend",f)}function d(){m.unbind(window,"mousemove",p),m.unbind(window,"touchmove",p),m.unbind(window,"mouseup",d),m.unbind(window,"touchend",d),_()}function f(){m.unbind(window,"mousemove",v),m.unbind(window,"touchmove",v),m.unbind(window,"mouseup",f),m.unbind(window,"touchend",f),_()}function c(){var b=He(this.value);b!==!1?(o.__color.__state=b,o.setValue(o.__color.toOriginal())):this.value=o.__color.toString()}function _(){o.__onFinishChange&&o.__onFinishChange.call(o,o.__color.toOriginal())}n.__saturation_field.appendChild(s),n.__selector.appendChild(n.__field_knob),n.__selector.appendChild(n.__saturation_field),n.__selector.appendChild(n.__hue_field),n.__hue_field.appendChild(n.__hue_knob),n.domElement.appendChild(n.__input),n.domElement.appendChild(n.__selector),n.updateDisplay();function p(b){b.type.indexOf("touch")===-1&&b.preventDefault();var g=o.__saturation_field.getBoundingClientRect(),E=b.touches&&b.touches[0]||b,w=E.clientX,T=E.clientY,R=(w-g.left)/(g.right-g.left),x=1-(T-g.top)/(g.bottom-g.top);return x>1?x=1:x<0&&(x=0),R>1?R=1:R<0&&(R=0),o.__color.v=x,o.__color.s=R,o.setValue(o.__color.toOriginal()),!1}function v(b){b.type.indexOf("touch")===-1&&b.preventDefault();var g=o.__hue_field.getBoundingClientRect(),E=b.touches&&b.touches[0]||b,w=E.clientY,T=1-(w-g.top)/(g.bottom-g.top);return T>1?T=1:T<0&&(T=0),o.__color.h=T*360,o.setValue(o.__color.toOriginal()),!1}return n}return Q(e,[{key:"updateDisplay",value:function(){var r=He(this.getValue());if(r!==!1){var n=!1;h.each(U.COMPONENTS,function(a){if(!h.isUndefined(r[a])&&!h.isUndefined(this.__color.__state[a])&&r[a]!==this.__color.__state[a])return n=!0,{}},this),n&&h.extend(this.__color.__state,r)}h.extend(this.__temp.__state,this.__color.__state),this.__temp.a=1;var o=this.__color.v<.5||this.__color.s>.5?255:0,s=255-o;h.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toHexString(),border:this.__field_knob_border+"rgb("+o+","+o+","+o+")"}),this.__hue_knob.style.marginTop=(1-this.__color.h/360)*100+"px",this.__temp.s=1,this.__temp.v=1,ot(this.__saturation_field,"left","#fff",this.__temp.toHexString()),this.__input.value=this.__color.toString(),h.extend(this.__input.style,{backgroundColor:this.__color.toHexString(),color:"rgb("+o+","+o+","+o+")",textShadow:this.__input_textShadow+"rgba("+s+","+s+","+s+",.7)"})}}]),e}(me),Ut=["-moz-","-o-","-webkit-","-ms-",""];function ot(t,e,i,r){t.style.background="",h.each(Ut,function(n){t.style.cssText+="background: "+n+"linear-gradient("+e+", "+i+" 0%, "+r+" 100%); "})}function Ft(t){t.style.background="",t.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);",t.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",t.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}var kt={load:function(e,i){var r=i||document,n=r.createElement("link");n.type="text/css",n.rel="stylesheet",n.href=e,r.getElementsByTagName("head")[0].appendChild(n)},inject:function(e,i){var r=i||document,n=document.createElement("style");n.type="text/css",n.innerHTML=e;var o=r.getElementsByTagName("head")[0];try{o.appendChild(n)}catch{}}},jt=`<div id="dg-save" class="dg dialogue">

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

</div>`,Bt=function(e,i){var r=e[i];return h.isArray(arguments[2])||h.isObject(arguments[2])?new It(e,i,arguments[2]):h.isNumber(r)?h.isNumber(arguments[2])&&h.isNumber(arguments[3])?h.isNumber(arguments[4])?new ze(e,i,arguments[2],arguments[3],arguments[4]):new ze(e,i,arguments[2],arguments[3]):h.isNumber(arguments[4])?new Se(e,i,{min:arguments[2],max:arguments[3],step:arguments[4]}):new Se(e,i,{min:arguments[2],max:arguments[3]}):h.isString(r)?new St(e,i):h.isFunction(r)?new Et(e,i,""):h.isBoolean(r)?new vt(e,i):null};function Ht(t){setTimeout(t,1e3/60)}var zt=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||Ht,Gt=function(){function t(){Z(this,t),this.backgroundElement=document.createElement("div"),h.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),m.makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),h.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);var e=this;m.bind(this.backgroundElement,"click",function(){e.hide()})}return Q(t,[{key:"show",value:function(){var i=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),h.defer(function(){i.backgroundElement.style.opacity=1,i.domElement.style.opacity=1,i.domElement.style.webkitTransform="scale(1)"})}},{key:"hide",value:function(){var i=this,r=function n(){i.domElement.style.display="none",i.backgroundElement.style.display="none",m.unbind(i.domElement,"webkitTransitionEnd",n),m.unbind(i.domElement,"transitionend",n),m.unbind(i.domElement,"oTransitionEnd",n)};m.bind(this.domElement,"webkitTransitionEnd",r),m.bind(this.domElement,"transitionend",r),m.bind(this.domElement,"oTransitionEnd",r),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"}},{key:"layout",value:function(){this.domElement.style.left=window.innerWidth/2-m.getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-m.getHeight(this.domElement)/2+"px"}}]),t}(),$t=Rt(`.dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}
`);kt.inject($t);var at="dg",st=72,ut=20,Ce="Default",Ae=function(){try{return!!window.localStorage}catch{return!1}}(),ye=void 0,lt=!0,pe=void 0,Be=!1,bt=[],V=function t(e){var i=this,r=e||{};this.domElement=document.createElement("div"),this.__ul=document.createElement("ul"),this.domElement.appendChild(this.__ul),m.addClass(this.domElement,at),this.__folders={},this.__controllers=[],this.__rememberedObjects=[],this.__rememberedObjectIndecesToControllers=[],this.__listening=[],r=h.defaults(r,{closeOnTop:!1,autoPlace:!0,width:t.DEFAULT_WIDTH}),r=h.defaults(r,{resizable:r.autoPlace,hideable:r.autoPlace}),h.isUndefined(r.load)?r.load={preset:Ce}:r.preset&&(r.load.preset=r.preset),h.isUndefined(r.parent)&&r.hideable&&bt.push(this),r.resizable=h.isUndefined(r.parent)&&r.resizable,r.autoPlace&&h.isUndefined(r.scrollable)&&(r.scrollable=!0);var n=Ae&&localStorage.getItem(ve(this,"isLocal"))==="true",o=void 0,s=void 0;if(Object.defineProperties(this,{parent:{get:function(){return r.parent}},scrollable:{get:function(){return r.scrollable}},autoPlace:{get:function(){return r.autoPlace}},closeOnTop:{get:function(){return r.closeOnTop}},preset:{get:function(){return i.parent?i.getRoot().preset:r.load.preset},set:function(_){i.parent?i.getRoot().preset=_:r.load.preset=_,Kt(this),i.revert()}},width:{get:function(){return r.width},set:function(_){r.width=_,We(i,_)}},name:{get:function(){return r.name},set:function(_){r.name=_,s&&(s.innerHTML=r.name)}},closed:{get:function(){return r.closed},set:function(_){r.closed=_,r.closed?m.addClass(i.__ul,t.CLASS_CLOSED):m.removeClass(i.__ul,t.CLASS_CLOSED),this.onResize(),i.__closeButton&&(i.__closeButton.innerHTML=_?t.TEXT_OPEN:t.TEXT_CLOSED)}},load:{get:function(){return r.load}},useLocalStorage:{get:function(){return n},set:function(_){Ae&&(n=_,_?m.bind(window,"unload",o):m.unbind(window,"unload",o),localStorage.setItem(ve(i,"isLocal"),_))}}}),h.isUndefined(r.parent)){if(this.closed=r.closed||!1,m.addClass(this.domElement,t.CLASS_MAIN),m.makeSelectable(this.domElement,!1),Ae&&n){i.useLocalStorage=!0;var a=localStorage.getItem(ve(this,"gui"));a&&(r.load=JSON.parse(a))}this.__closeButton=document.createElement("div"),this.__closeButton.innerHTML=t.TEXT_CLOSED,m.addClass(this.__closeButton,t.CLASS_CLOSE_BUTTON),r.closeOnTop?(m.addClass(this.__closeButton,t.CLASS_CLOSE_TOP),this.domElement.insertBefore(this.__closeButton,this.domElement.childNodes[0])):(m.addClass(this.__closeButton,t.CLASS_CLOSE_BOTTOM),this.domElement.appendChild(this.__closeButton)),m.bind(this.__closeButton,"click",function(){i.closed=!i.closed})}else{r.closed===void 0&&(r.closed=!0);var u=document.createTextNode(r.name);m.addClass(u,"controller-name"),s=qe(i,u);var d=function(_){return _.preventDefault(),i.closed=!i.closed,!1};m.addClass(this.__ul,t.CLASS_CLOSED),m.addClass(s,"title"),m.bind(s,"click",d),r.closed||(this.closed=!1)}r.autoPlace&&(h.isUndefined(r.parent)&&(lt&&(pe=document.createElement("div"),m.addClass(pe,at),m.addClass(pe,t.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(pe),lt=!1),pe.appendChild(this.domElement),m.addClass(this.domElement,t.CLASS_AUTO_PLACE)),this.parent||We(i,r.width)),this.__resizeHandler=function(){i.onResizeDebounced()},m.bind(window,"resize",this.__resizeHandler),m.bind(this.__ul,"webkitTransitionEnd",this.__resizeHandler),m.bind(this.__ul,"transitionend",this.__resizeHandler),m.bind(this.__ul,"oTransitionEnd",this.__resizeHandler),this.onResize(),r.resizable&&Xt(this),o=function(){Ae&&localStorage.getItem(ve(i,"isLocal"))==="true"&&localStorage.setItem(ve(i,"gui"),JSON.stringify(i.getSaveObject()))},this.saveToLocalStorageIfPossible=o;function f(){var c=i.getRoot();c.width+=1,h.defer(function(){c.width-=1})}r.parent||f()};V.toggleHide=function(){Be=!Be,h.each(bt,function(t){t.domElement.style.display=Be?"none":""})};V.CLASS_AUTO_PLACE="a";V.CLASS_AUTO_PLACE_CONTAINER="ac";V.CLASS_MAIN="main";V.CLASS_CONTROLLER_ROW="cr";V.CLASS_TOO_TALL="taller-than-window";V.CLASS_CLOSED="closed";V.CLASS_CLOSE_BUTTON="close-button";V.CLASS_CLOSE_TOP="close-top";V.CLASS_CLOSE_BOTTOM="close-bottom";V.CLASS_DRAG="drag";V.DEFAULT_WIDTH=245;V.TEXT_CLOSED="Close Controls";V.TEXT_OPEN="Open Controls";V._keydownHandler=function(t){document.activeElement.type!=="text"&&(t.which===st||t.keyCode===st)&&V.toggleHide()};m.bind(window,"keydown",V._keydownHandler,!1);h.extend(V.prototype,{add:function(e,i){return Te(this,e,i,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(e,i){return Te(this,e,i,{color:!0})},remove:function(e){this.__ul.removeChild(e.__li),this.__controllers.splice(this.__controllers.indexOf(e),1);var i=this;h.defer(function(){i.onResize()})},destroy:function(){if(this.parent)throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");this.autoPlace&&pe.removeChild(this.domElement);var e=this;h.each(this.__folders,function(i){e.removeFolder(i)}),m.unbind(window,"keydown",V._keydownHandler,!1),dt(this)},addFolder:function(e){if(this.__folders[e]!==void 0)throw new Error('You already have a folder in this GUI by the name "'+e+'"');var i={name:e,parent:this};i.autoPlace=this.autoPlace,this.load&&this.load.folders&&this.load.folders[e]&&(i.closed=this.load.folders[e].closed,i.load=this.load.folders[e]);var r=new V(i);this.__folders[e]=r;var n=qe(this,r.domElement);return m.addClass(n,"folder"),r},removeFolder:function(e){this.__ul.removeChild(e.domElement.parentElement),delete this.__folders[e.name],this.load&&this.load.folders&&this.load.folders[e.name]&&delete this.load.folders[e.name],dt(e);var i=this;h.each(e.__folders,function(r){e.removeFolder(r)}),h.defer(function(){i.onResize()})},open:function(){this.closed=!1},close:function(){this.closed=!0},hide:function(){this.domElement.style.display="none"},show:function(){this.domElement.style.display=""},onResize:function(){var e=this.getRoot();if(e.scrollable){var i=m.getOffset(e.__ul).top,r=0;h.each(e.__ul.childNodes,function(n){e.autoPlace&&n===e.__save_row||(r+=m.getHeight(n))}),window.innerHeight-i-ut<r?(m.addClass(e.domElement,V.CLASS_TOO_TALL),e.__ul.style.height=window.innerHeight-i-ut+"px"):(m.removeClass(e.domElement,V.CLASS_TOO_TALL),e.__ul.style.height="auto")}e.__resize_handle&&h.defer(function(){e.__resize_handle.style.height=e.__ul.offsetHeight+"px"}),e.__closeButton&&(e.__closeButton.style.width=e.width+"px")},onResizeDebounced:h.debounce(function(){this.onResize()},50),remember:function(){if(h.isUndefined(ye)&&(ye=new Gt,ye.domElement.innerHTML=jt),this.parent)throw new Error("You can only call remember on a top level GUI.");var e=this;h.each(Array.prototype.slice.call(arguments),function(i){e.__rememberedObjects.length===0&&Wt(e),e.__rememberedObjects.indexOf(i)===-1&&e.__rememberedObjects.push(i)}),this.autoPlace&&We(this,this.width)},getRoot:function(){for(var e=this;e.parent;)e=e.parent;return e},getSaveObject:function(){var e=this.load;return e.closed=this.closed,this.__rememberedObjects.length>0&&(e.preset=this.preset,e.remembered||(e.remembered={}),e.remembered[this.preset]=Me(this)),e.folders={},h.each(this.__folders,function(i,r){e.folders[r]=i.getSaveObject()}),e},save:function(){this.load.remembered||(this.load.remembered={}),this.load.remembered[this.preset]=Me(this),$e(this,!1),this.saveToLocalStorageIfPossible()},saveAs:function(e){this.load.remembered||(this.load.remembered={},this.load.remembered[Ce]=Me(this,!0)),this.load.remembered[e]=Me(this),this.preset=e,Ye(this,e,!0),this.saveToLocalStorageIfPossible()},revert:function(e){h.each(this.__controllers,function(i){this.getRoot().load.remembered?xt(e||this.getRoot(),i):i.setValue(i.initialValue),i.__onFinishChange&&i.__onFinishChange.call(i,i.getValue())},this),h.each(this.__folders,function(i){i.revert(i)}),e||$e(this.getRoot(),!1)},listen:function(e){var i=this.__listening.length===0;this.__listening.push(e),i&&Lt(this.__listening)},updateDisplay:function(){h.each(this.__controllers,function(e){e.updateDisplay()}),h.each(this.__folders,function(e){e.updateDisplay()})}});function qe(t,e,i){var r=document.createElement("li");return e&&r.appendChild(e),i?t.__ul.insertBefore(r,i):t.__ul.appendChild(r),t.onResize(),r}function dt(t){m.unbind(window,"resize",t.__resizeHandler),t.saveToLocalStorageIfPossible&&m.unbind(window,"unload",t.saveToLocalStorageIfPossible)}function $e(t,e){var i=t.__preset_select[t.__preset_select.selectedIndex];e?i.innerHTML=i.value+"*":i.innerHTML=i.value}function Yt(t,e,i){if(i.__li=e,i.__gui=t,h.extend(i,{options:function(s){if(arguments.length>1){var a=i.__li.nextElementSibling;return i.remove(),Te(t,i.object,i.property,{before:a,factoryArgs:[h.toArray(arguments)]})}if(h.isArray(s)||h.isObject(s)){var u=i.__li.nextElementSibling;return i.remove(),Te(t,i.object,i.property,{before:u,factoryArgs:[s]})}},name:function(s){return i.__li.firstElementChild.firstElementChild.innerHTML=s,i},listen:function(){return i.__gui.listen(i),i},remove:function(){return i.__gui.remove(i),i}}),i instanceof ze){var r=new Se(i.object,i.property,{min:i.__min,max:i.__max,step:i.__step});h.each(["updateDisplay","onChange","onFinishChange","step","min","max"],function(o){var s=i[o],a=r[o];i[o]=r[o]=function(){var u=Array.prototype.slice.call(arguments);return a.apply(r,u),s.apply(i,u)}}),m.addClass(e,"has-slider"),i.domElement.insertBefore(r.domElement,i.domElement.firstElementChild)}else if(i instanceof Se){var n=function(s){if(h.isNumber(i.__min)&&h.isNumber(i.__max)){var a=i.__li.firstElementChild.firstElementChild.innerHTML,u=i.__gui.__listening.indexOf(i)>-1;i.remove();var d=Te(t,i.object,i.property,{before:i.__li.nextElementSibling,factoryArgs:[i.__min,i.__max,i.__step]});return d.name(a),u&&d.listen(),d}return s};i.min=h.compose(n,i.min),i.max=h.compose(n,i.max)}else i instanceof vt?(m.bind(e,"click",function(){m.fakeEvent(i.__checkbox,"click")}),m.bind(i.__checkbox,"click",function(o){o.stopPropagation()})):i instanceof Et?(m.bind(e,"click",function(){m.fakeEvent(i.__button,"click")}),m.bind(e,"mouseover",function(){m.addClass(i.__button,"hover")}),m.bind(e,"mouseout",function(){m.removeClass(i.__button,"hover")})):i instanceof Ge&&(m.addClass(e,"color"),i.updateDisplay=h.compose(function(o){return e.style.borderLeftColor=i.__color.toString(),o},i.updateDisplay),i.updateDisplay());i.setValue=h.compose(function(o){return t.getRoot().__preset_select&&i.isModified()&&$e(t.getRoot(),!0),o},i.setValue)}function xt(t,e){var i=t.getRoot(),r=i.__rememberedObjects.indexOf(e.object);if(r!==-1){var n=i.__rememberedObjectIndecesToControllers[r];if(n===void 0&&(n={},i.__rememberedObjectIndecesToControllers[r]=n),n[e.property]=e,i.load&&i.load.remembered){var o=i.load.remembered,s=void 0;if(o[t.preset])s=o[t.preset];else if(o[Ce])s=o[Ce];else return;if(s[r]&&s[r][e.property]!==void 0){var a=s[r][e.property];e.initialValue=a,e.setValue(a)}}}}function Te(t,e,i,r){if(e[i]===void 0)throw new Error('Object "'+e+'" has no property "'+i+'"');var n=void 0;if(r.color)n=new Ge(e,i);else{var o=[e,i].concat(r.factoryArgs);n=Bt.apply(t,o)}r.before instanceof me&&(r.before=r.before.__li),xt(t,n),m.addClass(n.domElement,"c");var s=document.createElement("span");m.addClass(s,"property-name"),s.innerHTML=n.property;var a=document.createElement("div");a.appendChild(s),a.appendChild(n.domElement);var u=qe(t,a,r.before);return m.addClass(u,V.CLASS_CONTROLLER_ROW),n instanceof Ge?m.addClass(u,"color"):m.addClass(u,Mt(n.getValue())),Yt(t,u,n),t.__controllers.push(n),n}function ve(t,e){return document.location.href+"."+e}function Ye(t,e,i){var r=document.createElement("option");r.innerHTML=e,r.value=e,t.__preset_select.appendChild(r),i&&(t.__preset_select.selectedIndex=t.__preset_select.length-1)}function ct(t,e){e.style.display=t.useLocalStorage?"block":"none"}function Wt(t){var e=t.__save_row=document.createElement("li");m.addClass(t.domElement,"has-save"),t.__ul.insertBefore(e,t.__ul.firstChild),m.addClass(e,"save-row");var i=document.createElement("span");i.innerHTML="&nbsp;",m.addClass(i,"button gears");var r=document.createElement("span");r.innerHTML="Save",m.addClass(r,"button"),m.addClass(r,"save");var n=document.createElement("span");n.innerHTML="New",m.addClass(n,"button"),m.addClass(n,"save-as");var o=document.createElement("span");o.innerHTML="Revert",m.addClass(o,"button"),m.addClass(o,"revert");var s=t.__preset_select=document.createElement("select");if(t.load&&t.load.remembered?h.each(t.load.remembered,function(c,_){Ye(t,_,_===t.preset)}):Ye(t,Ce,!1),m.bind(s,"change",function(){for(var c=0;c<t.__preset_select.length;c++)t.__preset_select[c].innerHTML=t.__preset_select[c].value;t.preset=this.value}),e.appendChild(s),e.appendChild(i),e.appendChild(r),e.appendChild(n),e.appendChild(o),Ae){var a=document.getElementById("dg-local-explain"),u=document.getElementById("dg-local-storage"),d=document.getElementById("dg-save-locally");d.style.display="block",localStorage.getItem(ve(t,"isLocal"))==="true"&&u.setAttribute("checked","checked"),ct(t,a),m.bind(u,"change",function(){t.useLocalStorage=!t.useLocalStorage,ct(t,a)})}var f=document.getElementById("dg-new-constructor");m.bind(f,"keydown",function(c){c.metaKey&&(c.which===67||c.keyCode===67)&&ye.hide()}),m.bind(i,"click",function(){f.innerHTML=JSON.stringify(t.getSaveObject(),void 0,2),ye.show(),f.focus(),f.select()}),m.bind(r,"click",function(){t.save()}),m.bind(n,"click",function(){var c=prompt("Enter a new preset name.");c&&t.saveAs(c)}),m.bind(o,"click",function(){t.revert()})}function Xt(t){var e=void 0;t.__resize_handle=document.createElement("div"),h.extend(t.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"});function i(o){return o.preventDefault(),t.width+=e-o.clientX,t.onResize(),e=o.clientX,!1}function r(){m.removeClass(t.__closeButton,V.CLASS_DRAG),m.unbind(window,"mousemove",i),m.unbind(window,"mouseup",r)}function n(o){return o.preventDefault(),e=o.clientX,m.addClass(t.__closeButton,V.CLASS_DRAG),m.bind(window,"mousemove",i),m.bind(window,"mouseup",r),!1}m.bind(t.__resize_handle,"mousedown",n),m.bind(t.__closeButton,"mousedown",n),t.domElement.insertBefore(t.__resize_handle,t.domElement.firstElementChild)}function We(t,e){t.domElement.style.width=e+"px",t.__save_row&&t.autoPlace&&(t.__save_row.style.width=e+"px"),t.__closeButton&&(t.__closeButton.style.width=e+"px")}function Me(t,e){var i={};return h.each(t.__rememberedObjects,function(r,n){var o={},s=t.__rememberedObjectIndecesToControllers[n];h.each(s,function(a,u){o[u]=e?a.initialValue:a.getValue()}),i[n]=o}),i}function Kt(t){for(var e=0;e<t.__preset_select.length;e++)t.__preset_select[e].value===t.preset&&(t.__preset_select.selectedIndex=e)}function Lt(t){t.length!==0&&zt.call(window,function(){Lt(t)}),h.each(t,function(e){e.updateDisplay()})}var qt=V;const Zt=(t,e)=>{if(e==null)return Array.from({length:t},(r,n)=>n);const i=e-t;return Array.from({length:i},(r,n)=>n+t)},Qt=t=>{const e=document.getElementById(t);return e||(console.error(`There is no canvas with id ${t} on this page.`),null)},Jt=t=>t.getContext("webgl2")||console.error("WebGL2 is not available in your browser."),ei=t=>{const e=()=>{t.width=window.innerWidth,t.height=window.innerHeight};e(),window.addEventListener("resize",e)},Pe=t=>t.map(e=>e/255),ti=t=>t.map(e=>e*255),At=(t,e)=>{const o=[];for(let s=0;s<t.length;s+=3)o[s+0]=0,o[s+1]=0,o[s+2]=0;for(let s=0;s<e.length;s+=3){const a=[],u=[],d=[];a[0]=t[3*e[s+2]+0]-t[3*e[s+1]+0],a[1]=t[3*e[s+2]+1]-t[3*e[s+1]+1],a[2]=t[3*e[s+2]+2]-t[3*e[s+1]+2],u[0]=t[3*e[s]+0]-t[3*e[s+1]+0],u[1]=t[3*e[s]+1]-t[3*e[s+1]+1],u[2]=t[3*e[s]+2]-t[3*e[s+1]+2],d[0]=a[1]*u[2]-a[2]*u[1],d[1]=a[2]*u[0]-a[0]*u[2],d[2]=a[0]*u[1]-a[1]*u[0];for(let f=0;f<3;f++)o[3*e[s+f]+0]=o[3*e[s+f]+0]+d[0],o[3*e[s+f]+1]=o[3*e[s+f]+1]+d[1],o[3*e[s+f]+2]=o[3*e[s+f]+2]+d[2]}for(let s=0;s<t.length;s+=3){const a=[];a[0]=o[s+0],a[1]=o[s+1],a[2]=o[s+2];let u=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);u===0&&(u=1),a[0]=a[0]/u,a[1]=a[1]/u,a[2]=a[2]/u,o[s+0]=a[0],o[s+1]=a[1],o[s+2]=a[2]}return o},Y=(t,e={width:300})=>{const i=e.gui||new qt(e),r={},n=a=>typeof a=="function",o=a=>!n(a)&&typeof a=="object"&&(a.value===null||a.value===void 0),s=a=>typeof a=="string"&&~a.indexOf("#")||Array.isArray(a)&&a.length>=3;return Object.keys(t).forEach(a=>{const u=t[a];if(n(u)){r[a]=u,i.add(r,a);return}if(o(u)){Y(u,{gui:i.addFolder(a)});return}const{value:d,min:f,max:c,step:_,options:p,onChange:v=()=>null}=u;r[a]=d;let b;p?b=i.add(r,a,p):s(d)?b=i.addColor(r,a):b=i.add(r,a,f,c,_),b.onChange(g=>v(g,r))}),()=>{i.destroy()}},ii=`#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;

in vec3 aVertexPosition;
in vec3 aVertexNormal;

out vec3 vNormal;
out vec3 vLightRay;
out vec3 vEyeVector;

void main(void) {
    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vec4 light = uModelViewMatrix * vec4(uLightPosition, 1.0);

    // Set varyings to be used inside of fragment shader
    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vLightRay = vertex.xyz - light.xyz;
    vEyeVector = -vec3(vertex.xyz);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`,ni=`#version 300 es
precision mediump float;

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

out vec4 fragColor;

void main(void) {
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
        // Update diffuse
        Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
        vec3 E = normalize(vEyeVector);
        vec3 R = reflect(L, N);
        float specular = pow( max(dot(R, E), 0.0), uShininess);
        // Update specular
        Is = uLightSpecular * uMaterialSpecular * specular;
    }

    // Final fragment color takes into account ambient, diffuse, and specular
    fragColor = vec4(vec3(Ia + Id + Is), 1.0);
}`;var ri=1e-6,Ee=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});function B(){var t=new Ee(16);return Ee!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function Re(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function ee(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function be(t,e){if(t===e){var i=e[1],r=e[2],n=e[3],o=e[6],s=e[7],a=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=i,t[6]=e[9],t[7]=e[13],t[8]=r,t[9]=o,t[11]=e[14],t[12]=n,t[13]=s,t[14]=a}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t}function se(t,e){var i=e[0],r=e[1],n=e[2],o=e[3],s=e[4],a=e[5],u=e[6],d=e[7],f=e[8],c=e[9],_=e[10],p=e[11],v=e[12],b=e[13],g=e[14],E=e[15],w=i*a-r*s,T=i*u-n*s,R=i*d-o*s,x=r*u-n*a,C=r*d-o*a,M=n*d-o*u,F=f*b-c*v,k=f*g-_*v,N=f*E-p*v,y=c*g-_*b,A=c*E-p*b,P=_*E-p*g,L=w*P-T*A+R*y+x*N-C*k+M*F;return L?(L=1/L,t[0]=(a*P-u*A+d*y)*L,t[1]=(n*A-r*P-o*y)*L,t[2]=(b*M-g*C+E*x)*L,t[3]=(_*C-c*M-p*x)*L,t[4]=(u*N-s*P-d*k)*L,t[5]=(i*P-n*N+o*k)*L,t[6]=(g*R-v*M-E*T)*L,t[7]=(f*M-_*R+p*T)*L,t[8]=(s*A-a*N+d*F)*L,t[9]=(r*N-i*A-o*F)*L,t[10]=(v*C-b*R+E*w)*L,t[11]=(c*R-f*C-p*w)*L,t[12]=(a*k-s*y-u*F)*L,t[13]=(i*y-r*k+n*F)*L,t[14]=(b*T-v*x-g*w)*L,t[15]=(f*x-c*T+_*w)*L,t):null}function S(t,e,i){var r=i[0],n=i[1],o=i[2],s,a,u,d,f,c,_,p,v,b,g,E;return e===t?(t[12]=e[0]*r+e[4]*n+e[8]*o+e[12],t[13]=e[1]*r+e[5]*n+e[9]*o+e[13],t[14]=e[2]*r+e[6]*n+e[10]*o+e[14],t[15]=e[3]*r+e[7]*n+e[11]*o+e[15]):(s=e[0],a=e[1],u=e[2],d=e[3],f=e[4],c=e[5],_=e[6],p=e[7],v=e[8],b=e[9],g=e[10],E=e[11],t[0]=s,t[1]=a,t[2]=u,t[3]=d,t[4]=f,t[5]=c,t[6]=_,t[7]=p,t[8]=v,t[9]=b,t[10]=g,t[11]=E,t[12]=s*r+f*n+v*o+e[12],t[13]=a*r+c*n+b*o+e[13],t[14]=u*r+_*n+g*o+e[14],t[15]=d*r+p*n+E*o+e[15]),t}function oi(t,e,i){var r=i[0],n=i[1],o=i[2];return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*o,t[9]=e[9]*o,t[10]=e[10]*o,t[11]=e[11]*o,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function ft(t,e,i,r){var n=r[0],o=r[1],s=r[2],a=Math.hypot(n,o,s),u,d,f,c,_,p,v,b,g,E,w,T,R,x,C,M,F,k,N,y,A,P,L,j;return a<ri?null:(a=1/a,n*=a,o*=a,s*=a,u=Math.sin(i),d=Math.cos(i),f=1-d,c=e[0],_=e[1],p=e[2],v=e[3],b=e[4],g=e[5],E=e[6],w=e[7],T=e[8],R=e[9],x=e[10],C=e[11],M=n*n*f+d,F=o*n*f+s*u,k=s*n*f-o*u,N=n*o*f-s*u,y=o*o*f+d,A=s*o*f+n*u,P=n*s*f+o*u,L=o*s*f-n*u,j=s*s*f+d,t[0]=c*M+b*F+T*k,t[1]=_*M+g*F+R*k,t[2]=p*M+E*F+x*k,t[3]=v*M+w*F+C*k,t[4]=c*N+b*y+T*A,t[5]=_*N+g*y+R*A,t[6]=p*N+E*y+x*A,t[7]=v*N+w*y+C*A,t[8]=c*P+b*L+T*j,t[9]=_*P+g*L+R*j,t[10]=p*P+E*L+x*j,t[11]=v*P+w*L+C*j,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}function Ne(t,e,i){var r=Math.sin(i),n=Math.cos(i),o=e[4],s=e[5],a=e[6],u=e[7],d=e[8],f=e[9],c=e[10],_=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=o*n+d*r,t[5]=s*n+f*r,t[6]=a*n+c*r,t[7]=u*n+_*r,t[8]=d*n-o*r,t[9]=f*n-s*r,t[10]=c*n-a*r,t[11]=_*n-u*r,t}function Ue(t,e,i){var r=Math.sin(i),n=Math.cos(i),o=e[0],s=e[1],a=e[2],u=e[3],d=e[8],f=e[9],c=e[10],_=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=o*n-d*r,t[1]=s*n-f*r,t[2]=a*n-c*r,t[3]=u*n-_*r,t[8]=o*r+d*n,t[9]=s*r+f*n,t[10]=a*r+c*n,t[11]=u*r+_*n,t}function mt(t,e,i){var r=Math.sin(i),n=Math.cos(i),o=e[0],s=e[1],a=e[2],u=e[3],d=e[4],f=e[5],c=e[6],_=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=o*n+d*r,t[1]=s*n+f*r,t[2]=a*n+c*r,t[3]=u*n+_*r,t[4]=d*n-o*r,t[5]=f*n-s*r,t[6]=c*n-a*r,t[7]=_*n-u*r,t}function ai(t,e,i,r,n){var o=1/Math.tan(e/2),s;return t[0]=o/i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=o,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,n!=null&&n!==1/0?(s=1/(r-n),t[10]=(n+r)*s,t[14]=2*n*r*s):(t[10]=-1,t[14]=-2*r),t}var Fe=ai;function ie(){var t=new Ee(3);return Ee!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function ae(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function si(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function ui(t,e){var i=e[0],r=e[1],n=e[2],o=i*i+r*r+n*n;return o>0&&(o=1/Math.sqrt(o)),t[0]=e[0]*o,t[1]=e[1]*o,t[2]=e[2]*o,t}(function(){var t=ie();return function(e,i,r,n,o,s){var a,u;for(i||(i=3),r||(r=0),n?u=Math.min(n*i+r,e.length):u=e.length,a=r;a<u;a+=i)t[0]=e[a],t[1]=e[a+1],t[2]=e[a+2],o(t,t,s),e[a]=t[0],e[a+1]=t[1],e[a+2]=t[2];return e}})();function we(){var t=new Ee(4);return Ee!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function Oe(t,e,i,r,n){return t[0]=e,t[1]=i,t[2]=r,t[3]=n,t}function De(t,e,i){var r=e[0],n=e[1],o=e[2],s=e[3];return t[0]=i[0]*r+i[4]*n+i[8]*o+i[12]*s,t[1]=i[1]*r+i[5]*n+i[9]*o+i[13]*s,t[2]=i[2]*r+i[6]*n+i[10]*o+i[14]*s,t[3]=i[3]*r+i[7]*n+i[11]*o+i[15]*s,t}(function(){var t=we();return function(e,i,r,n,o,s){var a,u;for(i||(i=4),r||(r=0),n?u=Math.min(n*i+r,e.length):u=e.length,a=r;a<u;a+=i)t[0]=e[a],t[1]=e[a+1],t[2]=e[a+2],t[3]=e[a+3],o(t,t,s),e[a]=t[0],e[a+1]=t[1],e[a+2]=t[2],e[a+3]=t[3];return e}})();const li=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=q(t,ii,ni,["aVertexPosition","aVertexNormal"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uLightSpecular","uMaterialAmbient","uMaterialDiffuse","uMaterialSpecular","uShininess"]),i=(await Promise.all([l(()=>import("./plane.d8c65b5c.js"),[]),l(()=>import("./cone2.8ec56e7a.js"),[]),l(()=>import("./sphere1.ab751454.js"),[]),l(()=>import("./sphere3.7b3e63db.js"),[])])).map((p,v)=>({...p,alias:v===0?"plane":v===1?"cone":v===2?"sphere":"light",vao:ht(t,e,[{name:"aVertexPosition",data:p.vertices,size:3},{name:"aVertexNormal",data:At(p.vertices,p.indices),size:3}],p.indices)})),r=B(),n=B(),o=B();let s=0,a=[4.5,3,15],u=200,d=-100;function f(p){return i.find(v=>v.alias===p)}const c=Y({"Sphere Color":{value:[0,255,0],onChange:p=>f("sphere").diffuse=[...Pe(p),1]},"Cone Color":{value:[235,0,210],onChange:p=>f("cone").diffuse=[...Pe(p),1]},Shininess:{value:u,min:1,max:50,step:.1,onChange:p=>e.setUniform("uShininess","float",p)},...["Translate X","Translate Y","Translate Z"].reduce((p,v,b)=>(p[v]={value:a[b],min:-50,max:50,step:-.1,onChange(g,E){e.setUniform("uLightPosition","vec3",[E["Translate X"],E["Translate Y"],E["Translate Z"]])}},p),{}),Distance:{value:d,min:-200,max:-50,step:.1,onChange:p=>d=p}});e.use(),e.setUniform("uLightPosition","vec3",a),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uMaterialAmbient","vec4",[.1,.1,.1,1]),e.setUniform("uMaterialDiffuse","vec4",[.5,.8,.1,1]),e.setUniform("uMaterialSpecular","vec4",[.6,.6,.6,1]),e.setUniform("uShininess","float",u);let _=!1;return function p(){if(!_){requestAnimationFrame(p),t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),Fe(r,45,t.canvas.width/t.canvas.height,.1,1e3);try{i.forEach(v=>{if(ee(n),S(n,n,[0,0,d]),ft(n,n,30*Math.PI/180,[1,0,0]),ft(n,n,s*Math.PI/180,[0,1,0]),v.alias==="light"){const b=e.getUniform("uLightPosition");S(n,n,b)}Re(o,n),se(o,o),be(o,o),e.setUniform("uModelViewMatrix","mat4",n),e.setUniform("uProjectionMatrix","mat4",r),e.setUniform("uNormalMatrix","mat4",o),e.setUniform("uMaterialAmbient","vec4",v.ambient),e.setUniform("uMaterialDiffuse","vec4",v.diffuse),e.setUniform("uMaterialSpecular","vec4",v.specular),H(t,v.vao,"TRIANGLES")})}catch(v){console.error(v)}}}(),()=>{_=!0,c(),e.dispose(),i.forEach(p=>{p.vao.dispose()})}},di=`#version 300 es
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
}`,ci=`#version 300 es
precision mediump float;

in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    fragColor = vFinalColor;
}`;class te{constructor(e,i){this.gl=e,this.program=i,this.objects=[]}start(e){let i=!0,r;const n=()=>{r=requestAnimationFrame(u=>{!i||(e(this.objects,u),n())})},o=()=>{i=!1,r!=null&&cancelAnimationFrame(r)};n();const s=()=>{i=!0,n(),console.info("Clock resumed")},a=()=>{o(),console.info("Clock stopped")};return window.addEventListener("focus",s),window.addEventListener("blur",a),this.stop=()=>{window.removeEventListener("focus",s),window.removeEventListener("blur",a),o()}}get(e){return this.objects.find(i=>i.alias===e)}add(e,i){var g,E,w,T,R,x,C,M,F,k,N,y,A,P,L;const{gl:r,program:n}=this,o=(g=e.vertices)!=null?g:[],s=(E=e.indices)!=null?E:[],a=(w=e.scalars)!=null?w:[],u=(T=e.textureCoords)!=null?T:[],d=(R=e.diffuse)!=null?R:[1,1,1,1],f=(x=e.ambient)!=null?x:[.2,.2,.2,1],c=(C=e.specular)!=null?C:[1,1,1,1],_=(M=e.specularExponent)!=null?M:0,p=(F=e.d)!=null?F:1,v=[];"aVertexPosition"in n.attributes&&o.length&&v.push({name:"aVertexPosition",data:o,size:3}),"aVertexNormal"in n.attributes&&o.length&&s.length&&v.push({name:"aVertexNormal",data:At(o,s),size:3}),"aVertexColor"in n.attributes&&a.length&&v.push({name:"aVertexColor",data:a,size:4}),"aVertexTextureCoords"in n.attributes&&u.length&&v.push({name:"aVertexTextureCoords",data:u,size:2});const b={alias:(k=e.alias)!=null?k:i,vertices:o,indices:s,scalars:a,textureCoords:u,wireframe:(N=e.wireframe)!=null?N:!1,diffuse:d,Kd:(y=e.Kd)!=null?y:d.slice(0,3),ambient:f,Ka:e.Ka||f.slice(0,3),specular:c,Ks:e.Ks||c.slice(0,3),specularExponent:_,Ns:(A=e.Ns)!=null?A:_,d:p,transparency:(P=e.transparency)!=null?P:p,illum:(L=e.illum)!=null?L:1,vao:ht(r,n,v,s)};this.objects.push(b)}traverse(e){for(let i=0;i<this.objects.length&&e(this.objects[i],i)===void 0;i++);}renderFirst(e){const i=this.get(e),r=this.objects.indexOf(i);r!==0&&(this.objects.splice(r,1),this.objects.splice(0,0,i),this.printRenderOrder())}renderLast(e){const i=this.get(e),r=this.objects.indexOf(i);r!==0&&(this.objects.splice(r,1),this.objects.push(i),this.printRenderOrder())}renderSooner(e){const i=this.get(e),r=this.objects.indexOf(i);r!==0&&(this.objects.splice(r,1),this.objects.splice(r-1,0,i),this.printRenderOrder())}printRenderOrder(){const e=this.objects.map(i=>i.alias).join(" > ");console.info("Render Order:",e)}dispose(){var e;(e=this.stop)==null||e.call(this),this.program.dispose(),this.objects.forEach(i=>{i.vao.dispose()})}}class ce{constructor(e=50,i=5){this.alias="floor",this.dimension=e,this.lines=i,this.vertices=[],this.indices=[],this.wireframe=!0,this.visible=!0,this.build(this.dimension,this.lines)}build(e,i){e&&(this.dimension=e),i&&(this.lines=2*this.dimension/i);const r=2*this.dimension/this.lines,n=[],o=[];for(let s=0;s<=this.lines;s++)n[6*s]=-this.dimension,n[6*s+1]=0,n[6*s+2]=-this.dimension+s*r,n[6*s+3]=this.dimension,n[6*s+4]=0,n[6*s+5]=-this.dimension+s*r,n[6*(this.lines+1)+6*s]=-this.dimension+s*r,n[6*(this.lines+1)+6*s+1]=0,n[6*(this.lines+1)+6*s+2]=-this.dimension,n[6*(this.lines+1)+6*s+3]=-this.dimension+s*r,n[6*(this.lines+1)+6*s+4]=0,n[6*(this.lines+1)+6*s+5]=this.dimension,o[2*s]=2*s,o[2*s+1]=2*s+1,o[2*(this.lines+1)+2*s]=2*(this.lines+1)+2*s,o[2*(this.lines+1)+2*s+1]=2*(this.lines+1)+2*s+1;this.vertices=n,this.indices=o}}class ke{constructor(e=10){this.alias="axis",this.wireframe=!0,this.indices=[0,1,2,3,4,5],this.vertices=fi(e)}}const fi=t=>(t&&(t=t),[-t,0,0,t,0,0,0,-t/2,0,0,t/2,0,0,0,-t,0,0,t]),mi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e="World Coordinates",i="Camera Coordinates";let r=e;const n=[0,-2,-50];let o=[0,-2,-50],s=[0,0,0];const a=B(),u=B(),d=B(),f=B(),c=q(t,di,ci,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialDiffuse","uWireframe"]),_=new te(t,c);_.add(await l(()=>import("./cone3.edde918c.js"),[]),"cone"),_.add(new ce),_.add(new ke),c.use(),c.setUniform("uLightPosition","vec3",[0,120,120]),c.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),c.setUniform("uLightDiffuse","vec4",[1,1,1,1]),ee(d),S(d,d,n),ee(a),se(d,a),ee(u),ee(f),Re(f,d),se(f,f),be(f,f);function p(){Fe(u,45,t.canvas.width/t.canvas.height,.1,1e3),r===e?(ee(d),S(d,d,o),Ne(d,d,s[0]*Math.PI/180),Ue(d,d,s[1]*Math.PI/180),mt(d,d,s[2]*Math.PI/180)):(ee(a),S(a,a,o),Ne(a,a,s[0]*Math.PI/180),Ue(a,a,s[1]*Math.PI/180),mt(a,a,s[2]*Math.PI/180))}function v(){r===e?(se(a,d),c.setUniform("uModelViewMatrix","mat4",d)):se(d,a),c.setUniform("uProjectionMatrix","mat4",u),c.setUniform("uModelViewMatrix","mat4",d),be(f,a),c.setUniform("uNormalMatrix","mat4",f)}const b=Y({Coordinates:{value:r,options:[e,i],onChange:g=>{r=g,ae(n,o),s=[0,0,0],r===i&&si(o,o)}},Position:{...["Translate X","Translate Y","Translate Z"].reduce((g,E,w)=>(g[E]={value:o[w],min:-100,max:100,step:-.1,onChange(T,R){o=[R["Translate X"],R["Translate Y"],R["Translate Z"]]}},g),{})},Rotation:{...["Rotate X","Rotate Y","Rotate Z"].reduce((g,E,w)=>(g[E]={value:s[w],min:-180,max:180,step:.1,onChange(T,R){s=[R["Rotate X"],R["Rotate Y"],R["Rotate Z"]]}},g),{})}});return _.start(g=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);try{p(),v(),g.forEach(E=>{c.setUniform("uMaterialDiffuse","vec4",E.diffuse),c.setUniform("uWireframe","bool",E.wireframe),H(t,E.vao,E.wireframe?"LINES":"TRIANGLES")})}catch(E){console.error(E)}}),()=>{_.dispose(),b()}},_i=(t,e)=>{const i=t[e];return i?typeof i=="function"?i():Promise.resolve(i):new Promise((r,n)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(n.bind(null,new Error("Unknown variable dynamic import: "+e)))})},hi=`#version 300 es
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
}`,pi=`#version 300 es
precision mediump float;

in vec4 vFinalColor;

out vec4 fragColor;

void main(void) {
    fragColor = vFinalColor;
}`;class ne{constructor(e="ORBITING_TYPE"){this.type=e,this.position=ie(),this.focus=ie(),this.home=ie(),this.up=ie(),this.right=ie(),this.normal=ie(),this.matrix=B(),this.steps=0,this.azimuth=0,this.elevation=0,this.fov=45,this.minZ=.1,this.maxZ=1e4}get isOrbiting(){return this.type==="ORBITING_TYPE"}get isTracking(){return this.type==="TRACKING_TYPE"}goHome(e){e&&(this.home=e),this.setPosition(this.home),this.setAzimuth(0),this.setElevation(0)}dolly(e){const i=ie(),r=ie();ui(i,this.normal);const n=e-this.steps;this.isTracking?(r[0]=this.position[0]-n*i[0],r[1]=this.position[1]-n*i[1],r[2]=this.position[2]-n*i[2]):(r[0]=this.position[0],r[1]=this.position[1],r[2]=this.position[2]-n),this.steps=e,this.setPosition(r)}setPosition(e){ae(this.position,e),this.update()}changeZoom(e){ae(this.position,[this.position[0],this.position[1],this.position[2]+e]),this.update()}setFocus(e){ae(this.focus,e),this.update()}setAzimuth(e){this.changeAzimuth(e-this.azimuth)}changeAzimuth(e){this.azimuth+=e,(this.azimuth>360||this.azimuth<-360)&&(this.azimuth=this.azimuth%360),this.update()}setElevation(e){this.changeElevation(e-this.elevation)}changeElevation(e){this.elevation+=e,(this.elevation>360||this.elevation<-360)&&(this.elevation=this.elevation%360),this.update()}calculateOrientation(){const e=we();Oe(e,1,0,0,0),De(e,e,this.matrix),ae(this.right,e);const i=we();Oe(i,0,1,0,0),De(i,i,this.matrix),ae(this.up,i);const r=we();Oe(r,0,0,1,0),De(r,r,this.matrix),ae(this.normal,r)}update(){if(ee(this.matrix),this.isTracking?(S(this.matrix,this.matrix,this.position),Ue(this.matrix,this.matrix,this.azimuth*Math.PI/180),Ne(this.matrix,this.matrix,this.elevation*Math.PI/180)):(Ue(this.matrix,this.matrix,this.azimuth*Math.PI/180),Ne(this.matrix,this.matrix,this.elevation*Math.PI/180),S(this.matrix,this.matrix,this.position)),this.isTracking){const e=we();Oe(e,0,0,0,1),De(e,e,this.matrix),ae(this.position,e)}this.calculateOrientation()}getViewTransform(){const e=B();return se(e,this.matrix),e}}class re{constructor(e,i){this.dragging=!1,this.ctrl=!1,this.alt=!1,this.x=0,this.y=0,this.lastX=0,this.lastY=0,this.button=0,this.dloc=0,this.dstep=0,this.motionFactor=10,this.keyIncrement=5,this.camera=e,this.canvas=i,i.onmousedown=r=>this.onMouseDown(r),i.onmouseup=r=>this.onMouseUp(r),i.onmousemove=r=>this.onMouseMove(r),window.onkeydown=r=>this.onKeyDown(r),window.onkeyup=r=>this.onKeyUp(r),window.onwheel=r=>this.onWheel(r)}get2DCoords(e){let i=0,r=0,n=this.canvas;for(;n&&n.tagName!=="BODY";)i+=n.offsetTop,r+=n.offsetLeft,n=n.offsetParent;return r+=window.pageXOffset,i-=window.pageYOffset,{x:e.clientX-r,y:this.canvas.height-(e.clientY-i)}}onMouseUp(e){this.dragging=!1}onMouseDown(e){this.dragging=!0,this.x=e.clientX,this.y=e.clientY,this.button=e.button,this.dstep=Math.max(this.camera.position[0],this.camera.position[1],this.camera.position[2])/100}onMouseMove(e){if(this.lastX=this.x,this.lastY=this.y,this.x=e.clientX,this.y=e.clientY,!this.dragging)return;this.ctrl=e.ctrlKey,this.alt=e.altKey;const i=this.x-this.lastX,r=this.y-this.lastY;this.button||(this.alt?this.dolly(r):this.rotate(i,r))}onKeyDown(e){if(this.ctrl=e.ctrlKey,!this.ctrl)switch(e.key){case"ArrowLeft":return this.camera.changeAzimuth(-this.keyIncrement);case"ArrowUp":return this.camera.changeElevation(this.keyIncrement);case"ArrowRight":return this.camera.changeAzimuth(this.keyIncrement);case"ArrowDown":return this.camera.changeElevation(-this.keyIncrement)}}onKeyUp(e){this.ctrl=e.ctrlKey}onWheel(e){this.camera.changeZoom(e.deltaY)}dolly(e){e>0?this.dloc+=this.dstep:this.dloc-=this.dstep,this.camera.dolly(this.dloc)}rotate(e,i){const{width:r,height:n}=this.canvas,o=-20/r,s=-20/n,a=e*o*this.motionFactor,u=i*s*this.motionFactor;this.camera.changeAzimuth(a),this.camera.changeElevation(u)}}const vi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=B(),i=B();let r=!1;const n=q(t,hi,pi,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialDiffuse","uWireframe","uFixedLight"]),o=new te(t,n);(await Promise.all(Zt(1,179).map(c=>_i(Object.assign({"../models/nissan-gtr/part1.json":()=>l(()=>import("./part1.53bda621.js"),[]),"../models/nissan-gtr/part10.json":()=>l(()=>import("./part10.e5991015.js"),[]),"../models/nissan-gtr/part100.json":()=>l(()=>import("./part100.587a087c.js"),[]),"../models/nissan-gtr/part101.json":()=>l(()=>import("./part101.831f027d.js"),[]),"../models/nissan-gtr/part102.json":()=>l(()=>import("./part102.645c525f.js"),[]),"../models/nissan-gtr/part103.json":()=>l(()=>import("./part103.40c8ab4f.js"),[]),"../models/nissan-gtr/part104.json":()=>l(()=>import("./part104.11d5674e.js"),[]),"../models/nissan-gtr/part105.json":()=>l(()=>import("./part105.dead6148.js"),[]),"../models/nissan-gtr/part106.json":()=>l(()=>import("./part106.e98121ed.js"),[]),"../models/nissan-gtr/part107.json":()=>l(()=>import("./part107.81aaeaa8.js"),[]),"../models/nissan-gtr/part108.json":()=>l(()=>import("./part108.868935c0.js"),[]),"../models/nissan-gtr/part109.json":()=>l(()=>import("./part109.3046e381.js"),[]),"../models/nissan-gtr/part11.json":()=>l(()=>import("./part11.da1bece0.js"),[]),"../models/nissan-gtr/part110.json":()=>l(()=>import("./part110.4ddd108d.js"),[]),"../models/nissan-gtr/part111.json":()=>l(()=>import("./part111.7de6c499.js"),[]),"../models/nissan-gtr/part112.json":()=>l(()=>import("./part112.e1c2b782.js"),[]),"../models/nissan-gtr/part113.json":()=>l(()=>import("./part113.a8d3d3cf.js"),[]),"../models/nissan-gtr/part114.json":()=>l(()=>import("./part114.7f73d2ac.js"),[]),"../models/nissan-gtr/part115.json":()=>l(()=>import("./part115.5d7a98e9.js"),[]),"../models/nissan-gtr/part116.json":()=>l(()=>import("./part116.a2d4dfbb.js"),[]),"../models/nissan-gtr/part117.json":()=>l(()=>import("./part117.d6cc1b87.js"),[]),"../models/nissan-gtr/part118.json":()=>l(()=>import("./part118.ae360775.js"),[]),"../models/nissan-gtr/part119.json":()=>l(()=>import("./part119.96103710.js"),[]),"../models/nissan-gtr/part12.json":()=>l(()=>import("./part12.7b167049.js"),[]),"../models/nissan-gtr/part120.json":()=>l(()=>import("./part120.df636e9b.js"),[]),"../models/nissan-gtr/part121.json":()=>l(()=>import("./part121.4eebfbb9.js"),[]),"../models/nissan-gtr/part122.json":()=>l(()=>import("./part122.f48534e2.js"),[]),"../models/nissan-gtr/part123.json":()=>l(()=>import("./part123.241b793b.js"),[]),"../models/nissan-gtr/part124.json":()=>l(()=>import("./part124.55cd3e15.js"),[]),"../models/nissan-gtr/part125.json":()=>l(()=>import("./part125.233624a8.js"),[]),"../models/nissan-gtr/part126.json":()=>l(()=>import("./part126.0b9d65af.js"),[]),"../models/nissan-gtr/part127.json":()=>l(()=>import("./part127.bf8b9a7d.js"),[]),"../models/nissan-gtr/part128.json":()=>l(()=>import("./part128.82ee1c0f.js"),[]),"../models/nissan-gtr/part129.json":()=>l(()=>import("./part129.71ad7f2a.js"),[]),"../models/nissan-gtr/part13.json":()=>l(()=>import("./part13.99bd62c0.js"),[]),"../models/nissan-gtr/part130.json":()=>l(()=>import("./part130.33a9ca1d.js"),[]),"../models/nissan-gtr/part131.json":()=>l(()=>import("./part131.7614ca4d.js"),[]),"../models/nissan-gtr/part132.json":()=>l(()=>import("./part132.8681a137.js"),[]),"../models/nissan-gtr/part133.json":()=>l(()=>import("./part133.ef9c488f.js"),[]),"../models/nissan-gtr/part134.json":()=>l(()=>import("./part134.8a795e4b.js"),[]),"../models/nissan-gtr/part135.json":()=>l(()=>import("./part135.5c4355ab.js"),[]),"../models/nissan-gtr/part136.json":()=>l(()=>import("./part136.f9df4731.js"),[]),"../models/nissan-gtr/part137.json":()=>l(()=>import("./part137.cab02e8a.js"),[]),"../models/nissan-gtr/part138.json":()=>l(()=>import("./part138.3353891b.js"),[]),"../models/nissan-gtr/part139.json":()=>l(()=>import("./part139.a6e14144.js"),[]),"../models/nissan-gtr/part14.json":()=>l(()=>import("./part14.dd21dc41.js"),[]),"../models/nissan-gtr/part140.json":()=>l(()=>import("./part140.37100e87.js"),[]),"../models/nissan-gtr/part141.json":()=>l(()=>import("./part141.ec36c45a.js"),[]),"../models/nissan-gtr/part142.json":()=>l(()=>import("./part142.31be5e85.js"),[]),"../models/nissan-gtr/part143.json":()=>l(()=>import("./part143.df1ca4ce.js"),[]),"../models/nissan-gtr/part144.json":()=>l(()=>import("./part144.f5158e01.js"),[]),"../models/nissan-gtr/part145.json":()=>l(()=>import("./part145.552d355b.js"),[]),"../models/nissan-gtr/part146.json":()=>l(()=>import("./part146.931168cf.js"),[]),"../models/nissan-gtr/part147.json":()=>l(()=>import("./part147.6cf95fc3.js"),[]),"../models/nissan-gtr/part148.json":()=>l(()=>import("./part148.05ed3c42.js"),[]),"../models/nissan-gtr/part149.json":()=>l(()=>import("./part149.94deca90.js"),[]),"../models/nissan-gtr/part15.json":()=>l(()=>import("./part15.8d1823f9.js"),[]),"../models/nissan-gtr/part150.json":()=>l(()=>import("./part150.a4b3c419.js"),[]),"../models/nissan-gtr/part151.json":()=>l(()=>import("./part151.31692d13.js"),[]),"../models/nissan-gtr/part152.json":()=>l(()=>import("./part152.d2b128bf.js"),[]),"../models/nissan-gtr/part153.json":()=>l(()=>import("./part153.f2c80905.js"),[]),"../models/nissan-gtr/part154.json":()=>l(()=>import("./part154.bd794f0b.js"),[]),"../models/nissan-gtr/part155.json":()=>l(()=>import("./part155.7de82738.js"),[]),"../models/nissan-gtr/part156.json":()=>l(()=>import("./part156.12fc9d3c.js"),[]),"../models/nissan-gtr/part157.json":()=>l(()=>import("./part157.74648b79.js"),[]),"../models/nissan-gtr/part158.json":()=>l(()=>import("./part158.d87b59ea.js"),[]),"../models/nissan-gtr/part159.json":()=>l(()=>import("./part159.cf39214e.js"),[]),"../models/nissan-gtr/part16.json":()=>l(()=>import("./part16.53f939f5.js"),[]),"../models/nissan-gtr/part160.json":()=>l(()=>import("./part160.fc0f72d6.js"),[]),"../models/nissan-gtr/part161.json":()=>l(()=>import("./part161.dcb17061.js"),[]),"../models/nissan-gtr/part162.json":()=>l(()=>import("./part162.870f2d7a.js"),[]),"../models/nissan-gtr/part163.json":()=>l(()=>import("./part163.03369298.js"),[]),"../models/nissan-gtr/part164.json":()=>l(()=>import("./part164.f0f5b26e.js"),[]),"../models/nissan-gtr/part165.json":()=>l(()=>import("./part165.75c785ef.js"),[]),"../models/nissan-gtr/part166.json":()=>l(()=>import("./part166.648b642c.js"),[]),"../models/nissan-gtr/part167.json":()=>l(()=>import("./part167.44c27a41.js"),[]),"../models/nissan-gtr/part168.json":()=>l(()=>import("./part168.37a658f8.js"),[]),"../models/nissan-gtr/part169.json":()=>l(()=>import("./part169.129e0c85.js"),[]),"../models/nissan-gtr/part17.json":()=>l(()=>import("./part17.25131d66.js"),[]),"../models/nissan-gtr/part170.json":()=>l(()=>import("./part170.e87feb9b.js"),[]),"../models/nissan-gtr/part171.json":()=>l(()=>import("./part171.f9785e70.js"),[]),"../models/nissan-gtr/part172.json":()=>l(()=>import("./part172.32a02565.js"),[]),"../models/nissan-gtr/part173.json":()=>l(()=>import("./part173.39e6db78.js"),[]),"../models/nissan-gtr/part174.json":()=>l(()=>import("./part174.0a9bd144.js"),[]),"../models/nissan-gtr/part175.json":()=>l(()=>import("./part175.072da7ae.js"),[]),"../models/nissan-gtr/part176.json":()=>l(()=>import("./part176.23169a6a.js"),[]),"../models/nissan-gtr/part177.json":()=>l(()=>import("./part177.a62032c2.js"),[]),"../models/nissan-gtr/part178.json":()=>l(()=>import("./part178.6783af6a.js"),[]),"../models/nissan-gtr/part18.json":()=>l(()=>import("./part18.da3d20e8.js"),[]),"../models/nissan-gtr/part19.json":()=>l(()=>import("./part19.0ab98256.js"),[]),"../models/nissan-gtr/part2.json":()=>l(()=>import("./part2.f15fa7fa.js"),[]),"../models/nissan-gtr/part20.json":()=>l(()=>import("./part20.98d33dec.js"),[]),"../models/nissan-gtr/part21.json":()=>l(()=>import("./part21.02dbd122.js"),[]),"../models/nissan-gtr/part22.json":()=>l(()=>import("./part22.c1141867.js"),[]),"../models/nissan-gtr/part23.json":()=>l(()=>import("./part23.d398e202.js"),[]),"../models/nissan-gtr/part24.json":()=>l(()=>import("./part24.d7dadfa9.js"),[]),"../models/nissan-gtr/part25.json":()=>l(()=>import("./part25.32ba0c37.js"),[]),"../models/nissan-gtr/part26.json":()=>l(()=>import("./part26.dee4d81a.js"),[]),"../models/nissan-gtr/part27.json":()=>l(()=>import("./part27.d7cce42f.js"),[]),"../models/nissan-gtr/part28.json":()=>l(()=>import("./part28.cb7c8ee5.js"),[]),"../models/nissan-gtr/part29.json":()=>l(()=>import("./part29.5eae8ff0.js"),[]),"../models/nissan-gtr/part3.json":()=>l(()=>import("./part3.e1e28cee.js"),[]),"../models/nissan-gtr/part30.json":()=>l(()=>import("./part30.b70a0b07.js"),[]),"../models/nissan-gtr/part31.json":()=>l(()=>import("./part31.6b1e34f6.js"),[]),"../models/nissan-gtr/part32.json":()=>l(()=>import("./part32.189c97e1.js"),[]),"../models/nissan-gtr/part33.json":()=>l(()=>import("./part33.afaec1c5.js"),[]),"../models/nissan-gtr/part34.json":()=>l(()=>import("./part34.3d989bb7.js"),[]),"../models/nissan-gtr/part35.json":()=>l(()=>import("./part35.5b096132.js"),[]),"../models/nissan-gtr/part36.json":()=>l(()=>import("./part36.1abb0c3f.js"),[]),"../models/nissan-gtr/part37.json":()=>l(()=>import("./part37.4497ec6b.js"),[]),"../models/nissan-gtr/part38.json":()=>l(()=>import("./part38.386d7d08.js"),[]),"../models/nissan-gtr/part39.json":()=>l(()=>import("./part39.263c53af.js"),[]),"../models/nissan-gtr/part4.json":()=>l(()=>import("./part4.332c3f7a.js"),[]),"../models/nissan-gtr/part40.json":()=>l(()=>import("./part40.7b96c6d1.js"),[]),"../models/nissan-gtr/part41.json":()=>l(()=>import("./part41.bce6ea08.js"),[]),"../models/nissan-gtr/part42.json":()=>l(()=>import("./part42.e9385a1f.js"),[]),"../models/nissan-gtr/part43.json":()=>l(()=>import("./part43.b40db76a.js"),[]),"../models/nissan-gtr/part44.json":()=>l(()=>import("./part44.0445505b.js"),[]),"../models/nissan-gtr/part45.json":()=>l(()=>import("./part45.2f1b2176.js"),[]),"../models/nissan-gtr/part46.json":()=>l(()=>import("./part46.adfcc16b.js"),[]),"../models/nissan-gtr/part47.json":()=>l(()=>import("./part47.928d0d5a.js"),[]),"../models/nissan-gtr/part48.json":()=>l(()=>import("./part48.9f073918.js"),[]),"../models/nissan-gtr/part49.json":()=>l(()=>import("./part49.d54ddeb5.js"),[]),"../models/nissan-gtr/part5.json":()=>l(()=>import("./part5.f7f9c75f.js"),[]),"../models/nissan-gtr/part50.json":()=>l(()=>import("./part50.3799e52c.js"),[]),"../models/nissan-gtr/part51.json":()=>l(()=>import("./part51.c1c2ff9d.js"),[]),"../models/nissan-gtr/part52.json":()=>l(()=>import("./part52.cd10c29e.js"),[]),"../models/nissan-gtr/part53.json":()=>l(()=>import("./part53.5be987d9.js"),[]),"../models/nissan-gtr/part54.json":()=>l(()=>import("./part54.c3b8a430.js"),[]),"../models/nissan-gtr/part55.json":()=>l(()=>import("./part55.f5209e8d.js"),[]),"../models/nissan-gtr/part56.json":()=>l(()=>import("./part56.3de3de87.js"),[]),"../models/nissan-gtr/part57.json":()=>l(()=>import("./part57.0e8a6ccd.js"),[]),"../models/nissan-gtr/part58.json":()=>l(()=>import("./part58.f605581e.js"),[]),"../models/nissan-gtr/part59.json":()=>l(()=>import("./part59.fb41fbcb.js"),[]),"../models/nissan-gtr/part6.json":()=>l(()=>import("./part6.ca147581.js"),[]),"../models/nissan-gtr/part60.json":()=>l(()=>import("./part60.34dab9e7.js"),[]),"../models/nissan-gtr/part61.json":()=>l(()=>import("./part61.754b93ce.js"),[]),"../models/nissan-gtr/part62.json":()=>l(()=>import("./part62.4eb25ed1.js"),[]),"../models/nissan-gtr/part63.json":()=>l(()=>import("./part63.00dd2c7b.js"),[]),"../models/nissan-gtr/part64.json":()=>l(()=>import("./part64.154efc09.js"),[]),"../models/nissan-gtr/part65.json":()=>l(()=>import("./part65.b1454ed0.js"),[]),"../models/nissan-gtr/part66.json":()=>l(()=>import("./part66.755290dc.js"),[]),"../models/nissan-gtr/part67.json":()=>l(()=>import("./part67.7c9c8bdc.js"),[]),"../models/nissan-gtr/part68.json":()=>l(()=>import("./part68.e196c31b.js"),[]),"../models/nissan-gtr/part69.json":()=>l(()=>import("./part69.97f64a09.js"),[]),"../models/nissan-gtr/part7.json":()=>l(()=>import("./part7.0b7d9cc4.js"),[]),"../models/nissan-gtr/part70.json":()=>l(()=>import("./part70.e47af862.js"),[]),"../models/nissan-gtr/part71.json":()=>l(()=>import("./part71.3e24917e.js"),[]),"../models/nissan-gtr/part72.json":()=>l(()=>import("./part72.6e4b14fa.js"),[]),"../models/nissan-gtr/part73.json":()=>l(()=>import("./part73.953127c3.js"),[]),"../models/nissan-gtr/part74.json":()=>l(()=>import("./part74.2891097d.js"),[]),"../models/nissan-gtr/part75.json":()=>l(()=>import("./part75.2d98b527.js"),[]),"../models/nissan-gtr/part76.json":()=>l(()=>import("./part76.19793342.js"),[]),"../models/nissan-gtr/part77.json":()=>l(()=>import("./part77.0c00c819.js"),[]),"../models/nissan-gtr/part78.json":()=>l(()=>import("./part78.329ea706.js"),[]),"../models/nissan-gtr/part79.json":()=>l(()=>import("./part79.392d97cc.js"),[]),"../models/nissan-gtr/part8.json":()=>l(()=>import("./part8.c468f14b.js"),[]),"../models/nissan-gtr/part80.json":()=>l(()=>import("./part80.e5686ea6.js"),[]),"../models/nissan-gtr/part81.json":()=>l(()=>import("./part81.7bf5989b.js"),[]),"../models/nissan-gtr/part82.json":()=>l(()=>import("./part82.666449ab.js"),[]),"../models/nissan-gtr/part83.json":()=>l(()=>import("./part83.6fd06533.js"),[]),"../models/nissan-gtr/part84.json":()=>l(()=>import("./part84.6f2b8636.js"),[]),"../models/nissan-gtr/part85.json":()=>l(()=>import("./part85.44cf28a9.js"),[]),"../models/nissan-gtr/part86.json":()=>l(()=>import("./part86.ddc5e952.js"),[]),"../models/nissan-gtr/part87.json":()=>l(()=>import("./part87.46369523.js"),[]),"../models/nissan-gtr/part88.json":()=>l(()=>import("./part88.180c0276.js"),[]),"../models/nissan-gtr/part89.json":()=>l(()=>import("./part89.105e4d75.js"),[]),"../models/nissan-gtr/part9.json":()=>l(()=>import("./part9.e384502b.js"),[]),"../models/nissan-gtr/part90.json":()=>l(()=>import("./part90.5d01c4ba.js"),[]),"../models/nissan-gtr/part91.json":()=>l(()=>import("./part91.b7f6b08a.js"),[]),"../models/nissan-gtr/part92.json":()=>l(()=>import("./part92.edcac7db.js"),[]),"../models/nissan-gtr/part93.json":()=>l(()=>import("./part93.a9d9eebc.js"),[]),"../models/nissan-gtr/part94.json":()=>l(()=>import("./part94.2c188b71.js"),[]),"../models/nissan-gtr/part95.json":()=>l(()=>import("./part95.232adbea.js"),[]),"../models/nissan-gtr/part96.json":()=>l(()=>import("./part96.7b788427.js"),[]),"../models/nissan-gtr/part97.json":()=>l(()=>import("./part97.2c2abe8c.js"),[]),"../models/nissan-gtr/part98.json":()=>l(()=>import("./part98.c1d1eac7.js"),[]),"../models/nissan-gtr/part99.json":()=>l(()=>import("./part99.2ee9b736.js"),[])}),`../models/nissan-gtr/part${c}.json`)))).forEach(c=>{o.add(c)}),o.add(new ce(2e3,100)),o.add(new ke(2e3));const a=new ne("ORBITING_TYPE");a.goHome([0,25,300]),new re(a,t.canvas),n.use(),n.setUniform("uLightPosition","vec3",[100,100,100]),n.setUniform("uLightAmbient","vec4",[.1,.1,.1,1]),n.setUniform("uLightDiffuse","vec4",[.7,.7,.7,1]),n.setUniform("uFixedLight","bool",r),ee(e),u(),ee(i),Re(i,a.getViewTransform()),se(i,i),be(i,i);function u(){Fe(e,45,t.canvas.width/t.canvas.height,.1,5e3)}function d(){n.setUniform("uModelViewMatrix","mat4",a.getViewTransform()),n.setUniform("uProjectionMatrix","mat4",e),be(i,a.matrix),n.setUniform("uNormalMatrix","mat4",i)}const f=Y({"Camera Type":{value:a.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:c=>{a.goHome(),a.type=c}},Dolly:{value:0,min:-100,max:100,step:.1,onChange:c=>a.dolly(c)},Position:{...["X","Y","Z"].reduce((c,_,p)=>(c[_]={value:a.position[p],min:-100,max:300,step:.1,onChange:(v,b)=>{a.setPosition([b.X,b.Y,b.Z])}},c),{})},Rotation:{Elevation:{value:a.elevation,min:-180,max:180,step:.1,onChange:c=>a.setElevation(c)},Azimuth:{value:a.azimuth,min:-180,max:180,step:.1,onChange:c=>a.setAzimuth(c)}},"Static Light Position":{value:r,onChange:c=>n.setUniform("uFixedLight","bool",c)},"Go Home":()=>a.goHome()});return o.start(c=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);try{u(),d(),c.forEach(_=>{n.setUniform("uMaterialDiffuse","vec4",_.diffuse),n.setUniform("uWireframe","bool",_.wireframe),H(t,_.vao,_.wireframe?"LINES":"TRIANGLES")})}catch(_){console.error(_)}}),()=>{o.dispose(),f()}},gi=`#version 300 es
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
}`,Ei=`#version 300 es
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
}`;class fe{constructor(e,i,r){this.stack=[],this.program=e,this.camera=i,this.canvas=r,this.modelViewMatrix=B(),this.projectionMatrix=B(),this.normalMatrix=B(),this.calculateModelView(),this.updatePerspective(),this.calculateNormal()}calculateModelView(){this.modelViewMatrix=this.camera.getViewTransform()}calculateNormal(){Re(this.normalMatrix,this.modelViewMatrix),se(this.normalMatrix,this.normalMatrix),be(this.normalMatrix,this.normalMatrix)}updatePerspective(){Fe(this.projectionMatrix,this.camera.fov,this.canvas.width/this.canvas.height,this.camera.minZ,this.camera.maxZ)}setMatrixUniforms(){this.calculateNormal(),this.program.setUniform("uModelViewMatrix","mat4",this.modelViewMatrix),this.program.setUniform("uProjectionMatrix","mat4",this.projectionMatrix),this.program.setUniform("uNormalMatrix","mat4",this.normalMatrix)}push(){const e=B();Re(e,this.modelViewMatrix),this.stack.push(e)}pop(){return this.stack.length?this.modelViewMatrix=this.stack.pop():null}}const bi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=q(t,gi,Ei,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uLightSpecular","uMaterialAmbient","uMaterialDiffuse","uMaterialSpecular","uWireframe","uUpdateLight","uShininess"]);let i,r,n=!1,o=.5,s=.15,a=0,u=0,d=150,f=30;const c=new te(t,e);c.add(new ce(80,2)),c.add(new ke(82)),c.add(await l(()=>import("./sphere2.653d9a7a.js"),[]),"sphere"),c.add(await l(()=>import("./cone3.edde918c.js"),[]),"cone");const _=new ne("ORBITING_TYPE");_.goHome([0,2,50]),_.setFocus([0,0,0]),new re(_,t.canvas);const p=new fe(e,_,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);const v=Y({"Camera Type":{value:_.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:b=>{_.goHome(),_.type=b}},"Static Light Position":{value:n,onChange:b=>n=b},"Go Home":()=>_.goHome()});return c.start((b,g)=>{if(i=g-r,i<d)return;let E=Math.floor(i/f);for(;E>0;){a+=o,(a>=30||a<=-30)&&(o=-o),u+=s,(u>=35||u<=-35)&&(s=-s),t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),p.updatePerspective();try{e.setUniform("uUpdateLight","bool",n),b.forEach(w=>{if(p.calculateModelView(),p.push(),w.alias==="sphere"){const T=p.modelViewMatrix;S(T,T,[0,0,a])}else if(w.alias==="cone"){const T=p.modelViewMatrix;S(T,T,[u,0,0])}p.setMatrixUniforms(),p.pop(),e.setUniform("uMaterialDiffuse","vec4",w.diffuse),e.setUniform("uMaterialSpecular","vec4",w.specular),e.setUniform("uMaterialAmbient","vec4",w.ambient),e.setUniform("uWireframe","bool",w.wireframe),H(t,w.vao,w.wireframe?"LINES":"TRIANGLES")})}catch(w){console.error(w)}E-=1}r=g}),()=>{c.dispose(),v()}},xi=`#version 300 es
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
}`;class Ai{constructor(e){this.gravity=e,this.position=wi(),this.H0=this.position[1],this.V0=0,this.VF=Math.sqrt(2*e*this.H0),this.HF=0,this.bouncingTime=0,this.BOUNCINESS=Math.random()+.5,this.color=[Math.random(),Math.random(),Math.random(),1]}update(e){const i=this.gravity,r=e-this.bouncingTime,n=this.H0+this.V0*r-.5*i*r*r;n<=0?(this.bouncingTime=e,this.V0=this.VF*this.BOUNCINESS,this.HF=this.V0*this.V0/(2*i),this.VF=Math.sqrt(2*i*this.HF),this.H0=0):this.position[1]=n}}function wi(){return[Math.floor(Math.random()*50)-Math.floor(Math.random()*50),Math.floor(Math.random()*30)+50,Math.floor(Math.random()*50)]}const yi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=q(t,xi,Li,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe","uPerVertexColor","uTranslation","uTranslate"]);let i,r,n=!1,o=15;const s=new te(t,e),a=9.8,u=500,d=[];s.add(new ce(80,2)),s.add(await l(()=>import("./ball.e8c51c02.js"),[]),"ball");for(let v=0;v<u;v++)d.push(new Ai(a));const f=new ne("ORBITING_TYPE");f.goHome([0,2,70]),f.setFocus([0,0,0]),new re(f,t.canvas);const c=new fe(e,f,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);const _=Y({"Camera Type":{value:f.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:v=>{f.goHome(),f.type=v}},"Static Light Position":{value:n,onChange:v=>n=v},"Go Home":()=>f.goHome()});let p=0;return s.start((v,b)=>{if(i=b-r,i<o)return;let g=Math.floor(i/o);for(;g>0;){d.forEach(E=>E.update(p)),p+=33/1e3,t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),c.updatePerspective();try{e.setUniform("uUpdateLight","bool",n),v.forEach(E=>{if(c.calculateModelView(),c.setMatrixUniforms(),E.alias==="ball"){e.setUniform("uMaterialDiffuse","vec4",E.diffuse),e.setUniform("uMaterialSpecular","vec4",E.specular),e.setUniform("uMaterialAmbient","vec4",E.ambient),e.setUniform("uWireframe","bool",!1),e.setUniform("uTranslate","bool",!0),d.forEach(w=>{e.setUniform("uTranslation","vec3",w.position),e.setUniform("uMaterialDiffuse","vec4",w.color),H(t,E.vao,"TRIANGLES")});return}e.setUniform("uMaterialDiffuse","vec4",E.diffuse),e.setUniform("uMaterialSpecular","vec4",E.specular),e.setUniform("uMaterialAmbient","vec4",E.ambient),e.setUniform("uWireframe","bool",E.wireframe),e.setUniform("uTranslate","bool",!1),H(t,E.vao,E.wireframe?"LINES":"TRIANGLES")})}catch(E){console.error(E)}g-=1}r=b}),()=>{s.dispose(),_()}},Ti=`#version 300 es
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
}`,Ci=`#version 300 es
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
}`,Pi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=q(t,Ti,Ci,["aVertexPosition","aVertexNormal","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uMaterialSpecular","uLightAmbient","uLightDiffuse","uLightSpecular","uLightPosition","uShininess","uUpdateLight","uWireframe"]);let i=!1;const r="Linear Interpolation",n="Polynomial Interpolation",o="B-Spline Interpolation";let s=r,a=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],u=1e3;const d=new te(t,e),f=[1,1,0,1],c=[0,1,0,1],_=[0,0,1,1],p=[.5,.5,.5,1],v=[1,0,0,1],b=150;d.add(new ce(b,2)),d.add(new ke(b)),d.add({...await l(()=>import("./ball.e8c51c02.js"),[]),diffuse:f},"ball"),d.add({...await l(()=>import("./flag.1e342818.js"),[]),diffuse:c},"flagStart"),d.add({...await l(()=>import("./flag.1e342818.js"),[]),diffuse:_},"flagEnd"),d.add({...await l(()=>import("./flag.1e342818.js"),[]),diffuse:p},"flag1"),d.add({...await l(()=>import("./flag.1e342818.js"),[]),diffuse:p},"flag2"),d.add({...await l(()=>import("./flag.1e342818.js"),[]),diffuse:p},"flag3");const g=new ne("ORBITING_TYPE");g.goHome([0,2,80]),g.setElevation(-20),new re(g,t.canvas);const E=new fe(e,g,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,120,120]),e.setUniform("uLightAmbient","vec4",[.2,.2,.2,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uLightSpecular","vec4",[1,1,1,1]),e.setUniform("uShininess","float",230);let w=M();function T(){C=0,w.length=0}function R(){const y={[r]:M,[n]:F,[o]:k}[s];w=y()}const x=Y({"Camera Type":{value:g.type,options:["ORBITING_TYPE","TRACKING_TYPE"],onChange:y=>{g.goHome(),g.type=y}},Points:[0,1,2,3,4].reduce((y,A)=>(y[`Point ${A+1}`]={value:a[A][0],min:-70,max:70,step:1,onChange:P=>{a[A][0]=P,R()}},y),{}),Interpolation:{value:s,options:[r,n,o],onChange:y=>{T(),s=y,s===r?(a=[[-25,0,20],[-40,0,-10],[0,0,10],[25,0,-5],[40,0,-20]],u=1e3):s===n?(a=[[21,0,23],[-3,0,-10],[-21,0,-53],[50,0,-31],[-24,0,2]],u=1355):s===o&&(a=[[-21,0,23],[32,0,-10],[0,0,-53],[-32,0,-10],[21,0,23]],u=1e3),R()}},"Interpolation Steps":{value:u,min:10,max:1500,step:1,onChange:y=>{u=y,R()}},"Static Light Position":{value:i,onChange:y=>i=y},"Go Home":()=>g.goHome()});let C=0;return d.start(y=>{C+=1,C===u&&(C=0),t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),E.updatePerspective();try{e.setUniform("uUpdateLight","bool",i),y.forEach(A=>{E.calculateModelView(),E.setMatrixUniforms();const{alias:P}=A;if(P==="ball"&&w[C])S(E.modelViewMatrix,E.modelViewMatrix,w[C]);else if(P==="flagStart")S(E.modelViewMatrix,E.modelViewMatrix,a[0]);else if(P==="flagEnd")S(E.modelViewMatrix,E.modelViewMatrix,a[4]);else if(P==="flag1")if(s!==r)S(E.modelViewMatrix,E.modelViewMatrix,a[1]),A.diffuse=N(a[1],w[C],3)?v:p;else{E.pop();return}else if(P==="flag2")if(s!==r)S(E.modelViewMatrix,E.modelViewMatrix,a[2]),A.diffuse=N(a[2],w[C],3)?v:p;else{E.pop();return}else if(P==="flag3")if(s!==r)S(E.modelViewMatrix,E.modelViewMatrix,a[3]),A.diffuse=N(a[3],w[C],3)?v:p;else{E.pop();return}E.setMatrixUniforms(),E.pop(),e.setUniform("uMaterialDiffuse","vec4",A.diffuse),e.setUniform("uMaterialSpecular","vec4",A.specular),e.setUniform("uMaterialAmbient","vec4",A.ambient),e.setUniform("uWireframe","bool",A.wireframe),H(t,A.vao,A.wireframe?"LINES":"TRIANGLES")})}catch(A){console.error(A)}}),()=>{d.dispose(),x()};function M(){const y=[],[A,P,L]=a[0],[j,I,W]=a[a.length-1];for(let X=0;X<u;X++){const z=X/u;y.push([A*(1-z)+j*z,P*(1-z)+I*z,L*(1-z)+W*z])}return y}function F(){const y=[],A=a.length,P=u/(A-1),L=[];for(let I=0;I<A;I++){L[I]=1;for(let W=0;W<A;W++)I!==W&&(L[I]*=P*(I-W))}function j(I,W){const X=[];let z=0;for(let $=0;$<A;$++){X[$]=1;for(let _e=0;_e<A;_e++)$!==_e&&(X[$]*=I-_e*P);X[$]/=L[$],z+=X[$]*a[$][W]}return z}for(let I=0;I<u;I++)y.push([j(I,0),j(I,1),j(I,2)]);return y}function k(){const y=[],A=a.length-1,P=3,L=[],j=A+P+1,I=1/(j-2*P);for(let O=0;O<=P;O++)L.push(0);let W=I;for(let O=P+1;O<j-P+1;O++)L.push(W),W+=I;for(let O=j-P+1;O<=j;O++)L.push(1);function X(O,D){return L[D]<=O&&O<L[D+1]?1:0}function z(O,D,G){let he=0,oe=0;G-1===0?(he=X(O,D),oe=X(O,D+1)):(he=z(O,D,G-1),oe=z(O,D+1,G-1));let Ze=0,Qe=0;return L[D+G]-L[D]!==0&&(Ze=(O-L[D])/(L[D+G]-L[D])),L[D+G+1]-L[D+1]!==0&&(Qe=(L[D+G+1]-O)/(L[D+G+1]-L[D+1])),Ze*he+Qe*oe}function $(O){const D=[];for(let G=0;G<3;G++){let he=0;for(let oe=0;oe<=A;oe++)he+=a[oe][G]*z(O,oe,P);D[G]=he}return D}const _e=1/u;let je=0;do y.push($(je)),je+=_e;while(je<1);return y.push($(1)),y}function N(y,A,P){return Math.sqrt((y[0]-A[0])*(y[0]-A[0])+(y[1]-A[1])*(y[1]-A[1])+(y[2]-A[2])*(y[2]-A[2]))<=P}},Ri=`#version 300 es
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
}`,Vi=`#version 300 es
precision mediump float;

uniform vec4 uMaterialDiffuse;

in vec4 vColor;

out vec4 fragColor;

void main(void) {
    fragColor = vColor;
}`,Mi=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(100),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL);const e=q(t,Ri,Vi,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uAlpha","uUseLambert","uUseVertexColor"]);let i=!1;const r=new te(t,e);r.add({...await l(()=>import("./cube-simple.49e30b2d.js"),[]),hidden:!1},"simpleCube"),r.add({...await l(()=>import("./cube-complex.9bb7c8cf.js"),[]),hidden:!0},"complexCube");const n=new ne("ORBITING_TYPE");n.goHome([0,0,3]),n.setFocus([0,0,0]),n.setAzimuth(45),n.setElevation(-30),new re(n,t.canvas);const o=new fe(e,n,t.canvas);e.use(),e.setUniform("uLightPosition","vec3",[0,5,20]),e.setUniform("uLightAmbient","vec4",[1,1,1,1]),e.setUniform("uLightDiffuse","vec4",[1,1,1,1]),e.setUniform("uAlpha","float",1),e.setUniform("uUseVertexColor","bool",i),e.setUniform("uUseLambert","bool",!0);const s=Y({Lambert:{value:!0,onChange:a=>e.setUniform("uUseLambert","bool",a)},"Per Vertex":{value:i,onChange:a=>i=a},"Complex Cube":{value:!0,onChange:a=>{const u=r.get("simpleCube"),d=r.get("complexCube");a?(u.hidden=!0,d.hidden=!1):(u.hidden=!1,d.hidden=!0)}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:a=>e.setUniform("uAlpha","float",a)}});return r.start(a=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),o.updatePerspective();try{a.forEach(u=>{u.hidden||(o.calculateModelView(),o.push(),o.setMatrixUniforms(),o.pop(),e.setUniform("uUseVertexColor","bool",i),e.setUniform("uMaterialDiffuse","vec4",u.diffuse),e.setUniform("uMaterialAmbient","vec4",u.ambient),H(t,u.vao,"TRIANGLES"))})}catch(u){console.error(u)}}),()=>{r.dispose(),s()}},Oi=`#version 300 es
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
}`,Di=`#version 300 es
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
}`;class wt{constructor(e){this.id=e,this.position=[0,0,0],this.ambient=[0,0,0,0],this.diffuse=[0,0,0,0],this.specular=[0,0,0,0]}setPosition(e){this.position=e.slice(0)}setDiffuse(e){this.diffuse=e.slice(0)}setAmbient(e){this.ambient=e.slice(0)}setSpecular(e){this.specular=e.slice(0)}setProperty(e,i){this[e]=i}}class yt{constructor(){this.list=[]}add(e){this.list.push(e)}getArray(e){return this.list.reduce((i,r)=>(i=i.concat(r[e]),i),[])}get(e){return typeof e=="string"?this.list.find(i=>i.id===e):this.list[e]}}const Ii=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.depthFunc(t.LEQUAL);const e=q(t,Oi,Di,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightSource","uLightAmbient","uLightDiffuse","uMaterialAmbient","uMaterialDiffuse","uCutOff","uWireframe"]),i=[{id:"redLight",name:"Red Light",position:[0,7,3],diffuse:[1,0,0,1]},{id:"greenLight",name:"Green Light",position:[2.5,3,3],diffuse:[0,1,0,1]},{id:"blueLight",name:"Blue Light",position:[-2.5,3,3],diffuse:[0,0,1,1]},{id:"whiteLight",name:"White Light",position:[0,10,2],diffuse:[1,1,1,1]}],r=new te(t,e);r.add(new ce(80,2)),r.add(await l(()=>import("./wall.3397ad8f.js"),[]),"wall");for(const{id:d}of i)r.add(await l(()=>import("./sphere3.7b3e63db.js"),[]),d);const n=new ne("ORBITING_TYPE");n.goHome([0,5,30]),n.setFocus([0,0,0]),n.setAzimuth(0),n.setElevation(-3),new re(n,t.canvas);const o=new fe(e,n,t.canvas),s=new yt;i.forEach(({id:d,position:f,diffuse:c})=>{const _=new wt(d);_.setPosition(f),_.setDiffuse(c),s.add(_)});const a=.5;e.use(),e.setUniform("uLightPosition","vec3",s.getArray("position")),e.setUniform("uLightDiffuse","vec4",s.getArray("diffuse")),e.setUniform("uCutOff","float",a),e.setUniform("uLightAmbient","vec4",[1,1,1,1]);const u=Y({"Camera Type":{value:n.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:d=>{n.goHome(),n.type=d}},...i.reduce((d,f)=>{const c=[`X - ${f.name}`,`Y - ${f.name}`,`Z - ${f.name}`];return d[f.name]=c.reduce((_,p,v)=>(_[p]={value:f.position[v],min:-15,max:15,step:.1,onChange:(b,g)=>{s.get(f.id).position=c.map(E=>g[E])}},_),{}),d},{}),"Light Cone Cut Off":{value:a,min:0,max:1,step:.01,onChange:d=>e.setUniform("uCutOff","float",d)},"Go Home":()=>{n.goHome(),n.type="ORBITING_TYPE"}});return r.start(d=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),o.updatePerspective();try{d.forEach(f=>{o.calculateModelView(),o.push(),e.setUniform("uLightSource","bool",!1);const c=i.find(({id:_})=>f.alias===_);if(c){const{position:_,diffuse:p}=s.get(c.id);S(o.modelViewMatrix,o.modelViewMatrix,_),f.diffuse=p,e.setUniform("uLightSource","bool",!0)}o.setMatrixUniforms(),o.pop(),e.setUniform("uLightPosition","vec3",s.getArray("position")),e.setUniform("uMaterialDiffuse","vec4",f.diffuse),e.setUniform("uMaterialAmbient","vec4",f.ambient),e.setUniform("uWireframe","bool",f.wireframe),H(t,f.vao,f.wireframe?"LINES":"TRIANGLES")})}catch(f){console.error(f)}}),()=>{r.dispose(),u()}},Si=`#version 300 es
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
}`,Ni=`#version 300 es
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
}`,Ui=async t=>{t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.depthFunc(t.LEQUAL);const e=q(t,Si,Ni,["aVertexPosition","aVertexNormal","aVertexColor"],["uModelViewMatrix","uProjectionMatrix","uNormalMatrix","uLightPosition","uLightSource","uLightAmbient","uLightDiffuse","uLightDirection","uMaterialAmbient","uMaterialDiffuse","uCutOff","uWireframe"]),i=[{id:"redLight",name:"Red Light",position:[0,7,3],diffuse:[1,0,0,1],direction:[0,-2,-.1]},{id:"greenLight",name:"Green Light",position:[2.5,3,3],diffuse:[0,1,0,1],direction:[-.5,1,-.1]},{id:"blueLight",name:"Blue Light",position:[-2.5,3,3],diffuse:[0,0,1,1],direction:[.5,1,-.1]}],r=new te(t,e);r.add(new ce(80,2)),r.add(await l(()=>import("./wall.3397ad8f.js"),[]),"wall");for(const{id:d}of i)r.add(await l(()=>import("./sphere3.7b3e63db.js"),[]),d);const n=new ne("ORBITING_TYPE");n.goHome([0,5,30]),n.setFocus([0,0,0]),n.setAzimuth(0),n.setElevation(-3),new re(n,t.canvas);const o=new fe(e,n,t.canvas),s=new yt;i.forEach(({id:d,position:f,diffuse:c,direction:_})=>{const p=new wt(d);p.setPosition(f),p.setDiffuse(c),p.setProperty("direction",_),s.add(p)});const a=.75;e.use(),e.setUniform("uLightPosition","vec3",s.getArray("position")),e.setUniform("uLightDirection","vec3",s.getArray("direction")),e.setUniform("uLightDiffuse","vec4",s.getArray("diffuse")),e.setUniform("uCutOff","float",a),e.setUniform("uLightAmbient","vec4",[1,1,1,1]);const u=Y({"Camera Type":{value:n.type,options:["TRACKING_TYPE","ORBITING_TYPE"],onChange:d=>{n.goHome(),n.type=d}},...i.reduce((d,f)=>{const c=[`X - ${f.name}`,`Y - ${f.name}`,`Z - ${f.name}`];return d[f.name]=c.reduce((_,p,v)=>(_[p]={value:f.position[v],min:-15,max:15,step:.1,onChange:(b,g)=>{s.get(f.id).position=c.map(E=>g[E])}},_),{}),d},{}),"Light Cone Cut Off":{value:a,min:0,max:1,step:.01,onChange:d=>e.setUniform("uCutOff","float",d)},"Go Home":()=>{n.goHome(),n.type="ORBITING_TYPE"}});return r.start(d=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),o.updatePerspective();try{d.forEach(f=>{o.calculateModelView(),o.push(),e.setUniform("uLightSource","bool",!1);const c=i.find(({id:_})=>f.alias===_);if(c){const{position:_,diffuse:p}=s.get(c.id);S(o.modelViewMatrix,o.modelViewMatrix,_),f.diffuse=p,e.setUniform("uLightSource","bool",!0)}o.setMatrixUniforms(),o.pop(),e.setUniform("uLightPosition","vec3",s.getArray("position")),e.setUniform("uMaterialDiffuse","vec4",f.diffuse),e.setUniform("uMaterialAmbient","vec4",f.ambient),e.setUniform("uWireframe","bool",f.wireframe),H(t,f.vao,f.wireframe?"LINES":"TRIANGLES")})}catch(f){console.error(f)}}),()=>{r.dispose(),u()}},Fi=`#version 300 es
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
`,ki=`#version 300 es
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
}`,ji=async t=>{let e=!0,i=!0,r=!0,n=!0,o=!0,s=[0,1,1,1],a=[.7,0,.7,1],u=[0,1,0],d=1;t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LESS),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.blendColor(...u,d),t.enable(t.CULL_FACE);let f=t.FUNC_ADD,c=t.SRC_ALPHA,_=t.ONE_MINUS_SRC_ALPHA;const p=q(t,Fi,ki,["aVertexPosition","aVertexNormal"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uUseLambert"]),v=new te(t,p);v.add(new ce(80,2)),v.add({...await l(()=>import("./cone3.edde918c.js"),[]),diffuse:s},"cone"),v.add({...await l(()=>import("./sphere2.653d9a7a.js"),[]),diffuse:a},"sphere");const b=new ne("ORBITING_TYPE");b.goHome([0,5,35]),b.setFocus([0,0,0]),b.setAzimuth(25),b.setElevation(-25),new re(b,t.canvas);const g=new fe(p,b,t.canvas);p.use(),p.setUniform("uLightPosition","vec3",[0,5,20]),p.setUniform("uLightAmbient","vec4",[1,1,1,1]),p.setUniform("uLightDiffuse","vec4",[1,1,1,1]),p.setUniform("uUseLambert","bool",n);const E=["ZERO","ONE","SRC_COLOR","DST_COLOR","SRC_ALPHA","DST_ALPHA","CONSTANT_COLOR","CONSTANT_ALPHA","ONE_MINUS_SRC_ALPHA","ONE_MINUS_DST_ALPHA","ONE_MINUS_SRC_COLOR","ONE_MINUS_DST_COLOR","ONE_MINUS_CONSTANT_COLOR","ONE_MINUS_CONSTANT_ALPHA"],w=x=>x?"enable":"disable";function T(x=!0){t[x?"enable":"disable"](t.BLEND),t.blendFunc(c,_),t.blendEquation(f),t.blendColor(...u,d)}const R=Y({Blending:{value:e,onChange:T},"Depth Testing":{value:i,onChange:x=>t[w(x)](t.DEPTH_TEST)},"Back Face Culling":{value:r,onChange:x=>t[w(x)](t.CULL_FACE)},Lambert:{value:n,onChange:x=>n=x},Floor:{value:o,onChange:x=>o=x},...[{name:"Sphere",id:"sphere",color:a},{name:"Cone",id:"cone",color:s}].reduce((x,C)=>(x={...x,[`${C.name} Alpha`]:{value:1,min:0,max:1,step:.1,onChange:M=>v.get(C.id).diffuse[3]=M},[`${C.name} Color`]:{value:ti(C.color),onChange:M=>v.get(C.id).diffuse=Pe(M)}},x),{}),"Blend Function":{value:f,options:["FUNC_ADD","FUNC_SUBTRACT","FUNC_REVERSE_SUBTRACT"],onChange:x=>{f=t[x],T()}},Source:{value:c,options:[...E,"SRC_ALPHA_SATURATE"],onChange:x=>{c=t[x],T()}},Destination:{value:_,options:E,onChange:x=>{_=t[x],T()}},"Blending Color":{value:[0,0,0],onChange:x=>{u=Pe(x),T()}},"Alpha Value":{value:1,min:0,max:1,step:.1,onChange:x=>{d=x,T()}},"Render Order":{value:"Cone First",options:["Cone First","Sphere First"],onChange:x=>{x==="Sphere First"?(v.renderSooner("sphere"),v.renderFirst("floor")):(v.renderSooner("cone"),v.renderFirst("floor"))}},Reset:()=>{i=!0,e=!0,r=!0,n=!0,o=!0,f=t.FUNC_ADD,c=t.SRC_ALPHA,_=t.ONE_MINUS_SRC_ALPHA,b.goHome([0,5,35]),b.setFocus([0,0,0]),b.setAzimuth(25),b.setElevation(-25)}});return v.start(x=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),g.updatePerspective();try{x.forEach(C=>{const{alias:M}=C;M==="floor"&&!o||(g.calculateModelView(),g.push(),M==="cone"&&S(g.modelViewMatrix,g.modelViewMatrix,[0,0,-3.5]),M==="sphere"&&(oi(g.modelViewMatrix,g.modelViewMatrix,[.5,.5,.5]),S(g.modelViewMatrix,g.modelViewMatrix,[0,0,2.5])),g.setMatrixUniforms(),g.pop(),p.setUniform("uMaterialDiffuse","vec4",C.diffuse),p.setUniform("uMaterialAmbient","vec4",C.ambient),p.setUniform("uWireframe","bool",C.wireframe),p.setUniform("uUseLambert","bool",n),H(t,C.vao,C.wireframe?"LINES":"TRIANGLES"))})}catch(C){console.error(C)}}),()=>{v.dispose(),R()}},Bi=`#version 300 es
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
}`,Hi=`#version 300 es
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
}`,_t=async t=>{let e=!0,i=!0,r=!0,n=[0,1,0],o=1;t.clearColor(.9,.9,.9,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LESS),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.blendColor(...n,o),t.enable(t.CULL_FACE);let s=t.FUNC_ADD,a=t.SRC_ALPHA,u=t.ONE_MINUS_SRC_ALPHA;const d=q(t,Bi,Hi,["aVertexPosition","aVertexColor"],["uProjectionMatrix","uModelViewMatrix","uNormalMatrix","uMaterialDiffuse","uMaterialAmbient","uLightAmbient","uLightDiffuse","uLightPosition","uWireframe","uAlpha","uUseLambert"]),f=new te(t,d);f.add(await l(()=>import("./cube-complex.9bb7c8cf.js"),[]),"cube");const c=new ne("ORBITING_TYPE");c.goHome([0,0,4]),c.setFocus([0,0,0]),c.setAzimuth(50),c.setElevation(-30),new re(c,t.canvas);const _=new fe(d,c,t.canvas);d.use(),d.setUniform("uLightPosition","vec3",[0,5,20]),d.setUniform("uLightAmbient","vec4",[1,1,1,1]),d.setUniform("uLightDiffuse","vec4",[1,1,1,1]),d.setUniform("uAlpha","float",.5),d.setUniform("uUseLambert","bool",e);const p=["ZERO","ONE","SRC_COLOR","DST_COLOR","SRC_ALPHA","DST_ALPHA","CONSTANT_COLOR","CONSTANT_ALPHA","ONE_MINUS_SRC_ALPHA","ONE_MINUS_DST_ALPHA","ONE_MINUS_SRC_COLOR","ONE_MINUS_DST_COLOR","ONE_MINUS_CONSTANT_COLOR","ONE_MINUS_CONSTANT_ALPHA"];function v(g=!0){t[g?"enable":"disable"](t.BLEND),t.blendFunc(a,u),t.blendEquation(s),t.blendColor(...n,o)}const b=Y({"Alpha Blending":{value:!0,onChange:v},"Render Front Face":{value:!0,onChange:g=>r=g},"Render Back Face":{value:!0,onChange:g=>i=g},"Alpha Value":{value:.5,min:0,max:1,step:.1,onChange:g=>d.setUniform("uAlpha","float",g)},"Blend Function":{value:s,options:["FUNC_ADD","FUNC_SUBTRACT","FUNC_REVERSE_SUBTRACT"],onChange:g=>{s=t[g],v()}},Source:{value:a,options:[...p,"SRC_ALPHA_SATURATE"],onChange:g=>{a=t[g],v()}},Destination:{value:u,options:p,onChange:g=>{u=t[g],v()}},"Blending Color":{value:[0,0,0],onChange:g=>{n=Pe(g),v()}},"Constant Alpha":{value:1,min:0,max:1,step:.1,onChange:g=>{o=g,v()}}});return f.start(g=>{t.viewport(0,0,t.canvas.width,t.canvas.height),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),_.updatePerspective();try{g.forEach(E=>{_.calculateModelView(),_.push(),_.setMatrixUniforms(),_.pop(),d.setUniform("uMaterialDiffuse","vec4",E.diffuse),d.setUniform("uMaterialAmbient","vec4",E.ambient),d.setUniform("uWireframe","bool",E.wireframe),E.wireframe?H(t,E.vao,"LINES"):(i&&(t.cullFace(t.FRONT),H(t,E.vao,"TRIANGLES")),r&&(t.cullFace(t.BACK),H(t,E.vao,"TRIANGLES")))})}catch(E){console.error(E)}}),()=>{f.dispose(),b()}},K=(t,e,i)=>{const r=document.createElement("button");r.textContent=e,r.addEventListener("click",i),t.appendChild(r)};window.onload=async()=>{const t=Qt("app");if(!t)return;t.width=window.innerWidth,t.height=window.innerHeight,ei(t);const e=Jt(t);if(!e)return;let i=await _t(e);const r=document.getElementById("menu");K(r,"3.13",async()=>{i(),i=await li(e)}),K(r,"4.8",async()=>{i(),i=await mi(e)}),K(r,"4.10",async()=>{i(),i=await vi(e)}),K(r,"5.7",async()=>{i(),i=await bi(e)}),K(r,"5.9",async()=>{i(),i=await yi(e)}),K(r,"5.12",async()=>{i(),i=await Pi(e)}),K(r,"6.3",async()=>{i(),i=await Mi(e)}),K(r,"6.6",async()=>{i(),i=await Ii(e)}),K(r,"6.8",async()=>{i(),i=await Ui(e)}),K(r,"6.12",async()=>{i(),i=await ji(e)}),K(r,"6.14",async()=>{i(),i=await _t(e)})};
