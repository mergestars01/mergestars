import {readFileSync,writeFileSync,readdirSync,mkdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import path from 'node:path';
const target='docs/v25';mkdirSync(target,{recursive:true});
const digest=data=>createHash('sha256').update(data).digest('hex');
function metadataModule(file){const module={exports:{}};new Function('module','exports',ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(module,module.exports);return module.exports;}
const {worldScenes}=metadataModule('lib/unified-world.ts');
const sceneMap=worldScenes.flatMap(scene=>[scene.id,...scene.aliases].map(id=>({scene:id,canonical_scene:scene.id,title:scene.title,action:scene.action,reference_image:scene.image,state:scene.availability,duplicate_core:false})));
writeFileSync(target+'/scene-map.json',JSON.stringify({scope:'PRESENTATION_ROUTES_NOT_CORE_IDS',scenes:sceneMap},null,2)+'\n');
const original=new Map(execFileSync('git',['ls-tree','-r','HEAD','public/assets/'],{encoding:'utf8'}).trim().split('\n').filter(Boolean).map(line=>{const [meta,name]=line.split('\t');return [name,meta.split(' ')[2]];}));
const assets=readdirSync('public/assets',{recursive:true}).filter(name=>!name.split(path.sep).some(p=>p.startsWith('.'))&&statSync(path.join('public/assets',name)).isFile()).sort().map(name=>{
 const file='public/assets/'+name,data=readFileSync(file),url='/assets/'+name,sha=digest(data),baseline=original.get(file),gitSha=createHash('sha1').update('blob '+data.byteLength+'\0').update(data).digest('hex');
 return {file,url,bytes:statSync(file).size,sha256:sha,source_filename:name,preserved_from_baseline:!!baseline&&baseline===gitSha,canonical_identity_asset:name==='official-company-logo.svg'||name==='official-aurum-argentum.png',reference_scenes:sceneMap.filter(s=>s.reference_image===url).map(s=>s.scene),approval_state:name==='official-company-logo.svg'||name==='official-aurum-argentum.png'?'CANONICAL_COMPANY_IDENTITY':'EXISTING_PRESENTATION_ASSET_APPROVAL_NOT_INFERRED',core_product_id:null,model_3d:/\.(glb|gltf)$/i.test(name),commercial_authority:false};
});
const identity=assets.filter(a=>a.canonical_identity_asset),changed=assets.filter(a=>!a.preserved_from_baseline),missing=[...original.keys()].filter(file=>!assets.some(a=>a.file===file));
if(changed.length||missing.length)throw Error('A baseline asset changed or disappeared: '+[...changed.map(a=>a.file),...missing].join(', '));
writeFileSync(target+'/asset-manifest.json',JSON.stringify({baseline:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),asset_count:assets.length,all_baseline_assets_preserved:true,identity,assets},null,2)+'\n');
writeFileSync(target+'/identity-report.json',JSON.stringify({canonical_logo_unchanged:identity.every(a=>a.preserved_from_baseline),assets:identity,generated_replacement_logo:false,raster_reference_marks_are_not_company_identity:true,public_partner_authorization_inferred:false},null,2)+'\n');
const routeMap=[
 ['Identity / session','Existing Site sign-in + /api/core/identity','Site session is not a proven shared MERGE CORE session','BLOCKED'],
 ['Brand House / Brand Lines','Existing CORE identity / approved House creation contract','No House creation contract available; never create a second House database','BLOCKED'],
 ['Catalog / source','/api/core/catalog; existing collection and item read relay','Existing validated public CORE records only','CONTRACT_IMPLEMENTED'],
 ['GLB / GLTF','/api/core/model; existing bounded model relay','Real CORE source URL, UUID and streamed asset validation','CONTRACT_IMPLEMENTED'],
 ['Fit Profile','Existing MeasurementMap and CORE read boundary','Preparation retained; authoritative Fit revision write unavailable','PARTIAL'],
 ['Private design brief','/api/atelier','Existing authenticated preparation store, not CORE product or order','IMPLEMENTED'],
 ['House layout study','Session-scoped memory; explicit JSON export/import','Coordinates and visual preferences only; no CORE IDs or commercial fields','IMPLEMENTED'],
 ['Generation / new version','Existing authorized CORE POST boundary','503 until approved CORE/Meshy contract and server secret are available','BLOCKED'],
 ['Materials / price','Existing MaterialReferenceLibrary and /api/core/prices','No new formula, live-price provider or certified batch invented','PARTIAL'],
 ['Orders / payment / production / QC / Passport','Existing CommercialReadiness / CORE boundary','No verified offer, order, settlement or manufacturing status fabricated','BLOCKED'],
 ['AI / social','Existing PersonalMergeAI preparation and provider handoff UI','No duplicate manager; external chat and account connections require providers','PARTIAL'],
 ['QR / public House','Existing CORE attribution and publication boundary','Layout file is not QR, ownership or publication evidence','BLOCKED'],
];
writeFileSync(target+'/core-route-map.json',JSON.stringify({single_system_of_record:'MERGE_CORE',database_changes:[],routes:routeMap.map(([capability,route,boundary,status])=>({capability,route,boundary,status}))},null,2)+'\n');
console.log(JSON.stringify({assets:assets.length,preserved:assets.filter(a=>a.preserved_from_baseline).length,models_3d:assets.filter(a=>a.model_3d).length,scene_routes:sceneMap.length,canonical_destinations:worldScenes.length,identity_unchanged:identity.every(a=>a.preserved_from_baseline)}));
