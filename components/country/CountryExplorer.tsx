"use client";

import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { geoCentroid } from "d3-geo";
import { ComposableMap, Geography, Geographies, Marker, ZoomableGroup } from "react-simple-maps";

type Country = {
  id: string;
  name: string;
  rsmKey?: string;
  properties?: {
    ADMIN?: string;
    ISO_A3?: string;
  };
};

type CountryProfile = {
  id: string;
  name: string;
  title?: string;
  summary?: string;
  article?: string;
};

const mapFile = "/maps/world-countries.geojson";
const defaultCountry: Country = { id: "USA", name: "United States of America" };
export const fallbackProfiles: CountryProfile[] = [
  { id: "CAN", name: "Canada", summary: "Canada offers a useful starting point for thinking about social and solidarity economy in practice.", article: "Cooperatives, community organizations, mutual-aid initiatives, Indigenous economic traditions, and local social enterprises all contribute to a broader understanding of how communities organize resources and care beyond the boundaries of the conventional market." },
  { id: "USA", name: "United States of America", summary: "Community wealth building, worker ownership, and mutual aid shape a diverse SSE landscape across the United States.", article: "Worker cooperatives, community development finance, and neighborhood organizations show how local ownership can keep value circulating where people live and work." },
  { id: "BRA", name: "Brazil", summary: "Solidarity economy networks in Brazil connect cooperatives, local production, and social inclusion.", article: "Brazilian experiences make visible the role of collective organization in creating livelihoods, strengthening local markets, and expanding democratic participation." },
  { id: "COL", name: "Colombia", summary: "Community-led initiatives in Colombia link peacebuilding, livelihoods, and territorial development.", article: "Cooperatives and grassroots organizations demonstrate how solidarity practices can support recovery, inclusion, and resilient local economies." },
  { id: "FRA", name: "France", summary: "France has a long institutional history of associations, mutuals, cooperatives, and social enterprises.", article: "The French SSE ecosystem combines civic action with purpose-led enterprise and public policy support." },
  { id: "KOR", name: "South Korea", summary: "Social enterprises and cooperatives in South Korea connect innovation with community benefit.", article: "Local initiatives show how social innovation, care, and employment can be organized through democratic enterprise." },
  { id: "DEU", name: "Germany", summary: "Cooperatives and mission-led enterprises connect local ownership with resilient regional economies.", article: "Germany's cooperative traditions and social enterprises offer practical examples of democratic ownership and community finance." },
  { id: "ESP", name: "Spain", summary: "Worker cooperatives and solidarity networks strengthen local livelihoods and shared prosperity.", article: "Community enterprises and cooperative federations show how work, care, and local development can be organized collectively." },
  { id: "ITA", name: "Italy", summary: "Social cooperatives in Italy link public purpose, care services, and dignified employment.", article: "Italy's social cooperative movement demonstrates how collective enterprise can respond to social needs while creating quality work." },
  { id: "NLD", name: "Netherlands", summary: "Civic initiatives and purpose-led organizations help build inclusive and sustainable local economies.", article: "Dutch community enterprises illustrate how residents and institutions can share responsibility for places and resources." },
  { id: "IND", name: "India", summary: "Self-help groups, producer cooperatives, and community finance support livelihoods at scale.", article: "Collective action across India connects economic participation with gender equity, rural development, and local resilience." },
  { id: "JPN", name: "Japan", summary: "Cooperatives and community organizations respond to care, food, and demographic change.", article: "Japanese mutual-aid and cooperative models show how communities can organize care and essential services together." },
  { id: "MEX", name: "Mexico", summary: "Community economies and cooperative production keep local knowledge and value in place.", article: "Indigenous and community-led enterprises connect cultural stewardship, livelihoods, and democratic local development." },
  { id: "ZAF", name: "South Africa", summary: "Community enterprises and solidarity initiatives create pathways to inclusion and local ownership.", article: "Worker, community, and informal economy initiatives demonstrate the importance of collective power in unequal contexts." },
  { id: "AUS", name: "Australia", summary: "First Nations enterprises, cooperatives, and social ventures support community-led development.", article: "Place-based initiatives connect social purpose with stewardship, employment, and stronger local economies." },
];

export const persianFallbackProfiles: CountryProfile[] = [
  { id: "CAN", name: "کانادا", summary: "کانادا نقطه شروعی برای بررسی اقتصاد اجتماعی و همبستگی در عمل است.", article: "تعاونی‌ها، سازمان‌های اجتماعی، ابتکارهای یاری متقابل، سنت‌های اقتصادی بومی و بنگاه‌های اجتماعی، درک گسترده‌تری از سازمان‌دهی منابع و مراقبت فراتر از بازار متعارف ارائه می‌کنند." },
  { id: "USA", name: "ایالات متحده آمریکا", summary: "ساخت ثروت اجتماعی، مالکیت کارکنان و یاری متقابل، چشم‌انداز متنوع اقتصاد اجتماعی و همبستگی در ایالات متحده را شکل می‌دهند.", article: "تعاونی‌های کارگری، تأمین مالی توسعه اجتماعی و سازمان‌های محله‌محور نشان می‌دهند مالکیت محلی چگونه می‌تواند ارزش را در محل زندگی و کار مردم نگه دارد." },
  { id: "BRA", name: "برزیل", summary: "شبکه‌های اقتصاد همبستگی در برزیل تعاونی‌ها، تولید محلی و مشارکت اجتماعی را به هم پیوند می‌دهند.", article: "تجربه‌های برزیل نقش سازمان‌دهی جمعی را در ایجاد معیشت، تقویت بازارهای محلی و گسترش مشارکت دموکراتیک آشکار می‌کنند." },
  { id: "COL", name: "کلمبیا", summary: "ابتکارهای جامعه‌محور در کلمبیا صلح‌سازی، معیشت و توسعه سرزمینی را به هم پیوند می‌دهند.", article: "تعاونی‌ها و سازمان‌های مردمی نشان می‌دهند شیوه‌های همبستگی چگونه از بازسازی، مشارکت و اقتصادهای محلی تاب‌آور پشتیبانی می‌کنند." },
  { id: "FRA", name: "فرانسه", summary: "فرانسه سابقه‌ای نهادی و طولانی در انجمن‌ها، نهادهای تعاونی و بنگاه‌های اجتماعی دارد.", article: "زیست‌بوم اقتصاد اجتماعی و همبستگی فرانسه کنش مدنی را با بنگاه‌های هدف‌محور و حمایت سیاست عمومی ترکیب می‌کند." },
  { id: "KOR", name: "کره جنوبی", summary: "بنگاه‌های اجتماعی و تعاونی‌ها در کره جنوبی نوآوری را با منفعت اجتماعی پیوند می‌دهند.", article: "ابتکارهای محلی نشان می‌دهند نوآوری اجتماعی، مراقبت و اشتغال چگونه می‌توانند از طریق بنگاه دموکراتیک سازمان پیدا کنند." },
];

function getCountryLabelPosition(country: Country): [number, number] {
  try {
    return geoCentroid(country as never) as [number, number];
  } catch {
    return [0, 0];
  }
}

export default function CountryExplorer({ locale = "en" }: { locale?: "en" | "fa" }) {
  const isPersian = locale === "fa";
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [profiles, setProfiles] = useState<CountryProfile[]>(isPersian ? persianFallbackProfiles : fallbackProfiles);
  const [mapError, setMapError] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let isCurrent = true;

    fetch(mapFile)
      .then((response) => {
        if (!response.ok) throw new Error("The local map file could not be loaded.");
        return response.json();
      })
      .then((mapData: { features: Country[] }) => {
        if (!isCurrent) return;
        setCountries(mapData.features);
        const firstCountry = mapData.features.find((country) => country.properties?.ISO_A3 === "USA");
        if (firstCountry) setSelectedCountry(firstCountry);
      })
      .catch(() => {
        if (isCurrent) setMapError(true);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const apiBase = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "").replace(/\/$/, "");
    fetch(`${apiBase}/wp-json/sse/v1/countries?locale=${isPersian ? "fa" : "en"}`)
      .then((response) => {
        if (!response.ok) throw new Error("Country profiles are not available.");
        return response.json();
      })
      .then((data: CountryProfile[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const nextProfiles = isPersian ? data : [...data, ...fallbackProfiles];
          const uniqueProfiles = nextProfiles.filter((profile, index, allProfiles) => allProfiles.findIndex((item) => item.id === profile.id) === index);
          setProfiles(isPersian ? uniqueProfiles : uniqueProfiles.slice(0, 15));
        }
      })
      .catch(() => undefined);
  }, [isPersian]);

  const countryId = selectedCountry.properties?.ISO_A3 || selectedCountry.id;
  const rawCountryName = selectedCountry.properties?.ADMIN || selectedCountry.name;
  const profile = profiles.find((item) => item.id === countryId) || profiles.find((item) => item.name === rawCountryName);
  const countryName = profile?.name || rawCountryName;
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCountries = countries
    .filter((country) => (country.properties?.ADMIN || country.name).toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 8);
  const featuredProfiles = isPersian ? profiles.filter((profile) => profile.id).slice(0, 6) : profiles.filter((profile) => profile.id).slice(0, 15);
  const railProfiles = [...featuredProfiles, ...featuredProfiles];

  function selectProfile(profileId: string) {
    const country = countries.find((item) => item.properties?.ISO_A3 === profileId || item.id === profileId);
    if (country) setSelectedCountry(country);
  }

  return (
    <main className={`explorer-page ${isPersian ? "locale-fa" : "locale-en"}`} dir={isPersian ? "rtl" : "ltr"}>
      <style jsx>{`
        .explorer-page {
          --ink: #092b2b;
          --green: #075c55;
          --green-deep: #043c38;
          --green-soft: #a9c8bb;
          --cream: #f7f7f1;
          --paper: #fffefa;
          --muted: #647773;
          --border: #d8e2dc;
          min-height: 100vh;
          padding: 0 18px 24px;
          color: var(--ink);
          background:
            radial-gradient(circle at 8% 12%, rgba(169, 200, 187, .36), transparent 25%),
            linear-gradient(145deg, #f7f7f1 0%, #edf3ee 100%);
          font-family: "Vazirmatn", Tahoma, Arial, sans-serif;
          direction: ${isPersian ? "rtl" : "ltr"};
          text-align: ${isPersian ? "right" : "left"};
        }

        .shell {
          position: relative;
          width: 100%;
          max-width: 1480px;
          min-height: calc(100vh - 24px);
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, .9);
          border-radius: 24px;
          background: var(--paper);
          box-shadow: 0 24px 70px rgba(13, 70, 61, .12);
        }

        .topbar {
          position: relative;
          z-index: 4;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px 32px;
          border-bottom: 1px solid var(--border);
          background: rgba(255, 254, 250, .84);
          backdrop-filter: blur(16px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo { display: block; width: 210px; height: auto; }

        .mark {
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: var(--green);
          font-size: 20px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(7, 92, 85, .22);
        }

        .back-link { color: var(--green); font-size: 12px; font-weight: 800; text-decoration: none; }
        .back-link:hover { color: var(--green-deep); }
        .content { position: relative; z-index: 1; min-height: calc(100vh - 100px); padding: 32px; }
        .intro { position: relative; z-index: 3; max-width: 680px; margin: 0 auto 26px; padding: 0 18px; border-left: 3px solid var(--green); }
        .explorer-page[dir="rtl"] .intro { padding: 0 18px 0 0; border-left: 0; border-right: 3px solid var(--green); }
        .eyebrow { margin: 0 0 10px; color: var(--green); font-size: 10px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; }
        h1 { margin: 0; color: var(--ink); font-family: Georgia, serif; font-size: clamp(32px, 4vw, 60px); line-height: .98; letter-spacing: -1.5px; }
        .explorer-page[dir="rtl"] h1 { font-family: "Vazirmatn", Tahoma, sans-serif; letter-spacing: 0; line-height: 1.15; }
        .intro p { max-width: 520px; margin: 12px 0 0; color: var(--muted); font-size: 13px; line-height: 1.75; }

        .explorer-grid { display: block; }
        .map-card { grid-area: map; position: relative; min-width: 0; padding: 0; }
        .map-heading { position: absolute; z-index: 2; top: 28px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: space-between; gap: 12px; width: min(430px, 42vw); padding: 10px 14px; border: 1px solid rgba(210, 231, 220, .4); border-radius: 5px; background: rgba(11, 74, 68, .54); color: #f3f9ef; box-shadow: 0 12px 28px rgba(2, 35, 32, .18); backdrop-filter: blur(16px); }
        .map-heading h2 { margin: 0; font-size: 16px; }
        .map-heading span { color: rgba(243, 249, 239, .68); font-size: 11px; }
        .map-wrap { position: relative; overflow: hidden; min-height: 680px; height: min(720px, calc(100vh - 220px)); background: radial-gradient(circle at 50% 50%, #0c6960 0%, var(--green-deep) 70%); border: 0; border-radius: 20px; box-shadow: inset 0 0 0 1px rgba(169, 200, 187, .22), 0 18px 44px rgba(4, 60, 56, .2); }
        .map-wrap::before { content: "ATLAS / 01"; position: absolute; z-index: 1; top: 28px; left: 30px; color: rgba(210, 231, 220, .68); font: 10px/1 "DM Sans", sans-serif; letter-spacing: 2px; }
        .map-wrap::after { content: "N   E\A W   S"; white-space: pre; position: absolute; z-index: 1; right: 30px; bottom: 102px; color: rgba(210, 231, 220, .55); font: 10px/1.7 Georgia, serif; letter-spacing: 2px; text-align: center; }
        .map-wrap svg { position: relative; z-index: 1; display: block; width: 100%; height: 100%; min-height: 680px; }
        .geography { fill: #789d91; stroke: rgba(221, 238, 226, .45); stroke-width: .65; cursor: pointer; outline: none; transition: fill .2s ease, stroke .2s ease; }
        .geography.has-content { fill: #b0c9a6; }
        .geography:hover { fill: #a4c0b3; }
        .geography.has-content:hover { fill: #d3d99d; }
        .geography.selected { fill: #d9c985; stroke: #fff5c9; stroke-width: 2; }
        .geography.has-content.selected { fill: #e0d08a; }
        .geography:focus-visible { stroke: #fff5c9; stroke-width: 2; }
        .country-label { pointer-events: none; fill: rgba(243, 249, 239, .62); font-size: 3.8px; font-weight: 500; text-anchor: middle; paint-order: stroke; stroke: var(--green-deep); stroke-width: 1px; stroke-linejoin: round; }
        .map-status { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; color: var(--green-soft); font-size: 13px; }
        .map-status.error { color: #f0d18e; }
        .map-footer { position: absolute; z-index: 2; bottom: 154px; left: 30px; display: flex; align-items: center; gap: 8px; color: rgba(243, 249, 239, .84); font-size: 11px; }
        .explorer-page[dir="rtl"] .map-footer { left: auto; right: 30px; }
        .legend-dot { width: 9px; height: 9px; border-radius: 50%; background: #e0d08a; }
        .map-legend { position: absolute; z-index: 2; bottom: 150px; right: 28px; display: flex; gap: 14px; padding: 9px 12px; border: 1px solid rgba(210, 231, 220, .3); border-radius: 4px; background: rgba(4, 60, 56, .72); color: rgba(243, 249, 239, .84); font-size: 11px; }
        .explorer-page[dir="rtl"] .map-legend { right: auto; left: 28px; }
        .legend-item { display: inline-flex; align-items: center; gap: 6px; }
        .legend-swatch { width: 10px; height: 10px; border: 1px solid rgba(255,255,255,.4); border-radius: 2px; background: #789d91; }
        .legend-swatch.has-content { border-color: #d3d99d; background: #b0c9a6; }
        .zoom-controls { position: absolute; z-index: 2; bottom: 205px; left: 28px; display: flex; gap: 5px; }
        .explorer-page[dir="rtl"] .zoom-controls { left: auto; right: 28px; }
        .zoom-controls button { width: 34px; height: 34px; border: 1px solid rgba(210, 231, 220, .32); border-radius: 4px; color: var(--green-deep); background: rgba(247, 247, 241, .92); cursor: pointer; font-size: 18px; }
        .zoom-controls button:hover { color: var(--green); background: #fff5c9; }

        .country-sidebar { position: absolute; z-index: 4; top: 28px; right: 28px; display: flex; flex-direction: column; gap: 12px; width: min(320px, 29%); min-width: 270px; }
        .explorer-page[dir="rtl"] .country-sidebar { right: auto; left: 28px; }
        .search-panel { padding: 16px; border: 1px solid rgba(235, 246, 239, .32); border-radius: 12px; background: rgba(246, 250, 242, .16); color: #f3f9ef; box-shadow: 0 14px 35px rgba(2, 35, 32, .18); backdrop-filter: blur(18px); }
        .search-panel label { display: block; margin-bottom: 9px; color: #d9e8ba; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
        .country-search { width: 100%; height: 44px; box-sizing: border-box; border: 1px solid rgba(255, 255, 255, .28); border-radius: 7px; padding: 0 13px; color: var(--ink); background: rgba(255, 255, 255, .86); font: inherit; outline: none; }
        .country-search:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(7, 92, 85, .1); }
        .search-results { display: grid; gap: 4px; margin-top: 10px; max-height: 220px; overflow-y: auto; }
        .country-option { border: 0; border-radius: 8px; padding: 9px 10px; color: var(--ink); background: rgba(255,255,255,.82); cursor: pointer; font: inherit; text-align: ${isPersian ? "right" : "left"}; }
        .country-option:hover, .country-option.selected { color: var(--green); background: #edf3ee; }
        .search-empty { margin: 10px 0 0; color: #e8f0df; font-size: 12px; }

        .country-panel { display: flex; flex-direction: column; max-height: 380px; overflow-y: auto; border: 1px solid rgba(235, 246, 239, .32); border-radius: 12px; background: rgba(246, 250, 242, .88); color: var(--ink); box-shadow: 0 18px 42px rgba(2, 35, 32, .24); backdrop-filter: blur(18px); }
        .panel-top { padding: 22px 21px 18px; color: white; background: rgba(7, 92, 85, .88); }
        .panel-top small { opacity: .72; font-size: 10px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; }
        .panel-top h2 { margin: 10px 0 0; font-family: Georgia, serif; font-size: 28px; line-height: 1.1; }
        .explorer-page[dir="rtl"] .panel-top h2 { font-family: "Vazirmatn", Tahoma, sans-serif; }
        .panel-body { padding: 23px; }
        .panel-body p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.85; }
        .panel-label { display: block; margin-bottom: 8px; color: var(--green); font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
        .article { margin-top: 25px; padding-top: 23px; border-top: 1px solid var(--border); }
        .article h3 { margin: 0 0 11px; color: #241d1c; font-size: 18px; unicode-bidi: plaintext; }
        .article p { white-space: pre-line; direction: ${isPersian ? "rtl" : "ltr"}; text-align: ${isPersian ? "right" : "left"}; }
        .read-more { display: inline-block; margin-top: 16px; color: var(--green); font-size: 13px; font-weight: 800; text-decoration: none; }
        .panel-note { margin-top: 24px !important; padding-top: 17px; border-top: 1px solid var(--border); font-size: 12px !important; }

        .country-rail { position: absolute; z-index: 4; right: 28px; bottom: 22px; left: 28px; overflow: hidden; padding: 2px 0 6px; }
        .country-rail-track { display: flex; gap: 12px; width: max-content; animation: atlas-drift 28s linear infinite; }
        .country-rail:hover .country-rail-track, .country-rail:focus-within .country-rail-track { animation-play-state: paused; }
        .country-card { display: flex; flex-direction: column; justify-content: space-between; width: 190px; min-height: 104px; padding: 14px; border: 1px solid rgba(235, 246, 239, .3); border-radius: 12px; color: #f3f9ef; background: rgba(246, 250, 242, .16); box-shadow: 0 12px 30px rgba(2, 35, 32, .18); backdrop-filter: blur(16px); cursor: pointer; text-align: ${isPersian ? "right" : "left"}; transition: transform .2s ease, background .2s ease; }
        .country-card:hover, .country-card.selected { transform: translateY(-5px); background: rgba(221, 235, 190, .3); }
        .country-card small { color: #d9e8ba; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; }
        .country-card strong { margin-top: 8px; font-size: 15px; }
        .country-card span { color: rgba(243, 249, 239, .72); font-size: 10px; line-height: 1.45; }
        @keyframes atlas-drift { from { transform: translateX(0); } to { transform: translateX(-${Math.max(0, featuredProfiles.length - 3) * 202}px); } }

        .locale-en { height: 100dvh; min-height: 100dvh; overflow: hidden; padding-bottom: 0; }
        .locale-en .shell { height: 100dvh; min-height: 0; border: 0; border-radius: 0; box-shadow: none; }
        .locale-en .topbar, .locale-en .intro, .locale-en .map-heading { display: none; }
        .locale-en .map-wrap::before, .locale-en .map-wrap::after { display: none; }
        .locale-en .content { height: 100dvh; min-height: 0; padding: 0; }
        .locale-en .map-wrap { min-height: 0; height: 100dvh; border-radius: 0; box-shadow: none; }
        .locale-en .map-wrap svg { min-height: 0; }
        .locale-en .country-rail-track { animation-name: atlas-drift-en; animation-duration: 96s; }
        .locale-en .country-rail { right: 24px; bottom: 24px; left: 24px; }
        .locale-en .country-sidebar { top: 24px; right: 24px; }
        .locale-en .country-panel { border-color: rgba(235, 246, 239, .32); background: rgba(246, 250, 242, .16); color: #f3f9ef; box-shadow: 0 14px 35px rgba(2, 35, 32, .2); backdrop-filter: blur(18px); }
        .locale-en .panel-top { background: rgba(7, 92, 85, .42); }
        .locale-en .panel-body p, .locale-en .article h3 { color: rgba(243, 249, 239, .86); }
        .locale-en .panel-label { color: #d9e8ba; }
        .locale-en .article, .locale-en .panel-note { border-color: rgba(235, 246, 239, .24); }
        .locale-en .read-more { color: #e4d493; }
        .locale-en .zoom-controls { bottom: 172px; }
        .locale-en .map-footer, .locale-en .map-legend { bottom: 124px; }
        @keyframes atlas-drift-en { from { transform: translateX(0); } to { transform: translateX(-${featuredProfiles.length * 202}px); } }

        @media (max-width: 820px) {
          .topbar { padding: 20px 24px; }
          .content { padding: 24px; }
          .locale-en .content { height: 100dvh; padding: 0; }
          .locale-en .map-wrap { height: 100dvh; }
          .explorer-grid { display: block; }
          .map-wrap { height: 680px; }
          .country-sidebar { top: 28px; right: 28px; left: 28px; width: auto; }
          .explorer-page[dir="rtl"] .country-sidebar { left: 28px; right: 28px; }
          .country-panel { max-height: 34vh; }
        }

        @media (max-width: 520px) {
          .explorer-page { padding: 0; }
          .shell { border-radius: 0; }
          .topbar { padding: 18px; }
          .content { padding: 18px; }
          .back-link { font-size: 0; }
          .back-link::after { content: "Home"; font-size: 13px; }
          .map-heading { top: 28px; width: calc(100% - 36px); }
          .intro { margin-bottom: 20px; max-width: none; }
          .locale-en .map-wrap { min-height: 0; height: 100dvh; }
          .map-wrap { min-height: 620px; height: 620px; }
          .country-sidebar { top: 18px; right: 18px; left: 18px; }
          .explorer-page[dir="rtl"] .country-sidebar { left: 18px; right: 18px; }
          .country-panel { max-height: 28vh; }
          .country-label { font-size: 4px; }
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <img className="brand-logo" src={isPersian ? "/homepage/persian-logo.png" : "/homepage/logo.png"} alt={isPersian ? "پلتفرم دانشی اقتصاد اجتماعی و همبستگی" : "SSE Knowledge Platform"} />
          </div>
          <a className="back-link" href={isPersian ? "/fa" : "/en"}>{isPersian ? "بازگشت به خانه" : "Back to home"}</a>
        </header>

        <section className="content">
          <div className="intro">
            <p className="eyebrow">{isPersian ? "چشم‌اندازهای جهانی" : "Global perspectives"}</p>
            <h1>{isPersian ? "وضعیت اقتصاد اجتماعی کشورها" : "Country Explorer"}</h1>
            <p>{isPersian ? "یک کشور را روی نقشه انتخاب کنید تا مروری کوتاه بر زمینه اجتماعی و اقتصادی آن ببینید." : "Choose a country on the map to open a short overview of its social and economic context."}</p>
          </div>

          <div className="explorer-grid">
            <section className="map-card" aria-label="Interactive world map">
              <div className="map-wrap">
                <div className="map-heading">
                  <h2>{isPersian ? "اطلس اقتصاد اجتماعی" : "Social economy atlas"}</h2>
                  <span>{isPersian ? "نمای جهانی" : "A global view"}</span>
                </div>
                {mapError ? (
                  <div className="map-status error">{isPersian ? "نقشه جهان بارگذاری نشد." : "The local world map could not be loaded."}</div>
                ) : countries.length === 0 ? (
                  <div className="map-status">{isPersian ? "نقشه جهان در حال بارگذاری است..." : "Loading the world map..."}</div>
                ) : (
                  <ComposableMap
                    projection="geoEqualEarth"
                    projectionConfig={{ scale: 145 }}
                    width={900}
                    height={480}
                    role="img"
                    aria-label="Interactive map of the world"
                  >
                    <ZoomableGroup
                      center={[0, 20]}
                      zoom={zoom}
                      minZoom={1}
                      maxZoom={8}
                      onMoveEnd={({ zoom: nextZoom }: { zoom: number }) => setZoom(nextZoom)}
                    >
                      <Geographies geography={mapFile}>
                        {({ geographies }: { geographies: Country[] }) => geographies.map((country, index) => {
                        const name = country.properties?.ADMIN || "Unknown country";
                        const isSelected = selectedCountry.rsmKey === country.rsmKey
                          || selectedCountry.properties?.ISO_A3 === country.properties?.ISO_A3;
                        const hasContent = profiles.some((item) => item.id === country.properties?.ISO_A3);
                        const countryFill = isSelected
                          ? "#d9c985"
                          : hasContent
                            ? "#b0c9a6"
                            : "#789d91";

                        return (
                          <Geography
                            className={`geography ${hasContent ? "has-content" : ""} ${isSelected ? "selected" : ""}`}
                            key={`country-${country.rsmKey || country.properties?.ISO_A3 || name}-${index}`}
                            geography={country}
                            style={{
                              default: { fill: countryFill, outline: "none" },
                              hover: { fill: hasContent ? "#d3d99d" : "#a4c0b3", outline: "none" },
                              pressed: { fill: "#e0d08a", outline: "none" },
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`Explore ${name}`}
                            onClick={() => setSelectedCountry(country)}
                            onKeyDown={(event: KeyboardEvent<SVGPathElement>) => {
                              if (event.key === "Enter" || event.key === " ") setSelectedCountry(country);
                            }}
                          />
                        );
                        })}
                      </Geographies>
                      {(isPersian || zoom >= 2.2) && countries.map((country, index) => (
                        <Marker
                          key={`label-${country.rsmKey || country.properties?.ISO_A3 || country.name}-${index}`}
                          coordinates={getCountryLabelPosition(country)}
                        >
                          <text className="country-label" y="1.5">{country.properties?.ADMIN || country.name}</text>
                        </Marker>
                      ))}
                    </ZoomableGroup>
                  </ComposableMap>
                )}
              </div>
              <div className="map-footer"><span className="legend-dot" /> {isPersian ? "کشور انتخاب‌شده:" : "Selected country:"} {countryName}</div>
              <div className="zoom-controls" aria-label={isPersian ? "کنترل بزرگ‌نمایی نقشه" : "Map zoom controls"}>
                <button type="button" aria-label={isPersian ? "بزرگ‌نمایی" : "Zoom in"} onClick={() => setZoom((currentZoom) => Math.min(currentZoom + 1, 8))}>+</button>
                <button type="button" aria-label={isPersian ? "کوچک‌نمایی" : "Zoom out"} onClick={() => setZoom((currentZoom) => Math.max(currentZoom - 1, 1))}>−</button>
                <button type="button" aria-label={isPersian ? "بازنشانی نقشه" : "Reset map zoom"} onClick={() => setZoom(1)}>{isPersian ? "بازنشانی" : "Reset"}</button>
              </div>
              <div className="map-legend" aria-label={isPersian ? "راهنمای نقشه" : "Map legend"}>
                <span className="legend-item"><span className="legend-swatch has-content" /> {isPersian ? "مقاله موجود است" : "Articles available"}</span>
                <span className="legend-item"><span className="legend-swatch" /> {isPersian ? "هنوز مقاله‌ای نیست" : "No article yet"}</span>
              </div>
              <div className="country-rail" aria-label={isPersian ? "کشورهای پیشنهادی" : "Suggested countries"}>
                <div className="country-rail-track">
                  {railProfiles.map((featuredProfile, index) => (
                    <button
                      className={`country-card ${featuredProfile.id === countryId ? "selected" : ""}`}
                      key={`${featuredProfile.id}-${index}`}
                      type="button"
                      onClick={() => selectProfile(featuredProfile.id)}
                    >
                      <small>{isPersian ? "پروفایل کشور" : "Country profile"}</small>
                      <strong>{featuredProfile.name}</strong>
                      <span>{featuredProfile.summary}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside className="country-sidebar">
              <div className="search-panel">
                <label htmlFor="country-search">{isPersian ? "یافتن کشور" : "Find a country"}</label>
                <input
                  id="country-search"
                  className="country-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={isPersian ? "جستجو بر اساس نام کشور" : "Search by country name"}
                />
                {searchQuery && filteredCountries.length > 0 ? (
                  <div className="search-results" role="listbox" aria-label={isPersian ? "نتایج جستجوی کشور" : "Country search results"}>
                    {filteredCountries.map((country) => {
                      const name = country.properties?.ADMIN || country.name;
                      const isSelected = countryName === name;

                      return (
                        <button
                          className={`country-option ${isSelected ? "selected" : ""}`}
                          key={country.properties?.ISO_A3 || name}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setSearchQuery(name);
                          }}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                ) : searchQuery ? (
                  <p className="search-empty">{isPersian ? "کشوری پیدا نشد." : "No country found."}</p>
                ) : null}
              </div>

              <div className="country-panel" aria-live="polite">
                <div className="panel-top">
                  <small>{isPersian ? "نمایه کشور" : "Country profile"}</small>
                  <h2>{countryName}</h2>
                </div>
                <div className="panel-body">
                  <span className="panel-label">{isPersian ? "نگاهی به وضعیت اجتماعی و اقتصادی" : "Social and economic snapshot"}</span>
                  <p>{profile?.summary || (isPersian ? "این نمایه کشور در حال آماده‌سازی است و پژوهش اختصاصی آن پس از انتشار در اینجا نمایش داده خواهد شد." : "This country profile is being prepared. Country-specific research will appear here as soon as it is published.")}</p>
                  <div className="article">
                    <span className="panel-label">{isPersian ? "مقاله کشور انتخاب‌شده" : "Selected country article"}</span>
                    <h3 dir="auto">{profile?.title || profile?.name || countryName}</h3>
                    <p>{profile?.summary || (isPersian ? "مقاله اختصاصی این کشور هنوز آماده نشده است." : "The country-specific article is not available yet.")}</p>
                    {profile?.article ? (
                      <Link className="read-more" href={`/${isPersian ? "fa" : "en"}/country-explorer/${countryId.toLowerCase()}`}>
                        {isPersian ? "ادامه مطلب" : "Read more"}
                      </Link>
                    ) : null}
                  </div>
                  <p className="panel-note">{isPersian ? "کلیه این پژوهشها توسط کارگروه پژوهشی رسانه اقتصاد اجتماعی (SEMRG) تولید شده اند و به روز رسانی میشوند." : "All of this research is produced and updated by the Social Economy Media Research Group (SEMRG)."}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
