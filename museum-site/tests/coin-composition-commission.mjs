import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';

const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){
 const cache=new Map();
 function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);
  const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  new Function('require','module','exports',code)(name=>{if(name in overrides)return overrides[name];if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx'].map(ext=>target+ext).find(existsSync);if(!target)throw Error(name);return load(path.relative(root,target));}return require(name);},module,module.exports);
  return module.exports;
 }return load;
}
const load=loader(),calculate=load('lib/commission-coin-scenario.ts').commissionCoinScenario;
const example={orderGrossCoinUnits:1,vatPercent:18,brandShareBasisPoints:3300};
const one=calculate(example);
assert.equal(one.ordersRequired,4,'one-Coin-value fully paid sales at a full 33% net brand share need four eligible sales');
assert(Math.abs(one.commission-.2741774675972084)<1e-12);
assert(Math.abs(one.vat-.15254237288135597)<1e-12);
assert(Math.abs(one.platformFee-.0166168162180127)<1e-12);
assert(one.previousOrderCountCommission<1&&one.totalCommission>=1);
assert.equal(calculate({...example,brandShareBasisPoints:1650}).ordersRequired,8,'one separate House cannot spend both Houses’ shares');
assert.equal(calculate({...example,orderGrossCoinUnits:.5}).ordersRequired,8);
assert.equal(calculate({...example,orderGrossCoinUnits:2}).ordersRequired,2);
assert.equal(calculate({...example,orderGrossCoinUnits:100}).ordersRequired,1);
assert.equal(calculate({...example,vatPercent:0}).ordersRequired,4);
for(const gross of [.01,.03,.33,1,1.2036,10,100])for(const vat of [0,18])for(const share of [3300,1650]){
 const result=calculate({orderGrossCoinUnits:gross,vatPercent:vat,brandShareBasisPoints:share});
 assert(Math.abs(result.vat+result.platformFee+result.productBase-gross)<1e-10,'tax + separate fee + base reconciles to the customer total');
 assert(result.ordersRequired>=1&&Number.isSafeInteger(result.ordersRequired));
 assert(result.totalCommission>=1-1e-12&&result.previousOrderCountCommission<1+1e-12);
 for(const flag of ['orderCreated','paymentVerified','commissionAvailable','coinSettled'])assert.equal(result[flag],false);
 assert.equal(result.assumedStartingAvailableCoinUnits,0);assert.equal(result.scenarioOnly,true);
}
for(const patch of [{orderGrossCoinUnits:0},{orderGrossCoinUnits:-1},{orderGrossCoinUnits:.001},{orderGrossCoinUnits:101},{orderGrossCoinUnits:NaN},{orderGrossCoinUnits:Infinity},{vatPercent:-18},{vatPercent:50},{brandShareBasisPoints:6600},{brandShareBasisPoints:0}])assert.equal(calculate({...example,...patch}),null);
assert.deepEqual(one.doublingWaves.map(row=>row.newOrders),[1,2,4]);assert.deepEqual(one.doublingWaves.map(row=>row.cumulativeOrders),[1,3,7]);

const material=load('components/coin-material-summary.tsx').CoinMaterialSummary;
for(const line of ['GOLD','SILVER']){
 const html=renderToStaticMarkup(createElement(material,{line}));
 for(const copy of ['33⅓%','66⅔%','1:2','333.33','666.67','999.9','selected polymer / filament','not the weight of your item','BATCH CERTIFICATION PENDING'])assert(html.includes(copy),copy);
 assert(!/[ა-ჰ]/.test(html));
 if(line==='GOLD')assert(html.includes('Nominal 8K gold composite'));else {assert(html.includes('Silver–polymer composite'));assert(!html.includes('8K'),'silver material does not receive a gold karat assay');}
}
// Exercise actual component input handlers and re-render the resulting state.
const states=[];let cursor=0;
const interactive=loader({'react':{
 useId:()=> 'qa-scenario-',
 useState(initial){const i=cursor++;if(!(i in states))states[i]=initial;return [states[i],next=>{states[i]=next;}];},
}})('components/commission-coin-scenario.tsx').CommissionCoinScenario;
function render(){cursor=0;return interactive();}
function elements(node,result=[]){if(!node||typeof node!=='object')return result;if(Array.isArray(node)){node.forEach(child=>elements(child,result));return result;}if(node.props){result.push(node);elements(node.props.children,result);}return result;}
let tree=render(),html=renderToStaticMarkup(tree);
assert(html.includes('SCENARIO_ONLY'));assert(html.includes('>4</strong>'));assert(html.includes('CORE CONNECTION REQUIRED'));
const fields=elements(tree),gross=fields.find(node=>node.type==='input'),share=fields.find(node=>node.type==='select'&&node.props.id.endsWith('share'));
share.props.onChange({target:{value:'1650'}});html=renderToStaticMarkup(render());assert(html.includes('>8</strong>'));
gross.props.onChange({target:{value:''}});html=renderToStaticMarkup(render());assert(html.includes('Enter an order value'));assert(!html.includes('coin-scenario-result'),'invalid input removes the previous result');
gross.props.onChange({target:{value:'2'}});share.props.onChange({target:{value:'3300'}});html=renderToStaticMarkup(render());assert(html.includes('>2</strong>'));
for(const file of ['lib/commission-coin-scenario.ts','components/commission-coin-scenario.tsx'])assert(!/fetch\(|localStorage|sessionStorage|\.POST\(|\.execute\(|\.run\(/.test(readFileSync(path.join(root,file),'utf8')),'scenario has no financial, storage or API side effects');
const law=load('lib/merge-ai-manager.ts').officialOrderLaw;
assert.equal(law.everyGeneratedItemRequiresCoreOrder,true);assert.equal(law.additionalPostGenerationConfirmationRequired,false);assert.equal(law.generationOrderRegistrationState,'UNPAID');assert.equal(law.paymentRequiredBeforeOrder,false);assert.equal(law.modelSaveAloneCreatesOrder,false);assert.equal(law.orderRegistrationIsPayment,false);
console.log('PASS: material composition is distinct from pricing basis and assay; 4 / 8 paid-order scenarios reconcile VAT and the separate fee; varied values, invalid inputs and actual form callbacks; doubling is isolated arithmetic; generated-item order policy stays unpaid and CORE-owned. No real financial or generation integration asserted.');
