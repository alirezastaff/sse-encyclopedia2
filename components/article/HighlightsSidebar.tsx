"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

type Highlight = {
  id: string;
  articleSlug: string;
  sectionId?: string | null;
  text: string;
  note?: string | null;
};

type HighlightsSidebarProps = {
  locale: "en" | "fa";
  highlights: Highlight[];
};

export default function HighlightsSidebar({ locale, highlights }: HighlightsSidebarProps) {
  const { status } = useSession();
  const isPersian = locale === "fa";

  if (status !== "authenticated" || highlights.length === 0) {
    return null;
  }

  return (
    <aside style={{ marginTop: 24, padding: 18, border: "1px solid #e9d7d5", borderRadius: 20, background: "#fff5f0" }}>
      <h2 style={{ margin: 0, marginBottom: 12, color: "#a61922", fontSize: 17, fontWeight: 800 }}>{isPersian ? "هایلایت‌های شما" : "Your highlights"}</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {highlights.map((highlight) => (
          <div key={highlight.id} style={{ padding: 14, borderRadius: 16, background: "#fff", border: "1px solid #f4d3d0" }}>
            <p style={{ margin: 0, fontSize: 14, color: "#2a2a2a", lineHeight: 1.7 }}>
              {highlight.text}
            </p>
            {highlight.note ? (
              <p style={{ margin: "10px 0 0", fontSize: 13, color: "#6d6d6d" }}>
                {isPersian ? "یادداشت:" : "Note:"} {highlight.note}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </aside>
  );
}
