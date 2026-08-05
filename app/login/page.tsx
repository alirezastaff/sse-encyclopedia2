"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/profile");
  const [identifier, setIdentifier] = useState("alimostajeran");
  const [password, setPassword] = useState("123456789");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callback = params.get("callbackUrl");
    if (callback) {
      setCallbackUrl(callback);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (identifier.trim().toLowerCase() === "alimostajeran") {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "alimostajeran", password, name: "Ali Mostajeran" }),
        });

        if (!registerResponse.ok && registerResponse.status !== 409) {
          const data = await registerResponse.json().catch(() => null);
          setError(data?.message ?? "Unable to create test account.");
          setIsSubmitting(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      if (result?.url) {
        router.push(result.url);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("Unable to sign in. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", padding: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5efe8" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 520, background: "#fff", padding: 28, borderRadius: 22, boxShadow: "0 30px 70px rgba(0,0,0,0.08)" }}>
        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 28, color: "#211f1f" }}>Sign in</h1>
        <p style={{ margin: 0, marginBottom: 24, color: "#6d6d6d" }}>Access Marginal Notes, your saved article comments and replies.</p>

        <label style={{ display: "block", marginBottom: 14, fontWeight: 700, color: "#362f2f" }}>
          Username or email
          <input type="text" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required style={{ width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 12, border: "1px solid #d5c4bc", fontSize: 15 }} />
        </label>

        <label style={{ display: "block", marginBottom: 20, fontWeight: 700, color: "#362f2f" }}>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required style={{ width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 12, border: "1px solid #d5c4bc", fontSize: 15 }} />
        </label>

        {error ? <div style={{ marginBottom: 18, color: "#a61922", fontWeight: 700 }}>{error}</div> : null}

        <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "none", background: "#a61922", color: "#fff", fontWeight: 800, cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: 15 }}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <div style={{ marginTop: 18, fontSize: 14, color: "#666" }}>
          Use username <strong>alimostajeran</strong> and password <strong>123456789</strong> to sign in to the study dashboard.
        </div>
        <div style={{ marginTop: 14, fontSize: 14, color: "#666" }}>
          Don’t have an account? <a href="/register" style={{ color: "#a61922", textDecoration: "underline" }}>Create one</a>
        </div>
      </form>
    </main>
  );
}
