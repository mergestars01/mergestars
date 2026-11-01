import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';

const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){
  const cache=new Map();
  function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);
    const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
    new Function('require','module','exports',code)(name=>{
      if(name in overrides)return overrides[name];
      if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx','.mjs'].map(ext=>target+ext).find(existsSync);if(!target)throw Error('Missing module '+name);return load(path.relative(root,target));}
      return require(name);
    },module,module.exports);return module.exports;
  }return load;
}
const load=loader(),domain=load('lib/coin-sky-prices.ts'),market=load('lib/coin-market-disclosure.ts'),ui=load('components/coin-sky-prices.tsx'),core=load('lib/core-contract.ts'),identity=load('lib/company-identity.ts').companyIdentity;
// Synthetic QA prices, not live quotes or saved commercial records.
const raw={data:[{metal:'gold',priceUsd:101.2345,pricePerKgUsd:101234.5,changePct:0},{metal:'silver',priceUsd:1.7654,pricePerKgUsd:1765.4,changePct:0}],meta:{timestamp:'2026-10-15T12:00:00.000Z',version:'QA'}};
const data={...core.projectPrices(raw),retrieved_at:'2026-10-15T12:00:01.000Z'};
assert.equal(domain.coinMetalReference(data,'gold').amount,101234.5);
assert.equal(domain.coinMetalReference(data,'silver').amount,1765.4,'Silver reference is not multiplied by the Coin pricing basis');
assert.equal(domain.coinMetalReference(undefined,'gold'),null);
assert.equal(domain.coinMetalReference({...data,prices:data.prices.filter(p=>p.metal==='silver')},'gold'),null);
for(const patch of [{source_origin:'https://another-source.example'},{verified_offer:true},{quote_freshness:'VERIFIED'},{quote_at:raw.meta.timestamp},{retrieved_at:'invalid'},{response_at:'invalid'},{prices:[...data.prices,data.prices[0]]},{prices:[{...data.prices[0],pricePerKgUsd:-1}]},{prices:[{...data.prices[0],pricePerKgUsd:Infinity}]},{prices:[{...data.prices[0],pricePerKgUsd:15}]}])assert.equal(domain.coinMetalReference({...data,...patch},'gold'),null);
assert.equal(domain.coinCommercialPrice.amount,null);assert.equal(domain.coinCommercialPrice.verifiedOffer,false);
assert.equal(domain.coinSkyRefreshMs,60000);
assert.equal(domain.coinSkyLines[0].line,'GOLD');assert(domain.coinSkyLines[0].left<.2);assert.equal(domain.coinSkyLines[1].line,'SILVER');assert(domain.coinSkyLines[1].left>.7);
// Keep the real House buttons, central museum and right toolbar outside discs.
const destinations=load('lib/photo-megapolis.ts').photoDestinations;
for(const coin of domain.coinSkyLines)for(const point of destinations){const height=coin.width*1.5;assert(!(point.x/100>=coin.left&&point.x/100<=coin.left+coin.width&&point.y/100>=coin.top&&point.y/100<=coin.top+height),'Coin must not cover House navigation');}
const feed={data,retry(){}},html=renderToStaticMarkup(createElement(ui.CoinSkyPrices,{feed,disabled:false,onDetails(){}}));
assert.equal((html.match(/data-coin-line=/g)||[]).length,2);assert.equal((html.match(/src="\/assets\/official-company-logo.svg"/g)||[]).length,2);
for(const text of ['GOLD MERGE COIN','SILVER MERGE COIN','PRICE BASIS · 1 KG GOLD VALUE','PRICE BASIS · 1 KG SILVER VALUE','8K GOLD COMPOSITE · 33⅓% Au INPUT','SILVER COMPOSITE · 33⅓% Ag INPUT','66⅔% POLYMER BASE · NOT PURE METAL','$101,234.50','$1,765.40','LIVE METAL REFERENCE','CORE COIN OFFER PENDING','QUOTE TIME UNVERIFIED','/ oz t metal','12 LINES · 12 PRODUCTS / CASE','12 LINES · 1 PRODUCT / CASE'])assert(html.includes(text),'Missing English display '+text);
assert.equal((html.match(/data-coin-feed="received"/g)||[]).length,2);
assert(html.includes(identity.mark));assert(!/[ა-ჰ]/.test(html),'new visible Coin labels are English');
for(const input of [{retry(){}},{error:'CORE_UNAVAILABLE',retry(){}},{data,error:'CORE_TIMEOUT',retry(){}}]){
 const failed=renderToStaticMarkup(createElement(ui.CoinSkyPrices,{feed:input,disabled:false,onDetails(){}}));for(const amount of ['$101,234.50','$1,765.40','$202,469.00','$3,530.80'])assert(!failed.includes(amount),'failed/loading refresh never displays previous or derived numbers');assert(failed.includes('LIVE METAL REFERENCE'));assert(!failed.includes('data-coin-feed="received"'),'pending or failed source cannot activate the receipt pulse');
}
const disabled=renderToStaticMarkup(createElement(ui.CoinSkyPrices,{feed,disabled:true,onDetails(){throw Error('Disabled click');}}));assert.equal((disabled.match(/disabled=""/g)||[]).length,2);
const details=renderToStaticMarkup(createElement(ui.CoinLivePriceDetails,{feed,onRules(){}}));
for(const copy of ['freshness unverified','not a certified physical Coin weight','333.33 g of silver','Ag 999.9','selected polymer / filament','BATCH CERTIFICATION PENDING','Not supplied','CORE PRICE PENDING','CORE BASE PENDING','TAX TREATMENT PENDING','TROY OZ','not a streaming exchange feed','one allocation rule','16.5%','Physical Megapolis construction fund','ILLUSTRATION ONLY · NOT PAYABLE','$2,040.00'])assert(details.includes(copy),'Missing market disclosure '+copy);
assert(details.includes(market.coinMarketReferences.benchmark));assert(!details.includes('$132,600.00'),'Silver opens its own illustration');
const goldDetails=renderToStaticMarkup(createElement(ui.CoinLivePriceDetails,{feed,onRules(){},initialLine:'GOLD'}));assert(goldDetails.includes('$101,234.50'));assert(!goldDetails.includes('$1,765.40'));assert(goldDetails.includes('$132,600.00'));assert(!goldDetails.includes('$2,040.00'));
for(const view of [details,goldDetails]){assert.equal((view.match(/data-planning-slot=/g)||[]).length,12);assert(view.includes('CORE CONFIRMATION PENDING'));assert(!view.includes('+100%'));assert(!view.includes('P + P'));assert(view.includes('YOUR VERIFIED COIN PRICE'));}
assert(goldDetails.includes('1,000 g of finished MERGE 8K composite'));assert(!details.includes('1,000 g of finished MERGE 8K composite'),'Silver gets twelve Brand Lines without Gold weight policy');
assert(goldDetails.includes('GOLD COIN CASE = 12 PRODUCTS'));assert(details.includes('SILVER COIN CASE = 1 PRODUCT'));
assert(!html.includes('$202,469.00')&&!html.includes('$3,530.80'),'Coins never automatically double the raw metal rate');
const opened=[],tree=ui.CoinSkyPrices({feed,disabled:false,onDetails:line=>opened.push(line)});for(const child of tree.props.children){const button=child.type(child.props);button.props.onClick();}assert.deepEqual(opened,['GOLD','SILVER'],'each Coin opens its own metal market');
const disabledTree=ui.CoinSkyPrices({feed,disabled:true,onDetails(){throw Error('Disabled action');}});for(const child of disabledTree.props.children)child.type(child.props).props.onClick();
const paused=renderToStaticMarkup(createElement(ui.CoinSkyPrices,{feed,disabled:false,motionEnabled:false,onDetails(){}}));assert.equal((paused.match(/data-motion="false"/g)||[]).length,2);
const calls=[],pulseLoad=loader({'@/components/core-context':{useCoreRead(path,refresh){calls.push([path,refresh]);return feed;}}});
const PulsePanel=pulseLoad('components/coin-pulse-panel.tsx').CoinPulsePanel;
const pulseHtml=renderToStaticMarkup(createElement(PulsePanel,{}));assert.deepEqual(calls,[['/api/core/prices',60000]]);assert(pulseHtml.includes('MERGE PULSE'));assert.equal((pulseHtml.match(/data-coin-line=/g)||[]).length,2);assert(pulseHtml.includes('successful CORE response'));assert(pulseHtml.includes('does not certify quote freshness'));
const pulseCss=readFileSync(path.join(root,'app/photo-megapolis.css'),'utf8');assert(pulseCss.includes('[data-coin-feed=received][data-motion=true]'));assert(pulseCss.includes('coin-feed-beat 1.4s ease-out 1'));assert(pulseCss.includes('prefers-reduced-motion:reduce'));

// Only unit conversion is derived from the live metal reference. The removed
// markup must not survive as a hidden alternate Coin price engine.
assert.equal(market.indicativeCoinBreakdown,undefined);
const reference={...domain.coinMetalReference(data,'silver'),amount:2000};
assert.equal(market.gramsPerTroyOunce,31.1034768);assert.equal(market.metalRateInUnit(reference,'kg'),2000);assert.equal(market.metalRateInUnit(reference,'g'),2);assert(Math.abs(market.metalRateInUnit(reference,'oz t')-62.2069536)<1e-10);assert(Math.abs(market.metalRateInUnit(reference,'oz t')/(31.1034768/1000)-2000)<1e-8);
for(const amount of [0,-1,NaN,Infinity])assert.equal(market.metalRateInUnit({...reference,amount},'oz t'),null);
assert.equal(market.metalRateInUnit(null,'oz t'),null);
const unavailableDetails=renderToStaticMarkup(createElement(ui.CoinLivePriceDetails,{feed:{error:'CORE_TIMEOUT',retry(){}},onRules(){}}));assert(!unavailableDetails.includes('$1,765.40'));assert(unavailableDetails.includes('ILLUSTRATION ONLY · NOT PAYABLE'),'fixed examples are never relabelled live fallback data');assert(unavailableDetails.includes('CORE PRICE PENDING'));

// Run the existing read hook's effects with a deterministic timer/document.
// This checks polling and cancellation, not browser rendering or real CORE E2E.
const effects=[],updates=[];let interval,cleared=false,visibility,requestSignal;
const oldFetch=globalThis.fetch,oldWindow=globalThis.window,oldDocument=globalThis.document;
try{
 globalThis.window={setInterval(fn,ms){assert.equal(ms,60000);interval=fn;return 9;},clearInterval(id){assert.equal(id,9);cleared=true;}};
 globalThis.document={hidden:false,addEventListener(type,fn){assert.equal(type,'visibilitychange');visibility=fn;},removeEventListener(type,fn){assert.equal(type,'visibilitychange');assert.equal(fn,visibility);}};
 globalThis.fetch=async(url,options)=>{assert.equal(url,'/api/core/prices');assert.equal(options.cache,'no-store');requestSignal=options.signal;return new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}});};
 const hook=loader({'react':{useState(initial){return [initial,next=>updates.push(next)];},useEffect(fn){effects.push(fn);}},'@/components/core-model-viewer':{},'@/lib/museum-vitrine':{},'@/components/filament-preference':{}})('components/core-context.tsx').useCoreRead;
 hook('/api/core/prices',60000);assert.equal(effects.length,2);
 const stopRequest=effects[0](),stopPolling=effects[1]();assert.equal(updates.length,1);assert.deepEqual(updates[0],{path:'/api/core/prices'});
 await new Promise(resolve=>setImmediate(resolve));assert(updates.some(value=>typeof value==='object'&&value.data),'read hook receives the real response projection');
 let count=updates.length;document.hidden=true;interval();assert.equal(updates.length,count);visibility();assert.equal(updates.length,count);
 document.hidden=false;visibility();assert.equal(updates.length,++count);interval();assert.equal(updates.length,++count);
 stopRequest();assert(requestSignal.aborted);stopPolling();assert(cleared);
}finally{globalThis.fetch=oldFetch;globalThis.window=oldWindow;globalThis.document=oldDocument;}
console.log('PASS: unmodified CORE references; exact troy units; no derived Coin markup; distinct live reference and pending payable offer; explicitly illustrative unified allocations; correct clicked-metal market; both twelve-line previews and distinct physical cases; pending payable offer; exact identity; no stale raw/derived numbers; polling and cancellation. Browser appearance and real CORE Coin-sale E2E are NOT asserted.');
