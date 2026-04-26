export default function Footer() {
  return (
    <footer style={{ background: "#0d0d0d", borderTop: "1px solid #2a2a2a", padding: "3rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "2rem" }}>
        <div>
          <h3 style={{ fontSize: "1.5rem", color: "#e8ff00", marginBottom: "0.75rem" }}>APEX GYM WEAR</h3>
          <p style={{ color: "#888", fontSize: "0.875rem", lineHeight: 1.6 }}>Performance athletic apparel built for serious athletes. Geometric design meets functional performance.</p>
        </div>
        <div>
          <h4 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#f0f0f0" }}>Shop</h4>
          {["Tops","Bottoms","Outerwear","Accessories"].map(c => (
            <a key={c} href={`/shop?category=${c.toLowerCase()}`} style={{ display: "block", color: "#888", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{c}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#f0f0f0" }}>Account</h4>
          {[["Login", "/auth/login"], ["Register", "/auth/register"], ["My Orders", "/account"], ["Cart", "/cart"]].map(([label, href]) => (
            <a key={label} href={href} style={{ display: "block", color: "#888", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{label}</a>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#f0f0f0" }}>Connect</h4>
          <p style={{ color: "#888", fontSize: "0.875rem" }}>support@apexgymwear.com</p>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "2rem auto 0", borderTop: "1px solid #2a2a2a", paddingTop: "1.5rem", textAlign: "center", color: "#555", fontSize: "0.8rem" }}>
        © {new Date().getFullYear()} APEX GYM WEAR. All rights reserved.
      </div>
    </footer>
  );
}