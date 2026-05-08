"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, token, user } = useStore();
  const total = cartTotal();
  const shipping = total >= 2999 ? 0 : 99;
  const tax = Math.round(total * 0.1);
  const grandTotal = total + shipping + tax;

  const [form, setForm] = useState({ fullName: "", address: "", city: "", country: "Egypt", zip: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { router.push("/auth/login"); return; }
    if (cart.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart,
          subtotal: total,
          total: grandTotal,
          shippingAddress: form,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Order failed");
      clearCart();
      router.push("/account?ordered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const s = { minHeight: "100vh", background: "#0a0a0a", padding: "3rem 1.5rem" };

  if (cart.length === 0) return (
    <div style={{ ...s, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1.5rem" }}>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "2rem", textTransform: "uppercase", color: "#f0f0f0" }}>Your cart is empty</h2>
      <Link href="/shop"><button style={{ background: "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.875rem 2.5rem", border: "none", cursor: "pointer" }}>Shop Now</button></Link>
    </div>
  );

  if (!token) return (
    <div style={{ ...s, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1.5rem" }}>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "2rem", textTransform: "uppercase", color: "#f0f0f0" }}>Please log in to checkout</h2>
      <Link href="/auth/login"><button style={{ background: "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.875rem 2.5rem", border: "none", cursor: "pointer" }}>Login</button></Link>
    </div>
  );

  const inp: React.CSSProperties = { display: "block", width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0f0f0", padding: "0.875rem 1rem", fontFamily: "'Barlow',sans-serif", fontSize: "0.95rem", outline: "none", marginBottom: "1rem" };
  const label: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#888", display: "block", marginBottom: "0.4rem" };

  return (
    <div style={s}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "2rem" }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", alignItems: "start" }}>
          {/* Shipping Form */}
          <div>
            <div style={{ background: "#111", border: "1px solid #2a2a2a", padding: "2rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.4rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "1.5rem" }}>Shipping Information</h2>
              <form onSubmit={handleSubmit}>
                {[["Full Name", "fullName"], ["Street Address", "address"], ["City", "city"], ["Country", "country"], ["ZIP / Postal Code", "zip"]].map(([placeholder, field]) => (
                  <div key={field}>
                    <label style={label}>{placeholder}</label>
                    <input required style={inp} placeholder={placeholder} value={(form as Record<string, string>)[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e8ff00"}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2a2a2a"} />
                  </div>
                ))}

                {error && (
                  <div style={{ background: "#ff3c3c15", border: "1px solid #ff3c3c50", padding: "0.875rem 1rem", marginBottom: "1rem", borderRadius: "2px" }}>
                    <p style={{ color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>
                      ⚠ {error}
                    </p>
                  </div>
                )}

                <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "1rem", marginBottom: "1.5rem" }}>
                  <p style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600, textTransform: "uppercase" }}>💳 Payment</p>
                  <p style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.5rem" }}>Demo mode — no real payment required</p>
                </div>

                <button type="submit" disabled={loading}
                  style={{ width: "100%", background: loading ? "#888" : "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem", border: "none", cursor: loading ? "wait" : "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
                  {loading ? "Placing Order..." : `Place Order — EGP ${Math.round(grandTotal).toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: "#111", border: "1px solid #2a2a2a", padding: "2rem", position: "sticky", top: "80px" }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.4rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "1.5rem" }}>Order Summary</h2>
            <div style={{ marginBottom: "1.5rem" }}>
              {cart.map(item => (
                <div key={`${item.productId}-${item.size}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #1a1a1a" }}>
                  <div>
                    <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", color: "#f0f0f0" }}>{item.name}</p>
                    <p style={{ color: "#555", fontSize: "0.75rem", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase" }}>Size: {item.size} × {item.quantity}</p>
                  </div>
                  <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>EGP {Math.round(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            {[["Subtotal", `EGP ${Math.round(total).toLocaleString()}`], ["Shipping", shipping === 0 ? "FREE" : `EGP ${shipping}`], ["Tax (10%)", `EGP ${tax.toLocaleString()}`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: "#888", fontSize: "0.875rem" }}>{l}</span>
                <span style={{ color: "#f0f0f0", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>{v}</span>
              </div>
            ))}
            <div style={{ height: "1px", background: "#2a2a2a", margin: "1rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, textTransform: "uppercase", fontSize: "1rem", color: "#f0f0f0" }}>TOTAL</span>
              <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.4rem" }}>EGP {Math.round(grandTotal).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}