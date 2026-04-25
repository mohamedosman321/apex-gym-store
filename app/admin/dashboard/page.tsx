"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const { token, user } = useStore();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState<{ _id: string; total: number; status: string; createdAt: string; userId?: { name?: string; email?: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== "admin") { router.push("/auth/login"); return; }
    Promise.all([
      fetch("/api/products?limit=1", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([pData, oData]) => {
      const orders = oData.orders || [];
      const revenue = orders.filter((o: { status: string }) => o.status !== "cancelled").reduce((s: number, o: { total: number }) => s + o.total, 0);
      const pending = orders.filter((o: { status: string }) => o.status === "pending").length;
      setStats({ products: pData.total || 0, orders: orders.length, revenue, pending });
      setRecentOrders(orders.slice(0, 5));
    }).finally(() => setLoading(false));
  }, [token, user, router]);

  const STATUS_COLORS: Record<string, string> = { pending:"#888", processing:"#e8ff00", shipped:"#00ccff", delivered:"#00ff88", cancelled:"#ff3c3c" };

  const s = { minHeight: "100vh", background: "#0a0a0a", padding: "3rem 1.5rem" };

  const statCard = (title: string, value: string | number, color = "#f0f0f0", icon = "") => (
    <div key={title} style={{ background: "#111", border: "1px solid #2a2a2a", padding: "1.5rem" }}>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginBottom: "0.5rem" }}>{icon} {title}</p>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "2.5rem", color }}>{value}</p>
    </div>
  );

  return (
    <div style={s}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#e8ff00", marginBottom: "0.25rem" }}>ADMIN PANEL</p>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3rem", textTransform: "uppercase", color: "#f0f0f0" }}>Dashboard</h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/admin/products"><button style={{ background: "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.75rem 1.5rem", border: "none", cursor: "pointer" }}>Manage Products</button></Link>
            <Link href="/admin/orders"><button style={{ background: "transparent", color: "#f0f0f0", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.75rem 1.5rem", border: "1px solid #2a2a2a", cursor: "pointer" }}>Manage Orders</button></Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1px", background: "#2a2a2a", marginBottom: "3rem" }}>
          {loading ? [1,2,3,4].map(i => <div key={i} style={{ background:"#111", padding:"1.5rem", height:"100px" }} />) : [
            statCard("Total Products", stats.products, "#f0f0f0", "📦"),
            statCard("Total Orders", stats.orders, "#f0f0f0", "🛍"),
            statCard("Revenue", `EGP ${stats.revenue}`, "#e8ff00", "💰"),
            statCard("Pending Orders", stats.pending, stats.pending > 0 ? "#ff3c3c" : "#f0f0f0", "⏳"),
          ]}
        </div>

        {/* Recent Orders */}
        <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.5rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "1rem" }}>Recent Orders</h2>
        <div style={{ background: "#111", border: "1px solid #2a2a2a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: "1rem", padding: "0.875rem 1.5rem", borderBottom: "1px solid #2a2a2a", background: "#0d0d0d" }}>
            {["Order ID", "Customer", "Total", "Status"].map(h => (
              <span key={h} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888" }}>{h}</span>
            ))}
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: "2rem 1.5rem", color: "#555", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "0.85rem" }}>No orders yet</div>
          ) : recentOrders.map((o, i) => (
            <div key={o._id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto", gap: "1rem", padding: "1rem 1.5rem", alignItems: "center", borderBottom: i < recentOrders.length - 1 ? "1px solid #1a1a1a" : "none" }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.8rem", color: "#888" }}>#{o._id.slice(-8).toUpperCase()}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem", color: "#ccc" }}>{o.userId?.name || o.userId?.email || "—"}</span>
              <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>EGP {o.total.toLocaleString()}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: STATUS_COLORS[o.status] || "#888", border: `1px solid ${STATUS_COLORS[o.status]}30`, padding: "0.2rem 0.5rem" }}>{o.status}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", marginTop: "0.75rem" }}>
          <Link href="/admin/orders" style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>View All Orders →</Link>
        </div>
      </div>
    </div>
  );
}
