export type CountryCode = 'FR' | 'IT' | 'ES' | 'AR' | 'CL' | 'US' | 'DE' | 'PT' | 'ZA' | 'AU' | 'NZ'
export type WineType = 'red' | 'white' | 'rosé' | 'sparkling' | 'fortified'
export type Category = 'everyday' | 'everyday+' | 'mid' | 'mid-high' | 'high' | 'keeper'
export type DealFlag = 'deal' | 'fair' | 'expensive'

export interface ShopPrice {
  shopId: string
  price: number
  lastChecked: string
  isOnSale?: boolean
  promoPercent?: number
  originalPrice?: number
  url?: string
}

export interface CriticScore {
  critic: string
  score: number
  scoreRange?: string
  reviewer?: string
  vintageReviewed?: string
  label?: string
  notes?: string
}

export interface Wine {
  id: string
  name: string
  producer: string
  country: CountryCode
  region: string
  appellation?: string
  varietals: string[]
  vintage?: string | null
  type: WineType
  category: Category
  shopPrices: ShopPrice[]
  criticScores: CriticScore[]
  tastingNotes?: string
  foodPairings?: string[]
  drinkingWindow?: string
  dealFlag: DealFlag
  isHeadliner?: boolean
  curatorNotes?: string
}

export interface ShopLocation {
  name: string
  address: string
  city: string
  isPrimary?: boolean
}

export interface ShopDelivery {
  channel: string
  storeId?: string
  url?: string
}

export interface Shop {
  id: string
  name: string
  website?: string
  phone?: string
  locations: ShopLocation[]
  delivery?: ShopDelivery[]
  notes?: string
}

export interface UserCellarEntry {
  bought?: boolean
  opened?: boolean
  personalScore?: number | null
  personalNote?: string
  tastedDate?: string | null
  updatedAt?: string
}

export type UserCellar = Record<string, UserCellarEntry>

// ── BAR ────────────────────────────────────────────────
export type BarCategory = 'spiritueux' | 'liqueurs' | 'sirops' | 'bitters' | 'frais' | 'divers'
export type StockStatus = 'ok' | 'low' | 'out'

export interface BarItem {
  id: string
  category: BarCategory
  name: string
  brand?: string
  spirit?: string
  abv?: number
  volume?: string
  origin?: string
  defaultStatus: StockStatus
  notes?: string
}

export interface UserBarEntry {
  status?: StockStatus
  personalNote?: string
  updatedAt?: string
}

export type UserBar = Record<string, UserBarEntry>

// ── RECIPES ────────────────────────────────────────────
export type RecipeStatus = 'À tester' | 'En cours' | 'Validé' | 'Classique maison' | 'Abandonné'
export type RecipeSpirit =
  | 'pisco' | 'mezcal' | 'rhum' | 'gin' | 'vodka' | 'tequila' | 'whisky'
  | 'liqueur' | 'sparkling' | 'other'

export interface RecipeIngredient {
  amount: string
  item: string
  bottleRef?: string
}

export interface Recipe {
  id: string
  name: string
  tagline?: string
  defaultStatus: RecipeStatus
  spirit: RecipeSpirit
  profile: string[]
  ingredients: RecipeIngredient[]
  method: string
  glass: string
  garnish?: string
  notes?: string
  isOriginal?: boolean
  createdAt?: string
}

export interface RecipeVersion {
  text: string
  date: string
}

export interface UserRecipeEntry {
  status?: RecipeStatus
  personalScore?: number | null
  versions?: RecipeVersion[]
  updatedAt?: string
}

export type UserRecipes = Record<string, UserRecipeEntry>
