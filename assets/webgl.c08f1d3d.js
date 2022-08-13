const T=(r,s,f)=>{const a=r.createShader(r[f]);return r.shaderSource(a,s),r.compileShader(a),r.getShaderParameter(a,r.COMPILE_STATUS)?a:(console.error(r.getShaderInfoLog(a)),null)},m=(r,s,f,a,E)=>{const i=r.createProgram(),u=T(r,s,"VERTEX_SHADER"),c=T(r,f,"FRAGMENT_SHADER");r.attachShader(i,u),r.attachShader(i,c),r.linkProgram(i),r.getProgramParameter(i,r.LINK_STATUS)||console.error("Could not initialize shaders"),r.deleteShader(u),r.deleteShader(c);const t={data:i,attributes:a.reduce((e,n)=>(e[n]=r.getAttribLocation(i,n),e),{}),uniforms:E.reduce((e,n)=>(e[n]=r.getUniformLocation(i,n),e),{}),use:()=>{r.useProgram(i)},dispose:()=>{r.deleteProgram(i)},getUniform:e=>r.getUniform(i,t.uniforms[e]),setUniform:(e,n,o)=>{switch(n){case"float":r.uniform1f(t.uniforms[e],o);break;case"int":r.uniform1i(t.uniforms[e],o);break;case"bool":r.uniform1f(t.uniforms[e],o);break;case"vec2":r.uniform2fv(t.uniforms[e],o);break;case"ivec2":r.uniform2iv(t.uniforms[e],o);break;case"bvec2":r.uniform2fv(t.uniforms[e],o);break;case"vec3":r.uniform3fv(t.uniforms[e],o);break;case"ivec3":r.uniform3iv(t.uniforms[e],o);break;case"bvec3":r.uniform3fv(t.uniforms[e],o);break;case"vec4":r.uniform4fv(t.uniforms[e],o);break;case"ivec4":r.uniform4iv(t.uniforms[e],o);break;case"bvec4":r.uniform4fv(t.uniforms[e],o);break;case"mat2":r.uniformMatrix2fv(t.uniforms[e],!1,o);break;case"mat3":r.uniformMatrix3fv(t.uniforms[e],!1,o);break;case"mat4":r.uniformMatrix4fv(t.uniforms[e],!1,o);break;case"sampler2D":r.uniform1i(t.uniforms[e],o);break}}};return t},b=(r,s,f,a)=>{const E=r.createVertexArray();r.bindVertexArray(E);const i=[];f.forEach(({name:t,data:e,size:n})=>{const o=r.createBuffer();i.push(o),r.bindBuffer(r.ARRAY_BUFFER,o),r.bufferData(r.ARRAY_BUFFER,new Float32Array(e),r.STATIC_DRAW),r.vertexAttribPointer(s.attributes[t],n,r.FLOAT,!1,0,0),r.enableVertexAttribArray(s.attributes[t])});let u=null;a&&(u=r.createBuffer(),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,u),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array(a),r.STATIC_DRAW)),r.bindVertexArray(null),r.bindBuffer(r.ARRAY_BUFFER,null),a&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,null);const c={vao:E,use:t=>{r.bindVertexArray(c.vao),t(a?a.length:void 0),r.bindVertexArray(null)},dispose:()=>{r.deleteVertexArray(c.vao),i.forEach(t=>{r.deleteBuffer(t)}),r.deleteBuffer(u)}};return c},A=(r,s,f)=>{s.use(a=>{a!=null?r.drawElements(r[f],a,r.UNSIGNED_SHORT,0):r.drawArrays(r[f],r.UNSIGNED_SHORT,0)})},d=r=>new Promise((s,f)=>{const a=new Image;a.src=r,a.onload=()=>s(a),a.onerror=f}),R=async(r,s)=>{const f=r.createTexture(),a=await d(s);return r.bindTexture(r.TEXTURE_2D,f),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.bindTexture(r.TEXTURE_2D,null),{bind(){r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,f)},dispose(){r.deleteTexture(f)}}};export{b as a,m as c,A as d,R as l};
