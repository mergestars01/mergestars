'use client';

import {useEffect,useRef,useState} from 'react';
import {CompanyWordmark} from '@/components/company-identity';
import './social-concierge.css';

type SpeechResultEvent={results:ArrayLike<ArrayLike<{transcript:string}>>};
type SpeechLike={
  lang:string;interimResults:boolean;
  onresult:((event:SpeechResultEvent)=>void)|null;
  onerror:(()=>void)|null;
  onend:(()=>void)|null;
  start:()=>void;stop:()=>void;
};
type SpeechConstructor=new()=>SpeechLike;
type Permission='email'|'accounts'|'publishing';
const channels=['Facebook','Instagram','TikTok','YouTube','LinkedIn','Pinterest','X','Threads','Bluesky','Google Business Profile'];
const permissionLabels:Record<Permission,string>={
  email:'თუ საჭიროა, დამეხმაროს ჩემს საკუთრებაში არსებული ბიზნესელფოსტის შექმნაში',
  accounts:'დამეხმაროს არსებული ანგარიშების დაკავშირებაში ან ახლების გახსნაში',
  publishing:'მომიმზადოს პოსტები და გამომიგზავნოს დასამტკიცებლად'
};
export default function SocialConciergePage(){
  const [step,setStep]=useState<1|2|3>(1);
  const [brand,setBrand]=useState('');
  const [brief,setBrief]=useState('');
  const [photo,setPhoto]=useState('');
  const [permissions,setPermissions]=useState<Record<Permission,boolean>>({email:false,accounts:false,publishing:false});
  const [speaking,setSpeaking]=useState(false);
  const [voiceError,setVoiceError]=useState('');
  const speech=useRef<SpeechLike|null>(null);
  useEffect(()=>()=>{speech.current?.stop();speech.current=null;},[]);
  function startVoice(){
    setVoiceError('');
    if(speaking){speech.current?.stop();return;}
    const browser=window as Window & {SpeechRecognition?:SpeechConstructor;webkitSpeechRecognition?:SpeechConstructor};
    const Constructor=browser.SpeechRecognition??browser.webkitSpeechRecognition;
    if(!Constructor){setVoiceError('ამ ბრაუზერში ხმოვანი შეყვანა მიუწვდომელია. შეგიძლია ტექსტით მომიყვე.');return;}
    try{
      const recognition=new Constructor();
      recognition.lang='ka-GE';recognition.interimResults=false;
      recognition.onresult=(event)=>{
        const spoken=event.results[0]?.[0]?.transcript?.trim();
        if(spoken)setBrief(previous=>[previous,spoken].filter(Boolean).join(' '));
      };
      recognition.onerror=()=>{setVoiceError('ხმის ამოცნობა ვერ დასრულდა. შეგიძლია ტექსტით გააგრძელო.');setSpeaking(false);};
      recognition.onend=()=>{setSpeaking(false);speech.current=null;};
      speech.current=recognition;recognition.start();setSpeaking(true);
    }catch{setVoiceError('მიკროფონი ვერ ჩაირთო. შეგიძლია ტექსტით გააგრძელო.');setSpeaking(false);}
  }
  const consentCount=Object.values(permissions).filter(Boolean).length;
  const ready=Boolean(brand.trim()&&brief.trim());
  return <main className="sc-page">
    <header className="sc-head"><CompanyWordmark/><a href="/life-cycles">ცოცხალ მუზეუმში დაბრუნება</a></header>
    <section className="sc-hero" aria-labelledby="sc-title">
      <p className="sc-eyebrow">MERGE AI · BRAND HOUSE CONCIERGE</p>
      <h1 id="sc-title">შენ ქმნი. <span>MERGE AI</span> გეხმარება ციფრული ბიზნესის მართვაში.</h1>
      <p>ხელოვანს კომპიუტერის ცოდნა არ უნდა სჭირდებოდეს. უთხარი შენი ბრენდის შესახებ ან ატვირთე ნამუშევრის ფოტო.</p>
      <p className="sc-caution" role="status">სატესტო პირველი ეკრანია: მონაცემები ამ გვერდიდან არ იგზავნება, ანგარიშები არ იქმნება და სოციალური ქსელები არ უკავშირდება. რეალური ავტომატიზაცია ჯერ დასანერგია.</p>
    </section>
    <nav className="sc-progress" aria-label="ნაბიჯები">
      {(['მომიყევი','მომეცი ნებართვა','შემდეგი ნაბიჯები'] as const).map((name,index)=>
        <span key={name} className={step===index+1?'sc-current':''} aria-current={step===index+1?'step':undefined}>{index+1}. {name}</span>
      )}
    </nav>
    {step===1&&<section className="sc-panel" aria-labelledby="sc-step-one">
      <h2 id="sc-step-one">როგორ გქვია შენს ბრენდს?</h2>
      <label htmlFor="sc-brand">ბრენდის სახელი</label>
      <input id="sc-brand" autoComplete="organization" maxLength={100} value={brand} onChange={event=>setBrand(event.target.value)} placeholder="მაგალითად: ჩემი ოქრომჭედლობა"/>
      <label htmlFor="sc-brief">რას ქმნი? შეგიძლია მელაპარაკო.</label>
      <textarea id="sc-brief" rows={5} maxLength={2000} value={brief} onChange={event=>setBrief(event.target.value)} placeholder="მაგალითად: ხელით ვამზადებ ოქროს ბეჭდებს და მინდა ჩემი ნამუშევრები მსოფლიომ ნახოს."/>
      <button className="sc-voice" type="button" onClick={startVoice} aria-pressed={speaking}>{speaking?'შეაჩერე მიკროფონი':'🎙️ მელაპარაკე ქართულად'}</button>
      {voiceError&&<p className="sc-error" role="alert">{voiceError}</p>}
      <label htmlFor="sc-photo">ნამუშევრის ფოტო (არ აიტვირთება)</label>
      <input id="sc-photo" type="file" accept="image/*" onChange={event=>setPhoto(event.target.files?.[0]?.name??'')}/>
      {photo&&<p className="sc-muted">არჩეული ფოტოა: {photo}. ფაილი არ შენახულა.</p>}
      <div className="sc-actions"><button className="sc-primary" type="button" disabled={!ready} onClick={()=>setStep(2)}>განაგრძე →</button></div>
    </section>}
    {step===2&&<section className="sc-panel" aria-labelledby="sc-step-two">
      <h2 id="sc-step-two">რას მანდობ MERGE AI-ს?</h2>
      <p className="sc-muted">ეს არჩევანი მხოლოდ შესაძლებლობების დემონსტრირებაა და არ წარმოადგენს იურიდიულ თანხმობას ან რეალურ ავტორიზაციას.</p>
      {(Object.keys(permissionLabels) as Permission[]).map(permission=><label key={permission} className="sc-choice">
        <input type="checkbox" checked={permissions[permission]} onChange={event=>setPermissions(current=>({...current,[permission]:event.target.checked}))}/>
        <span>{permissionLabels[permission]}</span>
      </label>)}
      <p>სადაც სხვა პლატფორმა მოითხოვს კოდს, პაროლს, პირად დადასტურებას ან ანგარიშის შექმნის ნებართვას, ამას მხოლოდ თავად მფლობელი გააკეთებს. MERGE AI ვერ გადალახავს ამ მოთხოვნებს.</p>
      <div className="sc-actions"><button type="button" className="sc-secondary" onClick={()=>setStep(1)}>← უკან</button><button type="button" className="sc-primary" disabled={consentCount===0} onClick={()=>setStep(3)}>მაჩვენე გეგმა →</button></div>
    </section>}
    {step===3&&<section className="sc-panel" aria-labelledby="sc-step-three">
      <h2 id="sc-step-three">შენი ბრენდის მომზადების გეგმა</h2>
      <p className="sc-brand">{brand}</p>
      <p className="sc-muted">{brief}</p>
      <p><strong>არჩეული მიმართულებები:</strong> {consentCount} / 3. ეს არის შენს მოწყობილობაზე შედგენილი გეგმა; ანგარიშები არ გახსნილა.</p>
      <h3>სოციალური ქსელების მდგომარეობა</h3>
      <div className="sc-networks">
        {channels.map(network=><div key={network}><span>{network}</span><small>დასაკავშირებელია · დაუდასტურებელი</small></div>)}
      </div>
      <p className="sc-muted">აქ ასახულია პროტოტიპის უცნობი სტატუსები და არა შენს რეალურ ანგარიშებზე ჩატარებული შემოწმება.</p>
      <h3>რისი დამატებაა საჭირო სისტემაში</h3>
      <ol>
        <li>უსაფრთხო რეგისტრაცია და მფლობელის მიერ დადასტურებული უფლებამოსილება</li>
        <li>ბიზნესელფოსტისა და ქსელების ოფიციალური რეგისტრაციის/ავტორიზაციის პროცესები</li>
        <li>CORE-სთან Brand House-ის და ფოტოების შენახვის კავშირი</li>
        <li>პოსტების დამტკიცება, განრიგი, რეკლამის ბიუჯეტის თანხმობა და შედეგების ანალიზი</li>
      </ol>
      <div className="sc-actions"><button type="button" className="sc-secondary" onClick={()=>setStep(2)}>← უკან</button><a className="sc-link" href="/life-cycles">ცოცხალ მუზეუმში გადასვლა</a></div>
    </section>}
    <footer className="sc-footer">MERGE STAR’S · THE JEWELER OF BRANDS · საცდელი ინტერფეისი, არა მოქმედი სოციალური ქსელების მენეჯერი</footer>
  </main>;
}
