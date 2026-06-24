# Maison Meunier — Notes pour Claude

App perso de Romain : suivi de **cave + bar + cocktails** à Quito / Cumbayá, Équateur.
Static Next.js déployé sur GitHub Pages.

Le repo s'appelle toujours `cave-laguarda` (l'URL reste `romainmeunier.github.io/cave-laguarda/`),
mais la marque affichée est **Maison Meunier** depuis qu'on a fusionné le suivi cocktails
de Bar Romain.

## Qui est l'utilisateur

- Romain Meunier — Français vivant à Cumbayá (banlieue de Quito), SRE Thales.
- Amateur de vin, connaît bien les classiques français, ouvert aux découvertes.
- Pas de cavistes premium à proximité → utilise Laguarda (laguarda.com.ec), commande
  parfois en magasin physique car Rappi/UberEats n'affichent pas toujours les millésimes.
- Curatera/ajoute des vins de **plusieurs cavistes** au fil du temps (Laguarda d'abord,
  La Cava, Wine House, Cellar Ecuador, Quitovino prévus).

## Domaines couverts

| Domaine | Fichier data | Routes | Suivi user |
|---|---|---|---|
| Vins (cave) | `data/wines.json` (12 vins, L01..L12) | `/`, `/wines/[id]` | Supabase `user_cellar` |
| Bar (bouteilles, sirops, frais) | `data/bar.json` (38 items, B01..B38) | `/bar` | (à venir) `user_bar` |
| Cocktails (recettes) | `data/recipes.json` (24 recettes, R01..R24) | `/cocktails`, `/cocktails/[id]` | (à venir) `user_recipes` |
| Cavistes | `data/shops.json` | `/shops` | — |

Chaque ingrédient de recette pointe optionnellement vers `bottleRef` (id de `bar.json`).
Quand `bottleRef` est absent, c'est un ingrédient frais hors inventaire (œuf, café, eau gazeuse).

## Tâche par défaut

Quand Romain te demande quelque chose ici, par défaut c'est l'une de ces tâches :

1. **Ajouter un vin** au catalogue (`data/wines.json`).
   - Croiser systématiquement les notes critiques **Parker (Wine Advocate)**, **James
     Suckling**, **Wine Spectator**, **Decanter**, **Vinous**, **Tim Atkin** avant
     d'inclure une bouteille. Si aucune note pro vérifiable n'existe, **dire le explicitement**
     et proposer une substitution. Pas de bullshit marketing — ne pas reprendre les
     prétentions des sites distributeurs comme s'ils étaient pairs.
   - Vérifier le **prix Laguarda** sur les sources : `laguarda.com.ec/vinos/tinto`,
     `rappi.com.ec/tiendas/367-laguarda-quito` (catalogue le plus complet, store Quito) et
     `rappi.com.ec/tiendas/25488-laguarda` (catalogue Cumbayá partiel — UberEats bloque
     le scraping en 403).
   - Pour le rapport qualité/prix : comparer si possible avec un prix international
     (Wine-Searcher, Wine.com, retailers US/EU) pour repérer surprix vs vraie affaire.

2. **Trouver des affaires** dans le catalogue Laguarda (ou autre caviste à intégrer) :
   notes pro ≥ 90 sous certain seuil de prix, promos crédibles, pépites peu connues.
   Mettre à jour le `dealFlag` des fiches existantes au besoin.

3. **Étendre le multi-source** : ajouter un caviste dans `data/shops.json`, puis
   compléter les `shopPrices[]` des vins existants si dispo chez plusieurs caviste.

4. **Itérer l'UI** quand Romain identifie un problème de lisibilité ou un besoin.

5. **Ajouter une bouteille au bar** dans `data/bar.json` (préfixe d'ID `B`, catégories
   `spiritueux | liqueurs | sirops | bitters | frais | divers`).

6. **Ajouter une recette de cocktail** dans `data/recipes.json` (préfixe d'ID `R`,
   spirit dominant, ingrédients avec `bottleRef` pointant vers `bar.json` quand possible).

## Stack

- **Next.js 14 App Router** en TypeScript strict.
- **Tailwind v3** + `@tailwindcss/typography`.
- **Static export** (`output: 'export'` dans `next.config.js`) → GitHub Pages.
  - `basePath: '/cave-laguarda'` activé en prod, vide en dev.
  - `trailingSlash: true` indispensable pour servir `/wines/L01/index.html`.
- Fontes : **Fraunces** (display, axe SOFT), **Inter Tight** (corps), **JetBrains Mono**
  (chiffres). Cf. `app/layout.tsx`.
- Palette : **burgundy `#5b1d1d`**, **crème `#fdfaf4`**, **or `#b8935c`**. Voir
  `tailwind.config.ts` et CSS variables dans `app/globals.css`.
- Esthétique : **éditorial wine-magazine**, pas SaaS générique. Paper grain en
  background, drop cap éditorial, score-mono pour les notes critiques (tabular nums,
  letter-spacing serré). Quand tu ajoutes des composants, garde cette identité.

## Structure & conventions

- `data/wines.json` : tableau `wines[]` avec IDs `L01..LNN`. **Toujours respecter
  `data/wines.schema.json`** (JSON Schema validatif). Liste des champs requis :
  `id, name, producer, country, region, varietals, type, category, shopPrices, dealFlag`.
- `data/shops.json` : tableau `shops[]`. Un vin référence un caviste via
  `shopPrices[].shopId === shops[].id`.
- `app/wines/[id]/page.tsx` exporte `generateStaticParams` — chaque vin dans
  `wines.json` devient une route prérendue.
- L'état utilisateur (en cave, ouverte, note /20, dégustation) vit en **localStorage**
  via `lib/useUserCellar.ts` (clé `cave-laguarda:user-cellar/v1`). Pas de DB.
- Composants client minoritaires : `'use client'` uniquement quand un composant a
  besoin de hooks (filtres, formulaire, suivi user, stats agrégées). Le reste en RSC.

## Workflow d'édition typique

1. Édite `data/wines.json` (et/ou `data/shops.json`).
2. `npm run dev` ou `npm run build` pour vérifier.
3. Commit + push sur `main` → GitHub Actions redéploie sur
   `https://romainmeunier.github.io/cave-laguarda/` en ~2 min.

## Commandes utiles

```bash
npm run dev          # serveur dev sur :3000 (sans basePath)
npm run build        # build statique → out/
npm run preview      # serve out/ sur :4000 (reproduit prod)
npm run typecheck    # tsc --noEmit
```

## Bouteille étalon dans la sélection actuelle

- **L09 Carmin de Peumo Carménère 2019** = **la pioche** confirmée (WA 95 Luis Gutiérrez,
  JS 96, promo -51% chez Laguarda). Marquée `isHeadliner: true`. C'est la référence à
  laquelle comparer tout candidat à devenir headliner.
- **L11 Banfi Brunello 2019** = vin de garde (WS 94 Sanderson, millésime 2019 noté WS 98).
  Exiger ce millésime spécifique en magasin.

## Pièges à éviter

- **Trumpeter Malbec** chez Laguarda = c'est le **rosé**, pas un rouge. Erreur faite à
  l'itération précédente, ne pas refaire.
- **Côtes du Rhône "Reserva"** : SKU générique sans pedigree. Refuser de l'inclure
  comme "quotidien à pedigree".
- **Promos affichées sur Rappi** (-41%, -51%) : vérifier la crédibilité, certaines
  reposent sur des prix de référence gonflés. Les notes Parker/Suckling justifient
  l'inclusion, pas la promo seule.
- **G.D. Vajra Albe Barolo à 99$ chez Laguarda** : ~2x prix US. Surprix net, ne pas
  promouvoir comme affaire.

## Style de réponse pour Romain

- Français, direct, pas de fioritures.
- Tableaux markdown pour les comparaisons.
- Toujours citer la source des notes critiques (URL ou critique nommé).
- Si une info n'est pas vérifiée → le dire (`pedigree producteur` vs `note pro vérifiée`
  sont deux choses différentes).
- Quand on touche au code de l'app, expliquer brièvement ce qui change visuellement +
  où ça vit dans l'arbo.
