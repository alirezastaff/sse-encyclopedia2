import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FilePenLine,
  Globe2,
  Search,
  UsersRound,
} from "lucide-react";
import KnowledgeSearch from "@/components/homepage/KnowledgeSearch";
import { getHomepageContent } from "@/lib/homepage";

const cards = [
  ["SSE ENCYCLOPEDIA", "Social Economy Encyclopedia", "In-depth articles, key concepts and foundational theories in social economy and solidarity.", "Explore encyclopedia", "/en/archive", "/homepage/encyclopedia.png", "card-large encyclopedia", BookOpen],
  ["MARGINALIA", "Marginalia", "A space for dialogue, exchanging views, and sharing ideas about the social and solidarity economy.", "In development", "/profile", "/homepage/marginalia.jpg", "card-large notes", FilePenLine],
  ["ATLAS", "Atlas", "Track the social and economic situation of countries around the world with the Social Economy and Solidarity Atlas.", "Explore atlas", "/en/country-explorer", "/homepage/country-explorer.jpg", "card-small country", Globe2],
  ["SOLIDARITY EXPERIENCES", "Solidarity Experiences", "Introducing and examining successful social and solidarity economy examples from around the world.", "View experiences", "/en/case-studies", "/homepage/case-studies.jpg", "card-small case-studies", UsersRound],
  ["IMPACT CALCULATOR", "Impact Calculator", "Estimate the social and economic impact of your ideas, projects and policies.", "Calculate impact", "/en/impact-calculator", "/homepage/impact-calculator.jpg", "card-small impact", Calculator],
] as const;

export default async function EnHomePage() {
  await getHomepageContent("en");

  return (
    <main className="knowledge-home" dir="ltr">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        .knowledge-home { --ink:#092b2b; --green:#075c55; --cream:#f7f7f1; --muted:#526878; min-height:100vh; background:var(--cream); color:var(--ink); direction:ltr; text-align:left; font-family:'DM Sans',sans-serif; overflow:hidden; }
        .knowledge-shell { max-width:1380px; margin:0 auto; padding:28px 36px 42px; }
        .knowledge-header { display:flex; align-items:center; gap:38px; min-height:72px; }
        .knowledge-logo { width:270px; display:block; }
        .knowledge-nav { display:flex; align-items:center; justify-content:flex-start; flex:0 1 auto; gap:28px; }
        .knowledge-nav a { display:inline-flex; align-items:center; gap:5px; color:var(--ink); text-decoration:none; white-space:nowrap; font-size:12px; }
        .sse-about-section { position:relative; display:grid; width:100%; height:100svh; min-height:560px; box-sizing:border-box; place-items:center; overflow:hidden; padding:32px 24px; color:rgba(255,255,255,.96); background:#123b3b url('/bgaboutus.png') center center / cover no-repeat; }
        .sse-about-section::before { content:''; position:absolute; inset:0; background:rgba(5,38,36,.24); pointer-events:none; }
        .sse-about-panel { position:relative; z-index:1; display:grid; width:min(1100px,94vw); max-height:calc(100svh - 104px); grid-template-columns:280px 1px minmax(0,1.55fr); gap:42px; align-items:center; padding:42px 56px; border:1px solid rgba(235,255,246,.46); border-radius:28px; background:rgba(76,137,122,.22); box-shadow:0 20px 60px rgba(2,32,28,.22),inset 0 1px 0 rgba(235,255,246,.24); backdrop-filter:blur(18px) saturate(112%); -webkit-backdrop-filter:blur(18px) saturate(112%); }
        .sse-about-mark { display:grid; width:280px; justify-items:start; gap:14px; align-content:center; }
        .sse-about-mark img { display:block; width:280px; height:280px; object-fit:contain; object-position:left center; }
        .sse-about-kicker { width:280px; margin:0; color:rgba(235,255,246,.78); font-size:10px; letter-spacing:2.4px; line-height:1.6; text-transform:uppercase; white-space:nowrap; }
        .sse-about-mark h2 { width:280px; margin:0; color:#fff; font:500 clamp(2rem,3.4vw,3.2rem)/1.02 'Manrope','Avenir Next',Arial,sans-serif; letter-spacing:-1.5px; }
        .sse-about-divider { width:1px; height:230px; background:rgba(235,255,246,.55); }
        .sse-about-copy { min-width:0; }
        .sse-about-copy h3 { margin:0 0 20px; color:rgba(255,255,255,.96); font:500 clamp(1.8rem,2.5vw,2.45rem)/1.1 'Manrope','Avenir Next',Arial,sans-serif; letter-spacing:-1px; }
        .sse-about-copy p { margin:0 0 13px; color:rgba(245,255,250,.82); font:400 13px/1.55 'Manrope','Avenir Next',Arial,sans-serif; text-align:justify; text-justify:inter-word; }
        .sse-about-copy p:last-child { margin-bottom:0; }
        .sse-about-caption { position:absolute; right:46px; bottom:24px; z-index:2; display:flex; gap:10px; align-items:center; margin:0; color:rgba(245,255,250,.72); font:400 9px/1.3 'Manrope','Avenir Next',Arial,sans-serif; letter-spacing:1.2px; }
        .sse-about-caption::before { content:''; display:block; width:24px; height:1px; background:rgba(235,255,246,.58); }
        .sse-about-caption span:first-child { font-family:'Vazirmatn',Tahoma,sans-serif; letter-spacing:0; }
        .knowledge-nav a svg { width:12px; height:12px; color:#55706c; }
        .knowledge-nav a:first-child { border-bottom:2px solid var(--green); padding:21px 0 12px; }
        .knowledge-tools { display:flex; align-items:center; gap:20px; }
        .language-switch { display:flex; border:1px solid #c9d0ce; border-radius:25px; overflow:hidden; }
        .language-switch span { display:block; padding:8px 15px; font-size:11px; }
        .language-switch .active { color:#fff; background:var(--green); }
        .top-search { width:17px; height:17px; }
        .knowledge-hero { position:relative; min-height:300px; padding:39px 0 22px; }
        .hero-copy { position:relative; z-index:2; max-width:750px; }
        .hero-kicker { color:var(--green); font-size:10px; font-weight:700; letter-spacing:2px; word-spacing:9px; margin-bottom:16px; }
        .hero-kicker span { color:#68817c; }
        .hero-copy h1 { max-width:700px; margin:0; font:normal clamp(3.4rem,5.3vw,5.25rem)/.91 'DM Serif Display',Georgia,serif; letter-spacing:-2px; }
        .hero-copy p { max-width:470px; margin:20px 0 0; color:var(--muted); font-size:13px; line-height:1.5; }
        .hero-image { position:absolute; right:0; bottom:0; width:430px; max-width:36vw; z-index:1; pointer-events:none; }
        .hero-image img { width:100%; display:block; object-fit:contain; }
        .knowledge-search-wrap { display:flex; flex-wrap:wrap; align-items:center; gap:12px; width:68%; margin:0 0 28px; }
        .knowledge-search { display:flex; align-items:center; gap:17px; width:100%; min-width:0; height:58px; margin:0; padding:0 8px 0 19px; border:1px solid #e5e7e0; border-radius:34px; background:#fff; box-shadow:0 8px 22px rgba(22,55,49,.06); color:var(--muted); direction:ltr; box-sizing:border-box; }
        .search-glass { width:17px; color:var(--green); flex:none; }
        .search-placeholder { flex:1; min-width:0; border:0; outline:0; color:var(--ink); font:inherit; font-size:11px; text-align:left; }
        .search-placeholder::placeholder { color:var(--muted); opacity:1; }
        .search-divider { width:1px; height:24px; flex:none; background:#e1e4df; }
        .search-filter { padding:0 16px; font-size:11px; white-space:nowrap; }
        .search-submit { display:grid; place-items:center; flex:none; width:43px; height:43px; border:0; border-radius:50%; background:var(--green); color:#fff; cursor:pointer; }
        .search-feedback { margin:0; color:var(--green); font-size:12px; font-weight:700; }
        .knowledge-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; }
        .knowledge-card { position:relative; min-height:220px; overflow:hidden; border-radius:16px; background:#174a45; color:#fff; text-align:left; }
        .knowledge-card:after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,rgba(2,24,23,.86),rgba(2,24,23,.2)); }
        .knowledge-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
        .knowledge-card .card-content { position:relative; z-index:2; display:flex; flex-direction:column; align-items:flex-start; min-height:220px; padding:20px 22px 18px; }
        .card-large { grid-column:span 3; min-height:250px; }
        .card-large .card-content { min-height:250px; }
        .notes:after { background:linear-gradient(90deg,rgba(20,26,20,.82),rgba(20,26,20,.15)); }
        .notes img { object-position:center 68%; }
        .card-small { grid-column:span 2; }
        .country:after { background:linear-gradient(90deg,rgba(1,42,44,.88),rgba(4,82,78,.22)); }
        .country img { object-position:left center; }
        .case-studies:after { background:linear-gradient(90deg,rgba(53,34,17,.82),rgba(36,42,27,.18)); }
        .case-studies img { object-position:center bottom; }
        .impact:after { background:linear-gradient(90deg,rgba(2,49,34,.88),rgba(9,86,63,.15)); }
        .impact img { object-position:right center; }
        .card-heading { display:flex; align-items:center; gap:8px; }
        .card-icon { display:grid; place-items:center; width:25px; height:25px; flex:none; border-radius:50%; background:rgba(5,91,83,.96); }
        .card-icon svg { width:14px; height:14px; }
        .card-label { display:flex; align-items:center; padding:5px 9px; border:1px solid rgba(255,255,255,.8); border-radius:18px; font-size:9px; letter-spacing:1px; }
        .knowledge-card h2 { max-width:330px; margin:13px 0 5px; font:normal 29px/1 'DM Serif Display',Georgia,serif; }
        .card-small h2 { font-size:23px; }
        .knowledge-card p { max-width:255px; margin:0; font-size:11px; line-height:1.35; }
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
          .hero-copy h1 { font-size:clamp(3rem,5vw,4rem); }
          .hero-copy p { margin-top:12px; }
          .hero-image { width:300px; bottom:0; }
          .knowledge-search-wrap { width:64%; margin-bottom:14px; }
          .knowledge-search { height:42px; gap:10px; padding:0 6px 0 12px; }
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
          .card-label { padding:4px 7px; font-size:8px; }
          .knowledge-card h2 { margin:10px 0 5px; font-size:23px; }
          .card-small h2 { font-size:20px; }
          .knowledge-card p { font-size:10px; line-height:1.25; }
          .card-button { gap:8px; padding:5px 9px; font-size:9px; }
          .card-button svg { width:12px; height:12px; }
        }
        @media (max-width:1100px) {
          .knowledge-shell { padding:24px; }
          .knowledge-logo { width:230px; }
          .knowledge-header { gap:22px; }
          .knowledge-nav { gap:18px; }
          .knowledge-nav a { font-size:10px; }
          .hero-image { right:0; width:380px; opacity:.6; }
          .knowledge-search-wrap { width:68%; }
          .hero-copy h1 { font-size:clamp(3rem,6vw,5rem); }
        }
        @media (max-width:760px) {
          .knowledge-shell { padding:18px 16px 30px; }
          .knowledge-header { align-items:flex-start; flex-wrap:wrap; gap:18px; }
          .knowledge-logo { width:230px; }
          .knowledge-nav { order:3; flex-basis:100%; overflow:auto; padding-bottom:7px; justify-content:flex-start; }
          .knowledge-nav a:first-child { padding:8px 0; }
          .knowledge-tools { margin-left:auto; }
          .knowledge-hero { min-height:410px; padding-top:34px; }
          .hero-copy h1 { font-size:clamp(3rem,14vw,4.5rem); }
          .hero-image { width:470px; right:0; bottom:0; opacity:.45; }
          .knowledge-search-wrap { width:100%; }
          .knowledge-search { height:auto; min-height:58px; flex-wrap:wrap; padding:12px 16px; gap:10px; }
          .search-placeholder { min-width:calc(100% - 42px); }
          .search-filter { display:none; }
          .search-submit { width:40px; height:40px; margin-left:auto; }
          .knowledge-grid { grid-template-columns:1fr; }
          .card-large,.card-small { grid-column:auto; min-height:250px; }
          .card-large .card-content, .knowledge-card .card-content { min-height:250px; }
        }
        @media (max-width:700px) {
          .sse-about-section { height:100svh; min-height:0; padding:28px 16px 66px; }
          .sse-about-panel { width:100%; max-height:calc(100svh - 94px); grid-template-columns:1fr; gap:18px; padding:26px 24px; border-radius:24px; }
          .sse-about-mark { justify-items:center; text-align:center; gap:13px; }
          .sse-about-mark, .sse-about-kicker, .sse-about-mark h2 { width:auto; }
          .sse-about-mark img { width:150px; height:150px; object-position:center; }
          .sse-about-divider { width:100%; height:1px; }
          .sse-about-copy h3 { margin-bottom:12px; font-size:1.45rem; }
          .sse-about-copy p { margin-bottom:10px; font-size:12px; line-height:1.45; }
          .sse-about-caption { right:22px; bottom:24px; font-size:8px; }
        }
      `}</style>
      <div className="knowledge-shell">
        <header className="knowledge-header">
          <Link href="/en"><img className="knowledge-logo" src="/homepage/logo-2.png" alt="SSE Knowledge Platform" /></Link>
          <nav className="knowledge-nav"><Link href="/en">Home</Link><Link href="#platform-introduction">Platform Introduction</Link><Link href="#about-us">About Us</Link><Link href="#contact-us">Contact Us</Link></nav>
          <div className="knowledge-tools"><div className="language-switch"><span className="active">EN</span><Link href="/fa"><span>FA</span></Link></div><Search className="top-search" aria-hidden="true" /></div>
        </header>
        <section className="knowledge-hero"><div className="hero-copy"><div className="hero-kicker">EXPLORE <span>/</span> ANALYZE <span>/</span> BUILD A FAIRER FUTURE</div><h1>The knowledge platform for social economy</h1><p>Explore research, data and real-world cases on social economy, solidarity and inclusive development.</p></div><div className="hero-image"><img src="/homepage/city.png" alt="City and community landscape" /></div></section>
        <KnowledgeSearch locale="en" />
        <section className="knowledge-grid">{cards.map(([label, title, text, action, href, image, className, Icon]) => <article className={`knowledge-card ${className}`} key={title}><img src={image} alt="" /><div className="card-content"><div className="card-heading"><span className="card-icon"><Icon aria-hidden="true" /></span><span className="card-label">{label}</span></div><h2>{title}</h2><p>{text}</p><Link className="card-button" href={href}>{action}<ArrowRight /></Link></div></article>)}</section>
      </div>
      <section id="about-us" className="sse-about-section" aria-labelledby="sse-about-title">
        <div id="contact-us" className="sse-about-panel">
          <div className="sse-about-mark">
            <img src="/sse-logo.png" alt="Social and Solidarity Economy logo" />
            <p className="sse-about-kicker">Independent research group</p>
            <h2 id="sse-about-title">About Us</h2>
          </div>
          <div className="sse-about-divider" aria-hidden="true" />
          <div className="sse-about-copy">
            <h3>Independent Social Economy Research Group</h3>
            <p>The Independent Social Economy Research Group is a network of independent researchers in Iran focused on advancing and promoting the field of social economy.</p>
            <p>Our activities include research and knowledge production, collaboration with universities and academics, engagement with economic enterprises, facilitating connections among community-based organizations, and building networks among social economy actors.</p>
            <p>Our primary focus is to strengthen the connection between academia, society, and policymaking and contribute to the development of the social economy discourse in Iran. Through national conferences, specialized seminars, and academic dialogues, we seek to create greater space for social economy within discussions on development and public policy.</p>
          </div>
        </div>
        <p className="sse-about-caption"><span lang="fa" dir="rtl">تصویر: تهران، ایران</span><span lang="en" dir="ltr">Image: Tehran, Iran</span></p>
      </section>
    </main>
  );
}
