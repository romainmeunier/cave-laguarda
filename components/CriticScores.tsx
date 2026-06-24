import type { CriticScore } from '@/lib/types'
import { shortCriticLabel } from '@/lib/data'

export function CriticScoresInline({ scores, max }: { scores: CriticScore[]; max?: number }) {
  if (!scores.length) {
    return (
      <span className="text-[11px] uppercase tracking-widest text-ink-400 font-mono">
        Aucune note pro
      </span>
    )
  }
  const shown = max ? scores.slice(0, max) : scores
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 score-mono text-[13px]">
      {shown.map((s, i) => (
        <span key={i} className="inline-flex items-baseline gap-1">
          <span className="text-ink-500 text-[11px]">{shortCriticLabel(s.critic)}</span>
          <span className="text-wine-700 font-semibold tabular-nums">
            {s.scoreRange ?? s.score}
          </span>
          {s.label && (
            <span className="text-gold-600 text-[10px] uppercase tracking-widest ml-0.5">
              {s.label}
            </span>
          )}
        </span>
      ))}
    </span>
  )
}

export function CriticScoresTable({ scores }: { scores: CriticScore[] }) {
  if (!scores.length) {
    return (
      <p className="text-sm text-ink-500 italic">
        Aucune note critique pro vérifiée pour ce vin. Pedigree basé sur la réputation du producteur uniquement.
      </p>
    )
  }
  return (
    <table className="w-full text-sm editorial-table">
      <thead>
        <tr className="text-left">
          <th className="py-2 pr-4">Critique</th>
          <th className="py-2 pr-4">Note</th>
          <th className="py-2 pr-4">Millésime</th>
          <th className="py-2">Reviewer · note</th>
        </tr>
      </thead>
      <tbody>
        {scores.map((s, i) => (
          <tr key={i}>
            <td className="py-2 pr-4 text-ink-700">{s.critic}</td>
            <td className="py-2 pr-4 score-mono text-wine-700 font-semibold tabular-nums">
              {s.scoreRange ?? s.score}
              {s.label && (
                <span className="ml-2 text-gold-600 text-[10px] uppercase tracking-widest">
                  {s.label}
                </span>
              )}
            </td>
            <td className="py-2 pr-4 text-ink-500 text-xs">{s.vintageReviewed ?? '—'}</td>
            <td className="py-2 text-ink-500 text-xs italic">
              {s.reviewer ? <span className="not-italic text-ink-700 mr-1">{s.reviewer}.</span> : null}
              {s.notes ?? ''}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
