"use client";
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {clientRequestId} from '@/lib/client-request-id';
import {batchDesignPrompt,parseSelectedRevisions,parseTwelveDesigns,revisionDesignPrompt,type DesignConcept} from '@/lib/life-cycle-batch';
import {lifeCycleHistorySchema,lifeCycleRevisionSaveSchema} from '@/lib/life-cycle-draft-contract';
import {loadLifeCycleDrafts,saveLifeCycleDraft} from '@/lib/life-cycle-draft-client';
import type {CycleId,Line} from '@/lib/life-cycle-2026';

type Version=DesignConcept&{requestId:string};
type Slot={index:number;versions:Version[];id?:string;persisted:number;selected:boolean;error?:string};
type Availability={status:string;roles:{role:string;available:boolean}[]};
const LANGUAGES=[{id:'ka',label:'ქართული'},{id:'en',label:'English'},{id:'ru',label:'Русский'},{id:'ar',label:'العربية'}] as const;
const joinBrief=(d:DesignConcept)=>d.title+' — '+d.brief;
function splitBrief(brief:string,index:number):DesignConcept{
 const sep=brief.indexOf(' — ');
 return sep>1&&sep<=80?{title:brief.slice(0,sep),brief:brief.slice(sep+3)}:{title:'დიზაინი '+index,brief};
}
function asSlot(d:{id:string;brief:string;version?:number},index:number):Slot{
 return {index,id:d.id,versions:[{...splitBrief(d.brief,index),requestId:clientRequestId()}],persisted:d.version??1,selected:false};
}
async function sendAi(message:string,signal:AbortSignal):Promise<string>{
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),35000);
 try{
  const r=await fetch('/api/ai-manager',{method:'POST',cache:'no-store',credentials:'same-origin',redirect:'error',signal:AbortSignal.any([signal,controller.signal]),
   headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({request_id:clientRequestId(),role:'design',consent:true,message,history:[]})});
  if(!r.ok)throw Error(r.status===401?'AUTH_REQUIRED':r.status===429?'RATE_LIMIT':'AI_UNAVAILABLE');
  const v=await r.json() as {status?:unknown;reply?:unknown;external_action_executed?:unknown;core_record_created?:unknown};
  if(v.status!=='ANSWERED'||typeof v.reply!=='string'||v.external_action_executed!==false||v.core_record_created!==false)throw Error('AI_INVALID');
  return v.reply;
 }finally{clearTimeout(timer);}
}
async function saveDraft(cycle:CycleId,line:Line,version:Version,signal:AbortSignal){
 const result=await saveLifeCycleDraft({request_id:version.requestId,cycle_id:cycle,line,brief:joinBrief(version)},fetch,signal);
 return result.draft.id;
}
async function saveRevision(id:string,version:Version,signal:AbortSignal){
 const r=await fetch('/api/life-cycle-revisions',{signal:AbortSignal.any([signal,AbortSignal.timeout(12000)]),method:'POST',cache:'no-store',credentials:'same-origin',redirect:'error',
  headers:{'Content-Type':'application/json',Accept:'application/json'},
  body:JSON.stringify({request_id:version.requestId,draft_id:id,brief:joinBrief(version)})});
 if(!r.ok)throw Error(r.status===401?'AUTH_REQUIRED':r.status===404?'DRAFT_NOT_FOUND':r.status===409?'REVISION_CONFLICT':'REVISION_UNAVAILABLE');
 const json=lifeCycleRevisionSaveSchema.safeParse(await r.json());
 if(!json.success)throw Error('INVALID_REVISION_REPLY');
 return json.data.revision.version;
}
export function LifeCycleBatchStudio({cycle,cycleName,line,onSaved,authenticated,chatRequest,onChatConsumed}:{cycle:CycleId;cycleName:string;line:Line;onSaved:()=>void;authenticated:boolean;chatRequest?:{id:string;prompt:string;language:string};onChatConsumed?:()=>void}){
 const lifetime=useRef(new AbortController());
 const lastChatRequest=useRef(''),listRead=useRef(0);
 const plan=useRef<{fingerprint:string;changes:(DesignConcept&{index:number;requestId:string})[]}|null>(null);
 useEffect(()=>{lifetime.current=new AbortController();return()=>lifetime.current.abort();},[]);
 const [language,setLanguage]=useState('ka');
 const [intent,setIntent]=useState('');
 const [revision,setRevision]=useState('');
 const [consent,setConsent]=useState(false);
 const [available,setAvailable]=useState(false);
 const [checking,setChecking]=useState(true);
 const [loading,setLoading]=useState(false);
 const [saving,setSaving]=useState(false);
 const [slots,setSlots]=useState<Slot[]>([]);
 const [status,setStatus]=useState('');
 const [historyFor,setHistoryFor]=useState<number|null>(null);
 const [history,setHistory]=useState<string[]>([]);
 const selected=useMemo(()=>slots.filter(s=>s.selected),[slots]);

 const loadSaved=useCallback(async(signal?:AbortSignal)=>{
  let cursor:string|null=null;const rows:Awaited<ReturnType<typeof loadLifeCycleDrafts>>['drafts']=[];
  do{const page=await loadLifeCycleDrafts(cursor,fetch,signal);rows.push(...page.drafts.filter(d=>d.cycle_id===cycle&&d.line===line));cursor=page.next_cursor;}while(cursor&&!signal?.aborted);
  return rows.reverse().map((d,i)=>asSlot(d,i+1));
 },[cycle,line]);
 useEffect(()=>{let active=true;const ctrl=new AbortController();
  setSlots([]);setHistory([]);setHistoryFor(null);setStatus('');
  const sequence=++listRead.current;
  if(authenticated)void loadSaved(ctrl.signal).then(rows=>{if(active&&sequence===listRead.current)setSlots(rows);}).catch(()=>{if(active)setStatus('შენახული დიზაინების სერვისი დროებით მიუწვდომელია.');});
  return()=>{active=false;ctrl.abort();};
 },[authenticated,loadSaved]);
 useEffect(()=>{let active=true;const ctrl=new AbortController();
  void fetch('/api/ai-manager',{cache:'no-store',credentials:'same-origin',signal:ctrl.signal}).then(async r=>{
   if(!r.ok)throw Error('AI_UNAVAILABLE');
   return await r.json() as Availability;
  }).then(v=>{if(active)setAvailable(v.status==='READY_TO_REQUEST'&&Array.isArray(v.roles)&&v.roles.some(x=>x.role==='design'&&x.available));})
   .catch(()=>{if(active)setAvailable(false);}).finally(()=>{if(active)setChecking(false);});
  return()=>{active=false;ctrl.abort();};
 },[]);
 const createBatch=useCallback(async(input:string,locale:string)=>{
  if(!authenticated||!input.trim()||!available||loading||saving)return;
  ++listRead.current;
  const signal=lifetime.current.signal;setLoading(true);setStatus('MERGE AI ამზადებს 12 დამოუკიდებელ კონცეფციას...');
  try{
   const reply=await sendAi(batchDesignPrompt(cycleName,line,input.trim().slice(0,1200),locale),signal);
   if(signal.aborted)return;const designs=parseTwelveDesigns(reply);
   setSlots(designs.map((d,i)=>({index:i+1,versions:[{...d,requestId:clientRequestId()}],persisted:0,selected:false})));
   setHistoryFor(null);setStatus('მომზადებულია 12 ტექსტური კონცეფცია. ეს ჯერ არ არის გამოსახულება, 3D მოდელი ან CORE პროდუქტი.');
  }catch{if(signal.aborted)return;setStatus('AI-მ ვერ დააბრუნა 12 დადასტურებადი კონცეფცია. ძველი კოლექცია არ შეცვლილა; სცადე თავიდან.');}
  finally{if(!signal.aborted)setLoading(false);}
 },[authenticated,available,loading,saving,cycleName,line]);
 async function generate(){if(consent)await createBatch(intent,language);}
 useEffect(()=>{
  if(!chatRequest||!authenticated||!available||checking||loading||saving||lastChatRequest.current===chatRequest.id)return;
  lastChatRequest.current=chatRequest.id;setIntent(chatRequest.prompt);setLanguage(chatRequest.language);setConsent(true);
  void createBatch(chatRequest.prompt,chatRequest.language);onChatConsumed?.();
 },[chatRequest,authenticated,available,checking,loading,saving,createBatch,onChatConsumed]);
 function toggle(index:number,checked:boolean){setSlots(prev=>prev.map(s=>s.index===index?{...s,selected:checked}:s));}
 async function reviseSelected(){
  if(!authenticated||!revision.trim()||!selected.length||!consent||!available||loading||saving)return;
  const signal=lifetime.current.signal;setLoading(true);setStatus('შერჩეული დიზაინების შესწორება მიმდინარეობს...');
  try{
   const current=selected.map(s=>({index:s.index,...s.versions[s.versions.length-1]}));
   const fingerprint=JSON.stringify({cycle,line,current,revision,language});
   if(!plan.current||plan.current.fingerprint!==fingerprint){
    const reply=await sendAi(revisionDesignPrompt(cycleName,line,current,revision.trim().slice(0,1200),language),signal);
    if(signal.aborted)return;
    plan.current={fingerprint,changes:parseSelectedRevisions(reply,current.map(c=>c.index)).map(c=>({...c,requestId:clientRequestId()}))};
   }
   const next:Slot[]=slots.map(s=>({...s,versions:[...s.versions]}));
   for(const c of plan.current.changes){
    if(signal.aborted)return;
    const slot=next.find(s=>s.index===c.index);if(!slot)throw Error('REVISION_TARGET_MISSING');
    const item:Version={title:c.title,brief:c.brief,requestId:c.requestId};
    if(slot.id)slot.persisted=await saveRevision(slot.id,item,signal);
    slot.versions.push(item);slot.selected=false;
   }
   if(signal.aborted)return;
   plan.current=null;setSlots(next);setRevision('');setStatus('შერჩეული ტექსტური კონცეფციები განახლდა. შენახული ჩანაწერების ახალი ვერსიები პირად ისტორიაშია.');onSaved();
  }catch{if(signal.aborted)return;onSaved();setStatus('შესწორება სრულად ვერ დადასტურდა. იგივე არჩევანითა და ტექსტით ხელახალი ცდა იმავე რევიზიების მოთხოვნებს გადაამოწმებს.');}
  finally{if(!signal.aborted)setLoading(false);}
 }
 async function saveAll(){
  if(!authenticated||!slots.length||saving||loading)return;
  const signal=lifetime.current.signal;
  setSaving(true);setStatus('დიზაინები სათითაოდ ინახება დაცულ პირად სივრცეში...');
  let ok=0,failed=0;
  const next:Slot[]=slots.map(s=>({...s,versions:[...s.versions]}));
  for(const s of next){
   if(signal.aborted)return;
   try{
    if(!s.id){s.id=await saveDraft(cycle,line,s.versions[0],signal);s.persisted=1;}
    for(let i=s.persisted;i<s.versions.length;i++){s.persisted=await saveRevision(s.id,s.versions[i],signal);}
    s.error=undefined;ok++;
   }catch(e){s.error=e instanceof Error?e.message:'SAVE_UNAVAILABLE';failed++;}
   if(signal.aborted)return;setSlots([...next]);setStatus('შენახულია: '+ok+' · დარჩენილი შეცდომა: '+failed);
  }
  setSaving(false);onSaved();setStatus(failed?'ზოგი დიზაინის შენახვა ვერ დასრულდა. ხელახლა დააჭირე „შეინახე კოლექცია“ — განმეორებითი მოთხოვნები დაცულია.':'დიზაინები შენახულია შენს პირად მუზეუმში. ეს ჯერ არ არის CORE პროდუქტი.');
 }
 async function inspectHistory(s:Slot){
  if(!s.id){setHistory(['მონახაზი ჯერ არ არის შენახული.']);setHistoryFor(s.index);return;}
  try{
   const signal=lifetime.current.signal;let cursor:string|null=null;const entries:string[]=[];
   do{
    const r=await fetch('/api/life-cycle-revisions?draft_id='+encodeURIComponent(s.id)+(cursor?'&after='+encodeURIComponent(cursor):''),{credentials:'same-origin',cache:'no-store',signal:AbortSignal.any([signal,AbortSignal.timeout(12000)])});
    if(!r.ok)throw Error('HISTORY_UNAVAILABLE');
    const p=lifeCycleHistorySchema.parse(await r.json());entries.push(...p.revisions.map(v=>'V'+v.version+' · '+v.brief));cursor=p.next_cursor;
   }while(cursor&&!signal.aborted);
   if(signal.aborted)return;setHistory(entries);
  }catch{setHistory(['ვერსიების ისტორია დროებით მიუწვდომელია.']);}
  setHistoryFor(s.index);
 }
 return <section className="life-batch" aria-labelledby="life-batch-title">
  <div className="life-batch-heading"><h2 id="life-batch-title">MERGE AI · ერთდროულად 12 დიზაინი</h2><span>{cycleName} · {line}</span></div>
  <p>უთხარი AI-ს ერთი სურვილი, მიიღე 12 განსხვავებული ტექსტური კონცეფცია, აირჩიე შესასწორებელი მოდელები და შეინახე საკუთარ Brand House-ში.</p>
  <label htmlFor="life-batch-language">საუბრის ენა</label>
  <select id="life-batch-language" value={language} onChange={e=>setLanguage(e.target.value)}>{LANGUAGES.map(l=><option value={l.id} key={l.id}>{l.label}</option>)}</select>
  <label htmlFor="life-batch-intent">რას უნდა ჰგავდეს შენი 12 დიზაინი?</label>
  <textarea id="life-batch-intent" rows={3} maxLength={1200} value={intent} onChange={e=>setIntent(e.target.value)} placeholder="მაგალითად: შექმენი 12 განსხვავებული ელეგანტური აქსესუარი ჩემი ბრენდისთვის"/>
  <label className="life-batch-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> ვეთანხმები ამ მოთხოვნის AI პროვაიდერთან გაგზავნას. არ ვწერ საბანკო ან საიდუმლო ინფორმაციას.</label>
  <button disabled={!authenticated||!available||!consent||!intent.trim()||checking||loading||saving} onClick={()=>void generate()}>{loading?'MERGE AI მუშაობს...':'შექმენი 12 დიზაინი'}</button>
  {!available&&<p className="life-info">AI პროვაიდერი არ არის აქტიური. შეგიძლია არსებული პირადი დიზაინები დაათვალიერო ან ცალ-ცალკე შეინახო მთავარ პორტალში.</p>}
  <p role="status" aria-live="polite">{status}</p>
  {slots.length>0&&<><div className="life-batch-grid">{slots.map(s=>{
   const item=s.versions[s.versions.length-1];return <article className="life-batch-card" key={s.index}>
    <header><span>№ {String(s.index).padStart(2,'0')}</span><span>V{s.persisted||s.versions.length} · {s.id?'შენახული':'მონახაზი'}</span></header>
    <h3>{item.title}</h3><p>{item.brief}</p>
    <label><input type="checkbox" checked={s.selected} disabled={loading||saving} onChange={e=>toggle(s.index,e.target.checked)}/> შესასწორებლად აირჩიე</label>
    {s.error&&<small role="alert">შენახვის შეცდომა: {s.error}</small>}
    <button type="button" onClick={()=>void inspectHistory(s)}>ვერსიების ისტორია</button>
   </article>;
  })}</div>
   {historyFor!==null&&<div className="life-batch-history"><button type="button" onClick={()=>setHistoryFor(null)}>× დახურვა</button><b>დიზაინი № {historyFor} — ვერსიები</b><ol>{history.map((h,i)=><li key={i}>{h}</li>)}</ol></div>}
   <div className="life-batch-revise"><h3>შერჩეული დიზაინების შესწორება</h3><label htmlFor="life-batch-revision">მითხარი, რა შეცვალო ({selected.length} შერჩეული)</label>
    <textarea id="life-batch-revision" rows={2} maxLength={1200} value={revision} onChange={e=>setRevision(e.target.value)} placeholder="მაგალითად: შერჩეულ მოდელებს დაუმატე ვერცხლის მოზაიკა, დანარჩენი უცვლელი დატოვე"/>
    <div className="life-batch-actions"><button type="button" disabled={!authenticated||!selected.length||!available||!consent||!revision.trim()||loading||saving} onClick={()=>void reviseSelected()}>შეასწორე შერჩეული</button>
     <button type="button" disabled={loading||saving} onClick={()=>setSlots(prev=>prev.map(s=>({...s,selected:true})))}>აირჩიე ყველა</button>
     <button type="button" disabled={loading||saving} onClick={()=>setSlots(prev=>prev.map(s=>({...s,selected:false})))}>მოხსენი არჩევა</button></div>
   </div>
   <button type="button" disabled={!authenticated||loading||saving} onClick={()=>void saveAll()}>{saving?'ინახება...':'შეინახე კოლექცია ჩემს Brand House-ში'}</button>
  </>}
  <p className="life-info">კონცეფცია ≠ რეალური ფოტო / 3D მოდელი ≠ დამტკიცებული შეთავაზება ≠ შეკვეთა. რეალური 3D, წარმოება და გადახდები CORE-ისა და პროვაიდერის ცალკე დადასტურებას საჭიროებს.</p>
 </section>;
}
