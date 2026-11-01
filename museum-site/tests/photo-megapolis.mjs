import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {photoMegapolis,photoInterfaceMasks,photoDestinations,boundPhotoCamera,initialPhotoCamera,photoPointIsMasked,photoPanelStyle,photoMotionRegions} from '../lib/photo-megapolis.ts';
import {photoFragmentShader} from '../lib/photo-megapolis-renderer.ts';
import {themeBuildings} from '../lib/megapolis-domain.ts';
import {companyIdentity} from '../lib/company-identity.ts';

const image=await readFile(new URL('../public'+photoMegapolis.image,import.meta.url));
assert.equal(createHash('sha256').update(image).digest('hex'),photoMegapolis.sha256,'the actual main scene is the founder image, unchanged');
assert.equal(image.readUInt32BE(16),1536);assert.equal(image.readUInt32BE(20),1024);
for(const [x,y] of [[125,835],[205,866],[1485,230],[1320,1000],[500,22],[1300,880]])assert(photoPointIsMasked(x/1536,y/1024),'artwork UI/account/price pixels must be covered');
for(const [x,y] of [[80,150],[150,235],[760,590],[770,760],[680,400],[210,450]])assert(!photoPointIsMasked(x/1536,y/1024),'core architecture and reference avatar stay visible');
assert.equal(photoInterfaceMasks.length,5);
assert.equal(photoMegapolis.sha256,'cbc414c1b36e7e1ff0752940eaa5ee572ce902d3c5d41a93bc01303f963ccb5e');assert.equal(photoMegapolis.presentation,'ANIMATED_PHOTOGRAPH');assert(photoFragmentShader.includes('uMotion'));
for(const mask of photoInterfaceMasks)assert(photoFragmentShader.includes('p.x>='+mask.x.toFixed(6)),'canvas independently suppresses the fake interface');
for(const zoom of [-100,1,1.1,10,NaN,Infinity])for(const x of [-900,0,900,NaN])for(const y of [-900,0,900,Infinity]){
 const camera=boundPhotoCamera({zoom,x,y});assert(camera.zoom>=1&&camera.zoom<=1.38);assert([camera.zoom,camera.x,camera.y].every(Number.isFinite));assert(Math.abs(camera.x)<=(camera.zoom-1)*50);assert(Math.abs(camera.y)<=(camera.zoom-1)*50);
}
assert.deepEqual(boundPhotoCamera({zoom:1,x:500,y:-500}),initialPhotoCamera,'the original frame has no pan/crop');

for(const mask of photoInterfaceMasks){const style=photoPanelStyle(mask.id);assert.equal(style.left,mask.x*100+'%');assert.equal(style.top,mask.y*100+'%');assert.equal(style.width,mask.w*100+'%');assert.equal(style.height,mask.h*100+'%');}
for(const region of photoMotionRegions){const [x1,y1,x2,y2]=region.bounds;assert(x1>=0&&y1>=0&&x2<=1&&y2<=1&&x1<x2&&y1<y2);assert(region.feather>0);}
assert(photoMotionRegions.filter(r=>r.kind==='cape').length>=2);assert(photoMotionRegions.filter(r=>r.kind==='falls').length>=5);
await assert.rejects(readFile(new URL('../public/assets/founder-megapolis-reference.png',import.meta.url)),{code:'ENOENT'},'the retired main-photo asset is no longer deployed');
const require=createRequire(import.meta.url),modules=new Map();
async function compile(file){const text=await readFile(new URL('../'+file,import.meta.url),'utf8'),compiled=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,module={exports:{}};new Function('require','module','exports',compiled)(name=>modules.has(name)?modules.get(name):require(name),module,module.exports);return module.exports;}
modules.set('@/lib/company-identity',{companyIdentity});modules.set('@/components/company-identity',await compile('components/company-identity.tsx'));
modules.set('@/lib/photo-megapolis',await import('../lib/photo-megapolis.ts'));modules.set('@/lib/photo-megapolis-renderer',await import('../lib/photo-megapolis-renderer.ts'));
modules.set('@/lib/megapolis-domain',await import('../lib/megapolis-domain.ts'));
// Modals are conditional and closed during SSR; never stub the actual routing.
modules.set('./core-contract',await import('../lib/core-contract.ts'));
modules.set('@/lib/coin-sky-prices',await compile('lib/coin-sky-prices.ts'));
modules.set('@/lib/coin-market-disclosure',await compile('lib/coin-market-disclosure.ts'));
modules.set('@/lib/coin-product-law',await compile('lib/coin-product-law.ts'));
modules.set('@/lib/founder-payment-law',await compile('lib/founder-payment-law.ts'));
modules.set('./founder-payment-law',modules.get('@/lib/founder-payment-law'));
modules.set('@/lib/commercial-policy',await compile('lib/commercial-policy.ts'));
modules.set('@/lib/coin-material',await compile('lib/coin-material.ts'));
modules.set('@/lib/commission-coin-scenario',await compile('lib/commission-coin-scenario.ts'));
modules.set('@/components/coin-material-summary',await compile('components/coin-material-summary.tsx'));
modules.set('@/components/commission-coin-scenario',await compile('components/commission-coin-scenario.tsx'));
modules.set('@/components/commercial-allocation-law',await compile('components/commercial-allocation-law.tsx'));
modules.set('@/components/gold-package-preview',await compile('components/gold-package-preview.tsx'));
modules.set('@/components/core-context',{useCoreRead:()=>({retry(){}})});
modules.set('@/components/coin-sky-prices',await compile('components/coin-sky-prices.tsx'));modules.set('@/components/ui/dialog',{});
const {PhotoHouseHotspots,PhotoMegapolis}=await compile('components/photo-megapolis.tsx');
const houses=themeBuildings([]),opened=[];let museums=0,brands=0;
const props={houses,disabled:false,onHouse:house=>opened.push(house.key),onMuseum:()=>museums++,onBrands:()=>brands++};
const tree=PhotoHouseHotspots(props),buttons=[];function visit(node){if(!node||typeof node!=='object')return;if(Array.isArray(node)){node.forEach(visit);return;}if(node.type==='button')buttons.push(node);visit(node.props?.children);}visit(tree);
assert.equal(buttons.length,8);for(const button of buttons)button.props.onClick();assert.equal(museums,1);assert.equal(brands,0);assert.deepEqual(opened,['theme:watches','theme:jewelry','theme:fashion','theme:fashion','theme:interior','theme:art','theme:mobility'],'the pictured car pavilion opens Mobility House, not a fabricated partner or unrelated private brand');
opened.length=0;buttons.length=0;visit(PhotoHouseHotspots({...props,disabled:true}));for(const button of buttons){assert.equal(button.props.disabled,true);button.props.onClick();}assert.equal(opened.length,0);assert.equal(museums,1);assert.equal(brands,0);
const noop=()=>{},callbacks={onHouse:noop,onMuseum:noop,onBrand:noop,onCreate:noop,onIdentity:noop,onMeasurements:noop,onCommunity:noop,onCoinRules:noop,onSaved:noop,onOrders:noop,onPassport:noop,onNature:noop,onChurch:noop};
const html=renderToStaticMarkup(React.createElement(PhotoMegapolis,{active:true,disabled:false,signedIn:false,houses,brands:[],...callbacks}));
assert(html.includes('ANIMATED_PHOTOGRAPH'));assert(html.includes(photoMegapolis.image));assert(html.includes(companyIdentity.mark));
assert(!html.includes('1,890.17')&&!html.includes('62,484.32')&&!html.includes('#0001'),'source artwork values are never rendered as application truth');
for(const house of houses)assert(html.includes(house.title.replace(' HOUSE','')),'every House remains accessible');
assert.equal((html.match(/data-mask=/g)||[]).length,5);
assert(!html.includes('photo-account photo-glass'),'the new left waterfall is not covered by the removed old account card');assert(html.includes('BRAND HOUSES'));assert(html.includes('My space'));assert(html.includes('ANIMATED ARTWORK'));assert(!html.includes('LIVE_3D'));
const ui=await readFile(new URL('../components/megapolis.tsx',import.meta.url),'utf8'),parent=await readFile(new URL('../components/museum.tsx',import.meta.url),'utf8');
// Founder correction: the exact supplied photograph is the primary arrival;
// the retained Three.js city remains an explicit optional walking view.
assert(ui.includes("useState<'photo'|'spatial'>('photo')"),'approved photo is the default arrival');
assert(ui.includes('<PhotoMegapolis active')&&ui.includes('3D walking world'),'primary artwork and existing 3D mode are both reachable');
assert(ui.includes('createMegapolisRenderer(element,buildings')&&ui.includes('cameraMemory.current=renderer.current.cameraSnapshot()'),'preserve renderer and exact camera memory');
assert(ui.includes("renderer.current?.view(churchView?'church':'city')"),'preserve church/city navigation');
assert(parent.includes('onSaved={()=>{setPanel("collection")'));assert(parent.includes('onOrders={()=>setPanel("commercial")}'));assert(parent.includes('onPassport={()=>setPanel("passport")}'));
for(const file of ['lib/photo-megapolis.ts','lib/photo-megapolis-renderer.ts','components/photo-megapolis.tsx']){const source=await readFile(new URL('../'+file,import.meta.url),'utf8');assert(!/localStorage|sessionStorage|indexedDB|CREATE TABLE|payment_verified|MESHY_API_KEY/.test(source),'presentation does not create a second identity/product/payment store');}
console.log('PASS: exact new founder photo/hash; retired image removed; aligned waterfall/cape/globe regions; account card removed; prices/UI suppressed in DOM and canvas; source avatar retained; actual hotspot callbacks and disabled guards; all 12 Houses; bounded original-frame pan/zoom; shared collection/order/passport routes; canonical logo; photographic label and no duplicate CORE. Browser/GPU animation and real CORE are NOT asserted.');
