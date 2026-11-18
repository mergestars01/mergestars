import { useAuthStore } from '@/features/auth/store/auth.store'
import { Link } from 'react-router-dom'
import './museum.css'
import { lazy, Suspense, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Megapolis } from './components/megapolis'
import { museumNavigation } from './navigation'
import { useTranslation } from 'react-i18next'
import { rfqCopy } from '../rfq/rfq.copy'

const Museum = lazy(() => import('./components/museum'))

export default function LivingMuseum() {
  const { i18n } = useTranslation()
  const { text: rfqText } = rfqCopy(i18n.language)
  const signedIn = useAuthStore(state => !!state.accessToken && !!state.user)
  const [inside,setInside]=useState(()=>!!window.location.search||!!window.location.hash)
  function openMuseum(catalog=false){museumNavigation.catalogOpen=catalog;if(catalog)museumNavigation.entered=true;setInside(true)}
  return <div className="living-museum"><div hidden={inside} inert={inside}><Megapolis active={!inside} onMuseum={()=>openMuseum()} onCatalog={()=>openMuseum(true)}/></div>{inside&&<>{signedIn && <nav className="personal-museum-entry" aria-label="პირადი მუზეუმი"><Link to="/my-museum">ჩემი Brand Museum</Link><Link to="/rfq/new">{rfqText('new')}</Link><Link to="/my-requests">{rfqText('mine')}</Link></nav>}<Suspense fallback={<p role="status">{rfqText('loading')}</p>}><Museum signedIn={signedIn}/></Suspense><button className="megapolis-return-city" onClick={()=>setInside(false)}><ArrowLeft size={17}/>ქალაქში დაბრუნება</button></>}</div>
}
