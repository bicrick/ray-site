# Portfolio integration plan

Branch: `cursor/portfolio-pdf-extract-a856` (from live `vercel-preview-2026-10-20`).  
Sources: PDF extracts in `docs/portfolio-extract/` + inventory in `docs/portfolio-inventory.md`.

## Site map

### Before

```
/ (index.html) — single page
  #top        Hero + selected work wall
  #work       Curated grid (21 pieces, 5 form categories)
  #statement  Artist statement (older utilitarian wording)
  #studio     Instagram reels
  #kiln       Recent kiln posts
  #about      Bio + portrait
  #highlights CV
  #contact
Nav: Work · Statement · Studio · About · Contact
```

### After

```
/ (index.html) — curated homepage (unchanged role)
  #work       Curated grid + new pouring-vessel categories
  #statement  New 2026 artist statement (verbatim)
  …other sections unchanged
Nav: Work · Personal Work · Student Work · Statement · Studio · About · Contact

/personal-work  (personal-work.html) — full professional portfolio
  Shareable URL for search committees
  All 20 PDF pieces (duplicates reuse existing higher-res assets)

/student-work   (student-work.html) — teaching evidence gallery
  Shareable URL; captions without student names
  Grouped/filterable by course (Art 3400 / 3410 / 3420)
```

Vercel `cleanUrls` serves `/personal-work` and `/student-work` without `.html`.

## Decisions

### Personal Work (20 pieces)

| PDF | Title | Disposition | Image asset |
|-----|-------|-------------|-------------|
| p01 | Pitcher with Cups, 2026 | **New** + homepage curated | `personal-p01-pitcher-with-cups` |
| p02 | Side Handled Teapot, 2026 | **New** + homepage curated | `personal-p02-side-handled-teapot` |
| p03 | Side Handled Teapot, 2026 | **New** (Personal page only) | `personal-p03-side-handled-teapot` |
| p04 | Kettle, 2026 | **New** + homepage curated | `personal-p04-kettle` |
| p05 | Side Handled Teapot (marbled), 2026 | **New** (Personal page only) | `personal-p05-side-handled-teapot` |
| p06 | Ewer, 2025 | **New** + homepage curated | `personal-p06-ewer` |
| p07 | Ewer, 2025 | **New** (Personal page only) | `personal-p07-ewer` |
| p08 | Ewer, 2026 | **New** + homepage curated | `personal-p08-ewer` |
| p09 | Stemmed Cups, 2024 | **Duplicate** of `MargaritaInvitational2024-12` / `sxpf-gallery-2` — reuse best asset; upgrade homepage caption | `sxpf-gallery-2` (964px) on Personal page; keep `MargaritaInvitational2024-12` on homepage with upgraded title/note |
| p10 | Tumblers, 2024 | **Duplicate** of `sxpf-gallery-3` — reuse; Personal page only (homepage already has different Tumbler trio `RayBrownOct23-115`) | `sxpf-gallery-3` |
| p11 | Pitcher, 2025 | **New** (checked vs `sxpf-gallery-1`: different piece/crop) + homepage | `personal-p11-pitcher` |
| p12 | Pitcher, 2025 | **New** (Personal page only) | `personal-p12-pitcher` |
| p13 | Flower Brick, 2024 | **Duplicate** of `IMG_3323` — reuse; upgrade homepage title Flower bowl → Flower Brick + materials | `IMG_3323` |
| p14 | Basket, 2023 | **Duplicate** of `RayBrownOct23-62` — reuse; upgrade homepage caption | `RayBrownOct23-62` |
| p15 | Mugs, 2025 | **New** (Personal page only) | `personal-p15-mugs` |
| p16 | Mugs, 2025 | **New** (Personal page only) | `personal-p16-mugs` |
| p17 | XO Jar, 2025 | **New** + homepage curated (jars) | `personal-p17-xo-jar` |
| p18 | Cup, 2026 | **New** (Personal page only) | `personal-p18-cup` |
| p19 | Bowl, 2026 | **New** (Personal page only) | `personal-p19-bowl` |
| p20 | Cup, 2026 | **New** (Personal page only) | `personal-p20-cup` |

**Homepage curated additions** (site lacked pouring vessels): p01, p02, p04, p06, p08, p11, p17.  
**New `works.json` categories:** `teapots` (Teapots & kettles), `pitchers` (Pitchers), `ewers` (Ewers).

### Student Work (20 pieces)

All 20 go on `/student-work` only (not homepage). Captions keep course/project/materials/dimensions/term; **every student name removed** from captions, alt text, filenames, and JSON.

Typo fix: `Abstracted Dear` → `Abstracted Deer`.

**Filters / grouping by course:**

| Category id | Label | Pieces |
|-------------|-------|--------|
| art3400 | Art 3400 · Beginning | Couch Jar, Pedestal Bowl, Dog Themed Set, Sculptural Plate, Swordfish, Anatomical Arm Study, Hand Cup, Strawberry Lidded Mug, Acorn Cap Jars, Floral Kylix |
| art3410 | Art 3410 · Intermediate | Plates, Teapot, Stemmed Glasses, Tankards, Cyanotype Casserole |
| art3420 | Art 3420 · Handbuilding | Sheep, Majora's Mask, Abstracted Deer, Wolf Mask, Articulated Frog Doll |

Page 13 pairing confirmed: Hand Cup then Stemmed Glasses.

Glaze names kept (`Phil’s White`, `Tom Coleman Jet Black`) — materials, not students.

### Artist statement

Replace `#statement` body and `artist.json` `statement` with the 2026 PDF text verbatim. Keep the existing “inhaling” pull-quote (still present in the new statement).

### Images

- Generate responsive `.webp` at existing breakpoints (`480` / `800` / `1100`) **never larger than native**.
- Small student embeds (e.g. 345px): single rendition; CSS `object-fit: contain` so lightbox/grid don’t stretch soft pixels.
- `docs/` stays in `.vercelignore` (names never ship). Public content is name-free JSON under `assets/content/`.

### Visual / motion

Reuse existing tokens, work grid, filters, lightbox, reveal, header. Portfolio pages share chrome; full-width gallery (no clip-to-8). Inquire mailto on personal pieces; student page hides inquire or uses a teaching-context mailto.

## Content files

| File | Role |
|------|------|
| `assets/content/personal-work.json` | Full 20-piece personal catalogue |
| `assets/content/student-work.json` | 20-piece student catalogue (no names) |
| `assets/content/works.json` | Homepage curated + new categories + caption upgrades |
| `assets/content/images.json` | Registry for all new stems |
| `assets/content/artist.json` | Updated statement |

## JS / CSS

- Generalize `loadWorks(path)` in `data.js`.
- Add `js/portfolio-page.js` bootstrapping Personal/Student pages.
- Extend `work.js` slightly for optional inquire + native-small thumb class.
- `css/portfolio.css` for page hero band + small-image contain behavior.

## Menu

Homepage and portfolio pages:

`Work` · `Personal Work` · `Student Work` · `Statement` · `Studio` · `About` · `Contact`

Portfolio pages: brand → `/`; Work/Statement/etc. → `/#…`.
