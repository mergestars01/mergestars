import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import {buildPresentationAvatar} from '../lib/presentation-avatar.ts';
import {advanceAvatar,idleAvatar,gaitTarget,safeCityCamera,defaultCityCamera,snapshotReturn} from '../lib/megapolis-motion.ts';
import {graphicsProfiles,initialGraphics,safeGraphics,createFrameMonitor} from '../lib/megapolis-quality.ts';

let state=idleAvatar();state=advanceAvatar(state,{distance:.1,turn:0,seconds:.016});assert.equal(state.state,'WALK');
state=advanceAvatar(state,{distance:0,turn:0,seconds:.016});assert.equal(state.state,'STOP');
for(let i=0;i<30;i++)state=advanceAvatar(state,{distance:0,turn:0,seconds:.016});assert.equal(state.state,'IDLE');
assert.equal(advanceAvatar(state,{distance:0,turn:-1,seconds:.016}).state,'TURN_LEFT');
assert.equal(advanceAvatar(state,{distance:0,turn:1,seconds:.016}).state,'TURN_RIGHT');
assert.equal(advanceAvatar(state,{distance:0,turn:0,seconds:100,context:'OPEN_DOOR'}).state,'OPEN_DOOR');
assert.equal(advanceAvatar(state,{distance:0,turn:0,seconds:.01,context:'PAID'}).state,'IDLE','presentation cannot create a commercial state');
assert.deepEqual(advanceAvatar(state,{distance:Infinity,turn:0,seconds:NaN}),advanceAvatar(state,{distance:0,turn:0,seconds:0}));
for(let i=0;i<600;i++){const foot=gaitTarget(i*.01,0);assert(foot.lift>=0&&foot.lift<=.096);if(foot.stance)assert.equal(foot.lift,0);}
const position={x:7.2,z:-34,yaw:1.7},camera={...defaultCityCamera,orbit:.4,lift:.2,actualPosition:[8.1,3.2,-30],actualTarget:[7.2,1.8,-34]},snapshot=snapshotReturn(position,camera);position.x=0;camera.orbit=0;assert.equal(snapshot.position.x,7.2);assert.equal(snapshot.camera.orbit,.4);
for(const x of [-8,0,8])for(const z of [-38,0,40])for(let angle=-Math.PI;angle<Math.PI;angle+=.2){const pose=safeCityCamera({x,z,yaw:angle},{orbit:angle,lift:3,distance:99});assert(Math.abs(pose.position[0])<=8.9);assert(pose.position[2]>=-41&&pose.position[2]<=47);assert(pose.position.every(Number.isFinite));}
const strong={maxTexture:8192,cores:16,memory:16,mobile:false};assert.equal(initialGraphics(strong),'HIGH');assert.equal(safeGraphics('ULTRA',strong),'ULTRA');assert.equal(safeGraphics('__proto__',strong),'HIGH');assert.equal(safeGraphics('ULTRA',{maxTexture:2048,cores:2,memory:2,mobile:true}),'PERFORMANCE');
const monitor=createFrameMonitor();let observed=null,activeProfile='HIGH';for(let i=0;i<50;i++){const value=monitor.sample(100+i*100,activeProfile,true);if(value){observed=value;activeProfile=value.profile;}}assert.equal(observed.profile,'BALANCED','real sustained slow frames reduce automatic quality');monitor.reset();assert.equal(monitor.sample(999999,'HIGH',true),null,'a resumed background tab is not a low-FPS measurement');

let highestTriangles=0;
for(const choice of ['woman','man'])for(const quality of Object.keys(graphicsProfiles)){
 const avatar=buildPresentationAvatar(choice,quality);assert.equal(avatar.root.userData.presentation,choice);assert.equal(avatar.root.userData.hasVerifiedMeasurements,false);
 for(let i=0;i<240;i++)avatar.pose({state:'WALK',previous:'IDLE',elapsed:i*.016,distance:0},.016,false);
 const contact=[];
 for(const distance of [.12,.24,.36]){avatar.root.position.z=-distance;avatar.pose({state:'WALK',previous:'WALK',elapsed:1,distance},.016,false);avatar.root.updateMatrixWorld(true);const sole=avatar.legs[0].getObjectByName('Shoe sole');const point=sole.getWorldPosition(new THREE.Vector3());contact.push(point.z);assert(point.y>.055,'planted foot stays above the display floor');}
 assert(Math.max(...contact)-Math.min(...contact)<.001,'stance foot is planted while the character advances');
 let triangles=0,meshes=0;avatar.root.traverse(object=>{if(object.isMesh){meshes++;const positions=object.geometry.getAttribute('position');for(const value of positions.array)assert(Number.isFinite(value));triangles+=(object.geometry.index?.count??positions.count)/3*(object.count??1);}});assert(meshes<65);assert(triangles<100000);highestTriangles=Math.max(highestTriangles,triangles);
}
const ui=await readFile(new URL('../components/megapolis.tsx',import.meta.url),'utf8');assert(!ui.includes('სეირნობა'));assert(ui.includes('onBrand=')&&ui.includes('setBrandMuseumOpen(true)'));assert(ui.includes("key==='e'||key==='enter'"));assert(ui.includes('webglcontextrestored'));assert(ui.includes('returnPoint.current.position'));assert(ui.includes('onPointerMove'));assert(!ui.includes('position.current={x:x<0?'),'map no longer teleports the player');
console.log('PASS: presentation FSM and no commercial promotion; grounded articulated Woman/Man gait; immutable return snapshot; camera stays outside walls/open leaves; four bounded quality profiles, low-FPS adaptation and tab-resume handling; brand, keyboard, swipe and recovery wiring. Max avatar triangles: '+Math.round(highestTriangles)+'. Browser/GPU/real CORE E2E not asserted.');
