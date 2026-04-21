import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) return NextResponse.json([]);

  const pattern = `%${q}%`;

  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.image_url,
      p.price,
      b.name AS brand_name,
      c.name AS category_name
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.active = true
      AND (
        p.name        ILIKE ${pattern}
        OR b.name     ILIKE ${pattern}
        OR c.name     ILIKE ${pattern}
        OR p.slug     ILIKE ${pattern}
        OR EXISTS (
          SELECT 1 FROM unnest(p.tags) t WHERE t ILIKE ${pattern}
        )
      )
    ORDER BY
      CASE WHEN p.name ILIKE ${`${q}%`} THEN 0 ELSE 1 END,
      p.name
    LIMIT 8
  `;

  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      image_url: r.image_url,
      price: Number(r.price),
      brand: r.brand_name ?? "",
      category: r.category_name ?? "",
    }))
  );
}
