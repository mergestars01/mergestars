import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createRequire} from 'node:module';
import React,{createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){
 const cache=new Map();function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',code)(name=>{if(name in overrides)return overrides[name];if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx','.mjs'].map(ext=>target+ext).find(existsSync);if(!target)throw Error('Missing '+name);return load(path.relative(root,target));}return require(name);},module,module.exports);return module.exports;}return load;
}
const load=loader(),domain=load('lib/social-brand-preparation.ts'),manager=load('lib/merge-ai-manager.ts');
const input={brand_name:'QA Brand',description:'A user supplied design description.',channels:['tiktok','youtube'],registration_mode:'SELF'};
const full={...input,industry:'Design & Lifestyle',email_setup:'EXISTING',content_language:'English',tone:'Refined & editorial',deliverables:['Product captions','First 12 post ideas']};
for(const mode of ['SELF','AI_ASSISTED']){
 const result=manager.prepareManagerBrief({...full,registration_mode:mode});assert(result);assert.equal(result.status,'PREPARATION_ONLY');
 for(const key of ['connectionVerified','accountCreated','published','financialRightsChanged'])assert.equal(result[key],false);
 assert.deepEqual(result.channels,['tiktok','youtube']);assert.equal(result.proposedHandle,'qabrand');assert(result.text.includes('availability not checked'));assert(!result.text.includes('Instagram'));assert(!/[\u10a0-\u10ff]/.test(result.text));
}
for(const patch of [{channels:[]},{channels:['tiktok','tiktok']},{channels:['invented']},{brand_name:' '},{description:'short'},{description:'x'.repeat(2001)},{registration_mode:'CONNECTED'},{password:'secret'},{email:'private@example.test'},{access_token:'fake'},{user_id:'other-owner'},{house_id:'forged'},{scopes:['publish']},{authorized_session:true},{deliverables:[]},{deliverables:['Video outlines','Video outlines']},{content_language:'invented'},{tone:'CONNECTED'},{email_setup:'ACTIVE'}])assert.equal(manager.prepareManagerBrief({...full,...patch}),null,'reject invalid, secret or authority field '+Object.keys(patch));
assert.equal(domain.prepareSocialProfile({...input,brand_name:'ქართული ბრენდი'}).proposedHandle,null);
const allowed=['www.tiktok.com','www.instagram.com','www.facebook.com','www.linkedin.com','www.youtube.com','www.pinterest.com','x.com'];assert.equal(domain.socialChannels.length,7);for(const channel of domain.socialChannels){const url=new URL(channel.url);assert.equal(url.protocol,'https:');assert(allowed.includes(url.hostname));assert.equal(url.search,'');assert.equal(url.hash,'');}
const calls=[],core={useCoreRead(path){calls.push(path);return {data:{house_id:'FORGED-HOUSE',owner:'Nino',name:'LUMIRA',payment_verified:true,social_connections:[{status:'CONNECTED'}]},error:'CORE_DEPENDENCY_REQUIRED',retry(){}};}};
const ui=loader({'@/components/core-context':core}),UI=ui('components/personal-merge-ai.tsx').PersonalMergeAI;
const render=props=>renderToStaticMarkup(createElement(UI,{signedIn:false,onIdentity(){},onOrders(){},...props}));
let html=render({});assert.deepEqual(calls,[null]);
for(const copy of ['Brand information','Brand email','Social networks','Content style','Final review','SELF REGISTRATION','AI-ASSISTED REGISTRATION','Prepare brand brief','CORE identity pending','NOT CONNECTED','No account, order, publication or payment is created here.','Register each generated item in CORE','CORE Order ID pending','No upfront payment or wait for 1,000 registrations','PAY NOW','PAY LATER','Up to 12 products','1 product'])assert(html.includes(copy),copy);
assert(!/[\u10a0-\u10ff]/.test(html),'workspace labels and generated UI are English');assert(!html.includes('FORGED-HOUSE'));assert(!html.includes('LUMIRA'));assert(!html.includes('Nino'));assert(!html.includes('type="password"'));assert(!html.includes('data-connection-state="CONNECTED"'));assert.equal((html.match(/data-connection-state="SETUP_REQUIRED"/g)||[]).length,7);assert(html.includes('/assets/official-company-logo.svg'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'no duplicate input/section IDs');for(const m of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(m[1]),'internal destination '+m[1]);
html=render({signedIn:true});assert.equal(calls.at(-1),'/api/core/brand-house');assert(html.includes('This does not establish a MERGE CORE identity'));assert(!html.includes('FORGED-HOUSE'));
// Exercise actual component callbacks without pretending this is browser E2E.
const states=['AI Manager',structuredClone(full),null],effects=[];let cursor=0;
const hooks={...React,useId:()=> 'qa-manager',useEffect(fn){effects.push(fn);},useState(initial){const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],value=>{states[i]=typeof value==='function'?value(states[i]):value;}];}};
const interactive=loader({'react':hooks,'@/components/core-context':core});const Page=interactive('components/merge-ai-workspace.tsx').MERGEAIManagerPage;
function nodes(node,out=[]){if(!node||typeof node!=='object')return out;if(Array.isArray(node)){node.forEach(v=>nodes(v,out));return out;}out.push(node);nodes(node.props?.children,out);return out;}
function tree(){cursor=0;return Page({signedIn:true,onIdentity(){},onOrders(){}});}
let current=tree();nodes(current).find(n=>n.type==='form').props.onSubmit({preventDefault(){}});assert.equal(states[2].status,'PREPARATION_ONLY');
current=tree();let panel=nodes(current).find(n=>n.type?.name==='BrandIdentityPanel');let child=panel.type(panel.props);nodes(child).find(n=>n.type==='input').props.onChange({target:{value:'Updated QA Brand'}});assert.equal(states[1].brand_name,'Updated QA Brand');assert.equal(states[2],null,'an edited brief invalidates old prepared output');
current=tree();let review=nodes(current).find(n=>n.type?.name==='LaunchReview');review.props.onPrepare();assert(states[2].text.includes('Updated QA Brand'));assert(!states[2].text.includes('Brand: QA Brand\n'));
effects[0]();assert.equal(states[1].brand_name,'');assert.equal(states[1].description,'');assert.deepEqual(states[1].channels,[]);assert.equal(states[2],null,'identity changes reset the transient working brief');
// Selected provider handoff stays separate from verified connection state.
const socialStates=[{tiktok:'EXISTING'}];let socialCursor=0;
const socialHooks={...React,useId:()=> 'qa-social',useState(initial){const i=socialCursor++;if(!(i in socialStates))socialStates[i]=initial;return [socialStates[i],v=>socialStates[i]=typeof v==='function'?v(socialStates[i]):v];}};
const Social=loader({'react':socialHooks})('components/merge-ai-panels.tsx').SocialAccountConnections;
let changed;const social=Social({draft:full,change:(key,value)=>changed={key,value}});let link=nodes(social).find(n=>n.type==='a'&&n.props.href==='https://www.tiktok.com/');assert(link);assert.equal(link.props.rel,'noopener noreferrer');assert(!link.props.onClick);assert(link.props.children.includes('Open official account page'));
const checkboxes=nodes(social).filter(n=>n.type==='input'&&n.props.type==='checkbox');assert.equal(checkboxes.length,7);checkboxes[0].props.onChange({target:{checked:true}});assert.equal(changed.key,'channels');assert(changed.value.includes('instagram'));
for(const button of nodes(social).filter(n=>n.type==='button'))assert(button.props.disabled,'unconfigured OAuth/AI setup cannot be invoked');
// Copy/download use the actual handlers and never publish or send the brief.
const reviewState=['IDLE'];
const Review=loader({'react':{...React,useId:()=> 'qa-review',useState:()=>[reviewState[0],v=>reviewState[0]=v]}})('components/merge-ai-panels.tsx').LaunchReview;
const ready=manager.prepareManagerBrief(full);let copiedText,clicked=false,downloadLink;
const oldNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator'),oldDocument=Object.getOwnPropertyDescriptor(globalThis,'document');
const oldCreate=URL.createObjectURL,oldRevoke=URL.revokeObjectURL;let blob,revoked;
function textOf(v){if(typeof v==='string')return v;if(Array.isArray(v))return v.map(textOf).join('');return v&&typeof v==='object'?textOf(v.props?.children):'';}
try{
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async value=>{copiedText=value;}}}});
 Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement:()=>downloadLink={click(){clicked=true;}}}});
 URL.createObjectURL=value=>{blob=value;return 'blob:qa-brief';};URL.revokeObjectURL=value=>{revoked=value;};
 let reviewTree=Review({draft:full,prepared:ready,onPrepare(){}});nodes(reviewTree).find(n=>n.type==='button'&&textOf(n).includes('Copy brief')).props.onClick();await Promise.resolve();assert.equal(copiedText,ready.text);assert.equal(reviewState[0],'COPIED');
 reviewTree=Review({draft:full,prepared:ready,onPrepare(){}});nodes(reviewTree).find(n=>n.type==='button'&&textOf(n).includes('Download TXT')).props.onClick();assert(clicked);assert.equal(downloadLink.download,'MERGE-brand-working-brief.txt');assert.equal(downloadLink.href,'blob:qa-brief');assert.equal(await blob.text(),ready.text);await new Promise(resolve=>setTimeout(resolve,5));assert.equal(revoked,'blob:qa-brief');
 navigator.clipboard.writeText=async()=>{throw Error('Clipboard denied');};reviewTree=Review({draft:full,prepared:ready,onPrepare(){}});nodes(reviewTree).find(n=>n.type==='button'&&textOf(n).includes('Copied')).props.onClick();await Promise.resolve();assert.equal(reviewState[0],'FAILED');
 assert(textOf(Review({draft:full,prepared:ready,onPrepare(){}})).includes('Select the brief below and copy it manually.'));
}finally{if(oldNavigator)Object.defineProperty(globalThis,'navigator',oldNavigator);else delete globalThis.navigator;if(oldDocument)Object.defineProperty(globalThis,'document',oldDocument);else delete globalThis.document;URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;}

// The provider-backed chat starts fail-closed, without a synthetic response.
const Chat=load('components/manager-live-chat.tsx').PersonalMERGEAIChat;
const chatHTML=renderToStaticMarkup(createElement(Chat,{signedIn:false}));
for(const copy of ['NOT CONNECTED','Your AI specialist','Review a reference image','Allow this request','Send to MERGE AI','Check AI connection','No simulated AI reply is substituted.'])assert(chatHTML.includes(copy),copy);
assert.equal((chatHTML.match(/<option /g)||[]).length,6);assert(/<button[^>]+disabled[^>]*>.*?Send to MERGE AI/s.test(chatHTML));
assert(!chatHTML.includes('data-speaker="assistant"'));
const law=manager.officialOrderLaw;assert.equal(law.paymentRequiredBeforeOrder,false);assert.equal(law.waitForThousandRegistrations,false);assert.equal(law.modelSaveAloneCreatesOrder,false);assert.equal(law.userConfirmationRequired,true);assert.equal(law.deferredOrderIsPaidSale,false);assert.equal(law.paymentRequiresVerifiedOffer,true);
for(const file of ['components/merge-ai-workspace.tsx','components/merge-ai-panels.tsx','lib/merge-ai-manager.ts','lib/social-brand-preparation.ts']){const text=readFileSync(path.join(root,file),'utf8');assert(!/fetch\(|localStorage|sessionStorage|document\.cookie|console\.|method:\s*['"]POST/.test(text),'no invented transport, credential storage or external action in '+file);}
const route=readFileSync(path.join(root,'app/dashboard/merge-ai/page.tsx'),'utf8'),museum=readFileSync(path.join(root,'components/museum.tsx'),'utf8'),home=readFileSync(path.join(root,'app/page.tsx'),'utf8');assert(route.includes('getChatGPTUser()'));assert(route.includes('chatGPTSignInPath(\'/dashboard/merge-ai\')'));assert(route.includes('key={user.userId}'));assert(home.includes('sessionScope={user?.userId}'));assert(museum.includes('key={sessionScope ?? String(signedIn)}'),'same signed-in boolean cannot retain another session’s brief');assert(museum.includes('setPanel("personal-ai")'));
for(const file of ['components/commercial-readiness.tsx','components/vip-journey.tsx','components/order-funding-path.tsx','components/entry-payment-law.tsx'])assert(!readFileSync(path.join(root,file),'utf8').includes('NO VERIFIED OFFER → NO ORDER'),'affected journey uses the latest Founder order-before-payment specification');
console.log('PASS: English rendering, official logo and anchors, seven unverified social channels, strict brief/spoof validation, draft/preparation/reset callbacks, safe provider handoff, fail-closed chat, identity-scoped remount, and unpaid-order law. Live provider/CORE E2E remains blocked.');
