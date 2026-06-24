-- Cave Laguarda — schema
-- À copier-coller dans Supabase → SQL Editor → New query → Run

create table if not exists public.user_cellar (
  user_id uuid not null references auth.users(id) on delete cascade,
  wine_id text not null,
  bought boolean default false,
  opened boolean default false,
  personal_score numeric,
  personal_note text,
  tasted_date timestamptz,
  updated_at timestamptz default now(),
  primary key (user_id, wine_id)
);

-- Index pour les lectures par user
create index if not exists user_cellar_user_id_idx on public.user_cellar(user_id);

-- RLS : chaque utilisateur ne voit / écrit que ses propres lignes
alter table public.user_cellar enable row level security;

drop policy if exists "user_cellar_select" on public.user_cellar;
create policy "user_cellar_select" on public.user_cellar
  for select using (auth.uid() = user_id);

drop policy if exists "user_cellar_insert" on public.user_cellar;
create policy "user_cellar_insert" on public.user_cellar
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_cellar_update" on public.user_cellar;
create policy "user_cellar_update" on public.user_cellar
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_cellar_delete" on public.user_cellar;
create policy "user_cellar_delete" on public.user_cellar
  for delete using (auth.uid() = user_id);

-- Auto-update updated_at à chaque écriture
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists user_cellar_touch_updated_at on public.user_cellar;
create trigger user_cellar_touch_updated_at
  before update on public.user_cellar
  for each row execute function public.touch_updated_at();
