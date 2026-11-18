import { Link } from 'react-router-dom'
import './CoinCorePanel.css'

/**
 * Museum experience layer only.
 * All financial, order, identity and material records stay in the existing CORE.
 * No simulated prices, payment states or manufacturing claims.
 */
const destinations = [
  { title: 'SILVER COIN', detail: '1 kg Ag 999.9 reference · market source and timestamp required', to: '/price-indicator', action: 'View price indicator' },
  { title: 'GOLD COIN', detail: '1 kg Au 999.9 reference · verified offer governs the order', to: '/price-indicator', action: 'View price indicator' },
  { title: 'MERGE 8K MATERIAL', detail: '333 g precious metal + 667 g polymer per kg · target formulation', to: '/material-lab', action: 'Open material lab' },
  { title: 'MERGE COIN', detail: 'Opening luxury case · watch, eyewear, perfume and accessories', to: '/materials', action: 'Explore Coin' },
  { title: 'BRAND HOUSES', detail: 'Individual houses and their catalogues', to: '/houses', action: 'Enter houses' },
  { title: 'DESIGN STUDIO', detail: 'Design, versions and product creation', to: '/create', action: 'Create a design' },
  { title: 'PRODUCT PASSPORT', detail: 'Traceability and verified product documentation', to: '/passport', action: 'View passports' },
  { title: 'COMMISSION POLICY', detail: 'Verified-order rules; Silver and Gold policies are distinct', to: '/referral-policy', action: 'Read policy' },
] as const

export default function CoinCorePanel() {
  return (
    <section className="merge-coin-core-panel" aria-labelledby="merge-coin-core-title" id="coin-core">
      <div className="merge-coin-core-heading">
        <span className="merge-coin-core-eyebrow">THE LIVING MUSEUM · CORE EXPERIENCE</span>
        <h2 id="merge-coin-core-title">PRECIOUS MATERIALS &amp; MERGE COIN</h2>
        <p>Explore the original MERGE ecosystem through existing platform routes. CORE remains the system of record.</p>
      </div>
      <div className="merge-coin-core-grid">
        {destinations.map(item => (
          <article className="merge-coin-core-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <Link to={item.to} className="merge-coin-core-action">{item.action} <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>
      <p className="merge-coin-core-note">Market prices, payment status, production and QC must be verified by their existing services; this panel does not invent live data or authorize production.</p>
    </section>
  )
}
