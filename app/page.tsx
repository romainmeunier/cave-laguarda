import { wines } from '@/lib/data'
import { FilteredCellar } from '@/components/Filters'
import { CellarStats } from '@/components/CellarStats'

export default function Home() {
  return (
    <div>
      <section className="mb-12 max-w-3xl">
        <p className="text-[11px] uppercase tracking-widest text-gold-600 mb-3 font-mono">
          Cave personnelle · Cumbayá · v0.1
        </p>
        <h1 className="font-display text-4xl sm:text-6xl text-ink-900 leading-[0.95] tracking-tight mb-5">
          La cave de Romain,
          <br />
          <span className="text-wine-700 italic">curatée</span> à Quito.
        </h1>
        <p className="dropcap text-ink-700 text-lg leading-relaxed">
          Un Français à Cumbayá, douze bouteilles pour commencer une cave. Chaque vin est cross-validé par les critiques sérieux (Parker, Suckling, Wine Spectator, Decanter) — et le prix vérifié dans les catalogues des cavistes de Quito. La sélection évolue à chaque trouvaille. Les vraies affaires sont signalées en rouge.
        </p>
      </section>

      <hr className="editorial-rule mb-10" />

      <CellarStats wines={wines} />

      <FilteredCellar wines={wines} />
    </div>
  )
}
