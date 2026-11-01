import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const code=ts.transpileModule(await readFile(new URL('../lib/draft-contract.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText
  .replace('from "zod"',`from ${JSON.stringify(new URL('../node_modules/zod/index.js',import.meta.url).href)}`)
  .replace('from "./museum-domain"',`from ${JSON.stringify(new URL('../lib/museum-domain.ts',import.meta.url).href)}`);
const {materialPreferenceSchema,configSchema,canonicalDraftPayload,designDraftSchema}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const config={material:'silver',scale:'fine',name:'Material intent'};
const request={base_filament:'Carbon-fiber-filled filament; base polymer to be confirmed',precious_metal:'silver',integration:'blend',intended_use:'Eyewear frame; approved MERGE components only',details:'Manufacturer review requested'};
assert(configSchema.safeParse(config).success,'legacy draft configs remain readable');
assert(materialPreferenceSchema.safeParse(request).success);
for(const patch of [{base_filament:'   '},{precious_metal:''},{precious_metal:'platinum'},{integration:''},{integration:'approved'},{intended_use:''},{base_filament:'x'.repeat(161)},{details:'x'.repeat(501)},{verified:true},{density:1.4},{metal_percentage:33.33},{material_id:'invented'},{weight_kg:1}])assert(!materialPreferenceSchema.safeParse({...request,...patch}).success,'invalid/unverified material facts must not enter a preference');
const input={source_reference_id:'MERGE-EYE-001',parent_draft_id:null,request_id:'10000000-0000-4000-8000-000000000001',config:{...config,material_preference:request}};
const saved={draft_id:'20000000-0000-4000-8000-000000000001',root_reference_id:input.source_reference_id,source_reference_id:input.source_reference_id,parent_draft_id:null,name:config.name,config:input.config,status:'CONCEPT',core_product_id:null,core_house_id:null,generation_status:'NOT_YET_IMPLEMENTED',created_at:'2026-10-11T17:00:00.000Z'};
assert.deepEqual(designDraftSchema.parse(saved).config.material_preference,request,'saved intent survives the existing draft response');
assert(designDraftSchema.safeParse({...saved,config}).success,'old draft responses remain valid');
assert(!designDraftSchema.safeParse({...saved,status:'VERIFIED'}).success);
assert.notEqual(canonicalDraftPayload(input),canonicalDraftPayload({...input,config:{...config,material_preference:{...request,base_filament:'Different base'}}}),'changing material intent changes the idempotency payload');
console.log('PASS: legacy draft compatibility, bounded customer intent, invalid/forged material facts rejected, draft round-trip and material-change idempotency. No manufacturing compatibility or CORE integration asserted.');
