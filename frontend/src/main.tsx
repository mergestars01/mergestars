import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './i18n'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { getCookieConsent, initAnalyticsIfConsented } from './utils/cookieConsent'

if (getCookieConsent() === 'all') {
  initAnalyticsIfConsented()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

// Browser-installed MERGE app uses the same origin, identity and CORE as the website.
// Registration happens only in production; failures never block normal site access.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((error: unknown) => {
      console.warn('MERGE offline shell could not register:', error)
    })
  })
}
