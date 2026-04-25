"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function Navbar() {
  const { user, clearAuth, cartCount } = useStore();
  const count = cartCount();
  const pathname = usePathname();

  const navStyle: React.CSSProperties = {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(10,10,10,0.95)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #2a2a2a",
    height: "64px",
    display: "flex", alignItems: "center",
  };

  const inner: React.CSSProperties = {
    maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem",
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
  };

  const logo: React.CSSProperties = {
    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
    fontSize: "1.4rem", letterSpacing: "0.05em", textTransform: "uppercase",
    color: "#e8ff00",
  };

  const navLinks: React.CSSProperties = {
    display: "flex", gap: "2rem", alignItems: "center",
  };

  const link = (href: string, exact = false): React.CSSProperties => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    return {
      fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
      fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em",
      color: isActive ? "#e8ff00" : "#888",
      transition: "color 0.15s", cursor: "pointer",
      borderBottom: isActive ? "2px solid #e8ff00" : "2px solid transparent",
      paddingBottom: "2px",
    };
  };

  const cartBadge: React.CSSProperties = {
    position: "relative", display: "inline-flex", alignItems: "center",
  };

  const badgeDot: React.CSSProperties = {
    position: "absolute", top: "-6px", right: "-10px",
    background: "#e8ff00", color: "#000",
    borderRadius: "50%", width: "16px", height: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.6rem", fontWeight: 800,
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={inner}>
          <Link href="/" style={logo}>APEX GYM WEAR</Link>
          <div style={navLinks}>
            <Link href="/shop" style={link("/shop")}>Shop</Link>
            {user?.role === "admin" && (
              <Link href="/admin/dashboard" style={link("/admin")}>Admin</Link>
            )}
            {user ? (
              <>
                <Link href="/account" style={link("/account")}>{user.name.split(" ")[0]}</Link>
                <button onClick={clearAuth} style={{ ...link("/"), background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer" }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={link("/auth/login", true)}>Login</Link>
                <Link href="/auth/register" style={{
                  ...link("/auth/register", true),
                  color: pathname === "/auth/register" ? "#fff" : "#000",
                  background: pathname === "/auth/register" ? "#aabb00" : "#e8ff00",
                  padding: "0.35rem 1rem",
                  borderBottom: "none",
                }}>Register</Link>
              </>
            )}
            <Link href="/cart" style={{ ...link("/cart"), color: pathname === "/cart" ? "#e8ff00" : "#f0f0f0", borderBottom: pathname === "/cart" ? "2px solid #e8ff00" : "2px solid transparent" }}>
              <span style={cartBadge}>
                🛒
                {count > 0 && <span style={badgeDot}>{count}</span>}
              </span>
            </Link>
          </div>
        </div>
      </nav>
      <div style={{ height: "2px", background: "linear-gradient(90deg,#e8ff00,#ff3c3c,#e8ff00)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />
    </>
  );
}
