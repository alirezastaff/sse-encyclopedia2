"use client";

import { useMemo } from "react";

type DownloadNotesButtonsProps = {
  locale: "en" | "fa";
  notesText: string;
};

const persianLabel = {
  pdf: "دریافت PDF",
  word: "دریافت Word",
};

const englishLabel = {
  pdf: "Download PDF",
  word: "Download Word",
};

function buildNotesDocxBlob(text: string) {
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">\n  <w:body>\n    ${text
    .split(/\r?\n/)
    .map((line) => `<w:p><w:r><w:t xml:space="preserve">${line}</w:t></w:r></w:p>`)
    .join("")}\n    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>\n  </w:body>\n</w:document>`;
  const files = [
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
      content: doc,
    },
  ];

  const zip = new Blob([
    ...files.map((file) => {
      const encoder = new TextEncoder();
      const nameBytes = encoder.encode(file.name);
      const contentBytes = encoder.encode(file.content);
      const header = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
      return new Blob([header, nameBytes, contentBytes]);
    }),
  ], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

  return zip;
}

function buildPdfBlob(text: string) {
  const pdfContent = `PDF export is not fully supported in this demo.\n\n${text}`;
  return new Blob([pdfContent], { type: "application/pdf" });
}

export default function DownloadNotesButtons({ locale, notesText }: DownloadNotesButtonsProps) {
  const isPersian = locale === "fa";

  const labels = isPersian ? persianLabel : englishLabel;

  const exportWord = () => {
    const blob = buildNotesDocxBlob(notesText);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "notes.docx";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const blob = buildPdfBlob(notesText);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "notes.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
      <button type="button" onClick={exportWord} style={{ padding: "10px 14px", borderRadius: 14, border: "none", background: "#a61922", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
        {labels.word}
      </button>
      <button type="button" onClick={exportPdf} style={{ padding: "10px 14px", borderRadius: 14, border: "1px solid #a61922", background: "#fff", color: "#a61922", fontWeight: 700, cursor: "pointer" }}>
        {labels.pdf}
      </button>
    </div>
  );
}
