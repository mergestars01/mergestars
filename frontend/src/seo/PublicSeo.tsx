import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import pages from './public-pages.json'

export default function PublicSeo() {
  const { pathname }=useLocation()
  const page=pages.find(value=>value.path===pathname)
  useEffect(()=>{
    const timer=setTimeout(()=>{
      document.title=page?.title??'MERGE STARS'
      function meta(name:string,content:string){let element=document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);if(!element){element=document.createElement('meta');element.name=name;document.head.append(element)}element.content=content}
      meta('robots',page?'index,follow':'noindex,nofollow')
      meta('description',page?.description??'Private or non-indexable MERGE experience.')
      document.head.querySelectorAll('link[rel="canonical"],meta[property^="og:"],meta[name="twitter:card"],script[type="application/ld+json"]').forEach(element=>element.remove())
      if(page){
        const canonical='https://mergestars.com'+page.path
        const link=document.createElement('link');link.rel='canonical';link.href=canonical;document.head.append(link)
        for(const [property,content] of Object.entries({'og:title':page.title,'og:description':page.description,'og:url':canonical,'og:type':'website','og:image':'https://mergestars.com/museum/merge-master-logo-canonical.png'})){const tag=document.createElement('meta');tag.setAttribute('property',property);tag.content=content;document.head.append(tag)}
        meta('twitter:card','summary')
        const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',url:canonical,name:page.title,description:page.description});document.head.append(schema)
      }
    },0)
    return ()=>clearTimeout(timer)
  },[pathname,page])
  if(!page)return null
  return <section aria-label="MERGE public overview" style={{padding:'24px 5%',background:'#101512',color:'#e5dfce'}}><h2 style={{fontSize:20}}>{page.heading}</h2><p>{page.description}</p><p>{page.text}</p><nav aria-label="MERGE public pages" style={{display:'flex',flexWrap:'wrap',gap:18}}>{pages.map(item=><a key={item.path} href={item.path}>{item.heading}</a>)}</nav></section>
}
