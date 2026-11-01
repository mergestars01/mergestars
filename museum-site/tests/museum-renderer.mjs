import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {enterMuseum} from '../lib/museum-tour.ts';
import * as spatial from '../lib/museum-spatial.ts';
import * as interior from '../lib/museum-interior.ts';
import * as display from '../lib/museum-display.ts';
import * as assets from '../lib/museum-assets.ts';
import * as frames from '../lib/museum-frame-loop.ts';
import * as threeScene from '../lib/museum-three-scene.ts';
import * as vitrine from '../lib/museum-vitrine.ts';
import * as gltf from '../lib/core-gltf.ts';
import * as limits from '../lib/core-model-limits.ts';
// Exercise the actual renderer's resource lifecycle and framing. Shader compilation is checked separately with native EGL/GLES.
const source=await readFile(new URL('../lib/museum-webgl.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const module={exports:{}};new Function('require','module','exports',code)(name=>{name=name.replace(/\.ts$/,'');if(name==='./museum-spatial')return spatial;if(name==='./museum-interior')return interior;if(name==='./museum-display')return display;if(name==='./museum-assets')return assets;throw Error(name);},module,module.exports);
for(const p of [...interior.interiorPanels,{crop:interior.medallionCrop}]){const [l,t,r,b]=p.crop;assert(l>=0&&t>=0&&r<=1&&b<=1&&l<r&&t<b);}
assert.equal(spatial.spatialExhibits.length,18);
for(const e of spatial.spatialExhibits){const [l,t,r,b]=e.crop;assert(l>=0&&t>=0&&r<=1&&b<=1&&l<r&&t<b);assert.equal(e.modelStatus,'VIEW_ONLY');}
assert.equal(interior.museumLensShift(true,1280),-.3);assert.equal(interior.museumLensShift(true,390),0);
assert.equal(interior.museumLensLift(true,1280),0);assert.equal(interior.museumLensLift(true,390),.42);
assert.equal(interior.museumPresentationFov(46,1,390),58);
assert.equal(interior.museumMoveDuration(0),950);assert.equal(interior.museumMoveDuration(100),1850);
assert(interior.museumMoveDuration(6)>interior.museumMoveDuration(2));
let pending=[],images=[];
globalThis.window={devicePixelRatio:3};
globalThis.Image=class{set src(value){this._src=value;pending.push(this);images.push(this);}get src(){return this._src;}};
const gl={ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,TRIANGLES:4,VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,DEPTH_TEST:2929,CULL_FACE:2884,TEXTURE_2D:3553,RGBA:6408,UNSIGNED_BYTE:5121,TEXTURE_WRAP_S:10242,TEXTURE_WRAP_T:10243,CLAMP_TO_EDGE:33071,TEXTURE_MIN_FILTER:10241,TEXTURE_MAG_FILTER:10240,LINEAR:9729,TEXTURE0:33984,TEXTURE1:33985,UNPACK_FLIP_Y_WEBGL:37440,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
 buffers:new Set(),textures:new Set(),calls:[],uniforms:{},
 createShader(){return {};},shaderSource(){},compileShader(){},getShaderParameter(){return true;},deleteShader(){},createProgram(){return {};},attachShader(){},linkProgram(){},getProgramParameter(){return true;},useProgram(){},enable(){},disable(){},clearColor(){},clear(){},viewport(){},isContextLost(){return false;},
 getUniformLocation(_p,n){return n;},uniform1f(n,v){this.uniforms[n]=v;},uniform1i(n,v){this.uniforms[n]=v;},uniform3fv(n,v){this.uniforms[n]=[...v];},
 getAttribLocation(){return 0;},enableVertexAttribArray(){},vertexAttribPointer(){},
 createBuffer(){const b={};this.buffers.add(b);return b;},bindBuffer(){},bufferData(){},deleteBuffer(b){assert(this.buffers.delete(b));},
 createTexture(){const t={};this.textures.add(t);return t;},bindTexture(){},texImage2D(){},texParameteri(){},pixelStorei(){},activeTexture(){},deleteTexture(t){assert(this.textures.delete(t));},
 drawArrays(){this.calls.push({...this.uniforms});},deleteProgram(){},
};
const canvas={clientWidth:1280,clientHeight:800,width:0,height:0,getContext:()=>gl},errors=[];
const renderer=module.exports.createMuseumRenderer(canvas,error=>errors.push(error));
assert.equal(renderer.interiorReady(),false,'Interior cannot report ready before the exact approved photo loads');
assert.equal(renderer.pickNavigation(spatial.enterSpatialMuseum().camera,.5,.8,'entry'),null,'Unloaded world must not enable invisible controls');
let j=spatial.enterSpatialMuseum();renderer.render(j.camera,j.node);assert.equal(j.selected,null);
assert.equal(gl.uniforms.uInteriorReady,0);assert.equal(canvas.width,2176);assert.equal(canvas.height,1360);
for(const img of pending.splice(0)){await readFile(new URL('../public'+img.src,import.meta.url));img.onload();}
assert.equal(renderer.interiorReady(),true);
for(const node of spatial.spatialNodes){for(const n of spatial.routeSpatial(j.node,node.id))j=spatial.walkSpatial(j,n);renderer.render(j.camera,j.node);assert(gl.buffers.size<=24,'Walking must reuse/delete the arrow buffer');}
assert(images.length<=3,'The eighteen exhibits share presentation textures; no eighteen-model preload');
for(const img of pending.splice(0)){await readFile(new URL('../public'+img.src,import.meta.url));img.onload();}
for(const e of spatial.spatialExhibits){let pose=spatial.enterSpatialMuseum();for(const n of spatial.routeSpatial(pose.node,e.node))pose=spatial.walkSpatial(pose,n);pose={...pose,camera:spatial.lookSpatial(pose.camera,50,-24)};const before=structuredClone(pose.camera),focused=spatial.approachSpatial(pose,e.id);
 for(const width of [390,899,900,1280]){canvas.clientWidth=width;renderer.render(focused.camera,focused.node,e.id);const focus=focused.camera.focus;assert.equal(gl.uniforms.uLensShift,interior.museumLensShift(focus,width));assert.equal(gl.uniforms.uLensLift,interior.museumLensLift(focus,width));assert.equal(gl.uniforms.uTan,Math.tan(interior.museumPresentationFov(focused.camera.fov,focus,width,800,focused.camera.displayBounds)*Math.PI/360));const projection=spatial.projectSpatial(e.position,{...focused.camera,fov:interior.museumPresentationFov(focused.camera.fov,focus,width,800,focused.camera.displayBounds)},width/800,gl.uniforms.uLensShift,gl.uniforms.uLensLift);assert(projection,'Selected image remains in the camera frustum');assert(Math.abs(projection.x-(width<900?50:35))<1e-8);if(width<900)assert(projection.y<40,'Mobile object stays above the contextual sheet');}
 const mid=spatial.interpolateCamera(before,focused.camera,.5);assert.equal(mid.focus,.5);assert.equal(spatial.interpolateCamera(before,focused.camera,0).focus,0);assert.equal(spatial.interpolateCamera(focused.camera,before,1).focus,0);
 const closed=spatial.closeSpatial(focused);assert.deepEqual(closed.camera,before,'Closing restores the exact pose, with no lingering framing');renderer.render(closed.camera,closed.node);assert.equal(Math.abs(gl.uniforms.uLensShift),0);assert.equal(gl.uniforms.uLensLift,0);
}
for(const img of pending.splice(0)){await readFile(new URL('../public'+img.src,import.meta.url));assert(img.src.endsWith('.png'),'Approached displays load the intact original');img.onload();}
assert(images.length<=6,'At most three originals replace the three shared presentation textures');
assert.equal(errors.length,0);const calls=gl.calls.length;renderer.dispose();assert.equal(gl.buffers.size,0);assert.equal(gl.textures.size,0);renderer.render(j.camera,j.node);assert.equal(gl.calls.length,calls);assert.equal(renderer.pick(j.camera,.5,.5),null);assert.equal(renderer.pickNavigation(j.camera,.5,.5,j.node),null);for(const img of images){assert.equal(img.onload,null);assert.equal(img.onerror,null);}
// Explicit local geometry fixture, not a CORE product or a substitute for production data.
pending=[];images=[];const fixture={vertices:new Float32Array([0,0,0,0,0,1,.8,.6,.2,0,0,0,1,0,0,0,0,1,.8,.6,.2,0,1,0,0,1,0,0,0,1,.8,.6,.2,0,0,1])};
const model=module.exports.createMuseumRenderer(canvas,error=>errors.push(error),fixture);assert.equal(model.interiorReady(),true);model.render({position:[0,0,3],yaw:0,pitch:0,fov:45},'entry');assert.equal(gl.uniforms.uRoom,0);assert.equal(images.length,0);assert.equal(model.pick(j.camera,.5,.5),null);assert.equal(model.pickNavigation(j.camera,.5,.5,j.node),null);model.dispose();assert.equal(gl.buffers.size,0);assert.equal(gl.textures.size,0);
// Actual React server output: entry is the entire world, with no selected product, price or passport panel.
const uiSource=await readFile(new URL('../components/museum-spatial.tsx',import.meta.url),'utf8');
const uiCode=ts.transpileModule(uiSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
const ui={exports:{}},require=createRequire(import.meta.url);
new Function('require','module','exports',uiCode)(name=>['@/lib/museum-three-scene','@/lib/museum-three'].includes(name)?threeScene:name==='@/lib/museum-vitrine'?vitrine:name==='@/lib/core-gltf'?gltf:name==='@/lib/core-model-limits'?limits:name==='@/lib/museum-webgl'?module.exports:name==='@/lib/museum-interior'?interior:name==='@/lib/museum-spatial'?spatial:name==='@/lib/museum-frame-loop'?frames:require(name),ui,ui.exports);
const html=renderToStaticMarkup(createElement(ui.exports.SpatialMuseum,{view:enterMuseum(),disabled:false,blocked:false,vitrineRequest:null,onPoint(){},onExhibit(){},onCreate(){},onInspect(){},onOriginal(){}}));
assert(html.includes('data-spatial-node="entry"'));assert(html.includes('data-selected-exhibit=""'));assert(html.includes('spatial-loading'));assert(!html.includes('spatial-object-tools'));assert(!html.includes('spatial-map'));assert(!html.includes('CREATE MY VERSION'));assert(!html.includes('VERIFIED OFFER'));assert(html.includes('LOOK AROUND'));
console.log('PASS: approved interior load readiness; eighteen VIEW ONLY assets; photo aspect/crop bounds; desktop/mobile projection; smooth focus; exact return; bounded textures and buffer cleanup; isolated real-model renderer. This is not browser E2E or a real CORE pass.');
