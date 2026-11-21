/** D1-only personal museum drafts; never authoritative CORE products/orders. */
import {z} from 'zod';
import {CYCLES} from './life-cycle-2026';

export const cycleIdSchema=z.enum(CYCLES.map(c=>c.id) as [typeof CYCLES[number]['id'],...Array<typeof CYCLES[number]['id']>]);
export const cycleLineSchema=z.enum(['GOLD','SILVER']);
export const lifeCycleInputSchema=z.object({
  request_id:z.string().uuid(),
  cycle_id:cycleIdSchema,
  line:cycleLineSchema,
  brief:z.string().trim().min(1).max(500),
}).strict();
export const lifeCycleDraftSchema=z.object({
  id:z.string().uuid(),
  cycle_id:cycleIdSchema,
  line:cycleLineSchema,
  brief:z.string().trim().min(1).max(500),
  created_at:z.string().datetime({offset:true}),
  version:z.number().int().positive().optional(),
  status:z.literal('CONCEPT'),
  core_product_id:z.null(),
  core_house_id:z.null(),
  production_authorized:z.literal(false),
}).strict();
export const lifeCycleListSchema=z.object({
  drafts:z.array(lifeCycleDraftSchema).max(288),
  scope:z.literal('PRIVATE_EXPERIENCE'),
  core_connected:z.literal(false),
}).strict();
export const lifeCycleSaveSchema=z.object({draft:lifeCycleDraftSchema,replayed:z.boolean()}).strict();
export type LifeCycleInput=z.infer<typeof lifeCycleInputSchema>;
export type LifeCycleDraft=z.infer<typeof lifeCycleDraftSchema>;
export function capacityAvailable(rows:readonly {cycle_id:string;line:string}[],cycleId:string,line:string) {
 return rows.filter(x=>x.cycle_id===cycleId&&x.line===line).length<12;
}

/** Revision requests never alter the initial creation, source lineage, CORE status or ownership. */
export const lifeCycleRevisionInputSchema=z.object({
 request_id:z.string().uuid(),
 draft_id:z.string().uuid(),
 brief:z.string().trim().min(1).max(500),
}).strict();
export const lifeCycleRevisionSchema=z.object({
 draft_id:z.string().uuid(),
 version:z.number().int().positive(),
 brief:z.string().min(1).max(500),
 created_at:z.string().datetime({offset:true}),
}).strict();
export const lifeCycleRevisionSaveSchema=z.object({
 revision:lifeCycleRevisionSchema,
 replayed:z.boolean(),
}).strict();
export const lifeCycleHistorySchema=z.object({
 revisions:z.array(lifeCycleRevisionSchema).max(500),
 scope:z.literal('PRIVATE_EXPERIENCE'),
}).strict();
export type LifeCycleRevisionInput=z.infer<typeof lifeCycleRevisionInputSchema>;
