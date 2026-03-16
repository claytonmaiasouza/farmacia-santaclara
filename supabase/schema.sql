-- =============================================
-- Farmácia Santa Clara — Schema do Banco
-- Execute no SQL Editor do Supabase
-- =============================================

-- Extensões
create extension if not exists "uuid-ossp";
create extension if not exists "unaccent";

-- =============================================
-- CATEGORIAS
-- =============================================
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  parent_id   uuid references categories(id) on delete set null,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_categories_slug on categories(slug);
create index idx_categories_parent on categories(parent_id);

-- =============================================
-- MARCAS
-- =============================================
create table if not exists brands (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  logo_url   text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_brands_slug on brands(slug);

-- =============================================
-- PRODUTOS
-- =============================================
create table if not exists products (
  id                    uuid primary key default uuid_generate_v4(),
  name                  text not null,
  slug                  text not null unique,
  description           text,
  short_description     text,
  sku                   text unique,
  price                 numeric(10,2) not null check (price >= 0),
  original_price        numeric(10,2) check (original_price >= 0),
  cost_price            numeric(10,2) check (cost_price >= 0),
  stock                 integer not null default 0 check (stock >= 0),
  min_stock             integer not null default 5,
  category_id           uuid references categories(id) on delete set null,
  brand_id              uuid references brands(id) on delete set null,
  image_url             text,
  featured              boolean not null default false,
  active                boolean not null default true,
  requires_prescription boolean not null default false,
  tags                  text[] not null default '{}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_products_slug       on products(slug);
create index idx_products_category   on products(category_id);
create index idx_products_brand      on products(brand_id);
create index idx_products_featured   on products(featured) where featured = true;
create index idx_products_active     on products(active) where active = true;
create index idx_products_search     on products using gin(to_tsvector('portuguese', name || ' ' || coalesce(description, '')));

-- Atualiza updated_at automaticamente
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- =============================================
-- IMAGENS DOS PRODUTOS
-- =============================================
create table if not exists product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  alt         text,
  sort_order  integer not null default 0
);

create index idx_product_images_product on product_images(product_id);

-- =============================================
-- PERFIS DE USUÁRIO
-- =============================================
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  cpf         text unique,
  birth_date  date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- Cria perfil automaticamente ao cadastrar usuário
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =============================================
-- PEDIDOS
-- =============================================
create type order_status as enum (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete set null,
  status           order_status not null default 'pending',
  total            numeric(10,2) not null check (total >= 0),
  subtotal         numeric(10,2) not null check (subtotal >= 0),
  discount         numeric(10,2) not null default 0,
  shipping         numeric(10,2) not null default 0,
  payment_method   text,
  payment_id       text,
  shipping_address jsonb,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_orders_user   on orders(user_id);
create index idx_orders_status on orders(status);

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- =============================================
-- ITENS DO PEDIDO
-- =============================================
create table if not exists order_items (
  id             uuid primary key default uuid_generate_v4(),
  order_id       uuid not null references orders(id) on delete cascade,
  product_id     uuid references products(id) on delete set null,
  product_name   text not null,
  product_image  text,
  quantity       integer not null check (quantity > 0),
  unit_price     numeric(10,2) not null check (unit_price >= 0),
  total_price    numeric(10,2) not null check (total_price >= 0)
);

create index idx_order_items_order on order_items(order_id);

-- =============================================
-- RLS (Row Level Security)
-- =============================================

-- Produtos e categorias: leitura pública
alter table products   enable row level security;
alter table categories enable row level security;
alter table brands     enable row level security;
alter table product_images enable row level security;

create policy "Produtos visíveis publicamente"
  on products for select using (active = true);

create policy "Categorias visíveis publicamente"
  on categories for select using (active = true);

create policy "Marcas visíveis publicamente"
  on brands for select using (active = true);

create policy "Imagens visíveis publicamente"
  on product_images for select using (true);

-- Perfis: usuário vê/edita apenas o próprio
alter table profiles enable row level security;

create policy "Usuário vê próprio perfil"
  on profiles for select using (auth.uid() = id);

create policy "Usuário edita próprio perfil"
  on profiles for update using (auth.uid() = id);

-- Pedidos: usuário vê apenas os próprios
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Usuário vê próprios pedidos"
  on orders for select using (auth.uid() = user_id);

create policy "Usuário cria pedido"
  on orders for insert with check (auth.uid() = user_id);

create policy "Usuário vê itens dos próprios pedidos"
  on order_items for select
  using (order_id in (select id from orders where user_id = auth.uid()));

-- =============================================
-- DADOS INICIAIS (categorias)
-- =============================================
insert into categories (name, slug, sort_order) values
  ('Peptídeos',            'peptideos',            1),
  ('Hormônios',            'hormonios',            2),
  ('Vitaminas',            'vitaminas',            3),
  ('Suplementos',          'suplementos',          4),
  ('Insumos Hospitalares', 'insumos-hospitalares', 5)
on conflict (slug) do nothing;
