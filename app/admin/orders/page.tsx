"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  userId?: { name?: string; email?: string };
  items: { name: string; quantity: number; size: string; price: number }[];
  shippingAddress?: { fullName: string; address: string; city: string; country: string };
}

const STATUSES = ["pending","processing","shipped","delivered","cancelled"];
const STATUS_COLORS: Record<string, string> = { pending:"#888", processing:"#e8ff00", shipped:"#00ccff", delivered:"#00ff88", cancelled:"#ff3c3c" };

export default function AdminOrders() {
  const { token, user } = useStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "admin") { router.push("/auth/login"); return; }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    setUpdating(null);
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3rem", textTransform: "uppercase", color: "#f0f0f0" }}>
            Orders <span style={{ color: "#e8ff00" }}>[{filtered.length}]</span>
          </h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["", ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.45rem 0.9rem", border: `1px solid ${filter === s ? "#e8ff00" : "#2a2a2a"}`, background: filter === s ? "#e8ff00" : "transparent", color: filter === s ? "#000" : "#888", cursor: "pointer" }}>
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#111", border: "1px solid #2a2a2a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto auto", gap: "1rem", padding: "0.875rem 1.5rem", borderBottom: "1px solid #2a2a2a", background: "#0d0d0d" }}>
            {["ORDER / DATE","CUSTOMER","TOTAL","STATUS","UPDATE"].map(h => (
              <span key={h} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888" }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "2rem 1.5rem", color: "#555", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "0.85rem" }}>Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "2rem 1.5rem", color: "#555", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", fontSize: "0.85rem" }}>No orders found</div>
          ) : filtered.map((o, i) => (
            <div key={o._id}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto auto", gap: "1rem", padding: "1rem 1.5rem", alignItems: "center", borderBottom: "1px solid #1a1a1a", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                <div>
                  <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#888" }}>#{o._id.slice(-8).toUpperCase()}</p>
                  <p style={{ color: "#555", fontSize: "0.75rem" }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#ccc", textTransform: "uppercase" }}>{o.userId?.name || "—"}</p>
                  <p style={{ color: "#555", fontSize: "0.75rem" }}>{o.userId?.email || ""}</p>
                </div>
                <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>EGP {o.total.toLocaleString()}</span>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: STATUS_COLORS[o.status] || "#888", border: `1px solid ${STATUS_COLORS[o.status]}30`, padding: "0.2rem 0.5rem", whiteSpace: "nowrap" }}>{o.status}</span>
                <select value={o.status} onClick={e => e.stopPropagation()}
                  onChange={e => updateStatus(o._id, e.target.value)}
                  disabled={updating === o._id}
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0f0f0", padding: "0.35rem 0.5rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", cursor: "pointer", outline: "none" }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Expanded detail */}
              {expanded === o._id && (
                <div style={{ padding: "1.25rem 1.5rem", background: "#0d0d0d", borderBottom: i < filtered.length - 1 ? "1px solid #2a2a2a" : "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: "0.75rem" }}>Items</p>
                      {o.items.map((item, j) => (
                        <div key={j} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem", color: "#ccc", textTransform: "uppercase" }}>{item.name} / {item.size} × {item.quantity}</span>
                          <span style={{ color: "#aaa", fontSize: "0.8rem" }}>EGP {Math.round((item.price * item.quantity)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    {o.shippingAddress && (
                      <div>
                        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: "0.75rem" }}>Shipping Address</p>
                        <p style={{ color: "#ccc", fontSize: "0.85rem", lineHeight: 1.7 }}>{o.shippingAddress.fullName}<br />{o.shippingAddress.address}<br />{o.shippingAddress.city}, {o.shippingAddress.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
