-- Maison Meunier — phase 2 : suivi perso bar + recettes
-- À appliquer automatiquement via l'intégration GitHub Supabase.

-- ── user_bar ───────────────────────────────────────────
-- Une ligne par utilisateur × bouteille du bar (B01..). Override du
-- defaultStatus défini dans data/bar.json + note perso libre.

create table if not exists public.user_bar (
  user_id uuid not null references auth.users(id) on delete cascade,
  bottle_id text not null,
  status text check (status in ('ok', 'low', 'out')),
  personal_note text,
  updated_at timestamptz default now(),
  primary key (user_id, bottle_id)
);

create index if not exists user_bar_user_id_idx on public.user_bar(user_id);

alter table public.user_bar enable row level security;

drop policy if exists "user_bar_select" on public.user_bar;
create policy "user_bar_select" on public.user_bar
  for select using (auth.uid() = user_id);

drop policy if exists "user_bar_insert" on public.user_bar;
create policy "user_bar_insert" on public.user_bar
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_bar_update" on public.user_bar;
create policy "user_bar_update" on public.user_bar
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_bar_delete" on public.user_bar;
create policy "user_bar_delete" on public.user_bar
  for delete using (auth.uid() = user_id);

drop trigger if exists user_bar_touch_updated_at on public.user_bar;
create trigger user_bar_touch_updated_at
  before update on public.user_bar
  for each row execute function public.touch_updated_at();

-- ── user_recipes ───────────────────────────────────────
-- Une ligne par utilisateur × recette (R01..). Override du defaultStatus,
-- score perso /20, journal des versions (JSONB).

create table if not exists public.user_recipes (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id text not null,
  status text check (status in ('À tester', 'En cours', 'Validé', 'Classique maison', 'Abandonné')),
  personal_score numeric,
  versions jsonb default '[]'::jsonb,
  updated_at timestamptz default now(),
  primary key (user_id, recipe_id)
);

create index if not exists user_recipes_user_id_idx on public.user_recipes(user_id);

alter table public.user_recipes enable row level security;

drop policy if exists "user_recipes_select" on public.user_recipes;
create policy "user_recipes_select" on public.user_recipes
  for select using (auth.uid() = user_id);

drop policy if exists "user_recipes_insert" on public.user_recipes;
create policy "user_recipes_insert" on public.user_recipes
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_recipes_update" on public.user_recipes;
create policy "user_recipes_update" on public.user_recipes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_recipes_delete" on public.user_recipes;
create policy "user_recipes_delete" on public.user_recipes
  for delete using (auth.uid() = user_id);

drop trigger if exists user_recipes_touch_updated_at on public.user_recipes;
create trigger user_recipes_touch_updated_at
  before update on public.user_recipes
  for each row execute function public.touch_updated_at();
