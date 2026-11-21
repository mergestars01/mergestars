'use client';
import {useEffect,useRef,useState} from 'react';
import {CompanyMark,CompanyWordmark} from '@/components/company-identity';
import {LifeCycleBatchStudio} from '@/components/life-cycle-batch-studio';
import {LifeCycleAIConcierge} from '@/components/life-cycle-ai-concierge';
import {LifeCyclePublicCatalogue} from '@/components/life-cycle-public-catalogue';
import {clientRequestId} from '@/lib/client-request-id';
import {coinMetalReference,formatCoinMetalReference} from '@/lib/coin-sky-prices';
import type {CorePrices} from '@/lib/core-contract';
import type {LifeCycleDraft,LifeCycleInput} from '@/lib/life-cycle-draft-contract';
import {connectExistingCoreSession,loadLifeCycleDrafts,saveLifeCycleDraft} from '@/lib/life-cycle-draft-client';
import {CYCLES,positionAtClock,type CycleId,type Line} from '@/lib/life-cycle-2026';
import './life-cycle-page.css';

type View='entry'|'lines'|'clock'|'studio'|'house'|'city';
const views:View[]=['entry','lines','clock','studio','house','city'];
const steps=['იდეა და MERGE AI კონსულტაცია','დიზაინისა და 3D ვერსიის შექმნა','ბრენდის, უფლებებისა და მწარმოებლის გადამოწმება',
'Verified Offer — ხელმოწერილი და ვადიანი შეთავაზება','შეთავაზების მიღება და რეალური შეკვეთა','ბანკის მიერ გადახდის დადასტურება',
'CORE-ის წარმოების ცალკე ავტორიზაცია','წარმოება და QC / XRF','QR პასპორტი, მიწოდება და უფლებამოსილი ექსპონირება','დადასტურებული რეალური გაყიდვის საკომისიო პირდაპირ ბანკში'];
const countsEmpty={gold:0,silver:0,total:0};
export default function Page(){
 const [view,setView]=useState<View>('entry');
 const [navigationReady,setNavigationReady]=useState(false);
 const [portal,setPortal]=useState<CycleId>('fashion');
 const [line,setLine]=useState<Line>('GOLD');
 const [brief,setBrief]=useState('');
 const [parent,setParent]=useState<string|null>(null);
 const [drafts,setDrafts]=useState<LifeCycleDraft[]>([]);
 const [counts,setCounts]=useState(countsEmpty);
 const [cursor,setCursor]=useState<string|null>(null);
 const [draftStatus,setDraftStatus]=useState<'loading'|'ready'|'login'|'unavailable'>('loading');
 const [draftSaving,setDraftSaving]=useState(false);
 const [loadingMore,setLoadingMore]=useState(false);
 const [note,setNote]=useState('');
 const [ai,setAi]=useState(false);
 const [chatBatch,setChatBatch]=useState<{id:string;prompt:string;language:string;portal:CycleId;line:Line}|undefined>();
 const [prices,setPrices]=useState<CorePrices|undefined>();
 const [priceStatus,setPriceStatus]=useState<'loading'|'unavailable'|'received'>('loading');
 const [savedPayload,setSavedPayload]=useState<string|null>(null);
 const pending=useRef<{fingerprint:string;input:LifeCycleInput}|null>(null);
 const saving=useRef(false);
 const sessionEpoch=useRef(0);
 const main=useRef<HTMLElement|null>(null);
 const mounted=useRef(false);
 const selection={cycle_id:portal,line,brief:brief.trim(),parent_draft_id:parent};
 const fingerprint=JSON.stringify(selection);

 function navigate(next:View,cycle=portal,metal=line){
  setPortal(cycle);setLine(metal);setView(next);setNote('');
  const url=new URL(window.location.href);url.searchParams.set('view',next);url.searchParams.set('cycle',cycle);url.searchParams.set('line',metal);
  window.history.pushState(null,'',url.pathname+url.search);
 }
 useEffect(()=>{
  const restore=()=>{const q=new URL(window.location.href).searchParams;
   const v=q.get('view') as View,c=q.get('cycle'),l=q.get('line');
   setView(views.includes(v)?v:'entry');
   if(CYCLES.some(p=>p.id===c))setPortal(c as CycleId);
   if(l==='GOLD'||l==='SILVER')setLine(l);
   setNavigationReady(true);
  };restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);
 },[]);
 useEffect(()=>{if(mounted.current)main.current?.focus({preventScroll:false});else mounted.current=true;},[view]);
 useEffect(()=>{const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),12000);let active=true;
  fetch('/api/core/prices',{cache:'no-store',credentials:'same-origin',signal:ctrl.signal}).then(async r=>{
   if(!r.ok)throw Error('CORE_UNAVAILABLE');return await r.json() as CorePrices;
  }).then(data=>{if(active){setPrices(data);setPriceStatus('received');}}).catch(()=>{if(active)setPriceStatus('unavailable');}).finally(()=>clearTimeout(timer));
  return()=>{active=false;ctrl.abort();clearTimeout(timer);};
 },[]);
 useEffect(()=>{
  let active=true;let controller:AbortController;
  async function reload(){
   ++sessionEpoch.current;
   controller?.abort();controller=new AbortController();const current=controller;
   setDraftStatus('loading');setDrafts([]);setCounts(countsEmpty);setCursor(null);
   try{
    await connectExistingCoreSession(fetch,current.signal);
    const result=await loadLifeCycleDrafts(null,fetch,current.signal);
    if(!active||current.signal.aborted)return;
    setDrafts(result.drafts);setCounts(result.counts);setCursor(result.next_cursor);setDraftStatus('ready');
   }catch(e){if(active&&!current.signal.aborted)setDraftStatus(e instanceof Error&&e.message==='AUTH_REQUIRED'?'login':'unavailable');}
  }
  const changed=(event:StorageEvent)=>{if(event.key==='merge-stars-auth'){
   setBrief('');setParent(null);setSavedPayload(null);setChatBatch(undefined);pending.current=null;void reload();
  }};
  void reload();window.addEventListener('storage',changed);
  return()=>{active=false;++sessionEpoch.current;controller?.abort();window.removeEventListener('storage',changed);};
 },[]);
 const chosen=CYCLES.find(c=>c.id===portal)!;
 function openStudio(id:CycleId){setBrief('');setParent(null);setSavedPayload(null);pending.current=null;navigate('studio',id);}
 function edit(draft:LifeCycleDraft){setBrief(draft.brief);setParent(draft.id);setSavedPayload(null);pending.current=null;navigate('studio',draft.cycle_id,draft.line);}
 async function save(){
  if(saving.current||draftStatus!=='ready'||!selection.brief||selection.brief.length>500||savedPayload===fingerprint)return;
  if(!pending.current||pending.current.fingerprint!==fingerprint)pending.current={fingerprint,input:{...selection,request_id:clientRequestId()}};
  const epoch=sessionEpoch.current;
  const attempt=pending.current;saving.current=true;setDraftSaving(true);setNote('ინახება…');
  try{
   const result=await saveLifeCycleDraft(attempt.input);
   if(epoch!==sessionEpoch.current)return;
   if(!drafts.some(d=>d.id===result.draft.id))setCounts(c=>({...c,total:c.total+1,[result.draft.line==='GOLD'?'gold':'silver']:c[result.draft.line==='GOLD'?'gold':'silver']+1}));
   setDrafts(a=>[result.draft,...a.filter(d=>d.id!==result.draft.id)]);
   setSavedPayload(attempt.fingerprint);pending.current=null;
   setNote('ტექსტური მონახაზი შენახულია პირად სახლში. სურათი და 3D მოდელი ამ მოქმედებით არ იქმნება.');
   try{
    const refreshed=await loadLifeCycleDrafts();if(epoch!==sessionEpoch.current)return;
    setDrafts(refreshed.drafts);setCounts(refreshed.counts);setCursor(refreshed.next_cursor);
   }catch{if(epoch===sessionEpoch.current)setNote('მონახაზი შენახულია. კოლექციის განახლება ვერ დასრულდა — გვერდის განახლების შემდეგ კვლავ გამოჩნდება.');}
  }catch(e){if(epoch!==sessionEpoch.current)return;const code=e instanceof Error?e.message:'';
   if(code==='AUTH_REQUIRED'){setDrafts([]);setCounts(countsEmpty);setDraftStatus('login');}
   setNote(code==='AUTH_REQUIRED'?'შედით არსებულ MERGE ანგარიშში.':code==='INVALID_PARENT'?'საწყისი ვერსია მიუწვდომელია. დაბრუნდით პირად კოლექციაში.':'შენახვის დადასტურება ვერ მივიღეთ. ხელახალი ცდა იმავე მოთხოვნას გამოიყენებს და დუბლიკატს არ შექმნის.');
  }finally{saving.current=false;setDraftSaving(false);}
 }
 async function more(){
  if(!cursor||loadingMore)return;const epoch=sessionEpoch.current;setLoadingMore(true);
  try{const result=await loadLifeCycleDrafts(cursor);if(epoch!==sessionEpoch.current)return;setDrafts(a=>[...a,...result.drafts.filter(d=>!a.some(x=>x.id===d.id))]);setCounts(result.counts);setCursor(result.next_cursor);}
  catch{if(epoch===sessionEpoch.current)setNote('შემდეგი გვერდი ვერ ჩაიტვირთა. სცადეთ ხელახლა.');}finally{setLoadingMore(false);}
 }
 async function refreshPreviews(epoch:number){
  try{const result=await loadLifeCycleDrafts();if(epoch!==sessionEpoch.current)return;setDrafts(result.drafts);setCounts(result.counts);setCursor(result.next_cursor);}
  catch{if(epoch===sessionEpoch.current)setNote('კოლექციის განახლება ვერ დასრულდა. ხელახლა გახსენით გვერდი.');}
 }
 const storageMessage=draftStatus==='loading'?'პირადი კოლექცია იტვირთება…':draftStatus==='login'?'შენახვისთვის შედით არსებულ MERGE ანგარიშში.':draftStatus==='unavailable'?'CORE ანგარიშის ან შენახვის სერვისი ამჟამად მიუწვდომელია.':'პირადი კოლექცია დაკავშირებულია MERGE ანგარიშთან.';
 return <div className="merge-life">
  <a href="#life-main" className="life-skip">გადასვლა შიგთავსზე</a>
  <header className="life-header"><CompanyWordmark/><button onClick={()=>navigate('entry')}>მთავარი</button><a href="/">მუზეუმი</a></header>
  <main id="life-main" tabIndex={-1} ref={main}>
   {view!=='entry'&&<nav className="life-phases" aria-label="მუზეუმის ნავიგაცია"><button onClick={()=>navigate('lines')}>GOLD / SILVER</button><button onClick={()=>navigate('clock')}>12 პორტალი</button><button onClick={()=>navigate('house')}>ჩემი სახლი</button></nav>}
   {view==='entry'&&<section className="life-entry">
    <p className="life-kicker">THE LIVING MUSEUM</p><h1>შენი ცხოვრება. შენი დიზაინი. შენი სამყარო.</h1>
    <p>ერთი MERGE COIN ხსნის შენს სამყაროს — ცხოვრების თორმეტ მიმართულებას და შენს პირად სახლს.</p>
    <button className="life-main-coin" disabled={!navigationReady} onClick={()=>navigate('lines')} aria-label="OPEN MERGE COIN"><CompanyMark decorative/><strong>MERGE COIN</strong><span>OPEN YOUR WORLD</span></button>
    <p className="life-info">დიზაინის დასაწყებად ფიზიკური კოინის შეძენა არ არის საჭირო.</p>
   </section>}
   {view==='lines'&&<section className="life-lines"><p className="life-kicker">INSIDE YOUR MERGE COIN</p><h1>აირჩიე შენი მიმართულება</h1>
    <div className="life-choices">{(['GOLD','SILVER'] as const).map(l=><button key={l} className={'life-line '+l.toLowerCase()} onClick={()=>navigate('clock',portal,l)} aria-label={'Explore '+l}>
     <CompanyMark decorative/><strong>{l}</strong><small>{l==='GOLD'?'Au':'Ag'} 999.9 · 1 კგ საცნობარო ფასი: {priceStatus==='loading'?'იტვირთება…':formatCoinMetalReference(coinMetalReference(prices,l==='GOLD'?'gold':'silver'))}</small><span>ცხოვრების 12 პორტალი</span>
    </button>)}</div><p className="life-info">ორივე ხაზი ხსნის შემოქმედებით სივრცეს. კომერციული უფლებები და შეთავაზება ცალკე მოწმდება. საცნობარო ფასი არ არის პროდუქტის დადასტურებული შეთავაზება. {priceStatus==='unavailable'?'ფასის წყარო მიუწვდომელია.':''}</p>
   </section>}
   {view==='clock'&&<section><p className="life-kicker">{line} · THE LIVING MUSEUM</p><h1>12 ცხოვრებისეული პორტალი</h1><p>ცენტრში მეცამეტე სივრცეა — შენი პირადი Brand House.</p>
    <div className="life-clock-layout"><div className="life-clock" aria-label="საათის ციფერბლატი"><div className="life-garden"/>
     <button className="life-center" onClick={()=>navigate('house')} aria-label="Open my private Brand House"><CompanyMark decorative/><b>13</b><span>MY HOUSE</span></button>
     {CYCLES.map((c,i)=><button key={c.id} className="life-hour" style={positionAtClock(i+1)} onClick={()=>openStudio(c.id)} aria-label={'Open '+c.en}><CompanyMark decorative/><span>{i+1}</span></button>)}
    </div><div className="life-portals">{CYCLES.map((c,i)=><button key={c.id} onClick={()=>openStudio(c.id)}><span>{String(i+1).padStart(2,'0')}</span><b>{c.ka}</b><small>{c.en}</small></button>)}</div></div>
   </section>}
   {view==='studio'&&<section className="life-studio"><p className="life-kicker">{line} · {parent?'NEW VERSION':'PRIVATE BRIEF'}</p><h1>{chosen.ka}</h1>
    <p>{parent?'ცვლილება შეინახება ახალ ვერსიად; საწყისი ჩანაწერი უცვლელად დარჩება.':'აღწერე ნივთი, რომლის შექმნაც გსურს.'}</p>
    <div className="life-suggestions">{chosen.examples.map(x=><button key={x} onClick={()=>setBrief('მსურს შევქმნა '+x+' ჩემი დიზაინით. დამეხმარე ზომების და მასალის შერჩევაში.')}>{x}</button>)}</div>
    <label htmlFor="life-description">რა გინდა შექმნა?</label><textarea id="life-description" maxLength={500} rows={5} value={brief} onChange={e=>setBrief(e.target.value)}/>
    <div className="life-material"><span>ხაზი:</span>{(['GOLD','SILVER'] as const).map(l=><button key={l} aria-pressed={line===l} className={line===l?'selected':''} onClick={()=>setLine(l)}>{l}</button>)}</div>
    <p className="life-info">ინახება ტექსტი, მიმართულება, ხაზი და ვერსიის კავშირი. სურათისა და 3D მოდელის გენერაცია ჯერ დაუკავშირებელია. მონახაზი არ არის გასაყიდი პროდუქტი ან შეკვეთა.</p>
    <p role="status">{storageMessage}</p>{draftStatus==='login'&&<a href="https://mergestars.com/login">შესვლა MERGE ანგარიშში</a>}
    <div className="life-actions"><button disabled={draftSaving||draftStatus!=='ready'||!brief.trim()||savedPayload===fingerprint} onClick={()=>void save()}>{draftSaving?'ინახება…':parent?'შეინახე ახალი ვერსია':'შეინახე პირადი მონახაზი'}</button><button onClick={()=>navigate('house')}>ჩემი Brand House</button></div>
    <p role="status">{note}</p>
    <LifeCycleBatchStudio key={portal+'-'+line+'-'+sessionEpoch.current} cycle={portal} cycleName={chosen.ka} line={line} authenticated={draftStatus==='ready'} onSaved={()=>void refreshPreviews(sessionEpoch.current)} chatRequest={chatBatch?.portal===portal&&chatBatch?.line===line?chatBatch:undefined} onChatConsumed={()=>setChatBatch(undefined)}/>
   </section>}
   {view==='house'&&<section><p className="life-kicker">PRIVATE · NOT PUBLISHED</p><h1>MY BRAND HOUSE</h1><p>შენი პირადი ტექსტური მონახაზები და მათი ვერსიები. საჯაროობა, გაყიდვა და გამრავლების უფლება ცალკე დასტურდება CORE-ში.</p>
    <div className="life-house-summary"><div className="life-house-garden"><CompanyMark decorative/><b>MY BRAND HOUSE</b></div><div className="life-stats"><div><span>GOLD · ჩანაწერები</span><b>{counts.gold}</b></div><div><span>SILVER · ჩანაწერები</span><b>{counts.silver}</b></div><div><span>ყველა ჩანაწერი</span><b>{counts.total}</b></div></div></div>
    <p role="status">{storageMessage}</p>{draftStatus==='login'&&<a href="https://mergestars.com/login">შესვლა MERGE ანგარიშში</a>}
    <details className="life-concept-references"><summary>MERGE · პირველი სახლის იდეები</summary><p>CONCEPT REFERENCES · ეს მაგალითები შენს შენახულ მონახაზებს არ ემატება.</p><ul><li>MERGE COIN WATCH</li><li>MERGE LUXURY PHONE</li><li>MERGE COMPACT SMART EYEWEAR</li></ul><p>VERTU და Meta განიხილება შესაძლო მწარმოებლებად. პარტნიორობა, ტექნიკური შესაძლებლობები და ნებართვები დადასტურებული არ არის.</p></details>
    <h2>ჩემი პირადი მონახაზები</h2>{drafts.length?drafts.map(d=><article className="life-preview" key={d.id} data-draft-id={d.id}><b>{d.line} · {CYCLES.find(c=>c.id===d.cycle_id)?.ka}</b><p>{d.brief}</p><small>{d.parent_draft_id?'განახლებული ვერსია':'საწყისი მონახაზი'} · {new Date(d.created_at).toLocaleDateString('ka-GE')}</small><button onClick={()=>edit(d)}>გახსენი და განაგრძე</button></article>):draftStatus==='ready'?<p>ჯერ მონახაზები არ გაქვს. დაიწყე ერთ-ერთი პორტალიდან.</p>:null}
    {cursor&&<button disabled={loadingMore} onClick={()=>void more()}>{loadingMore?'იტვირთება…':'ჩატვირთე მეტი მონახაზი'}</button>}<p role="status">{note}</p>
    <div className="life-actions"><button onClick={()=>navigate('clock')}>პორტალები</button><button onClick={()=>navigate('city')}>Brand Megapolis</button></div>
   </section>}
   {view==='city'&&<section><p className="life-kicker">STAGE II · VERIFIED PUBLIC CATALOGUE</p><h1>BRAND MEGAPOLIS</h1><p>პირადი სახლი ავტომატურად არ ხდება საჯარო გამყიდველი. მხოლოდ ჩვენებაზე თანხმობა ნივთის ასლის წარმოების ან გაყიდვის უფლებას არ იძლევა.</p>
    <div className="life-city"><CompanyMark decorative/><b>PRIVATE HOUSE · CORE REVIEW · APPROVED PUBLICATION</b></div><LifeCyclePublicCatalogue/>
    <div className="life-workflow">{steps.map((s,i)=><div key={s}><span>{String(i+1).padStart(2,'0')}</span><p>{s}</p></div>)}</div>
    <p className="life-info">შეკვეთა, გადახდა, წარმოება და პასპორტი ამ გვერდიდან ჯერ არ სრულდება. ეს ეტაპები რეალურ CORE ინტეგრაციასა და ცალკე დადასტურებას მოითხოვს.</p>
   </section>}
  </main>
  <button className="life-ai-toggle" onClick={()=>setAi(v=>!v)} aria-expanded={ai}>MERGE AI · პირადი ოქრომჭედელი</button>
  {ai&&<LifeCycleAIConcierge cycle={chosen.ka} line={line} onClose={()=>setAi(false)} onTwelveDesigns={(prompt,language)=>{setChatBatch({id:clientRequestId(),prompt,language,portal,line});navigate('studio');}}/>}
  <footer><span>MERGE ⭐ STARS</span><span>PRIVATE CREATIVE EXPERIENCE</span></footer>
 </div>;
}
