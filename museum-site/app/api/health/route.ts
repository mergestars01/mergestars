import {env} from 'cloudflare:workers';
import {apiJson,requireApiIdentity} from '@/lib/api-guards';
import {readCoreCatalog,readCorePrices} from '@/lib/core-client';
import {corePublicReads} from '@/lib/core-public-cache';
import {systemHealthSchema,type SystemHealth} from '@/lib/system-health';

export async function GET(){
 const owner=await requireApiIdentity();if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
 const [database,catalog,prices]=await Promise.allSettled([
  env.DB?env.DB.prepare('SELECT COUNT(*) AS count FROM experience_atelier_briefs WHERE owner_id = ?').bind(owner).first<{count:number}>():Promise.reject(Error('STORAGE_NOT_CONFIGURED')),
  corePublicReads.read('catalog',()=>readCoreCatalog(),20000),
  corePublicReads.read('prices',()=>readCorePrices(),0),
 ]);
 const storageOK=database.status==='fulfilled'&&Number.isSafeInteger(database.value?.count)&&database.value!.count>=0;
 const services:SystemHealth['services']=[
  {id:'experience-storage',label:'Private design-brief storage',status:storageOK?'AVAILABLE':'UNAVAILABLE',detail:storageOK?'The existing private brief table was read for this Site session. Write, backup and restore tests are separate.':'The database read probe did not succeed. Do not assume saves were completed.'},
  {id:'public-catalog',label:'CORE public catalog',status:catalog.status==='fulfilled'?'AVAILABLE':'UNAVAILABLE',detail:catalog.status==='fulfilled'?'The existing CORE public catalog returned a validated response.':'The public catalog request did not return validated data.'},
  {id:'metal-reference',label:'CORE metal-price reference',status:prices.status==='fulfilled'?'DEGRADED':'UNAVAILABLE',detail:prices.status==='fulfilled'?'Reference data is readable. Original quote time, validity and the approved payable Coin offer remain unverified.':'No validated price reference was received. No replacement price is supplied.'},
  ...[
   ['shared-identity','Shared CORE identity','The private Site session is available; shared MERGE CORE authentication is not connected.'],
   ['generation','Meshy / CORE generation','A provider credential and the current authorized CORE generation contract are required.'],
   ['core-mutations','Products, versions and official orders','Authoritative creation and permission contracts are required. Private briefs do not create these records.'],
   ['payments','Payments and commission settlement','Approved order, offer, payment evidence and settlement services are required.'],
   ['production','Production, QC and Passport','Manufacturer, QC and authoritative Passport services are required.'],
   ['social-chat','Social connections and conversations','Official provider authorization and the existing conversation service are required.'],
  ].map(([id,label,detail])=>({id,label,detail,status:'SETUP_REQUIRED' as const})),
 ];
 const publicCatalog=catalog.status==='fulfilled'?{collections:catalog.value.collections.length,brand_lines:new Set(catalog.value.collections.map(c=>c.brandLineId).filter(Boolean)).size}:null;
 const payload=systemHealthSchema.parse({checked_at:new Date().toISOString(),scope:'PRIVATE_EXPERIENCE_PROJECT',overall:storageOK?'DEGRADED':'INCIDENT',services,private_briefs:storageOK&&database.status==='fulfilled'?database.value!.count:null,public_catalog:publicCatalog,verified_orders:null,verified_payments:null,production_queue:null,commissions_available:null});
 return apiJson(payload);
}
