import type { ShopPrice } from '@/lib/types'

export function PriceTag({ price, compact = false }: { price: ShopPrice; compact?: boolean }) {
  if (price.isOnSale && price.originalPrice) {
    return (
      <span className="inline-flex items-baseline gap-2 score-mono">
        <span className={`text-wine-700 font-semibold tabular-nums ${compact ? 'text-base' : 'text-xl'}`}>
          ${price.price.toFixed(2)}
        </span>
        <span className="text-ink-400 line-through text-xs tabular-nums">
          ${price.originalPrice.toFixed(2)}
        </span>
        {price.promoPercent && (
          <span className="text-[10px] uppercase tracking-widest font-medium bg-gold-400/30 text-wine-700 px-1.5 py-0.5 rounded-sm">
            −{price.promoPercent}%
          </span>
        )}
      </span>
    )
  }
  return (
    <span className={`score-mono text-wine-700 font-semibold tabular-nums ${compact ? 'text-base' : 'text-xl'}`}>
      ${price.price.toFixed(2)}
    </span>
  )
}
