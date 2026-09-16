"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CaseStudy = {
  id?: number;
  slug?: string;
  title: string;
  place: string;
  type: string;
  category: string;
  summary: string;
  metric: string;
  pdfUrl?: string;
};

const caseStudies: CaseStudy[] = [
  { title: "Mondragon: democratic ownership at scale", place: "Basque Country, Spain", type: "Cooperative federation", category: "Work & ownership", summary: "A worker-owned network that connects manufacturing, finance, education, and research through shared governance.", metric: "80,000+ worker-members" },
  { title: "Community energy in Samsø", place: "Samsø, Denmark", type: "Renewable energy cooperative", category: "Climate & place", summary: "Residents turned local renewable infrastructure into a shared asset, keeping energy value and decisions close to the island.", metric: "100% renewable electricity" },
  { title: "The Grameen model of collective finance", place: "Bangladesh", type: "Community finance", category: "Finance & inclusion", summary: "Group-based lending demonstrates how trust, peer support, and small-scale capital can widen economic participation.", metric: "Millions reached through microfinance" },
  { title: "Cooperative care in Emilia-Romagna", place: "Italy", type: "Social cooperative", category: "Care & wellbeing", summary: "Social cooperatives combine professional care with member participation and strong local public partnerships.", metric: "Care delivered through local networks" },
  { title: "Waste pickers build circular livelihoods", place: "Belo Horizonte, Brazil", type: "Recycling cooperative", category: "Environment & livelihoods", summary: "Organized waste pickers improve working conditions while making the social and environmental value of recycling visible.", metric: "Circular economy with dignified work" },
  { title: "Preston: community wealth building", place: "Lancashire, United Kingdom", type: "Local economic strategy", category: "Local development", summary: "Anchor institutions redirect procurement and investment toward local suppliers, cooperatives, and community ownership.", metric: "More local spending retained" },
];

const faCaseStudies: CaseStudy[] = [
  { title: "موندراگون: مالکیت دموکراتیک در مقیاس بزرگ", place: "سرزمین باسک، اسپانیا", type: "فدراسیون تعاونی", category: "کار و مالکیت", summary: "شبکه‌ای متعلق به کارکنان که تولید، امور مالی، آموزش و پژوهش را از طریق حکمرانی مشترک به هم پیوند می‌دهد.", metric: "بیش از ۸۰٬۰۰۰ عضوِ شاغل" },
  { title: "انرژی اجتماعی در سامسو", place: "سامسو، دانمارک", type: "تعاونی انرژی تجدیدپذیر", category: "اقلیم و مکان", summary: "ساکنان زیرساخت انرژی تجدیدپذیر محلی را به دارایی مشترک تبدیل کردند تا ارزش و تصمیم‌گیری انرژی در جزیره باقی بماند.", metric: "برق صددرصد تجدیدپذیر" },
  { title: "الگوی گرامین برای تأمین مالی جمعی", place: "بنگلادش", type: "تأمین مالی اجتماعی", category: "مالی و مشارکت", summary: "وام‌دهی گروهی نشان می‌دهد اعتماد، حمایت همتا و سرمایه کوچک‌مقیاس چگونه مشارکت اقتصادی را گسترش می‌دهد.", metric: "دسترسی میلیون‌ها نفر به تأمین مالی خرد" },
  { title: "مراقبت تعاونی در امیلیا-رومانیا", place: "ایتالیا", type: "تعاونی اجتماعی", category: "مراقبت و رفاه", summary: "تعاونی‌های اجتماعی مراقبت حرفه‌ای را با مشارکت اعضا و همکاری نیرومند با نهادهای عمومی محلی ترکیب می‌کنند.", metric: "ارائه مراقبت از طریق شبکه‌های محلی" },
  { title: "جمع‌آوران پسماند و معیشت چرخشی", place: "بلو هوریزونته، برزیل", type: "تعاونی بازیافت", category: "محیط زیست و معیشت", summary: "جمع‌آوران سازمان‌یافته پسماند شرایط کار را بهبود می‌دهند و ارزش اجتماعی و زیست‌محیطی بازیافت را آشکار می‌کنند.", metric: "اقتصاد چرخشی همراه با کار شایسته" },
  { title: "پرستون: ساخت ثروت اجتماعی", place: "لنکشر، بریتانیا", type: "راهبرد اقتصادی محلی", category: "توسعه محلی", summary: "نهادهای لنگر خرید و سرمایه‌گذاری را به سوی تأمین‌کنندگان محلی، تعاونی‌ها و مالکیت اجتماعی هدایت می‌کنند.", metric: "ماندگاری بیشتر هزینه‌کرد در اقتصاد محلی" },
];

function localizeCount(value: number, locale: "en" | "fa") {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}

export default function CaseStudiesHub({ locale = "en" }: { locale?: "en" | "fa" }) {
  const isPersian = locale === "fa";
  const fallbackStudies = isPersian ? faCaseStudies : caseStudies;
  const [remoteStudies, setRemoteStudies] = useState<CaseStudy[] | null>(null);
  useEffect(() => {
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "");
    if (!wordpressUrl) return;
    fetch(`${wordpressUrl}/wp-json/sse/v1/case-studies?locale=${locale}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Case studies request failed")))
      .then((items: CaseStudy[]) => setRemoteStudies(items))
      .catch(() => setRemoteStudies(null));
  }, [locale]);
  const studies = remoteStudies && remoteStudies.length > 0 ? remoteStudies : fallbackStudies;
  const allCategory = isPersian ? "همه" : "All";
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const categories = [allCategory, ...Array.from(new Set(studies.map((study) => study.category)))];
  const visibleStudies = useMemo(() => activeCategory === allCategory ? studies : studies.filter((study) => study.category === activeCategory), [activeCategory, allCategory, studies]);

  return (
    <main className="case-page" dir={isPersian ? "rtl" : "ltr"}>
      <style>{`
        .case-page { --ink:#182527; --muted:#617174; --paper:#fffdf8; --line:#d9e4df; --teal:#0d6961; --coral:#e46852; min-height:100vh; padding:32px clamp(18px,5vw,76px) 72px; color:var(--ink); background:radial-gradient(circle at 90% 0%,#d9eee7 0,transparent 32%),linear-gradient(145deg,#f5f0e6,#edf5f1); font-family:"Vazirmatn",Tahoma,Arial,sans-serif; }
        .case-shell { max-width:1280px; margin:0 auto; }
        .case-nav { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:68px; }
        .case-brand { color:var(--ink); font-weight:800; text-decoration:none; letter-spacing:.04em; }
        .case-back { color:var(--teal); text-decoration:none; font-size:14px; font-weight:700; }
        .case-hero { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr); gap:48px; align-items:end; margin-bottom:54px; }
        .case-kicker { color:var(--coral); font-size:12px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
        .case-hero h1 { max-width:760px; margin:12px 0 18px; font-size:clamp(42px,7vw,92px); line-height:.95; letter-spacing:-.06em; }
        .case-hero p { max-width:650px; margin:0; color:var(--muted); font-size:18px; line-height:1.8; }
        .case-signal { padding:24px; border-left:4px solid var(--coral); background:rgba(255,253,248,.72); }
        .case-signal strong { display:block; margin-bottom:8px; color:var(--teal); font-size:28px; }
        .case-signal span { color:var(--muted); line-height:1.6; }
        .case-toolbar { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:22px; }
        .case-filter { padding:9px 14px; border:1px solid var(--line); border-radius:999px; color:var(--teal); background:rgba(255,255,255,.55); cursor:pointer; font:inherit; }
        .case-filter.active,.case-filter:hover { color:#fff; border-color:var(--teal); background:var(--teal); }
        .case-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .case-card { display:flex; flex-direction:column; min-height:300px; padding:24px; border:1px solid var(--line); background:var(--paper); box-shadow:0 18px 34px rgba(30,70,60,.08); transition:transform .2s ease,box-shadow .2s ease; }
        .case-card:hover { transform:translateY(-5px); box-shadow:0 24px 42px rgba(30,70,60,.14); }
        .case-card-top { display:flex; justify-content:space-between; gap:12px; color:var(--coral); font-size:12px; font-weight:800; }
        .case-card h2 { margin:30px 0 10px; font-size:24px; line-height:1.2; }
        .case-place { margin:0 0 14px; color:var(--teal); font-size:13px; font-weight:800; }
        .case-card p { margin:0; color:var(--muted); line-height:1.7; }
        .case-metric { margin-top:auto; padding-top:24px; color:var(--ink); font-size:13px; font-weight:800; }
        .case-pdf { display:inline-block; margin-top:16px; color:var(--teal); font-size:13px; font-weight:800; text-decoration:none; }
        .case-footer { display:flex; flex-wrap:wrap; justify-content:space-between; gap:18px; margin-top:52px; padding-top:22px; border-top:1px solid var(--line); color:var(--muted); }
        .case-footer a { color:var(--teal); font-weight:800; text-decoration:none; }
        @media(max-width:900px){.case-hero{grid-template-columns:1fr;gap:24px}.case-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:580px){.case-page{padding:22px 16px 48px}.case-nav{margin-bottom:48px}.case-hero h1{font-size:54px}.case-grid{grid-template-columns:1fr}.case-card{min-height:260px}}
      `}</style>
      <div className="case-shell">
        <nav className="case-nav"><Link className="case-brand" href={isPersian ? "/fa" : "/en"}>{isPersian ? "اقتصاد اجتماعی / یادداشت‌های میدانی" : "SSE / FIELD NOTES"}</Link><Link className="case-back" href={isPersian ? "/fa" : "/en"}>{isPersian ? "بازگشت به دانشنامه" : "Back to encyclopedia"}</Link></nav>
        <header className="case-hero">
          <div><div className="case-kicker">{isPersian ? "کتابخانه‌ای زنده از تجربه‌ها" : "A living library of practice"}</div><h1>{isPersian ? "مرکز مطالعات موردی" : "Case Studies Hub"}</h1><p>{isPersian ? "با سازمان‌ها و جوامعی آشنا شوید که همبستگی را به نظام‌هایی پایدار برای کار، مراقبت، اقدام اقلیمی و رونق محلی تبدیل می‌کنند." : "Meet the organizations and communities turning solidarity into durable systems of work, care, climate action, and local prosperity."}</p></div>
          <div className="case-signal"><strong>{localizeCount(studies.length, locale)} {isPersian ? "یادداشت میدانی" : "field notes"}</strong><span>{isPersian ? "نقطه‌های آغازینِ گردآوری‌شده برای پژوهشگران، کنشگران، تأمین‌کنندگان مالی و هر کسی که برای ساخت اقتصادی دموکراتیک‌تر تلاش می‌کند." : "Curated starting points for researchers, organizers, funders, and anyone building a more democratic economy."}</span></div>
        </header>
        <div className="case-toolbar" aria-label={isPersian ? "فیلتر مطالعات موردی" : "Filter case studies"}>{categories.map((category) => <button className={`case-filter ${activeCategory === category ? "active" : ""}`} key={category} type="button" onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
        <section className="case-grid" aria-live="polite">{visibleStudies.map((study) => <article className="case-card" key={study.slug ?? study.title}><div className="case-card-top"><span>{study.type}</span><span>↗</span></div><h2>{study.title}</h2><p className="case-place">{study.place}</p><p>{study.summary}</p><div className="case-metric">{study.metric}</div>{study.pdfUrl && <a className="case-pdf" href={study.pdfUrl} target="_blank" rel="noreferrer">{isPersian ? "دریافت PDF مطالعه" : "Download case study PDF"}</a>}</article>)}</section>
        <footer className="case-footer"><span>{isPersian ? "با رشد این مرکز، روایت‌های بیشتری افزوده خواهد شد." : "More stories will be added as the hub grows."}</span><Link href={isPersian ? "/fa/impact-calculator" : "/en/impact-calculator"}>{isPersian ? "اثرگذاری فعالیت خود را بسنجید ←" : "Measure the impact of your own work →"}</Link></footer>
      </div>
    </main>
  );
}
