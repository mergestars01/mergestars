import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {browserPreflight} from './browser-preflight.mjs';
const require=createRequire(import.meta.url),results=[];
function run(id,args){const r=spawnSync(process.execPath,args,{stdio:'inherit'});results.push({id,status:r.status===0?'PASS':'FAIL',exit_code:r.status});return r.status===0;}
run('typescript',[require.resolve('typescript/bin/tsc'),'--noEmit','--incremental','false']);
run('contracts',['scripts/test-contracts.mjs']);
const browser=await browserPreflight();results.push({id:'browser-preflight',...browser});
if(browser.status==='PASS')run('browser-visual-regression',[require.resolve('@playwright/test/cli'),'test']);
else results.push({id:'browser-visual-regression',status:'BLOCKED',reason:'No screenshots or comparisons were performed because browser preflight did not pass.'});
run('build',['scripts/run-framework.mjs','build']);
const failed=results.some(r=>r.status==='FAIL'),complete=results.every(r=>r.status==='PASS');
mkdirSync('test-results',{recursive:true});writeFileSync('test-results/qa-summary.json',JSON.stringify({checked_at:new Date().toISOString(),local_qa:complete?'PASS':'NOT_READY',production_ready:false,results},null,2)+'\n');
console.log(complete?'LOCAL QA PASS. Genuine CORE staging and Founder approval remain separate gates.':'QA NOT READY. See test-results/qa-summary.json. No deployment performed.');
if(!complete)process.exitCode=failed?1:2;
