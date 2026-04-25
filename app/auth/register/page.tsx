"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setAuth(data.token, data.user);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: "2rem", textTransform: "uppercase", color: "#f0f0f0", marginTop: "0.5rem" }}>Create Account</h1>
            <p style={{ color: "#888", fontSize: "0.875rem", marginTop: "0.25rem" }}>Join the APEX community</p>
          </div>

          <form onSubmit={handleSubmit}>
            {[["Full Name", "name", "text", "Your full name"], ["Email", "email", "email", "you@example.com"], ["Password", "password", "password", "Min 6 characters"], ["Confirm Password", "confirm", "password", "Repeat password"]].map(([label, field, type, ph]) => (
              <div key={field}>
                <label style={lbl}>{label}</label>
                <input required type={type} style={inp} placeholder={ph}
                  value={(form as Record<string, string>)[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  onFocus={ev => (ev.target as HTMLInputElement).style.borderColor = "#e8ff00"}
                  onBlur={ev => (ev.target as HTMLInputElement).style.borderColor = "#2a2a2a"} />
              </div>
            ))}

            {error && <div style={{ background: "#ff3c3c15", border: "1px solid #ff3c3c30", padding: "0.75rem 1rem", marginBottom: "1rem", color: "#ff3c3c", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "0.9rem", fontWeight: 700 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#888" : "#e8ff00", color: "#000", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", padding: "1rem", border: "none", cursor: loading ? "wait" : "pointer", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#666", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#e8ff00", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.08em" }}>Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
