import {uniquePhotographs} from './photo-identity';
import {displayablePhotograph} from './photo-quality';
// Presentation only. These stages describe place/context, never CORE entitlement,
// completed verification, an order, a financial balance or production readiness.
export const museumWindowJourney = [
 {id:'city',label:'Megapolis'}, {id:'museum',label:'Grand Museum'},
 {id:'house',label:'Brand House'}, {id:'exhibit',label:'Exhibit'},
 {id:'atelier',label:'My Version'}, {id:'legacy',label:'Order & Legacy'},
] as const;
const city='/assets/founder-megapolis-2026-10-16.png',museum='/assets/founder-grand-museum-interior.png';
const preset=(label:string,stage:number,image=museum,width='wide',position='50% 20%')=>({label,stage,image,width,position});
export const luxuryWindowPresets={
 city:preset('THE BRAND MEGAPOLIS',0,city),
 museum:preset('GRAND LIVING MUSEUM',1),
 house:preset('HOUSE COLLECTION',2),
 atelier:preset('YOUR PRIVATE ATELIER',4,'/assets/founder-family-wardrobe-study.png','wide','50% 50%'),
 identity:preset('YOUR MERGE IDENTITY',0,city,'standard'),
 fit:preset('DIGITAL TWIN · FIT TO ME',4,'/assets/vip-digital-twin.png'),
 collection:preset('YOUR LIVING COLLECTION',3),
 ai:preset('PERSONAL MERGE AI',4,'/assets/merge-ai-approved-panorama.png','expansive'),
 coins:preset('GOLD & SILVER · MERGE PULSE',5,'/assets/material-library.png','wide','30% 44%'),
 orders:preset('ORDER · PAYMENT · PRODUCTION',5),
 verification:preset('PRODUCT VERIFICATION · CORE',5),
 passport:preset('PRODUCT PASSPORT · HISTORY',5,museum,'standard','50% 16%'),
 community:preset('PEOPLE · BRANDS · CONVERSATION',2,city,'standard'),
 nature:preset('NATURE IN THE MEGAPOLIS',0,city),
 church:preset('A PLACE FOR QUIET REFLECTION',0,city,'standard'),
 system:preset('MERGE SYSTEM STATUS',0,city,'standard'),
 governance:preset('ONE WORLD · ONE CORE',0,city,'standard'),
 studio:preset('FOUNDER STUDIO · ARCHITECTURAL CONCEPT',4,'/assets/founder-office-study.png'),
 gallery:preset('THE FOUNDER VISUAL ARCHIVE',1,museum,'expansive'),
 journey:preset('YOUR JOURNEY THROUGH MERGE',0,city),
 exhibit:preset('SOURCE · DESIGN · HISTORY',3),
 settings:preset('YOUR MEGAPOLIS EXPERIENCE',0,city,'standard'),
 games:preset('GAME HOUSE · EVERY GENERATION',2),
} as const;
export type LuxuryWindowKind=keyof typeof luxuryWindowPresets;
export function museumPanelWindow(panel:string):LuxuryWindowKind{
 const map:Record<string,LuxuryWindowKind>={world:'museum','founder-studio':'studio','personal-ai':'ai',registration:'identity',journey:'journey',commercial:'orders',collection:'collection',system:'system',verify:'verification',governance:'governance',passport:'passport',fit:'fit',photos:'gallery',detail:'exhibit',exhibit:'exhibit',point:'exhibit',pulse:'coins',vitrine:'collection',children:'games','entry-law':'coins'};
 return map[panel]??'museum';
}
// The same sequence drives the original-photo reader and reference galleries.
// Stable ordering and path de-duplication preserve every other approved asset.
export const approvedVisualSequence=[
 '/assets/founder-entry-closed.png','/assets/founder-entry-open-approved.png',city,
 '/assets/founder-clock-megapolis.png','/assets/founder-twelve-house-metropolis.png',
 museum,'/assets/approved-mega-museum.png','/assets/museum-world.png','/assets/vip-star-dome.png','/assets/vip-labyrinth.png',
 '/assets/founder-aurum-argentum-portal.png','/assets/founder-atelier-stages-19-24.png',
 '/assets/founder-family-wardrobe-study.png','/assets/founder-couture-ruby-study.png','/assets/vip-category-hall.png','/assets/family-house.png','/assets/elita-house.png','/assets/elita-silver.png','/assets/founder-watch-orbit-study.png',
 '/assets/eyewear.png','/assets/eyewear-silver.png','/assets/coin-case.png','/assets/geni-story.png','/assets/mosaic-gold.png','/assets/founder-brand-house-tbilisi.png',
 '/assets/founder-office-study.png','/assets/founder-ai-brand-board.png','/assets/founder-ai-concierge.png',
 '/assets/founder-brand-manager-dashboard.png','/assets/founder-merge-watch-your-time.png',
 '/assets/vip-digital-twin.png','/assets/material-library.png','/assets/founder-yarn-process-study.png','/assets/founder-composite-yarn-research.png','/assets/material-passport.png',
] as const;
export function orderMuseumReferences<T extends {image:string}>(items:readonly T[]):T[]{
 const seen=new Set<string>();
 return uniquePhotographs(items).map((item,index)=>({item,index,rank:(approvedVisualSequence as readonly string[]).indexOf(item.image)}))
  .filter(({item})=>{if(!displayablePhotograph(item.image)||seen.has(item.image))return false;seen.add(item.image);return true;})
  .sort((a,b)=>(a.rank<0?approvedVisualSequence.length:a.rank)-(b.rank<0?approvedVisualSequence.length:b.rank)||a.index-b.index)
  .map(({item})=>item);
}
