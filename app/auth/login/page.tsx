"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setAuth(data.token, data.user);
      router.push(data.user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = { background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0f0f0", padding: "0.875rem 1rem", fontFamily: "'Barlow',sans-serif", fontSize: "0.95rem", outline: "none", width: "100%", display: "block", marginBottom: "1rem" };
  const lbl: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", display: "block", marginBottom: "0.4rem" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(45deg,#ffffff03 25%,transparent 25%),linear-gradient(-45deg,#ffffff03 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ffffff03 75%),linear-gradient(-45deg,transparent 75%,#ffffff03 75%)", backgroundSize: "30px 30px", backgroundPosition: "0 0,0 15px,15px -15px,-15px 0px" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
        <div style={{ background: "#111", border: "1px solid #2a2a2a", padding: "2.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Link href="/" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: "1.4rem", textTransform: "uppercase", color: "#e8ff00", letterSpacing: "0.05em" }}>APEX GYM WEAR</Link>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "2rem", textTransform: "uppercase", color: "#f0f0f0", marginTop: "0.5rem" }}>Welcome Back</h1>
            <p style={{ color: "#888", fontSize: "0.875rem", marginTop: "0.25rem" }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={lbl}>Email</label>
            <input required type="email" style={inp} placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e8ff00"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2a2a2a"} />

            <label style={lbl}>Password</label>
            <input required type="password" style={inp} placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#e8ff00"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2a2a2a"} />

            {error && <div style={{ background: "#ff3c3c15", border: "1px solid #ff3c3c30", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.9rem", fontWeight: 700 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#888" : "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem", border: "none", cursor: loading ? "wait" : "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666", fontSize: "0.875rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.08em" }}>Register →</Link>
          </p>

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
            <p style={{ color: "#555", fontSize: "0.75rem", fontFamily: "'Barlow Condensed',sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Demo Admin Account</p>
            <p style={{ color: "#888", fontSize: "0.8rem" }}>admin@gymstore.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
