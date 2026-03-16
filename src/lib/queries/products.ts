import { createClient } from "@/lib/supabase/server";
import type { ProductWithRelations } from "@/types/database";

export async function getFeaturedProducts(limit = 10): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, category:categories(*), brand:brands(*), images:product_images(*)`)
    .eq("featured", true)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ProductWithRelations[];
}

export async function getNewProducts(limit = 10): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, category:categories(*), brand:brands(*), images:product_images(*)`)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ProductWithRelations[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, category:categories(*), brand:brands(*), images:product_images(*)`)
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error) return null;
  return data as ProductWithRelations;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  orderBy?: string;
  priceRange?: string; // "0-30" | "30-80" | "80-200" | "200+"
}

export async function getProductsByCategory(
  categorySlug: string,
  options: CategoryFilters = {}
): Promise<{ products: ProductWithRelations[]; total: number }> {
  const { page = 1, limit = 20, orderBy = "created_at", priceRange } = options;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { products: [], total: 0 };
  const categoryId = (category as { id: string }).id;

  let query = supabase
    .from("products")
    .select(`*, category:categories(*), brand:brands(*), images:product_images(*)`, { count: "exact" })
    .eq("category_id", categoryId)
    .eq("active", true);

  // Filtro de preço
  if (priceRange) {
    if (priceRange === "200+") {
      query = query.gte("price", 200);
    } else {
      const [min, max] = priceRange.split("-").map(Number);
      query = query.gte("price", min).lte("price", max);
    }
  }

  // Ordenação
  const ascending = orderBy === "price_asc" || orderBy === "name";
  const column = orderBy === "price_asc" || orderBy === "price_desc" ? "price" : orderBy;
  query = query.order(column, { ascending }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: data as ProductWithRelations[], total: count ?? 0 };
}

export async function searchProducts(query: string, limit = 20): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, category:categories(*), brand:brands(*), images:product_images(*)`)
    .eq("active", true)
    .textSearch("name", query, { type: "websearch", config: "portuguese" })
    .limit(limit);

  if (error) throw error;
  return data as ProductWithRelations[];
}
