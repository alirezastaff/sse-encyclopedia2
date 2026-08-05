"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

type ArticleNote = {
  id: string;
  articleSlug: string;
  content: string;
  groupId?: string | null;
  group?: { id: string; name: string } | null;
};

type NotesSidebarProps = {
  locale: "en" | "fa";
  notes: ArticleNote[];
};

export default function NotesSidebar({ locale, notes }: NotesSidebarProps) {
  const { status } = useSession();
  const isPersian = locale === "fa";

  if (status !== "authenticated" || notes.length === 0) {
    return null;
  }

  const grouped = notes.reduce<Record<string, ArticleNote[]>>((acc, note) => {
    const groupKey = note.group?.name ?? (isPersian ? "بدون گروه" : "Ungrouped");
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(note);
    return acc;
  }, {});

  return (
    <aside style={{ marginTop: 24, padding: 18, border: "1px solid #e9d7d5", borderRadius: 20, background: "#fffaf8" }}>
      <h2 style={{ margin: 0, marginBottom: 12, color: "#a61922", fontSize: 17, fontWeight: 800 }}>{isPersian ? "یادداشت‌های شما" : "Your notes"}</h2>
      {Object.entries(grouped).map(([groupName, groupNotes]) => (
        <div key={groupName} style={{ marginBottom: 18 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#4e1a1f", fontWeight: 700 }}>{groupName}</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {groupNotes.map((note) => (
              <div key={note.id} style={{ padding: 14, borderRadius: 16, background: "#fff", border: "1px solid #f4d3d0" }}>
                <p style={{ margin: 0, fontSize: 14, color: "#2a2a2a", lineHeight: 1.65 }}>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
