"use client";

import { CSSProperties, useEffect, useState } from "react";
import {
  Be_Vietnam_Pro,
  Cormorant_Garamond,
  Inter,
  Newsreader,
  Source_Serif_4,
} from "next/font/google";

import { typeLabContent } from "./typeLabContent";

const cormorant = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const sourceSerif = Source_Serif_4({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

type PairKey = "pair-0" | "pair-a" | "pair-b" | "pair-c" | "pair-d";
type Scene = "dark" | "light";
type Frame = "375" | "768" | "1440" | "auto";
type FontStatus = "loading" | "loaded" | "fallback";

type FontFace = {
  key: string;
  label: string;
  family: string;
};

const fontCatalog: FontFace[] = [
  { key: "cormorant", label: "Cormorant Garamond", family: cormorant.style.fontFamily },
  { key: "inter", label: "Inter", family: inter.style.fontFamily },
  { key: "newsreader", label: "Newsreader", family: newsreader.style.fontFamily },
  { key: "source-serif", label: "Source Serif 4", family: sourceSerif.style.fontFamily },
  { key: "be-vietnam", label: "Be Vietnam Pro", family: beVietnam.style.fontFamily },
];

const pairs = {
  "pair-0": {
    id: "Pair 0",
    name: "Cormorant Garamond + Inter",
    status: null,
    display: cormorant.style.fontFamily,
    anchor: cormorant.style.fontFamily,
    body: inter.style.fontFamily,
    whisper: cormorant.style.fontFamily,
    ui: inter.style.fontFamily,
  },
  "pair-a": {
    id: "Pair A",
    name: "Newsreader + Inter",
    status: null,
    display: newsreader.style.fontFamily,
    anchor: newsreader.style.fontFamily,
    body: inter.style.fontFamily,
    whisper: newsreader.style.fontFamily,
    ui: inter.style.fontFamily,
  },
  "pair-b": {
    id: "Pair B",
    name: "Source Serif 4 + Inter",
    status: null,
    display: sourceSerif.style.fontFamily,
    anchor: sourceSerif.style.fontFamily,
    body: inter.style.fontFamily,
    whisper: sourceSerif.style.fontFamily,
    ui: inter.style.fontFamily,
  },
  "pair-c": {
    id: "Pair C",
    name: "Newsreader + Be Vietnam Pro",
    status: null,
    display: newsreader.style.fontFamily,
    anchor: newsreader.style.fontFamily,
    body: beVietnam.style.fontFamily,
    whisper: newsreader.style.fontFamily,
    ui: beVietnam.style.fontFamily,
  },
  "pair-d": {
    id: "Pair D",
    name: "Cormorant Garamond + Newsreader",
    status: "Final candidate",
    display: cormorant.style.fontFamily,
    anchor: newsreader.style.fontFamily,
    body: newsreader.style.fontFamily,
    whisper: cormorant.style.fontFamily,
    ui: newsreader.style.fontFamily,
  },
} as const;

const frameOptions: { id: Frame; label: string }[] = [
  { id: "375", label: "375px" },
  { id: "768", label: "768px" },
  { id: "1440", label: "1440px" },
  { id: "auto", label: "Auto" },
];

const controlClass =
  "rounded-full border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

function getScale(width: number) {
  if (width <= 480) {
    return { hero: 43, heroLine: 1.08, signal: 36, signalLine: 1.14, signalEmphasis: 48, anchor: 30, anchorLine: 1.2, body: 17, bodyLine: 1.8, whisper: 22, whisperLine: 1.45 };
  }

  if (width <= 1024) {
    return { hero: 58, heroLine: 1.06, signal: 52, signalLine: 1.1, signalEmphasis: 70, anchor: 38, anchorLine: 1.18, body: 18, bodyLine: 1.85, whisper: 26, whisperLine: 1.45 };
  }

  return { hero: 76, heroLine: 1.04, signal: 68, signalLine: 1.08, signalEmphasis: 92, anchor: 46, anchorLine: 1.16, body: 18, bodyLine: 1.9, whisper: 30, whisperLine: 1.42 };
}

function fontCheck(font: FontFace) {
  return {
    roman: document.fonts.check(`400 1em ${font.family}`),
    italic: document.fonts.check(`italic 400 1em ${font.family}`),
  };
}

export default function TypeLab() {
  const [pairKey, setPairKey] = useState<PairKey>("pair-0");
  const [scene, setScene] = useState<Scene>("dark");
  const [frame, setFrame] = useState<Frame>("auto");
  const [anchorItalic, setAnchorItalic] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [fontStatuses, setFontStatuses] = useState<Record<string, FontStatus>>(
    () => Object.fromEntries(fontCatalog.map((font) => [font.key, "loading"])),
  );

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);

    const confirmFonts = async () => {
      try {
        await Promise.all(
          fontCatalog.flatMap((font) => [
            document.fonts.load(`400 1em ${font.family}`),
            document.fonts.load(`italic 400 1em ${font.family}`),
          ]),
        );
        await document.fonts.ready;

        setFontStatuses(
          Object.fromEntries(
            fontCatalog.map((font) => {
              const check = fontCheck(font);
              return [font.key, check.roman && check.italic ? "loaded" : "fallback"];
            }),
          ),
        );
      } catch {
        setFontStatuses(Object.fromEntries(fontCatalog.map((font) => [font.key, "fallback"])));
      }
    };

    void confirmFonts();
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const pair = pairs[pairKey];
  const frameWidth = frame === "auto" ? "100%" : `${frame}px`;
  const effectiveWidth = frame === "auto" ? viewportWidth : Number(frame);
  const scale = getScale(effectiveWidth);
  const displayStyle: CSSProperties = { fontFamily: pair.display, fontSynthesis: "none" };
  const anchorStyle: CSSProperties = { fontFamily: pair.anchor, fontSynthesis: "none" };
  const bodyStyle: CSSProperties = { fontFamily: pair.body, fontSynthesis: "none" };
  const whisperStyle: CSSProperties = { fontFamily: pair.whisper, fontSynthesis: "none" };
  const uiStyle: CSSProperties = { fontFamily: pair.ui, fontSynthesis: "none" };
  const visibleFonts = pairKey === "pair-d"
    ? fontCatalog.filter((font) => font.key === "cormorant" || font.key === "newsreader")
    : fontCatalog;
  const bodyComparisons = pairKey === "pair-d"
    ? [
      { size: 17, lineHeight: 1.8, label: "17px / 1.80" },
      { size: 18, lineHeight: 1.85, label: "18px / 1.85" },
    ]
    : [
      { size: 17, lineHeight: 1.75, label: "17px / 1.75" },
      { size: 17, lineHeight: 1.9, label: "17px / 1.90" },
      { size: 18, lineHeight: 1.75, label: "18px / 1.75" },
      { size: 18, lineHeight: 1.9, label: "18px / 1.90" },
    ];
  const dark = scene === "dark";
  const palette = dark
    ? { background: "var(--essence-black-2026)", text: "var(--essence-text-primary-dark-2026)", muted: "var(--essence-text-secondary-dark-2026)", border: "var(--essence-border-dark-2026)", surface: "#222220" }
    : { background: "var(--essence-ivory-2026)", text: "var(--essence-text-primary-2026)", muted: "var(--essence-text-secondary-2026)", border: "var(--essence-border-light-2026)", surface: "var(--essence-white-2026)" };

  return (
    <main className="min-h-screen pb-16 pt-36" style={{ background: palette.background, color: palette.text, fontSynthesis: "none" }}>
      <header className="fixed inset-x-0 top-0 z-20 border-b px-4 py-4 backdrop-blur-none sm:px-6" style={{ background: palette.background, borderColor: palette.border }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em]" style={uiStyle}>LẶNG — TYPOGRAPHY LAB</p>
            <p className="mt-1 text-sm" style={{ ...uiStyle, color: palette.muted }}>{pair.name}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2" aria-label="Điều khiển Typography Lab">
            <div className="flex rounded-full border p-1" style={{ borderColor: palette.border }} aria-label="Chọn pair font">
              {(Object.keys(pairs) as PairKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={pairKey === key} onClick={() => setPairKey(key)} className={controlClass} style={{ background: pairKey === key ? palette.text : "transparent", borderColor: "transparent", color: pairKey === key ? palette.background : palette.text }}>
                  {pairs[key].id}
                </button>
              ))}
            </div>
            <button type="button" aria-pressed={dark} onClick={() => setScene(dark ? "light" : "dark")} className={controlClass} style={{ borderColor: palette.border, color: palette.text }}>
              {dark ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-label="Thiết lập xem trước">
        <div className="mb-8 flex flex-col gap-5 border-b pb-6 lg:flex-row lg:items-end lg:justify-between" style={{ borderColor: palette.border }}>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>Pair đang xem</p>
            <h1 className="mt-2 text-2xl" style={displayStyle}>{pair.name}</h1>
            {pair.status ? <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>{pair.status}</p> : null}
          </div>
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>Frame width</p>
            <div className="flex flex-wrap gap-2" aria-label="Chọn độ rộng khung">
              {frameOptions.map((option) => (
                <button key={option.id} type="button" aria-pressed={frame === option.id} onClick={() => setFrame(option.id)} className={controlClass} style={{ borderColor: frame === option.id ? palette.text : palette.border, background: frame === option.id ? palette.text : "transparent", color: frame === option.id ? palette.background : palette.text }}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-live="polite">
          {visibleFonts.map((font) => {
            const status = fontStatuses[font.key];
            const verified = status === "loaded";
            return (
              <div key={font.key} className="border px-3 py-3" style={{ borderColor: verified ? palette.border : "#B34436", background: palette.surface }}>
                <p className="text-sm" style={{ fontFamily: font.family, fontSynthesis: "none" }}>{font.label}</p>
                <p className="mt-1 text-[11px] font-medium" style={{ ...uiStyle, color: verified ? "#4B7A5A" : "#B34436" }}>
                  {status === "loading" ? "Đang kiểm tra font…" : verified ? "Đã tải font thật" : "Đang dùng fallback — không được duyệt"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="overflow-x-auto px-4 pb-8 sm:px-6">
        <div data-testid="type-lab-frame" className="mx-auto border" style={{ width: frameWidth, minWidth: frame === "auto" ? 0 : Number(frame), maxWidth: frame === "auto" ? "1440px" : "none", borderColor: palette.border }}>
          <div className="px-5 py-12 sm:px-10 md:px-16 lg:px-24" style={{ background: palette.background }}>
            {dark ? (
              <section className="min-h-[580px] py-12 sm:py-20" aria-labelledby="hero-heading">
                <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>D1 · Hero · Roman + Italic thật</p>
                <h2 id="hero-heading" className="font-normal" style={{ ...displayStyle, fontSize: scale.hero, lineHeight: scale.heroLine, letterSpacing: "-0.035em" }}>
                  <span className="block">{typeLabContent.hero[0]}</span>
                  <span className="block">{typeLabContent.hero[1]}</span>
                  <em className="block font-normal">{typeLabContent.hero[2]}</em>
                </h2>
              </section>
            ) : (
              <div className="space-y-20 py-8 sm:space-y-28">
                <section aria-labelledby="signal-heading">
                  <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>D1 · Signal Moment · Italic thật</p>
                  <h2 id="signal-heading" className="font-normal" style={{ ...displayStyle, fontSize: scale.signal, lineHeight: scale.signalLine, letterSpacing: "-0.03em" }}>
                    <span className="block">{typeLabContent.signal.opening[0]}</span>
                    <span className="block">{typeLabContent.signal.opening[1]}</span>
                    <em className="mt-[0.8em] block font-normal" style={{ fontSize: scale.signalEmphasis, lineHeight: 0.98 }}>{typeLabContent.signal.emphasis}</em>
                    <span className="mt-[0.8em] block">{typeLabContent.signal.closing[0]}</span>
                    <span className="block">{typeLabContent.signal.closing[1]}</span>
                  </h2>
                </section>

                <section aria-labelledby="anchor-heading">
                  <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>A1 · Section Anchor</p>
                    <button type="button" aria-pressed={anchorItalic} onClick={() => setAnchorItalic((value) => !value)} className={controlClass} style={{ borderColor: palette.border, color: palette.text }}>Nhấn Italic: {anchorItalic ? "Bật" : "Tắt"}</button>
                  </div>
                  <h2 id="anchor-heading" className="font-normal" style={{ ...anchorStyle, fontSize: scale.anchor, lineHeight: scale.anchorLine, letterSpacing: "-0.02em" }}>
                    <span className="block">{typeLabContent.anchor[0]}</span>
                    <span className="block">{typeLabContent.anchor[1]}</span>
                    <span className="block">vào {anchorItalic ? <em className="font-normal">sai cánh cửa.</em> : "sai cánh cửa."}</span>
                  </h2>
                </section>

                <section aria-labelledby="body-heading">
                  <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>B1 · Body · {pairKey === "pair-d" ? "17px / 1.80 và 18px / 1.85" : "So sánh 17/18px và line-height 1.75/1.90"}</p>
                  <h2 id="body-heading" className="sr-only">So sánh body text</h2>
                  <div className="grid gap-5 lg:grid-cols-2">
                    {bodyComparisons.map(({ size, lineHeight, label }) => (
                      <article key={label} className="border p-5 sm:p-6" style={{ borderColor: palette.border, background: palette.surface }}>
                        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.14em]" style={{ ...uiStyle, color: palette.muted }}>{label}</p>
                        <div className="max-w-[680px] space-y-5" style={{ ...bodyStyle, fontSize: size, lineHeight }}>
                          {typeLabContent.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section aria-labelledby="whisper-heading">
                  <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>W1 · Whisper</p>
                  <h2 id="whisper-heading" className="max-w-[22ch] font-normal" style={{ ...whisperStyle, fontSize: scale.whisper, lineHeight: scale.whisperLine }}>
                    <span className="block">{typeLabContent.whisper[0]}</span>
                    <span className="mt-[0.75em] block">{typeLabContent.whisper[1]}</span>
                    <span className="mt-[0.75em] block">{typeLabContent.whisper[2]}</span>
                    <em className="block font-normal">{typeLabContent.whisper[3]}</em>
                  </h2>
                </section>

                <section className="border p-6 sm:p-8" style={{ borderColor: palette.border, background: palette.surface }} aria-labelledby="ui-heading">
                  <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>U1 · Label / Metadata / CTA</p>
                  <h2 id="ui-heading" className="text-xs font-medium tracking-[0.15em]" style={uiStyle}>{typeLabContent.ui.label}</h2>
                  <p className="mt-5 text-sm leading-6" style={{ ...uiStyle, color: palette.muted }}>{typeLabContent.ui.metadata}</p>
                  <button type="button" className="mt-7 border px-5 py-3 text-xs font-medium tracking-[0.14em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ ...uiStyle, borderColor: palette.text, color: palette.text }}>
                    {typeLabContent.ui.cta}
                  </button>
                  <p className="mt-4 text-xs leading-5" style={{ ...uiStyle, color: palette.muted }}>{typeLabContent.ui.note}</p>
                </section>
              </div>
            )}

            <section className="border-t py-12 sm:py-16" style={{ borderColor: palette.border }} aria-labelledby="stress-heading">
              <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.16em]" style={{ ...uiStyle, color: palette.muted }}>Vietnamese stress test · Roman + Italic</p>
              <h2 id="stress-heading" className="sr-only">Kiểm tra dấu tiếng Việt</h2>
              <div className="space-y-6">
                {visibleFonts.map((font) => (
                  <div key={font.key} className="border p-4 sm:p-5" style={{ borderColor: palette.border, background: palette.surface }}>
                    <p className="mb-3 text-xs font-medium" style={uiStyle}>{font.label}</p>
                    <p className="break-words text-xl leading-8 sm:text-2xl" style={{ fontFamily: font.family, fontSynthesis: "none" }}>{typeLabContent.stress}</p>
                    <p className="mt-2 break-words text-xl leading-8 sm:text-2xl" style={{ fontFamily: font.family, fontSynthesis: "none", fontStyle: "italic" }}><em className="font-normal">{typeLabContent.stress}</em></p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid gap-x-8 gap-y-2 border p-5 text-xl leading-8 sm:grid-cols-2" style={{ ...displayStyle, borderColor: palette.border, background: palette.surface }}>
                {typeLabContent.characters.map((row) => <p key={row}>{row}</p>)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
