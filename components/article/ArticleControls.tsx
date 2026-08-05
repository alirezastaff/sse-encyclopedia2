"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

type ArticleControlsProps = {
  slug: string;
  locale: "en" | "fa";
  isBookmarked: boolean;
  isInReadingList: boolean;
  readingStatus: "to-read" | "reading" | "completed";
  progressValue: number;
  onToggleBookmark: () => void;
  onToggleReadingList: () => void;
  onChangeStatus: (status: "to-read" | "reading" | "completed") => void;
  onSaveProgress: () => void;
};

const statusLabels = {
  "to-read": { en: "To read", fa: "برای خواندن" },
  reading: { en: "Reading", fa: "در حال خواندن" },
  completed: { en: "Completed", fa: "خوانده شده" },
};

export default function ArticleControls({
  slug,
  locale,
  isBookmarked,
  isInReadingList,
  readingStatus,
  progressValue,
  onToggleBookmark,
  onToggleReadingList,
  onChangeStatus,
  onSaveProgress,
}: ArticleControlsProps) {
  const { status } = useSession();
  const canEdit = status === "authenticated";
  const isPersian = locale === "fa";

  const buttonLabel = useMemo(() => {
    if (!canEdit) {
      return isPersian ? "برای ذخیره وارد شوید" : "Sign in to save";
    }
    if (isBookmarked) {
      return isPersian ? "نشانک شده" : "Bookmarked";
    }
    return isPersian ? "افزودن به نشانک" : "Add bookmark";
  }, [canEdit, isBookmarked, isPersian]);

  return (
    <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" onClick={onToggleBookmark} disabled={!canEdit} style={{ flex: "1 1 180px", minWidth: 160, padding: "12px 14px", borderRadius: 14, border: "1px solid #a61922", background: canEdit ? (isBookmarked ? "#a61922" : "#fff") : "#f3f2f0", color: canEdit ? (isBookmarked ? "#fff" : "#a61922") : "#8b8b8b", cursor: canEdit ? "pointer" : "not-allowed", fontWeight: 700 }}>
          {buttonLabel}
        </button>
        <button type="button" onClick={onToggleReadingList} disabled={!canEdit} style={{ flex: "1 1 180px", minWidth: 160, padding: "12px 14px", borderRadius: 14, border: "1px solid #a61922", background: canEdit ? (isInReadingList ? "#a61922" : "#fff") : "#f3f2f0", color: canEdit ? (isInReadingList ? "#fff" : "#a61922") : "#8b8b8b", cursor: canEdit ? "pointer" : "not-allowed", fontWeight: 700 }}>
          {isPersian ? (isInReadingList ? "در فهرست خواندن" : "افزودن به فهرست خواندن") : isInReadingList ? "In reading list" : "Add to reading list"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={() => onChangeStatus("to-read")} disabled={!canEdit} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #a61922", background: readingStatus === "to-read" ? "#a61922" : "#fff", color: readingStatus === "to-read" ? "#fff" : "#a61922", cursor: canEdit ? "pointer" : "not-allowed", fontWeight: 700 }}>
            {statusLabels["to-read"][locale]}
          </button>
          <button type="button" onClick={() => onChangeStatus("reading")} disabled={!canEdit} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #a61922", background: readingStatus === "reading" ? "#a61922" : "#fff", color: readingStatus === "reading" ? "#fff" : "#a61922", cursor: canEdit ? "pointer" : "not-allowed", fontWeight: 700 }}>
            {statusLabels.reading[locale]}
          </button>
          <button type="button" onClick={() => onChangeStatus("completed")} disabled={!canEdit} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #a61922", background: readingStatus === "completed" ? "#a61922" : "#fff", color: readingStatus === "completed" ? "#fff" : "#a61922", cursor: canEdit ? "pointer" : "not-allowed", fontWeight: 700 }}>
            {statusLabels.completed[locale]}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ color: "#444", fontWeight: 700 }}>{isPersian ? "پیشرفت مطالعه" : "Reading progress"}: {Math.round(progressValue)}%</span>
          <button type="button" onClick={onSaveProgress} disabled={!canEdit} style={{ padding: "10px 14px", borderRadius: 14, border: "none", background: "#a61922", color: "#fff", fontWeight: 700, cursor: canEdit ? "pointer" : "not-allowed" }}>
            {isPersian ? "ذخیره موقعیت" : "Save position"}
          </button>
        </div>
      </div>
    </div>
  );
}
