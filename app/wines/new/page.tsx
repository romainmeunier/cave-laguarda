'use client'

import { useState } from 'react'

export default function NewWinePage() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    producer: '',
    country: 'FR',
    region: '',
    appellation: '',
    varietals: '',
    vintage: '',
    type: 'red',
    category: 'everyday',
    price: '',
    shopId: 'laguarda',
    isOnSale: false,
    promoPercent: '',
    originalPrice: '',
    tastingNotes: '',
    foodPairings: '',
    drinkingWindow: '',
    dealFlag: 'fair',
    curatorNotes: '',
    criticScores: '', // free text "JS 91 (2020), WE 91 Best Buy"
  })

  const today = new Date().toISOString().slice(0, 10)
  const json = buildJson(form, today)

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl text-ink-900 mb-3">Ajouter une bouteille</h1>
      <p className="text-ink-500 mb-8 max-w-2xl leading-relaxed">
        MVP : ce formulaire ne sauvegarde pas en base. Il génère un fragment JSON à coller
        dans <code className="font-mono text-wine-700 text-sm">data/wines.json</code> (puis rebuild).
        Pratique pour ajouter rapidement une trouvaille en magasin.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form className="lg:col-span-3 space-y-4">
          <Row>
            <Input label="ID (ex L13)" value={form.id} onChange={(v) => setForm({ ...form, id: v })} placeholder="L13" />
            <Input label="Pays" value={form.country} onChange={(v) => setForm({ ...form, country: v })} placeholder="FR / IT / ES / AR / CL" />
            <Input label="Millésime" value={form.vintage} onChange={(v) => setForm({ ...form, vintage: v })} placeholder="2019 (opt.)" />
          </Row>
          <Row>
            <Input label="Nom de la cuvée" value={form.name} onChange={(v) => setForm({ ...form, name: v })} className="sm:col-span-2" />
            <Input label="Producteur" value={form.producer} onChange={(v) => setForm({ ...form, producer: v })} />
          </Row>
          <Row>
            <Input label="Région" value={form.region} onChange={(v) => setForm({ ...form, region: v })} />
            <Input label="Appellation" value={form.appellation} onChange={(v) => setForm({ ...form, appellation: v })} />
            <Input label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} placeholder="red / white / rosé / sparkling" />
          </Row>
          <Input
            label="Cépages (séparés par virgule)"
            value={form.varietals}
            onChange={(v) => setForm({ ...form, varietals: v })}
            placeholder="Tempranillo, Garnacha, Graciano"
          />

          <Row>
            <Input label="Catégorie" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="everyday / everyday+ / mid / mid-high / high / keeper" />
            <Input label="Affaire ?" value={form.dealFlag} onChange={(v) => setForm({ ...form, dealFlag: v })} placeholder="deal / fair / expensive" />
          </Row>

          <Row>
            <Input label="Caviste" value={form.shopId} onChange={(v) => setForm({ ...form, shopId: v })} placeholder="laguarda" />
            <Input label="Prix USD" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="29.99" />
            <Input label="Prix d'origine (si promo)" value={form.originalPrice} onChange={(v) => setForm({ ...form, originalPrice: v })} placeholder="50.00" />
          </Row>

          <Input
            label="Notes critiques (libre — sera converti)"
            value={form.criticScores}
            onChange={(v) => setForm({ ...form, criticScores: v })}
            placeholder="JS 91 (2020); WE 91 Best Buy (2020)"
          />

          <TextArea label="Notes de dégustation" value={form.tastingNotes} onChange={(v) => setForm({ ...form, tastingNotes: v })} />
          <Input label="Accords mets (séparés par virgule)" value={form.foodPairings} onChange={(v) => setForm({ ...form, foodPairings: v })} />
          <Input label="Garde" value={form.drinkingWindow} onChange={(v) => setForm({ ...form, drinkingWindow: v })} placeholder="2026-2032" />
          <TextArea label="Note du curateur" value={form.curatorNotes} onChange={(v) => setForm({ ...form, curatorNotes: v })} />
        </form>

        <aside className="lg:col-span-2">
          <div className="sticky top-24 bg-cream-50 border border-ink-900/10 rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg text-ink-900">JSON à insérer</h3>
              <button
                onClick={() => navigator.clipboard.writeText(json)}
                className="text-xs uppercase tracking-widest text-ink-500 hover:text-wine-700"
              >
                Copier
              </button>
            </div>
            <pre className="text-[11px] font-mono overflow-x-auto whitespace-pre bg-cream-100 p-3 rounded-sm border border-ink-900/10 max-h-[60vh] overflow-y-auto">
              {json}
            </pre>
            <p className="text-[11px] text-ink-500 mt-3 leading-relaxed">
              Colle ce bloc dans le tableau <code className="font-mono">wines</code> du fichier
              <code className="font-mono"> data/wines.json</code>, sauve, puis
              <code className="font-mono"> npm run build</code>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{children}</div>
}

function Input({
  label, value, onChange, placeholder, className,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={`flex flex-col ${className ?? ''}`}>
      <span className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700"
      />
    </label>
  )
}

function TextArea({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col">
      <span className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="px-3 py-2 border border-ink-900/15 rounded-sm bg-cream-50 text-sm focus:border-wine-700 resize-y"
      />
    </label>
  )
}

function buildJson(form: ReturnType<typeof initial>, today: string) {
  const obj: Record<string, unknown> = {
    id: form.id || 'L??',
    name: form.name,
    producer: form.producer,
    country: form.country,
    region: form.region,
    appellation: form.appellation || undefined,
    varietals: form.varietals.split(',').map((v) => v.trim()).filter(Boolean),
    vintage: form.vintage || null,
    type: form.type,
    category: form.category,
    shopPrices: [
      {
        shopId: form.shopId || 'laguarda',
        price: Number(form.price) || 0,
        lastChecked: today,
        ...(form.originalPrice
          ? {
              isOnSale: true,
              originalPrice: Number(form.originalPrice),
              promoPercent: Number(form.originalPrice) && Number(form.price)
                ? Math.round(100 - (Number(form.price) / Number(form.originalPrice)) * 100)
                : undefined,
            }
          : {}),
      },
    ],
    criticScores: parseCritics(form.criticScores),
    tastingNotes: form.tastingNotes || undefined,
    foodPairings: form.foodPairings.split(',').map((v) => v.trim()).filter(Boolean),
    drinkingWindow: form.drinkingWindow || undefined,
    dealFlag: form.dealFlag,
    curatorNotes: form.curatorNotes || undefined,
  }
  // Trim undefined
  const cleaned = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0))
  )
  return JSON.stringify(cleaned, null, 2)
}

function parseCritics(input: string) {
  if (!input.trim()) return []
  return input
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((segment) => {
      const m = segment.match(/^(JS|WA|WE|WS|RP|Dec\.?|Vin\.?|Atkin|JR)\s*(\d+(?:[-–]\d+)?)/i)
      if (!m) return { critic: 'Autre', score: 0, notes: segment }
      const label = m[1].toUpperCase()
      const map: Record<string, string> = {
        JS: 'James Suckling',
        WA: 'Wine Advocate',
        WE: 'Wine Enthusiast',
        WS: 'Wine Spectator',
        RP: 'Robert Parker',
        'DEC': 'Decanter',
        'DEC.': 'Decanter',
        'VIN': 'Vinous',
        'VIN.': 'Vinous',
        ATKIN: 'Tim Atkin',
        JR: 'Jancis Robinson',
      }
      const scoreText = m[2]
      const score = Number(scoreText.split(/[-–]/)[0])
      const vintageMatch = segment.match(/\((\d{4})\)/)
      const bestBuy = /best\s*buy/i.test(segment)
      return {
        critic: map[label] ?? label,
        score,
        scoreRange: scoreText.includes('-') || scoreText.includes('–') ? scoreText : undefined,
        vintageReviewed: vintageMatch ? vintageMatch[1] : undefined,
        label: bestBuy ? 'Best Buy' : undefined,
      }
    })
}

// Helper to keep the buildJson type checker happy on form shape.
function initial() {
  return {
    id: '', name: '', producer: '', country: '', region: '', appellation: '',
    varietals: '', vintage: '', type: '', category: '', price: '', shopId: '',
    isOnSale: false, promoPercent: '', originalPrice: '', tastingNotes: '',
    foodPairings: '', drinkingWindow: '', dealFlag: '', curatorNotes: '',
    criticScores: '',
  }
}
