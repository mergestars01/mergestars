'use client';
import {useEffect,useState} from 'react';
import {companyIdentity} from '@/lib/company-identity';
import {LifeCycleAIConcierge} from '@/components/life-cycle-ai-concierge';
import {LifeCyclePublicCatalogue} from '@/components/life-cycle-public-catalogue';
import {clientRequestId} from '@/lib/client-request-id';
import {coinMetalReference,formatCoinMetalReference} from '@/lib/coin-sky-prices';
import type {CorePrices} from '@/lib/core-contract';
import {lifeCycleListSchema,lifeCycleSaveSchema} from '@/lib/life-cycle-draft-contract';
import {CYCLES,HOUSE_CAPACITY,LINE_CAPACITY,positionAtClock,type CycleId,type Line} from '@/lib/life-cycle-2026';
import './life-cycle-page.css';

type View='entry'|'clock'|'studio'|'house'|'city';
type Preview={id:string;portal:CycleId;line:Line;brief:string};
const steps=[
'იდეა და MERGE AI კონსულტაცია','დიზაინისა და 3D ვერსიის შექმნა','ბრენდის, უფლებებისა და მწარმოებლის გადამოწმება',
'Verified Offer — ხელმოწერილი და ვადიანი შეთავაზება','შეთავაზების მიღება და რეალური შეკვეთა',
'ბანკის მიერ გადახდის დადასტურება','CORE-ის წარმოების ცალკე ავტორიზაცია','წარმოება და QC / XRF',
'QR პასპორტი, მიწოდება და უფლებამოსილი ექსპონირება','დადასტურებული რეალური გაყიდვის საკომისიო პირდაპირ ბანკში'
];
export default function Page(){
 const [view,setView]=useState<View>('entry');
 const [portal,setPortal]=useState<CycleId>('fashion');
 const [line,setLine]=useState<Line>('GOLD');
 const [brief,setBrief]=useState('');
 const [previews,setPreviews]=useState<Preview[]>([]);
 const [draftStatus,setDraftStatus]=useState<'loading'|'ready'|'login'|'unavailable'>('loading');
 const [draftSaving,setDraftSaving]=useState(false);
 const [note,setNote]=useState('');
 const [ai,setAi]=useState(false);
 const [prices,setPrices]=useState<CorePrices|undefined>();
 const [priceStatus,setPriceStatus]=useState<'loading'|'unavailable'|'received'>('loading');
 useEffect(()=>{const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),12000);let active=true;
  void fetch('/api/core/prices',{cache:'no-store',credentials:'same-origin',signal:ctrl.signal}).then(async res=>{
    if(!res.ok)throw Error('CORE_UNAVAILABLE');return await res.json() as CorePrices;
  }).then(data=>{if(active){setPrices(data);setPriceStatus('received');}}).catch(()=>{if(active)setPriceStatus('unavailable');}).finally(()=>clearTimeout(timeout));
  return ()=>{active=false;ctrl.abort();clearTimeout(timeout);};
 },[]);
 useEffect(()=>{const ctrl=new AbortController();let active=true;
  void fetch('/api/life-cycle-drafts',{cache:'no-store',credentials:'same-origin',signal:ctrl.signal}).then(async r=>{
   if(r.status===401){if(active)setDraftStatus('login');return null;}
   if(!r.ok)throw Error('STORAGE_UNAVAILABLE');return await r.json() as unknown;
  }).then(value=>{if(!active||!value)return;const parsed=lifeCycleListSchema.safeParse(value);
   if(!parsed.success)throw Error('STORAGE_INVALID');
   setPreviews(parsed.data.drafts.map(d=>({id:d.id,portal:d.cycle_id,line:d.line,brief:d.brief})));
   setDraftStatus('ready');
  }).catch(()=>{if(active)setDraftStatus('unavailable');});
  return ()=>{active=false;ctrl.abort();};
 },[]);
 const chosen=CYCLES.find(c=>c.id===portal)!;
 const gold=previews.filter(p=>p.line==='GOLD').length;
 const silver=previews.filter(p=>p.line==='SILVER').length;
 const openStudio=(id:CycleId)=>{setPortal(id);setView('studio');setNote('');};
 const addPreview=async()=>{
  const text=brief.trim();
  if(!text||text.length>500){setNote('აღწერა უნდა შეიცავდეს 1–500 სიმბოლოს.');return;}
  if(draftStatus!=='ready'){setNote('შენახვისთვის საჭიროა მოქმედი ანგარიში და მუზეუმის ბაზასთან კავშირი.');return;}
  if(previews.filter(p=>p.portal===portal&&p.line===line).length>=12){setNote('ამ პორტალის ამ ხაზის 12 დიზაინის ადგილი შევსებულია.');return;}
  setDraftSaving(true);setNote('ინახება…');
  try{
    const response=await fetch('/api/life-cycle-drafts',{method:'POST',credentials:'same-origin',redirect:'error',cache:'no-store',headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({request_id:clientRequestId(),cycle_id:portal,line,brief:text})});
    if(response.status===401){setDraftStatus('login');throw Error('LOGIN');}
    if(response.status===409)throw Error('LIMIT');
    if(!response.ok)throw Error('STORAGE');
    const parsed=lifeCycleSaveSchema.safeParse(await response.json());
    if(!parsed.success)throw Error('INVALID');
    const item=parsed.data.draft;
    setPreviews(a=>a.some(p=>p.id===item.id)?a:[...a,{id:item.id,portal:item.cycle_id,line:item.line,brief:item.brief}]);
    setNote('დიზაინი შენახულია შენს პირად მუზეუმში. ეს ჯერ არ არის CORE პროდუქტი ან შეკვეთა.');
  }catch(e){const code=e instanceof Error?e.message:'';
    setNote(code==='LOGIN'?'დიზაინის შენახვისთვის ჯერ ანგარიშში შედი.':code==='LIMIT'?'ამ პორტალის ამ ხაზის დიზაინის ლიმიტი შევსებულია.':'დიზაინის შენახვა ვერ დასრულდა. არაფერი გაიგზავნა CORE-ში; ხელახლა სცადე.');
  }finally{setDraftSaving(false);}
 };
 return <div className="merge-life">
  <a href="#life-main" className="life-skip">გადასვლა შიგთავსზე</a>
  <header className="life-header"><img src={companyIdentity.mark} alt="MERGE STAR’S ოფიციალური ლოგო"/><div><strong>MERGE ⭐ STARS</strong><small>THE LIVING MUSEUM</small></div><button onClick={()=>setView('entry')}>მთავარი</button></header>
  <main id="life-main">
   <nav className="life-phases" aria-label="პლატფორმის ორი ეტაპი"><button onClick={()=>setView('clock')}>I · ცხოვრების 12 ციკლი</button><span>→</span><button onClick={()=>setView('city')}>II · Brand Megapolis (პრევიუ)</button></nav>
   {view==='entry'&&<section className="life-entry">
    <p className="life-kicker">სრულიად ახალი გზა იდეიდან ნამდვილ ნივთამდე</p>
    <h1>შენი ცხოვრება. შენი დიზაინი. შენი სამყარო.</h1>
    <p>ერთი სისტემა ყველა ადამიანისთვის. შეეხე MERGE COIN-ს და შეაბიჯე თორმეტი ცხოვრებისეული მიმართულების მუზეუმში.</p>
    <div className="life-choices">
     {(['GOLD','SILVER'] as const).map(l=><button key={l} className={'life-coin '+l.toLowerCase()} onClick={()=>{setLine(l);setView('clock');}}><img src={companyIdentity.mark} alt=""/><strong>{l} COIN</strong><small>{l==='GOLD'?'Au':'Ag'} 999.9 · 1 კგ საცნობარო ფასი: {priceStatus==='loading'?'იტვირთება…':formatCoinMetalReference(coinMetalReference(prices,l==='GOLD'?'gold':'silver'))}</small><span>დაიწყე დიზაინი →</span></button>)}
    </div><p className="life-info">საცნობარო ციფრი მოდის მხოლოდ CORE-ის საჯარო მონაცემებიდან და არ არის დადასტურებული კომერციული შეთავაზება. {priceStatus==='unavailable'?'ფასის წყარო ამჟამად მიუწვდომელია.':''} დიზაინის დასაწყებად ფიზიკური კოინის შეძენა არ არის საჭირო.</p><p><a href="/">მოქმედი მუზეუმი · შესვლა და რეგისტრაცია</a></p>
   </section>}
   {view==='clock'&&<section>
    <p className="life-kicker">ეტაპი I · THE LIVING MUSEUM</p><h1>12 ცხოვრებისეული პორტალი</h1><p>თითოეული ნომერი ერთი ინდუსტრიული სამყაროა. ცენტრში მე-13 — მრგვალი პირადი Brand House და ბაღი.</p>
    <div className="life-clock-layout"><div className="life-clock" aria-label="საათის ციფერბლატი">
      <div className="life-garden"/><button className="life-center" onClick={()=>setView('house')}><img src={companyIdentity.mark} alt=""/><b>13</b><span>MY BRAND HOUSE</span><small>0 → 1</small></button>
      {CYCLES.map((c,i)=><button key={c.id} className="life-hour" style={positionAtClock(i+1)} onClick={()=>openStudio(c.id)} title={c.ka}>{i+1}</button>)}
     </div><div className="life-portals">{CYCLES.map((c,i)=><button key={c.id} onClick={()=>openStudio(c.id)}><span>{String(i+1).padStart(2,'0')}</span><b>{c.ka}</b><small>{c.en}</small></button>)}</div></div>
    <div className="life-actions"><button onClick={()=>setView('entry')}>← შესასვლელი</button><button onClick={()=>setView('house')}>ჩემი Brand House →</button></div>
   </section>}
   {view==='studio'&&<section className="life-studio"><button onClick={()=>setView('clock')}>← ყველა პორტალი</button><p className="life-kicker">პორტალი {chosen.id}</p><h1>{chosen.ka}</h1><p>აირჩიე ნებისმიერი ნივთი — ჩამოთვლილი მაგალითები არჩევანს არ ზღუდავს.</p>
    <div className="life-suggestions">{chosen.examples.map(x=><button key={x} onClick={()=>setBrief('მსურს შევქმნა '+x+' ჩემი დიზაინით. დამეხმარე ზომების და მასალის შერჩევაში.')}>{x}</button>)}</div>
    <label htmlFor="life-description">რა გინდა შექმნა?</label><textarea id="life-description" maxLength={500} rows={4} value={brief} onChange={e=>setBrief(e.target.value)}/>
    <div className="life-material"><span>ხაზი:</span><button className={line==='GOLD'?'selected':''} onClick={()=>setLine('GOLD')}>GOLD</button><button className={line==='SILVER'?'selected':''} onClick={()=>setLine('SILVER')}>SILVER</button></div>
    <p className="life-info">ესკიზები ინახება მუზეუმის პირად მონაცემთა ბაზაში ავტორიზებული ანგარიშით; CORE პროდუქტის, გადახდის ან წარმოების სტატუსი არ ენიჭება. 3D გენერაცია საჭიროებს ცალკე ინტეგრაციას.</p><p role="status">{draftStatus==='loading'?'კოლექცია იტვირთება…':draftStatus==='login'?'პირადი კოლექციისთვის საჭიროა ანგარიშში შესვლა.':draftStatus==='unavailable'?'შენახვის სერვისი მიუწვდომელია.':'პირადი კოლექცია დაკავშირებულია.'}</p>
    <div className="life-actions"><button disabled={draftSaving||draftStatus!=='ready'} onClick={()=>void addPreview()}>{draftSaving?'ინახება…':'+ შეინახე პირადი დიზაინი'}</button><button onClick={()=>setView('house')}>ნახე ჩემი Brand House →</button></div><p role="status">{note}</p>
   </section>}
   {view==='house'&&<section><p className="life-kicker">ცენტრალური მეცამეტე სივრცე</p><h1>MY BRAND HOUSE — 0 → 1</h1><p>დიდი მრგვალი კოინი-სახლი ბაღით. პირადი კოლექცია იწყება კერძო მდგომარეობაში და მხოლოდ CORE-ის უფლებამოსილი დამტკიცების შემდეგ შეიძლება გამოჩნდეს Brand Megapolis-ში.</p>
    <div className="life-house-summary"><div className="life-house-garden"><img src={companyIdentity.mark} alt=""/><b>MY BRAND HOUSE</b></div><div className="life-stats"><div><span>GOLD</span><b>{gold} / {LINE_CAPACITY}</b></div><div><span>SILVER</span><b>{silver} / {LINE_CAPACITY}</b></div><div><span>ყველა დიზაინი</span><b>{previews.length} / {HOUSE_CAPACITY}</b></div></div></div>
    <h2>ჩემი პირადი დიზაინები</h2>{previews.length?previews.map(p=><div className="life-preview" key={p.id}><b>{p.line}</b> · {CYCLES.find(c=>c.id===p.portal)?.ka}: {p.brief}</div>):<p>ჯერ დიზაინები არ გაქვს. აირჩიე პორტალი და დაამატე იდეა.</p>}
    <p className="life-guard">🔒 მხოლოდ CORE-ით დადასტურებული პირადი სახლი, უფლებები, საჯაროობის თანხმობა, მზადმყოფი კატალოგი და შემოწმებები იძლევა 0 → 1 აქტივაციას. პრევიუს ღილაკი აქტივაციას არ ახდენს.</p>
    <div className="life-actions"><button onClick={()=>setView('clock')}>← დაბრუნდი პორტალებთან</button><button onClick={()=>setView('city')}>II ეტაპის ნახვა →</button></div>
   </section>}
   {view==='city'&&<section><p className="life-kicker">ეტაპი II · რეალური შეკვეთები</p><h1>BRAND MEGAPOLIS</h1><p>დამტკიცებული Brand House იღებს შეკვეთების მოთხოვნებს. ექსკლუზიური ეგზემპლარის ჩვენება არ ნიშნავს მისი ასლის ავტომატურ გაყიდვას.</p>
     <div className="life-city"><img src={companyIdentity.mark} alt=""/><b>PRIVATE HOUSE 0 → CORE VERIFIED → PUBLIC HOUSE 1</b></div>
     <LifeCyclePublicCatalogue/><div className="life-workflow">{steps.map((s,i)=><div key={s}><span>{String(i+1).padStart(2,'0')}</span><p>{s}</p></div>)}</div>
     <p className="life-guard">მხოლოდ რეალური დადასტურებული გადახდა და CORE-ის წარმოების ავტორიზაცია აძლევს მწარმოებელს დაწყების უფლებას; საკომისიო დასაშვებია მხოლოდ რეალური qualifying ოპერაციის შემოწმების შემდეგ და ირიცხება გადამოწმებულ საბანკო ანგარიშზე.</p>
     <div className="life-actions"><button onClick={()=>setView('house')}>← ჩემი სახლი</button><button onClick={()=>setView('entry')}>მთავარზე დაბრუნება</button></div>
   </section>}
  </main>
  <button className="life-ai-toggle" onClick={()=>setAi(v=>!v)} aria-expanded={ai}>MERGE AI · პირადი ოქრომჭედელი</button>
  {ai&&<LifeCycleAIConcierge cycle={chosen.ka} line={line} onClose={()=>setAi(false)}/>}

  <footer><span>CORE NEVER GETS REGENERATED</span><span>NO VERIFIED PAYMENT → NO PRODUCTION</span><span>ONE RULE FOR EVERYONE</span><span>PREVIEW ONLY · LIVE COMMERCE DISABLED</span></footer>
 </div>;
}