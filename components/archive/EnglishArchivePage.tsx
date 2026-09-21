"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart3,
  ChevronRight,
  Download,
  FileText,
  Globe,
  Grid2X2,
  Leaf,
  Mail,
  Menu,
  MoonStar,
  Search,
  Sparkles,
  SunMedium,
  Users,
  X,
} from "lucide-react";
import { articles } from "@/lib/articles";
import { encyclopediaParts } from "./ArchivePage";

const extraParts = [
  { id: "part-5", number: "V", title: "GLOBALIZATION AND ALTERNATIVES" },
  { id: "part-6", number: "VI", title: "POLICY AND GOVERNANCE" },
  { id: "part-7", number: "VII", title: "CASE STUDIES" },
  { id: "part-8", number: "VIII", title: "FUTURE PERSPECTIVES" },
];

type ViewId = "overview" | "insights" | "reports" | "authors";

type AuthorProfile = {
  name: string;
  entries: string[];
  bio: string;
  email: string;
  profileUrl: string;
  photo: string;
};

const reports = [
  {
    title: "The State of the Social Economy",
    description:
      "A concise overview of cooperatives, social enterprises, non-governmental organizations, and other institutions active in the social economy, with a focus on the most important trends shaping the field.",
  },
  {
    title: "Barriers to Cooperative Development",
    description:
      "An examination of the legal, financial, managerial, and cultural challenges facing cooperatives, as well as the factors that shape member participation and organizational performance.",
  },
  {
    title: "The Social Economy and Youth Employment",
    description:
      "An assessment of how social economy institutions can create employment opportunities, support collective entrepreneurship, and increase young people’s participation in economic life.",
  },
  {
    title: "Financing Social Enterprises",
    description:
      "A review of financing models for social enterprises and cooperatives, including the challenges they face when accessing capital and other financial resources.",
  },
  {
    title: "The Social Economy and Local Development",
    description:
      "A study of how cooperatives, local groups, and social organizations generate income and employment while strengthening the economic capacities of local communities.",
  },
  {
    title: "The Social Economy and the Energy Transition",
    description:
      "An exploration of the social economy’s capacity to reduce energy use, develop green jobs, and support vulnerable groups during the energy transition.",
  },
];

const authors: AuthorProfile[] = [
  {
    name: "Hamish Jenkins",
    entries: ["Activism and social movements"],
    bio: "Hamish Jenkins is a researcher and practitioner in development, social justice and the Social and Solidarity Economy. He has worked with the UN system and with civil society networks on economic alternatives and inclusive development.",
    email: "hamishjenkins1967@gmail.com",
    profileUrl: "https://commons.wikimedia.org/wiki/File:Civil_Society_Forum,_Introduction_and_Welcome_(7090442873).jpg",
    photo: "/pics/authors/picauthors/hamish jenkins.jpg",
  },
  {
    name: "Stephen Healy",
    entries: ["Community economies"],
    bio: "Stephen Healy is an Associate Professor in Geography, Planning and Urban Studies at Western Sydney University. His work focuses on community economies, diverse economies, and alternative ways of organizing life beyond market-led models.",
    email: "s.healy@westernsydney.edu.au",
    profileUrl: "https://researchers.westernsydney.edu.au/en/persons/stephen-healy/",
    photo: "/pics/authors/picauthors/stephen healy.webp",
  },
  {
    name: "Peter Utting",
    entries: ["Contemporary understandings"],
    bio: "Peter Utting is a leading scholar in sustainable development and social and solidarity economy, with a long career at UNRISD and expertise in development, social movements, and policy.",
    email: "utting@unrisd.org",
    profileUrl: "https://www.socioeco.org/bdf_auteur-1566_en.html",
    photo: "/pics/authors/picauthors/Peter Utting.jpg",
  },
  {
    name: "Dražen Šimleša",
    entries: ["Ecological economics"],
    bio: "Dražen Šimleša researches sustainable development, social economy, solidarity economy and environmental transformation, with strong links to European social economy networks.",
    email: "drazen.simlesa@pilar.hr",
    profileUrl: "https://www.pilar.hr/znanstvenici/",
    photo: "/pics/authors/picauthors/Dražen Šimleša.jpg",
  },
  {
    name: "Suzanne Bergeron",
    entries: ["Feminist economics"],
    bio: "Suzanne Bergeron is an economist and feminist scholar whose work explores care economies, gender, globalization and the social and solidarity economy.",
    email: "sbergero@umich.edu",
    profileUrl: "https://umdearborn.edu/people-um-dearborn/suzanne-bergeron",
    photo: "/pics/authors/picauthors/suzanne_bergeron.jpg",
  },
  {
    name: "Carmen Marcuello",
    entries: ["Globalization and alter-globalization"],
    bio: "Carmen Marcuello is a professor of economics and business administration whose research centers on social economy, cooperatives, social capital and institutional innovation.",
    email: "cmarcue@unizar.es",
    profileUrl: "https://dees.unizar.es/?lang=en&page_id=383",
    photo: "/pics/authors/picauthors/Carmen Marcuello Servós.jpg",
  },
  {
    name: "Jean-Louis Laville",
    entries: ["Heterodox economics", "Moral economy and human economy", "Origins and histories"],
    bio: "Jean-Louis Laville is a central theorist of the solidarity economy and social innovation, with broad work on associations, democracy and plural economic organization.",
    email: "jean-louis.laville@lecnam.net",
    profileUrl: "https://ifris.org/membre/laville-jean-louis/",
    photo: "/pics/authors/picauthors/Jean-Louis Laville.jpeg",
  },
  {
    name: "Luciane Lucas dos Santos",
    entries: ["Indigenous economies", "Postcolonial theories"],
    bio: "Luciane Lucas dos Santos researches collective knowledge, democracy, justice and solidarity economy with a focus on social transformation and participatory inquiry.",
    email: "lucianelucas@ces.uc.pt",
    profileUrl: "https://ces.uc.pt/en/ces/pessoas/investigadoras-es/luciane-lucas-dos-santos",
    photo: "/pics/authors/picauthors/Luciane Lucas dos.jpeg",
  },
  {
    name: "Yvon Poirier",
    entries: ["Activism and social movements"],
    bio: "Yvon Poirier is an international advocate and researcher for the social and solidarity economy, with experience in cooperative networks and global policy advocacy.",
    email: "ypoirier@videotron.ca",
    profileUrl: "https://www.ripess.org/governance/?lang=en",
    photo: "/pics/authors/picauthors/Yvon Poirier.jpg",
  },
  {
    name: "Ana Inés Heras",
    entries: ["Community economies"],
    bio: "Ana Inés Heras studies self-management, collective learning and participatory knowledge production in the social and solidarity economy.",
    email: "herasmonnersans@gmail.com",
    profileUrl: "https://www.aacademica.org/ana.ines.heras",
    photo: "/pics/authors/picauthors/Ana Inés Heras.jpg",
  },
  {
    name: "Anjel Errasti",
    entries: ["Globalization and alter-globalization"],
    bio: "Anjel Errasti researches cooperatives, social economy and public policy, with a strong interest in the Mondragon cooperative model and democratic economic organization.",
    email: "a.errasti@ehu.eus",
    profileUrl: "https://www.ehu.eus/es/web/graduak/grado-administracion-direccion-empresas-gipuzkoa/profesorado?idPdi=5497&redirect=fichaPDI",
    photo: "/pics/authors/picauthors/Anjel Errasti.jpg",
  },
  {
    name: "Ignacio Bretos",
    entries: ["Globalization and alter-globalization"],
    bio: "Ignacio Bretos works on management, cooperatives and social enterprises, with a focus on organizational transformation and alternative economic practices.",
    email: "ibretos@unizar.es",
    profileUrl: "https://sideral.unizar.es/sideral/sid900perfilPublico.faces?id=ignacio-bretos-fernandez",
    photo: "/pics/authors/picauthors/Ignacio Bretos.jpg",
  },
  {
    name: "Sharon D. Wright Austin",
    entries: ["The Black social economy"],
    bio: "Sharon D. Wright Austin is a political scientist and educator whose work addresses race, participation, community power and the social foundations of economic life.",
    email: "polssdw@ufl.edu",
    profileUrl: "https://polisci.ufl.edu/directory/sharon-austin/",
    photo: "/pics/authors/picauthors/Sharon D. Wright Austin.jpg",
  },
  {
    name: "Anabel Rieiro",
    entries: ["The commons"],
    bio: "Anabel Rieiro researches labor, social organizations, solidarity economy and environmental sustainability, with attention to collective knowledge and local action.",
    email: "anabel.rieiro@cienciassociales.edu.uy",
    profileUrl: "https://alimentacionybienestar.ei.udelar.edu.uy/integrantes/",
    photo: "/pics/authors/picauthors/Anabel Rieiro.jpg",
  },
  {
    name: "Peter North",
    entries: ["Community economies"],
    bio: "Peter North is Professor of Alternative Economies at the University of Liverpool and studies diverse economies, social movements and community-oriented economic alternatives.",
    email: "P.J.North@liverpool.ac.uk",
    profileUrl: "https://www.liverpool.ac.uk/people/peter-north",
    photo: "/pics/authors/picauthors/Peter North.jpg",
  },
];

const styles = `
  .english-archive { --ink:#193641; --muted:#5d7580; --soft:#345563; --accent:#3e9fb5; --line:rgba(40,105,122,.2); --panel:rgba(220,235,240,.76); --panel-strong:rgba(242,249,251,.88); --chip:rgba(62,159,181,.1); height:100dvh; min-height:100dvh; overflow:hidden; color:var(--ink); background:linear-gradient(110deg,rgba(211,229,236,.92),rgba(187,215,225,.84)),url('/bgaboutus.png') center/cover fixed; font-family:'Vazirmatn',sans-serif; }
  .english-archive.theme-dark { --ink:#edf8fa; --muted:#abc3cb; --soft:#c8dfe5; --accent:#82c9d8; --line:rgba(184,225,235,.22); --panel:rgba(17,55,68,.7); --panel-strong:rgba(22,68,82,.84); --chip:rgba(105,194,211,.12); background:linear-gradient(110deg,rgba(18,55,69,.8),rgba(25,78,91,.72)),url('/bgaboutus.png') center/cover fixed; }
  .english-archive * { box-sizing:border-box; scrollbar-width:thin; scrollbar-color:rgba(62,159,181,.58) transparent; }
  .english-archive *::-webkit-scrollbar { width:8px; height:8px; }
  .english-archive *::-webkit-scrollbar-track { background:transparent; }
  .english-archive *::-webkit-scrollbar-thumb { border:2px solid transparent; border-radius:999px; background:rgba(62,159,181,.58); background-clip:padding-box; }
  .english-archive *::-webkit-scrollbar-thumb:hover { background:rgba(62,159,181,.82); background-clip:padding-box; }
  .english-archive *::-webkit-scrollbar-button { display:none; width:0; height:0; }
  .archive-shell { display:grid; grid-template-columns:270px minmax(0,1fr); height:100%; min-height:0; }
  .archive-sidebar { display:flex; flex-direction:column; gap:22px; min-height:0; height:100%; overflow:auto; padding:22px 20px; border-right:1px solid var(--line); background:rgba(242,250,252,.72); backdrop-filter:blur(18px); }
  .theme-dark .archive-sidebar { background:rgba(9,37,49,.68); }
  .archive-brand { display:flex; align-items:center; min-height:72px; padding:8px 10px; border-radius:14px; background:rgba(8,48,47,.92); color:var(--ink); text-decoration:none; }
  .archive-brand img { width:100%; height:auto; max-height:66px; flex:none; object-fit:contain; }
  .side-nav, .side-nav-group { display:grid; gap:7px; }
  .side-nav button { display:flex; align-items:center; gap:12px; width:100%; padding:11px 13px; border:1px solid transparent; border-radius:11px; color:var(--muted); background:transparent; text-align:left; font:inherit; font-size:13px; cursor:pointer; transition:.2s ease; }
  .side-nav button:hover, .side-nav button.active { color:var(--ink); background:rgba(62,159,181,.14); border-color:rgba(116,198,214,.28); }
  .side-label { margin:6px 12px 3px; color:#6f9187; font-size:10px; letter-spacing:.16em; }
  .side-divider { height:1px; background:var(--line); }
  .mission { display:flex; gap:10px; margin-top:auto; padding:14px 12px; border:1px solid var(--line); border-radius:13px; background:rgba(62,159,181,.08); color:var(--soft); font-size:11px; line-height:1.7; }
  .mission svg { flex:none; color:var(--accent); margin-top:3px; }
  .theme-toggle { display:flex; align-items:center; gap:10px; padding:11px 13px; border:1px solid var(--line); border-radius:12px; background:rgba(62,159,181,.08); color:var(--ink); cursor:pointer; }
  .archive-main { display:flex; flex-direction:column; min-width:0; min-height:0; height:100%; overflow:hidden; padding:20px 24px 22px; }
  .archive-hero, .glass-panel { border:1px solid var(--line); background:var(--panel); backdrop-filter:blur(18px) saturate(112%); -webkit-backdrop-filter:blur(18px) saturate(112%); box-shadow:0 24px 70px rgba(0,12,15,.2),inset 0 1px 0 rgba(235,255,246,.12); }
  .archive-hero { display:flex; justify-content:space-between; align-items:center; flex:none; gap:28px; min-height:118px; padding:20px 24px; border-radius:17px; }
  .hero-copy { max-width:670px; }
  .hero-copy h1 { margin:0 0 8px; font-size:clamp(1.65rem,2.7vw,2.2rem); letter-spacing:-.02em; line-height:1.25; }
  .hero-copy h1 span { color:var(--accent); }
  .hero-copy p { margin:0; max-width:640px; color:var(--muted); font-size:13px; }
  .archive-search-wrap { display:flex; align-items:flex-start; gap:10px; }
  .search-field-group { display:flex; flex-direction:column; align-items:flex-start; gap:7px; }
  .archive-search { display:flex; align-items:center; gap:10px; width:min(390px,100%); padding:12px 14px; border:1px solid var(--line); border-radius:999px; background:rgba(2,20,23,.6); color:var(--muted); }
  .theme-light .archive-search { background:rgba(255,255,255,.5); }
  .archive-search.professional-active { border-color:rgba(255,255,255,.95); box-shadow:0 0 0 2px rgba(255,255,255,.44),0 0 26px rgba(255,255,255,.52),inset 0 0 18px rgba(255,255,255,.12); }
  .archive-search input, .mini-search input { width:100%; border:0; outline:0; color:var(--ink); background:transparent; font:inherit; font-size:12px; }
  .archive-search input::placeholder, .mini-search input::placeholder { color:#719087; }
  .search-filter { border:0; color:var(--soft); background:transparent; cursor:pointer; display:grid; place-items:center; }
  .archive-search-wrap > .search-filter { transform:translateY(5px); }
  .search-filter.active { color:var(--accent); box-shadow:0 0 0 1px rgba(130,201,216,.5),0 0 28px rgba(130,201,216,.22); border-radius:10px; padding:6px; background:rgba(130,201,216,.1); }
  .section-tabs { display:none; }
  .section-tab { background:rgba(255,255,255,.02); border:1px solid var(--line); color:var(--muted); border-radius:999px; padding:9px 13px; cursor:pointer; font:inherit; font-size:11px; }
  .section-tab.active { background:linear-gradient(90deg,rgba(62,159,181,.18),rgba(62,159,181,.08)); color:var(--ink); border-color:rgba(116,198,214,.3); }
  .workspace { display:grid; flex:1; grid-template-columns:minmax(215px,.82fr) minmax(245px,.92fr) minmax(390px,1.7fr); gap:14px; min-height:0; margin-top:15px; }
  .glass-panel { display:flex; flex-direction:column; min-width:0; min-height:0; overflow:hidden; border-radius:15px; }
  .panel-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:18px 17px 13px; border-bottom:1px solid var(--line); }
  .panel-heading h2 { margin:0; font-size:16px; }
  .panel-heading p { margin:4px 0 0; color:var(--muted); font-size:11px; }
  .count-pill, .hero-kicker, .lang-label { display:inline-flex; align-items:center; padding:5px 9px; border:1px solid rgba(171,226,199,.19); border-radius:999px; color:var(--accent); background:var(--chip); font-size:10px; white-space:nowrap; }
  .panel-list { flex:1; min-height:0; padding:10px; overflow:auto; }
  .part-row, .entry-row { display:flex; align-items:center; gap:11px; width:100%; border:1px solid transparent; border-radius:11px; color:var(--soft); background:transparent; text-align:left; cursor:pointer; transition:.18s ease; }
  .part-row { padding:11px 9px; }
  .entry-row { padding:9px; }
  .part-row:hover, .entry-row:hover { background:rgba(62,159,181,.08); }
  .part-row.selected, .entry-row.selected { color:var(--ink); border-color:rgba(91,177,195,.36); background:linear-gradient(90deg,rgba(62,159,181,.18),rgba(62,159,181,.06)); box-shadow:0 7px 20px rgba(44,126,148,.1); }
  .hidden { display:none; }
  .number { display:grid; place-items:center; flex:none; width:27px; height:27px; border:1px solid rgba(164,212,194,.2); border-radius:50%; color:var(--muted); font-size:10px; }
  .selected .number { border-color:var(--accent); color:var(--accent); }
  .row-copy { min-width:0; flex:1; }
  .row-copy strong { display:block; overflow:hidden; color:inherit; font-size:11px; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
  .row-copy small { display:block; margin-top:2px; color:var(--muted); font-size:10px; }
  .part-row .row-copy strong { white-space:normal; line-height:1.45; }
  .row-arrow { flex:none; color:var(--muted); }
  .selected .row-arrow { color:var(--accent); }
  .mini-search { display:flex; align-items:center; gap:8px; padding:10px 12px; background:rgba(220,239,244,.58); border:1px solid var(--line); border-radius:10px; color:var(--muted); margin:10px 10px 0; }
  .theme-dark .mini-search { background:rgba(4,30,43,.52); }
  .entry-list { max-height:none; }
  .preview-scroll { flex:1; min-height:0; padding:12px; overflow:auto; }
  .preview-hero { position:relative; min-height:132px; display:flex; align-items:flex-end; overflow:hidden; padding:14px; border:1px solid rgba(174,221,231,.24); border-radius:13px; background:linear-gradient(135deg,rgba(13,53,68,.3),rgba(12,64,79,.92)),url('/homepage/encyclopedia.png') center/cover; }
  .preview-hero:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,transparent 20%,rgba(3,22,24,.72)); }
  .preview-hero > div { position:relative; z-index:1; }
  .hero-kicker { margin-bottom:9px; color:#c4edf4; }
  .preview-hero h2 { max-width:460px; margin:0; font-size:20px; line-height:1.25; }
  .preview-subtitle { margin:5px 0 0; color:#c0dbe2; font-size:10px; }
  .language-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 2px 8px; }
  .language-bar strong { display:block; font-size:12px; }
  .language-bar p { margin:3px 0 0; color:var(--muted); font-size:10px; }
  .lang-switch { display:flex; gap:3px; padding:3px; border:1px solid var(--line); border-radius:999px; background:rgba(18,51,63,.38); }
  .lang-switch button { border:0; border-radius:999px; padding:6px 10px; color:#d8eef2; background:transparent; cursor:pointer; font:inherit; font-size:10px; }
  .theme-light .lang-switch { background:rgba(255,255,255,.48); }
  .theme-light .lang-switch button { color:#365b67; }
  .lang-switch button.active { color:#123541; background:var(--accent); }
  .content-card { padding:13px; border:1px solid var(--line); border-radius:13px; background:var(--panel-strong); }
  .lang-label { margin-bottom:8px; }
  .content-card h3 { margin:0 0 6px; font-size:17px; line-height:1.3; }
  .content-card p { margin:0 0 8px; color:var(--muted); font-size:11px; line-height:1.55; }
  .quote { padding:9px; border:1px dashed rgba(164,224,193,.25); border-radius:10px; color:var(--soft); background:rgba(102,183,145,.06); font-size:10px; line-height:1.5; }
  .metadata { display:grid; grid-template-columns:1.25fr .7fr 1.5fr; gap:7px; margin-top:8px; }
  .metadata div { padding:8px; border:1px solid var(--line); border-radius:10px; background:rgba(255,255,255,.02); display:flex; flex-direction:column; gap:3px; }
  .metadata strong { color:var(--soft); font-size:10px; text-transform:uppercase; letter-spacing:.12em; }
  .metadata span { color:var(--ink); font-size:11px; }
  .read-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; margin-top:10px; padding:8px 12px; border:1px solid rgba(255,255,255,.82); border-radius:999px; color:var(--ink); background:linear-gradient(90deg,rgba(255,255,255,.74),rgba(224,246,250,.48)); box-shadow:0 0 0 1px rgba(255,255,255,.26),0 0 18px rgba(255,255,255,.2); text-decoration:none; font-size:11px; font-weight:700; }
  .empty-state { padding:35px 16px; color:var(--muted); text-align:center; font-size:12px; }
  .search-notice { color:var(--soft); font-size:10px; line-height:1.3; }
  .insights-shell, .reports-shell, .authors-shell { min-height:0; flex:1; margin-top:18px; overflow:auto; }
  .insights-shell, .reports-shell { display:grid; align-content:start; gap:18px; }
  .insights-card, .reports-hero, .report-card, .author-card { border:1px solid var(--line); border-radius:18px; background:var(--panel-strong); box-shadow:0 18px 45px rgba(5,14,17,.12); }
  .insights-card { padding:24px; }
  .insights-card h3 { margin:0 0 12px; font-size:28px; }
  .insights-card p { margin:0 0 12px; color:var(--muted); line-height:1.9; font-size:14px; }
  .reports-hero { padding:20px 22px; }
  .reports-hero h3 { margin:0 0 6px; font-size:28px; }
  .reports-hero p { margin:0; color:var(--muted); line-height:1.8; }
  .reports-grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:16px; }
  .report-card { display:flex; flex-direction:column; padding:18px 18px 16px; min-height:220px; }
  .report-card .tag { display:inline-flex; padding:5px 9px; border-radius:999px; background:var(--chip); border:1px solid rgba(171,226,199,.22); color:var(--accent); font-size:10px; margin-bottom:12px; }
  .report-card h4 { margin:0 0 10px; font-size:18px; line-height:1.4; }
  .report-card p { margin:0; color:var(--muted); font-size:12px; line-height:1.8; }
  .report-download { display:inline-flex; align-items:center; gap:7px; width:max-content; margin-top:auto; padding:8px 11px; border:1px solid var(--line); border-radius:10px; color:var(--soft); background:rgba(62,159,181,.08); font:inherit; font-size:10px; cursor:not-allowed; }
  .authors-shell { display:grid; grid-template-columns:minmax(230px,1fr) minmax(230px,1fr) minmax(300px,1.25fr); gap:14px; }
  .author-list, .author-entries { display:flex; flex-direction:column; min-height:0; overflow:auto; padding:10px; border:1px solid var(--line); border-radius:15px; background:var(--panel); }
  .author-list { gap:8px; }
  .author-entries { gap:8px; }
  .author-panel-heading { padding:5px 4px 9px; color:var(--muted); font-size:11px; font-weight:600; }
  .author-search { flex:none; margin:0 0 8px; }
  .author-item { width:100%; border:1px solid var(--line); border-radius:11px; background:rgba(255,255,255,.24); color:var(--ink); padding:10px 11px; text-align:left; cursor:pointer; }
  .author-item.active { background:linear-gradient(90deg,rgba(62,159,181,.16),rgba(62,159,181,.05)); border-color:rgba(91,177,195,.42); }
  .author-item strong { display:block; font-size:14px; margin-bottom:4px; }
  .author-item span { color:var(--muted); font-size:11px; line-height:1.5; }
  .authors-heading { margin:0 0 10px; color:var(--muted); font-size:11px; font-weight:600; }
  .author-entry { display:flex; align-items:center; gap:10px; width:100%; padding:11px; border:1px solid var(--line); border-radius:11px; color:var(--ink); background:rgba(255,255,255,.22); text-align:left; cursor:pointer; font:inherit; }
  .author-entry:hover, .author-entry.selected { border-color:rgba(91,177,195,.42); background:rgba(62,159,181,.12); }
  .author-entry .number { width:25px; height:25px; }
  .author-card { min-height:0; overflow:auto; padding:15px; display:grid; align-content:start; gap:12px; }
  .author-profile { display:flex; align-items:flex-start; gap:16px; }
  .author-profile img { width:125px; height:125px; object-fit:cover; border-radius:15px; border:1px solid var(--line); }
  .author-profile h3 { margin:0 0 6px; font-size:22px; }
  .author-profile p { margin:0; color:var(--muted); line-height:1.6; font-size:11px; }
  .author-actions { display:flex; flex-wrap:wrap; gap:10px; }
  .author-link { display:inline-flex; align-items:center; gap:8px; padding:10px 14px; background:rgba(62,159,181,.09); border:1px solid rgba(116,198,214,.28); border-radius:999px; text-decoration:none; color:var(--ink); font-size:12px; }
  .mobile-menu { display:none; }
  .archive-sidebar .mobile-close { display:none; }
  @media (max-width:1100px) { .workspace { grid-template-columns:minmax(190px,.8fr) minmax(220px,1fr); }.glass-panel:last-child { grid-column:1/-1; }.preview-scroll { max-height:none; }.archive-hero { align-items:flex-start; flex-direction:column; }.archive-search-wrap { width:100%; } .reports-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .authors-shell { grid-template-columns:1fr; } }
  @media (max-width:700px) { .archive-shell { display:block; }.archive-sidebar { position:fixed; z-index:20; inset:0 auto 0 0; width:270px; transform:translateX(-105%); transition:.25s ease; }.archive-sidebar.open { transform:translateX(0); }.archive-sidebar .mobile-close { display:block; position:absolute; top:17px; right:14px; border:0; color:var(--soft); background:transparent; cursor:pointer; }.mobile-menu { display:grid; place-items:center; position:fixed; z-index:10; top:14px; left:14px; width:38px; height:38px; border:1px solid var(--line); border-radius:10px; color:var(--accent); background:rgba(5,30,30,.85); }.archive-main { padding:70px 12px 76px; }.archive-hero { padding:21px 18px; }.workspace { grid-template-columns:1fr; }.glass-panel:last-child { grid-column:auto; }.panel-list,.preview-scroll { max-height:none; }.metadata { grid-template-columns:1fr 1fr; }.metadata div:last-child { grid-column:1/-1; }.preview-hero h2 { font-size:21px; }.reports-grid { grid-template-columns:1fr; }.author-profile { flex-direction:column; }.author-profile img { width:100%; height:220px; } }
`;

export default function EnglishArchivePage() {
  const [query, setQuery] = useState("");
  const [partId, setPartId] = useState("part-1");
  const [entryNo, setEntryNo] = useState(1);
  const [language, setLanguage] = useState<"fa" | "en">("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [professionalSearchActive, setProfessionalSearchActive] = useState(false);
  const [searchNotice, setSearchNotice] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [selectedAuthor, setSelectedAuthor] = useState<string>(authors[0].name);
  const [authorQuery, setAuthorQuery] = useState("");
  const [authorEntryQuery, setAuthorEntryQuery] = useState("");
  const [selectedAuthorEntry, setSelectedAuthorEntry] = useState("");

  const parts = useMemo(
    () => [
      ...encyclopediaParts.map((part) => ({ ...part, title: part.enTitle })),
      ...extraParts.map((part) => ({ ...part, entries: [], faTitle: "", enTitle: part.title })),
    ],
    [],
  );

  const selectedPart = parts.find((part) => part.id === partId) ?? parts[0];
  const selectedEntry = selectedPart.entries.find((entry) => entry.no === entryNo) ?? selectedPart.entries[0];
  const article = articles.find((item) => item.startPage === selectedEntry?.page) ?? articles[0];
  const visibleEntries = selectedPart.entries.filter((entry) => {
    const term = query.trim().toLowerCase();
    return !term || `${entry.en} ${entry.fa} ${entry.page} ${entry.no}`.toLowerCase().includes(term);
  });
  const globalMatches = query.trim()
    ? parts.filter((part) => part.entries.some((entry) => `${entry.en} ${entry.fa} ${entry.page}`.toLowerCase().includes(query.trim().toLowerCase())))
    : parts;

  const selectPart = (id: string) => {
    setPartId(id);
    const next = parts.find((part) => part.id === id);
    setEntryNo(next?.entries[0]?.no ?? 0);
  };

  const currentAuthor = authors.find((author) => author.name === selectedAuthor) ?? authors[0];
  const allAuthorEntries = parts
    .flatMap((part) => part.entries)
    .filter((entry, index, entries) => entries.findIndex((candidate) => candidate.no === entry.no) === index);
  const visibleAuthorEntries = allAuthorEntries.filter((entry) => entry.en.toLowerCase().includes(authorEntryQuery.trim().toLowerCase()));
  const visibleAuthors = authors.filter((author) => {
    const matchesQuery = author.name.toLowerCase().includes(authorQuery.trim().toLowerCase());
    const matchesEntry = !selectedAuthorEntry || author.entries.includes(selectedAuthorEntry);
    return matchesQuery && matchesEntry;
  });

  const handleProfessionalSearch = () => {
    setProfessionalSearchActive((active) => {
      const next = !active;
      setSearchNotice(next ? "Advanced search activated." : "");
      return next;
    });
  };

  const handleSearchSubmit = () => {
    setProfessionalSearchActive(false);
    setSearchNotice("Professional search is not active yet.");
  };

  return (
    <div className={`english-archive ${theme === "light" ? "theme-light" : "theme-dark"}`} dir="ltr">
      <style>{styles}</style>
      <button className="mobile-menu" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>
        <Menu size={18} />
      </button>
      <div className="archive-shell">
        <aside className={`archive-sidebar ${menuOpen ? "open" : ""}`}>
          <button className="mobile-close" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>
            <X size={18} />
          </button>
          <Link href="/en" className="archive-brand">
            <img src="/homepage/logo-2-w.png" alt="Social and Solidarity Economy Knowledge Platform" />
          </Link>

          <nav className="side-nav">
            <button type="button" className={activeView === "overview" ? "active" : ""} onClick={() => setActiveView("overview")}>
              <Grid2X2 size={17} />Overview
            </button>
            <button type="button" className={activeView === "insights" ? "active" : ""} onClick={() => setActiveView("insights")}>
              <BarChart3 size={16} />Insights
            </button>
            <button type="button" className={activeView === "reports" ? "active" : ""} onClick={() => setActiveView("reports")}>
              <FileText size={16} />Reports
            </button>
            <button type="button" className={activeView === "authors" ? "active" : ""} onClick={() => setActiveView("authors")}>
              <Users size={16} />Authors
            </button>
          </nav>

          <div className="side-divider" />

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
            <span>{theme === "dark" ? "Switch to light" : "Switch to dark"}</span>
          </button>

          <div className="mission">
            <Leaf size={17} />
            <span>
              Knowledge for
              <br />
              <strong>a more just and sustainable economy</strong>
            </span>
          </div>
        </aside>

        <main className="archive-main">
          <header className="archive-hero" id="overview">
            <div className="hero-copy">
              <h1>
                Social and Solidarity Economy <span>Encyclopedia</span>
              </h1>
              <p>
                A comprehensive collection of entries on the social economy, solidarity, and transformative economic approaches.
              </p>
            </div>

            <div className="archive-search-wrap">
              <div className="search-field-group">
                <div className={`archive-search ${professionalSearchActive ? "professional-active" : ""}`}>
                  <Search size={17} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entries, keywords, or page numbers..." />
                  <button
                    className={`search-filter ${professionalSearchActive ? "active" : ""}`}
                    type="button"
                    aria-label="Activate advanced search"
                    onClick={handleProfessionalSearch}
                  >
                    <Sparkles size={16} />
                  </button>
                </div>
                {searchNotice ? <span className="search-notice">{searchNotice}</span> : null}
              </div>
              <button className="search-filter" type="button" onClick={handleSearchSubmit} aria-label="Run search">
                <Search size={17} />
              </button>
            </div>
          </header>

          {activeView === "overview" && (
            <div className="workspace">
              <section className="glass-panel" id="parts">
                <div className="panel-heading">
                  <div>
                    <h2>Parts</h2>
                    <p>Select a part to view its entries</p>
                  </div>
                  <span className="count-pill">{parts.length} parts</span>
                </div>
                <div className="panel-list">
                  {parts.map((part) => (
                    <button
                      key={part.id}
                      className={`part-row ${part.id === selectedPart.id ? "selected" : ""} ${query && !globalMatches.some((match) => match.id === part.id) ? "hidden" : ""}`}
                      type="button"
                      onClick={() => selectPart(part.id)}
                    >
                      <span className="number">{part.number}</span>
                      <span className="row-copy">
                        <strong>{part.title}</strong>
                        <small>{part.entries.length || "No entries yet"} entries</small>
                      </span>
                      <ChevronRight className="row-arrow" size={15} />
                    </button>
                  ))}
                </div>
              </section>

              <section className="glass-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Entries</h2>
                    <p>Browse entries in the selected part</p>
                  </div>
                  <span className="count-pill">{selectedPart.entries.length} entries</span>
                </div>
                <label className="mini-search">
                  <Search size={15} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search within this part..." />
                </label>
                <div className="panel-list entry-list">
                  {visibleEntries.length ? (
                    visibleEntries.map((entry) => (
                      <button
                        key={entry.no}
                        className={`entry-row ${entry.no === entryNo ? "selected" : ""}`}
                        type="button"
                        onClick={() => setEntryNo(entry.no)}
                      >
                        <span className="number">{entry.no}</span>
                        <span className="row-copy">
                          <strong>{entry.en}</strong>
                          <small>Page {entry.page}</small>
                        </span>
                        <ChevronRight className="row-arrow" size={15} />
                      </button>
                    ))
                  ) : (
                    <div className="empty-state">No entries match this search.</div>
                  )}
                </div>
              </section>

              <section className="glass-panel" id="preview">
                <div className="panel-heading">
                  <div>
                    <h2>Entry preview</h2>
                    <p>Selected entry information</p>
                  </div>
                  <span className="count-pill">Entry {selectedEntry?.no ?? "—"}</span>
                </div>
                <div className="preview-scroll">
                  {selectedEntry && article ? (
                    <>
                      <div className="preview-hero">
                        <div>
                          <span className="hero-kicker">
                            PART {selectedPart.number}: {selectedPart.title}
                          </span>
                          <h2>{selectedEntry.en}</h2>
                          <p className="preview-subtitle">{selectedEntry.en}</p>
                        </div>
                      </div>

                      <div className="language-bar">
                        <div>
                          <strong>Entry display language</strong>
                          <p>Switch the preview text between Persian and English</p>
                        </div>
                        <div className="lang-switch">
                          <button className={language === "fa" ? "active" : ""} type="button" onClick={() => setLanguage("fa")}>
                            Persian
                          </button>
                          <button className={language === "en" ? "active" : ""} type="button" onClick={() => setLanguage("en")}>
                            English
                          </button>
                        </div>
                      </div>

                      <article className="content-card" dir={language === "fa" ? "rtl" : "ltr"}>
                        <span className="lang-label">{language === "fa" ? "Persian view" : "English view"}</span>
                        <h3>{language === "fa" ? article.title.fa : article.title.en}</h3>
                        <p>{language === "fa" ? article.description.fa : article.description.en}</p>
                        <div className="quote">
                          {language === "fa"
                            ? "این مدخل نشان می‌دهد که چگونه کنش جمعی می‌تواند الگوهای اقتصادی بدیل را بسازد و بر سیاست عمومی و تحول اجتماعی اثر بگذارد."
                            : "This entry offers a compelling analysis of how social movements have helped shape the social and solidarity economy, showing how collective action can build alternative economic models while also influencing public policy and broader social transformation."}
                        </div>
                        <div className="metadata">
                          <div>
                            <strong>Author</strong>
                            <span>{article.author}</span>
                          </div>
                          <div>
                            <strong>Start page</strong>
                            <span>{article.startPage}</span>
                          </div>
                          <div>
                            <strong>Category</strong>
                            <span>{language === "fa" ? article.category.fa : article.category.en}</span>
                          </div>
                        </div>
                        <Link className="read-btn" href={`/en/articles/${article.slug}`}>
                          {language === "fa" ? "مشاهده مدخل" : "View entry"} <ChevronRight size={14} />
                        </Link>
                      </article>
                    </>
                  ) : (
                    <div className="empty-state">No preview is available for this selection.</div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeView === "insights" && (
            <div className="insights-shell">
              <div className="insights-card">
                <span className="count-pill">Under development</span>
                <h3>Insights are currently under development for English-speaking audiences.</h3>
                <p>
                  This section is a small social network where researchers can share their perspectives on different encyclopedia entries and discuss them in dialogue.
                </p>
                <p>
                  The goal is to create a collaborative space for scholars to exchange ideas, compare interpretations, and engage in constructive conversation about the concepts, histories, and debates documented in the encyclopedia.
                </p>
                <p>
                  In other words, this is a lightweight community platform for research exchange: short reflections, annotations, and discussion threads around specific entries and topics.
                </p>
              </div>
            </div>
          )}

          {activeView === "reports" && (
            <div className="reports-shell">
              <div className="reports-grid">
                {reports.map((report) => (
                  <article className="report-card" key={report.title}>
                    <h4>{report.title}</h4>
                    <p>{report.description}</p>
                    <button className="report-download" type="button" disabled title="The PDF file will be available here soon">
                      <Download size={14} />
                      PDF coming soon
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeView === "authors" && (
            <div className="authors-shell">
              <div className="author-entries">
                <h2 className="author-panel-heading">Encyclopedia entries</h2>
                <label className="mini-search author-search">
                  <Search size={14} />
                  <input value={authorEntryQuery} onChange={(event) => setAuthorEntryQuery(event.target.value)} placeholder="Search entries..." />
                </label>
                {visibleAuthorEntries.length ? (
                  visibleAuthorEntries.map((entry) => (
                    <button
                      className={`author-entry ${selectedAuthorEntry === entry.en ? "selected" : ""}`}
                      type="button"
                      key={entry.no}
                      onClick={() => setSelectedAuthorEntry(entry.en)}
                    >
                      <span className="number">{entry.no}</span>
                      <span className="row-copy">
                        <strong>{entry.en}</strong>
                        <small>Page {entry.page}</small>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="empty-state">No entries match this search.</div>
                )}
              </div>

              <div className="author-list">
                <h2 className="author-panel-heading">Authors {selectedAuthorEntry ? `for ${selectedAuthorEntry}` : ""}</h2>
                <label className="mini-search author-search">
                  <Search size={14} />
                  <input value={authorQuery} onChange={(event) => setAuthorQuery(event.target.value)} placeholder="Search authors..." />
                </label>
                {visibleAuthors.length ? visibleAuthors.map((author) => (
                  <button
                    key={author.name}
                    type="button"
                    className={`author-item ${currentAuthor.name === author.name ? "active" : ""}`}
                    onClick={() => setSelectedAuthor(author.name)}
                  >
                    <strong>{author.name}</strong>
                    <span>{author.entries.join(" • ")}</span>
                  </button>
                )) : <div className="empty-state">No authors match this selection.</div>}
              </div>

              <div className="author-card">
                <h2 className="author-panel-heading">Author profile</h2>
                <div className="author-profile">
                  <img src={encodeURI(currentAuthor.photo)} alt={currentAuthor.name} />
                  <div>
                    <h3>{currentAuthor.name}</h3>
                    <p>{currentAuthor.bio}</p>
                  </div>
                </div>

                <div className="author-actions">
                  <a href={`mailto:${currentAuthor.email}`} className="author-link">
                    <Mail size={15} />
                    {currentAuthor.email}
                  </a>
                  <a href={currentAuthor.profileUrl} target="_blank" rel="noreferrer" className="author-link">
                    <Globe size={15} />
                    Profile
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
