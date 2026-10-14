-- =========================================================================
-- SUPABASE DATABASE SCHEMA FOR ICHHAPORE-BHATHA BHANDARI PANCH
-- Copy & Run this SQL in your Supabase Project: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. Create Households Table
create table if not exists public.households (
  id text primary key,
  house_number text,
  street text,
  ward text,
  ration_card_number text,
  head_of_household_id text,
  annual_income text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Villagers Table
create table if not exists public.villagers (
  id text primary key,
  name text not null,
  dob text,
  gender text,
  phone text,
  blood_group text,
  occupation text,
  education text,
  household_id text,
  relationship text,
  health_data jsonb default '{"vaccinations": [], "conditions": ""}'::jsonb,
  ongoing_education jsonb default '{"isEnrolled": false, "course": "", "institution": "", "yearOfStudy": ""}'::jsonb,
  achievements jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Village Metadata Table (Single record with id = 'default')
create table if not exists public.village_meta (
  id text primary key default 'default',
  village_name text not null default 'Ichhapore-Bhatha Bhandari Panch',
  block text default 'Choryasi',
  district text default 'Surat',
  state text default 'Gujarat',
  pincode text default '394510',
  address text default '5PVX+G44, RJD Integrated Textile Park, Limla, Gujarat 394510',
  pramukh text default 'Rameshbhai Bhandari',
  up_pramukh text default 'Dineshbhai Bhandari',
  mantri text default 'Sureshbhai Bhandari',
  treasurer text default 'Pravinbhai Bhandari',
  panchayat_office_phone text default '+91 261 2861200',
  email text default 'office@ichhaporebhathapanch.org',
  map_url text default 'https://www.google.com/maps?q=21.193250,72.747722',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Helpful Performance Indexes
create index if not exists idx_villagers_household_id on public.villagers(household_id);
create index if not exists idx_villagers_blood_group on public.villagers(blood_group);
create index if not exists idx_villagers_occupation on public.villagers(occupation);
create index if not exists idx_households_head_id on public.households(head_of_household_id);

-- 5. Enable Row Level Security (RLS)
alter table public.households enable row level security;
alter table public.villagers enable row level security;
alter table public.village_meta enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public read on households" on public.households;
drop policy if exists "Allow write on households" on public.households;
drop policy if exists "Allow update on households" on public.households;
drop policy if exists "Allow delete on households" on public.households;

drop policy if exists "Allow public read on villagers" on public.villagers;
drop policy if exists "Allow write on villagers" on public.villagers;
drop policy if exists "Allow update on villagers" on public.villagers;
drop policy if exists "Allow delete on villagers" on public.villagers;

drop policy if exists "Allow public read on village_meta" on public.village_meta;
drop policy if exists "Allow write on village_meta" on public.village_meta;
drop policy if exists "Allow update on village_meta" on public.village_meta;

-- Public / Anonymous Access Policies for Web Application
create policy "Allow public read on households" on public.households for select using (true);
create policy "Allow write on households" on public.households for insert with check (true);
create policy "Allow update on households" on public.households for update using (true);
create policy "Allow delete on households" on public.households for delete using (true);

create policy "Allow public read on villagers" on public.villagers for select using (true);
create policy "Allow write on villagers" on public.villagers for insert with check (true);
create policy "Allow update on villagers" on public.villagers for update using (true);
create policy "Allow delete on villagers" on public.villagers for delete using (true);

create policy "Allow public read on village_meta" on public.village_meta for select using (true);
create policy "Allow write on village_meta" on public.village_meta for insert with check (true);
create policy "Allow update on village_meta" on public.village_meta for update using (true);

-- 6. Enable Realtime Publications (Enables live WebSocket updates)
alter publication supabase_realtime add table public.villagers;
alter publication supabase_realtime add table public.households;
alter publication supabase_realtime add table public.village_meta;

-- 7. Seed Initial Metadata Record if not present
insert into public.village_meta (
  id,
  village_name,
  block,
  district,
  state,
  pincode,
  address,
  pramukh,
  up_pramukh,
  mantri,
  treasurer,
  panchayat_office_phone,
  email,
  map_url
) values (
  'default',
  'Ichhapore-Bhatha Bhandari Panch',
  'Choryasi',
  'Surat',
  'Gujarat',
  '394510',
  '5PVX+G44, RJD Integrated Textile Park, Limla, Gujarat 394510',
  'Rameshbhai Bhandari',
  'Dineshbhai Bhandari',
  'Sureshbhai Bhandari',
  'Pravinbhai Bhandari',
  '+91 261 2861200',
  'office@ichhaporebhathapanch.org',
  'https://www.google.com/maps?q=21.193250,72.747722'
) on conflict (id) do nothing;
