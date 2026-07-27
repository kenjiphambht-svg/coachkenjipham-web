# TYPOGRAPHY COMPOSITION — APPROVED IMPLEMENTATION SNAPSHOT

Route: `/lang-90`
Production URL: https://www.coachkenjipham.com/lang-90
Production commit: `04650e7d344100822160820aa798c771e48bbf1c`
Captured: 2026-07-26

This is an implementation snapshot of the approved Lặng page. It is not the final
typography design system for the whole website.

## 1. Font family, weights, and true italic

- `font-serif`: **Cormorant Garamond** (`Georgia`, `serif` fallback).
  Google Fonts loads Roman 300/400/500/600 and true italic 400/500.
- `font-sans`: **Inter** (`system-ui`, `sans-serif` fallback).
  Google Fonts loads 300/400/500.
- Lặng sets `font-synthesis: none`; italic is the loaded Cormorant Garamond
  italic face, not browser-synthesized slant.

## 2. Six typography functions

| Function | Font and weight | Mobile → desktop size | Leading / width |
| --- | --- | --- | --- |
| Hero Display | Cormorant Roman 500, then true italic 400 | 31/24/34px → 62/48/68px | 1.12/1.20/1.08; max 820px |
| Signal Composition | Cormorant Roman 500, true italic 400, Roman 500 | 30/44/36px → 48/68/56px | 1.18/1.04/1.13; max 760/820px |
| Section Heading | Cormorant Roman 500 | 30px → 42px | 1.25 |
| Reading Body | Inter 400 | 18px → 20px | 1.72 → 1.75; max 680px |
| Accent Voice | Cormorant true italic 400 | 22px → 27px | 1.55 → 1.50 |
| Utility | Inter 500 | 11–13px | labels 0.14em; CTA/microcopy 0.08em |

Tablet interpolates Hero at 50/38/56px, Signal at 40/60/46px, Section Heading
at 40px, Body at 19px, and Accent Voice at 27px.

## 3. Intentional mixed typography

- Hero: Roman first statement → smaller Roman transition → true italic final
  line.
- Signal Moment: Roman premise → largest true italic turn → Roman resolution,
  with only `thật sự` returned to true italic.
- Scope: Roman heading with true italic only on `vào sai cánh cửa.`
- Definition: `nghe kỹ,` true italic → `hỏi thẳng,` Roman medium → explanatory
  sentence in Inter.
- Next Step and Closing use Accent Voice as a deliberate change of voice.

## 4. Intentionally stable typography

- Standard section headings, Journey step titles, Offer heading, FAQ questions,
  long reading body, labels, CTA, metadata, and microcopy do not introduce
  decorative mixed styles.

## 5. Semantic component and helper map

- `Lang90HeroComposition`
- `Lang90SignalComposition` (production uses left alignment)
- `Lang90SectionHeading`
- `Lang90ScopeHeading`
- `Lang90AccentVoice`
- `Lang90DefinitionAccentVoice`
- `bodyClass`, `sectionLabelClass`, `darkSectionLabelClass`, `utilityClass`

## 6. Production visual evidence

Desktop and mobile browser QA was captured directly from the production URL on
2026-07-26. The checks covered Hero, Recognition, SB-01 placement, Signal,
Definition, Kenji, Journey, Scope, Offer, Next Step, FAQ, and Closing. The
production capture is intentionally not committed as a binary asset; the route
it documents is the live URL above.
