"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";

interface Product {
  _id: string; name: string; description: string; price: number;
  images: string[]; category: string; sizes: string[];
  stock: number; featured: boolean; tags: string[];
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [stockError, setStockError] = useState("");
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => setProduct(d))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product || !selectedSize) return;

    if (product.stock === 0) {
      setStockError("This product is out of stock!");
      return;
    }

    if (qty > product.stock) {
      setStockError(`Only ${product.stock} item${product.stock === 1 ? "" : "s"} in stock!`);
      return;
    }

    setStockError("");
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: qty,
      image: product.images?.[0] || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const s = { minHeight: "100vh", background: "#0a0a0a" };

  if (loading) return (
    <div style={{ ...s, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.2rem", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Loading...</div>
    </div>
  );

  if (!product) return (
    <div style={{ ...s, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <h2 style={{ color: "#f0f0f0", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "2rem", textTransform: "uppercase" as const }}>Product Not Found</h2>
      <Link href="/shop" style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: "uppercase" as const, fontSize: "0.85rem", letterSpacing: "0.1em" }}>← Back to Shop</Link>
    </div>
  );

  const imgs = product.images?.length ? product.images : [""];
  const isOutOfStock = product.stock === 0;

  return (
    <div style={s}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: "1px solid #2a2a2a", padding: "1rem 1.5rem", background: "#0d0d0d" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {[["Home", "/"], ["Shop", "/shop"], [product.category, `/shop?category=${product.category}`]].map(([label, href], i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href={href} style={{ color: "#666", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.8rem", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{label}</Link>
              {i < 2 && <span style={{ color: "#333" }}>/</span>}
            </span>
          ))}
          <span style={{ color: "#333" }}>/</span>
          <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.8rem", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>

        {/* Images */}
        <div>
          <div style={{ position: "relative", aspectRatio: "4/5", background: "#141414", border: "1px solid #2a2a2a", overflow: "hidden", marginBottom: "1rem" }}>
            {imgs[imgIdx] ? (
              <Image src={imgs[imgIdx]} alt={product.name} fill style={{ objectFit: "cover" }} unoptimized />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: "5rem" }}>👕</div>
            )}
            {product.featured && (
              <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "#e8ff00", color: "#000", padding: "0.25rem 0.75rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>FEATURED</div>
            )}
            {isOutOfStock && (
              <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "#ff3c3c", color: "#fff", padding: "0.25rem 0.75rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>OUT OF STOCK</div>
            )}
          </div>
          {imgs.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {imgs.map((img, i) => (
                <div key={i} onClick={() => setImgIdx(i)} style={{ width: "70px", height: "70px", border: `1px solid ${imgIdx === i ? "#e8ff00" : "#2a2a2a"}`, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {img && <Image src={img} alt="" fill style={{ objectFit: "cover" }} unoptimized />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ paddingTop: "1rem" }}>
          <p style={{ color: "#888", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: "0.5rem" }}>{product.category}</p>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "2.8rem", textTransform: "uppercase" as const, color: "#f0f0f0", lineHeight: 0.95, marginBottom: "1rem" }}>{product.name}</h1>
          <div style={{ fontSize: "2rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, color: "#e8ff00", marginBottom: "0.5rem" }}>EGP {product.price.toLocaleString()}</div>

          {/* Stock indicator */}
          <div style={{ marginBottom: "1.5rem" }}>
            {isOutOfStock ? (
              <span style={{ color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>● Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span style={{ color: "#ff8800", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>● Only {product.stock} left!</span>
            ) : (
              <span style={{ color: "#00dd88", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>● In Stock ({product.stock})</span>
            )}
          </div>

          <p style={{ color: "#aaa", lineHeight: 1.8, marginBottom: "2rem", fontSize: "0.95rem" }}>{product.description}</p>

          {/* Sizes */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#f0f0f0" }}>SIZE</span>
              {selectedSize && <span style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.85rem", fontWeight: 700 }}>{selectedSize}</span>}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {product.sizes.map(sz => (
                <button key={sz} onClick={() => { if (!isOutOfStock) setSelectedSize(sz); }}
                  style={{ width: "48px", height: "48px", border: `1px solid ${selectedSize === sz ? "#e8ff00" : "#2a2a2a"}`, background: selectedSize === sz ? "#e8ff00" : "transparent", color: selectedSize === sz ? "#000" : isOutOfStock ? "#444" : "#888", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: isOutOfStock ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
                  {sz}
                </button>
              ))}
            </div>
            {!selectedSize && !isOutOfStock && <p style={{ color: "#ff3c3c", fontSize: "0.8rem", marginTop: "0.5rem", fontFamily: "'Barlow Condensed',sans-serif" }}>Please select a size</p>}
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#f0f0f0" }}>QTY</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2a2a" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: "40px", height: "40px", background: "transparent", border: "none", color: "#f0f0f0", fontSize: "1.2rem", cursor: "pointer" }}>−</button>
              <span style={{ width: "40px", textAlign: "center", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, color: "#f0f0f0" }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(q + 1, product.stock))} disabled={isOutOfStock}
                style={{ width: "40px", height: "40px", background: "transparent", border: "none", color: isOutOfStock ? "#444" : "#f0f0f0", fontSize: "1.2rem", cursor: isOutOfStock ? "not-allowed" : "pointer" }}>+</button>
            </div>
            {!isOutOfStock && (
              <span style={{ color: "#555", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.8rem" }}>{product.stock} in stock</span>
            )}
          </div>

          {/* Stock error message */}
          {stockError && (
            <div style={{ background: "#ff3c3c15", border: "1px solid #ff3c3c50", padding: "0.75rem 1rem", marginBottom: "1rem", borderRadius: "2px" }}>
              <p style={{ color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>⚠ {stockError}</p>
            </div>
          )}

          {/* Add to Cart */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <button onClick={handleAdd} disabled={!selectedSize || isOutOfStock}
              style={{ flex: 1, minWidth: "200px", background: isOutOfStock ? "#2a2a2a" : selectedSize ? (added ? "#aabb00" : "#e8ff00") : "#2a2a2a", color: isOutOfStock ? "#555" : selectedSize ? "#000" : "#555", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", padding: "1rem 2rem", border: "none", cursor: (!selectedSize || isOutOfStock) ? "not-allowed" : "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))", transition: "all 0.2s" }}>
              {isOutOfStock ? "Out of Stock" : added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <Link href="/cart" style={{ flex: "0 0 auto" }}>
              <button style={{ background: "transparent", color: "#f0f0f0", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", padding: "1rem 1.5rem", border: "1px solid #2a2a2a", cursor: "pointer" }}>View Cart</button>
            </Link>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {product.tags.map(tag => (
                <span key={tag} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "0.25rem 0.75rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#666" }}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}