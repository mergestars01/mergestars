import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {renderToStaticMarkup} from 'react-dom/server';
import {companyIdentity} from '../lib/company-identity.ts';
import {themeBuildings} from '../lib/megapolis-domain.ts';

const require=createRequire(import.meta.url),cache=new Map();
async function compile(file){
 const source=await readFile(new URL('../'+file,import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};new Function('require','module','exports',compiled)(name=>cache.has(name)?cache.get(name):require(name),module,module.exports);return module.exports;
}
cache.set('@/lib/company-identity',{companyIdentity});
const identity=await compile('components/company-identity.tsx');cache.set('@/components/company-identity',identity);
const arrival=await compile('components/royal-museum-arrival.tsx');
const png=await readFile(new URL('../public'+companyIdentity.source,import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(hash(png),companyIdentity.sourceSha256,'the supplied official reference stays byte-for-byte intact');
const svg=await readFile(new URL('../public'+companyIdentity.mark,import.meta.url),'utf8');
assert.equal(hash(Buffer.from(svg.match(/href="data:image\/png;base64,([^"]+)"/)[1],'base64')),companyIdentity.sourceSha256,'logo displays exact original pixels, not an AI-redrawn symbol');
assert(svg.includes('viewBox="'+companyIdentity.markViewport.join(' ')+'"'));
assert(!/<(?:path|polygon|script|foreignObject)\b/.test(svg),'no invented vector mark or executable SVG content');
assert(renderToStaticMarkup(identity.CompanyWordmark()).includes(companyIdentity.mark));
const houses=themeBuildings([]),opened=[];let walks=0,museums=0,brands=0;
const tree=arrival.RoyalMuseumArrival({houses,disabled:false,onHouse:house=>opened.push(house.key),onWalk:()=>walks++,onMuseum:()=>museums++,onBrand:()=>brands++});
const buttons=[];function visit(node){if(!node||typeof node!=='object')return;if(Array.isArray(node)){node.forEach(visit);return;}if(node.type==='button')buttons.push(node);visit(node.props?.children);}visit(tree);
const directions=buttons.filter(button=>button.props['aria-label']?.includes('კატეგორიების გახსნა'));
assert.equal(directions.length,12);for(const button of directions)button.props.onClick();assert.deepEqual(opened,houses.map(house=>house.key),'each photographic navigation action opens its actual existing House, not a hardcoded product');
for(const button of buttons.filter(button=>!button.props['aria-label']))button.props.onClick();assert.equal(walks,1);assert.equal(museums,1);assert.equal(brands,1);
const disabled=arrival.RoyalMuseumArrival({houses,disabled:true,onHouse:()=>{},onWalk:()=>{},onMuseum:()=>{},onBrand:()=>{}});buttons.length=0;visit(disabled);assert(buttons.every(button=>button.props.disabled===true));
const markup=renderToStaticMarkup(tree);assert(markup.includes('APPROVED_PHOTOGRAPH'));assert(markup.includes('approved-mega-museum'));assert(markup.includes('შექმენი შენი ბრენდი'));assert(!/product_id|payment_verified|partner_id/.test(markup));
for(const file of ['components/museum.tsx','components/megapolis.tsx','components/coin-brand-museum.tsx','app/transparency/page.tsx','app/layout.tsx','lib/megapolis-scene.ts']){
 const source=await readFile(new URL('../'+file,import.meta.url),'utf8');assert(!/\/assets\/merge-(?:mark|wordmark)\.png/.test(source),'obsolete mark is no longer used: '+file);
}
console.log('PASS: official logo contains exact founder reference pixels; all active company placements use it; all 12 photographic House actions open their matching House; disabled, museum and 3D-walk actions work. Browser/GPU/core integration are not asserted.');
