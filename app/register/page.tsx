"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.message ?? "Registration failed");
        setIsSubmitting(false);
        return;
      }

      await signIn("credentials", { email, password, callbackUrl: "/" });
    } catch (err) {
      setError("Unable to register. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5efe8" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 520, background: "#fff", padding: 28, borderRadius: 22, boxShadow: "0 30px 70px rgba(0,0,0,0.08)" }}>
        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 28, color: "#211f1f" }}>Create your account</h1>
        <p style={{ margin: 0, marginBottom: 24, color: "#6d6d6d" }}>Start using Marginal Notes with saved bookmarks, notes, highlights and progress.</p>

        <label style={{ display: "block", marginBottom: 14, fontWeight: 700, color: "#362f2f" }}>
          Name
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} required style={{ width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 12, border: "1px solid #d5c4bc", fontSize: 15 }} />
        </label>

        <label style={{ display: "block", marginBottom: 14, fontWeight: 700, color: "#362f2f" }}>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required style={{ width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 12, border: "1px solid #d5c4bc", fontSize: 15 }} />
        </label>

        <label style={{ display: "block", marginBottom: 20, fontWeight: 700, color: "#362f2f" }}>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} style={{ width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 12, border: "1px solid #d5c4bc", fontSize: 15 }} />
        </label>

        {error ? <div style={{ marginBottom: 18, color: "#a61922", fontWeight: 700 }}>{error}</div> : null}

        <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "none", background: "#a61922", color: "#fff", fontWeight: 800, cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: 15 }}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <div style={{ marginTop: 18, fontSize: 14, color: "#666" }}>
          Already have an account? <a href="/login" style={{ color: "#a61922", textDecoration: "underline" }}>Sign in</a>
        </div>
      </form>
    </main>
  );
}
