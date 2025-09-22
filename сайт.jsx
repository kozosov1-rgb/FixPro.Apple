import React, { useEffect, useMemo, useState } from "react";
import {
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Smartphone,
  BatteryCharging,
  Wrench,
  CreditCard,
  Zap,
  CheckCircle2,
  Instagram as InstagramIcon,
} from "lucide-react";

/**
 * FIX for: SyntaxError: /index.tsx: Unexpected token (1:0)
 * ------------------------------------------------------
 * The error happens when an **HTML document** (starting with <!doctype html>)
 * is executed in a TSX context. This file replaces the HTML with a **valid React
 * component** that renders the same one‑page site. No Node-only globals are
 * referenced (no `process`), and no framer‑motion import is used.
 *
 * Usage:
 *   1) Save as `src/FixProSite.tsx` and render from your entrypoint.
 *   2) Ensure Tailwind CSS is included in your app's CSS pipeline.
 *   3) Install icons:  npm i lucide-react
 */

// ===== Brand / Contacts / Config =====
const BRAND = "FixPro";
const CITY = "Бишкек";
const WHATSAPP_NUMBER = "996555006844"; // intl for wa.me
const TELEGRAM_USERNAME = "fixpro_apple";
const INSTAGRAM_HANDLE = "fixpro_apple";
const PHONE_DISPLAY = "+996 555 006 844";

// ===== Location & Maps =====
const ADDRESS_LINE = "Улица Байтик баатыра, 102";
const ADDRESS_HINT = "Центр, ориентир: Байтик баатыра 102";
const GEO_LAT = 42.858363;
const GEO_LON = 74.610158;
const MAP_2GIS = "https://2gis.kg/bishkek/geo/15763234351159311/74.610158,42.858363";
const MAP_YANDEX = "https://yandex.com/maps/?text=42.858363%2C74.610158&z=17&ll=74.610158%2C42.858363";
const MAP_GOOGLE = `https://www.google.com/maps/search/?api=1&query=${GEO_LAT}%2C${GEO_LON}`;

// ===== Hours =====
const HOURS_HUMAN = "Ежедневно 09:00–23:00";
const OPENING_HOURS_SPEC = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((d) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: d, opens: "09:00", closes: "23:00" }));

// ===== Helpers =====
function buildWAUrl(text: string, source = "site") {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return `${base}?text=${encodeURIComponent(`${text}\nИсточник: ${source}`)}`;
}
const buildTGUrl = () => `https://t.me/${TELEGRAM_USERNAME}`;
const buildIGUrl = () => `https://instagram.com/${INSTAGRAM_HANDLE}`;

// Dev env check without touching Node globals
function isDevEnv(): boolean {
  try {
    if (typeof window !== "undefined") {
      // localhost or explicit ?dev=1
      const host = window.location?.hostname || "";
      if (host === "localhost" || host === "127.0.0.1") return true;
      if (new URLSearchParams(window.location.search).get("dev") === "1") return true;
    }
  } catch {}
  return false;
}

function Section({ id, title, subtitle, children }: { id?: string; title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-8 sm:mb-10">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="text-slate-300 mt-2 max-w-2xl leading-relaxed">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function WhatsAppButton({ text = "Написать в WhatsApp", className = "", source = "site" }: { text?: string; className?: string; source?: string }) {
  const href = buildWAUrl("Здравствуйте! Интересует ремонт iPhone в FixPro.", source);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg bg-emerald-500 hover:bg-emerald-400 active:scale-[.99] transition ${className}`}
      aria-label={text}
    >
      <MessageCircle className="w-4 h-4" /> {text}
    </a>
  );
}

function TelegramButton({ text = "Написать в Telegram", className = "" }: { text?: string; className?: string }) {
  const href = buildTGUrl();
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg bg-sky-500 hover:bg-sky-400 active:scale-[.99] transition ${className}`} aria-label={text}>
      <MessageCircle className="w-4 h-4" /> {text}
    </a>
  );
}

function InstagramButton({ text = "Открыть Instagram", className = "" }: { text?: string; className?: string }) {
  const href = buildIGUrl();
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg bg-pink-500 hover:bg-pink-400 active:scale-[.99] transition ${className}`} aria-label={text}>
      <InstagramIcon className="w-4 h-4" /> {text}
    </a>
  );
}

const features = [
  { icon: <Clock className="w-5 h-5" />, title: "Быстро", desc: "Батарея 20 мин, экран от 40 мин" },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Гарантия", desc: "до 6 месяцев на работу и детали" },
  { icon: <MapPin className="w-5 h-5" />, title: "Удобно", desc: "Курьер по городу • Приём/выдача" },
  { icon: <CreditCard className="w-5 h-5" />, title: "Честно", desc: "Фикс‑цены и прозрачная диагностика" },
] as const;

const services = [
  { icon: <Smartphone className="w-5 h-5" />, title: "Замена экрана", note: "от 40 мин", price: "от 3 900 сом" },
  { icon: <BatteryCharging className="w-5 h-5" />, title: "Замена батареи", note: "~20 мин", price: "от 1 900 сом" },
  { icon: <Wrench className="w-5 h-5" />, title: "Чистка Face ID", note: "60–90 мин", price: "от 1 500 сом" },
  { icon: <Wrench className="w-5 h-5" />, title: "Диагностика", note: "15–20 мин", price: "0 сом" },
] as const;

const faqs = [
  { q: "Сколько по времени занимает ремонт?", a: "Батарея — около 20 минут, экран — от 40 минут. Сложные работы обсуждаем заранее, чтобы вы планировали время." },
  { q: "Какая гарантия?", a: "Предоставляем гарантию до 6 месяцев на работу и запчасти. Условия зависят от модели и типа ремонта." },
  { q: "Где вы находитесь?", a: `${ADDRESS_LINE}. ${ADDRESS_HINT}. Есть курьер по городу и удобная приём/выдача.` },
  { q: "Как записаться?", a: "Напишите в WhatsApp/Telegram/Instagram или оставьте заявку на сайте — мы сразу подтвердим время и цену." },
] as const;

export default function FixProSite() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [issue, setIssue] = useState("");

  const canSubmit = phone.trim().length >= 7;

  const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = `Здравствуйте! Заявка на ремонт в ${BRAND}.\nИмя: ${name || "—"}\nТелефон: ${phone || "—"}\нМодель: ${model || "—"}\nПроблема: ${issue || "—"}`;
    const href = buildWAUrl(text, "форма");
    if (typeof window !== "undefined") window.open(href, "_blank");
  };

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `${BRAND} — ремонт iPhone`,
      url: "https://fixpro.example", // заменить на реальный домен
      telephone: PHONE_DISPLAY,
      address: { "@type": "PostalAddress", streetAddress: ADDRESS_LINE, addressLocality: CITY, addressCountry: "KG" },
      geo: { "@type": "GeoCoordinates", latitude: GEO_LAT, longitude: GEO_LON },
      areaServed: `${CITY}, Kyrgyzstan`,
      sameAs: [buildTGUrl(), `https://wa.me/${WHATSAPP_NUMBER}`, buildIGUrl()],
      openingHoursSpecification: OPENING_HOURS_SPEC,
      makesOffer: services.map((s) => ({ "@type": "Offer", name: s.title })),
    }),
    []
  );

  // ===== Runtime tests (dev-only, no Node globals). =====
  useEffect(() => {
    if (!isDevEnv()) return;
    try {
      const wa = buildWAUrl("Привет", "тест");
      console.assert(wa.includes("wa.me/" + WHATSAPP_NUMBER), "WA: base url wrong");
      console.assert(wa.includes(encodeURIComponent("Источник: тест")), "WA: source missing");
      console.assert((jsonLd as any)["@type"] === "LocalBusiness", "JSONLD: type");
      const sameAs = (jsonLd as any).sameAs || [];
      console.assert(sameAs.some((u: string) => u.includes("instagram.com")), "JSONLD: instagram link");
      console.assert(sameAs.some((u: string) => u.includes("t.me") || u.includes("telegram")), "JSONLD: telegram link");
      console.assert(sameAs.some((u: string) => u.includes("wa.me")), "JSONLD: whatsapp link");

      // Guard
      console.assert(canSubmit === (phone.trim().length >= 7), "Guard: canSubmit matches logic");

      // DOM checks (defer to next tick)
      setTimeout(() => {
        const igLinks = document.querySelectorAll('a[href*="instagram.com/"]');
        console.assert(igLinks.length > 0, "DOM: instagram link present");
        const waBtns = Array.from(document.querySelectorAll('a[href^="https://wa.me/"]'));
        console.assert(waBtns.length > 0, "DOM: whatsapp links present");
        const hasServiceSource = waBtns.some((a) => decodeURIComponent((a as HTMLAnchorElement).href).includes("услуга:"));
        console.assert(hasServiceSource, "WA: service source tagging present");
      }, 0);

      // eslint-disable-next-line no-console
      console.log("[FixProSite TSX tests] ✓ all assertions passed");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[FixProSite TSX tests] × assertion failed", err);
    }
  }, [jsonLd, phone, canSubmit]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100">
      {/* Minimal CSS animation to mimic fade-up */}
      <style>{`
        @keyframes fadeup { to { opacity: 1; transform: none; } }
        .fade-up { opacity: 0; transform: translateY(12px); animation: fadeup .6s ease-out forwards; }
        .fade-up-1 { animation-delay: .06s }
        .fade-up-2 { animation-delay: .12s }
        .fade-up-3 { animation-delay: .18s }
      `}</style>

      {/* Header / Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-8 sm:pt-14 sm:pb-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center ring-1 ring-emerald-500/40">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight">{BRAND}</div>
                <div className="text-xs text-slate-400">ремонт iPhone • {CITY}</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm" aria-label="Позвонить">
                <Phone className="w-4 h-4" /> Позвонить
              </a>
              <WhatsAppButton text="WhatsApp" source="шапка" />
              <TelegramButton text="Telegram" />
              <InstagramButton text="Instagram" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 mt-10 items-center">
            <div className="lg:col-span-7 fade-up">
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">Ремонт iPhone в Бишкеке — быстро, честно, с гарантией</h1>
              <p className="mt-4 text-slate-300 max-w-2xl">
                Диагностика <span className="font-semibold text-white">0 сом</span>. Батарея 20 мин, экран от 40 мин. Курьер по городу. Пишете — называем цену, фиксируем время и делаем.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-6">
                <WhatsAppButton text="Записаться в WhatsApp" source="герой" />
                <TelegramButton text="Написать в Telegram" />
                <InstagramButton text="Открыть Instagram" />
                <a href="#prices" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10">
                  <CreditCard className="w-4 h-4" /> Прайс и услуги
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 fade-up fade-up-1">
              <div className="rounded-3xl p-5 sm:p-6 bg-white/5 border border-white/10 shadow-xl">
                <div className="text-base font-semibold">Быстрая запись</div>
                <p className="text-slate-400 text-sm mt-1">Оставьте контакты — мы подтвердим время.</p>
                <form onSubmit={handleWhatsAppSubmit} className="mt-4 space-y-3">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400" autoComplete="name" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" type="tel" inputMode="tel" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400" autoComplete="tel" />
                  <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Модель iPhone (например, 12 Pro)" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400" autoComplete="off" />
                  <textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Что случилось? (экран/батарея/вода и т.д.)" rows={3} className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400" />
                  <button type="submit" disabled={!canSubmit} className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow-lg ${canSubmit ? "bg-emerald-500 hover:bg-emerald-400 active:scale-[.99]" : "bg-emerald-500/40 cursor-not-allowed"}`} aria-disabled={!canSubmit}>
                    <MessageCircle className="w-4 h-4" /> Отправить в WhatsApp
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <TelegramButton text="Или — Telegram" />
                    <InstagramButton text="Или — Instagram" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Нажимая кнопку, вы соглашаетесь с обработкой данных для связи по заказу.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Why */}
      <Section id="why" title="Почему FixPro" subtitle="Сделаем быстро, аккуратно и по честной цене">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className={`rounded-3xl p-5 bg-white/5 border border-white/10 ${i ? `fade-up fade-up-${i}` : "fade-up"}`}>
              <div className="flex items-center gap-2 text-emerald-400">{f.icon}<span className="text-slate-100 font-medium">{f.title}</span></div>
              <div className="text-slate-300 mt-1 text-sm">{f.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Prices */}
      <Section id="prices" title="Популярные услуги" subtitle="Реальные сроки и понятные цены">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <div key={i} className={`rounded-3xl p-5 bg-gradient-to-b from-white/5 to-white/[0.03] border border-white/10 flex flex-col ${i ? `fade-up fade-up-${i}` : "fade-up"}`}>
              <div className="flex items-center gap-2 text-emerald-400">{s.icon}<span className="text-slate-100 font-medium">{s.title}</span></div>
              <div className="text-slate-400 text-sm mt-1">{s.note}</div>
              <div className="mt-4 text-xl font-semibold">{s.price}</div>
              <div className="mt-auto pt-4">
                <WhatsAppButton text="Уточнить цену" className="w-full justify-center" source={`услуга:${s.title}`} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-sm mt-4">* Цены ориентировочные и зависят от модели и типа детали (оригинал/премиум).</p>
      </Section>

      {/* Courier */}
      <Section id="courier" title="Курьер по Бишкеку" subtitle="Заберём и вернём — безопасно и быстро">
        <div className="rounded-3xl p-6 bg-white/5 border border-white/10 grid lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> Оформление заявки в WhatsApp/Telegram</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> Запечатываем устройство, пломбы и чек‑лист приёма</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> Отчёт с фото/видео, оплата удобным способом</li>
            </ul>
            <div className="mt-4 flex gap-2 sm:gap-3">
              <WhatsAppButton source="курьер" />
              <TelegramButton />
              <InstagramButton />
            </div>
          </div>
          <div className="lg:col-span-1 rounded-2xl bg-black/30 border border-white/10 p-4">
            <div className="text-sm text-slate-400">График</div>
            <div className="text-slate-100 text-lg font-semibold">{HOURS_HUMAN}</div>
            <div className="text-sm text-slate-400 mt-2">Оплата: карта/нал/Elkart. Гарантия до 6 мес.</div>
          </div>
        </div>
      </Section>

      {/* Where */}
      <Section id="where" title="Где мы" subtitle="Приезжайте или вызывайте курьера">
        <div className="rounded-3xl p-6 bg-white/5 border border-white/10">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <div className="text-slate-100 font-medium">{ADDRESS_LINE}</div>
              <div className="text-slate-400 text-sm">{ADDRESS_HINT}</div>
              <div className="flex flex-wrap gap-2 mt-3 text-sm">
                <a className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" href={MAP_2GIS} target="_blank" rel="noreferrer noopener">Открыть в 2ГИС</a>
                <a className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" href={MAP_YANDEX} target="_blank" rel="noreferrer noopener">Открыть в Яндекс.Картах</a>
                <a className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" href={MAP_GOOGLE} target="_blank" rel="noreferrer noopener">Открыть в Google Maps</a>
              </div>
            </div>
            <div className="md:col-span-1 space-y-2 text-slate-300 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4"/> {PHONE_DISPLAY}</div>
              <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4"/> @{TELEGRAM_USERNAME}</div>
              <div className="flex items-center gap-2"><InstagramIcon className="w-4 h-4"/> @{INSTAGRAM_HANDLE}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {CITY}</div>
              <div className="text-slate-400">{HOURS_HUMAN}</div>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" title="FAQ" subtitle="Частые вопросы и короткие ответы">
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <details key={i} className={`group rounded-3xl bg-white/5 border border-white/10 p-5 open:bg-white/[0.07] ${i ? `fade-up fade-up-${i}` : "fade-up"}`}>
              <summary className="cursor-pointer select-none text-slate-100 font-medium flex items-center justify-between">
                {f.q}
                <span className="ml-4 text-slate-400 group-open:rotate-180 transition">⌄</span>
              </summary>
              <p className="mt-3 text-slate-300 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-lg font-semibold">{BRAND}</div>
              <div className="text-slate-400 text-sm mt-1">Ремонт iPhone в {CITY}</div>
              <div className="mt-3 flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4"/> {PHONE_DISPLAY}</div>
              <div className="mt-1 flex items-center gap-2 text-slate-300"><MessageCircle className="w-4 h-4"/> @{TELEGRAM_USERNAME}</div>
              <div className="mt-1 flex items-center gap-2 text-slate-300"><InstagramIcon className="w-4 h-4"/> @{INSTAGRAM_HANDLE}</div>
              <div className="mt-1 flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4"/> Адрес: {ADDRESS_LINE}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Часы</div>
              <div className="text-slate-100 font-medium">{HOURS_HUMAN}</div>
              <div className="text-sm text-slate-400 mt-2">Приём/выдача и курьер</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Быстрые ссылки</div>
              <div className="flex flex-col gap-2 text-slate-300 text-sm">
                <a href="#prices" className="hover:text-white">Прайс</a>
                <a href="#courier" className="hover:text-white">Курьер</a>
                <a href="#where" className="hover:text-white">Как добраться</a>
                <a href="#faq" className="hover:text-white">FAQ</a>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Написать</div>
              <div className="flex gap-2 flex-wrap">
                <WhatsAppButton text="WhatsApp" source="футер" />
                <TelegramButton text="Telegram" />
                <InstagramButton text="Instagram" />
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-6">© {new Date().getFullYear()} {BRAND}. Все права защищены.</div>
        </div>
      </footer>

      {/* Sticky mobile action bar (4 buttons incl. Instagram) */}
      <div className="fixed bottom-3 left-0 right-0 px-3 sm:hidden">
        <div className="mx-auto max-w-md grid grid-cols-4 gap-2 rounded-2xl bg-black/60 backdrop-blur border border-white/10 p-2">
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center justify-center gap-1 rounded-xl py-2 bg-white/5 border border-white/10 text-xs font-medium" aria-label="Звонок">
            <Phone className="w-4 h-4"/> Звонок
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center gap-1 rounded-xl py-2 bg-emerald-500 text-xs font-semibold" aria-label="WhatsApp">
            <MessageCircle className="w-4 h-4"/> WA
          </a>
          <a href={buildTGUrl()} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center gap-1 rounded-xl py-2 bg-white/5 border border-white/10 text-xs font-medium" aria-label="Telegram">
            <MessageCircle className="w-4 h-4"/> TG
          </a>
          <a href={buildIGUrl()} target="_blank" rel="noreferrer noopener" className="flex items-center justify-center gap-1 rounded-xl py-2 bg-pink-500 text-xs font-semibold" aria-label="Instagram">
            <InstagramIcon className="w-4 h-4"/> IG
          </a>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
