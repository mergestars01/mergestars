/**
 * MERGE AI Brand House -> social media orchestration contract.
 * CORE is the system of record; this module does not open accounts, call providers
 * or represent unchecked permissions as a valid delegated authorization.
 *
 * ChatGPT Work assists with multi-step planning/review; Codex with vetted code;
 * Metricool is only used for authorized social connections where supported.
 * These products are NOT a shared OAuth identity or a single merged API.
 */
export type SocialPurpose = 'mailbox_assistance' | 'social_onboarding' | 'content_drafts';
export type NetworkState =
  | 'UNKNOWN' | 'NEEDS_SIGNUP' | 'AWAITING_OWNER' | 'CONNECTED'
  | 'EXPIRED' | 'FAILED' | 'REVOKED';
export type PublicationState = 'DRAFT'|'AWAITING_APPROVAL'|'APPROVED'|'SCHEDULED'|'PUBLISHED'|'FAILED';

export interface ProviderConnection {
  ownerId: string;
  houseId: string;
  provider: string;
  state: NetworkState;
  providerAccountId?: string; // never guess: must come from verified OAuth/provider API
  lastVerifiedAt?: string;
  consentEventId?: string;
}

export interface OwnerAuthorization {
  ownerId: string;
  houseId: string;
  purpose: SocialPurpose;
  grantedAt: string;
  policyVersion: string;
  revokedAt?: string;
}

export const SUPPORTED_DISCOVERY_TARGETS = [
  'Facebook','Instagram','TikTok','YouTube','LinkedIn',
  'Pinterest','X','Threads','Bluesky','Google Business Profile'
] as const;

/** A checkbox on the preview is NOT an OwnerAuthorization event. */
export function canPerformExternalAction(
  action: 'link'|'schedule'|'publish'|'ad_spend',
  connection: ProviderConnection,
  authorizations: OwnerAuthorization[],
  approved: boolean,
  budgetApproved = false,
): boolean {
  const has = (p:SocialPurpose) => authorizations.some(x=>
    x.ownerId===connection.ownerId && x.houseId===connection.houseId &&
    x.purpose===p && !x.revokedAt && !!x.grantedAt && !!x.policyVersion);
  if(action==='link') return has('social_onboarding') && connection.state==='CONNECTED';
  if(connection.state!=='CONNECTED' || !has('content_drafts') || !approved) return false;
  if(action==='ad_spend') return budgetApproved;
  return true;
}

export function brandStarterCopy(name:string, description:string): {bio:string;post:string} {
  const brand=name.trim().replace(/\s+/g,' ').slice(0,100);
  const craft=description.trim().replace(/\s+/g,' ').slice(0,700);
  if(!brand || !craft) return {bio:'',post:''};
  return {
    bio:`${brand} — საკუთარი შემოქმედება და ხელნაკეთი ნამუშევრები. გაიცანით ჩვენი Brand House MERGE STAR’S-ში.`,
    post:`გაიცანით ${brand}.\n\n${craft}\n\nჩვენი ნამუშევრების შესახებ მეტი მალე.\n\n#MERGESTARS #BrandHouse`
  };
}
