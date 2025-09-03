-- Users are managed by Supabase Auth
-- Pantry items per user
create table if not exists pantry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity numeric not null default 0,
  expiry_date date,
  created_at timestamptz default now()
);

-- Weekly meal plan entries
create table if not exists meal_plan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  day text not null check (day in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  meal text not null check (meal in ('Breakfast','Lunch','Dinner')),
  dish_name text not null,
  created_at timestamptz default now()
);

-- Shopping list items missing from pantry
create table if not exists shopping_list (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity text not null,
  purchased boolean not null default false,
  created_at timestamptz default now()
);

-- User dietary preferences and allergies
create table if not exists user_specifications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dietary_preference text default 'None',
  allergies text[] default '{}',
  calendar_enabled boolean default false,
  calendar_frequency text default 'On expiry day',
  calendar_time text default '09:00'
);

-- RLS
alter table pantry enable row level security;
alter table meal_plan enable row level security;
alter table shopping_list enable row level security;
alter table user_specifications enable row level security;

create policy "pantry_user_isolation" on pantry for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meal_plan_user_isolation" on meal_plan for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "shopping_list_user_isolation" on shopping_list for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_spec_user_isolation" on user_specifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
