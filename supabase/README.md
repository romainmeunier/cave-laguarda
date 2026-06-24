# Supabase

Migrations base de données pour Cave Laguarda.

## Structure

- `migrations/` — fichiers SQL versionnés, nommés `<YYYYMMDDHHMMSS>_<name>.sql`.
  Ordre d'application = ordre lexicographique des noms.
- `config.toml` — config CLI Supabase.

## GitHub integration

L'intégration Supabase ↔ GitHub (Dashboard → Integrations → GitHub) détecte ce dossier
et applique automatiquement les nouvelles migrations à chaque push sur la branche
configurée (par défaut `main`).

### Pour activer (une fois) :

1. Dashboard Supabase → **Integrations** (icône puzzle dans la sidebar) → **GitHub**
2. Authoriser l'app GitHub Supabase si pas déjà fait
3. **Connect repository** → `romainmeunier/cave-laguarda`
4. **Production branch** : `main`
5. **Supabase directory** : `supabase` (défaut)
6. Save — la première sync va lister les migrations détectées et les appliquer.

Les pushs suivants qui ajoutent des fichiers dans `supabase/migrations/` lancent
automatiquement un job Supabase qui applique les nouvelles migrations.

## Ajouter une migration

```bash
# Génère un fichier daté (date du jour + HHMMSS)
ts=$(date -u +%Y%m%d%H%M%S)
touch supabase/migrations/${ts}_ma_migration.sql
# Édite, commit, push — Supabase applique.
```

## Sans la GitHub integration (manuel)

Si tu préfères appliquer à la main : copier le contenu d'un fichier dans
**SQL Editor → New query → Run** sur Supabase Dashboard.
