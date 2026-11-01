import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const require=createRequire(import.meta.url);
async function load(path,imports={}){const source=await readFile(new URL('../'+path,import.meta.url),'utf8'),mod={exports:{}};const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',code)(name=>imports[name]??require(name),mod,mod.exports);return {source,exports:mod.exports};}
const schema=await load('lib/registration-preparation.ts'),{personalPreparation,deliveryPreparation,purposePreparation}=schema.exports;
// Explicit QA input, never a saved profile or real CORE registration.
const personal={first_name:'QA',last_name:'Fixture',email:'qa@example.test',phone:'+995555000000',country:'GE',region:'QA Region'};
const delivery={country:'GE',region:'QA Region',city:'QA City',street:'QA Street',building:'1',apartment:'',postal_code:'',recipient_name:'QA Fixture',recipient_phone:'+995555000000',instructions:''};
assert(personalPreparation.safeParse(personal).success);assert(deliveryPreparation.safeParse(delivery).success);
for(const field of ['first_name','last_name','email','phone','country','region'])assert(!personalPreparation.safeParse({...personal,[field]:''}).success);
for(const field of ['country','city','street','building','recipient_name','recipient_phone'])assert(!deliveryPreparation.safeParse({...delivery,[field]:''}).success);
assert(!deliveryPreparation.safeParse({...delivery,recipient_phone:'local-phone'}).success);assert(!deliveryPreparation.safeParse({...delivery,instructions:'x'.repeat(501)}).success);
assert(!purposePreparation.safeParse({purpose:'BOTH',confirmed:false}).success);assert(purposePreparation.safeParse({purpose:'BOTH',confirmed:true}).success);
const registration=await load('components/registration-preparation.tsx',{'@/lib/registration-preparation':schema.exports});
const html=renderToStaticMarkup(createElement(registration.exports.RegistrationPreparation,{onPayment(){}}));assert(html.includes('რეგისტრაცია CORE-ის დაკავშირებას ელოდება'));assert(html.includes('required=""'));assert(html.includes('პირადი ინფორმაცია'));
assert(!/localStorage|sessionStorage|document\.cookie|console\.(log|error)|JSON\.stringify\(personal|JSON\.stringify\(delivery/.test(registration.source),'PII must not be serialized to storage/logs');
assert(!/method:\s*['"]POST|body:/.test(registration.source),'No unconnected registration endpoint may receive PII');
assert(registration.source.includes('type="button" disabled>რეგისტრაციის დასრულება'));assert(!registration.source.includes('setRegistered(true)'));
const funding=await load('components/order-funding-path.tsx');const fundingHtml=renderToStaticMarkup(createElement(funding.exports.OrderFundingPath));assert(fundingHtml.includes('PAY NOW'));assert(fundingHtml.includes('FROM COMMISSION'));assert(fundingHtml.includes('No order or payment instruction was created here'));assert(!/fetch\(|localStorage|sessionStorage/.test(funding.source));
const deferred=await load('components/order-funding-path.tsx',{'react':{useState:()=>['DEFERRED',()=>{}]}});const deferredHtml=renderToStaticMarkup(createElement(deferred.exports.OrderFundingPath));for(const copy of ['first 1,000 registrations','AVAILABLE','MERGE Coin credit','LIVE snapshot','PENDING, RESERVED and NEGATIVE','unique settlement','33%','16.5%','Every successfully generated item','REGISTRATION PENDING'])assert(deferredHtml.includes(copy),'Deferred terms missing '+copy);assert(deferredHtml.includes('No order or payment instruction was created here'));
const entry=await readFile(new URL('../lib/entry-law.ts',import.meta.url),'utf8');assert(entry.includes('ოქროს LIVE კურსი')&&entry.includes('ვერცხლის LIVE კურსი'));assert(!entry.includes('ოქროს + 1 კგ ვერცხლის'));assert(!/calculated_amount|Math\.|fetch\(/.test(entry),'Founder display rule is not a payable engine');
console.log('PASS: transient registration field validation, explicit BOTH confirmation, disabled CORE completion, no PII submission/storage, separate informational funding choices and separate LIVE metal references and pending approved CORE price. Not real registration/payment E2E.');
