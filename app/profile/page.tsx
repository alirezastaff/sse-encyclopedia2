"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { articles } from "@/lib/articles";

type NoteReply = {
  id: string;
  content: string;
  replyEmail?: string | null;
  createdAt: string;
};

type MarginalNote = {
  id: string;
  articleSlug: string;
  name: string;
  email?: string | null;
  content: string;
  createdAt: string;
  replies: NoteReply[];
};

const articleOptions = articles.map((article) => ({ slug: article.slug, title: article.title.en }));

const formatTime = (value: string) => new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export default function ProfilePage() {
  const [notes, setNotes] = useState<MarginalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [articleSlug, setArticleSlug] = useState(articleOptions[0]?.slug ?? "");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyName, setReplyName] = useState<Record<string, string>>({});
  const [replyEmail, setReplyEmail] = useState<Record<string, string>>({});

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notes]
  );

  const loadNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/marginal-notes");
      const data = await response.json();
      setNotes(data.notes ?? []);
    } catch {
      setErrorMessage("Unable to load Marginal Notes right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const visibleArticleTitle = useMemo(
    () => articleOptions.reduce<Record<string, string>>((map, item) => {
      map[item.slug] = item.title;
      return map;
    }, {}),
    []
  );

  const resetForm = () => {
    setName("");
    setEmail("");
    setContent("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const openModal = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Comment is required.");
      return;
    }

    setPosting(true);
    try {
      const response = await fetch("/api/marginal-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined, articleSlug, content: content.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error || "Unable to post your note.");
      } else {
        setSuccessMessage("Your marginal note has been posted.");
        resetForm();
        loadNotes();
      }
    } catch {
      setErrorMessage("Unable to post your note.");
    } finally {
      setPosting(false);
    }
  };

  const handleReplySubmit = async (noteId: string) => {
    const replyNameValue = replyName[noteId]?.trim() || "";
    const replyTextValue = replyText[noteId]?.trim() || "";
    const replyEmailValue = replyEmail[noteId]?.trim() || undefined;

    if (!replyNameValue) {
      setErrorMessage("Reply name is required.");
      return;
    }
    if (!replyTextValue) {
      setErrorMessage("Reply content is required.");
      return;
    }

    setPosting(true);
    try {
      const response = await fetch("/api/marginal-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: replyNameValue,
          email: replyEmailValue,
          articleSlug,
          content: replyTextValue,
          replyToId: noteId,
          replyEmail: replyEmailValue,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMessage(data?.error || "Unable to post your reply.");
      } else {
        setSuccessMessage("Your reply has been added.");
        setReplyOpen((prev) => ({ ...prev, [noteId]: false }));
        setReplyText((prev) => ({ ...prev, [noteId]: "" }));
        setReplyName((prev) => ({ ...prev, [noteId]: "" }));
        setReplyEmail((prev) => ({ ...prev, [noteId]: "" }));
        loadNotes();
      }
    } catch {
      setErrorMessage("Unable to post your reply.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <main dir="ltr" style={{ minHeight: "100vh", padding: 24, background: "linear-gradient(180deg, #f8f2ee 0%, #fbf7f5 100%)", color: "#111", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", display: "grid", gap: 28 }}>
        <section style={{ display: "grid", gap: 24, gridTemplateColumns: "1.7fr 0.9fr" }}>
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ padding: 28, borderRadius: 32, background: "#fff", border: "1px solid rgba(166,25,34,0.08)", boxShadow: "0 28px 80px rgba(125,16,23,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.24em", textTransform: "uppercase", color: "#a61922", fontWeight: 800 }}>Marginal Notes</p>
                  <h1 style={{ margin: "14px 0 8px", fontSize: 42, lineHeight: 1.05, color: "#1c1a1a" }}>A public research feed for article annotations and replies</h1>
                  <p style={{ margin: 0, color: "#5f5f5f", fontSize: 17, maxWidth: 680, lineHeight: 1.8 }}>
                    Discover the latest article comments, questions, and critiques. No login needed—share your note with just a name and optional email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openModal}
                  style={{ flexShrink: 0, padding: "14px 24px", borderRadius: 999, border: "none", background: "#a61922", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 16px 28px rgba(166,25,34,0.18)" }}
                >
                  New annotation
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, color: "#1c1a1a" }}>Latest annotations</h2>
                  <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: 15 }}>
                    Fresh notes are shown first. Reply to any annotation or open a new thread immediately.
                  </p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, background: "#fdf2f2", color: "#a61922", fontSize: 13, fontWeight: 700 }}>
                  {sortedNotes.length} notes
                </span>
              </div>

              {loading ? (
                <div style={{ padding: 28, borderRadius: 28, background: "#fff", border: "1px solid rgba(166,25,34,0.08)", color: "#475569" }}>
                  Loading annotation feed...
                </div>
              ) : sortedNotes.length === 0 ? (
                <div style={{ padding: 28, borderRadius: 28, background: "#fff", border: "1px solid rgba(166,25,34,0.08)", color: "#475569" }}>
                  No marginal notes yet. Open a new annotation to start the conversation.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 18 }}>
                  {sortedNotes.map((note) => (
                    <article key={note.id} style={{ borderRadius: 28, overflow: "hidden", background: "#fff", border: "1px solid rgba(166,25,34,0.12)", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.04)" }}>
                      <div style={{ padding: 24, background: "linear-gradient(180deg, rgba(166,25,34,0.08), rgba(255,255,255,0))" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                          <div style={{ minWidth: 0 }}>
                            <Link href={`/en/articles/${note.articleSlug}`} style={{ fontSize: 18, fontWeight: 800, color: "#a61922", textDecoration: "none" }}>
                              {visibleArticleTitle[note.articleSlug] ?? note.articleSlug}
                            </Link>
                            <p style={{ margin: "10px 0 0", color: "#475569", fontSize: 14 }}>
                              Posted by <strong>{note.name}</strong> • {formatTime(note.createdAt)}
                            </p>
                          </div>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, background: "#fff1f0", color: "#a61922", fontSize: 13, fontWeight: 700, border: "1px solid rgba(166,25,34,0.12)" }}>
                            <span>{note.replies.length}</span>
                            replies
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: 24, borderTop: "1px solid rgba(166,25,34,0.08)" }}>
                        <p style={{ margin: 0, color: "#1f2937", fontSize: 16, lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{note.content}</p>
                        {note.email ? (
                          <p style={{ margin: "18px 0 0", color: "#475569", fontSize: 13 }}>
                            Contact email shared: <strong>{note.email}</strong>
                          </p>
                        ) : null}

                        <div style={{ marginTop: 18, display: "grid", gap: 16 }}>
                          {note.replies.map((reply) => (
                            <div key={reply.id} style={{ padding: 18, borderRadius: 22, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Reply</p>
                              <p style={{ margin: "10px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{reply.content}</p>
                              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 12, color: "#64748b", fontSize: 13 }}>
                                <span>{formatTime(reply.createdAt)}</span>
                                {reply.replyEmail ? <span>Contact: {reply.replyEmail}</span> : null}
                              </div>
                            </div>
                          ))}

                          <div style={{ display: "grid", gap: 12 }}>
                            <button
                              type="button"
                              onClick={() => setReplyOpen((prev) => ({ ...prev, [note.id]: !prev[note.id] }))}
                              style={{ width: "fit-content", padding: "10px 18px", borderRadius: 999, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontWeight: 700, cursor: "pointer" }}
                            >
                              {replyOpen[note.id] ? "Hide reply form" : "Reply to this note"}
                            </button>

                            {replyOpen[note.id] ? (
                              <div style={{ display: "grid", gap: 12, padding: 18, borderRadius: 22, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                <label style={{ display: "grid", gap: 8, fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
                                  Your name
                                  <input
                                    value={replyName[note.id] || ""}
                                    onChange={(event) => setReplyName((prev) => ({ ...prev, [note.id]: event.target.value }))}
                                    placeholder="John Doe"
                                    style={{ width: "100%", minHeight: 44, padding: "0 14px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: 15 }}
                                  />
                                </label>
                                <label style={{ display: "grid", gap: 8, fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
                                  Email (optional)
                                  <input
                                    value={replyEmail[note.id] || ""}
                                    onChange={(event) => setReplyEmail((prev) => ({ ...prev, [note.id]: event.target.value }))}
                                    placeholder="reply@domain.com"
                                    style={{ width: "100%", minHeight: 44, padding: "0 14px", borderRadius: 16, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: 15 }}
                                  />
                                </label>
                                <label style={{ display: "grid", gap: 8, fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
                                  Reply
                                  <textarea
                                    value={replyText[note.id] || ""}
                                    onChange={(event) => setReplyText((prev) => ({ ...prev, [note.id]: event.target.value }))}
                                    placeholder="Write your reply here"
                                    rows={4}
                                    style={{ width: "100%", padding: 14, borderRadius: 18, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: 15, resize: "vertical" }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleReplySubmit(note.id)}
                                  disabled={posting}
                                  style={{ width: "fit-content", padding: "12px 24px", borderRadius: 999, border: "none", background: "#dc2626", color: "#fff", fontSize: 15, fontWeight: 700, cursor: posting ? "not-allowed" : "pointer", opacity: posting ? 0.7 : 1 }}
                                >
                                  {posting ? "Posting reply..." : "Post reply"}
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
          <aside style={{ padding: 28, borderRadius: 32, background: "#fff", border: "1px solid rgba(166,25,34,0.08)", boxShadow: "0 20px 50px rgba(125,16,23,0.08)" }}>
            <p style={{ margin: 0, color: "#a61922", fontWeight: 800, fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase" }}>Keep the conversation moving</p>
            <h2 style={{ margin: "16px 0 8px", fontSize: 24, color: "#1c1a1a" }}>A live public research space</h2>
            <p style={{ margin: 0, color: "#475569", fontSize: 15, lineHeight: 1.8 }}>
              This page is a shared feed for annotations and replies. You can post a new note with just your name, or reply to another researcher’s thought directly.
            </p>
            <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
              <div style={{ padding: 18, borderRadius: 22, background: "#fdf2f2", border: "1px solid rgba(166,25,34,0.08)", color: "#5f212c" }}>
                <strong>Fast publish</strong>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.7 }}>
                  Open the quick note window and share your annotation instantly.
                </p>
              </div>
              <div style={{ padding: 18, borderRadius: 22, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569" }}>
                <strong>Keep it concise</strong>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.7 }}>
                  Short notes connect the conversation more clearly and make replies easier to follow.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {isModalOpen ? (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,23,42,0.45)", display: "grid", placeItems: "center", padding: 24 }}>
            <div style={{ width: "min(760px,100%)", borderRadius: 32, overflow: "hidden", background: "#fff", boxShadow: "0 40px 90px rgba(15,23,42,0.22)" }}>
              <div style={{ padding: 28, background: "linear-gradient(135deg, #a61922, #bd1f28)", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.9 }}>New Annotation</p>
                    <h2 style={{ margin: "10px 0 0", fontSize: 28, lineHeight: 1.15 }}>Post a new marginal note</h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.26)", background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                  >
                    Close
                  </button>
                </div>
                <p style={{ margin: "14px 0 0", color: "rgba(255,255,255,0.88)", fontSize: 15, lineHeight: 1.75 }}>
                  Share your quick note for any article. Your name is required, email is optional.
                </p>
              </div>
              <div style={{ padding: 28, display: "grid", gap: 18, background: "#fff" }}>
                <label style={{ display: "grid", gap: 8, color: "#0f172a", fontWeight: 600, fontSize: 14 }}>
                  Article
                  <select
                    value={articleSlug}
                    onChange={(event) => setArticleSlug(event.target.value)}
                    style={{ width: "100%", minHeight: 44, padding: "0 14px", borderRadius: 16, border: "1px solid #e5e7eb", background: "#fff", color: "#0f172a", fontSize: 15 }}
                  >
                    {articleOptions.map((article) => (
                      <option key={article.slug} value={article.slug}>{article.title}</option>
                    ))}
                  </select>
                </label>

                <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
                  <label style={{ display: "grid", gap: 8, color: "#0f172a", fontWeight: 600, fontSize: 14 }}>
                    Your name
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      style={{ width: "100%", minHeight: 44, padding: "0 14px", borderRadius: 16, border: "1px solid #e5e7eb", background: "#fff", color: "#0f172a", fontSize: 15 }}
                    />
                  </label>
                  <label style={{ display: "grid", gap: 8, color: "#0f172a", fontWeight: 600, fontSize: 14 }}>
                    Email (optional)
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Add email to receive replies"
                      style={{ width: "100%", minHeight: 44, padding: "0 14px", borderRadius: 16, border: "1px solid #e5e7eb", background: "#fff", color: "#0f172a", fontSize: 15 }}
                    />
                  </label>
                </div>

                <label style={{ display: "grid", gap: 8, color: "#0f172a", fontWeight: 600, fontSize: 14 }}>
                  Comment
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Write your annotation here"
                    rows={5}
                    style={{ width: "100%", padding: 14, borderRadius: 18, border: "1px solid #e5e7eb", background: "#fff", color: "#0f172a", fontSize: 15, resize: "vertical", minHeight: 160 }}
                  />
                </label>

                {errorMessage ? (
                  <div style={{ padding: 14, borderRadius: 18, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}>{errorMessage}</div>
                ) : null}
                {successMessage ? (
                  <div style={{ padding: 14, borderRadius: 18, background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#047857" }}>{successMessage}</div>
                ) : null}

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{ padding: "12px 20px", borderRadius: 999, border: "1px solid #cbd5e1", background: "#f8fafc", color: "#0f172a", fontWeight: 700, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={posting}
                    style={{ padding: "12px 24px", borderRadius: 999, border: "none", background: "#a61922", color: "#fff", fontWeight: 700, cursor: posting ? "not-allowed" : "pointer", opacity: posting ? 0.7 : 1 }}
                  >
                    {posting ? "Posting..." : "Publish annotation"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
