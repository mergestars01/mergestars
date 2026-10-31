import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Model3DViewer from './Model3DViewer'

const STYLES = [
  { value: 'Jewelry', labelKey: 'jewelry' },
  { value: 'Luxury coin', labelKey: 'luxuryCoin' },
  { value: 'Watch', labelKey: 'watch' },
  { value: 'Sculpture', labelKey: 'sculpture' },
  { value: 'Ring', labelKey: 'ring' },
  { value: 'Pendant', labelKey: 'pendant' },
] as const

export type MeshyGenerateResult = {
  prompt: string
  style: string
  previewUrl: string | null
}

type Props = {
  onGenerate?: (payload: { prompt: string; style: string }) => Promise<MeshyGenerateResult | void>
  resultUrl?: string | null
}

export default function MeshyAIPanel({ onGenerate, resultUrl: externalResult }: Props) {
  const { t } = useTranslation()
  const promptId = useId()
  const generating = useRef(false)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<string>(STYLES[0].value)
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle')
  const [localResult, setLocalResult] = useState<string | null>(null)

  const resultUrl = externalResult ?? localResult

  const handleGenerate = async () => {
    if (!prompt.trim() || !onGenerate || generating.current) return
    generating.current = true
    setStatus('generating')
    setLocalResult(null)

    try {
      const res = await onGenerate({ prompt: prompt.trim(), style })
      if (!res?.previewUrl || !/^(https:\/\/|\/(?!\/)|blob:)/.test(res.previewUrl)) throw new Error('MODEL_NOT_RETURNED')
      setLocalResult(res.previewUrl)
      setStatus('done')
    } catch {
      setStatus('error')
    } finally {
      generating.current = false
    }
  }

  return (
    <div className="catalog-meshy-panel">
      <div className="catalog-meshy-header">
        <div className="catalog-meshy-badge">
          <span aria-hidden>✦</span>
          Meshy AI
        </div>
        <p className="catalog-meshy-sub">
          {t('collections.meshySub', { defaultValue: 'Describe your piece — AI generates a 3D model for your catalog.' })}
        </p>
      </div>

      <label className="auth-field-label" htmlFor={promptId}>
        {t('collections.meshyPrompt', { defaultValue: 'Prompt' })}
      </label>
      <textarea
        id={promptId}
        className="gold-input catalog-meshy-prompt"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t('collections.meshyPlaceholder', {
          defaultValue: 'e.g. A luxury gold coin with MERGE STARS engraving, brushed metal finish…',
        })}
      />

      <p className="auth-field-label mt-4">{t('collections.meshyStyle', { defaultValue: 'Style' })}</p>
      <div className="catalog-meshy-chips">
        {STYLES.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`catalog-meshy-chip${style === s.value ? ' catalog-meshy-chip--active' : ''}`}
            onClick={() => setStyle(s.value)}
          >
            {t(`collections.meshyStyles.${s.labelKey}`)}
          </button>
        ))}
      </div>

      <div className="catalog-meshy-actions">
        <button
          type="button"
          className="catalog-meshy-generate"
          disabled={!onGenerate || !prompt.trim() || status === 'generating'}
          onClick={handleGenerate}
        >
          {status === 'generating'
            ? t('collections.meshyGenerating', { defaultValue: 'Generating…' })
            : t('collections.meshyGenerate', { defaultValue: 'Generate 3D with Meshy AI' })}
        </button>
        {!onGenerate && <span className="catalog-meshy-api-note" role="status">
          {t('collections.meshyApiNote', { defaultValue: 'Connect MESHY_API_KEY on the server to enable live generation.' })}
        </span>}
      </div>

      {status === 'generating' && (
        <div className="catalog-meshy-progress" role="status" aria-live="polite">
          <span>{t('collections.meshyGenerating', { defaultValue: 'Generating…' })}</span>
        </div>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-400 mt-2">
          {t('collections.meshyError', { defaultValue: 'Generation failed. Check Meshy API configuration.' })}
        </p>
      )}

      <div className="catalog-meshy-preview mt-6">
        <p className="dash-label mb-3">{t('collections.meshyPreview', { defaultValue: 'AI preview' })}</p>
        <Model3DViewer
          modelUrl={resultUrl}
          emptyLabel={t('collections.meshyPreviewEmpty', { defaultValue: 'Generated model will appear here' })}
        />
      </div>
    </div>
  )
}
