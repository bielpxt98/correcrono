-- ============================================================
-- Sistema de Inscrições para Corrida (1 organizador / fácil de editar)
-- Cole e execute no SQL Editor do Supabase (pode rodar de novo)
-- ============================================================

create extension if not exists "pgcrypto";

-- Evento da corrida
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  regulations text not null default '',
  event_date date not null,
  start_time text not null default '07:00',
  location text not null default '',
  city text not null default '',
  price_cents integer not null default 0,
  max_slots integer not null default 500,
  registration_open boolean not null default true,
  cover_image_url text,
  categories jsonb not null default '["5K","10K"]'::jsonb,
  shirt_sizes jsonb not null default '["PP","P","M","G","GG","XG"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Colunas extras se a tabela já existia (idempotente)
alter table public.events add column if not exists regulations text not null default '';
alter table public.events add column if not exists start_time text not null default '07:00';
alter table public.events add column if not exists city text not null default '';
alter table public.events add column if not exists cover_image_url text;
alter table public.events add column if not exists categories jsonb not null default '["5K","10K"]'::jsonb;
alter table public.events add column if not exists shirt_sizes jsonb not null default '["PP","P","M","G","GG","XG"]'::jsonb;
alter table public.events add column if not exists updated_at timestamptz not null default now();

-- Recebimento de pagamento (cadastro pelo organizador no admin)
alter table public.events add column if not exists payment_mode text not null default 'manual_pix';
alter table public.events add column if not exists accept_pix boolean not null default true;
alter table public.events add column if not exists accept_card boolean not null default true;
alter table public.events add column if not exists mp_access_token text;
alter table public.events add column if not exists pix_key text;
alter table public.events add column if not exists pix_key_type text;
alter table public.events add column if not exists receiver_name text;
alter table public.events add column if not exists help_whatsapp text;
alter table public.events add column if not exists payment_notes text;

-- Galeria de imagens do evento
create table if not exists public.event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  url text not null,
  storage_path text not null,
  caption text not null default '',
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists event_images_event_id_idx on public.event_images(event_id);
create index if not exists event_images_sort_idx on public.event_images(event_id, sort_order);

-- Inscrições
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  cpf text not null,
  birth_date date,
  phone text not null,
  email text not null,
  shirt_size text not null default 'M',
  category text not null default 'Geral',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  payment_id text,
  payment_method text,
  amount_cents integer not null default 0,
  created_at timestamptz not null default now(),
  unique (event_id, cpf)
);

create index if not exists registrations_event_id_idx on public.registrations(event_id);
create index if not exists registrations_status_idx on public.registrations(status);
create index if not exists registrations_cpf_idx on public.registrations(cpf);
create index if not exists registrations_full_name_idx on public.registrations(full_name);

-- RLS
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.event_images enable row level security;

drop policy if exists "public read events" on public.events;
create policy "public read events"
  on public.events for select
  using (true);

drop policy if exists "public read event_images" on public.event_images;
create policy "public read event_images"
  on public.event_images for select
  using (true);

-- Storage: bucket público de fotos do evento
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-photos',
  'event-photos',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read event photos" on storage.objects;
create policy "public read event photos"
  on storage.objects for select
  using (bucket_id = 'event-photos');

-- Upload/delete só via service_role (backend) — sem policy de insert para anon

-- Evento de exemplo (só se a tabela estiver vazia)
insert into public.events (
  name, description, regulations, event_date, start_time, location, city,
  price_cents, max_slots, registration_open, categories, shirt_sizes
)
select
  'Corrida Exemplo 2026',
  'Corrida de rua com kit completo (camiseta + número de peito). Garanta sua vaga agora!',
  'Idade mínima 16 anos. Uso de fone de ouvido sob responsabilidade do atleta. Inscrição pessoal e intransferível.',
  '2026-09-20',
  '07:00',
  'Parque da Cidade — portão principal',
  'Sua Cidade',
  8000,
  500,
  true,
  '["5K","10K","Caminhada"]'::jsonb,
  '["PP","P","M","G","GG","XG"]'::jsonb
where not exists (select 1 from public.events limit 1);
