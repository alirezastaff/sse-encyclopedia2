"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type FormState = {
  budget: number;
  volunteerHours: number;
  hourlyRate: number;
  beneficiaries: number;
  jobs: number;
  waste: number;
  changeRate: number;
  socialProxy: number;
  environmentalProxy: number;
  economicProxy: number;
  deadweight: number;
  attribution: number;
  displacement: number;
  dropoff: number;
};

const initialForm: FormState = {
  budget: 100000, volunteerHours: 1200, hourlyRate: 12, beneficiaries: 240, jobs: 18, waste: 800,
  changeRate: 65, socialProxy: 450, environmentalProxy: 30, economicProxy: 8500,
  deadweight: 15, attribution: 10, displacement: 5, dropoff: 8,
};

const persianInitialForm: FormState = {
  budget: 1000000000, volunteerHours: 1200, hourlyRate: 500000, beneficiaries: 240, jobs: 18, waste: 800,
  changeRate: 65, socialProxy: 2000000, environmentalProxy: 50000, economicProxy: 200000000,
  deadweight: 15, attribution: 10, displacement: 5, dropoff: 8,
};

function money(value: number, locale: "en" | "fa" = "en") {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 0 }).format(Math.max(0, value));
}

function localizeNumber(value: number, locale: "en" | "fa") {
  return locale === "fa" ? new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value) : String(value);
}

function parseNumber(value: string) {
  const normalized = value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/٬/g, "").replace(/,/g, "");
  return Number(normalized) || 0;
}

export default function ImpactCalculator({ locale = "en" }: { locale?: "en" | "fa" }) {
  const isPersian = locale === "fa";
  const steps = isPersian ? ["ورودی‌ها", "خروجی‌ها", "پیامدها", "تعدیلات"] : ["Inputs", "Outputs", "Outcomes", "Adjustments"];
  const copy = isPersian ? {
    brand: "اقتصاد اجتماعی / ابزارها",
    back: "بازگشت به دانشنامه",
    kicker: "پشتیبانی از تصمیم‌گیری برای سازمان‌های هدف‌محور",
    title: "ابزار ارزیابی اثر اجتماعی",
    intro: "برآوردی شفاف و اولیه از بازگشت سرمایه اجتماعی خود بسازید. با این راهنما فرض‌ها را روشن کنید، ابعاد مختلف را مقایسه کنید و گزارشی قابل اشتراک بگیرید.",
    designed: "طراحی‌شده برای اقتصاد اجتماعی و همبستگی",
    note: "گفت‌وگو را بر پیامدها، مردم، مکان و ارزش‌هایی متمرکز نگه دارید که حساب‌های متعارف اغلب نادیده می‌گیرند.",
    financialTitle: "ورودی‌های مالی",
    financialText: "با منابع اختصاص‌یافته به مداخله شروع کنید. مقادیر این ابزار غربالگری بر اساس ریال ایران نمایش داده می‌شوند.",
    outputTitle: "خروجی‌های مستقیم",
    outputText: "پیش از برآورد تغییرات بلندمدت، دامنه فوری فعالیت را توصیف کنید.",
    outcomeTitle: "پیامدها و نماگرهای مالی",
    outcomeText: "نمایگری را انتخاب کنید که ارزش هر پیامد را نشان دهد، سپس نرخ تغییر مثبت را برآورد کنید.",
    proxyTitle: "کتابخانه نماگرها",
    proxyText: "رفاه اجتماعی، اشتغال فراگیر و بازیابی چرخشی پسماند نمونه‌های ازپیش‌بارگذاری‌شده هستند. پیش از استفاده از نتیجه برای تصمیم‌های سرمایه‌گذاری، آن‌ها را با مقادیر معتبر محلی جایگزین کنید.",
    adjustmentTitle: "تعدیلات",
    adjustmentText: "این چهار پرسش با در نظر گرفتن اتفاقاتی که بدون مداخله رخ می‌دادند و اثرهای خارج از سازمان شما، از بزرگ‌نمایی جلوگیری می‌کنند.",
    netTitle: "ارزش خالص اجتماعی",
    netText: "هر پیامد در حاصل‌ضرب (۱ − وزن مرده) × (۱ − سهم دیگران) × (۱ − جابه‌جایی) × (۱ − افت تدریجی) ضرب می‌شود.",
    previous: "قبلی",
    review: "مرور نتیجه",
    continue: "ادامه",
    snapshot: "خلاصه ارزیابی",
    snapshotText: "بر اساس فرض‌هایی که تاکنون وارد شده‌اند.",
    ratio: "نسبت بازگشت سرمایه اجتماعی",
    download: "دانلود گزارش PDF",
    footer: "این یک برآورد غربالگری است، نه ارزش‌گذاری حسابرسی‌شده. منابع و فرض‌های خود را ثبت کنید.",
    cases: "مطالعات موردی موفق را ببینید",
    investment: "بودجه سالانه / سرمایه‌گذاری اولیه",
    investmentHelp: "وجه نقد مستقیمی که به برنامه اختصاص یافته است.",
    volunteer: "ساعت‌های داوطلبانه",
    volunteerHelp: "زمانی که افراد بدون دریافت دستمزد اختصاص داده‌اند.",
    hourly: "نرخ پایه ساعتی",
    hourlyHelp: "ارزش محافظه‌کارانه برای یک ساعت کار داوطلبانه.",
    beneficiaries: "ذی‌نفعان مستقیم",
    beneficiariesHelp: "افرادی که مستقیماً به آن‌ها دسترسی پیدا شده، آموزش داده شده یا حمایت شده‌اند.",
    jobs: "مشاغل پایدار ایجادشده",
    jobsHelp: "مشاغل ایجادشده برای گروه‌های کمتر برخوردار.",
    waste: "پسماند منحرف‌شده (کیلوگرم)",
    wasteHelp: "موادی که از طریق مداخله بازیابی شده‌اند.",
    change: "نرخ تغییر کیفی (درصد)",
    changeHelp: "برآورد سنجیده یا مستند شما از میزان تغییر.",
    socialProxy: "نمایگر اجتماعی به ازای هر ذی‌نفع (ریال)",
    socialProxyHelp: "برای نمونه، هزینه‌های سلامت یا رفاه که از آن‌ها جلوگیری شده است.",
    environmentalProxy: "نمایگر زیست‌محیطی به ازای هر کیلوگرم (ریال)",
    environmentalProxyHelp: "هزینه اجتناب‌شده جمع‌آوری به‌علاوه ارزش کربن ذخیره‌شده.",
    economicProxy: "نمایگر اقتصادی به ازای هر شغل (ریال)",
    economicProxyHelp: "ارزش برآوردشده عمومی و خانوار برای کار پایدار.",
    deadweight: "وزن مرده (درصد)", deadweightHelp: "تغییری که احتمالاً بدون مداخله شما رخ می‌داد.",
    attribution: "سهم دیگران (درصد)", attributionHelp: "موفقیتی که به سازمان‌های دیگر نسبت داده می‌شود.",
    displacement: "جابه‌جایی (درصد)", displacementHelp: "ارزش مثبتی که در جای دیگری زیان ایجاد می‌کند.",
    dropoff: "افت تدریجی (درصد)", dropoffHelp: "کاهش سالانه ارزش پیامد در طول زمان.",
    social: "اجتماعی", environmental: "زیست‌محیطی", economic: "اقتصادی",
  } : {
    brand: "SSE / TOOLS", back: "Back to encyclopedia", kicker: "Decision support for purpose-led organizations", title: "Social Impact Assessment Tool", intro: "Build a transparent first estimate of your social return on investment. Use the wizard to make assumptions visible, compare dimensions, and export a shareable report.", designed: "Designed for SSE", note: "Keep the conversation grounded in outcomes, people, place, and the value that conventional accounts often miss.", financialTitle: "Financial inputs", financialText: "Start with the resources committed to the intervention. Values are shown in USD for this screening tool.", outputTitle: "Direct outputs", outputText: "Describe the immediate reach of the work before estimating longer-term change.", outcomeTitle: "Outcomes & financial proxies", outcomeText: "Choose a proxy that represents the value of each outcome, then estimate the rate of positive change.", proxyTitle: "Proxy library", proxyText: "Social wellbeing, inclusive employment, and circular waste recovery are preloaded examples. Replace these with locally validated values before using a result for investment decisions.", adjustmentTitle: "Adjustments", adjustmentText: "These four questions reduce overclaiming by accounting for what would have happened anyway and for effects outside your organization.", netTitle: "Net Social Value", netText: "Each outcome is multiplied by (1 − deadweight) × (1 − attribution) × (1 − displacement) × (1 − drop-off).", previous: "Previous", review: "Review result", continue: "Continue", snapshot: "Assessment snapshot", snapshotText: "Based on the assumptions entered so far.", ratio: "SROI ratio", download: "Download PDF report", footer: "Screening estimate, not an audited valuation. Document your sources and assumptions.", cases: "See successful case studies", investment: "Annual budget / initial investment", investmentHelp: "Direct cash committed to the program.", volunteer: "Volunteer hours", volunteerHelp: "Unpaid time contributed by people.", hourly: "Base hourly rate", hourlyHelp: "A conservative value for one volunteer hour.", beneficiaries: "Direct beneficiaries", beneficiariesHelp: "People directly reached, trained, or supported.", jobs: "Sustainable jobs created", jobsHelp: "Jobs created for underserved groups.", waste: "Waste diverted (kg)", wasteHelp: "Material recovered through the intervention.", change: "Qualitative change rate (%)", changeHelp: "Your measured or evidenced estimate of change.", socialProxy: "Social proxy per beneficiary ($)", socialProxyHelp: "For example, avoided health or welfare costs.", environmentalProxy: "Environmental proxy per kg ($)", environmentalProxyHelp: "Collection cost avoided plus stored carbon value.", economicProxy: "Economic proxy per job ($)", economicProxyHelp: "Estimated public and household value of stable work.", deadweight: "Deadweight (%)", deadweightHelp: "Change likely without your intervention.", attribution: "Attribution (%)", attributionHelp: "Success attributable to other organizations.", displacement: "Displacement (%)", displacementHelp: "Positive value that creates harm elsewhere.", dropoff: "Drop-off (%)", dropoffHelp: "Annual reduction in outcome value over time.", social: "Social", environmental: "Environmental", economic: "Economic",
  };
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(isPersian ? persianInitialForm : initialForm);
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: parseNumber(value) }));

  const result = useMemo(() => {
    const investment = form.budget + form.volunteerHours * form.hourlyRate;
    const change = Math.max(0, Math.min(100, form.changeRate)) / 100;
    const adjustment = (1 - form.deadweight / 100) * (1 - form.attribution / 100) * (1 - form.displacement / 100) * (1 - form.dropoff / 100);
    const values = {
      social: form.beneficiaries * form.socialProxy * change * adjustment,
      environmental: form.waste * form.environmentalProxy * change * adjustment,
      economic: form.jobs * form.economicProxy * change * adjustment,
    };
    const total = values.social + values.environmental + values.economic;
    return { investment, values, total, ratio: investment > 0 ? total / investment : 0, adjustment };
  }, [form]);

  const exportPdf = () => {
    const document = new jsPDF();
    document.setFontSize(20);
    document.text(isPersian ? "Social Impact Assessment Report" : "Social Impact Assessment Report", 20, 24);
    document.setFontSize(11);
    document.text("SROI screening calculation", 20, 34);
    document.text(`SROI ratio: ${result.ratio.toFixed(2)} : 1`, 20, 50);
    const currency = isPersian ? "IRR" : "$";
    document.text(`Net social value: ${currency}${money(result.total, locale)}`, 20, 60);
    document.text(`Total investment: ${currency}${money(result.investment, locale)}`, 20, 70);
    document.text(`Social value: ${currency}${money(result.values.social, locale)}`, 20, 86);
    document.text(`Environmental value: ${currency}${money(result.values.environmental, locale)}`, 20, 96);
    document.text(`Economic value: ${currency}${money(result.values.economic, locale)}`, 20, 106);
    document.text("Adjustments applied: Deadweight, attribution, displacement, and drop-off.", 20, 124);
    document.save(isPersian ? "گزارش-ارزیابی-اثر-اجتماعی.pdf" : "social-impact-assessment.pdf");
  };

  return (
    <main className="impact-page" dir={isPersian ? "rtl" : "ltr"}>
      <style>{`
        .impact-page { --ink:#172329; --muted:#68787a; --paper:#fffefa; --line:#d6e2df; --green:#176b5b; --lime:#b9d946; --orange:#e77745; min-height:100vh; padding:30px clamp(16px,5vw,72px) 70px; color:var(--ink); background:linear-gradient(135deg,#eef6f2 0%,#fbf1e5 100%); font-family:"Vazirmatn",Tahoma,Arial,sans-serif; }
        .impact-shell{max-width:1220px;margin:0 auto}.impact-nav{display:flex;justify-content:space-between;gap:16px;margin-bottom:54px}.impact-nav a{color:var(--green);font-weight:800;text-decoration:none}.impact-kicker{color:var(--orange);font-size:12px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.impact-heading{display:grid;grid-template-columns:1.3fr .7fr;gap:35px;align-items:end;margin-bottom:34px}.impact-heading h1{max-width:760px;margin:10px 0 14px;font-size:clamp(40px,6vw,78px);line-height:.98;letter-spacing:-.06em}.impact-heading p{max-width:670px;margin:0;color:var(--muted);font-size:17px;line-height:1.8}.impact-note{padding:20px;border-top:5px solid var(--lime);background:rgba(255,254,250,.76);line-height:1.7}.impact-note strong{display:block;margin-bottom:6px;color:var(--green);font-size:24px}.impact-layout{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:18px;align-items:start}.impact-panel{border:1px solid var(--line);background:rgba(255,254,250,.88);box-shadow:0 18px 40px rgba(26,70,60,.08)}.impact-progress{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--line)}.impact-progress button{padding:14px 8px;border:0;border-bottom:3px solid transparent;color:var(--muted);background:transparent;cursor:pointer;font:inherit;font-size:12px}.impact-progress button.active{border-bottom-color:var(--orange);color:var(--green);font-weight:800}.impact-form{padding:28px}.impact-form h2{margin:0 0 8px;font-size:28px}.impact-form>p{margin:0 0 24px;color:var(--muted);line-height:1.7}.impact-fields{display:grid;grid-template-columns:1fr 1fr;gap:16px}.impact-field{display:grid;gap:7px}.impact-field.full{grid-column:1/-1}.impact-field label{font-weight:800;font-size:13px}.impact-field small{color:var(--muted);line-height:1.45}.impact-field input,.impact-field select{width:100%;min-height:46px;padding:0 12px;border:1px solid var(--line);background:#fff;color:var(--ink);font:inherit}.impact-field input:focus,.impact-field select:focus{outline:3px solid rgba(23,107,91,.16);border-color:var(--green)}.impact-actions{display:flex;justify-content:space-between;gap:12px;margin-top:28px}.impact-button{padding:11px 16px;border:1px solid var(--green);color:var(--green);background:#fff;cursor:pointer;font:inherit;font-weight:800}.impact-button.primary{color:#fff;background:var(--green)}.impact-result{padding:28px;background:var(--green);color:#fff}.impact-result h2{margin:0 0 6px;font-size:19px}.impact-result>p{margin:0;color:rgba(255,255,255,.76);font-size:13px;line-height:1.6}.impact-ratio{margin:24px 0;padding:18px 0;border-top:1px solid rgba(255,255,255,.2);border-bottom:1px solid rgba(255,255,255,.2)}.impact-ratio strong{display:block;color:var(--lime);font-size:56px;line-height:1}.impact-ratio span{font-size:13px}.impact-bars{display:grid;gap:16px}.impact-bar-row{display:grid;gap:6px}.impact-bar-label{display:flex;justify-content:space-between;font-size:13px}.impact-bar{height:9px;background:rgba(255,255,255,.17)}.impact-bar span{display:block;height:100%;background:var(--lime)}.impact-result .impact-button{width:100%;margin-top:26px;border-color:#fff;color:var(--green);background:#fff}.impact-formula{margin-top:18px;padding:18px;border-left:3px solid var(--orange);color:var(--muted);background:#fff}.impact-formula strong{display:block;margin-bottom:6px;color:var(--ink)}.impact-footer{display:flex;justify-content:space-between;gap:16px;margin-top:32px;padding-top:20px;border-top:1px solid var(--line);color:var(--muted);font-size:13px}.impact-footer a{color:var(--green);font-weight:800;text-decoration:none}@media(max-width:850px){.impact-heading,.impact-layout{grid-template-columns:1fr}.impact-result{order:-1}}@media(max-width:560px){.impact-page{padding:20px 14px 48px}.impact-fields{grid-template-columns:1fr}.impact-field.full{grid-column:auto}.impact-heading h1{font-size:52px}.impact-form{padding:20px}.impact-progress button{font-size:10px}.impact-footer{flex-direction:column}}
      `}</style>
      <div className="impact-shell">
        <nav className="impact-nav"><Link href={isPersian ? "/fa" : "/en"}>{copy.brand}</Link><Link href={isPersian ? "/fa" : "/en"}>{copy.back}</Link></nav>
        <header className="impact-heading"><div><div className="impact-kicker">{copy.kicker}</div><h1>{copy.title}</h1><p>{copy.intro}</p></div><div className="impact-note"><strong>{copy.designed}</strong><span>{copy.note}</span></div></header>
        <div className="impact-layout">
          <section className="impact-panel">
            <div className="impact-progress">{steps.map((label, index) => <button className={step === index ? "active" : ""} key={label} type="button" onClick={() => setStep(index)}>{localizeNumber(index + 1, locale)}. {label}</button>)}</div>
            <div className="impact-form">
              {step === 0 && <><h2>{copy.financialTitle}</h2><p>{copy.financialText}</p><div className="impact-fields"><Field locale={locale} label={copy.investment} help={copy.investmentHelp} value={form.budget} onChange={(value) => update("budget", value)} /><Field locale={locale} label={copy.volunteer} help={copy.volunteerHelp} value={form.volunteerHours} onChange={(value) => update("volunteerHours", value)} /><Field locale={locale} label={copy.hourly} help={copy.hourlyHelp} value={form.hourlyRate} onChange={(value) => update("hourlyRate", value)} /></div></>}
              {step === 1 && <><h2>{copy.outputTitle}</h2><p>{copy.outputText}</p><div className="impact-fields"><Field locale={locale} label={copy.beneficiaries} help={copy.beneficiariesHelp} value={form.beneficiaries} onChange={(value) => update("beneficiaries", value)} /><Field locale={locale} label={copy.jobs} help={copy.jobsHelp} value={form.jobs} onChange={(value) => update("jobs", value)} /><Field locale={locale} label={copy.waste} help={copy.wasteHelp} value={form.waste} onChange={(value) => update("waste", value)} /></div></>}
              {step === 2 && <><h2>{copy.outcomeTitle}</h2><p>{copy.outcomeText}</p><div className="impact-fields"><Field locale={locale} label={copy.change} help={copy.changeHelp} value={form.changeRate} onChange={(value) => update("changeRate", value)} /><Field locale={locale} label={copy.socialProxy} help={copy.socialProxyHelp} value={form.socialProxy} onChange={(value) => update("socialProxy", value)} /><Field locale={locale} label={copy.environmentalProxy} help={copy.environmentalProxyHelp} value={form.environmentalProxy} onChange={(value) => update("environmentalProxy", value)} /><Field locale={locale} label={copy.economicProxy} help={copy.economicProxyHelp} value={form.economicProxy} onChange={(value) => update("economicProxy", value)} /></div><div className="impact-formula"><strong>{copy.proxyTitle}</strong> {copy.proxyText}</div></>}
              {step === 3 && <><h2>{copy.adjustmentTitle}</h2><p>{copy.adjustmentText}</p><div className="impact-fields"><Field locale={locale} label={copy.deadweight} help={copy.deadweightHelp} value={form.deadweight} onChange={(value) => update("deadweight", value)} /><Field locale={locale} label={copy.attribution} help={copy.attributionHelp} value={form.attribution} onChange={(value) => update("attribution", value)} /><Field locale={locale} label={copy.displacement} help={copy.displacementHelp} value={form.displacement} onChange={(value) => update("displacement", value)} /><Field locale={locale} label={copy.dropoff} help={copy.dropoffHelp} value={form.dropoff} onChange={(value) => update("dropoff", value)} /></div><div className="impact-formula"><strong>{copy.netTitle}</strong> {copy.netText}</div></>}
              <div className="impact-actions"><button className="impact-button" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>{copy.previous}</button><button className="impact-button primary" type="button" onClick={() => setStep((current) => Math.min(3, current + 1))}>{step === 3 ? copy.review : copy.continue}</button></div>
            </div>
          </section>
          <aside className="impact-result" aria-live="polite"><h2>{copy.snapshot}</h2><p>{copy.snapshotText}</p><div className="impact-ratio"><strong>{localizeNumber(Number(result.ratio.toFixed(2)), locale)} : ۱</strong><span>{copy.ratio}</span></div><div className="impact-bars"><ImpactBar locale={locale} label={copy.social} value={result.values.social} total={result.total} /><ImpactBar locale={locale} label={copy.environmental} value={result.values.environmental} total={result.total} /><ImpactBar locale={locale} label={copy.economic} value={result.values.economic} total={result.total} /></div><button className="impact-button" type="button" onClick={exportPdf}>{copy.download}</button></aside>
        </div>
        <footer className="impact-footer"><span>{copy.footer}</span><Link href={isPersian ? "/fa/case-studies" : "/en/case-studies"}>{isPersian ? `${copy.cases} ←` : `${copy.cases} →`}</Link></footer>
      </div>
    </main>
  );
}

function Field({ locale, label, help, value, onChange }: { locale: "en" | "fa"; label: string; help: string; value: number; onChange: (value: string) => void }) {
  return <label className="impact-field"><span>{label}</span><small title={help}>ⓘ {help}</small><input type={locale === "fa" ? "text" : "number"} inputMode="numeric" min="0" value={locale === "fa" ? localizeNumber(value, locale) : value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ImpactBar({ locale, label, value, total }: { locale: "en" | "fa"; label: string; value: number; total: number }) {
  const width = total > 0 ? Math.max(3, (value / total) * 100) : 3;
  return <div className="impact-bar-row"><div className="impact-bar-label"><span>{label}</span><strong>{locale === "fa" ? "ریال" : "$"} {money(value, locale)}</strong></div><div className="impact-bar"><span style={{ width: `${width}%` }} /></div></div>;
}
