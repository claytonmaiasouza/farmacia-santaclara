-- Tabela de pedidos (compatível com src/types/database.ts)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),

  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total    numeric(10,2) not null,

  payment_method text,  -- 'whatsapp' | 'mercadopago'
  payment_id     text,
  delivery_type  text check (delivery_type in ('delivery', 'pickup')),
  customer_email text,

  shipping_address jsonb,  -- ShippingAddress | null (null para retirada)
  notes text
);

-- Itens do pedido
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid,
  product_name text not null,
  product_image text,
  quantity int not null,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

-- Índices
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);
create index if not exists order_items_order_id_idx on order_items (order_id);

-- updated_at automático
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
