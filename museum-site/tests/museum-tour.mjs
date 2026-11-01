import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { catalog } from '../lib/museum-domain.ts';
import { enterMuseum, approachMuseumPoint, getMuseumPoint, getMuseumScenePoint, museumScenePoints, museumScenes, moveMuseumPoint, openMuseumExhibit, returnToMuseum, pointForMuseumReference, museumPoints, museumScene } from '../lib/museum-tour.ts';
import { sceneCamera, zoomScene, panScene } from '../lib/scene-camera.ts';

const entry=enterMuseum();
assert.deepEqual(entry,{kind:'house',point_id:'overview',camera:{x:50,y:50,zoom:1}},'Door opens the whole house');
assert.equal(museumScene.image,'/assets/museum-world.png');
assert.equal(getMuseumPoint(entry.point_id).source_reference_id,null,'Entry selects no eyewear or product');
assert.throws(()=>openMuseumExhibit(entry,'MERGE-EYE-001'),'Entry cannot auto-open eyewear');
assert.throws(()=>openMuseumExhibit(approachMuseumPoint('watches'),'MERGE-EYE-001'),'Unmapped visual cannot enter a product flow');
assert.throws(()=>openMuseumExhibit(approachMuseumPoint('eyewear'),'MERGE-CASE-001'),'References cannot be silently swapped');
assert.equal(getMuseumPoint('watches').source_reference_id,null,'No fabricated watch product');

const seen=new Set([entry.point_id]);let view=entry;
for(let i=0;i<museumPoints.length;i++){view=moveMuseumPoint(view.point_id,1);seen.add(view.point_id);assert.equal(view.kind,'house');assert.equal('room_id' in view,false);assert.equal('source_reference_id' in view,false,'Approaching never automatically opens a product');}
assert.equal(seen.size,museumPoints.length,'Every exhibit anchor reachable in the same scene');
assert.deepEqual(view,entry,'Navigation cycle returns to the whole-house view');
assert.equal(moveMuseumPoint('overview',-1).point_id,museumPoints.at(-1).id);
for(const id of ['art','music','stationery','fashion','watches','jewelry','automotive','bathroom','furniture','dining','games','decor','technology','eyewear','case']) assert(seen.has(id));
for(const point of museumPoints){
  assert(Object.isFrozen(point)&&Object.isFrozen(point.camera));
  assert(point.x>=0&&point.x<=100&&point.y>=0&&point.y<=100);
  assert.deepEqual(sceneCamera(point.camera),point.camera,'Each destination camera is inside the same source image');
  assert.equal('price' in point,false);assert.equal('product_id' in point,false);assert.equal('weight_g' in point,false);
  if(point.preview_image) await access(new URL('../public'+point.preview_image,import.meta.url));
  if(point.source_reference_id) assert(catalog.some(product=>product.product_id===point.source_reference_id),'Only retained concept references');
}
await access(new URL('../public'+museumScene.image,import.meta.url));
for(const product of catalog){
  const point=pointForMuseumReference(product.product_id);
  const approach=approachMuseumPoint(point.id);
  approach.camera=panScene(zoomScene(approach.camera,.2),12,-18,1000,667);
  const snapshot=structuredClone(approach);
  const exhibit=openMuseumExhibit(approach,product.product_id);
  assert.equal(exhibit.kind,'exhibit');assert.equal(exhibit.source_reference_id,product.product_id);
  assert.deepEqual(returnToMuseum(exhibit),snapshot,'Return preserves the exact vitrine, zoom and pan');
  assert.deepEqual(approach,snapshot,'Source view is never overwritten');
  assert.notEqual(exhibit.camera,approach.camera,'Views do not share a mutable camera');
}
assert.throws(()=>getMuseumPoint('unknown'));assert.throws(()=>moveMuseumPoint('overview',2));assert.throws(()=>moveMuseumPoint('unknown',1));assert.throws(()=>pointForMuseumReference('invented-product'));
const overview=sceneCamera({x:4,y:98,zoom:1});assert.deepEqual(overview,{x:50,y:50,zoom:1});
assert.equal(zoomScene(overview,99).zoom,3);assert.deepEqual(zoomScene(overview,-99),overview);
const close=sceneCamera({x:50,y:50,zoom:2});assert.deepEqual(panScene(close,100,50,1000,500),{x:45,y:45,zoom:2});
assert.deepEqual(panScene(close,1e6,-1e6,1000,500),{x:25,y:75,zoom:2},'Camera cannot expose outside the source image');
assert.throws(()=>sceneCamera({x:NaN,y:50,zoom:2}));assert.throws(()=>panScene(close,1,1,0,500));assert.throws(()=>zoomScene(close,Infinity));
for(const sceneId of ['house','coin']){
  const points=museumScenePoints(sceneId), reached=new Set();let current=approachMuseumPoint('overview',sceneId);
  for(let i=0;i<points.length;i++){reached.add(current.point_id);current=moveMuseumPoint(current.point_id,1,sceneId);assert.equal(current.kind,'house');assert.equal('source_reference_id' in current,false);}
  assert.equal(reached.size,points.length);assert.equal(current.point_id,'overview');
  for(const point of points){assert(Object.isFrozen(point)&&Object.isFrozen(point.camera));assert.deepEqual(sceneCamera(point.camera),point.camera);assert.equal(getMuseumScenePoint(sceneId,point.id),point);}
  await access(new URL('../public'+museumScenes[sceneId].image,import.meta.url));
  for(const product of catalog){const place=approachMuseumPoint(pointForMuseumReference(product.product_id).id,sceneId);assert.deepEqual(returnToMuseum(openMuseumExhibit(place,product.product_id)),place);}
}
assert.throws(()=>approachMuseumPoint('motorcycles','house'));assert.throws(()=>approachMuseumPoint('bathroom','coin'));assert.throws(()=>museumScenePoints('fake'));
assert.equal(getMuseumScenePoint('coin','watches').source_reference_id,null);
assert.notDeepEqual(getMuseumScenePoint('coin','watches').camera,getMuseumScenePoint('house','watches').camera,'Each photograph keeps its own anchor, never guessed product data');
console.log('PASS: whole-house entry, no automatic eyewear, point-to-point navigation in one scene, explicit existing concept selection, exact camera restoration, no invented watch/price/weight, bounded 2D camera.');
