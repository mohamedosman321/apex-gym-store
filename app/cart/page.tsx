"use client";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useStore();
  const total = cartTotal();
  const count = cartCount();
  const shipping = total >= 2999 ? 0 : 99;

  const s = { minHeight: "100vh", background: "#0a0a0a", padding: "3rem 1.5rem" };

  if (cart.length === 0) return (
    <div style={{ ...s, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1.5rem" }}>
      <div style={{ fontSize: "4rem" }}>🛒</div>
      <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "2.5rem", textTransform: "uppercase", color: "#f0f0f0" }}>Your Cart is Empty</h2>
      <p style={{ color: "#888", maxWidth: "300px" }}>Add some gear to get started.</p>
      <Link href="/shop"><button style={{ background: "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.875rem 2.5rem", border: "none", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>Shop Now</button></Link>
    </div>
  );

  return (
    <div style={s}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "2rem" }}>
          Shopping Cart <span style={{ color: "#e8ff00" }}>[{count}]</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }}>
          {/* Items */}
          <div style={{ border: "1px solid #2a2a2a" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "1rem", padding: "1rem 1.5rem", borderBottom: "1px solid #2a2a2a", background: "#111" }}>
              {["PRODUCT", "PRICE", "QTY", "TOTAL"].map(h => (
                <span key={h} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888" }}>{h}</span>
              ))}
            </div>

            {cart.map((item, i) => (
              <div key={`${item.productId}-${item.size}`} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "1rem", padding: "1.25rem 1.5rem", alignItems: "center", borderBottom: i < cart.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                {/* Product */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ width: "70px", height: "70px", background: "#1a1a1a", border: "1px solid #2a2a2a", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                    {item.image && <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} unoptimized />}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "0.25rem" }}>{item.name}</p>
                    <p style={{ color: "#666", fontSize: "0.8rem", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase" }}>Size: {item.size}</p>
                    <button onClick={() => removeFromCart(item.productId, item.size)} style={{ color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", background: "none", border: "none", cursor: "pointer", marginTop: "0.25rem", padding: 0 }}>Remove</button>
                  </div>
                </div>
                {/* Price */}
                <span style={{ color: "#aaa", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 600 }}>EGP {item.price.toLocaleString()}</span>
                {/* Qty */}
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2a2a" }}>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} style={{ width: "32px", height: "32px", background: "transparent", border: "none", color: "#f0f0f0", cursor: "pointer" }}>−</button>
                  <span style={{ width: "32px", textAlign: "center", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#f0f0f0" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} style={{ width: "32px", height: "32px", background: "transparent", border: "none", color: "#f0f0f0", cursor: "pointer" }}>+</button>
                </div>
                {/* Total */}
                <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>EGP {Math.round((item.price * item.quantity)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: "#111", border: "1px solid #2a2a2a", padding: "2rem", position: "sticky", top: "80px" }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.5rem", textTransform: "uppercase", color: "#f0f0f0", marginBottom: "1.5rem" }}>Order Summary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {[["Subtotal", `EGP ${Math.round(total).toLocaleString()}`], ["Shipping", shipping === 0 ? "FREE" : `EGP ${shipping.toLocaleString()}`], ["Tax (10%)", `EGP ${Math.round(total * 0.1).toLocaleString()}`]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888", fontSize: "0.9rem" }}>{label}</span>
                  <span style={{ color: label === "Shipping" && shipping === 0 ? "#e8ff00" : "#f0f0f0", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>{val}</span>
                </div>
              ))}
              <div style={{ height: "1px", background: "#2a2a2a", margin: "0.5rem 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: "0.9rem", color: "#f0f0f0" }}>Total</span>
                <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.3rem" }}>EGP {Math.round((total + shipping + total * 0.1)).toLocaleString()}</span>
              </div>
            </div>
            {total < 2999 && (
              <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "1rem", background: "#1a1a1a", padding: "0.75rem", border: "1px solid #2a2a2a" }}>
                Add <span style={{ color: "#e8ff00" }}>EGP {Math.round(2999 - total)}</span> more for free shipping!
              </p>
            )}
            <Link href="/checkout" style={{ display: "block" }}>
              <button style={{ width: "100%", background: "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem", border: "none", cursor: "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
                Proceed to Checkout
              </button>
            </Link>
            <Link href="/shop" style={{ display: "block", textAlign: "center", marginTop: "1rem", color: "#888", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
