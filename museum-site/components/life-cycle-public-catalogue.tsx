"use client";
import {useCallback,useEffect,useState} from 'react';
import {CORE_ORIGIN,type CoreCatalog} from '@/lib/core-contract';

type State={status:'loading'|'unavailable'|'ready';catalog:CoreCatalog|null};
function safeCatalog(value:unknown):value is CoreCatalog{
 if(!value||typeof value!=='object')return false;
 const c=value as Partial<CoreCatalog>;
 return c.source_origin===CORE_ORIGIN&&Array.isArray(c.collections)&&c.collections.length<=200&&
  c.collections.every(v=>v&&typeof v.title==='string'&&typeof v.slug==='string'&&typeof v.id==='string');
}
export function LifeCyclePublicCatalogue(){
 const [state,setState]=useState<State>({status:'loading',catalog:null});
 const [attempt,setAttempt]=useState(0);
 const reload=useCallback(()=>setAttempt(n=>n+1),[]);
 useEffect(()=>{let live=true;const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),12000);
  setState({status:'loading',catalog:null});
  void fetch('/api/core/catalog',{cache:'no-store',signal:ctrl.signal}).then(async r=>{if(!r.ok)throw Error('CORE_UNAVAILABLE');return await r.json() as unknown;}).then(v=>{
    if(!safeCatalog(v))throw Error('INVALID_DATA');
    if(live)setState({status:'ready',catalog:v});
  }).catch(()=>{if(live)setState({status:'unavailable',catalog:null});}).finally(()=>clearTimeout(t));
  return()=>{live=false;ctrl.abort();clearTimeout(t);};
 },[attempt]);
 return <div className="life-public-catalogue">
  <h2>MERGE CORE · საჯარო კოლექციები</h2>
  <p>ეს არის მხოლოდ ნამდვილი საჯარო ჩანაწერების დათვალიერება. ჩამოთვლა არ ნიშნავს, რომ ნივთის შეკვეთის უფლება, Verified Offer ან მარაგი დადასტურებულია.</p>
  {state.status==='loading'?<p role="status">საჯარო კატალოგი იტვირთება…</p>:null}
  {state.status==='unavailable'?<p role="status">CORE კატალოგი ამჟამად მიუწვდომელია. <button type="button" onClick={reload}>ხელახლა ცდა</button></p>:null}
  {state.status==='ready'&&state.catalog?<div className="life-public-grid">
     {state.catalog.collections.slice(0,18).map(c=><div className="life-public-card" key={c.id}>
      <b>{c.title}</b><small>{c.brandName||c.category}</small><span>PUBLIC · CORE SOURCE</span>
     </div>)}
     {!state.catalog.collections.length&&<p>ამჟამად საჯარო კოლექცია არ არის წარმოდგენილი.</p>}
    </div>:null}
  <small>მომხმარებლის პერსონალური Brand House გამოჩნდება მხოლოდ CORE-ის მიერ გამოქვეყნების დადასტურების შემდეგ.</small>
 </div>;
}