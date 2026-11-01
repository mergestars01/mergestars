import type {CityHouseId} from './megapolis-domain';

// Artwork routes are navigation metadata, never CORE products or permissions.
export type VisualDestination={kind:'city'|'museum'|'ai'|'fit'|'collection'|'materials'|'passport'|'journey'|'studio'|'brand';label:string}|{kind:'house';houseId:CityHouseId;label:string};
const city:VisualDestination={kind:'city',label:'Explore Megapolis'},museum:VisualDestination={kind:'museum',label:'Enter Grand Museum'},ai:VisualDestination={kind:'ai',label:'Open MERGE AI'},materials:VisualDestination={kind:'materials',label:'Explore materials'},collection:VisualDestination={kind:'collection',label:'Open my designs'};
const house=(houseId:CityHouseId,label:string):VisualDestination=>({kind:'house',houseId,label});
export const visualRoutes:Readonly<Record<string,VisualDestination>>={
 '/images/merge-ascension/originals/watch.png':house('watches','Enter Watch House · ASCENSION'),
 '/images/merge-ascension/originals/belt.png':house('fashion','Enter Fashion House · ASCENSION'),
 '/images/merge-ascension/originals/crown.png':house('jewelry','Enter Jewelry House · ASCENSION'),
 '/assets/merge-twelve-brand-towns-20261019.png':city,
 '/assets/founder-living-luxury-system-20261019.png':ai,
 '/assets/founder-aurum-argentum-portal.png':museum,
 '/assets/founder-brand-manager-dashboard.png':ai,
 '/assets/founder-atelier-stages-19-24.png':museum,
 '/assets/founder-merge-watch-your-time.png':house('watches','Enter Watch House'),
 '/assets/founder-composite-yarn-research.png':materials,
 '/assets/founder-watch-orbit-study.png':house('watches','Enter Watch House'),'/assets/founder-family-wardrobe-study.png':house('fashion','Enter Fashion House'),'/assets/founder-couture-ruby-study.png':house('fashion','Enter Fashion House'),'/assets/founder-yarn-process-study.png':materials,'/assets/founder-office-study.png':{kind:'studio',label:'Open Founder Studio'},
 '/assets/founder-entry-closed.png':city,'/assets/founder-entry-open-approved.png':city,'/assets/entrance.png':city,'/assets/entrance-dual.png':museum,
 '/assets/founder-megapolis-2026-10-16.png':city,'/assets/founder-brand-megapolis.png':city,'/assets/founder-clock-megapolis.png':city,'/assets/founder-twelve-house-metropolis.png':city,'/assets/founder-futuristic-museum.png':city,
 '/assets/founder-grand-museum-interior.png':museum,'/assets/approved-mega-museum.png':museum,'/assets/museum-world.png':museum,'/assets/vip-grand-museum.png':museum,'/assets/vip-star-dome.png':museum,'/assets/vip-labyrinth.png':museum,
 '/assets/founder-atrium-fashion.png':house('fashion','Enter Fashion House'),'/assets/vip-category-hall.png':house('fashion','Enter Fashion House'),'/assets/family-house.png':house('fashion','Enter Fashion House'),'/assets/elita-house.png':house('fashion','Enter Fashion House'),'/assets/elita-silver.png':house('fashion','Enter Fashion House'),'/assets/mosaic-gold.png':house('mosaic','Enter Mosaic House'),
 '/assets/eyewear.png':house('eyewear','Enter Eyewear House'),'/assets/eyewear-silver.png':house('eyewear','Enter Eyewear House'),'/assets/coin-case.png':house('eyewear','Explore eyewear cases'),'/assets/geni-story.png':house('mobility','Enter Mobility House'),
 '/assets/founder-brand-house-tbilisi.png':{kind:'brand',label:'Open My Brand Museum'},'/assets/smart-key.png':house('robotics','Open Smart Device concepts'),'/assets/coin-reference.png':materials,'/assets/museum-coin-world.png':materials,
 '/assets/founder-ai-brand-board.png':ai,'/assets/founder-ai-concierge.png':ai,'/assets/vip-digital-twin.png':{kind:'fit',label:'Open Fit to Me'},'/assets/vip-create-version.png':collection,
 '/assets/material-library.png':materials,'/assets/material-passport.png':{kind:'passport',label:'Open passport requirements'},'/assets/craft-ecosystem.png':{kind:'journey',label:'Explore the creation journey'},
};
export function visualDestination(image:string):VisualDestination|null{return visualRoutes[image]??null;}
export const visualJourney=[
 {image:'/assets/founder-megapolis-2026-10-16.png',label:'01 · Megapolis'},
 {image:'/assets/founder-grand-museum-interior.png',label:'02 · Grand Museum'},
 {image:'/assets/founder-family-wardrobe-study.png',label:'03 · Fashion House'},
 {image:'/assets/founder-atelier-stages-19-24.png',label:'04 · Studio / Lab · 19–24'},
 {image:'/assets/vip-digital-twin.png',label:'05 · Fit to Me'},
 {image:'/assets/material-library.png',label:'06 · Materials'},
 {image:'/assets/founder-brand-house-tbilisi.png',label:'07 · My Brand Museum'},
 {image:'/assets/founder-ai-brand-board.png',label:'08 · MERGE AI'},
] as const;
export const houseReferenceImages:Partial<Record<CityHouseId,readonly string[]>>={
 fashion:['/assets/founder-family-wardrobe-study.png','/assets/founder-couture-ruby-study.png','/assets/elita-house.png','/assets/elita-silver.png','/assets/family-house.png'],
 watches:['/assets/founder-merge-watch-your-time.png','/assets/founder-watch-orbit-study.png'],
 mosaic:['/assets/mosaic-gold.png','/assets/founder-yarn-process-study.png','/assets/material-library.png'],
 eyewear:['/assets/eyewear.png','/assets/eyewear-silver.png','/assets/coin-case.png'],
 mobility:['/assets/geni-story.png'],
};
export function houseVisualsFor(houseId:CityHouseId){return houseReferenceImages[houseId]??['/assets/approved-mega-museum.png'];}
