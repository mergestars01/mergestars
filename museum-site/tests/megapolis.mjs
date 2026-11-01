import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import * as THREE from 'three';
import { cityHouses, cityStart, walkCity, themeBuildings, brandBuildings, plantFacts, buildingPosition, cityChurch } from '../lib/megapolis-domain.ts';
import { buildMegapolisGeometry, projectCityMarkers } from '../lib/megapolis-scene.ts';
import { coreDependencies, unavailableCoreCapability } from '../lib/core-contract.ts';
import { coreReadCode } from '../lib/core-read-state.ts';

const collection=(id,slug,brandLineId,category,visibility='PUBLIC')=>({id,slug,title:slug,brandLineId,category,brandName:brandLineId==='line-A'?'Brand A':'Brand B',visibility,updatedAt:'2026-10-11T00:00:00Z'});
const records=[collection('1','one','line-A','Games'),collection('2','two','line-A','Mosaic'),collection('3','three','line-B','Robotics'),collection('4','unknown',null,'Fashion'),collection('5','private','line-private','Games','PRIVATE')];
const brands=brandBuildings([...records,records[0]]);
assert.deepEqual(brands.map(brand=>brand.brandLineId),['line-A','line-B']);
assert.deepEqual(brands[0].collectionSlugs,['one','two'],'one public CORE line may have multiple collections without duplicate Houses');
assert(!brands.some(brand=>brand.collectionSlugs.includes('private')),'private content cannot enter public streets');
assert(!brands.some(brand=>brand.key.includes('Brand A')),'identity comes from the CORE line ID, not a display name');
assert.equal(themeBuildings(records).find(house=>house.houseId==='mosaic').collectionSlugs[0],'two');
assert.equal(themeBuildings([collection('6','smart',null,'Smart Technology')]).find(house=>house.houseId==='art').collectionSlugs.length,0,'whole category terms prevent false Art matches');
assert.equal(new Set(cityHouses.map(house=>house.id)).size,cityHouses.length);
assert(cityHouses.find(house=>house.id==='games').categories.some(label=>label.includes('ქსოვილის')));
assert(!cityHouses.find(house=>house.id==='fashion').categories.some(label=>/წინდ|კოლგოტ/.test(label)));
let position={...cityStart};for(let i=0;i<2000;i++)position=walkCity(position,1,0,.016);assert.equal(position.z,-38);
for(let i=0;i<2000;i++)position=walkCity(position,-1,0,.016);assert.equal(position.z,40);
let left={...cityStart};for(let i=0;i<15;i++)left=walkCity(left,0,-1,.016);left=walkCity(left,1,0,.05);assert(left.x<0,'left turn must move toward the left side of the street');
assert.deepEqual(walkCity(cityStart,Infinity,0,.01),cityStart);
assert.deepEqual(walkCity(cityStart,1,0,100),walkCity(cityStart,1,0,.05),'tab resume cannot teleport through buildings');
assert.equal(plantFacts.estimatedWeight,'CALCULATION PENDING');assert.equal(plantFacts.commercialEnabled,false);assert.equal(plantFacts.displayScale,'EXHIBITION_ONLY');
for(let i=0;i<12;i++){const [x]=buildingPosition(i);assert(Math.abs(x)-6>8,'street movement bounds must remain outside all House footprints');}
const world=buildMegapolisGeometry(themeBuildings(records),'woman');assert.equal(world.entrances.length,14);assert(world.root.getObjectByName('MOSAIC HOUSE'));assert(world.root.getObjectByName('GAME HOUSE'));assert.equal(world.avatar.userData.presentation,'woman');
const manWorld=buildMegapolisGeometry(themeBuildings(records),'man');assert.equal(manWorld.avatar.userData.presentation,'man');assert.notEqual(manWorld.avatar.name,world.avatar.name);
assert.equal(world.church.userData.buildingKey,cityChurch.key);assert.equal(world.church.position.x,cityChurch.x);assert(world.markers.some(marker=>marker.key===cityChurch.key));
for(const house of themeBuildings(records))assert(world.markers.some(marker=>marker.key===house.key),'every scene House has a marker tied to the same identity');
const camera=new THREE.PerspectiveCamera(57,1,.2,200);camera.position.set(0,3,12);camera.lookAt(0,3,0);
const markers=projectCityMarkers(camera,[{key:'front',point:new THREE.Vector3(0,3,0)},{key:'behind',point:new THREE.Vector3(0,3,24)},{key:'offscreen',point:new THREE.Vector3(500,3,0)}]);
assert.equal(markers[0].visible,true);assert(Math.abs(markers[0].x-50)<.01);assert.equal(markers[1].visible,false);assert.equal(markers[2].visible,false);
for(const name of ['chat','comments']){assert(coreDependencies.includes(name));assert.equal(unavailableCoreCapability(name).available,false);}
assert.equal(coreReadCode('CORE_DEPENDENCY_REQUIRED'),'CORE_DEPENDENCY_REQUIRED','missing contracts must be distinguished from an offline CORE');
let meshes=0;world.root.traverse(object=>{if(object.isMesh){meshes++;const positions=object.geometry.getAttribute('position');for(const value of positions.array)assert(Number.isFinite(value));}});assert(meshes<500,'presentation geometry must stay bounded');
const hash=value=>createHash('sha256').update(value).digest('hex');
for(const asset of ['merge-mark.png','merge-wordmark.png','approved-mega-museum.png','entrance.png','entrance-dual.png','eyewear.png','coin-case.png']){const current=await readFile(new URL('../public/assets/'+asset,import.meta.url));const original=execFileSync('git',['show','c60de1c988769823f16425f471bdbcde494cd8fd:public/assets/'+asset],{maxBuffer:20*1024*1024});assert.equal(hash(current),hash(original),'approved asset preserved: '+asset);}
const ui=await readFile(new URL('../components/megapolis.tsx',import.meta.url),'utf8');assert(!/localStorage|sessionStorage|POST|\/api\/(orders|payments)/.test(ui),'city must not create a duplicate CORE database or payment flow');
const community=await readFile(new URL('../components/core-community.tsx',import.meta.url),'utf8');assert(!/localStorage|sessionStorage|method:\s*['\"]POST/.test(community));
console.log('PASS: CORE Brand Line grouping/privacy, HOUSE taxonomy, avatar bounds, no invented weight, true Three geometry, Georgian church landmark, identity-linked arrows/front-back projection, community fail-closed boundaries, canonical assets and no duplicate storage/payments. Browser/GPU and real CORE staging are not asserted.');
