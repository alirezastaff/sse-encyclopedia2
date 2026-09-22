"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

type KnowledgeSearchProps = {
  locale: "fa" | "en";
};

export default function KnowledgeSearch({ locale }: KnowledgeSearchProps) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const isFa = locale === "fa";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) setSubmittedQuery(query.trim());
  }

  return (
    <div className="knowledge-search-wrap">
      <form className="knowledge-search" onSubmit={handleSubmit}>
        <Search className="search-glass" aria-hidden="true" />
        <input
          className="search-placeholder"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={isFa ? "جست‌وجوی مقاله، کشور، موضوع، نویسنده یا کلیدواژه..." : "Search articles, countries, topics, authors or keywords..."}
          aria-label={isFa ? "جست‌وجو" : "Search"}
          dir={isFa ? "rtl" : "ltr"}
        />
        <span className="search-divider" aria-hidden="true" />
        <span className="search-filter">{isFa ? "همه محتوا　⌄" : "All content　⌄"}</span>
        <span className="search-divider" aria-hidden="true" />
        <span className="search-filter">{isFa ? "همه دسته‌ها　⌄" : "All categories　⌄"}</span>
      </form>
      {submittedQuery && (
        <p className="search-feedback" role="status">
          {isFa ? "ماشین جست‌وجوی پیشرفته در حال توسعه است." : "The advanced search engine is currently in development."}
        </p>
      )}
    </div>
  );
}
