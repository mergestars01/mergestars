import {test as base,expect,type Page,type Locator} from '@playwright/test';
import {cityHouses} from '../../lib/megapolis-domain';

// Explicit offline contract fixture. No real CORE entity or financial action.
const test=base.extend<{museumPage:Page}>({museumPage:async({page},use)=>{
  const errors:string[]=[],mutations:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(new URL(request.url()).pathname.startsWith('/api/core/')&&!['GET','HEAD'].includes(request.method()))mutations.push(request.method()+' '+new URL(request.url()).pathname);});
  await page.route('**/api/core/**',route=>route.fulfill({status:503,contentType:'application/json',
    body:JSON.stringify({error:'CORE_UNAVAILABLE',available:false,source_of_truth:'MERGE_CORE'})}));
  await page.goto('/');
  await expect(page.getByRole('button',{name:'ENTER THE MEGAPOLIS',exact:true})).toBeEnabled({timeout:30_000});
  await use(page);expect(errors,'Uncaught browser errors').toEqual([]);expect(mutations,'Read-only QA must not attempt a CORE mutation').toEqual([]);
}});
async function enter(page:Page){
  await page.getByRole('button',{name:'ENTER THE MEGAPOLIS',exact:true}).click();
  await expect(page.locator('main')).toHaveClass('museum-shell');
  await expect(page.locator('.megapolis')).toHaveAttribute('data-entrance-state','INSIDE');
}
async function museum(page:Page){await enter(page);await page.locator('.topbar').getByRole('button',{name:'GRAND MUSEUM',exact:true}).click();await expect(page.locator('.grand-atrium-lines')).toBeVisible();}
async function imagesReady(container:Locator){await expect.poll(()=>container.locator('img:visible').evaluateAll(images=>images.every(image=>(image as HTMLImageElement).complete&&(image as HTMLImageElement).naturalWidth>0))).toBe(true);}
async function contained(page:Page){
  const d=page.getByRole('dialog');await expect(d).toBeVisible();
  await expect(d.getByRole('button',{name:'Close',exact:true})).toBeVisible();
  const b=(await d.boundingBox())!,v=page.viewportSize()!;
  expect(b.x).toBeGreaterThanOrEqual(0);expect(b.y).toBeGreaterThanOrEqual(0);
  expect(b.x+b.width).toBeLessThanOrEqual(v.width+1);expect(b.y+b.height).toBeLessThanOrEqual(v.height+1);
  await expect.poll(()=>d.locator('.merge-window-content').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
  await expect(d.locator('.company-mark').first()).toHaveAttribute('src','/assets/official-company-logo.svg');
  for(let n=0;n<5;n++){await page.keyboard.press('Tab');expect(await d.evaluate(e=>e.contains(document.activeElement))).toBe(true);}
  return d;
}
test('approved closed entrance',async({museumPage:page})=>{
  await expect(page.locator('.founder-gate')).toHaveAttribute('data-door-state','CLOSED');
  await expect(page.locator('.founder-gate-fallback')).toHaveAttribute('src','/assets/founder-entry-closed.png');
  await expect(page.locator('.founder-open-image')).toHaveAttribute('src','/assets/founder-entry-open-approved.png');
  await imagesReady(page.locator('.entrance'));await expect(page.locator('main')).toHaveScreenshot('closed-entrance.png');
});
test('slow doors arrive in the same city without opening an item',async({museumPage:page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.getByRole('button',{name:'ENTER THE MEGAPOLIS',exact:true}).click();
  await expect(page.locator('.founder-gate')).toHaveAttribute('data-door-state','OPENING');
  await expect(page.getByRole('button',{name:'OPENING THE GATES…',exact:true})).toBeDisabled();
  await expect(page.locator('main')).toHaveClass('entrance-shell');
  await expect(page.locator('main')).toHaveClass('museum-shell',{timeout:15_000});
  await expect(page.locator('.megapolis')).toHaveAttribute('data-entrance-state','INSIDE');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('all twelve House interiors and vitrines',async({museumPage:page})=>{
  test.setTimeout(180_000);await museum(page);
  for(const house of cityHouses){
    await page.getByRole('button',{name:'Enter '+house.title,exact:true}).click();
    const room=page.locator('.house-showroom[data-house-id="'+house.id+'"]');await expect(room).toBeVisible();
    await expect(room.locator('.house-showcase-wayfinding button')).toHaveCount(house.categories.length);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const trigger=room.locator('.house-showcase-wayfinding button').first();await trigger.click();
    const d=await contained(page);await expect(d.getByRole('button',{name:'Create new design',exact:true})).toBeEnabled();
    await d.getByRole('button',{name:'Close',exact:true}).click();await expect(trigger).toBeFocused();
    await room.getByRole('button',{name:'Grand Museum',exact:true}).click();
  }
});
test('Fashion filter survives closing its vitrine',async({museumPage:page})=>{
  await museum(page);await page.getByRole('button',{name:'Enter FASHION HOUSE',exact:true}).click();
  const room=page.locator('.house-showroom[data-house-id="fashion"]');await imagesReady(room);
  await expect(room.locator('.house-room-welcome')).toHaveCount(0);
  await expect(room).toHaveScreenshot('fashion-interior.png');
  await room.locator('.house-showcase-wayfinding button').first().click();const d=await contained(page);
  await d.locator('.study-filter-tools > summary').click();
  const search=d.getByRole('textbox',{name:'Search actual CORE exhibit titles and descriptions',exact:true});await search.fill('coat');
  await d.getByRole('button',{name:'Close',exact:true}).click();await room.getByRole('button',{name:'OPEN SHOWCASE',exact:true}).click();
  await d.locator('.study-filter-tools > summary').click();await expect(search).toHaveValue('coat');await imagesReady(d);await expect(d).toHaveScreenshot('fashion-vitrine.png');
  await d.getByRole('button',{name:'Create new design',exact:true}).click();
  await expect(d.getByRole('button',{name:'Generate 3D + register order · connection required',exact:true})).toBeDisabled();
});
test('Coin material and unavailable price disclosures',async({museumPage:page})=>{
  await enter(page);
  await page.locator('.approved-photo-city [data-coin-line="SILVER"]').filter({visible:true}).click();
  const d=await contained(page);await expect(d.getByText(/It does not promise 1 kg of pure silver/)).toBeVisible();
  await expect(d.getByText('CORE BASE PENDING',{exact:true})).toBeAttached();
  await d.getByRole('button',{name:'GOLD · Au',exact:true}).click();
  await expect(d.getByText(/1,000 g of finished MERGE 8K composite/)).toBeVisible();
  await expect(d).not.toContainText(/platinum/i);
  expect(await d.locator('.merge-window-content').evaluate(e=>e.scrollHeight>e.clientHeight)).toBe(true);
  await d.locator('.merge-window-content').evaluate(e=>{e.scrollTop=0;});
  await imagesReady(d);await expect(d).toHaveScreenshot('gold-market.png');
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('system window fits each viewport',async({museumPage:page})=>{
  await page.getByRole('button',{name:'PRIVATE · SYSTEM STATUS',exact:true}).click();
  await contained(page);await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('3D study choices reach my private atelier',async({museumPage:page})=>{
  await museum(page);await page.getByRole('button',{name:'Enter MUSICAL INSTRUMENTS HOUSE',exact:true}).click();
  await page.locator('.house-showcase-wayfinding button').first().click();
  const d=await contained(page),study=d.locator('.house-study-gallery');
  await expect(study.locator('.study-viewport')).toHaveAttribute('data-study-state','READY');
  await study.getByLabel('Visual finish',{exact:true}).selectOption('gold');
  await study.getByLabel('Mosaic scale',{exact:true}).selectOption('architectural');
  await study.getByLabel('Design language',{exact:true}).selectOption('sculptural');
  await study.getByRole('button',{name:'New variation',exact:true}).click();
  await study.getByRole('button',{name:'Create my version',exact:true}).click();
  const atelier=d.locator('.museum-design-studio');
  await expect(atelier.getByLabel('Visual finish',{exact:true})).toHaveValue('gold');
  await expect(atelier.getByLabel('Design language',{exact:true})).toHaveValue('sculptural');
  await expect(atelier.getByLabel('Describe the design',{exact:true})).toHaveValue(/variation: 1/);
  await d.getByRole('button',{name:'Close',exact:true}).press('Enter');
  await page.getByRole('button',{name:'OPEN SHOWCASE',exact:true}).click();
  await page.getByRole('button',{name:'Continue private draft',exact:true}).click();
  await expect(atelier.getByLabel('Visual finish',{exact:true})).toHaveValue('gold');
  await expect(atelier.getByLabel('Describe the design',{exact:true})).toHaveValue(/variation: 1/);
});

test('Museum opens the interior and Studio Lab is a direct destination',async({museumPage:page})=>{
  await museum(page);
  await expect(page.locator('[data-primary-museum-image]')).toBeVisible();
  await expect(page.locator('.grand-atrium-lines button')).toHaveCount(12);
  await page.getByRole('button',{name:'Studio / Lab · 19–24',exact:true}).click();
  await expect(page.locator('.founder-storyboard [data-storyboard-step]')).toHaveCount(6);
  await page.locator('[data-storyboard-step="19"]').click();
  await expect(page.getByRole('dialog').locator('.museum-design-studio')).toBeVisible();
  await expect(page.getByRole('dialog').locator('[data-storyboard-panel="19"]')).toBeVisible();
});
