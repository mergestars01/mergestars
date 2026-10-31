import { useEffect, useState } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'

/** Fetch protected API asset URLs with Bearer token → blob URL for img/GLTF. */
export function useAuthAssetUrl(url: string | null | undefined) {
  const token = useAuthStore((s) => s.accessToken)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  /* eslint-disable react-hooks/set-state-in-effect -- Synchronizes browser blob URLs and revokes them on cleanup. */
  useEffect(() => {
    if (!url) {
      setBlobUrl(null)
      return
    }

    const asset = new URL(url, window.location.origin)
    const apiOrigin = new URL(import.meta.env.VITE_API_URL || '/api', window.location.origin).origin
    const needsAuth = asset.origin === apiOrigin && (asset.pathname.includes('/catalog/items/') || asset.pathname.includes('/brand/me/logo'))
    if (!needsAuth) {
      setBlobUrl(url)
      return
    }

    let objectUrl: string | null = null
    let cancelled = false
    setBlobUrl(null)

    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
      cache: 'no-store',
    })
      .then((res) => {
        if (!res.ok) throw new Error('asset')
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setBlobUrl(objectUrl)
      })
      .catch(() => {
        if (!cancelled) setBlobUrl(null)
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [url, token])
  /* eslint-enable react-hooks/set-state-in-effect */

  return blobUrl
}
