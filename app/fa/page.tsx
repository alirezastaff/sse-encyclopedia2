import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  FilePenLine,
  Globe2,
  Search,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getHomepageContent } from "@/lib/homepage";

type HomeCard = readonly [string, string, string, string, string, string, string, LucideIcon];

const cards: readonly HomeCard[] = [
  ["دانشنامه اقتصاد اجتماعی", "دانشنامه اقتصاد اجتماعی", "مقالات عمیق، مفاهیم کلیدی و نظریه‌های بنیادین در اقتصاد اجتماعی و همبستگی.", "ورود به دانشنامه", "/fa/archive", "/homepage/encyclopedia.png", "card-large encyclopedia", BookOpen],
  ["حاشیه‌نگار", "حاشیه‌نگار", "یادداشت‌های کوتاه، تأملات و دیدگاه‌های منتخب درباره ایده‌ها و بحث‌های اقتصاد اجتماعی.", "مشاهده یادداشت‌ها", "/fa/profile", "/homepage/marginalia.jpg", "card-large notes", FilePenLine],
  ["کاوشگر کشورها", "کاوشگر کشورها", "داده‌ها و نمایه‌های اقتصاد اجتماعی را در کشورهای مختلف و مناطق جهان بررسی کنید.", "ورود به اطلس", "/fa/country-explorer", "/homepage/country-explorer.jpg", "card-small country", Globe2],
  ["مرکز مطالعات موردی", "مرکز مطالعات موردی", "نمونه‌های واقعی از اثرگذاری، نوآوری و راهکارهای فراگیر از سراسر جهان.", "مشاهده مطالعات", "/fa/case-studies", "/homepage/case-studies.jpg", "card-small case-studies", UsersRound],
   ["محاسبه‌گر اثرگذاری", "محاسبه‌گر اثرگذاری", "اثر اجتماعی و اقتصادی ایده‌ها، پروژه‌ها و سیاست‌های خود را برآورد کنید.", "محاسبه اثرگذاری", "/fa/impact-calculator", "/homepage/impact-calculator.jpg", "card-small impact", Calculator],
];


export default async function FaHomePage() {
  await getHomepageContent("fa");

  return (
    <main className="knowledge-home" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tanha:wght@700;800;900&family=Vazirmatn:wght@400;500;600;700;800&display=swap');
        .knowledge-home { --ink:#092b2b; --green:#075c55; --cream:#f7f7f1; --muted:#526878; min-height:100vh; background:var(--cream); color:var(--ink); direction:rtl; text-align:right; font-family:'Vazir','Vazirmatn',Tahoma,sans-serif; overflow:hidden; }
        .knowledge-shell { max-width:1380px; margin:0 auto; padding:28px 36px 42px; }
        .knowledge-header { display:flex; align-items:center; gap:38px; min-height:72px; }
        .knowledge-logo { width:270px; display:block; }
        .knowledge-nav { display:flex; align-items:center; justify-content:flex-start; flex:0 1 auto; gap:28px; }
        .knowledge-nav a { display:inline-flex; align-items:center; gap:5px; color:var(--ink); text-decoration:none; white-space:nowrap; font-size:12px; }
        .knowledge-nav a:first-child { border-bottom:2px solid var(--green); padding:21px 0 12px; }
        .knowledge-tools { display:flex; align-items:center; gap:20px; margin-right:auto; }
        .language-switch { display:flex; border:1px solid #c9d0ce; border-radius:25px; overflow:hidden; }
        .language-switch span { display:block; padding:8px 15px; font-size:11px; }
        .language-switch .active { color:#fff; background:var(--green); }
        .top-search { width:17px; height:17px; }
        .knowledge-hero { position:relative; min-height:300px; padding:39px 0 22px; }
        .hero-copy { position:relative; z-index:2; max-width:750px; }
        .hero-kicker { color:var(--green); font-size:10px; font-weight:700; letter-spacing:0; word-spacing:4px; margin-bottom:16px; }
        .hero-kicker span { color:#68817c; }
        .hero-copy h1 { max-width:700px; margin:0; font-family:'Tanha','Vazirmatn',Tahoma,sans-serif; font-size:clamp(3.1rem,4.8vw,4.8rem); line-height:1.08; font-weight:800; letter-spacing:0; }
        .hero-copy p { max-width:500px; margin:16px 0 0; color:var(--muted); font-size:14px; line-height:1.9; }
        .hero-image { position:absolute; left:0; bottom:-10px; width:500px; }
        .hero-image img { width:100%; display:block; transform:scaleX(-1); }
        .knowledge-search { display:flex; align-items:center; gap:17px; width:68%; height:58px; margin:0 0 28px; padding:0 19px 0 8px; border:1px solid #e5e7e0; border-radius:34px; background:#fff; box-shadow:0 8px 22px rgba(22,55,49,.06); color:var(--muted); direction:rtl; box-sizing:border-box; }
        .search-glass { width:17px; color:var(--green); flex:none; }
        .search-placeholder { flex:1; font-size:11px; text-align:right; }
        .search-divider { width:1px; height:24px; flex:none; background:#e1e4df; }
        .search-filter { padding:0 16px; font-size:11px; white-space:nowrap; }
        .search-submit { display:grid; place-items:center; width:43px; height:43px; border-radius:50%; background:var(--green); color:#fff; }
        .knowledge-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; }
        .knowledge-card { position:relative; min-height:220px; overflow:hidden; border-radius:16px; background:#174a45; color:#fff; text-align:right; }
        .knowledge-card:after { content:''; position:absolute; inset:0; background:linear-gradient(-90deg,rgba(2,24,23,.86),rgba(2,24,23,.2)); }
        .knowledge-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transform:scaleX(-1); }
        .knowledge-card .card-content { position:relative; z-index:2; display:flex; flex-direction:column; align-items:flex-start; min-height:220px; padding:20px 22px 18px; }
        .card-large { grid-column:span 3; min-height:250px; }
        .card-large .card-content { min-height:250px; }
        .notes:after { background:linear-gradient(-90deg,rgba(20,26,20,.82),rgba(20,26,20,.15)); }
        .notes img { object-position:center 68%; }
        .card-small { grid-column:span 2; }
        .country:after { background:linear-gradient(-90deg,rgba(1,42,44,.88),rgba(4,82,78,.22)); }
        .country img { object-position:right center; }
        .case-studies:after { background:linear-gradient(-90deg,rgba(53,34,17,.82),rgba(36,42,27,.18)); }
        .case-studies img { object-position:center bottom; }
        .impact:after { background:linear-gradient(-90deg,rgba(2,49,34,.88),rgba(9,86,63,.15)); }
        .impact img { object-position:left center; }
        .card-heading { display:flex; align-items:center; gap:8px; }
        .card-icon { display:grid; place-items:center; width:25px; height:25px; flex:none; border-radius:50%; background:rgba(5,91,83,.96); }
        .card-icon svg { width:14px; height:14px; }
        .card-label { display:flex; align-items:center; padding:5px 9px; border:1px solid rgba(255,255,255,.8); border-radius:18px; font-size:9px; letter-spacing:0; }
        .knowledge-card h2 { max-width:330px; margin:13px 0 5px; font-size:29px; line-height:1.25; font-weight:700; }
        .card-small h2 { font-size:23px; }
        .knowledge-card p { max-width:255px; margin:0; font-size:12px; line-height:1.65; }
        .card-button { display:inline-flex; align-items:center; gap:12px; margin-top:auto; padding:8px 13px; border-radius:25px; background:#fff; color:var(--ink); text-decoration:none; font-size:10px; font-weight:700; white-space:nowrap; }
        .card-button svg { width:14px; height:14px; }
        @media (min-width:761px) and (max-height:900px) {
          .knowledge-shell { padding:18px 30px 24px; }
          .knowledge-header { min-height:54px; gap:22px; }
          .knowledge-logo { width:220px; }
          .knowledge-nav { gap:22px; }
          .knowledge-nav a { font-size:11px; }
          .knowledge-nav a:first-child { padding:12px 0 8px; }
          .knowledge-tools { gap:12px; }
          .language-switch span { padding:6px 11px; }
          .knowledge-hero { min-height:170px; padding:12px 0 6px; }
          .hero-kicker { margin-bottom:10px; }
          .hero-copy h1 { font-size:clamp(2.7rem,4.6vw,3.6rem); }
          .hero-copy p { margin-top:10px; font-size:13px; }
          .hero-image { width:410px; bottom:-5px; }
          .knowledge-search { width:64%; height:42px; margin-bottom:14px; gap:10px; padding:0 12px 0 6px; }
          .search-divider { height:20px; }
          .search-filter { padding:0 10px; }
          .search-submit { width:32px; height:32px; }
          .knowledge-grid { gap:8px; }
          .knowledge-card { min-height:165px; }
          .card-large, .card-large .card-content { min-height:190px; }
          .knowledge-card .card-content { min-height:165px; padding:13px 16px 12px; }
          .card-heading { gap:6px; }
          .card-icon { width:22px; height:22px; }
          .card-icon svg { width:12px; height:12px; }
          .card-label { padding:4px 7px; font-size:9px; }
          .knowledge-card h2 { margin:8px 0 4px; font-size:22px; }
          .card-small h2 { font-size:19px; }
          .knowledge-card p { font-size:11px; line-height:1.5; }
          .card-button { gap:8px; padding:5px 9px; font-size:9px; }
          .card-button svg { width:12px; height:12px; }
        }
        @media (max-width:1100px) {
          .knowledge-shell { padding:24px; }
          .knowledge-logo { width:230px; }
          .knowledge-header { gap:22px; }
          .knowledge-nav { gap:18px; }
          .knowledge-nav a { font-size:10px; }
          .hero-image { left:0; opacity:.6; }
          .knowledge-search { width:68%; }
          .hero-copy h1 { font-size:clamp(3rem,6vw,5rem); }
        }
        @media (max-width:760px) {
          .knowledge-shell { padding:18px 16px 30px; }
          .knowledge-header { align-items:flex-start; flex-wrap:wrap; gap:18px; }
          .knowledge-logo { width:230px; }
          .knowledge-nav { order:3; flex-basis:100%; overflow:auto; padding-bottom:7px; justify-content:flex-start; }
          .knowledge-nav a:first-child { padding:8px 0; }
          .knowledge-tools { margin-right:auto; }
          .knowledge-hero { min-height:410px; padding-top:34px; }
          .hero-copy h1 { font-size:clamp(3rem,14vw,4.5rem); }
          .hero-image { width:470px; left:0; bottom:0; opacity:.45; }
          .knowledge-search { width:100%; height:auto; min-height:58px; flex-wrap:wrap; padding:12px 16px; gap:10px; }
          .search-placeholder { min-width:calc(100% - 42px); }
          .search-filter { display:none; }
          .search-submit { width:40px; height:40px; margin-right:auto; }
          .knowledge-grid { grid-template-columns:1fr; }
          .card-large,.card-small { grid-column:auto; min-height:250px; }
          .card-large .card-content, .knowledge-card .card-content { min-height:250px; }
        }
      `}</style>
      <div className="knowledge-shell">
        <header className="knowledge-header">
          <Link href="/fa"><img className="knowledge-logo" src="/homepage/persian-logo.png" alt="پلتفرم دانشی اقتصاد اجتماعی و همبستگی" /></Link>
          <nav className="knowledge-nav"><Link href="/fa">خانه</Link><Link href="#platform-introduction">معرفی پلتفرم</Link><Link href="#about-us">درباره ما</Link><Link href="#contact-us">تماس با ما</Link></nav>
          <div className="knowledge-tools"><div className="language-switch"><Link href="/en"><span>EN</span></Link><span className="active">FA</span></div><Search className="top-search" aria-hidden="true" /></div>
        </header>
        <section className="knowledge-hero"><div className="hero-copy"><div className="hero-kicker">روایتی جامع از دانش و تجربه اقتصاد اجتماعی</div><h1>پلتفرم دانشی اقتصاد اجتماعی</h1><p>مرجعی جامع برای دسترسی به مفاهیم، نظریه‌ها، پژوهش‌ها، تجربه‌ها و منابع تخصصی در حوزه اقتصاد اجتماعی و همبستگی</p></div><div className="hero-image"><img src="/homepage/city.png" alt="چشم‌انداز شهر و جامعه" /></div></section>
        <div className="knowledge-search"><Search className="search-glass" aria-hidden="true" /><span className="search-placeholder">جست‌وجوی مقاله، کشور، موضوع، نویسنده یا کلیدواژه...</span><span className="search-divider" aria-hidden="true" /><span className="search-filter">همه محتوا　⌄</span><span className="search-divider" aria-hidden="true" /><span className="search-filter">همه دسته‌ها　⌄</span><span className="search-submit"><Search size={17} /></span></div>
        <section className="knowledge-grid">{cards.map(([label, title, text, action, href, image, className, Icon]) => <article className={`knowledge-card ${className}`} key={title}><img src={image} alt="" /><div className="card-content"><div className="card-heading"><span className="card-icon"><Icon aria-hidden="true" /></span><span className="card-label">{label}</span></div><h2>{title}</h2><p>{text}</p><Link className="card-button" href={href}>{action}<ArrowLeft /></Link></div></article>)}</section>
      </div>
    </main>
  );
}
