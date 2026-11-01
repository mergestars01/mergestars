import type {Metadata} from 'next';
import {getChatGPTUser,chatGPTSignInPath} from '@/app/chatgpt-auth';
import {MERGEAIManagerPage} from '@/components/merge-ai-workspace';
import {CompanyWordmark} from '@/components/company-identity';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'MERGE AI — Personal Brand Manager',description:'Your MERGE brand workspace. Existing CORE identity and authorized provider connections are required.',robots:{index:false,follow:false}};
export default async function MERGEAIManagerRoute(){
  const user=await getChatGPTUser();
  if(!user)return <main className="mai-access-screen" lang="en"><CompanyWordmark/><span>PERSONAL BRAND MANAGEMENT CENTER</span><h1>Your MERGE AI workspace</h1><p>Sign in to the existing private Museum. Shared MERGE CORE authentication still requires its authorized integration.</p><a className="button" href={chatGPTSignInPath('/dashboard/merge-ai')}>Sign in to the private Museum</a><a href="/">Return to the Living Museum</a></main>;
  return <main><MERGEAIManagerPage key={user.userId} signedIn/></main>;
}
