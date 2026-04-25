# Better Food Toronto — Thesis Narrative Component Handoff

> This documents the current state of the thesis scroll-narrative at `ThesisNarrative.tsx`.
> Part of the `03-Website` project within Sam's `06-Vision` Career Operating System.

---

## What This Is

A single React component (`ThesisNarrative.tsx`) that presents Sam's 55-slide M.Arch thesis as an interactive scroll-based narrative. The thesis was presented live at Daniels Faculty (Café 059, March 2023) with 3 videos and a physical food cart demonstration.

---

## Assets (all in `public/thesis/`)

| Asset | Path Pattern | Count/Size |
|-------|-------------|------------|
| Slides | `slides/THESIS_20230330_Final_v18_Page_XX.jpg` | 55 (01–55) |
| Photos | `photos/presentation-XX.jpg` | 11 (01–11) |
| Video 1 | `videos/terminal-scan.mp4` | compressed export, about 40MB |
| Video 2 | `videos/interviews-teaser.mp4` | compressed export, about 5MB |
| Video 3 | `videos/tomato-soup.mp4` | compressed export, about 75MB |
| Cover | `cover.jpg` | — |
| Hero drawing | `hero-drawing.jpg` | 131MB |
| U of T logo | `uoft-logo.webp` | — |

---

## Narrative Structure (Slide → Chapter Map)

| Chapter | Title | Slides | Videos | Key Moments |
|---------|-------|--------|--------|-------------|
| Hero | — | 1 | — | Cover image, title |
| 1 | The Tomato Story | 2–16 | — | Hero drawing (full-width scroll), 5-stage large-scale + 5-stage medium/small-scale reveal |
| 2 | The Terminal Story | 17–34 | Video 1 (with slide 30) | History, investigation, undercover infiltration, digital reconstruction, rejected proposal (amber card) |
| 3 | The Tomato Soup Story | 35–38 | Video 3 (with slide 35) | Receipts, direct/indirect network diagrams |
| 4 | People's Story | 39–49 | Video 2 (with slide 40) | 9 interview diagrams, physical drawing unfold at slide 40 |
| 5 | Time to Intervene | 50–55 | — | 4 interventions, Naza cart = climax (emerald glow + "Built" badge) |
| Finale | Live Demonstration | — | — | 11-photo gallery, credits |

---

## Design Rules

1. **One-column for all detailed drawings** — never compress into multi-column grids
2. **Chapter title slides get their own row** — not paired with content slides
3. **Video placement matches live presentation order exactly** — Video 1 with slide 30 (narration describes video), Video 2 with slide 40, Video 3 with slide 35
4. **Physical moments annotated** as italic parenthetical notes (drawing unfold at slide 40, cart unveil at slide 55)
5. **Naza food cart (slide 55)** gets emerald glow border + "Built" badge — it's the climax
6. **Slides 6–15 shown individually** — each represents a specific supply chain stage with its own annotation

---

## Narration Source of Truth

- `narration-pages/page_XX.jpg` in `06-Vision/` root — annotated slides with red-box outlines showing what Sam said at each point
- `narration-pages/thumbs/` — thumbnails for safe reference
- `THESIS_20230330_Final_with narration.pdf` — the full annotated PDF

---

## Current Status (Updated 2026-04-14)

### Done
- All 55 slides mapped and sequenced per annotated source of truth
- Chapter 1 corrected: "The Tomato Story" (not "The Catalog")
- Chapter 4 corrected: "People's Story" (singular, not "People's Stories")
- Slides 17–18 moved from Ch 1 to Ch 2 (slide 17 is the Ch 2 title card)
- Video 1 placement corrected: now plays with slide 30 (narration describes video content)
- All 3 videos at correct narrative points
- All narration text rewritten to match annotated red-box notes exactly
- Individual supply-chain stage slides (6–15) shown one at a time with their annotations
- Interview names corrected (Hooman → Sanotti, Kwabena → Tea Operation, Roza → no business name)
- 11 presentation photos in gallery with captions
- Branko→Naza narrative bridge included
- Rejected proposal in amber warning card
- TypeScript build verified (✅ zero errors)

### Verified
- `npm run build` — passes with zero errors (2026-04-14)

### Not Yet Verified
- Dev server visual check (`npm run dev`)
- Mobile responsiveness  
- Image/video loading performance
- Navigation from main portfolio page
