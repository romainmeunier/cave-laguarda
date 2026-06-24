import type { Metadata } from 'next'
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { AuthBar } from '@/components/AuthBar'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Maison Meunier — Cumbayá',
  description: 'Cave & bar — Romain, Cumbayá / Quito. Vins curatés, spiritueux, cocktails.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen paper-grain antialiased">
        <header className="border-b border-ink-900/10 bg-cream-50/80 backdrop-blur supports-[backdrop-filter]:bg-cream-50/70 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-6">
            <Link href="/" className="group flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-wine-700 leading-none italic">
                Maison Meunier
              </span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-ink-500 mt-1">
                Cave · Bar · Cumbayá
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 text-sm flex-wrap justify-end">
              <NavLink href="/">Cave</NavLink>
              <NavLink href="/bar">Bar</NavLink>
              <NavLink href="/cocktails">Cocktails</NavLink>
              <NavLink href="/deals">Affaires</NavLink>
              <NavLink href="/shops">Cavistes</NavLink>
              <div className="ml-2 pl-2 border-l border-ink-900/10">
                <AuthBar />
              </div>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
          {children}
        </main>

        <footer className="border-t border-ink-900/10 mt-20 py-8">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row justify-between gap-4 text-xs text-ink-500">
            <span>Cave personnelle — curatée par Claude, gérée par Romain.</span>
            <span className="font-mono">v0.1 · {new Date().getFullYear()}</span>
          </div>
        </footer>
      </body>
    </html>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="btn-ghost px-3 py-1.5 rounded-md text-ink-700 hover:text-wine-700 hover:bg-cream-200/60"
    >
      {children}
    </Link>
  )
}
