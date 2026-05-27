import sql from "@/lib/db";
import type { Order, OrderItem } from "@/types/database";
import KanbanBoard from "./KanbanBoard";

interface OrderRow extends Order {
  order_items: OrderItem[];
  customer_name?: string;
  customer_phone?: string;
}

export default async function AdminOrdersPage() {
  const orders = await sql<OrderRow[]>`
    SELECT
      o.id, o.status, o.total, o.subtotal, o.shipping, o.discount,
      o.payment_method, o.payment_id, o.shipping_address, o.notes,
      o.user_id, o.created_at, o.updated_at,
      COALESCE(o.customer_name, o.shipping_address->>'name')  AS customer_name,
      COALESCE(o.customer_phone, o.shipping_address->>'phone') AS customer_phone,
      o.customer_email,
      COALESCE(
        json_agg(oi.* ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) AS order_items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-[#1a202c]">Pedidos</h1>
      <KanbanBoard initialOrders={orders as any} />
    </div>
  );
}
