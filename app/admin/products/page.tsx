"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product { _id: string; name: string; price: number; category: string; stock: number; images: string[]; featured: boolean; }
type FormData = { name: string; description: string; price: string; category: string; images: string; sizes: string; stock: string; featured: boolean; tags: string };

const BLANK: FormData = { name: "", description: "", price: "", category: "tops", images: "", sizes: "S,M,L,XL", stock: "", featured: false, tags: "" };

export default function AdminProducts() {
  const { token, user } = useStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "admin") { router.push("/auth/login"); return; }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const load = () => {
    setLoading(true);
    fetch("/api/products?limit=100")
      .then(r => r.json()).then(d => setProducts(d.products || []))
      .finally(() => setLoading(false));
  };

  const openEdit = (p: Product) => {
    setEditing(p._id);
    setForm({ name: p.name, description: "", price: String(p.price), category: p.category, images: p.images.join(","), sizes: "S,M,L,XL", stock: String(p.stock), featured: p.featured, tags: "" });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    const payload = { name: form.name, description: form.description, price: parseFloat(form.price), category: form.category, images: form.images.split(",").map(s => s.trim()).filter(Boolean), sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean), stock: parseInt(form.stock), featured: form.featured, tags: form.tags.split(",").map(s => s.trim()).filter(Boolean) };
    const url = editing ? `/api/products/${editing}` : "/api/products";
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      setShowForm(false); setEditing(null); setForm(BLANK); load();
    } catch { setError("Failed to save product"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const inp: React.CSSProperties = { background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0f0f0", padding: "0.75rem 1rem", fontFamily: "'Barlow',sans-serif", fontSize: "0.9rem", outline: "none", width: "100%", display: "block", marginBottom: "0.875rem" };
  const lbl: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", display: "block", marginBottom: "0.3rem" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "3rem", textTransform: "uppercase", color: "#f0f0f0" }}>
            Products <span style={{ color: "#e8ff00" }}>[{products.length}]</span>
          </h1>
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(BLANK); }}
            style={{ background: "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.75rem 1.5rem", border: "none", cursor: "pointer" }}>
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: "#111", border: "1px solid #e8ff0030", padding: "2rem", marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.4rem", textTransform: "uppercase", color: "#e8ff00", marginBottom: "1.5rem" }}>{editing ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
                {[["Product Name", "name", "text"], ["Price ($)", "price", "number"], ["Stock", "stock", "number"], ["Image URLs (comma-separated)", "images", "text"], ["Sizes (comma-separated)", "sizes", "text"], ["Tags (comma-separated)", "tags", "text"]].map(([l, f, t]) => (
                  <div key={f}>
                    <label style={lbl}>{l}</label>
                    <input required={f === "name" || f === "price"} type={t} style={inp} value={(form as Record<string, string | boolean>)[f] as string}
                      onChange={e => setForm(fm => ({ ...fm, [f]: e.target.value }))}
                      onFocus={ev => (ev.target as HTMLInputElement).style.borderColor = "#e8ff00"}
                      onBlur={ev => (ev.target as HTMLInputElement).style.borderColor = "#2a2a2a"}
                      step={f === "price" ? "0.01" : undefined} min={f === "price" || f === "stock" ? "0" : undefined} />
                  </div>
                ))}
              </div>
              <div>
                <label style={lbl}>Category</label>
                <select style={{ ...inp, cursor: "pointer" }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {["tops","bottoms","outerwear","accessories","footwear"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Description</label>
                <textarea rows={3} style={{ ...inp, resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} onFocus={ev => (ev.target as HTMLTextAreaElement).style.borderColor = "#e8ff00"} onBlur={ev => (ev.target as HTMLTextAreaElement).style.borderColor = "#2a2a2a"} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                <label htmlFor="featured" style={{ ...lbl, marginBottom: 0, cursor: "pointer" }}>Featured Product</label>
              </div>
              {error && <p style={{ color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, marginBottom: "1rem" }}>{error}</p>}
              <button type="submit" disabled={saving} style={{ background: saving ? "#888" : "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.875rem 2rem", border: "none", cursor: saving ? "wait" : "pointer" }}>
                {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={{ background: "#111", border: "1px solid #2a2a2a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr auto auto auto auto", gap: "1rem", padding: "0.875rem 1.5rem", borderBottom: "1px solid #2a2a2a", background: "#0d0d0d" }}>
            {["IMG","PRODUCT","CATEGORY","PRICE","STOCK","ACTIONS"].map(h => (
              <span key={h} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888" }}>{h}</span>
            ))}
          </div>
          {loading ? <div style={{ padding: "2rem 1.5rem", color: "#555" }}>Loading...</div> : products.map((p, i) => (
            <div key={p._id} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto auto auto auto", gap: "1rem", padding: "0.875rem 1.5rem", alignItems: "center", borderBottom: i < products.length - 1 ? "1px solid #1a1a1a" : "none" }}>
              <div style={{ width: "50px", height: "50px", background: "#1a1a1a", border: "1px solid #2a2a2a", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                {p.images?.[0] && <Image src={p.images[0]} alt="" fill style={{ objectFit: "cover" }} unoptimized />}
              </div>
              <div>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", color: "#f0f0f0" }}>{p.name}</p>
                {p.featured && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "#e8ff00", border: "1px solid #e8ff0030", padding: "0.1rem 0.4rem" }}>FEATURED</span>}
              </div>
              <span style={{ color: "#888", fontSize: "0.8rem", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase" }}>{p.category}</span>
              <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>EGP {p.price.toLocaleString()}</span>
              <span style={{ color: p.stock < 10 ? "#ff3c3c" : "#aaa", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>{p.stock}</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => openEdit(p)} style={{ background: "transparent", color: "#e8ff00", border: "1px solid #e8ff0030", padding: "0.35rem 0.75rem", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{ background: "transparent", color: "#ff3c3c", border: "1px solid #ff3c3c30", padding: "0.35rem 0.75rem", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
