import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { enterMuseum, museumScenePoints, approachMuseumPoint, openMuseumExhibit } from '../lib/museum-tour.ts';
import { museumBoundaryState } from '../lib/museum-boundary.ts';

// Use the repository's existing contract-test transpilation pattern; the
// production bundler's extensionless imports remain unchanged.
const sharing=ts.transpileModule(await readFile(new URL('../lib/museum-sharing.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace('from "./museum-tour"',`from ${JSON.stringify(new URL('../lib/museum-tour.ts',import.meta.url).href)}`);
const {readMuseumBookmark,museumBookmarkUrl}=await import(`data:text/javascript;base64,${Buffer.from(sharing).toString('base64')}`);

for(const sceneId of ['house','coin'])for(const point of museumScenePoints(sceneId)){
 const url=new URL(museumBookmarkUrl('https://museum.example','/',point.id));
 assert.equal(url.origin,'https://museum.example');assert.equal(url.search,'');
 assert.equal(readMuseumBookmark(url.hash),point.id);assert.deepEqual(enterMuseum(),{kind:'house',point_id:'overview',camera:{x:50,y:50,zoom:1}});
 const selected=approachMuseumPoint(point.id,sceneId);assert.equal(selected.kind,'house','Shared position never creates/selects a product');
 if(!point.source_reference_id)assert.throws(()=>openMuseumExhibit(selected,'MERGE-EYE-001'));
}
for(const hash of ['#museum=unknown','#museum=eyewear&user=secret','#museum=%65yewear','#draft=private','#museum=__proto__','#museum=eyewear\n'])assert.equal(readMuseumBookmark(hash),null);
for(const [origin,path] of [['javascript:alert(1)','/'],['https://user:password@museum.example','/'],['https://museum.example/path','/'],['https://museum.example','//evil.example'],['https://museum.example','/\\evil.example'],['https://museum.example','/?token=private'],['https://museum.example','/#draft=private']])assert.throws(()=>museumBookmarkUrl(origin,path,'eyewear'));
assert.throws(()=>museumBookmarkUrl('https://museum.example','/','unknown'));
for(const capability of ['generate','pulse','likes']){
 const blocked={capability,available:false,source_of_truth:'MERGE_CORE',status:'DEPENDENCY_REQUIRED',error:'CORE_DEPENDENCY_REQUIRED'};
 assert.equal(museumBoundaryState(capability,503,blocked),'unavailable');
 assert.equal(museumBoundaryState(capability,200,{available:true,active_users:1000,likes:100,task_id:'fake',status:'SUCCEEDED'}),'invalid','Unexpected data cannot enable jobs or fabricate popularity');
 assert.equal(museumBoundaryState(capability,503,{...blocked,source_of_truth:'LOCAL_DEMO'}),'error');
 assert.equal(museumBoundaryState(capability,503,{...blocked,capability:'other'}),'error');
 assert.equal(museumBoundaryState(capability,401,{}),'session-required');assert.equal(museumBoundaryState(capability,403,{}),'permission-denied');
}
console.log('PASS: shared scene positions contain no private identifiers or query credentials; no automatic product selection; unknown CORE counts/tasks fail closed.');
