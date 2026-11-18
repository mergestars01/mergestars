import { lazy, Suspense, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { catalogApi } from '@/features/catalog/api/catalog.api'
const MuseumCatalog = lazy(() => import('../MuseumCatalog'))

export default function IndustryDirectory({ query = '' }: { query?: string }) {
  const { i18n, t } = useTranslation()
  const ka = i18n.language.startsWith('ka')
  const [selected, setSelected] = useState<string | null>(null)
  const industries = useQuery({
    queryKey: ['core-industry-destinations'],
    queryFn: catalogApi.industries,
    staleTime: 5 * 60_000,
    retry: false,
  })

  if (industries.isPending) return <p role="status">{t('common.loading')}</p>
  if (industries.isError) return <p role="alert">
    {ka ? 'ინდუსტრიების სია ვერ ჩაიტვირთა.' : 'The industry directory could not be loaded.'}{' '}
    <button className="megapolis-text-button" onClick={() => void industries.refetch()}>
      {ka ? 'ხელახლა ცდა' : 'Retry'}
    </button>
  </p>

  const label = (industry: (typeof industries.data)[number]) => ka ? industry.labelKa : industry.label
  const current = industries.data.find(industry => industry.code === selected)
  if (current) return <section aria-label={label(current)}>
    <button className="megapolis-text-button" onClick={() => setSelected(null)}>
      <ArrowLeft size={16} />{ka ? 'ინდუსტრიები' : 'Industries'}
    </button>
    <h3>{label(current)}</h3>
    <Link className="megapolis-text-button" to={`/rfq/new?industry=${current.code}`}>
      {ka ? 'მოითხოვე საწარმოო შეთავაზება' : 'Request a manufacturing quote'}
    </Link>
    <Suspense fallback={<p role="status">{t('common.loading')}</p>}>
      <MuseumCatalog key={current.code} category={current.categories[0]} categories={current.categories} />
    </Suspense>
  </section>

  const search = query.trim().toLocaleLowerCase()
  const matching = industries.data.filter(industry =>
    `${industry.label} ${industry.labelKa}`.toLocaleLowerCase().includes(search),
  )
  return <div className="megapolis-directory">
    {matching.map(industry => <button key={industry.code} onClick={() => setSelected(industry.code)}>
      <strong>{label(industry)}</strong><ArrowRight size={18} />
    </button>)}
    {matching.length === 0 && <p role="status">{ka ? 'ინდუსტრია ვერ მოიძებნა.' : 'No matching industries.'}</p>}
  </div>
}
