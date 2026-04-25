"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string; name: string; price: number;
  images: string[]; category: string; featured: boolean;
}

const CATS = [
  { name: "Tops", icon: "👕", slug: "tops", desc: "Compression tees, tanks & hoodies" },
  { name: "Bottoms", icon: "👖", slug: "bottoms", desc: "Joggers, shorts & leggings" },
  { name: "Outerwear", icon: "🧥", slug: "outerwear", desc: "Jackets & windbreakers" },
  { name: "Accessories", icon: "🧤", slug: "accessories", desc: "Caps, gloves & gear" },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then(r => r.json()).then(d => setFeatured(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ position:"relative", minHeight:"90vh", display:"flex", alignItems:"center", background:"linear-gradient(135deg,#0a0a0a 0%,#111 50%,#0f0f0f 100%)", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(45deg,#ffffff04 25%,transparent 25%),linear-gradient(-45deg,#ffffff04 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ffffff04 75%),linear-gradient(-45deg,transparent 75%,#ffffff04 75%)", backgroundSize:"30px 30px", backgroundPosition:"0 0,0 15px,15px -15px,-15px 0px" }} />
        <div style={{ position:"absolute", right:"5%", top:"50%", transform:"translateY(-50%)", width:"380px", height:"500px", background:"linear-gradient(135deg,#e8ff0015,#ff3c3c08)", border:"1px solid #e8ff0020", clipPath:"polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))" }} />
        <div style={{ position:"relative", maxWidth:"1200px", margin:"0 auto", padding:"0 1.5rem", zIndex:1 }}>
          <div style={{ maxWidth:"600px" }}>
            <div style={{ display:"inline-block", background:"#e8ff0015", border:"1px solid #e8ff0030", padding:"0.3rem 1rem", marginBottom:"1.5rem" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.15em", color:"#e8ff00" }}>NEW COLLECTION 2026</span>
            </div>
            <h1 style={{ fontSize:"clamp(3.5rem,8vw,7rem)", lineHeight:0.9, marginBottom:"1.5rem", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, textTransform:"uppercase" }}>
              BUILT TO<br /><span style={{ color:"#e8ff00" }}>PERFORM.</span><br />BUILT TO<br />LAST.
            </h1>
            <p style={{ color:"#888", fontSize:"1.05rem", lineHeight:1.7, marginBottom:"2.5rem", maxWidth:"440px" }}>Geometric athletic wear engineered for serious athletes. Four-way stretch, moisture-wicking, built for the hardest sessions.</p>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              <Link href="/shop"><button style={{ background:"#e8ff00", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.9rem", textTransform:"uppercase", letterSpacing:"0.1em", padding:"0.875rem 2.5rem", border:"none", cursor:"pointer", clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>Shop Now</button></Link>
              <Link href="/shop?category=tops"><button style={{ background:"transparent", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.9rem", textTransform:"uppercase", letterSpacing:"0.1em", padding:"0.875rem 2.5rem", border:"1px solid #2a2a2a", cursor:"pointer" }}>View Tops</button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background:"#e8ff00", padding:"1rem 1.5rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:"1rem" }}>
          {[["FREE SHIPPING","ORDERS OVER 2,999 EGP"],["30-DAY RETURNS","HASSLE FREE"],["SECURE CHECKOUT","SSL ENCRYPTED"],["10K+ ATHLETES","TRUST APEX"]].map(([a,b]) => (
            <div key={a} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"0.85rem", letterSpacing:"0.08em", color:"#000" }}>{a}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:500, fontSize:"0.7rem", color:"#333", letterSpacing:"0.05em" }}>{b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding:"5rem 1.5rem", background:"#0d0d0d" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ marginBottom:"3rem" }}>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.2em", color:"#888", marginBottom:"0.5rem" }}>EXPLORE</p>
            <h2 style={{ fontSize:"3rem", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, textTransform:"uppercase" }}>Shop by Category</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1px", background:"#2a2a2a" }}>
            {CATS.map(cat => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`}>
                <div style={{ background:"#141414", padding:"2rem", cursor:"pointer", transition:"background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background="#1e1e1e"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background="#141414"}>
                  <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>{cat.icon}</div>
                  <h3 style={{ fontSize:"1.5rem", color:"#f0f0f0", marginBottom:"0.5rem", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, textTransform:"uppercase" }}>{cat.name}</h3>
                  <p style={{ color:"#666", fontSize:"0.85rem" }}>{cat.desc}</p>
                  <div style={{ marginTop:"1.5rem", color:"#e8ff00", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.8rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>Shop {cat.name} →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding:"5rem 1.5rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"3rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.75rem", textTransform:"uppercase", letterSpacing:"0.2em", color:"#888", marginBottom:"0.5rem" }}>HAND-PICKED</p>
              <h2 style={{ fontSize:"3rem", color:"#f0f0f0", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, textTransform:"uppercase" }}>Featured Products</h2>
            </div>
            <Link href="/shop" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"0.1em", color:"#e8ff00" }}>View All →</Link>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"1px", background:"#2a2a2a" }}>
            {loading ? [1,2,3,4].map(i => <div key={i} style={{ background:"#141414", aspectRatio:"3/4" }} />) : featured.map(p => <div key={p._id} style={{ background:"#0a0a0a" }}><ProductCard product={p} /></div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:"#111", borderTop:"1px solid #2a2a2a", borderBottom:"1px solid #2a2a2a", padding:"5rem 1.5rem", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(45deg,#ffffff03 25%,transparent 25%),linear-gradient(-45deg,#ffffff03 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ffffff03 75%),linear-gradient(-45deg,transparent 75%,#ffffff03 75%)", backgroundSize:"20px 20px", backgroundPosition:"0 0,0 10px,10px -10px,-10px 0px" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <h2 style={{ fontSize:"clamp(2rem,5vw,4rem)", color:"#f0f0f0", marginBottom:"1rem", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, textTransform:"uppercase" }}>JOIN THE <span style={{ color:"#e8ff00" }}>APEX</span> COMMUNITY</h2>
          <p style={{ color:"#888", marginBottom:"2rem", fontSize:"1.05rem" }}>Create an account and get 10% off your first order.</p>
          <Link href="/auth/register"><button style={{ background:"#e8ff00", color:"#000", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"0.9rem", textTransform:"uppercase", letterSpacing:"0.1em", padding:"0.875rem 3rem", border:"none", cursor:"pointer", clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>Get Started Free</button></Link>
        </div>
      </section>
    </div>
  );
}
