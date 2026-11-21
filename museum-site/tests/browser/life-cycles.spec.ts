import {randomUUID} from 'node:crypto';
import {test,expect,type Page} from '@playwright/test';
import type {LifeCycleDraft,LifeCycleInput} from '../../lib/life-cycle-draft-contract';

// Deliberately offline UI fixtures. Real identity, SQL isolation, idempotency
// and atomic event writes are exercised separately by test-life-cycle-api.mjs.
async function fixture(page:Page,authenticated=true){
  const drafts:LifeCycleDraft[]=[], requests:LifeCycleInput[]=[];
  const byRequest=new Map<string,LifeCycleDraft>();
  let loseResponse=false;
  await page.route('**/api/ai-manager',route=>route.fulfill({status:503,contentType:'application/json',body:'{"status":"NOT_CONFIGURED"}'}));
  await page.route('**/api/core/**',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'CORE_UNAVAILABLE'})}));
  await page.route('**/api/life-cycle-session',route=>route.fulfill({status:authenticated?200:401,contentType:'application/json',
    body:JSON.stringify(authenticated?{authenticated:true,identity_source:'MERGE_CORE'}:{error:'CORE_SESSION_REQUIRED'})}));
  await page.route('**/api/life-cycle-drafts*',async route=>{
    if(!authenticated){await route.fulfill({status:401,contentType:'application/json',body:'{"error":"CORE_SESSION_REQUIRED"}'});return;}
    if(route.request().method()==='GET'){
      await route.fulfill({contentType:'application/json',body:JSON.stringify({drafts,next_cursor:null,
        counts:{gold:drafts.filter(d=>d.line==='GOLD').length,silver:drafts.filter(d=>d.line==='SILVER').length,total:drafts.length},
        scope:'PRIVATE_EXPERIENCE',core_connected:false,identity_source:'MERGE_CORE'})});return;
    }
    const input=route.request().postDataJSON() as LifeCycleInput;requests.push(input);
    const prior=byRequest.get(input.request_id),parent=drafts.find(d=>d.id===input.parent_draft_id);
    const id=randomUUID();
    const draft=prior??{id,cycle_id:input.cycle_id,line:input.line,brief:input.brief,created_at:new Date().toISOString(),
      parent_draft_id:input.parent_draft_id??null,root_draft_id:parent?.root_draft_id??id,
      artifact_type:'TEXT_BRIEF',generation_status:'NOT_YET_IMPLEMENTED',status:'CONCEPT',
      core_product_id:null,core_house_id:null,production_authorized:false} satisfies LifeCycleDraft;
    if(!prior){drafts.unshift(draft);byRequest.set(input.request_id,draft);}
    if(loseResponse){loseResponse=false;await route.abort('failed');return;}
    await route.fulfill({contentType:'application/json',body:JSON.stringify({draft,replayed:!!prior})});
  });
  return {drafts,requests,loseNextResponse:()=>{loseResponse=true;}};
}
async function clock(page:Page){
  await page.goto('/life-cycles');
  await expect(page.getByRole('button',{name:'OPEN MERGE COIN',exact:true})).toBeEnabled();
  await page.getByRole('button',{name:'OPEN MERGE COIN',exact:true}).click();
  try{await expect(page.getByRole('button',{name:'Explore GOLD',exact:true})).toBeVisible();}
  catch(error){console.error('Coin navigation diagnostic:',page.url(),(await page.locator('body').innerText()).slice(0,2200));throw error;}
  await page.getByRole('button',{name:'Explore GOLD',exact:true}).click();
  await expect(page.getByRole('heading',{name:'12 ცხოვრებისეული პორტალი',exact:true})).toBeVisible();
}
test('one official coin opens internal lines and twelve portals with central private House',async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',e=>{errors.push(e.message);console.error('Uncaught page error:',e.message);});
  await fixture(page);await page.goto('/life-cycles');
  await expect(page.getByRole('button',{name:'OPEN MERGE COIN',exact:true})).toHaveCount(1);
  await expect(page.locator('.life-main-coin .company-mark')).toHaveAttribute('src','/assets/official-company-logo.svg');
  await expect(page.getByRole('button',{name:'Explore GOLD',exact:true})).toHaveCount(0);
  await clock(page);await expect(page.locator('.life-hour')).toHaveCount(12);
  await expect(page.getByRole('button',{name:'Open my private Brand House',exact:true})).toBeVisible();
  await expect(page.locator('main')).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await testInfo.attach('clock',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  if(testInfo.project.name==='mobile'){
    await page.setViewportSize({width:320,height:740});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const sizes=await page.locator('.life-hour').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
    expect(sizes.every(s=>s.w>=44&&s.h>=44)).toBe(true);
  }
  await page.goBack();await expect(page.getByRole('button',{name:'Explore GOLD',exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});
test('lost save response retries same request, reload recovers, editing creates immutable version',async({page},testInfo)=>{
  const state=await fixture(page);await clock(page);
  await page.getByRole('button',{name:'Open Fashion & Luxury',exact:true}).click();
  const description=page.getByRole('textbox',{name:'რა გინდა შექმნა?',exact:true});
  await description.fill('MERGE private watch concept');
  const save=page.getByRole('button',{name:'შეინახე პირადი მონახაზი',exact:true});await expect(save).toBeEnabled();
  state.loseNextResponse();await save.click();
  await expect(page.getByText(/შენახვის დადასტურება ვერ მივიღეთ/)).toBeVisible();
  await save.click();await expect(page.getByText('ტექსტური მონახაზი შენახულია პირად სახლში. სურათი და 3D მოდელი ამ მოქმედებით არ იქმნება.',{exact:true})).toBeVisible();await expect(save).toBeDisabled();
  expect(state.requests).toHaveLength(2);expect(state.requests[0].request_id).toBe(state.requests[1].request_id);
  expect(state.drafts).toHaveLength(1);const original={...state.drafts[0]};
  await page.getByRole('button',{name:'ჩემი Brand House',exact:true}).click();await page.reload();
  await expect(page.locator('[data-draft-id]')).toHaveCount(1);
  await page.getByRole('button',{name:'გახსენი და განაგრძე',exact:true}).click();
  await expect(description).toHaveValue(original.brief);await description.fill('MERGE private watch revised concept');
  await page.getByRole('button',{name:'შეინახე ახალი ვერსია',exact:true}).click();
  await expect(page.getByText('ტექსტური მონახაზი შენახულია პირად სახლში. სურათი და 3D მოდელი ამ მოქმედებით არ იქმნება.',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'შეინახე ახალი ვერსია',exact:true})).toBeDisabled();
  expect(state.drafts).toHaveLength(2);expect(state.drafts[0].parent_draft_id).toBe(original.id);
  expect(state.drafts.find(d=>d.id===original.id)).toEqual(original);
  await page.getByRole('button',{name:'ჩემი Brand House',exact:true}).click();
  await expect(page.locator('[data-draft-id]')).toHaveCount(2);
  await testInfo.attach('private-house-fixture',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});
test('signed-out visitor sees existing account link and cannot save a draft',async({page})=>{
  const state=await fixture(page,false);await clock(page);
  await page.getByRole('button',{name:'Open Fashion & Luxury',exact:true}).click();
  await page.getByRole('textbox',{name:'რა გინდა შექმნა?',exact:true}).fill('Unsigned concept');
  await expect(page.getByRole('link',{name:'შესვლა MERGE ანგარიშში',exact:true})).toHaveAttribute('href','https://mergestars.com/login');
  await expect(page.getByRole('button',{name:'შეინახე პირადი მონახაზი',exact:true})).toBeDisabled();
  expect(state.requests).toHaveLength(0);
});
