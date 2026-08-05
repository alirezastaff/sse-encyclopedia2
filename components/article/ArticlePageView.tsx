"use client";

import Link from "next/link";
import { type ElementType, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { type ArticleLocale, getLocalizedArticle } from "@/lib/articles";

type ArticlePageViewProps = {
  locale: ArticleLocale;
  slug: string;
};

type Section = {
  id: string;
  kind: "heading" | "paragraph";
  text: string;
};

function classifySection(text: string): "heading" | "paragraph" {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return "paragraph";
  if (/^(BOX|REFERENCES)\b/i.test(normalized)) return "heading";
  if (/^[۰-۹\d]+([.)]|[IVX]+[.)])/.test(normalized)) return "heading";
  const englishHeading = /^[A-Z][A-Za-z0-9\s&’'()\-:,.]+$/.test(normalized) && normalized.length < 90;
  const persianHeading = /^[\u0600-\u06FF\s۰-۹،؛:؟«»"'().\-]+$/.test(normalized) && normalized.length < 90;
  if (englishHeading || persianHeading) return "heading";
  return "paragraph";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function crc32(input: Uint8Array) {
  let crc = 0xffffffff;
  input.forEach((byte) => {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function createSimpleZip(files: Array<{ name: string; content: string }>) {
  const encoder = new TextEncoder();
  const localFileHeaders: string[] = [];
  const centralDirectory: string[] = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const contentBytes = encoder.encode(file.content);
    const crc = crc32(contentBytes);

    const localHeader = [
      0x04034b50,
      20,
      0,
      0,
      0,
      0,
      crc,
      contentBytes.length,
      contentBytes.length,
      nameBytes.length,
      0,
    ]
      .map((value) => String.fromCharCode((value >>> 0) & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff))
      .join("");

    localFileHeaders.push(localHeader + String.fromCharCode(...nameBytes) + String.fromCharCode(...contentBytes));
    offset += 30 + nameBytes.length + contentBytes.length;

    const centralHeader = [
      0x02014b50,
      20,
      20,
      0,
      0,
      0,
      0,
      crc,
      contentBytes.length,
      contentBytes.length,
      nameBytes.length,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]
      .map((value) => String.fromCharCode((value >>> 0) & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff))
      .join("");

    centralDirectory.push(centralHeader + String.fromCharCode(...nameBytes));
  });

  const endRecord = [
    0x06054b50,
    0,
    0,
    files.length,
    files.length,
    centralDirectory.join("").length,
    offset,
    0,
  ]
    .map((value) => String.fromCharCode((value >>> 0) & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff))
    .join("");

  return localFileHeaders.join("") + centralDirectory.join("") + endRecord;
}

function buildWordDocumentXml(text: string) {
  const paragraphs = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const body = paragraphs.length
    ? paragraphs
        .map((paragraph) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(paragraph)}</w:t></w:r></w:p>`)
        .join("")
    : '<w:p><w:r><w:t xml:space="preserve"></w:t></w:r></w:p>';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function localizeDigits(value: string | number, locale: string) {
  if (locale !== "fa") {
    return String(value);
  }

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/\d/g, (digit) => persianDigits[Number(digit)]);
}

function buildNotesDocxBlob(text: string) {
  const documentXml = buildWordDocumentXml(text);
  const zipFiles = [
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
    },
    {
      name: "word/document.xml",
      content: documentXml,
    },
  ];

  const zipData = createSimpleZip(zipFiles);
  return new Blob([zipData], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}

export default function ArticlePageView({ locale, slug }: ArticlePageViewProps) {
  const { status, data: session } = useSession();
  const article = getLocalizedArticle(slug, locale);
  const isPersian = locale === "fa";
  const storageKey = `article-notes-${locale}-${slug}`;
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      return window.localStorage.getItem("app-dark-mode") === "true";
    } catch {
      return false;
    }
  });
  const [isNotesEnabled, setIsNotesEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    try {
      return window.localStorage.getItem(`${storageKey}-enabled`) !== "false";
    } catch {
      return true;
    }
  });
  const [notesText, setNotesText] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    try {
      return window.localStorage.getItem(storageKey) ?? "";
    } catch {
      return "";
    }
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const sections = useMemo<Section[]>(() => {
    if (!article) return [];
    return article.body
      .filter((text, index) => index !== 0 || text.trim() !== article.title.trim())
      .map((text, index) => ({
        id: `section-${index}`,
        kind: classifySection(text),
        text,
      }));
  }, [article]);

  const referenceStartIndex = sections.findIndex(
    (section) => section.kind === "heading" && /^references$/i.test(section.text.trim())
  );

  const articleSections = referenceStartIndex === -1 ? sections : sections.slice(0, referenceStartIndex);
  const referenceSections = referenceStartIndex === -1 ? [] : sections.slice(referenceStartIndex);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, notesText);
    } catch {
      // ignore storage failures
    }
  }, [notesText, storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(`${storageKey}-enabled`, String(isNotesEnabled));
    } catch {
      // ignore storage failures
    }
  }, [isNotesEnabled, storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem("app-dark-mode", String(isDarkMode));
    } catch {
      // ignore storage failures
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);


  useEffect(() => {
    if (!feedbackMessage) {
      return;
    }

    const timeout = window.setTimeout(() => setFeedbackMessage(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [feedbackMessage]);

  const handleTextSelection = () => {
    // no highlight selection in this simplified note mode
  };

  const saveNote = async () => {
    if (!notesText.trim()) {
      setFeedbackMessage(isPersian ? "ابتدا متنی برای ذخیره وارد کنید." : "Enter some note text first.");
      setFeedbackType("error");
      return;
    }
    if (status !== "authenticated") {
      setFeedbackMessage(isPersian ? "برای ذخیره کردن یادداشت باید وارد شوید." : "Sign in to save notes.");
      setFeedbackType("error");
      return;
    }

    setIsSavingNote(true);

    const savePayload = { articleSlug: slug, content: notesText };
    const publicNotePayload = {
      name: session?.user?.name?.trim() || session?.user?.email || "Anonymous",
      email: session?.user?.email || undefined,
      articleSlug: slug,
      content: notesText,
    };

    try {
      const [articleResponse, marginalResponse] = await Promise.all([
        fetch("/api/article/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savePayload),
        }),
        fetch("/api/marginal-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(publicNotePayload),
        }),
      ]);

      if (articleResponse.ok && marginalResponse.ok) {
        setFeedbackMessage(isPersian ? "یادداشت شما در حاشیه نگاری ذخیره شد." : "Your note has been saved to Marginal Notes.");
        setFeedbackType("success");
      } else if (articleResponse.ok && !marginalResponse.ok) {
        setFeedbackMessage(isPersian ? "یادداشت شما ذخیره شد، اما در فید حاشیه نمایش داده نشد." : "Note saved, but it could not be published to Marginal Notes.");
        setFeedbackType("error");
      } else if (!articleResponse.ok && marginalResponse.ok) {
        setFeedbackMessage(isPersian ? "یادداشت در فید حاشیه منتشر شد، اما ذخیره محلی مقاله با خطا مواجه شد." : "Published to Marginal Notes, but article note save failed.");
        setFeedbackType("error");
      } else {
        setFeedbackMessage(isPersian ? "ذخیره یادداشت با خطا مواجه شد." : "Unable to save note.");
        setFeedbackType("error");
      }
    } catch {
      setFeedbackMessage(isPersian ? "خطا در ارسال یادداشت." : "Note save failed.");
      setFeedbackType("error");
    } finally {
      setIsSavingNote(false);
    }

    const blob = buildNotesDocxBlob(notesText.trim());
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}-notes.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!article) {
    return (
      <main style={{ padding: 40, fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif" }}>
        <h1>{locale === "fa" ? "مقاله یافت نشد" : "Article not found"}</h1>
        <p>{locale === "fa" ? "این مقاله در پایگاه داده موجود نیست." : "This article is not available yet."}</p>
        <Link href={`/${locale}/archive`} style={{ color: "#a61922" }}>
          {locale === "fa" ? "بازگشت به آرشیو" : "Back to archive"}
        </Link>
      </main>
    );
  }

  const oppositeLocale = locale === "en" ? "fa" : "en";


  const downloadArticle = () => {
    const articleHtml = articleSections
      .map((section) => {
        if (section.kind === "heading") {
          return `<h2>${escapeHtml(localizeDigits(section.text, locale))}</h2>`;
        }

        return `<div><p>${escapeHtml(localizeDigits(section.text, locale))}</p></div>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(localizeDigits(article.title, locale))}</title>
    <style>
      body { font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #222; padding: 32px; background: #f7f1ec; }
      h1, h2, h3 { color: #221f1f; font-weight: 800; }
      p { margin: 0 0 1em; }
      .section { margin-bottom: 24px; padding: 18px; background: #fff; border: 1px solid rgba(0,0,0,0.04); border-radius: 18px; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(localizeDigits(article.title, locale))}</h1>
    <p><strong>${escapeHtml(localizeDigits(article.description, locale))}</strong></p>
    ${articleHtml}
  </body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearNotes = () => {
    setNotesText("");
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore storage failures
    }
  };

  return (
    <main
      dir={isPersian ? "rtl" : "ltr"}
      style={{ padding: 32, maxWidth: 1100, margin: "0 auto", fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif", lineHeight: 1.8, textAlign: isPersian ? "right" : "left", color: isDarkMode ? "#e0e0e0" : "#000", background: isDarkMode ? "#0b0e16" : undefined, minHeight: "100vh", transition: "background-color 0.3s ease, color 0.3s ease" }}
    >
      <div style={{ marginBottom: 24 }}>
        <Link href={`/${locale}/archive`} style={{ color: "#a61922", textDecoration: "none", fontWeight: 700 }}>
          ← {locale === "fa" ? "بازگشت به آرشیو" : "Back to archive"}
        </Link>
      </div>

      <div style={{ border: isDarkMode ? "1px solid #232b38" : "1px solid rgba(0,0,0,0.04)", borderRadius: 18, padding: 24, background: isDarkMode ? "#10151f" : "#f6ebdc" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", padding: "6px 10px", borderRadius: 999, background: isDarkMode ? "#1e2733" : "#fbf7f1", color: isDarkMode ? "#d0d0d0" : "#7d1017", fontWeight: 800, fontSize: 13 }}>
            {localizeDigits(article.category, locale)}
          </span>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Link href={`/${locale}/articles/${slug}`} style={{ padding: "8px 12px", borderRadius: 999, background: "#a61922", color: "#fff", textDecoration: "none", fontWeight: 700 }}>
              {locale === "fa" ? "نسخه فعلی" : "Current version"}
            </Link>
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              suppressHydrationWarning
              style={{ position: "relative", display: "inline-flex", alignItems: "center", width: 50, height: 26, borderRadius: 999, background: isDarkMode ? "#3a3a3a" : "#ddd", border: "none", cursor: "pointer", padding: 0, transition: "background-color 0.3s ease" }}
            >
              <span style={{ position: "absolute", width: 22, height: 22, borderRadius: 999, background: isDarkMode ? "#161b24" : "#fff", left: isDarkMode ? 24 : 2, transition: "left 0.3s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }} />
            </button>
            <Link href={`/${oppositeLocale}/articles/${slug}`} style={{ padding: "8px 12px", borderRadius: 999, border: `1px solid ${isDarkMode ? "#333" : "#eadfda"}`, color: isDarkMode ? "#e0e0e0" : "#7d1017", textDecoration: "none", fontWeight: 700 }}>
              {locale === "fa" ? "English version" : "نسخه فارسی"}
            </Link>
          </div>
        </div>

        <h1 style={{ margin: "0 0 8px", fontSize: 32, lineHeight: 1.4, color: isDarkMode ? "#f0f0f0" : "#221f1f", fontWeight: 800 }}>{localizeDigits(article.title, locale)}</h1>
        <p style={{ margin: "0 0 16px", color: isDarkMode ? "#aaa" : "#686868", fontSize: 15 }}>{localizeDigits(article.description, locale)}</p>

        <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={downloadArticle}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 16px", borderRadius: 999, background: "linear-gradient(135deg, #8f141c, #bd2731)", color: "#fff", textDecoration: "none", fontWeight: 800, boxShadow: "0 10px 20px rgba(155, 23, 29, 0.18)", border: "none", cursor: "pointer" }}
          >
            {isPersian ? "دانلود خروجی مقاله" : "Download article"}
          </button>
          <Link
            href="/profile"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 16px", borderRadius: 999, background: "#fff", color: "#a61922", border: "1px solid rgba(166,25,34,0.22)", textDecoration: "none", fontWeight: 800, boxShadow: "0 8px 18px rgba(166,25,34,0.12)" }}
          >
            {isPersian ? "حاشیه نگاری" : "Marginal Notes"}
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div style={{ border: `1px solid ${isDarkMode ? "#28313f" : "#eadfda"}`, borderRadius: 12, padding: 12, background: isDarkMode ? "#151a24" : "#f8efe3" }}>
            <strong style={{ display: "block", color: isDarkMode ? "#ff7a8a" : "#7d1017", marginBottom: 4 }}>
              {locale === "fa" ? "نویسنده" : "Author"}
            </strong>
            <span style={{ color: isDarkMode ? "#d0d0d0" : "#000" }}>{localizeDigits(article.author, locale)}</span>
          </div>
          <div style={{ border: `1px solid ${isDarkMode ? "#28313f" : "#eadfda"}`, borderRadius: 12, padding: 12, background: isDarkMode ? "#151a24" : "#f8efe3" }}>
            <strong style={{ display: "block", color: isDarkMode ? "#ff7a8a" : "#7d1017", marginBottom: 4 }}>
              {locale === "fa" ? "صفحه شروع" : "Start page"}
            </strong>
            <span style={{ color: isDarkMode ? "#d0d0d0" : "#000" }}>{localizeDigits(article.startPage, locale)}</span>
          </div>
          <div style={{ border: `1px solid ${isDarkMode ? "#28313f" : "#eadfda"}`, borderRadius: 12, padding: 12, background: isDarkMode ? "#151a24" : "#f8efe3" }}>
            <strong style={{ display: "block", color: isDarkMode ? "#ff7a8a" : "#7d1017", marginBottom: 4 }}>
              {locale === "fa" ? "دسته‌بندی" : "Category"}
            </strong>
            <span style={{ color: isDarkMode ? "#d0d0d0" : "#000" }}>{localizeDigits(article.category, locale)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap", flexDirection: isPersian ? "row-reverse" : "row" }}>
          <article id="article-body" style={{ flex: "1 1 640px", minWidth: 0 }} onMouseUp={handleTextSelection} onTouchEnd={handleTextSelection}>
            {articleSections.map((section) => {
              if (section.kind === "heading") {
                const headingLevel = section.text.length < 60 ? 3 : 2;
                const HeadingTag = `h${headingLevel}` as ElementType;
                return (
                  <HeadingTag
                    key={section.id}
                    style={{ margin: "24px 0 10px", color: isDarkMode ? "#f0f0f0" : "#221f1f", fontWeight: 800, lineHeight: 1.4, fontSize: headingLevel === 3 ? "1.05rem" : "1.25rem" }}
                  >
                    {localizeDigits(section.text, locale)}
                  </HeadingTag>
                );
              }

              return (
                <section key={section.id} style={{ marginBottom: 20, padding: 18, borderRadius: 18, background: isDarkMode ? "#1a1a1a" : "#f8efe3", border: `1px solid ${isDarkMode ? "#333" : "rgba(0,0,0,0.04)"}` }}>
                  <p style={{ margin: 0, fontSize: 16, color: isDarkMode ? "#d0d0d0" : "#262626", textAlign: "justify", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                    {localizeDigits(section.text, locale)}
                  </p>
                </section>
              );
            })}
          </article>

          <aside style={{ flex: "0 0 min(320px, 100%)", width: "min(320px, 100%)", border: `1px solid ${isDarkMode ? "#333" : "rgba(125,16,23,0.12)"}`, borderRadius: 20, padding: 24, background: isDarkMode ? "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)" : "linear-gradient(135deg, #fcf7ee 0%, #f4e9dc 100%)", boxShadow: isDarkMode ? "0 16px 36px rgba(0,0,0,0.5)" : "0 16px 36px rgba(125,16,23,0.08)", position: "sticky", top: 24, maxHeight: "min(600px, 85vh)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: isDarkMode ? "#ff7a8a" : "#7d1017", fontWeight: 800 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 999, background: isDarkMode ? "rgba(255,122,138,0.2)" : "rgba(166,25,34,0.12)", fontSize: 14 }}>✎</span>
                  <span>{isPersian ? "جعبه ابزار حاشیه‌نگاری" : "Marginal Notes toolbox"}</span>
                </div>
              <button
                type="button"
                onClick={() => setIsNotesEnabled(!isNotesEnabled)}
                suppressHydrationWarning
                style={{ position: "relative", display: "inline-flex", alignItems: "center", width: 50, height: 26, borderRadius: 999, background: isNotesEnabled ? "#a61922" : isDarkMode ? "#444" : "#ddd", border: "none", cursor: "pointer", padding: 0, transition: "background-color 0.3s ease" }}
              >
                <span style={{ position: "absolute", width: 22, height: 22, borderRadius: 999, background: "#fff", left: isNotesEnabled ? 24 : 2, transition: "left 0.3s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.7, color: isDarkMode ? "#b3b3b3" : "#6f5d49", background: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)", border: `1px solid ${isDarkMode ? "#232b38" : "rgba(125,16,23,0.08)"}`, borderRadius: 14, padding: "10px 12px" }}>
              {isPersian
                ? "این بخش برای ذخیره و به‌اشتراک‌گذاری یادداشت‌های شما با دیگران است. پس از ثبت، یک نسخه روی دستگاه شما ذخیره می‌شود و نسخه‌ای در بخش حاشیه‌نگاری برای عموم منتشر می‌گردد."
                : "Save and share short notes publicly. When you publish, one copy is saved to your device and another is posted to the Marginal Notes feed."}
            </div>
            <textarea
              value={notesText}
              onChange={(event) => setNotesText(event.target.value)}
              disabled={!isNotesEnabled}
              placeholder={isPersian ? "یادداشت نوشتن..." : "Write your note..."}
              style={{ width: "calc(100% - 22px)", flex: 1, minHeight: 240, resize: "none", border: isDarkMode ? "1px solid #2b3240" : "1px solid rgba(125,16,23,0.12)", borderRadius: 14, padding: 12, marginLeft: 8, background: isNotesEnabled ? (isDarkMode ? "#1e222d" : "#fffdf9") : (isDarkMode ? "#15171f" : "#f5f5f5"), color: isNotesEnabled ? (isDarkMode ? "#e0e0e0" : "#262626") : (isDarkMode ? "#777" : "#999"), fontSize: 14, lineHeight: 1.8, fontFamily: "inherit", overflowY: "auto", boxShadow: isDarkMode ? "inset 0 1px 3px rgba(0,0,0,0.3)" : "inset 0 1px 3px rgba(125,16,23,0.05)", opacity: isNotesEnabled ? 1 : 0.6 }}
            />
            <button
              type="button"
              onClick={saveNote}
              disabled={!notesText.trim() || !isNotesEnabled}
              style={{ width: "100%", border: "none", borderRadius: 999, padding: "12px 14px", background: "#a61922", color: "#fff", cursor: (!notesText.trim() || !isNotesEnabled) ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13, opacity: (!notesText.trim() || !isNotesEnabled) ? 0.6 : 1 }}
            >
              {isPersian ? "ذخیره یادداشت" : "Save note"}
            </button>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <button
                type="button"
                onClick={handleClearNotes}
                disabled={!notesText.trim()}
                style={{ width: "100%", borderRadius: 999, padding: "12px 14px", background: isDarkMode ? "#2a2e3a" : "#fff", color: isDarkMode ? "#e0e0e0" : "#a61922", cursor: !notesText.trim() ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13, border: `1px solid ${isDarkMode ? "#222" : "rgba(166,25,34,0.18)"}` }}
              >
                {isPersian ? "پاک کردن یادداشت" : "Clear note"}
              </button>
            </div>
            {feedbackMessage ? (
              <div style={{ marginTop: 12, borderRadius: 18, background: feedbackType === "success" ? "#f3fbf6" : "#fff1f0", border: `1px solid ${feedbackType === "success" ? "rgba(64, 160, 80, 0.18)" : "rgba(220, 53, 69, 0.18)"}`, color: feedbackType === "success" ? "#2b6d35" : "#842029", padding: 14, fontSize: 14 }}>
                {feedbackMessage}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
      {referenceSections.length > 0 ? (
        <section style={{ marginTop: 32, fontSize: 14, lineHeight: 1.7, color: isDarkMode ? "#c4c4c4" : "#4a4a4a", background: isDarkMode ? "#10131a" : "transparent", padding: isDarkMode ? "20px 22px 18px" : undefined, borderRadius: isDarkMode ? 18 : undefined }}>
          {referenceSections.map((section) => {
            if (section.kind === "heading") {
              return (
                <h3 key={section.id} style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: isDarkMode ? "#f0f0f0" : "#221f1f" }}>
                  {localizeDigits(section.text, locale)}
                </h3>
              );
            }
            return (
              <p key={section.id} style={{ margin: "0 0 10px", fontSize: 14, color: isDarkMode ? "#c4c4c4" : "#4a4a4a", textAlign: isPersian ? "right" : "left" }}>
                {localizeDigits(section.text, locale)}
              </p>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
