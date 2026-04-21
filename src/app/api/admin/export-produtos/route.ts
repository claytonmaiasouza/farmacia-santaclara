import { NextResponse } from "next/server";
import sql from "@/lib/db";

interface ProductRow {
  name: string;
  brand_name: string | null;
  category_name: string | null;
  parent_name: string | null;
  grandparent_name: string | null;
  price: string | number;
  stock: number;
  active: boolean;
}

export async function GET() {
  const products = await sql<ProductRow[]>`
    SELECT p.name,
           b.name   AS brand_name,
           c.name   AS category_name,
           pc.name  AS parent_name,
           gpc.name AS grandparent_name,
           p.price, p.stock, p.active
    FROM products p
    LEFT JOIN brands b       ON b.id   = p.brand_id
    LEFT JOIN categories c   ON c.id   = p.category_id
    LEFT JOIN categories pc  ON pc.id  = c.parent_id
    LEFT JOIN categories gpc ON gpc.id = pc.parent_id
    ORDER BY grandparent_name NULLS LAST,
             parent_name NULLS LAST,
             category_name NULLS LAST,
             p.name
  `;

  return NextResponse.json(
    products.map((p) => ({
      name:          p.name,
      brand:         p.brand_name ?? "",
      category:      [p.grandparent_name, p.parent_name, p.category_name].filter(Boolean).join(" > ") || "Sem categoria",
      price:         Number(p.price),
      stock:         Number(p.stock),
      active:        p.active,
    }))
  );
}
