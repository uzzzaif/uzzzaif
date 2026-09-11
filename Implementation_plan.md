# Implementation Plan — Uzaif Portfolio Redesign
> Created: Session start | Last Updated: Task 0 complete

---

## Current Codebase Assessment

**Framework**: Vanilla HTML5 + CSS3 + JavaScript (no build tools, no npm, no framework)  
**Files**: `index.html`, `style.css`, `script.js`  
**Assets**: `Uzaif_Resume.pdf`, `assets/UB_dark_trans_SVG.svg`, `assets/UB_light_trans_SVG.svg`, 18 language images in each of `assets/light_languages/` and `assets/dark_languages/`  
**Dependencies**: Google Fonts (Syne, DM Sans, JetBrains Mono), Font Awesome 6.5.0 (CDN)  
**Deployment**: Vercel, static site  

---

## Existing Sections / Features Inventory

| Section | ID | Action |
|---|---|---|
| Navigation | `#navbar` | Keep + refine |
| Hero | `#hero` | Replace completely |
| About | `#about` | Redesign |
| Skills | `#skills` | Replace with hub-spoke (`#tech`) |
| Resume | `#resume` | Keep, minor polish |
| Projects | `#projects` | Redesign layout + interaction |
| Automation | `#automation` | REMOVE — replaced by UB Web Care |
| Experience/Journey | `#experience` | Redesign (cinematic timeline) |
| Contact | `#contact` | Keep + refine |
| Footer | `<footer>` | Minor update |

---

## Sections to Preserve (content + functionality)

- Dual theme system (localStorage, data-theme on html, CSS variables)
- Mobile hamburger nav logic + animation
- Scroll progress bar
- Active nav link highlighting  
- `.reveal` IntersectionObserver system (extended)
- Email CTA with subject selector
- All social links and contact info (email, WhatsApp, GitHub, LinkedIn, Instagram)
- Resume PDF link (`Uzaif_Resume.pdf`)
- Google Fonts stack (Syne + DM Sans + JetBrains Mono)
- Font Awesome 6.5.0
- All 5 project entries (content preserved; 3 featured, 2 secondary)
- All journey/timeline entries (4 items unchanged)

---

## Sections to Redesign

- Hero: full replacement with 18-language scroll sequence + identity overlay
- About: 3 scroll-driven capability panels
- Skills → Tech: hub-and-spoke ecosystem (new section ID `#tech`)
- Projects: 3-column featured + architecture viz + secondary row
- Journey: cinematic scroll-responsive timeline
- Contact: headline update + UB Web Care secondary CTA

---

## Sections / Features to Remove

- `#automation` section (BE MY AI button block)
- `.automation-box` CSS
- Orbital avatar visual (CSS-only "AI" circle with 3 orbits) — replaced by hero image sequence
- Existing canvas particle background — replaced by 3-layer system
- Skills grid/pill-card layout — replaced by hub-spoke

---

## New Features to Implement

| Feature | Section | Notes |
|---|---|---|
| 3-layer animated background | Global | Grid + atmosphere + micro-elements |
| UB logo floating ambient | Global | SVG asset, theme-aware |
| 18-language hero sequence | `#hero` | Scroll-controlled, 18 images per theme |
| Hero identity overlay | `#hero` | Fades in after sequence completes |
| About capability panels | `#about` | 3 scroll-driven panels |
| What I Build flow | `#what-i-build` | Systems visualization |
| Tech hub-and-spoke | `#tech` | 6 hubs, radial spoke expansion |
| Projects architecture viz | `#projects` | Per-project flow diagrams |
| UB Web Care section | `#ubwebcare` | Replaces automation |
| Currently Exploring | `#experience` | Appended to journey section |
| Contact UB secondary CTA | `#contact` | Below main contact box |

---

## Asset Requirements

| Asset | Path | Status |
|---|---|---|
| Light language images (18) | `assets/light_languages/01_English.png` … `18_Indonesian.png` | ✅ Present |
| Dark language images (18) | `assets/dark_languages/01_English.png` … `18_Indonesian.png` | ✅ Present |
| UB logo (dark theme) | `assets/UB_dark_trans_SVG.svg` | ✅ Present |
| UB logo (light theme) | `assets/UB_light_trans_SVG.svg` | ✅ Present |
| Resume PDF | `Uzaif_Resume.pdf` | ✅ Present |

---

## Language Sequence File Mapping

```
01_English.png    → English    "Hello"
02_Hindi.png      → Hindi
03_Spanish.png    → Spanish
04_Arabic.png     → Arabic
05_Kannada.png    → Kannada
06_Japanese.png   → Japanese
07_Telugu.png     → Telugu
08_Punjabi.png    → Punjabi
09_Tamil.png      → Tamil
10_German.png     → German
11_Chinese.png    → Chinese
12_French.png     → French
13_Korean.png     → Korean
14_Italian.png    → Italian
15_Portuguese.png → Portuguese
16_Russian.png    → Russian
17_Turkish.png    → Turkish
18_Indonesian.png → Indonesian
```

---

## Animation Architecture

### Background System
- **Layer 1 — Technical Grid**: Canvas-drawn perspective grid. Offset driven by lerped `scrollY`. Scroll down = grid moves up.
- **Layer 2 — Atmospheric Light**: 3 fixed `<div>` blobs with CSS animations + JS scroll offset via `--scroll-offset` CSS variable.
- **Layer 3 — Micro-elements**: 25 small geometric shapes (triangles, circles, squares, rings) drawn on same canvas. Depth coefficients create parallax layers.
- **UB Logo**: Fixed `<img>`, low opacity, slow CSS float, theme-swapped by JS.

### Hero Sequence
- Driver wrapper `~4×100vh` tall creates scroll space.
- `progress = scrollY / driverHeight` maps 0→1 across 18 frames.
- `frameIndex = Math.floor(progress * 18)` — which image to show.
- At `progress >= 0.85`: fade in identity overlay.
- Frame 0 preloaded via `<link rel="preload">` in `<head>`. Frames 1–5 preloaded on init. Frames 6–17 loaded 3 ahead on demand.

### Section Reveal
- Extends existing `.reveal` with `.reveal-left`, `.reveal-right` variants.
- `data-delay` attribute for stagger (0–5 × 0.1s).
- Single IntersectionObserver handles all variants.

### Hub-and-Spoke
- Spoke positions: `x = cos(angle) * radius`, `y = sin(angle) * radius`.
- Open: spokes animate from hub center to radial positions.
- SVG lines "draw" using `stroke-dashoffset` animation.
- Mobile: vertical layout, tap to toggle, one hub at a time.

---

## Responsive / Mobile Strategy

- Hero: `object-fit: contain`, `clamp()` typography, scroll sequence maintained.
- Background: reduced canvas density on mobile (15 micro-elements, smaller grid).
- Tech hubs: stack vertically on mobile, tap toggle instead of hover.
- Projects: 1-column on mobile, tap expand instead of hover.
- About panels: stack vertically.
- What I Build: single-column centered.
- Breakpoints: 768px, 480px, 375px.

---

## Accessibility Strategy

- Semantic HTML5 sections with appropriate `aria-label`.
- Hub buttons: `role="button"`, `aria-expanded`, `aria-controls`.
- Project expanded areas: `aria-hidden` toggled on expand/collapse.
- Hero language: `aria-live="polite"` on language text.
- Skip-to-content link at top of body.
- All interactive elements keyboard-accessible.
- `:focus-visible` rings using `--accent` color.

---

## Reduced-Motion Strategy

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable hero scroll sequence — show frame 0 + identity immediately */
  /* Disable canvas animation loop — static frame only */
  /* Disable all CSS keyframe animations */
  /* Disable reveal transitions — show content immediately */
  /* Disable parallax movement */
}
```

JS check: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — skip RAF, show identity immediately.

---

## Performance Strategy

- `<link rel="preload">` for hero frame 0 (theme-aware, set by JS).
- Progressive hero frame loading (3 frames ahead queue).
- `cancelAnimationFrame` on `document.hidden`.
- Throttled resize handler for canvas.
- `will-change: transform` only on actively animating elements.
- IntersectionObserver cleanup after all elements revealed.
- CSS variables as single source of truth — no hex in JS.
- `transform` + `opacity` only for animations (GPU compositing).

---

## Implementation Order

| # | Task | Status |
|---|---|---|
| 0 | Create Implementation_plan.md | ✅ Done |
| 1 | CSS variables + theme foundation | ✅ Done — style.css fully rewritten |
| 2 | Global background system | ✅ Done — 3-layer canvas + atm blobs + UB logo in CSS + JS |
| 3 | Navbar refinement | ✅ Done — active class, compact scroll state, mobile menu |
| 4+5 | Hero language sequence + identity overlay | ✅ Done — sticky driver, 18-frame scroll sequence, identity overlay |
| 6 | About redesign | ✅ Done — 3 panels: PS/TB/AF, stats strip, radial nodes, chip stream |
| 7 | What I Build section | ✅ Done — 7-node flow with animated spine |
| 8 | Tech hub-and-spoke | ✅ Done — 6 hubs, JS radial spoke rendering, SVG connectors |
| 9 | Projects redesign | ✅ Done — 3-col featured + arch viz + secondary row |
| 10 | Remove automation + UB Web Care | ✅ Done — automation removed, UB Web Care section with 7 services |
| 11 | Journey + Currently Exploring | ✅ Done — cinematic timeline spine + exploring chips |
| 12 | Contact refinement + footer | ✅ Done — updated headline, UB secondary CTA, footer links |
| 13 | Mobile optimization | ✅ Done — 768px + 480px breakpoints in CSS, mobile JS logic for hubs/projects |
| 14 | Reduced motion + accessibility | ✅ Done — prefers-reduced-motion block, aria labels, focus-visible, keyboard nav |
| 15 | Performance + final regression | ✅ Done — progressive preload, RAF cancel on hidden, throttled resize, IntersectionObserver cleanup |

**Last Updated**: All 15 tasks complete.

---

## Verification Checklist (Final)

- [x] Both themes render correctly — CSS variables cover light + dark
- [x] All existing links work — GitHub, LinkedIn, WhatsApp, Instagram, email, Resume PDF, UB Web Care preserved verbatim
- [x] Hero language sequence cycles all 18 images — scroll driver + frame index mapping
- [x] Hero identity overlay appears after sequence — at 85% progress
- [x] 3-layer background visible and scroll-reactive — canvas grid + micro + CSS blobs + UB logo
- [x] Mobile nav opens/closes — hamburger + aria-expanded preserved
- [x] Email CTA subject selector works — preserved exactly
- [x] Scroll progress bar works — preserved
- [x] Active nav highlighting works — CSS class approach (replaces inline style)
- [x] All 5 projects visible — 3 featured + 2 secondary
- [x] Journey/timeline content intact — all 4 entries preserved
- [x] Currently Exploring chips visible — 7 chips in now-exploring block
- [x] UB Web Care section renders with correct services — 7 services from ubwebcare.vercel.app
- [x] Hub-spoke opens/closes on hover and tap — JS toggleHub / openHub / closeHub
- [x] No horizontal scroll — overflow-x: hidden on body
- [x] prefers-reduced-motion disables animations — CSS + JS checks
- [x] Keyboard navigation — tabindex, aria-expanded, keydown handlers on all interactive elements

## Files Modified
- `style.css` — Complete rewrite
- `index.html` — Complete rewrite
- `script.js` — Complete rewrite
- `Implementation_plan.md` — Created + updated throughout
