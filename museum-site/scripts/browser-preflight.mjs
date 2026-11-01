import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';

export async function browserPreflight(){
  const result={checked_at:new Date().toISOString(),status:'BLOCKED',checks:[]};
  if(!existsSync(chromium.executablePath())){
    result.checks.push({id:'chromium',status:'BLOCKED',reason:'Chromium executable missing. Provision with pnpm exec playwright install chromium on an authorized QA runner.'});return result;
  }
  result.checks.push({id:'chromium',status:'PASS'});
  const url=new URL(process.env.QA_BASE_URL??'http://127.0.0.1:4173');
  if(!['127.0.0.1','localhost','terminal.local'].includes(url.hostname)){
    result.checks.push({id:'local-preview',status:'BLOCKED',reason:'Offline fixtures are local-only; hosted staging needs genuine authorized sessions.'});return result;
  }
  try{const response=await fetch(url,{signal:AbortSignal.timeout(10_000),redirect:'error'});if(!response.ok)throw Error('HTTP '+response.status);result.checks.push({id:'local-preview',status:'PASS'});}
  catch(error){result.checks.push({id:'local-preview',status:'BLOCKED',reason:error.message});return result;}
  let browser;try{browser=await chromium.launch({args:['--disable-dev-shm-usage']});result.checks.push({id:'browser-launch',status:'PASS'});result.status='PASS';}
  catch(error){result.checks.push({id:'browser-launch',status:'BLOCKED',reason:error.message.split('\n')[0]});}
  finally{await browser?.close();}return result;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const result=await browserPreflight();mkdirSync('test-results',{recursive:true});
  writeFileSync('test-results/browser-preflight.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));if(result.status!=='PASS')process.exitCode=2;
}
