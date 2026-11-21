"use client";
import {useEffect,useRef,useState} from 'react';
import {clientRequestId} from '@/lib/client-request-id';
import {isTwelveDesignRequest} from '@/lib/life-cycle-batch';

type Role='user'|'assistant';
type ChatItem={role:Role;content:string};
type Availability={status:'CONFIGURATION_REQUIRED'|'READY_TO_REQUEST';roles:{role:string;available:boolean;provider:string|null}[]};
const LANGUAGES=[{id:'ka',name:'ქართული'},{id:'ru',name:'Русский'},{id:'en',name:'English'},{id:'ar',name:'العربية'}] as const;
export function LifeCycleAIConcierge({cycle,line,onClose,onTwelveDesigns}:{cycle:string;line:'GOLD'|'SILVER';onClose:()=>void;onTwelveDesigns?:(prompt:string,language:string)=>void}){
 const [language,setLanguage]=useState('ka');
 const [available,setAvailable]=useState(false);
 const [checking,setChecking]=useState(true);
 const [consent,setConsent]=useState(false);
 const [message,setMessage]=useState('');
 const [history,setHistory]=useState<ChatItem[]>([]);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const endRef=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{let active=true;const ctrl=new AbortController();
   (async()=>{try{const r=await fetch('/api/ai-manager',{credentials:'same-origin',cache:'no-store',signal:ctrl.signal});if(!r.ok)throw Error('CONFIGURATION');
      const j=await r.json() as Availability;
      if(active)setAvailable(j.status==='READY_TO_REQUEST'&&j.roles.some(x=>x.role==='design'&&x.available));
    }catch{if(active)setAvailable(false);}finally{if(active)setChecking(false);}
   })();return ()=>{active=false;ctrl.abort();};
 },[]);
 useEffect(()=>{endRef.current?.scrollIntoView({block:'nearest',behavior:'smooth'});},[history]);
 async function ask(){
   const prompt=message.trim();
   if(!prompt||!available||!consent||busy||prompt.length>1800)return;
   if(onTwelveDesigns&&isTwelveDesignRequest(prompt)){
     setMessage('');onTwelveDesigns(prompt,language);onClose();return;
   }
   const old=history.slice(-8).map(item=>({...item,content:item.content.slice(0,2200)}));setMessage('');setError('');setBusy(true);
   setHistory(a=>[...a,{role:'user',content:prompt}]);
   try{
     const controller=new AbortController();
     const timer=setTimeout(()=>controller.abort(),20000);
     let res:Response;
     try{
       res=await fetch('/api/ai-manager',{method:'POST',credentials:'same-origin',redirect:'error',cache:'no-store',
         headers:{'Content-Type':'application/json',Accept:'application/json'},
         body:JSON.stringify({request_id:clientRequestId(),role:'design',consent:true,
           message:"You are MERGE AI, the user's personal product-design goldsmith in the existing MERGE Living Museum. Respond in "+language+
             '. Portal: '+cycle+'. Line: '+line+'. No manufacturing, sales, official third-party brand approval, verified offer, or pricing guarantees. Ask at most one essential follow-up question and help clarify actual manufacturable product specifications. User request: '+prompt,
           history:old}),signal:controller.signal
       });
     }finally{clearTimeout(timer);}
     if(!res.ok){
       if(res.status===401)throw Error('AUTH_REQUIRED');
       if(res.status===429)throw Error('RATE_LIMITED');
       throw Error('AI_UNAVAILABLE');
     }
     const data=await res.json() as {reply?:unknown;status?:string;external_action_executed?:boolean;core_record_created?:boolean};
     if(data.status!=='ANSWERED'||typeof data.reply!=='string'||data.reply.length>16000||data.external_action_executed!==false||data.core_record_created!==false)throw Error('INVALID_RESPONSE');
     setHistory(a=>[...a,{role:'assistant',content:data.reply as string}]);
   }catch(e){const code=e instanceof Error?e.message:'AI_UNAVAILABLE';
     setError(code==='AUTH_REQUIRED'?'MERGE AI-სთან კავშირისთვის საჭიროა მოქმედი მუზეუმის ანგარიში.':code==='RATE_LIMITED'?'საუბრის ლიმიტი დროებით ამოიწურა. მოგვიანებით სცადე.':'AI სერვისი ახლა მიუწვდომელია; შეგიძლია დიზაინის აღწერა პირდაპირ პორტალში შეავსო.');
   }finally{setBusy(false);}
 }
 return <section className="life-live-concierge" aria-label="MERGE AI ოქრომჭედელი">
  <div className="life-live-top"><strong>MERGE AI · პირადი ოქრომჭედელი</strong><button type="button" onClick={onClose} aria-label="დახურვა">×</button></div>
  <div className="life-live-meta">
    <label htmlFor="life-live-lang">ენა</label>
    <select id="life-live-lang" value={language} onChange={e=>setLanguage(e.target.value)}>{LANGUAGES.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select>
    <small>{cycle} · {line}</small>
  </div>
  <div className="life-live-messages" role="log" aria-label="MERGE AI საუბარი" aria-live="polite">
    {history.length===0&&<p className="life-live-notice">მითხარი შენი იდეა, მასალა ან ზომები. ჩემი პასუხი ინფორმაციული დახმარებაა და არა მწარმოებლის ოფიციალური შეთავაზება.</p>}
    {history.map((x,i)=><p key={i} className={'life-live-message '+x.role}><b>{x.role==='user'?'შენ':'MERGE AI'}</b><span>{x.content}</span></p>)}
    <div ref={endRef}/>
  </div>
  <label className="life-live-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> ვეთანხმები ჩემი შეტყობინების გაგზავნას AI სერვისში; არ ვწერ პირად საიდუმლოებებს ან საბანკო მონაცემებს.</label>
  <label htmlFor="life-live-input">შენი მოთხოვნა</label>
  <textarea id="life-live-input" rows={3} maxLength={1800} value={message} onChange={e=>setMessage(e.target.value)} placeholder="მაგალითად: მინდა ჩემი მაჯისთვის უნიკალური საათი"/>
  {checking?<p role="status">კავშირის შემოწმება…</p>:!available?<p role="status">AI ინტეგრაცია ამ გარემოში არ არის ჩართული ან მიუწვდომელია.</p>:null}
  {error&&<p role="alert" className="life-live-error">{error}</p>}
  <button type="button" disabled={!available||busy||!consent||!message.trim()||checking} onClick={()=>void ask()}>{busy?'MERGE AI პასუხობს…':'გაუგზავნე MERGE AI-ს →'}</button>
  <small>საუბარი ინახება მხოლოდ ამ გვერდის მიმდინარე მეხსიერებაში. CORE-ში შეკვეთა, ფასი ან Brand House არ იქმნება.</small>
 </section>;
}
