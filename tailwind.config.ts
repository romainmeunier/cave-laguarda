import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        cream: {
          50: '#fdfaf4',
          100: '#faf6ee',
          200: '#f3ebd9',
          300: '#e6d9b8',
        },
        wine: {
          50: '#fbf2f2',
          100: '#f4dede',
          400: '#a14444',
          500: '#7a2828',
          600: '#5b1d1d',
          700: '#421414',
          800: '#2c0e0e',
        },
        gold: {
          400: '#c9a967',
          500: '#b8935c',
          600: '#9a7642',
        },
        ink: {
          900: '#1c1614',
          700: '#3a302c',
          500: '#6b5e57',
          400: '#8d7e76',
          300: '#b8a99f',
        },
      },
      letterSpacing: {
        widest: '0.18em',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
