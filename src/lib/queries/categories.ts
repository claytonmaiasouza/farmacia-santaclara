import sql from "@/lib/db";
import type { Category } from "@/types/database";

export async function getCategories(): Promise<Category[]> {
  const rows = await sql`
    SELECT * FROM categories
    WHERE active = true
    ORDER BY sort_order
  `;
  return rows as unknown as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const rows = await sql`
    SELECT * FROM categories
    WHERE slug = ${slug} AND active = true
    LIMIT 1
  `;
  return (rows[0] as unknown as Category) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const rows = await sql`
    SELECT * FROM categories
    WHERE id = ${id}
    LIMIT 1
  `;
  return (rows[0] as unknown as Category) ?? null;
}

export async function getBrandBySlug(slug: string): Promise<{ id: string; name: string; slug: string; logo_url: string | null } | null> {
  const rows = await sql`
    SELECT * FROM brands
    WHERE slug = ${slug} AND active = true
    LIMIT 1
  `;
  return rows[0] as { id: string; name: string; slug: string; logo_url: string | null } ?? null;
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  const rows = await sql`
    SELECT * FROM categories
    WHERE parent_id = ${parentId} AND active = true
    ORDER BY sort_order
  `;
  return rows as unknown as Category[];
}
