"use client";

import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
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
  summary?: string;
  article?: string;
};

const mapFile = "/maps/world-countries.geojson";
const defaultCountry: Country = { id: "USA", name: "United States of America" };
const fallbackProfiles: CountryProfile[] = [
  { id: "CAN", name: "Canada", summary: "Canada offers a useful starting point for thinking about social and solidarity economy in practice.", article: "Cooperatives, community organizations, mutual-aid initiatives, Indigenous economic traditions, and local social enterprises all contribute to a broader understanding of how communities organize resources and care beyond the boundaries of the conventional market." },
  { id: "USA", name: "United States of America", summary: "Community wealth building, worker ownership, and mutual aid shape a diverse SSE landscape across the United States.", article: "Worker cooperatives, community development finance, and neighborhood organizations show how local ownership can keep value circulating where people live and work." },
  { id: "BRA", name: "Brazil", summary: "Solidarity economy networks in Brazil connect cooperatives, local production, and social inclusion.", article: "Brazilian experiences make visible the role of collective organization in creating livelihoods, strengthening local markets, and expanding democratic participation." },
  { id: "COL", name: "Colombia", summary: "Community-led initiatives in Colombia link peacebuilding, livelihoods, and territorial development.", article: "Cooperatives and grassroots organizations demonstrate how solidarity practices can support recovery, inclusion, and resilient local economies." },
  { id: "FRA", name: "France", summary: "France has a long institutional history of associations, mutuals, cooperatives, and social enterprises.", article: "The French SSE ecosystem combines civic action with purpose-led enterprise and public policy support." },
  { id: "KOR", name: "South Korea", summary: "Social enterprises and cooperatives in South Korea connect innovation with community benefit.", article: "Local initiatives show how social innovation, care, and employment can be organized through democratic enterprise." },
];

const persianFallbackProfiles: CountryProfile[] = [
  { id: "CAN", name: "Canada", summary: "کانادا نقطه شروعی برای بررسی اقتصاد اجتماعی و همبستگی در عمل است.", article: "تعاونی‌ها، سازمان‌های اجتماعی، ابتکارهای یاری متقابل، سنت‌های اقتصادی بومی و بنگاه‌های اجتماعی، درک گسترده‌تری از سازمان‌دهی منابع و مراقبت فراتر از بازار متعارف ارائه می‌کنند." },
  { id: "USA", name: "United States of America", summary: "ساخت ثروت اجتماعی، مالکیت کارکنان و یاری متقابل، چشم‌انداز متنوع اقتصاد اجتماعی و همبستگی در ایالات متحده را شکل می‌دهند.", article: "تعاونی‌های کارگری، تأمین مالی توسعه اجتماعی و سازمان‌های محله‌محور نشان می‌دهند مالکیت محلی چگونه می‌تواند ارزش را در محل زندگی و کار مردم نگه دارد." },
  { id: "BRA", name: "Brazil", summary: "شبکه‌های اقتصاد همبستگی در برزیل تعاونی‌ها، تولید محلی و مشارکت اجتماعی را به هم پیوند می‌دهند.", article: "تجربه‌های برزیل نقش سازمان‌دهی جمعی را در ایجاد معیشت، تقویت بازارهای محلی و گسترش مشارکت دموکراتیک آشکار می‌کنند." },
  { id: "COL", name: "Colombia", summary: "ابتکارهای جامعه‌محور در کلمبیا صلح‌سازی، معیشت و توسعه سرزمینی را به هم پیوند می‌دهند.", article: "تعاونی‌ها و سازمان‌های مردمی نشان می‌دهند شیوه‌های همبستگی چگونه از بازسازی، مشارکت و اقتصادهای محلی تاب‌آور پشتیبانی می‌کنند." },
  { id: "FRA", name: "France", summary: "فرانسه سابقه‌ای نهادی و طولانی در انجمن‌ها، نهادهای تعاونی و بنگاه‌های اجتماعی دارد.", article: "زیست‌بوم اقتصاد اجتماعی و همبستگی فرانسه کنش مدنی را با بنگاه‌های هدف‌محور و حمایت سیاست عمومی ترکیب می‌کند." },
  { id: "KOR", name: "South Korea", summary: "بنگاه‌های اجتماعی و تعاونی‌ها در کره جنوبی نوآوری را با منفعت اجتماعی پیوند می‌دهند.", article: "ابتکارهای محلی نشان می‌دهند نوآوری اجتماعی، مراقبت و اشتغال چگونه می‌توانند از طریق بنگاه دموکراتیک سازمان پیدا کنند." },
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
        if (Array.isArray(data) && data.length > 0) setProfiles(data);
      })
      .catch(() => undefined);
  }, [isPersian]);

  const countryName = selectedCountry.properties?.ADMIN || selectedCountry.name;
  const countryId = selectedCountry.properties?.ISO_A3 || selectedCountry.id;
  const profile = profiles.find((item) => item.id === countryId) || profiles.find((item) => item.name === countryName);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCountries = countries
    .filter((country) => (country.properties?.ADMIN || country.name).toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 8);

  return (
    <main className="explorer-page">
      <style jsx>{`
        .explorer-page {
          --red-dark: #71131a;
          --red-main: #a6202a;
          --red-soft: #d67a78;
          --cream: #fbf7f1;
          --paper: #fffdfa;
          --ink: #2d2523;
          --muted: #766965;
          --border: #eaded6;
          min-height: 100vh;
          padding: 0;
          color: var(--ink);
          background: #f7f4ef;
          font-family: "Vazirmatn", Tahoma, Arial, sans-serif;
          direction: ${isPersian ? "rtl" : "ltr"};
          text-align: ${isPersian ? "right" : "left"};
        }

        .shell {
          position: relative;
          width: 100%;
          max-width: none;
          min-height: 100vh;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, .55);
          border-radius: 0;
          background: #fffdfa;
          box-shadow: none;
        }

        .topbar {
          position: absolute;
          z-index: 4;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 38px;
          border-bottom: 1px solid rgba(234, 222, 214, .8);
          background: rgba(255, 253, 250, .9);
          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .mark {
          display: grid;
          width: 45px;
          height: 45px;
          place-items: center;
          border-radius: 14px;
          color: white;
          background: linear-gradient(135deg, var(--red-dark), var(--red-main));
          font-size: 20px;
          font-weight: 800;
          box-shadow: 0 10px 20px rgba(126, 20, 27, .2);
        }

        .brand strong { display: block; font-size: 18px; letter-spacing: .1px; }
        .brand span { display: block; margin-top: 2px; color: var(--muted); font-size: 11px; }
        .back-link { color: var(--red-dark); font-size: 13px; font-weight: 700; text-decoration: none; }
        .content { position: relative; z-index: 1; min-height: 100vh; padding: 0; }
        .intro { position: absolute; z-index: 3; top: 112px; left: clamp(20px, 4vw, 64px); max-width: 520px; padding: 16px 20px; border-left: 4px solid var(--red-main); border-radius: 0 12px 12px 0; background: rgba(255, 253, 250, .88); box-shadow: 0 12px 28px rgba(70, 30, 20, .08); }
        .eyebrow { margin: 0 0 8px; color: var(--red-main); font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
        h1 { margin: 0; color: #241d1c; font-size: clamp(26px, 3vw, 42px); line-height: 1.05; letter-spacing: -.8px; }
        .intro p { max-width: 610px; margin: 10px 0 0; color: var(--muted); font-size: 13px; line-height: 1.7; }

        .explorer-grid { display: block; }
        .map-card { position: relative; min-width: 0; padding: 0; }
        .map-heading { position: absolute; z-index: 2; top: 112px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: space-between; gap: 12px; width: min(460px, 42vw); padding: 10px 14px; border: 1px solid rgba(234, 222, 214, .8); border-radius: 10px; background: rgba(255, 253, 250, .88); box-shadow: 0 10px 24px rgba(70, 30, 20, .07); }
        .map-heading h2 { margin: 0; font-size: 16px; }
        .map-heading span { color: var(--muted); font-size: 11px; }
        .map-wrap { position: relative; overflow: hidden; min-height: 100vh; background: #f7dfe2; border: 0; }
        .map-wrap svg { display: block; width: 100%; height: 100vh; min-height: 620px; }
        .geography { fill: #ffffff; stroke: #c8bbb8; stroke-width: .65; cursor: pointer; outline: none; transition: fill .2s ease, stroke .2s ease; }
        .geography.has-content { fill: #e9a7ad; }
        .geography:hover { fill: #f2c0c4; }
        .geography.has-content:hover { fill: #d87983; }
        .geography.selected { fill: #f3b4bb; stroke: #7f1721; stroke-width: 2; }
        .geography.has-content.selected { fill: #df7c87; }
        .geography:focus-visible { stroke: #7f1721; stroke-width: 2; }
        .country-label { pointer-events: none; fill: #4b403c; font-size: 5px; font-weight: 600; text-anchor: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 1.4px; stroke-linejoin: round; }
        .map-status { position: absolute; inset: 0; display: grid; place-items: center; color: var(--muted); font-size: 13px; }
        .map-status.error { color: var(--red-dark); }
        .map-footer { position: absolute; z-index: 2; bottom: 22px; left: 28px; display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 11px; }
        .legend-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--red-main); }
        .map-legend { position: absolute; z-index: 2; bottom: 20px; right: 28px; display: flex; gap: 14px; padding: 9px 12px; border: 1px solid rgba(234, 222, 214, .8); border-radius: 10px; background: rgba(255, 253, 250, .9); color: var(--muted); font-size: 11px; }
        .legend-item { display: inline-flex; align-items: center; gap: 6px; }
        .legend-swatch { width: 10px; height: 10px; border: 1px solid #c8bbb8; border-radius: 3px; background: #fff; }
        .legend-swatch.has-content { border-color: #c66b76; background: #e9a7ad; }
        .zoom-controls { position: absolute; z-index: 2; bottom: 62px; left: 28px; display: flex; gap: 5px; }
        .zoom-controls button { width: 34px; height: 34px; border: 1px solid var(--border); border-radius: 8px; color: var(--red-dark); background: rgba(255, 253, 250, .92); cursor: pointer; font-size: 18px; }
        .zoom-controls button:hover { background: #fff0ed; }

        .country-sidebar { position: absolute; z-index: 3; top: 170px; right: clamp(18px, 3vw, 52px); display: flex; flex-direction: column; gap: 16px; width: min(340px, calc(100vw - 36px)); }
        .search-panel { padding: 18px; border: 1px solid var(--border); border-radius: 16px; background: rgba(255, 253, 250, .94); box-shadow: 0 14px 35px rgba(70, 30, 20, .12); backdrop-filter: blur(10px); }
        .search-panel label { display: block; margin-bottom: 9px; color: var(--red-dark); font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; }
        .country-search { width: 100%; height: 44px; box-sizing: border-box; border: 1px solid #d9ccc4; border-radius: 10px; padding: 0 13px; color: var(--ink); background: #fff; font: inherit; outline: none; }
        .country-search:focus { border-color: var(--red-main); box-shadow: 0 0 0 3px rgba(166, 25, 34, .1); }
        .search-results { display: grid; gap: 4px; margin-top: 10px; max-height: 220px; overflow-y: auto; }
        .country-option { border: 0; border-radius: 8px; padding: 9px 10px; color: var(--ink); background: transparent; cursor: pointer; font: inherit; text-align: ${isPersian ? "right" : "left"}; }
        .country-option:hover, .country-option.selected { color: var(--red-dark); background: #fff0ed; }
        .search-empty { margin: 10px 0 0; color: var(--muted); font-size: 12px; }

        .country-panel { display: flex; flex-direction: column; max-height: min(58vh, 620px); overflow-y: auto; border: 1px solid var(--border); border-radius: 16px; background: rgba(255, 253, 250, .96); box-shadow: 0 14px 35px rgba(70, 30, 20, .12); backdrop-filter: blur(10px); }
        .panel-top { padding: 24px 23px 20px; color: white; background: linear-gradient(145deg, var(--red-dark), var(--red-main)); }
        .panel-top small { opacity: .72; font-size: 10px; font-weight: 800; letter-spacing: 1.8px; text-transform: uppercase; }
        .panel-top h2 { margin: 10px 0 0; font-size: 28px; line-height: 1.1; }
        .panel-body { padding: 23px; }
        .panel-body p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.85; }
        .panel-label { display: block; margin-bottom: 8px; color: var(--red-dark); font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; }
        .article { margin-top: 25px; padding-top: 23px; border-top: 1px solid var(--border); }
        .article h3 { margin: 0 0 11px; color: #241d1c; font-size: 18px; }
        .article p { white-space: pre-line; direction: ${isPersian ? "rtl" : "ltr"}; text-align: ${isPersian ? "right" : "left"}; }
        .panel-note { margin-top: 24px !important; padding-top: 17px; border-top: 1px solid var(--border); font-size: 12px !important; }

        @media (max-width: 820px) {
          .topbar { padding: 20px 24px; }
          .intro { top: 100px; left: 24px; }
          .map-heading { top: 100px; }
          .country-sidebar { top: auto; right: 24px; bottom: 24px; left: 24px; width: auto; }
          .country-panel { max-height: 34vh; }
        }

        @media (max-width: 520px) {
          .explorer-page { padding: 0; }
          .shell { border-radius: 0; }
          .topbar { padding: 18px; }
          .content { padding: 0; }
          .back-link { font-size: 0; }
          .back-link::after { content: "Home"; font-size: 13px; }
          .map-heading { top: 92px; width: calc(100vw - 36px); }
          .intro { top: 142px; left: 18px; right: 18px; max-width: none; }
          .country-sidebar { right: 18px; bottom: 18px; left: 18px; }
          .country-panel { max-height: 28vh; }
          .country-label { font-size: 4px; }
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="mark" aria-hidden="true">S</div>
            <div>
              <strong>Research Encyclopedia</strong>
              <span>Social and solidarity economy</span>
            </div>
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
              <div className="map-heading">
                <h2>{isPersian ? "جهان را بررسی کنید" : "Explore the world"}</h2>
                <span>{isPersian ? "برای شروع روی یک منطقه کلیک کنید" : "Click a region to begin"}</span>
              </div>
              <div className="map-wrap">
                {mapError ? (
                  <div className="map-status error">The local world map could not be loaded.</div>
                ) : countries.length === 0 ? (
                  <div className="map-status">Loading the world map...</div>
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
                          ? "#c9aeb2"
                          : hasContent
                            ? "#d7b0b5"
                            : "#b8bec4";

                        return (
                          <Geography
                            className={`geography ${hasContent ? "has-content" : ""} ${isSelected ? "selected" : ""}`}
                            key={`country-${country.rsmKey || country.properties?.ISO_A3 || name}-${index}`}
                            geography={country}
                            style={{
                              default: { fill: countryFill, outline: "none" },
                              hover: { fill: hasContent ? "#c88992" : "#a5adb5", outline: "none" },
                              pressed: { fill: "#c9aeb2", outline: "none" },
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
                      {countries.map((country, index) => (
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
                    <h3>{profile?.name || countryName}: communities, economy, and solidarity</h3>
                    <p>{profile?.article || (isPersian ? "مقاله اختصاصی این کشور هنوز آماده نشده است." : "The country-specific article is not available yet.")}</p>
                  </div>
                  <p className="panel-note">{isPersian ? "نمایه‌ها از طریق بخش مدیریت کاوش کشورها منتشر و نگهداری می‌شوند." : "Profiles are published and maintained from the WordPress Country Explorer dashboard."}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
