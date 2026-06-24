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
