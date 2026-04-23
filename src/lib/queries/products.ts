import sql from "@/lib/db";
import type { ProductWithRelations } from "@/types/database";

const PRODUCT_SELECT = sql`
  p.*,
  row_to_json(c.*) AS category,
  row_to_json(b.*) AS brand,
  COALESCE(
    json_agg(pi.* ORDER BY pi.sort_order) FILTER (WHERE pi.id IS NOT NULL),
    '[]'
  ) AS images
`;

const BASE_FROM = sql`
  FROM products p
  LEFT JOIN categories c  ON c.id  = p.category_id
  LEFT JOIN brands b      ON b.id  = p.brand_id
  LEFT JOIN product_images pi ON pi.product_id = p.id
`;

function buildPriceFilter(priceRange?: string) {
  if (!priceRange) return sql``;
  if (priceRange === "200+") return sql`AND p.price >= 200`;
  const [min, max] = priceRange.split("-").map(Number);
  return sql`AND p.price >= ${min} AND p.price <= ${max}`;
}

function buildOrderBy(orderBy: string) {
  if (orderBy === "price_asc")  return sql`ORDER BY p.price ASC`;
  if (orderBy === "price_desc") return sql`ORDER BY p.price DESC`;
  if (orderBy === "name")       return sql`ORDER BY p.name ASC`;
  return sql`ORDER BY p.created_at DESC`;
}

export async function getFeaturedProducts(limit = 10): Promise<ProductWithRelations[]> {
  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    WHERE p.featured = true AND p.active = true
    GROUP BY p.id, c.id, b.id
    ORDER BY p.created_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as ProductWithRelations[];
}

export async function getNewProducts(limit = 10): Promise<ProductWithRelations[]> {
  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    WHERE p.active = true
    GROUP BY p.id, c.id, b.id
    ORDER BY p.created_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as ProductWithRelations[];
}

export async function getPromoProducts(limit = 5): Promise<ProductWithRelations[]> {
  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    WHERE p.active = true AND p.image_url IS NOT NULL AND p.image_url != ''
    GROUP BY p.id, c.id, b.id
    ORDER BY p.price DESC
    LIMIT ${limit}
  `;
  return rows as unknown as ProductWithRelations[];
}

export async function getBestsellerProducts(limit = 5): Promise<ProductWithRelations[]> {
  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    WHERE p.active = true AND p.image_url IS NOT NULL AND p.image_url != ''
    GROUP BY p.id, c.id, b.id
    ORDER BY p.price DESC
    LIMIT ${limit} OFFSET ${limit}
  `;
  return rows as unknown as ProductWithRelations[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    WHERE p.slug = ${slug} AND p.active = true
    GROUP BY p.id, c.id, b.id
    LIMIT 1
  `;
  return (rows[0] as unknown as ProductWithRelations) ?? null;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  orderBy?: string;
  priceRange?: string;
}

export async function getProductsByCategory(
  categorySlug: string,
  options: CategoryFilters = {}
): Promise<{ products: ProductWithRelations[]; total: number }> {
  const { page = 1, limit = 20, orderBy = "created_at", priceRange } = options;
  const offset = (page - 1) * limit;
  const priceFilter = buildPriceFilter(priceRange);
  const order = buildOrderBy(orderBy);

  const catRows = await sql`SELECT id FROM categories WHERE slug = ${categorySlug} LIMIT 1`;
  if (!catRows[0]) return { products: [], total: 0 };
  const categoryId = catRows[0].id;

  // Include products from child categories (one level deep)
  const [countRow] = await sql`
    SELECT COUNT(*) AS total
    FROM products p
    WHERE p.active = true
      AND (
        p.category_id = ${categoryId}
        OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ${categoryId})
      )
    ${priceFilter}
  `;

  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    WHERE p.active = true
      AND (
        p.category_id = ${categoryId}
        OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ${categoryId})
      )
    ${priceFilter}
    GROUP BY p.id, c.id, b.id
    ${order}
    LIMIT ${limit} OFFSET ${offset}
  `;

  return {
    products: rows as unknown as ProductWithRelations[],
    total: Number(countRow.total),
  };
}

export async function getProductsByBrand(
  brandSlug: string,
  options: CategoryFilters = {}
): Promise<{ products: ProductWithRelations[]; total: number }> {
  const { page = 1, limit = 20, orderBy = "created_at", priceRange } = options;
  const offset = (page - 1) * limit;
  const priceFilter = buildPriceFilter(priceRange);
  const order = buildOrderBy(orderBy);

  const brandRows = await sql`SELECT id FROM brands WHERE slug = ${brandSlug} LIMIT 1`;
  if (!brandRows[0]) return { products: [], total: 0 };
  const brandId = brandRows[0].id;

  const [countRow] = await sql`
    SELECT COUNT(*) AS total
    FROM products p
    WHERE p.brand_id = ${brandId} AND p.active = true
    ${priceFilter}
  `;

  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    WHERE p.brand_id = ${brandId} AND p.active = true
    ${priceFilter}
    GROUP BY p.id, c.id, b.id
    ${order}
    LIMIT ${limit} OFFSET ${offset}
  `;

  return {
    products: rows as unknown as ProductWithRelations[],
    total: Number(countRow.total),
  };
}

export async function searchProducts(query: string, limit = 20): Promise<ProductWithRelations[]> {
  const pattern = `%${query}%`;
  const rows = await sql`
    SELECT ${PRODUCT_SELECT}
    ${BASE_FROM}
    LEFT JOIN brands bsearch ON bsearch.id = p.brand_id
    WHERE p.active = true
      AND (
        p.name        ILIKE ${pattern}
        OR bsearch.name ILIKE ${pattern}
        OR p.slug     ILIKE ${pattern}
        OR p.short_description ILIKE ${pattern}
        OR EXISTS (SELECT 1 FROM unnest(p.tags) t WHERE t ILIKE ${pattern})
      )
    GROUP BY p.id, c.id, b.id
    ORDER BY
      CASE WHEN p.name ILIKE ${`${query}%`} THEN 0 ELSE 1 END,
      p.created_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as ProductWithRelations[];
}
