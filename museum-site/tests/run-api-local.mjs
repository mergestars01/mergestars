import { spawn } from 'node:child_process';
const child = spawn(process.execPath, ['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state','--ip','127.0.0.1','--inspector-port','0','--port','8890'], {stdio:['ignore','pipe','pipe']});
let output='', started=false, result=1, test;
const requested=process.argv[2];
if(requested&&!['core','foundation','boundaries'].includes(requested)) throw new Error('Unknown API test suite');
const timer=setTimeout(()=>{console.error('Local API verification timed out');test?.kill('SIGTERM');child.kill('SIGTERM');process.exitCode=1;},45000);
async function run(){
  const suites=requested?[requested]:['foundation','boundaries'];
  for(const suite of suites){
    test=spawn(process.execPath,[`tests/${suite==='foundation'?'foundation-api':'core-api'}.mjs`,'http://127.0.0.1:8890',...(suite==='boundaries'?['--boundaries']:[])],{stdio:'inherit'});
    await new Promise(resolve=>test.on('exit',code=>{result=code ?? 1;resolve();}));
    if(result) break;
  }
  if(result) console.error(output.slice(-4000));clearTimeout(timer);child.kill('SIGTERM');process.exitCode=result;
}
child.stdout.on('data',data=>{output+=data; if(!started&&output.includes('Ready on http://127.0.0.1:8890')){started=true;void run();}});
child.stderr.on('data',data=>{output+=data;});
child.on('exit',code=>{if(!started){clearTimeout(timer);console.error(output.slice(-3000));process.exitCode=code||1;}});
