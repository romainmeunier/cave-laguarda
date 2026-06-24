import winesJson from '@/data/wines.json'
import shopsJson from '@/data/shops.json'
import barJson from '@/data/bar.json'
import recipesJson from '@/data/recipes.json'
import type { Wine, Shop, BarItem, BarCategory, Recipe } from './types'

export const wines: Wine[] = (winesJson as { wines: Wine[] }).wines
export const shops: Shop[] = (shopsJson as { shops: Shop[] }).shops
export const barItems: BarItem[] = (barJson as { items: BarItem[] }).items
export const recipes: Recipe[] = (recipesJson as { recipes: Recipe[] }).recipes

export function getBarItem(id: string): BarItem | undefined {
  return barItems.find((b) => b.id === id)
}

export function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id)
}

export const barCategoryLabels: Record<BarCategory, string> = {
  spiritueux: 'Spiritueux',
  liqueurs: 'Liqueurs',
  sirops: 'Sirops',
  bitters: 'Bitters',
  frais: 'Frais',
  divers: 'Divers',
}

export const barCategoryOrder: BarCategory[] = [
  'spiritueux', 'liqueurs', 'sirops', 'bitters', 'frais', 'divers',
]

export const spiritLabels: Record<string, string> = {
  pisco: 'Pisco',
  mezcal: 'Mezcal',
  rhum: 'Rhum',
  gin: 'Gin',
  vodka: 'Vodka',
  tequila: 'Tequila',
  whisky: 'Whisky',
  liqueur: 'Liqueur',
  sparkling: 'Pétillant',
  other: 'Autre',
}

export const recipeStatusLabels: Record<string, string> = {
  'À tester': 'À tester',
  'En cours': 'En cours',
  'Validé': 'Validé',
  'Classique maison': 'Classique',
  'Abandonné': 'Abandonné',
}

export function getWine(id: string): Wine | undefined {
  return wines.find((w) => w.id === id)
}

export function getShop(id: string): Shop | undefined {
  return shops.find((s) => s.id === id)
}

export const categoryOrder: Record<string, number> = {
  everyday: 0,
  'everyday+': 1,
  mid: 2,
  'mid-high': 3,
  high: 4,
  keeper: 5,
}

export const categoryLabels: Record<string, string> = {
  everyday: 'Quotidien',
  'everyday+': 'Quotidien +',
  mid: 'Milieu',
  'mid-high': 'Milieu / Haut',
  high: 'Pointu',
  keeper: 'Garde',
}

export const countryLabels: Record<string, string> = {
  FR: 'France',
  IT: 'Italie',
  ES: 'Espagne',
  AR: 'Argentine',
  CL: 'Chili',
  US: 'États-Unis',
  DE: 'Allemagne',
  PT: 'Portugal',
  ZA: 'Afrique du Sud',
  AU: 'Australie',
  NZ: 'Nouvelle-Zélande',
}

export const countryFlags: Record<string, string> = {
  FR: '🇫🇷',
  IT: '🇮🇹',
  ES: '🇪🇸',
  AR: '🇦🇷',
  CL: '🇨🇱',
  US: '🇺🇸',
  DE: '🇩🇪',
  PT: '🇵🇹',
  ZA: '🇿🇦',
  AU: '🇦🇺',
  NZ: '🇳🇿',
}

export function lowestPrice(wine: Wine): number {
  return Math.min(...wine.shopPrices.map((p) => p.price))
}

export function bestShopPrice(wine: Wine) {
  return wine.shopPrices.reduce((best, current) =>
    current.price < best.price ? current : best
  , wine.shopPrices[0])
}

export function topCriticScore(wine: Wine): number | null {
  if (!wine.criticScores.length) return null
  return Math.max(...wine.criticScores.map((s) => s.score))
}

export function shortCriticLabel(critic: string): string {
  const map: Record<string, string> = {
    'Wine Advocate': 'WA',
    'Robert Parker': 'RP',
    'James Suckling': 'JS',
    'Wine Spectator': 'WS',
    'Wine Spectator (millésime)': 'WS mil.',
    'Decanter': 'Dec.',
    'Vinous': 'Vin.',
    'Wine Enthusiast': 'WE',
    'Tim Atkin': 'Atkin',
    'Jancis Robinson': 'JR',
  }
  return map[critic] || critic
}
