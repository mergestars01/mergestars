import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
function load(name,overrides={}){const module={exports:{}};const source=readFileSync(new URL('../'+name,import.meta.url),'utf8');const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',code)(name=>overrides[name]??require(name),module,module.exports);return module.exports;}
const city=load('lib/megapolis-domain.ts');
const fashion=load('lib/fashion-museum.ts',{'./megapolis-domain':city});
const choices=fashion.fashionMuseumSections.flatMap(section=>section.choices);
assert.equal(choices.length,22);
assert.equal(new Set(choices.map(choice=>choice.label)).size,choices.length);
for(const choice of choices){const target=fashion.fashionMuseumDestination(choice);assert(city.cityHouses.find(house=>house.id===target.houseId).categories.includes(target.category));assert.equal(target.mode,'browse');assert.equal(target.query,choice.query);assert(!('core_house_id' in target));}
for(const house of ['fashion','watches','eyewear','jewelry'])assert(choices.some(choice=>choice.houseId===house));
assert(choices.some(choice=>choice.query==='Costumes'));
const source=readFileSync(new URL('../components/grand-atrium.tsx',import.meta.url),'utf8');
assert(source.includes('onDestination={openDestination}'));
assert(source.includes('const next=museumDestination(value)'));
assert(source.includes('setBrand(\'\')'));
const styles=readFileSync(new URL('../app/fashion-museum.css',import.meta.url),'utf8');assert(styles.includes('grid-template-columns: 1fr'));
console.log('PASS: 22 unique Fashion entrances reuse existing categories, preserve query, support costumes, connect the existing category dialog and retain responsive layout. No real Meshy/CORE E2E claim.');
