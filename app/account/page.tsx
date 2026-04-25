"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface Order {
  _id: string;
  items: { name: string; size: string; quantity: number; price: number; image: string }[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: { fullName: string; address: string; city: string; country: string };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#888", processing: "#e8ff00", shipped: "#00ccff", delivered: "#00ff88", cancelled: "#ff3c3c",
};

function AccountContent() {
  const { token, user, clearAuth } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const justOrdered = searchParams.get("ordered") === "1";

  useEffect(() => {
    if (!token) { router.push("/auth/login"); return; }
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [token, router]);

  const s = { minHeight: "100vh", background: "#0a0a0a", padding: "3rem 1.5rem" };

  return (
    <div style={s}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {justOrdered && (
          <div style={{ background: "#00ff8815", border: "1px solid #00ff8830", padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.25rem" }}>✅</span>
            <div>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", color: "#00ff88" }}>Order Placed Successfully!</p>
              <p style={{ color: "#aaa", fontSize: "0.85rem" }}>Your order is now being processed.</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3rem", textTransform: "uppercase", color: "#f0f0f0" }}>My Account</h1>
            <p style={{ color: "#888", marginTop: "0.25rem" }}>{user?.email}</p>
          </div>
          <button onClick={() => { clearAuth(); router.push("/"); }}
            style={{ background: "transparent", color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", border: "1px solid #ff3c3c30", padding: "0.5rem 1.25rem", cursor: "pointer" }}>
            Logout
          </button>
        </div>

        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.5rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "1.5rem" }}>
          Order History <span style={{ color: "#e8ff00" }}>[{orders.length}]</span>
        </h2>

        {loading ? (
          <div style={{ color: "#888", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ background: "#111", border: "1px solid #2a2a2a", padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>You haven&apos;t placed any orders yet.</p>
            <Link href="/shop"><button style={{ background: "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.75rem 2rem", border: "none", cursor: "pointer" }}>Start Shopping</button></Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: "#111", border: "1px solid #2a2a2a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: "1px solid #2a2a2a", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#555" }}>ORDER </span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.8rem", color: "#888" }}>#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: STATUS_COLORS[order.status] || "#888", border: `1px solid ${STATUS_COLORS[order.status]}30`, padding: "0.2rem 0.6rem" }}>{order.status}</span>
                    <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>EGP {order.total.toLocaleString()}</span>
                    <span style={{ color: "#555", fontSize: "0.8rem" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ padding: "1rem 1.5rem" }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0", borderBottom: i < order.items.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                      <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", color: "#ccc" }}>{item.name} <span style={{ color: "#555" }}>/ {item.size} × {item.quantity}</span></span>
                      <span style={{ color: "#aaa", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem" }}>EGP {Math.round((item.price * item.quantity)).toLocaleString()}</span>
                    </div>
                  ))}
                  {order.shippingAddress && (
                    <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.75rem" }}>📍 {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return <Suspense><AccountContent /></Suspense>;
}
