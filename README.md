# Cave Laguarda

Application personnelle de suivi de cave — Romain, Cumbayá / Quito.

Multi-source, multi-caviste, curatée par Claude au fil des trouvailles.

## Stack

- Next.js 14 (App Router)
- TypeScript strict
- Tailwind CSS + `@tailwindcss/typography`
- Données en `data/*.json` (versionnables), pas de DB
- État utilisateur en localStorage (per-bouteille)
- Fontes : Fraunces (display), Inter Tight (corps), JetBrains Mono (chiffres)

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
npm run start      # serveur de production
npm run typecheck  # validation TS sans build
```

## Structure

```
.
├── app/
│   ├── layout.tsx              # Header, fonts, footer
│   ├── page.tsx                # Home — cellier, filtres, stats
│   ├── globals.css             # Variables CSS, paper grain, drop cap
│   ├── deals/page.tsx          # Page « Les bonnes trouvailles »
│   ├── shops/page.tsx          # Cavistes + délivrance
│   ├── wines/new/page.tsx      # Formulaire → fragment JSON à coller
│   ├── wines/[id]/page.tsx     # Fiche détail vin
│   └── not-found.tsx
├── components/
│   ├── Badge.tsx               # DealBadge, CategoryBadge
│   ├── CellarStats.tsx         # Stats agrégées (client, lit localStorage)
│   ├── CriticScores.tsx        # Inline + table
│   ├── Filters.tsx             # Barre filtres + grille (client)
│   ├── PriceTag.tsx
│   ├── UserStatusDot.tsx       # Dot d'état sur les cartes
│   ├── WineActions.tsx         # Toggle owned/opened + note/20 + texte
│   └── WineCard.tsx
├── data/
│   ├── shops.json              # 1 caviste pour l'instant (LaGuarda)
│   ├── wines.json              # 12 vins bootstrap (L01..L12)
│   └── wines.schema.json       # JSON Schema pour valider les ajouts
├── lib/
│   ├── data.ts                 # Helpers lecture catalogue + labels
│   ├── types.ts                # Types TS
│   └── useUserCellar.ts        # Hook localStorage
├── tailwind.config.ts          # Palette burgundy/cream/gold
└── tsconfig.json
```

## Ajouter un vin

1. Soit en passant par la page `/wines/new` (formulaire qui génère un fragment JSON à coller).
2. Soit en éditant directement `data/wines.json` :

```jsonc
{
  "id": "L13",
  "name": "Borsao Tres Picos Garnacha",
  "producer": "Bodegas Borsao",
  "country": "ES",
  "region": "Aragon",
  "appellation": "Campo de Borja DO",
  "varietals": ["Garnacha"],
  "vintage": null,
  "type": "red",
  "category": "mid",
  "shopPrices": [
    { "shopId": "laguarda", "price": 21.99, "lastChecked": "2026-06-24" }
  ],
  "criticScores": [
    { "critic": "Wine Advocate", "score": 92, "vintageReviewed": "2021" }
  ],
  "tastingNotes": "…",
  "foodPairings": ["Tapas", "Paella"],
  "drinkingWindow": "À boire dans 5 ans",
  "dealFlag": "deal",
  "curatorNotes": "…"
}
```

Valider la forme avec le schéma `data/wines.schema.json` si désiré.

## Ajouter un caviste

Éditer `data/shops.json` — la fiche apparaîtra automatiquement sur `/shops` et les vins
référençant son `shopId` afficheront le prix correspondant.

## Suivi utilisateur

Les actions de l'utilisateur (bouteille en cave, ouverte, note /20, commentaires) sont
stockées en `localStorage` sous la clé `cave-laguarda:user-cellar/v1`. Aucune transmission
serveur — c'est ton suivi, local au navigateur.

Pour migrer plus tard vers une DB :
- Remplacer `lib/useUserCellar.ts` par un client API.
- Créer `/api/cellar` (route handler) avec n'importe quel back (Supabase, PlanetScale,
  SQLite via Prisma).

## Déploiement — GitHub Pages

L'app est configurée en **export statique** (`output: 'export'`) et déployée
automatiquement sur GitHub Pages via Actions.

URL cible : `https://romainmeunier.github.io/cave-laguarda/`
(basePath = `/cave-laguarda` en prod, vide en dev).

### Setup initial (une seule fois)

1. Crée un repo `cave-laguarda` sur GitHub.
2. Push le code :
   ```bash
   git init && git add -A && git commit -m "init"
   git branch -M main
   git remote add origin git@github.com:romainmeunier/cave-laguarda.git
   git push -u origin main
   ```
3. Sur GitHub → **Settings → Pages** → Source : **GitHub Actions**.
4. Le workflow `.github/workflows/deploy.yml` se déclenche sur chaque push `main` ;
   l'URL apparaît dans **Actions → deploy job**.

### Mises à jour

Chaque push sur `main` redéploie. Pour ajouter un vin :

```bash
# édite data/wines.json (ou via la page /wines/new pour générer le snippet)
git add data/wines.json
git commit -m "+L13 Borsao Tres Picos"
git push
# ~2 min plus tard, le site est à jour
```

### Prévisualiser le build statique localement

```bash
npm run build       # produit ./out
npm run preview     # sert ./out sur http://localhost:4000
```

### Self-host alternatif

Le dossier `out/` produit par `npm run build` est un site statique pur. Tu peux le déposer
sur n'importe quel hosting (Cloudflare Pages, Netlify, S3+CloudFront, nginx, etc.).

Pour un host sans préfixe (custom domain ou user-page `<user>.github.io`), passe la
variable d'environnement pour neutraliser le basePath :

```bash
# basePath vide
sed -i '' "s|const repo = 'cave-laguarda'|const repo = ''|" next.config.js
npm run build
```

## Prochaines étapes possibles

- [ ] Ajouter La Cava, Wine House, Cellar Ecuador, Quitovino dans `shops.json`
- [ ] Pour chaque vin existant, ajouter les prix multi-shops si disponibles
- [ ] Page `/wishlist` (filtre sur localStorage)
- [ ] Export CSV de la cave personnelle
- [ ] Import depuis Vivino (CSV)
- [ ] Vraie persistence (Postgres + auth) pour partage entre devices
- [ ] Scraping automatique Rappi pour mettre à jour les prix (à respecter ToS)
