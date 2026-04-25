"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Suspense } from "react";

interface Product {
  _id: string; name: string; price: number;
  images: string[]; category: string; featured: boolean;
}

const CATS = ["", "tops", "bottoms", "outerwear", "accessories", "footwear"];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(search);

  const load = useCallback(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (category) q.set("category", category);
    q.set("page", String(page));
    q.set("limit", "12");
    fetch(`/api/products?${q}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setTotal(d.total || 0); setPages(d.pages || 1); })
      .finally(() => setLoading(false));
  }, [search, category, page]);

  useEffect(() => { load(); }, [load]);

  const navigate = (params: Record<string, string>) => {
    const q = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => v ? q.set(k, v) : q.delete(k));
    q.delete("page");
    router.push(`/shop?${q}`);
  };

  const s: React.CSSProperties = { minHeight: "100vh", background: "#0a0a0a" };

  return (
    <div style={s}>
      {/* Header */}
      <div style={{ background: "#111", borderBottom: "1px solid #2a2a2a", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "3rem", color: "#f0f0f0", marginBottom: "1.5rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, textTransform: "uppercase" }}>
            {category ? category.toUpperCase() : "ALL PRODUCTS"}
            <span style={{ color: "#e8ff00", marginLeft: "0.5rem", fontSize: "1.5rem" }}>[{total}]</span>
          </h1>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ display: "flex", flex: "1", minWidth: "240px", maxWidth: "400px" }}>
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && navigate({ search: searchInput })}
                placeholder="Search products..." style={{ borderRight: "none", height: "44px", padding: "0 1rem" }} />
              <button onClick={() => navigate({ search: searchInput })} style={{ background: "#e8ff00", color: "#000", border: "none", padding: "0 1.25rem", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Search
              </button>
            </div>
            {/* Category filters */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {CATS.map(c => (
                <button key={c} onClick={() => navigate({ category: c })}
                  style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.5rem 1rem", border: `1px solid ${category === c ? "#e8ff00" : "#2a2a2a"}`, background: category === c ? "#e8ff00" : "transparent", color: category === c ? "#000" : "#888", cursor: "pointer", transition: "all 0.15s" }}>
                  {c || "All"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "1px", background: "#2a2a2a" }}>
            {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ background: "#141414", aspectRatio: "3/4" }} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem", color: "#888" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontSize: "1.5rem", color: "#f0f0f0", marginBottom: "0.5rem" }}>No products found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "1px", background: "#2a2a2a" }}>
            {products.map(p => <div key={p._id} style={{ background: "#0a0a0a" }}><ProductCard product={p} /></div>)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => { const q = new URLSearchParams(searchParams.toString()); q.set("page", String(i + 1)); router.push(`/shop?${q}`); }}
                style={{ width: "40px", height: "40px", border: `1px solid ${page === i + 1 ? "#e8ff00" : "#2a2a2a"}`, background: page === i + 1 ? "#e8ff00" : "transparent", color: page === i + 1 ? "#000" : "#888", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, cursor: "pointer" }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return <Suspense><ShopContent /></Suspense>;
}
