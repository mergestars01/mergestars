/** Text concept plans only. Actual image/3D jobs have separate verified provider gates. */
export type DesignConcept={title:string;brief:string};
export type IndexedRevision=DesignConcept&{index:number};
function jsonBody(reply:string):unknown{
 if(reply.length>18000)throw Error('AI_REPLY_TOO_LARGE');
 const start=reply.indexOf('{'),end=reply.lastIndexOf('}');
 if(start<0||end<start)throw Error('AI_JSON_REQUIRED');
 try{return JSON.parse(reply.slice(start,end+1));}catch{throw Error('AI_JSON_INVALID');}
}
function concept(value:unknown):DesignConcept {
 if(!value||typeof value!=='object')throw Error('AI_DESIGN_INVALID');
 const v=value as Record<string,unknown>;
 if(typeof v.title!=='string'||typeof v.brief!=='string')throw Error('AI_DESIGN_INVALID');
 const title=v.title.trim(),brief=v.brief.trim();
 if(title.length<2||title.length>80||brief.length<5||brief.length>390)throw Error('AI_DESIGN_INVALID');
 return {title,brief};
}
export function parseTwelveDesigns(reply:string):DesignConcept[]{
 const data=jsonBody(reply) as {designs?:unknown};
 if(!data||!Array.isArray(data.designs)||data.designs.length!==12)throw Error('AI_EXPECTED_TWELVE');
 const designs=data.designs.map(concept);
 if(new Set(designs.map(d=>d.title.toLocaleLowerCase())).size!==12)throw Error('AI_DUPLICATED_DESIGNS');
 return designs;
}
export function parseSelectedRevisions(reply:string,indices:readonly number[]):IndexedRevision[]{
 const data=jsonBody(reply) as {designs?:unknown};
 if(!data||!Array.isArray(data.designs)||data.designs.length!==indices.length||!indices.length)throw Error('AI_REVISION_COUNT');
 const wanted=new Set(indices),seen=new Set<number>();
 return data.designs.map((row:unknown)=>{
  if(!row||typeof row!=='object')throw Error('AI_REVISION_INVALID');
  const index=(row as {index?:unknown}).index;
  if(typeof index!=='number'||!Number.isInteger(index)||!wanted.has(index)||seen.has(index))throw Error('AI_REVISION_INDEX');
  seen.add(index);
  return {...concept(row),index};
 });
}
export function batchDesignPrompt(portal:string,line:string,intent:string,language:string):string{
 return [
 'You are MERGE AI, a product concept designer, NOT a manufacturer or price authority.',
 'Portal: '+portal+'. Material line: '+line+'. Reply language: '+language+'.',
 'Produce EXACTLY 12 DISTINCT realistic physical-product concepts in ONE response.',
 'Respect the user request. Preserve approved MERGE brand artwork; never invent a company logo or claim unauthorised third-party partnerships.',
 'Return ONLY valid JSON with shape {"designs":[{"title":"...","brief":"..."},...]} exactly 12 entries.',
 'Each title must be unique (2-80 characters); each brief 5-390 characters including form, materials and distinctive design details.',
 'No fabrication of actual images, 3D files, prices, measurements, approvals or manufacturing.',
 'USER REQUEST: '+intent
 ].join('\n');
}
export function revisionDesignPrompt(portal:string,line:string,items:readonly IndexedRevision[],intent:string,language:string):string{
 if(!items.length||items.length>12)throw Error('NO_SELECTED_DESIGNS');
 return [
 'You are MERGE AI. Revise ONLY the explicitly selected designs, leaving all others unchanged.',
 'Portal: '+portal+'. Material line: '+line+'. Reply language: '+language+'.',
 'Return ONLY valid JSON of shape {"designs":[{"index":1,"title":"...","brief":"..."}]}.',
 'Return exactly '+items.length+' entries with EXACTLY these indices: '+items.map(x=>x.index).join(', ')+'.',
 'Keep each title 2-80 chars and brief 5-390 chars. No made-up partner approval, image, 3D, commercial offer or price.',
 'DESIGNS: '+JSON.stringify(items),
 'USER REVISION: '+intent
 ].join('\n');
}

/** Recognises explicit twelve-design requests from the existing AI chat (not a general intent classifier). */
export function isTwelveDesignRequest(message:string):boolean{
 const text=message.toLocaleLowerCase().slice(0,1800);
 const twelve=/(?:\b12\b|თორმეტ|tormet|twelve|двенадцат)/i.test(text);
 const design=/(?:დიზაინ|მოდელ|ნივთ|design|model|product|модел|дизайн|вещ|продукт)/i.test(text);
 return twelve&&design;
}
