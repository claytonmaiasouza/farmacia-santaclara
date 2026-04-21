-- =============================================
-- Farmácia Santa Clara — Schema PostgreSQL puro
-- Sem dependências do Supabase
-- =============================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- USUÁRIOS (substitui auth.users + profiles)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  cpf         TEXT UNIQUE,
  birth_date  DATE,
  is_admin    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- =============================================
-- CATEGORIAS
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  active      BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug   ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- =============================================
-- MARCAS
-- =============================================
CREATE TABLE IF NOT EXISTS brands (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  logo_url   TEXT,
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_brands_slug ON brands(slug);

-- =============================================
-- PRODUTOS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  description           TEXT,
  short_description     TEXT,
  sku                   TEXT UNIQUE,
  price                 NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  original_price        NUMERIC(10,2) CHECK (original_price >= 0),
  cost_price            NUMERIC(10,2) CHECK (cost_price >= 0),
  stock                 INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock             INTEGER NOT NULL DEFAULT 5,
  category_id           UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand_id              UUID REFERENCES brands(id) ON DELETE SET NULL,
  image_url             TEXT,
  featured              BOOLEAN NOT NULL DEFAULT false,
  active                BOOLEAN NOT NULL DEFAULT true,
  requires_prescription BOOLEAN NOT NULL DEFAULT false,
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug     ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand    ON products(brand_id);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_active   ON products(active) WHERE active = true;
CREATE INDEX idx_products_search   ON products USING gin(
  to_tsvector('portuguese', name || ' ' || COALESCE(description, ''))
);

-- =============================================
-- IMAGENS DOS PRODUTOS
-- =============================================
CREATE TABLE IF NOT EXISTS product_images (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =============================================
-- PEDIDOS
-- =============================================
CREATE TYPE order_status AS ENUM (
  'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
);

CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  status           order_status NOT NULL DEFAULT 'pending',
  total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  subtotal         NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  discount         NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping         NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method   TEXT,
  payment_id       TEXT,
  shipping_address JSONB,
  notes            TEXT,
  customer_name    TEXT,
  customer_phone   TEXT,
  customer_email   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- =============================================
-- ITENS DO PEDIDO
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,
  product_image TEXT,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price   NUMERIC(10,2) NOT NULL CHECK (total_price >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =============================================
-- SESSÕES DE CHAT
-- =============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  channel    TEXT NOT NULL DEFAULT 'site',
  messages   JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, channel)
);

CREATE INDEX idx_chat_sessions_session ON chat_sessions(session_id, channel);

-- =============================================
-- TRIGGERS updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- DADOS INICIAIS — Categorias
-- =============================================
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Peptídeos',            'peptideos',            1),
  ('Hormônios',            'hormonios',            2),
  ('Vitaminas',            'vitaminas',            3),
  ('Suplementos',          'suplementos',          4),
  ('Insumos Hospitalares', 'insumos-hospitalares', 5)
ON CONFLICT (slug) DO NOTHING;
