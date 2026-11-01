import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const suites=['v24-architecture','photo-scenario','unified-world','museum-gate','photo-megapolis','photo-identity','house-interiors','connected-houses','luxury-windows','museum-image-detail','personal-fit','personal-merge-ai','manager-workbench','brand-towns','coin-composition-commission','coin-sky-prices','coin-museum','registration-funding','material-preference','core-read-contract','core-model-relay','core-textured-model','ascension','museum-studies'];
const results=suites.map(suite=>{
  const r=spawnSync(process.execPath,['tests/'+suite+'.mjs'],{stdio:'inherit'});
  if(r.error)console.error(r.error.message);
  return {suite,status:r.status===0?'PASS':'FAIL',exit_code:r.status};
});
mkdirSync('test-results',{recursive:true});writeFileSync('test-results/contracts.json',JSON.stringify({checked_at:new Date().toISOString(),suites:results},null,2)+'\n');
console.log(`${results.filter(r=>r.status==='PASS').length}/${results.length} contract suites passed.`);
if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
