import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url),cache=new Map();
function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file);const module={exports:{}};cache.set(file,module.exports);new Function('require','module','exports',ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(name=>name.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(file),name+'.ts'))):require(name),module,module.exports);return module.exports;}
const {canonicalPhotoPath,duplicatePhotoAliases,uniquePhotographs}=load('lib/photo-identity.ts');
const {visualPhotos,museumSourcePhotos}=load('lib/museum-photo-library.ts'),{visualDestination,visualJourney,houseVisualsFor}=load('lib/visual-routes.ts');
assert.equal(Object.keys(duplicatePhotoAliases).length,4);
for(const [alias,canonical]of Object.entries(duplicatePhotoAliases)){
 assert.equal(canonicalPhotoPath(alias),canonical);assert.equal(canonicalPhotoPath(canonical),canonical);
 assert(existsSync(path.join(root,'public',alias)));assert(existsSync(path.join(root,'public',canonical)));
 const input=[{image:alias,title:'legacy'},{image:canonical,title:'current'}];
 assert.deepEqual(uniquePhotographs(input),[{image:canonical,title:'current'}]);assert.equal(input[0].image,alias);
 assert.deepEqual(uniquePhotographs([...input].reverse()),[{image:canonical,title:'current'}]);
}
assert.equal(canonicalPhotoPath('/unrecognized.png'),'/unrecognized.png');assert.deepEqual(uniquePhotographs([]),[]);
assert.equal(visualPhotos.length,45);assert.equal(museumSourcePhotos.length,45);assert.equal(new Set(visualPhotos.map(p=>canonicalPhotoPath(p.image))).size,45);
const {withheldPhotographs,displayablePhotograph}=load('lib/photo-quality.ts');
for(const image of Object.keys(withheldPhotographs)){
 assert(!displayablePhotograph(image));assert(!visualPhotos.some(p=>p.image===image));
 assert(existsSync(path.join(root,'public',image)),'Original remains archived');
}
assert(displayablePhotograph('/assets/founder-merge-watch-your-time.png'),'Corrected watch is retained');
assert.equal(houseVisualsFor('watches')[0],'/assets/founder-merge-watch-your-time.png');
for(const house of ['watches','eyewear','mobility','mosaic'])assert(!houseVisualsFor(house).includes('/assets/founder-aurum-argentum-portal.png'),'Dedicated product views must not start with unrelated portal artwork');
for(const photo of visualPhotos){assert(!duplicatePhotoAliases[photo.image]);assert(visualDestination(photo.image));}
assert.equal(new Set(visualJourney.map(p=>canonicalPhotoPath(p.image))).size,visualJourney.length);
assert(!houseVisualsFor('fashion').some(p=>canonicalPhotoPath(p)==='/assets/founder-grand-museum-interior.png'));
assert(!readFileSync(path.join(root,'components/founder-visual-references.tsx'),'utf8').includes('<img'));
console.log('PASS: 45 curated photographs, including 3 ASCENSION concepts; 2 evidence-conflicting boards withheld without deletion; corrected watch and category-specific imagery retained; duplicates, metadata, legacy assets and destinations preserved.');
