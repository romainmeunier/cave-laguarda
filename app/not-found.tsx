import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-24 text-center max-w-md mx-auto">
      <p className="text-[11px] uppercase tracking-widest text-gold-600 mb-3 font-mono">404</p>
      <h1 className="font-display text-5xl text-wine-700 mb-4 italic">Vide.</h1>
      <p className="text-ink-500 mb-8">
        Cette page est sortie de la cave, ou n'y a jamais été référencée.
      </p>
      <Link href="/" className="inline-block px-4 py-2 bg-wine-700 text-cream-50 text-sm uppercase tracking-widest rounded-sm hover:bg-wine-600">
        Retour à la cave
      </Link>
    </div>
  )
}
