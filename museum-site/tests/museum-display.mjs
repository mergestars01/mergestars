import assert from 'node:assert/strict';
import {spatialExhibits,spatialNodes,enterSpatialMuseum,routeSpatial,walkSpatial,approachSpatial,closeSpatial,lookSpatial,projectSpatial} from '../lib/museum-spatial.ts';
import {displayShape,displayYaw,triangulateOutline,insideOutline,pickMuseumExhibit,pickMuseumNode,navigationTarget} from '../lib/museum-display.ts';
import {museumLensShift,museumLensLift,museumPresentationFov,museumFloralDisplays} from '../lib/museum-interior.ts';
function project(position,camera,width,height){const focus=camera.focus??false;return projectSpatial(position,{...camera,fov:museumPresentationFov(camera.fov,focus,width,height,camera.displayBounds)},width/height,museumLensShift(focus,width),museumLensLift(focus,width));}
const polygonArea=points=>Math.abs(points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;
// The actual render outline and hit boundary must agree; a concave image cannot be hit in its discarded background.
for(const exhibit of spatialExhibits){
 const shape=displayShape(exhibit),triangles=triangulateOutline(shape.outline);assert.equal(triangles.length,shape.outline.length-2);
 const total=triangles.reduce((s,tri)=>s+polygonArea(tri.map(i=>shape.outline[i])),0);assert(Math.abs(total-polygonArea(shape.outline))<1e-9,'Display polygon must triangulate without extra background: '+exhibit.id);
 let local=enterSpatialMuseum();for(const n of routeSpatial(local.node,exhibit.node))local=walkSpatial(local,n);
 local={...local,camera:lookSpatial(local.camera,35,-20)};const before=structuredClone(local.camera),focused=approachSpatial(local,exhibit.id);
 // The camera approach must clear every plinth, not only the node-to-node route.
 const a=local.camera.position,b=focused.camera.position,dx=b[0]-a[0],dz=b[2]-a[2];
 for(const other of spatialExhibits){const x=other.position[0],z=other.position[2],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[2])*dz)/(dx*dx+dz*dz||1)));assert(Math.hypot(x-a[0]-t*dx,z-a[2]-t*dz)>1.05,'Exhibit approach intersects a plinth: '+exhibit.id+' / '+other.id);}
 for(const [width,height] of [[1280,800],[900,800],[899,800],[390,650]]){
  // Use an interior point of a real render triangle, not the rectangle around the picture.
  const triangle=triangles.sort((a,b)=>polygonArea(b.map(i=>shape.outline[i]))-polygonArea(a.map(i=>shape.outline[i])))[0],uv=triangle.reduce((p,i)=>[p[0]+shape.outline[i][0]/3,p[1]+shape.outline[i][1]/3],[0,0]);
  assert(insideOutline(...uv,shape.outline));const right=[Math.cos(displayYaw(exhibit)),0,-Math.sin(displayYaw(exhibit))],p=[exhibit.position[0]+(uv[0]-.5)*shape.w*right[0],exhibit.position[1]+(.5-uv[1])*shape.h,exhibit.position[2]+(uv[0]-.5)*shape.w*right[2]],screen=project(p,focused.camera,width,height);
  assert(screen,'Approached silhouette must be visible at each breakpoint: '+exhibit.id);assert.equal(pickMuseumExhibit(focused.camera,screen.x/100,screen.y/100,width,height)?.id,exhibit.id,'Direct object picking failed: '+exhibit.id+' / '+width);
  for(const point of shape.outline){const world=[exhibit.position[0]+(point[0]-.5)*shape.w*right[0],exhibit.position[1]+(.5-point[1])*shape.h,exhibit.position[2]+(point[0]-.5)*shape.w*right[2]],corner=project(world,focused.camera,width,height);assert(corner,'Entire selected image must fit in the camera: '+exhibit.id+' / '+width);if(width<900)assert(corner.y<47,'Mobile contextual sheet must not cover the object');else assert(corner.x<67,'Desktop contextual panel must not cover the object');}
 }
 assert.deepEqual(closeSpatial(focused).camera,before);assert.equal(exhibit.displayScale,'EXHIBITION_ONLY');
}
// Every projected floor arrow can be clicked on the actual ground plane, including after looking around.
let testedArrows=0;
for(const node of spatialNodes)for(const target of node.connected_nodes){let journey=enterSpatialMuseum();for(const n of routeSpatial(journey.node,node.id))journey=walkSpatial(journey,n);const position=navigationTarget(node.id,target),dx=position[0]-journey.camera.position[0],dz=position[2]-journey.camera.position[2];const camera={...journey.camera,yaw:Math.atan2(dx,-dz),pitch:-.2};
 for(const [width,height] of [[1280,800],[390,650]]){const screen=project(position,camera,width,height);assert(screen);assert.equal(pickMuseumNode(camera,screen.x/100,screen.y/100,width,height,node.id),target);testedArrows++;}
 assert.throws(()=>navigationTarget(node.id,node.id));
}
const initial=enterSpatialMuseum();assert.equal(pickMuseumExhibit(initial.camera,-1,.5,1280,800),null);assert.equal(pickMuseumExhibit(initial.camera,.5,.5,0,800),null);assert.equal(pickMuseumNode(initial.camera,.5,0,1280,800,'entry'),null);assert.equal(pickMuseumNode({...initial.camera,pitch:.3},.5,.5,1280,800,'entry'),null);
// Floral decorations must not block a navigation segment or its ground control.
for(const n of spatialNodes)for(const id of n.connected_nodes){const a=n.scene_position,b=spatialNodes.find(v=>v.id===id).scene_position,dx=b[0]-a[0],dz=b[2]-a[2];for(const [x,z] of museumFloralDisplays){const t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[2])*dz)/(dx*dx+dz*dz)));assert(Math.hypot(x-a[0]-t*dx,z-a[2]-t*dz)>1.1,'Room decoration blocks a visitor route');}}
console.log('PASS: 18 concave image boundaries; 72 responsive direct exhibit picks; '+testedArrows+' actual ground arrow picks; exact pose return; clear decorated routes. Pure scene checks, not browser E2E.');
