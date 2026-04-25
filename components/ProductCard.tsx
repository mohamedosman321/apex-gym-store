"use client";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    featured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product._id}`}>
      <div style={{
        background: "#141414", border: "1px solid #2a2a2a",
        overflow: "hidden", transition: "border-color 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e8ff00"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
      >
        <div style={{ position: "relative", aspectRatio: "3/4", background: "#1a1a1a", overflow: "hidden" }}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width:768px) 50vw, 25vw"
              unoptimized
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: "3rem" }}>👕</div>
          )}
          {product.featured && (
            <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "#e8ff00", color: "#000", padding: "0.2rem 0.6rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              FEATURED
            </div>
          )}
        </div>
        <div style={{ padding: "1rem" }}>
          <p style={{ color: "#888", fontSize: "0.7rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{product.category}</p>
          <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.02em", color: "#f0f0f0", marginBottom: "0.5rem" }}>{product.name}</h3>
          <p style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>EGP {product.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
