// Capture actual application draw calls for native GPU verification. This is not browser E2E.
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import ts from 'typescript';
import * as spatial from '../lib/museum-spatial.ts';
import * as interior from '../lib/museum-interior.ts';
import * as display from '../lib/museum-display.ts';
import * as assets from '../lib/museum-assets.ts';
const filename=new URL('../lib/museum-webgl.ts',import.meta.url);
const source=await readFile(filename,'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const shaders=[],buffers=[],textures=[],calls=[];let buffer,texture,textureUnit=0;const bound={},uniforms={};
const gl={ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,TRIANGLES:4,VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,DEPTH_TEST:2929,CULL_FACE:2884,TEXTURE_2D:3553,RGBA:6408,UNSIGNED_BYTE:5121,TEXTURE_WRAP_S:10242,TEXTURE_WRAP_T:10243,CLAMP_TO_EDGE:33071,TEXTURE_MIN_FILTER:10241,TEXTURE_MAG_FILTER:10240,LINEAR:9729,TEXTURE0:33984,TEXTURE1:33985,UNPACK_FLIP_Y_WEBGL:37440,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,MAX_TEXTURE_SIZE:3379,
 createShader(type){const x={type};shaders.push(x);return x;},shaderSource(shader,source){shader.source=source;},compileShader(){},getShaderParameter(){return true;},getShaderInfoLog(){return '';},deleteShader(){},createProgram(){return {};},attachShader(){},linkProgram(){},getProgramParameter(){return true;},getProgramInfoLog(){return '';},useProgram(){},enable(){},disable(){},clearColor(...v){gl.background=v;},clear(){},viewport(){},isContextLost(){return false;},getParameter(){return 8192;},
 getUniformLocation(_p,name){return name;},uniform1f(name,v){uniforms[name]=v;},uniform1i(name,v){uniforms[name]=v;},uniform2fv(name,v){uniforms[name]=[...v];},uniform3fv(name,v){uniforms[name]=[...v];},
 getAttribLocation(_p,name){return {aPosition:0,aNormal:1,aColor:2,aUV:3}[name]??-1;},enableVertexAttribArray(){},vertexAttribPointer(){},
 createBuffer(){const x={id:buffers.length};buffers.push(x);return x;},bindBuffer(_type,b){buffer=b;},bufferData(_type,data){buffer.vertices=[...data];},deleteBuffer(){},
 createTexture(){const x={id:textures.length};textures.push(x);return x;},bindTexture(_type,t){texture=t;bound[textureUnit]=t;},texImage2D(...args){if(args.length===6){texture.image=args[5].src;}else{texture.color=[...args[8]];}},texParameteri(){},pixelStorei(){},deleteTexture(){},activeTexture(unit){textureUnit=unit-gl.TEXTURE0;},
 drawArrays(_mode,_first,count){calls.push({buffer:buffer.id,count,uniforms:{...uniforms},textures:Object.fromEntries(Object.entries(bound).map(([k,v])=>[k,v?.id]))});},deleteProgram(){},
};
globalThis.window={devicePixelRatio:1};
globalThis.Image=class {set src(value){this._src=value;this.naturalWidth=1535;this.naturalHeight=1024;this.onload?.();}get src(){return this._src;}};
const module={exports:{}};const originalRequire=createRequire(import.meta.url);
new Function('require','module','exports',compiled)(name=>name==='./museum-spatial'?spatial:name==='./museum-interior'?interior:name==='./museum-display'?display:name==='./museum-assets'?assets:originalRequire(name),module,module.exports);
const width=Number(process.argv[4])||1280,height=Number(process.argv[5])||800;
const localFixture=process.argv[3]==='fixture'?{vertices:new Float32Array([0,0,0,0,0,1,.8,.6,.2,0,0,0,1,0,0,0,0,1,.8,.6,.2,0,1,0,0,1,0,0,0,1,.8,.6,.2,0,0,1])}:undefined;
const renderer=module.exports.createMuseumRenderer({clientWidth:width,clientHeight:height,width,height,getContext:()=>gl},message=>{throw Error(message);},localFixture);
let journey=spatial.enterSpatialMuseum();const target=process.argv[3];
if(target&&target!=='entry'&&target!=='fixture'){if(target.startsWith('@')){for(const node of spatial.routeSpatial(journey.node,target.slice(1)))journey=spatial.walkSpatial(journey,node);}else{const e=spatial.exhibitById(target);for(const node of spatial.routeSpatial(journey.node,e.node))journey=spatial.walkSpatial(journey,node);journey=spatial.approachSpatial(journey,target);}}
renderer.render(localFixture?{position:[0,0,3],yaw:0,pitch:0,fov:45}:journey.camera,journey.node,journey.selected??undefined);
await writeFile(process.argv[2],JSON.stringify({width,height,shaders,buffers,textures,calls,background:gl.background,camera:journey.camera,node:journey.node}));
console.log(JSON.stringify({capture:process.argv[2],node:journey.node,drawCalls:calls.length,vertices:buffers.reduce((n,b)=>n+(b.vertices?.length??0)/12,0),textureCount:textures.length}));
