import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';

const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
const primitive=tag=>({children,...props})=>createElement(tag,props,children);
const pass=({children})=>children;
const radix={Dialog:{Root:pass,Portal:pass,Content:primitive('section'),Overlay:primitive('aside'),Close:primitive('button'),Trigger:primitive('button'),Title:primitive('h2'),Description:primitive('p')},AlertDialog:{Root:pass,Portal:pass,Content:primitive('section'),Overlay:primitive('aside'),Title:primitive('h2'),Description:primitive('p'),Trigger:primitive('button'),Action:primitive('button'),Cancel:primitive('button')}};
const cache=new Map();
function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('require','module','exports',code)(name=>{if(name==='radix-ui')return radix;if(name==='@/components/ui/button')return {Button:primitive('button')};if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx'].map(ext=>target+ext).find(existsSync);if(!target)throw Error(name);return load(path.relative(root,target));}return require(name);},module,module.exports);
 return module.exports;
}
const domain=load('lib/luxury-windows.ts'),dialog=load('components/ui/dialog.tsx'),chrome=load('components/merge-window-chrome.tsx');
assert.deepEqual(domain.museumWindowJourney.map(x=>x.id),['city','museum','house','exhibit','atelier','legacy']);
const panels=['personal-ai','registration','journey','commercial','collection','system','verify','governance','passport','fit','photos','detail','exhibit','point','pulse','vitrine','children','entry-law'];
for(const panel of panels)assert.notEqual(domain.museumPanelWindow(panel),'museum','every existing named panel has its own context');
assert.equal(domain.museumPanelWindow('unrecognized'),'museum');assert.equal(domain.museumPanelWindow('entry-law'),'coins');assert.equal(domain.museumPanelWindow('personal-ai'),'ai');
for(const [kind,preset] of Object.entries(domain.luxuryWindowPresets)){
 assert(existsSync(path.join(root,'public',preset.image)),'real approved image exists for '+kind);
 assert(Number.isInteger(preset.stage)&&preset.stage>=0&&preset.stage<6);
 const html=renderToStaticMarkup(createElement(chrome.MergeWindowChrome,{kind}));
 assert(html.includes('/assets/official-company-logo.svg'));assert(html.includes(preset.label.replaceAll('&','&amp;')));
 assert.equal((html.match(/aria-current="location"/g)||[]).length,1);assert.equal((html.match(/<li(?: |\>)/g)||[]).length,6);
 assert(!/[ა-ჰ]/.test(html),'new frame language is English');
}
const shuffled=[...domain.approvedVisualSequence].reverse().map(image=>({image}));shuffled.push(shuffled[0],{image:'/assets/unranked-qa.png'});
assert.deepEqual(domain.orderMuseumReferences(shuffled).map(x=>x.image),[...domain.approvedVisualSequence.filter(image=>image!=='/assets/material-passport.png'),'/assets/unranked-qa.png']);assert.equal(shuffled.length,domain.approvedVisualSequence.length+2,'ordering never mutates the existing input');
assert.deepEqual(domain.orderMuseumReferences([{image:'b'},{image:'a'},{image:'b'}]),[{image:'b'},{image:'a'}],'unranked approved records stay stable and duplicates are removed by path');

// Render the real shared frame and inspect the primitive boundary. The Radix
// adapter is local QA; it cannot establish browser focus trapping or pixels.
let pressed=0,focused=0;
const focus=()=>{focused++;};const child=createElement('button',{key:'action',onClick:()=>pressed++,disabled:false},'Existing action');
const tree=dialog.DialogContent({visual:'coins',className:'museum-dialog',onCloseAutoFocus:focus,children:[createElement(dialog.DialogTitle,{key:'t'},'Actual title'),createElement(dialog.DialogDescription,{key:'d'},'Actual description'),child]});
function visit(node,result=[]){if(!node||typeof node!=='object')return result;if(Array.isArray(node)){node.forEach(x=>visit(x,result));return result;}result.push(node);visit(node.props?.children,result);return result;}
const nodes=visit(tree),content=nodes.find(x=>x.type===radix.Dialog.Content);
assert.equal(content.props.onCloseAutoFocus,focus);content.props.onCloseAutoFocus();assert.equal(focused,1);
assert.equal(content.props['data-window-kind'],'coins');assert(content.props.className.includes('museum-dialog'));assert(content.props.className.includes('merge-luxury-window'));
const retained=nodes.find(x=>x===child);assert(retained,'the actual child element is preserved');retained.props.onClick();assert.equal(pressed,1);
const html=renderToStaticMarkup(tree);for(const text of ['Actual title','Actual description','Existing action','merge-window-content','GOLD &amp; SILVER','Close'])assert(html.includes(text),text);
assert.equal((html.match(/merge-window-close/g)||[]).length,1);
const ownClose=renderToStaticMarkup(dialog.DialogContent({showCloseButton:false,visual:'fit',children:createElement('button',{'data-custom-close':true},'Custom return')}));assert(!ownClose.includes('merge-window-close'));assert(ownClose.includes('Custom return'));
const compact=renderToStaticMarkup(dialog.DialogContent({visual:'ai',children:'AI content'}));assert(compact.includes('data-window-chrome="compact"'));assert(!compact.includes('merge-window-sequence'));
const sheet=renderToStaticMarkup(load('components/ui/sheet.tsx').SheetContent({children:child}));assert(sheet.includes('merge-luxury-sheet'));assert(sheet.includes('Existing action'));
const alert=renderToStaticMarkup(load('components/ui/alert-dialog.tsx').AlertDialogContent({children:'Confirm original action'}));assert(alert.includes('merge-luxury-alert'));assert(alert.includes('Confirm original action'));

for(const name of ['components/museum.tsx','components/grand-atrium.tsx','components/megapolis.tsx','components/photo-megapolis.tsx']){
 const source=readFileSync(path.join(root,name),'utf8');for(const match of source.matchAll(/<DialogContent\b/g))assert(source.slice(match.index,match.index+150).includes('visual='),'every actual Site window is mapped: '+name);
}
const css=readFileSync(path.join(root,'app/luxury-windows.css'),'utf8');for(const rule of ['prefers-reduced-motion','max-width:760px','overflow-y:auto','focus-visible','min-height:0','dialog-overlay','select-content','merge-luxury-sheet'])assert(css.includes(rule),rule);
assert(readFileSync(path.join(root,'app/layout.tsx'),'utf8').includes('import "./luxury-windows.css"'));
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const dir of ['app','components','lib'])for(const file of walk(path.join(root,dir)).filter(x=>/\.(ts|tsx|css)$/.test(x)))assert(!/platin(?:um|a)|პლატინ|платин/i.test(readFileSync(file,'utf8')),'no forbidden metal label in frontend text: '+file);
console.log('PASS: all existing window contexts, exact company asset, six-stage context and ordered/deduplicated references, preserved child actions and close/focus callbacks, shared dialogs/sheets/alerts, English frame labels and responsive/scroll/focus boundaries. No browser pixel/focus or real CORE E2E claim.');
