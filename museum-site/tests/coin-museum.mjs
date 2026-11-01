import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){
  const cache=new Map();
  function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);
    const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
    new Function('require','module','exports',code)(name=>{
      if(name in overrides)return overrides[name];
      if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx','.mjs'].map(ext=>target+ext).find(existsSync);if(!target)throw new Error('Missing test dependency '+name);return load(path.relative(root,target));}
      return require(name);
    },module,module.exports);return module.exports;
  }return load;
}
const load=loader(),domain=load('lib/coin-museum.ts'),city=load('lib/megapolis-domain.ts'),core=load('lib/core-contract.ts');
const creation=load('lib/private-creation-path.ts');
assert.deepEqual(creation.privateCreationPath.map(step=>step.id),['home','transport','fashion']);
for(const step of creation.privateCreationPath)for(const option of step.options){
  const target=creation.privateCreationTarget(option.house,option.categoryIndex);
  assert(target,'Every guided option resolves an existing category');
  assert(city.cityHouses.find(house=>house.id===target.house).categories.includes(target.category));
}
assert.equal(creation.privateCreationTarget('interior',999),null);
assert.equal(creation.privateCreationPath[1].options.filter(option=>option.house==='mobility').length,3);
assert(creation.privateCreationPath[2].options.some(option=>option.house==='watches'));
const productLaw=load('lib/coin-product-law.ts');assert.equal(productLaw.coinProductLaw.gold.productsPerCase,12);assert.equal(productLaw.coinProductLaw.silver.productsPerCase,1);assert.equal(productLaw.coinProductLaw.silver.brandLineSlots,12);assert.equal(productLaw.coinProductLaw.firstCohort.registrationLimit,1000);assert.equal(productLaw.coinProductLaw.firstCohort.registrationIsPayment,false);assert.equal(productLaw.coinProductLaw.firstCohort.funding,"VERIFIED_AVAILABLE_COMMISSION");assert.equal(productLaw.coinProductLaw.planningRequiresPayment,false);assert.equal(productLaw.coinProductLaw.gold.brandLineSlots,12);assert.equal(productLaw.coinProductLaw.gold.totalCompositeGrams,1000);assert.equal(productLaw.coinProductLaw.gold.allSlotsTogether,true);assert.equal(productLaw.coinProductLaw.silver.productsPerCoin,1);assert.equal(productLaw.coinProductLaw.silver.totalCompositeGrams,null);
const plan=productLaw.draftCasePlan([{id:'qa-a',intent:{coin_line:'GOLD'}},{id:'qa-b',intent:{coin_line:'SILVER'}},{id:'qa-a',intent:{coin_line:'GOLD'}}],['qa-a','qa-a','qa-b','unknown-owner-record']);assert.equal(plan.gold,1);assert.equal(plan.silver,1);assert.equal(plan.total,2);assert.equal(plan.confirmedCoins,null);for(const key of ['paymentVerified','orderCreated','productionAuthorized'])assert.equal(plan[key],false);
assert.equal(productLaw.draftCasePlan([],['qa-a']).total,0);assert.equal(productLaw.draftCasePlan([{id:'qa-a',intent:{coin_line:'GOLD'}}],[]).total,0);
assert.equal(plan.goldPackagesRequired,null);assert.equal(plan.goldWeightVerified,false);assert.equal(plan.silverCoinsPlanned,1);
const many=Array.from({length:13},(_,i)=>({id:'qa-gold-'+i,intent:{coin_line:'GOLD'}}));const over=productLaw.draftCasePlan(many,many.map(x=>x.id));assert.equal(over.goldExceedsSinglePackageSlots,true);assert.equal(over.goldPackagesRequired,null,'slot count alone cannot establish package quantity when weights are unknown');
assert.equal(city.cityHouses.length,12);assert.equal(new Set(city.cityHouses.map(h=>h.id)).size,12);
assert.deepEqual(domain.coinMuseumLines.map(x=>[x.line,x.minimum]),[['GOLD',1],['SILVER',1]]);
assert(domain.coinMuseumLine('GOLD').basis.includes('ოქროს LIVE კურსი'));
assert(domain.coinMuseumLine('SILVER').basis.includes('ვერცხლის LIVE კურსი'));
assert.equal(domain.coinMuseumLine('GOLD').creation,'1 GOLD COIN = 12 BRAND LINES');assert(domain.coinMuseumLine('GOLD').capacity.includes('1,000 გ'));assert.equal(domain.coinMuseumLine('SILVER').creation,'1 SILVER COIN = 12 BRAND LINES');assert(!/1,000|1000/.test(domain.coinMuseumLine('SILVER').capacity),'Gold package limits must not become Silver policy');
// Explicit local QA intent, not a real owner, Product ID, Coin or generation job.
const intent={experience_house_id:'games',experience_category:city.cityHouses.find(h=>h.id==='games').categories[0],coin_line:'GOLD',description:'QA chess design with separate modular pieces.',material_preference:{base_filament:'PLA',precious_metal:'gold',integration:'mosaic',intended_use:'QA game pieces',details:''}};
assert(domain.museumDesignIntentSchema.safeParse(intent).success);
assert(domain.prepareMuseumDesignBrief(intent).includes('მხოლოდ მოთხოვნის მონახაზი'));
assert(domain.prepareMuseumDesignBrief(intent).includes('GOLD COIN CASE = 12 PRODUCTS'));
assert(domain.prepareMuseumDesignBrief(intent).includes('GOLD პაკეტი და ფიზიკური ქეისი: 12 ნივთი'));
const preview=load('components/gold-package-preview.tsx').GoldPackagePreview;
const packageHtml=renderToStaticMarkup(createElement(preview,{language:'en',confirmed:true,payment_verified:true}));assert.equal((packageHtml.match(/data-planning-slot=/g)||[]).length,12);assert(packageHtml.includes('Line 01')&&packageHtml.includes('Line 12'));assert(packageHtml.includes('CORE CONFIRMATION PENDING'));assert(packageHtml.includes('PREVIEW_ONLY'));assert(!packageHtml.includes('data-package-state="CONFIRMED"'));assert(packageHtml.includes('CORE confirms eligibility'));assert(packageHtml.includes('GOLD COIN CASE = 12 PRODUCTS'));const silverPreview=load('components/gold-package-preview.tsx').CoinPackagePreview;const silverHtml=renderToStaticMarkup(createElement(silverPreview,{line:'SILVER',language:'en',confirmed:true,payment_verified:true}));assert.equal((silverHtml.match(/data-planning-slot=/g)||[]).length,12);assert(silverHtml.includes('SILVER COIN CASE = 1 PRODUCT'));assert(!silverHtml.includes('1,000 g'),'Silver has twelve lines, not the Gold manufacturing cap');assert(silverHtml.includes('PREVIEW_ONLY'));assert(!/83\.33|83,33/.test(packageHtml),'no equal per-item weight is invented');
for(const patch of [{experience_house_id:'invented'},{experience_category:'ტანსაცმელი'},{coin_line:'PAID'},{description:'   '},{description:'x'.repeat(3001)},{core_house_id:'forged'},{core_product_id:'forged'},{coin_quantity:1},{weight_g:1000},{payment_verified:true},{generation_status:'READY'}])assert.equal(domain.prepareMuseumDesignBrief({...intent,...patch}),null,'forged or invalid intent must fail: '+Object.keys(patch));
assert.equal(domain.prepareMuseumDesignBrief({...intent,coin_line:'SILVER'}),null,'metal and line mismatch cannot pass');
assert(domain.prepareMuseumDesignBrief({...intent,coin_line:'SILVER',material_preference:{...intent.material_preference,precious_metal:'silver'}}));
for(const patch of [{density:1.2},{metal_percentage:33.3},{approved:true},{material_id:'fake'}])assert.equal(domain.prepareMuseumDesignBrief({...intent,material_preference:{...intent.material_preference,...patch}}),null);
assert(core.coreDependencies.includes('coin-access'));
for(const capability of ['coin-access','brand-house','generate'])assert.equal(core.unavailableCoreCapability(capability).available,false);

// Even a forged browser read cannot open generation or certify Coin ownership.
const uiLoad=loader({'@/components/core-context':{useCoreRead:()=>({data:{available:true,coin_quantity:1,payment_verified:true,core_house_id:'forged'},retry(){}})}});
const ui=uiLoad('components/coin-brand-museum.tsx');
const html=renderToStaticMarkup(createElement(ui.BrandMuseumAtelier,{line:'GOLD',intent:{house:intent.experience_house_id,category:intent.experience_category,description:intent.description,material:intent.material_preference},onIntent(){},onLine(){},signedIn:true,onIdentity(){},onRules(){}}));
assert(/<button[^>]*disabled=""[^>]*>[\s\S]*?3D გენერაცია — დაკავშირების მოლოდინში/.test(html));
assert(!html.includes('forged'));
assert(html.includes('პოლიმერის ოჯახი'));assert(html.includes('მოთხოვნის მონახაზის კოპირება'));
const policy=load('components/entry-payment-law.tsx');
const policyHtml=renderToStaticMarkup(createElement(policy.EntryPaymentLaw));
for(const copy of ['Silver Line','Gold Line','LIVE value of 1 kg of silver','LIVE value of 1 kg of gold','LIVE snapshot','first 1,000','REGISTERED ≠ ORDERED ≠ PAID','Every successfully generated item','REGISTRATION PENDING'])assert(policyHtml.includes(copy),'Entry policy copy missing: '+copy);
const policyText=policyHtml.replace(/<[^>]*>/g,'').replace(/\s+/g,' ');
assert(policyText.includes('GOLD &amp; SILVER · one allocation rule'));assert(policyText.includes('GOLD COIN CASE = 12 PRODUCTS'));assert(policyText.includes('1 GOLD COIN = 12 BRAND LINES'));assert(policyText.includes('1 SILVER COIN = 12 BRAND LINES'));assert(policyText.includes('1,000 g'));assert(policyText.includes('PAY LATER'));assert(!policyText.includes('ტევადობის გადაჭარბებისას'));

// The two explicit Founder examples must balance in cents and percentages.
// These are never calculated from a live reference or exposed as payable offers.
const financial=load('lib/founder-payment-law.ts'),law=financial.founderPaymentLaw;
assert.equal(law.allocations.reduce((sum,row)=>sum+row.basisPoints,0),10000);
assert.equal(law.sameHouseBrandShareBasisPoints,3300);assert.equal(law.separatePlatformFeeBasisPoints,200);
assert.equal(law.status,'SPECIFICATION_ONLY');assert.equal(law.payable,false);assert.equal(law.verifiedOffer,false);assert.equal(law.taxStatus,'CORE_TAX_TREATMENT_PENDING');
for(const [line,expectedBase,expectedFee,expectedSubtotal] of [['SILVER',200000,4000,204000],['GOLD',13000000,260000,13260000]]){
 const ex=financial.commercialIllustrations[line];assert.equal(ex.baseMinor,expectedBase);assert.equal(ex.platformFeeMinor,expectedFee);assert.equal(ex.subtotalBeforeVatMinor,expectedSubtotal);
 assert.equal(law.allocations.reduce((sum,row)=>sum+ex[row.key],0),ex.baseMinor);
 for(const row of law.allocations)assert.equal(ex[row.key]*10000,ex.baseMinor*row.basisPoints);
 assert.equal(ex.source+ex.destination,ex.baseMinor*33/100,'the same House has a combined 33%, not 66%');
 assert.equal(ex.platformFeeMinor*100,ex.baseMinor*2);assert.equal(ex.baseMinor+ex.platformFeeMinor,ex.subtotalBeforeVatMinor);
}
for(const copy of ['16.5%','33%','1%','2%','100%','AVAILABLE','first 1,000 registrations','VAT','actual customer sales'])assert(policyText.includes(copy),'Current payment law missing '+copy);
for(const old of ['25% Source','50% · Source','P + P','+100%','1 MERGE COIN CASE = 1 PRODUCT'])assert(!policyText.includes(old),'Superseded active rule '+old);
assert.equal((policyHtml.match(/data-planning-slot=/g)||[]).length,24,'both lines show twelve unconfirmed places');
assert.equal(plan.goldCasesRequired,null);assert.equal(plan.totalCasesRequired,null,'unknown Gold weights cannot certify total physical case count');assert.equal(plan.silverCasesPlanned,1);
assert.equal(productLaw.draftCasePlan([{id:'silver-only',intent:{coin_line:'SILVER'}}],['silver-only']).totalCasesRequired,1);
const transparency=renderToStaticMarkup(createElement(load('app/transparency/page.tsx').default));
for(const copy of ['33% კომპანია','1% ფიზიკური მშენებლობა','პლატფორმის 2%','AVAILABLE'])assert(transparency.includes(copy));
assert(!transparency.includes('2 კგ ვერცხლის ღირებულების საფუძვლით'));

// Central API denies unconnected Coin/generation reads and all writes.
let authenticated=true,origin=true;
const api=loader({'@/lib/api-guards':{apiJson:(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}}),requireApiIdentity:async()=>authenticated,sameOriginWrite:()=>origin}})('app/api/core/[operation]/route.ts');
for(const operation of ['coin-access','brand-house','generate']){const response=await api.GET(new Request('https://museum.example/api/core/'+operation),{params:Promise.resolve({operation})});assert.equal(response.status,503);const data=await response.json();assert.equal(data.error,'CORE_DEPENDENCY_REQUIRED');assert.equal(data.available,false);}
let denied=await api.POST(new Request('https://museum.example/api/core/generate',{method:'POST',body:JSON.stringify({payment_verified:true,coin_quantity:1})}));assert.equal(denied.status,503);const body=await denied.json();for(const key of ['model_generated','order_created','payment_verified','production_authorized'])assert.equal(body[key],false);
authenticated=false;assert.equal((await api.POST(new Request('https://museum.example/api/core/generate',{method:'POST'}))).status,401);
authenticated=true;origin=false;assert.equal((await api.POST(new Request('https://museum.example/api/core/generate',{method:'POST'}))).status,403);
console.log('PASS: 12 distinct House directions, separate Coin lines, bounded matching design intent, forged Coin/weight/approval rejected, browser flags cannot enable generation, and central API auth/origin/fail-closed boundaries. Real CORE/Meshy E2E not asserted.');
