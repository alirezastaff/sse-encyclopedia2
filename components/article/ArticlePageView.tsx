"use client";

import Link from "next/link";
import { type ElementType, useEffect, useMemo, useState } from "react";
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
  const article = getLocalizedArticle(slug, locale);
  const isPersian = locale === "fa";
  const storageKey = `article-notes-${locale}-${slug}`;
  const [userRating, setUserRating] = useState(0);
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

  const handleTextSelection = () => {
    if (!isNotesEnabled) {
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText) {
      return;
    }

    setNotesText((previous) => `${previous}${previous ? "\n\n" : ""}• ${selectedText}`);
    selection?.removeAllRanges();
  };

  const handleExportNotes = () => {
    if (!notesText.trim()) {
      return;
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
          return `<h2>${escapeHtml(section.text)}</h2>`;
        }

        return `<div><p>${escapeHtml(section.text)}</p></div>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(article.title)}</title>
    <style>
      body { font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #222; padding: 32px; background: #f7f1ec; }
      h1, h2, h3 { color: #221f1f; font-weight: 800; }
      p { margin: 0 0 1em; }
      .section { margin-bottom: 24px; padding: 18px; background: #fff; border: 1px solid rgba(0,0,0,0.04); border-radius: 18px; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(article.title)}</h1>
    <p><strong>${escapeHtml(article.description)}</strong></p>
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

  return (
    <main
      dir={isPersian ? "rtl" : "ltr"}
      style={{ padding: 32, maxWidth: 1100, margin: "0 auto", fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif", lineHeight: 1.8, textAlign: isPersian ? "right" : "left", color: isDarkMode ? "#e0e0e0" : "#000", minHeight: "100vh", transition: "color 0.3s ease" }}
    >
      <div style={{ marginBottom: 24 }}>
        <Link href={`/${locale}/archive`} style={{ color: "#a61922", textDecoration: "none", fontWeight: 700 }}>
          ← {locale === "fa" ? "بازگشت به آرشیو" : "Back to archive"}
        </Link>
      </div>

      <div style={{ border: "1px solid rgba(0,0,0,0.04)", borderRadius: 18, padding: 24, background: "#f6ebdc" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", padding: "6px 10px", borderRadius: 999, background: "#fbf7f1", color: "#7d1017", fontWeight: 800, fontSize: 13 }}>
            {article.category}
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
              <span style={{ position: "absolute", width: 22, height: 22, borderRadius: 999, background: "#fff", left: isDarkMode ? 24 : 2, transition: "left 0.3s ease", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }} />
            </button>
            <Link href={`/${oppositeLocale}/articles/${slug}`} style={{ padding: "8px 12px", borderRadius: 999, border: `1px solid ${isDarkMode ? "#333" : "#eadfda"}`, color: isDarkMode ? "#e0e0e0" : "#7d1017", textDecoration: "none", fontWeight: 700 }}>
              {locale === "fa" ? "نسخه انگلیسی" : "Persian version"}
            </Link>
          </div>
        </div>

        <h1 style={{ margin: "0 0 8px", fontSize: 32, lineHeight: 1.4, color: isDarkMode ? "#f0f0f0" : "#221f1f", fontWeight: 800 }}>{article.title}</h1>
        <p style={{ margin: "0 0 16px", color: isDarkMode ? "#aaa" : "#686868", fontSize: 15 }}>{article.description}</p>

        <div style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={downloadArticle}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 16px", borderRadius: 999, background: "linear-gradient(135deg, #8f141c, #bd2731)", color: "#fff", textDecoration: "none", fontWeight: 800, boxShadow: "0 10px 20px rgba(155, 23, 29, 0.18)", border: "none", cursor: "pointer" }}
          >
            {isPersian ? "دانلود خروجی مقاله" : "Download article"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div style={{ border: `1px solid ${isDarkMode ? "#333" : "#eadfda"}`, borderRadius: 12, padding: 12, background: isDarkMode ? "#1a1a1a" : "#f8efe3" }}>
            <strong style={{ display: "block", color: isDarkMode ? "#ff7a8a" : "#7d1017", marginBottom: 4 }}>
              {locale === "fa" ? "نویسنده" : "Author"}
            </strong>
            <span style={{ color: isDarkMode ? "#d0d0d0" : "#000" }}>{article.author}</span>
          </div>
          <div style={{ border: `1px solid ${isDarkMode ? "#333" : "#eadfda"}`, borderRadius: 12, padding: 12, background: isDarkMode ? "#1a1a1a" : "#f8efe3" }}>
            <strong style={{ display: "block", color: isDarkMode ? "#ff7a8a" : "#7d1017", marginBottom: 4 }}>
              {locale === "fa" ? "صفحه شروع" : "Start page"}
            </strong>
            <span style={{ color: isDarkMode ? "#d0d0d0" : "#000" }}>{article.startPage}</span>
          </div>
          <div style={{ border: `1px solid ${isDarkMode ? "#333" : "#eadfda"}`, borderRadius: 12, padding: 12, background: isDarkMode ? "#1a1a1a" : "#f8efe3" }}>
            <strong style={{ display: "block", color: isDarkMode ? "#ff7a8a" : "#7d1017", marginBottom: 4 }}>
              {locale === "fa" ? "دسته‌بندی" : "Category"}
            </strong>
            <span style={{ color: isDarkMode ? "#d0d0d0" : "#000" }}>{article.category}</span>
          </div>
        </div>

        <div style={{ border: `1px solid ${isDarkMode ? "#333" : "#eadfda"}`, borderRadius: 14, padding: 14, background: isDarkMode ? "#1a1a1a" : "#f8efe3", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, color: isDarkMode ? "#ff7a8a" : "#7d1017", marginBottom: 8 }}>
            {isPersian ? "امتیازدهی به این مدخل" : "Rate this entry"}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setUserRating(value)}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 24, color: value <= userRating ? "#f1b444" : isDarkMode ? "#555" : "#d7d0c7" }}
                aria-label={`${value} star`}
              >
                ★
              </button>
            ))}
            <span style={{ marginRight: 8, color: "#686868", fontSize: 14 }}>
              {userRating > 0 ? `${userRating}/5` : (isPersian ? "هنوز امتیازی ثبت نشده" : "No rating yet")}
            </span>
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
                    {section.text}
                  </HeadingTag>
                );
              }

              return (
                <section key={section.id} style={{ marginBottom: 20, padding: 18, borderRadius: 18, background: isDarkMode ? "#1a1a1a" : "#f8efe3", border: `1px solid ${isDarkMode ? "#333" : "rgba(0,0,0,0.04)"}` }}>
                  <p style={{ margin: 0, fontSize: 16, color: isDarkMode ? "#d0d0d0" : "#262626", textAlign: "justify", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                    {section.text}
                  </p>
                </section>
              );
            })}
          </article>

          <aside style={{ flex: "0 0 min(320px, 100%)", width: "min(320px, 100%)", border: `1px solid ${isDarkMode ? "#333" : "rgba(125,16,23,0.12)"}`, borderRadius: 20, padding: 24, background: isDarkMode ? "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)" : "linear-gradient(135deg, #fcf7ee 0%, #f4e9dc 100%)", boxShadow: isDarkMode ? "0 16px 36px rgba(0,0,0,0.5)" : "0 16px 36px rgba(125,16,23,0.08)", position: "sticky", top: 24, maxHeight: "min(600px, 85vh)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: isDarkMode ? "#ff7a8a" : "#7d1017", fontWeight: 800 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 999, background: isDarkMode ? "rgba(255,122,138,0.2)" : "rgba(166,25,34,0.12)", fontSize: 14 }}>✎</span>
                <span>{isPersian ? "کادر یادداشت" : "Notes"}</span>
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
            <div style={{ fontSize: 12, lineHeight: 1.7, color: isDarkMode ? "#999" : "#6f5d49", background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.55)", border: `1px solid ${isDarkMode ? "#333" : "rgba(125,16,23,0.08)"}`, borderRadius: 14, padding: "10px 12px" }}>
              {isPersian
                ? "این بخش برای یادداشت‌برداری است. می‌توانید بخش‌هایی از متن مدخل را انتخاب کنید تا به‌صورت خودکار به اینجا اضافه شوند. متن نوشته‌شده در این کادر بعد از رفرش صفحه در مرورگر باقی می‌ماند، اما بهتر است خروجی Word بگیرید."
                : "This area is for note-taking. You can select passages from the article and they will be added here automatically. Notes remain in your browser after a refresh, but it is better to export them to Word."}
            </div>
            <textarea
              value={notesText}
              onChange={(event) => setNotesText(event.target.value)}
              disabled={!isNotesEnabled}
              placeholder={isPersian ? "متن خود را اینجا بنویسید..." : "Write your notes here..."}
              style={{ width: "calc(100% - 22px)", flex: 1, minHeight: 400, resize: "none", border: "1px solid rgba(125,16,23,0.12)", borderRadius: 14, padding: 12, marginLeft: 8, background: isNotesEnabled ? (isDarkMode ? "#2a2a2a" : "#fffdf9") : (isDarkMode ? "#1f1f1f" : "#f5f5f5"), color: isNotesEnabled ? (isDarkMode ? "#e0e0e0" : "#262626") : (isDarkMode ? "#666" : "#999"), fontSize: 14, lineHeight: 1.8, fontFamily: "inherit", overflowY: "auto", boxShadow: isDarkMode ? "inset 0 1px 3px rgba(0,0,0,0.3)" : "inset 0 1px 3px rgba(125,16,23,0.05)", opacity: isNotesEnabled ? 1 : 0.6 }}
            />
            <button
              type="button"
              onClick={handleExportNotes}
              disabled={!notesText.trim() || !isNotesEnabled}
              suppressHydrationWarning
              style={{ width: "100%", border: "none", borderRadius: 999, padding: "9px 12px", background: "#a61922", color: "#fff", cursor: (notesText.trim() && isNotesEnabled) ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 13, opacity: (notesText.trim() && isNotesEnabled) ? 1 : 0.7 }}
            >
              {isPersian ? "دریافت سند" : "Download document"}
            </button>
          </aside>
        </div>

        <div style={{ marginTop: 24, borderTop: "1px solid #eadfda", paddingTop: 20 }}>
          <button
            type="button"
            onClick={downloadArticle}
            style={{ border: "none", background: "#a61922", color: "#fff", padding: "10px 14px", borderRadius: 999, cursor: "pointer", fontWeight: 800 }}
          >
            {isPersian ? "دانلود خروجی نهایی" : "Download final output"}
          </button>
        </div>
      </div>
      {referenceSections.length > 0 ? (
        <section style={{ marginTop: 32, fontSize: 14, lineHeight: 1.7, color: "#4a4a4a" }}>
          {referenceSections.map((section) => {
            if (section.kind === "heading") {
              return (
                <h3 key={section.id} style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#221f1f" }}>
                  {section.text}
                </h3>
              );
            }
            return (
              <p key={section.id} style={{ margin: "0 0 10px", fontSize: 14, color: "#4a4a4a", textAlign: isPersian ? "right" : "left" }}>
                {section.text}
              </p>
            );
          })}
        </section>
      ) : null}
    </main>
  );
}
