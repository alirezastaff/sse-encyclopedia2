export type HomepageLocale = "fa" | "en";

type HomepageLink = { label: string; href: string; enabled: boolean };
type HomepageInfoItem = { number: string; text: string; enabled: boolean };
type HomepageFeature = { icon: string; title: string; text: string; href: string; enabled: boolean };

export type HomepageContent = {
  brandTitle: string;
  brandSubtitle: string;
  nav: HomepageLink[];
  eyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroActions: HomepageLink[];
  searchTitle: string;
  searchPlaceholder: string;
  quickLinks: HomepageLink[];
  sourceLabel: string;
  sourceText: string;
  infoItems: HomepageInfoItem[];
  introTitle: string;
  introText: string;
  teamLabel: string;
  teamText: string;
  introLinks: HomepageLink[];
  goalsTitle: string;
  goals: string[];
  features: HomepageFeature[];
  footerCopyright: string;
  footerLinks: HomepageLink[];
};

const fa: HomepageContent = {
  brandTitle: "دانشنامه اقتصاد اجتماعی و همبستگی",
  brandSubtitle: "ترجمه فارسی مدخل‌های دانشنامه اقتصاد اجتماعی و همبستگی",
  nav: [
    { label: "مدخل‌ها", href: "/fa/archive", enabled: true },
    { label: "درباره پروژه", href: "#project", enabled: true },
    { label: "همکاری با ما", href: "#collaborate", enabled: true },
  ],
  eyebrow: "پروژه ترجمه و انتشار دانشنامه",
  heroTitle: "دسترسی فارسی به مفاهیم کلیدی",
  heroTitleAccent: "اقتصاد اجتماعی و همبستگی",
  heroDescription: "این وب‌سایت ترجمه فارسی مدخل‌های «دانشنامه اقتصاد اجتماعی و همبستگی» را در اختیار پژوهشگران، دانشجویان و علاقه‌مندان قرار می‌دهد. این پروژه توسط گروهی از مترجمان و محققان اقتصاد اجتماعی در ایران انجام می‌شود.",
  heroActions: [
    { label: "مشاهده فهرست مدخل‌ها", href: "/fa/archive", enabled: true },
    { label: "وضعیت اقتصاد اجتماعی کشورها", href: "/fa/country-explorer", enabled: true },
    { label: "مطالعات موردی", href: "/fa/case-studies", enabled: true },
    { label: "محاسبه اثرگذاری", href: "/fa/impact-calculator", enabled: true },
    { label: "بایگانی", href: "/fa/archive", enabled: true },
    { label: "حاشیه نگار", href: "/fa/profile", enabled: true },
  ],
  searchTitle: "جستجو در دانشنامه",
  searchPlaceholder: "نام مدخل یا کلیدواژه را وارد کنید",
  quickLinks: [
    { label: "مدخل‌ها", href: "/fa/archive", enabled: true },
    { label: "فهرست الفبایی", href: "/fa/archive", enabled: true },
    { label: "بایگانی", href: "/fa/archive", enabled: true },
    { label: "مدخل تصادفی", href: "/fa/archive", enabled: true },
  ],
  sourceLabel: "منبع اصلی:",
  sourceText: "دانشنامه تدوین‌شده توسط کارگروه اقتصاد اجتماعی و همبستگی سازمان ملل متحد.",
  infoItems: [
    { number: "۰۱", text: "ترجمه و انتشار مدخل‌های تخصصی اقتصاد اجتماعی و همبستگی به زبان فارسی.", enabled: true },
    { number: "۰۲", text: "فعالیت علمی با همکاری گروهی از مترجمان و محققان اقتصاد اجتماعی در ایران.", enabled: true },
    { number: "۰۳", text: "فراهم‌کردن دسترسی آسان برای دانشجویان، پژوهشگران و علاقه‌مندان این حوزه.", enabled: true },
  ],
  introTitle: "درباره پروژه ترجمه فارسی",
  introText: "این وب‌سایت ترجمه فارسی مدخل‌های «دانشنامه اقتصاد اجتماعی و همبستگی» را منتشر می‌کند. ما گروهی از مترجمان و محققان اقتصاد اجتماعی در ایران هستیم که مدخل‌های این دانشنامه را که توسط کارگروه اقتصاد اجتماعی و همبستگی سازمان ملل متحد تدوین شده است، به فارسی ترجمه، بازبینی و در اختیار مخاطبان فارسی‌زبان قرار می‌دهیم.",
  teamLabel: "گروه مترجمان و محققان:",
  teamText: "پژوهشگران اقتصاد اجتماعی در ایران",
  introLinks: [
    { label: "اعضای گروه", href: "#team", enabled: true },
    { label: "روش ترجمه و انتشار", href: "#process", enabled: true },
  ],
  goalsTitle: "اهداف و فعالیت‌های این پروژه",
  goals: [
    "ترجمه و انتشار فارسی مدخل‌های دانشنامه اقتصاد اجتماعی و همبستگی برای استفاده پژوهشگران، دانشجویان و علاقه‌مندان.",
    "گسترش ادبیات علمی اقتصاد اجتماعی و همبستگی در ایران از طریق ترجمه، ویرایش و بازنشر محتوای معتبر.",
    "فعالیت علمی و پژوهشی با تکیه بر همکاری مترجمان و محققان حوزه اقتصاد اجتماعی و همبستگی.",
  ],
  features: [
    { icon: "📘", title: "درباره دانشنامه", text: "این دانشنامه مجموعه‌ای از مدخل‌های تخصصی در حوزه اقتصاد اجتماعی و همبستگی است که توسط کارگروه اقتصاد اجتماعی و همبستگی سازمان ملل متحد تدوین شده است.", href: "#encyclopedia", enabled: true },
    { icon: "✍️", title: "پروژه ترجمه فارسی", text: "در این پروژه، مدخل‌های منتخب دانشنامه با دقت علمی ترجمه، بازبینی و برای دسترسی مخاطبان فارسی‌زبان منتشر می‌شوند.", href: "#project", enabled: true },
    { icon: "🧠", title: "پنل مطالعه پژوهشی", text: "نشانک‌ها، یادداشت‌ها و پیشرفت مطالعه خود را ذخیره کنید و هر زمان به ادامه پژوهش بازگردید.", href: "/fa/profile", enabled: true },
  ],
  footerCopyright: "© ۱۴۰۵ دانشنامه اقتصاد اجتماعی و همبستگی",
  footerLinks: [
    { label: "تماس با ما", href: "#contact", enabled: true },
    { label: "همکاری علمی", href: "#collaborate", enabled: true },
    { label: "سیاست انتشار", href: "#policy", enabled: true },
  ],
};

const en: HomepageContent = {
  brandTitle: "Social and Solidarity Economy Encyclopedia",
  brandSubtitle: "English translation and publication of encyclopedia entries",
  nav: [
    { label: "Entries", href: "/en/archive", enabled: true },
    { label: "About", href: "#project", enabled: true },
    { label: "Collaborate", href: "#collaborate", enabled: true },
  ],
  eyebrow: "Translation and publication project",
  heroTitle: "Accessible English entry points to the key concepts of",
  heroTitleAccent: "social and solidarity economy",
  heroDescription: "This website makes the English translations of the encyclopedia entries available to researchers, students, and interested readers. The project is carried out by a group of translators and researchers in the field.",
  heroActions: [
    { label: "Browse entries", href: "/en/archive", enabled: true },
    { label: "Country Explorer", href: "/en/country-explorer", enabled: true },
    { label: "Case Studies Hub", href: "/en/case-studies", enabled: true },
    { label: "Impact Calculator", href: "/en/impact-calculator", enabled: true },
    { label: "Archive", href: "/en/archive", enabled: true },
  ],
  searchTitle: "Search the encyclopedia",
  searchPlaceholder: "Search by keyword or title",
  quickLinks: [
    { label: "Entries", href: "/en/archive", enabled: true },
    { label: "Alphabetical list", href: "/en/archive", enabled: true },
    { label: "Archive", href: "/en/archive", enabled: true },
    { label: "Random entry", href: "/en/archive", enabled: true },
  ],
  sourceLabel: "Primary source:",
  sourceText: "Encyclopedia developed by the UN Social and Solidarity Economy working group.",
  infoItems: [
    { number: "01", text: "Publishing specialized entries in English for the social and solidarity economy.", enabled: true },
    { number: "02", text: "Scientific collaboration among translators and researchers in this field.", enabled: true },
    { number: "03", text: "Providing accessible knowledge for students, researchers, and the public.", enabled: true },
  ],
  introTitle: "About the English translation project",
  introText: "This website publishes English translations of the encyclopedia entries on the social and solidarity economy. A group of researchers and translators work to review and share these materials with English-speaking audiences.",
  teamLabel: "Translation team:",
  teamText: "researchers in the social and solidarity economy",
  introLinks: [
    { label: "Team members", href: "#team", enabled: true },
    { label: "Translation process", href: "#process", enabled: true },
  ],
  goalsTitle: "Goals and activities",
  goals: [
    "Translate and publish encyclopedia entries for researchers, students, and interested readers.",
    "Expand the body of literature in the field through careful translation and review.",
    "Support collaborative research and academic publication in social and solidarity economy.",
  ],
  features: [
    { icon: "📘", title: "About the encyclopedia", text: "A professional reference work covering essential concepts, theories, and practices in the social and solidarity economy.", href: "#encyclopedia", enabled: true },
    { icon: "✍️", title: "English translation project", text: "Select entries are translated carefully and made available for English-speaking audiences.", href: "#project", enabled: true },
    { icon: "🧠", title: "Research workspace", text: "Save bookmarks, notes, and highlights, track reading progress, and return to your research dashboard anytime.", href: "/en/profile", enabled: true },
  ],
  footerCopyright: "© 2026 Social and Solidarity Economy Encyclopedia",
  footerLinks: [
    { label: "Contact", href: "#contact", enabled: true },
    { label: "Scientific collaboration", href: "#collaborate", enabled: true },
    { label: "Publication policy", href: "#policy", enabled: true },
  ],
};

export function getDefaultHomepageContent(locale: HomepageLocale) {
  return locale === "fa" ? fa : en;
}

export async function getHomepageContent(locale: HomepageLocale): Promise<HomepageContent> {
  const fallback = getDefaultHomepageContent(locale);
  const configuredBase = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!configuredBase) return fallback;
  const base = configuredBase.replace(/\/$/, "");
  try {
    const response = await fetch(`${base}/wp-json/sse/v1/homepage?locale=${locale}`, { next: { revalidate: 60 } });
    if (!response.ok) return fallback;
    return { ...fallback, ...(await response.json()) } as HomepageContent;
  } catch {
    return fallback;
  }
}
