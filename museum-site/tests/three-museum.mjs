import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import * as THREE from 'three';
import * as spatial from '../lib/museum-spatial.ts';
import * as interior from '../lib/museum-interior.ts';
import * as display from '../lib/museum-display.ts';
import * as assets from '../lib/museum-assets.ts';
import * as vitrine from '../lib/museum-vitrine.ts';
import * as gltf from '../lib/core-gltf.ts';
import * as disposalModule from '../lib/core-model-scene.ts';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
function moduleFrom(source, imports) {
  const mod = { exports: {} }, code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require','module','exports',code)(name => { name=name.replace(/\.ts$/,''); if (!(name in imports)) throw Error(name); return imports[name]; },mod,mod.exports); return mod.exports;
}
const imports = { './museum-spatial':spatial, './museum-interior':interior, './museum-display':display, './museum-assets':assets };
const legacy = moduleFrom(await readFile(new URL('../lib/museum-webgl.ts',import.meta.url),'utf8'),imports);
// Real Three.js cameras/geometries/materials/textures. Only the GPU transport is
// mocked: this test cannot prove shader compilation or browser rendering.
let calls = 0, disposal = 0, lastScene, lastCamera, destroyed = new Set();
class Transport {
  debug = {}; shadowMap={}; capabilities = { getMaxAnisotropy: () => 8 };
  constructor({canvas}) { this.canvas = canvas; }
  setPixelRatio(value) { this.ratio = value; }
  setClearColor() {}
  setSize(w,h) { this.canvas.width = w*this.ratio; this.canvas.height = h*this.ratio; }
  getContext() { return { isContextLost: () => false }; }
  render(scene,camera) { calls++; lastScene=scene;lastCamera=camera;scene.traverse(o=>{if(o.geometry&&!o.geometry.userData.watched){o.geometry.userData.watched=true;o.geometry.addEventListener('dispose',()=>destroyed.add(o.geometry.uuid));}}); }
  dispose() { disposal++; }
  forceContextLoss() {}
}
class Environment { fromScene(){return new THREE.WebGLRenderTarget(1,1);}dispose(){} }
const three={...THREE,WebGLRenderer:Transport,PMREMGenerator:Environment};
const world=moduleFrom(await readFile(new URL('../lib/museum-three-scene.ts',import.meta.url),'utf8'),{...imports,'./museum-webgl':legacy,'./museum-vitrine':vitrine,'./core-gltf':gltf,'./core-model-scene':disposalModule,three,'three/addons/loaders/GLTFLoader.js':{GLTFLoader},'three/addons/environments/RoomEnvironment.js':{RoomEnvironment}});
const runtime=moduleFrom(await readFile(new URL('../lib/museum-three.ts',import.meta.url),'utf8'),{three,'./museum-three-scene':world});

for (const exhibit of spatial.spatialExhibits) {
  let journey=spatial.enterSpatialMuseum();for(const node of spatial.routeSpatial(journey.node,exhibit.node))journey=spatial.walkSpatial(journey,node);
  const poses=[journey.camera,spatial.approachSpatial(journey,exhibit.id).camera];
  for (const pose of poses) for (const [width,height] of [[390,844],[899,800],[900,800],[1280,800]]) {
    const camera=new THREE.PerspectiveCamera(46,1,.2,60);runtime.updateMuseumCamera(camera,pose,width,height);
    const focus=pose.focus??(pose.framing==='OBJECT'), expected=spatial.projectSpatial(exhibit.position,{...pose,fov:interior.museumPresentationFov(pose.fov,focus,width,height,pose.displayBounds)},width/height,interior.museumLensShift(focus,width),interior.museumLensLift(focus,width));
    if(expected){const actual=new THREE.Vector3(...exhibit.position).project(camera);assert(Math.abs((actual.x+1)*50-expected.x)<1e-7);assert(Math.abs((1-actual.y)*50-expected.y)<1e-7);}
  }
}
globalThis.window={devicePixelRatio:3};let pending=[],allImages=[];
globalThis.Image=class { set src(value){this._src=value;pending.push(this);if(!allImages.includes(this))allImages.push(this);}get src(){return this._src;} };
const canvas={clientWidth:1280,clientHeight:800},errors=[];
const renderer=runtime.createMuseumRenderer(canvas,e=>errors.push(e));
assert(!renderer.interiorReady());assert.equal(renderer.pickNavigation(spatial.enterSpatialMuseum().camera,.5,.8,'entry'),null);
let journey=spatial.enterSpatialMuseum();renderer.render(journey.camera,journey.node);
async function finishImages(){for(const image of pending.splice(0)){await readFile(new URL('../public'+image.src,import.meta.url));image.onload();}}
await finishImages();assert(renderer.interiorReady());
for(const node of spatial.spatialNodes){for(const id of spatial.routeSpatial(journey.node,node.id))journey=spatial.walkSpatial(journey,id);renderer.render(journey.camera,journey.node);assert.equal(lastScene.getObjectByName('MERGE Museum Room').children.length,32,'Navigation meshes must be replaced without accumulation');}
await finishImages();
for(const e of spatial.spatialExhibits){let j=spatial.enterSpatialMuseum();for(const id of spatial.routeSpatial(j.node,e.node))j=spatial.walkSpatial(j,id);j=spatial.approachSpatial(j,e.id);renderer.render(j.camera,j.node,e.id);}
await finishImages();assert(allImages.length<=6,'Shared presentation images and intact originals must be reused');
assert.equal(errors.length,0);assert.equal(canvas.width,2560);assert(lastCamera.isPerspectiveCamera);assert(lastScene.children.some(o=>o.isLight));assert(lastScene.getObjectByName('MERGE Museum Room').isGroup);
const alive=[];lastScene.traverse(object=>{if(object.geometry)alive.push(object.geometry.uuid);});const before=calls;
renderer.dispose();renderer.dispose();assert.equal(disposal,1);for(const id of alive)assert(destroyed.has(id));assert.equal(lastScene.children.length,0);
renderer.render(journey.camera,journey.node);assert.equal(calls,before);assert.equal(renderer.pick(journey.camera,.5,.5),null);assert(!renderer.interiorReady());
for(const image of allImages){assert.equal(image.onload,null);assert.equal(image.onerror,null);}
const ui=await readFile(new URL('../components/museum-spatial.tsx',import.meta.url),'utf8');assert(ui.includes("from '@/lib/museum-three'"));
console.log('PASS: actual Three camera projections match every preserved exhibit/mobile framing; approved assets, deferred readiness, shared textures, bounded scene meshes and disposal. GPU/browser rendering is not asserted.');
