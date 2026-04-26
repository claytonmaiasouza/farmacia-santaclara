import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { Order, OrderItem } from "@/types/database";
import OrderStatusBadge from "./OrderStatusBadge";


interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const orders = await sql<OrderWithItems[]>`
    SELECT
      o.*,
      COALESCE(
        json_agg(oi.* ORDER BY oi.id) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) AS order_items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ${session.user.id}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#1a202c]">Meus pedidos</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center">
          <ShoppingBag size={48} className="text-[#e2e8f0] mx-auto mb-4" />
          <p className="text-[#718096]">Você ainda não fez nenhum pedido.</p>
          <Link href="/" className="text-[#2B7DD4] text-sm mt-3 inline-block hover:underline">
            Começar a comprar
          </Link>
        </div>
      ) : (
        orders.map((order) => {
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#e2e8f0]">
                <div>
                  <p className="text-sm font-bold text-[#1a202c]">
                    Pedido #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#718096] mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
                <OrderStatusBadge orderId={order.id} initialStatus={order.status} />
              </div>

              <div className="flex flex-col gap-2 mb-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#1a202c]">
                      {item.product_name}
                      <span className="text-[#718096] ml-1">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-[#1a202c]">
                      R$ {Number(item.total_price).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#e2e8f0]">
                <div className="text-xs text-[#718096]">
                  Frete:{" "}
                  <span className={Number(order.shipping) === 0 ? "text-[#6DC040] font-medium" : ""}>
                    {Number(order.shipping) === 0 ? "Grátis" : `R$ ${Number(order.shipping).toFixed(2).replace(".", ",")}`}
                  </span>
                </div>
                <div className="text-base font-bold text-[#1A5C2A]">
                  Total: R$ {Number(order.total).toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
