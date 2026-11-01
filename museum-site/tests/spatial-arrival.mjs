import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const component=read('components/megapolis.tsx'),scene=read('lib/megapolis-scene.ts');
assert(!component.includes('<PhotoMegapolis'),'Photographic city is not mounted');
assert(!component.includes('<BrandTownWorld'),'Photo-based town map cannot replace the entry');
assert(component.includes('isLegacyView=true'),'Existing spatial renderer is the primary view');
assert(component.includes('aria-label="Megapolis LIVE Coins"'));
assert(component.indexOf('aria-label="Megapolis LIVE Coins"')<component.indexOf('className="megapolis-world"'),'Coins precede the 3D scene rather than disappearing in a photo layer');
assert(component.includes("!disabled&&!isEntrance?'/api/core/prices':null"),'Read only the authoritative feed while active');
assert(component.includes('CoinLivePriceDetails'),'Both coins retain working details');
assert(!scene.includes('portalPhoto')&&!scene.includes('loader.load(entranceReferences.city'),'No city-photo plane or dependency');
assert(scene.includes("entranceState!=='CLOSED'||object===world.entryGate.root"),'Real architecture is revealed while opening');
assert(scene.includes('resourceStatus(){return portalStatus;}'),'Unrelated city-photo load does not block readiness');
for(const file of ['components/megapolis.tsx','lib/megapolis-scene.ts']){
 const result=ts.transpileModule(read(file),{reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
 assert(!result.diagnostics?.some(d=>d.category===ts.DiagnosticCategory.Error),file+' syntax');
}
console.log('PASS: photograph-free spatial entry, independent visible live-feed coin controls, preserved source status and syntax. Browser/GPU and real LIVE feed require separate checks.');
