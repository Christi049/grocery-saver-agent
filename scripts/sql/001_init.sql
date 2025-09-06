-- initial schema: pantry, meal_plan, shopping_list, user_specifications with RLS
create extension if not exists pgcrypto;

create table if not exists pantry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_name text not null,
  quantity numeric not null default 1,
  expiry_date date,
  created_at timestamptz not null default now()
);

create table if not exists meal_plan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  week_start date not null,
  day smallint not null check (day between 0 and 6),
  meal_type text not null check (meal_type in ('breakfast','lunch','dinner')),
  dish_name text not null,
  recipe_steps text[] default '{}',
  ingredients jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists shopping_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_name text not null,
  quantity numeric not null default 1,
  purchased boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists user_specifications (
  user_id uuid primary key,
  dietary_preference text default 'None',
  allergies text[] default '{}',
  calendar_enabled boolean not null default false,
  calendar_frequency text default 'on_expiry',
  calendar_time time default '09:00',
  google_email text,
  google_calendar_id text,
  updated_at timestamptz not null default now()
);

alter table pantry enable row level security;
alter table meal_plan enable row level security;
alter table shopping_list enable row level security;
alter table user_specifications enable row level security;

create policy "pantry_read_own" on pantry for select using (auth.uid() = user_id);
create policy "pantry_write_own" on pantry for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "meal_read_own" on meal_plan for select using (auth.uid() = user_id);
create policy "meal_write_own" on meal_plan for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "shop_read_own" on shopping_list for select using (auth.uid() = user_id);
create policy "shop_write_own" on shopping_list for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "specs_read_own" on user_specifications for select using (auth.uid() = user_id);
create policy "specs_write_own" on user_specifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
