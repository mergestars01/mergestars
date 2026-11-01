import assert from 'node:assert/strict';
import { inspectCoreGLB, loadCoreGLB } from '../lib/core-gltf.ts';
import { MAX_CORE_MODEL_BYTES } from '../lib/core-model-limits.ts';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { readFile } from 'node:fs/promises';

// A three-vertex GLB test fixture only. Never a CORE product/generated model.
const binary=new Float32Array([0,0,0,1,0,0,0,1,0]);
const metadata={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],buffers:[{byteLength:36}],bufferViews:[{buffer:0,byteLength:36}],accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[0,0,0],max:[1,1,0]}],materials:[{pbrMetallicRoughness:{baseColorFactor:[.7,.5,.2,1],metallicFactor:.8,roughnessFactor:.3}}],meshes:[{primitives:[{attributes:{POSITION:0},material:0}]}]};
function glb(meta){const text=JSON.stringify(meta),json=Buffer.from(text+' '.repeat((4-text.length%4)%4)),length=12+8+json.length+8+36,bytes=Buffer.alloc(length);bytes.writeUInt32LE(0x46546c67,0);bytes.writeUInt32LE(2,4);bytes.writeUInt32LE(length,8);bytes.writeUInt32LE(json.length,12);bytes.writeUInt32LE(0x4e4f534a,16);json.copy(bytes,20);const offset=20+json.length;bytes.writeUInt32LE(36,offset);bytes.writeUInt32LE(0x004e4942,offset+4);Buffer.from(binary.buffer).copy(bytes,offset+8);return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);}
const bytes=glb(metadata);assert.deepEqual(inspectCoreGLB(bytes),{vertices:3,textures:0});
assert.equal(inspectCoreGLB(glb({...metadata,images:[{bufferView:0,mimeType:'image/png'}],textures:[{source:0}]})).textures,1,'Embedded textures are supported; loader must validate/decode them before READY');
for(const uri of ['https://tracker.example/a.png','../private.png','file:///secret','data:text/html;base64,QQ=='])assert.throws(()=>inspectCoreGLB(glb({...metadata,images:[{uri}]})),/EXTERNAL_RESOURCE/);
assert.throws(()=>inspectCoreGLB(glb({...metadata,buffers:[{byteLength:36,uri:'https://elsewhere.example'}]})),/EXTERNAL_RESOURCE/);
assert.throws(()=>inspectCoreGLB(glb({...metadata,extensionsRequired:['KHR_draco_mesh_compression']})),/DECODER_REQUIRED/);
assert.throws(()=>inspectCoreGLB(glb({...metadata,nodes:[{mesh:0,children:[0]}]})),/NODE_INVALID/);
assert.throws(()=>inspectCoreGLB(glb({...metadata,accessors:[{...metadata.accessors[0],count:1600000}]})),/TOO_COMPLEX/);
assert.throws(()=>inspectCoreGLB(new ArrayBuffer(10)));assert.throws(()=>inspectCoreGLB(new ArrayBuffer(MAX_CORE_MODEL_BYTES+4)),/SIZE_INVALID/);
const asset=await new GLTFLoader().parseAsync(bytes,'');assert.equal(asset.scene.children[0].geometry.attributes.position.count,3);assert.equal(asset.scene.children[0].material.metalness,.8);asset.scene.children[0].geometry.dispose();asset.scene.children[0].material.dispose();
const url='https://mergestars.com/api/catalog/public/items/20000000-0000-4000-8000-000000000001/model3d',signal=new AbortController().signal;
const loaded=await loadCoreGLB(url,signal,async(path,options)=>{assert.equal(path,'/api/core/model?id=20000000-0000-4000-8000-000000000001');assert.equal(options.credentials,'same-origin');assert.equal(options.redirect,'manual');return new Response(bytes);});assert.equal(loaded.byteLength,bytes.byteLength);
await assert.rejects(()=>loadCoreGLB('https://untrusted.example/model.glb',signal));
await assert.rejects(()=>loadCoreGLB(url,signal,async()=>new Response('',{status:302,headers:{location:'https://untrusted.example/'}})));
await assert.rejects(()=>loadCoreGLB(url,signal,async()=>new Response(new Uint8Array(MAX_CORE_MODEL_BYTES+4))),/TOO_LARGE/);
const ui=await readFile(new URL('../components/core-model-viewer.tsx',import.meta.url),'utf8');assert(ui.includes('import("@/lib/core-model-scene")'));assert(ui.includes('value.dispose()'));assert(ui.includes('setReady(true)'));assert(ui.indexOf('await runtime.createCoreModelStage')<ui.indexOf('setReady(true)'));
console.log('PASS: real glTF loader reads test geometry/PBR material; embedded texture references supported; external resources/redirects/compressed unknowns/cycles/oversize blocked; source-only loading; READY follows actual stage creation. This is not browser texture or real CORE/Meshy E2E.');
