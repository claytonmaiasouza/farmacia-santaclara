export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at">;
        Update: Partial<Omit<Category, "id" | "created_at">>;
      };
      brands: {
        Row: Brand;
        Insert: Omit<Brand, "id" | "created_at">;
        Update: Partial<Omit<Brand, "id" | "created_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at" | "updated_at">>;
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, "id">;
        Update: Partial<Omit<ProductImage, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Order, "id" | "created_at" | "updated_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "created_at" | "updated_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
    };
  };
};

// --- Tipos base ---

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  sku: string | null;
  price: number;
  original_price: number | null;
  cost_price: number | null;
  stock: number;
  min_stock: number;
  category_id: string | null;
  brand_id: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  requires_prescription: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  payment_method: string | null;
  payment_id: string | null;
  shipping_address: ShippingAddress | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Profile {
  id: string; // mesmo ID do auth.users
  full_name: string | null;
  phone: string | null;
  cpf: string | null;
  birth_date: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
}

// --- Tipos enriquecidos (joins) ---

export interface ProductWithRelations extends Product {
  category: Category | null;
  brand: Brand | null;
  images: ProductImage[];
}
