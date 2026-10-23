# Portfolio PDF Extraction Inventory

Extracted from Ray Brown's uploaded PDFs using `pdfimages -all` (native embedded JPEGs, not page rasters). No site pages, menu changes, or web-optimized assets were created in this branch.

**Source files (uploads):**
- `RayBrown Professional Portfolio 2026.pdf` (20 pages, Word → PDF)
- `Student Portfolio.pdf` (19 pages, Word → PDF)
- `Artist Statement RBrown 2026.pdf` (1 page, text only — no artwork images; full text saved under `docs/portfolio-extract/text/artist-statement.txt`)

**Extracted assets:** `docs/portfolio-extract/personal/`, `docs/portfolio-extract/student/`, machine-readable `docs/portfolio-extract/inventory.json`, per-page text under `docs/portfolio-extract/text/`.

---

## Summary

| Portfolio | Pages | Embedded images | Pieces (image+caption pairs) |
|---|---:|---:|---:|
| Personal (Professional Portfolio 2026) | 20 | 20 | 20 |
| Student | 19 | 20 | 20 |

Student PDF page 13 contains **two** artworks (two images + two captions). All other pages are one piece per page. Student page 1 also has a document header line `Student Work` above the caption.

### Caption structure

**Personal work** — short comma-separated line, no dimensions:

`Title, Year, Materials…`

Example: `Pitcher with Cups, 2026, Porcelain, Underglazes, Decals`

Typical fields: title, year (2023–2026), clay body (usually Porcelain; one Marbled Porcelain), surface (Underglazes, Decals, Epoxy), occasional process note (`Utilizing a 4 piece press mold`).

**Student work** — longer prose, student name at the end:

`Course, Project/assignment, Object/theme notes, Materials/glazes/firing, Dimensions, Term, Student Name`

Example: `Art 3410, Plates, Intermediate Ceramics Plate Project, Stoneware, Celadon, Cone 10 Reduction, 9x9x1in, Fall 2024, William Cochran`

Courses appear as Art 3400 (Beginning), Art 3410 (Intermediate), Art 3420 (Handbuilding). Terms span Fall 2023–Fall 2025.

### Grouping / sections in the PDFs

- **Personal:** No section headers. Flat sequence of 20 works. Several titles repeat across different pieces/years (e.g. multiple Side Handled Teapot, Ewer, Pitcher, Mugs, Cup) — distinguish by page number / image, not title alone.
- **Student:** Cover/header `Student Work` on page 1 only. No further section dividers. Pieces are mixed by course/project rather than grouped into chapters. Two Luke Simpson dinnerware pieces sit on consecutive pages (13 bottom + 14). Three Hamin Ahn pieces appear on pages 4, 7, and 19. Three Nicholas R. Toepfer pieces on pages 11–13 (top).

### Image quality notes

- All artwork images extracted cleanly as embedded JPEG originals via `pdfimages -all`. No fallback page-raster cropping was required.
- Personal images: either **800×800** (majority) or roughly **1185–1270 × 959–1338**. Embedded display PPI in the PDF is ~123 or ~192 (Word downsampled these from larger sources before embedding).
- Student images: wider range, **345×433** (smallest) up to about **1055×928** / **905×1207**. Several are quite small for web hero use (<400px on a side): pages 4, 7, 8, 19.
- Artist statement PDF embeds **no** images.
- Filenames for student extracts intentionally omit student names. Inventory still records the name for review before any public page is built.
- Glaze recipe names that look like people (`Phil’s White`, `Tom Coleman Jet Black`) are **materials**, not student names — keep them in captions.
- Likely typo in student caption page 9: `Abstracted Dear` (probably Deer).

### Student names found (to strip later)

- Abby E. Burcham
- Caitlynn M. Osgood
- Chaeyeon An
- Claire C. Reynolds
- Hamin Ahn
- Kennedy Turnbull
- Luke Simpson
- Meri Parker P. Pigott
- Neely C. Kiihnl
- Nicholas R. Toepfer
- Tori N. Saenz
- William Cochran
- Yazie E. Goulet

---

## Personal Work

| # | Page | Image | Pixels | Caption |
|---:|---:|---|---|---|
| personal-01 | 1 | `p01-pitcher-with-cups-2026.jpg` | 800×800 | Pitcher with Cups, 2026, Porcelain, Underglazes, Decals |
| personal-02 | 2 | `p02-side-handled-teapot-2026.jpg` | 1230×990 | Side Handled Teapot, 2026, Porcelain, Underglazes, Decals |
| personal-03 | 3 | `p03-side-handled-teapot-2026.jpg` | 1185×1196 | Side Handled Teapot, 2026, Porcelain, Underglazes, Decals |
| personal-04 | 4 | `p04-kettle-2026.jpg` | 1270×1338 | Kettle, 2026, Porcelain, Underglazes, Decals |
| personal-05 | 5 | `p05-side-handled-teapot-2026.jpg` | 1208×959 | Side Handled Teapot, 2026, Marbled Porcelain, Underglazes, Decals |
| personal-06 | 6 | `p06-ewer-2025.jpg` | 800×800 | Ewer, 2025, Porcelain, Underglazes |
| personal-07 | 7 | `p07-ewer-2025.jpg` | 800×800 | Ewer, 2025, Porcelain, Underglazes |
| personal-08 | 8 | `p08-ewer-2026.jpg` | 800×800 | Ewer, 2026, Porcelain, Underglazes, Decals |
| personal-09 | 9 | `p09-stemmed-cups-2024.jpg` | 800×800 | Stemmed Cups, 2024, Porcelain, Underglazes, Decals, Epoxy |
| personal-10 | 10 | `p10-tumblers-2024.jpg` | 800×800 | Tumblers, 2024, Porcelain, Underglazes, Utilizing a 4 piece press mold |
| personal-11 | 11 | `p11-pitcher-2025.jpg` | 800×800 | Pitcher, 2025, Porcelain, Underglazes, Decals |
| personal-12 | 12 | `p12-pitcher-2025.jpg` | 800×800 | Pitcher, 2025, Porcelain, Underglazes, Decals |
| personal-13 | 13 | `p13-flower-brick-2024.jpg` | 1247×1331 | Flower Brick, 2024, Porcelain, Underglazes, Decals |
| personal-14 | 14 | `p14-basket-2023.jpg` | 800×800 | Basket, 2023, Porcelain, Underglazes, Decals |
| personal-15 | 15 | `p15-mugs-2025.jpg` | 800×800 | Mugs, 2025, Porcelain, Underglazes, Decals |
| personal-16 | 16 | `p16-mugs-2025.jpg` | 800×800 | Mugs, 2025, Porcelain, Underglazes |
| personal-17 | 17 | `p17-xo-jar-2025.jpg` | 800×800 | XO Jar, 2025, Porcelain, Underglazes, Decals |
| personal-18 | 18 | `p18-cup-2026.jpg` | 1247×1247 | Cup, 2026, Porcelain, Underglazes, Decals |
| personal-19 | 19 | `p19-bowl-2026.jpg` | 1247×1160 | Bowl, 2026, Porcelain, Underglazes, Decals |
| personal-20 | 20 | `p20-cup-2026.jpg` | 1247×1079 | Cup, 2026, Porcelain, Underglazes, Decals |

---

## Student Work

| # | Page | Image | Pixels | Caption (full, including name) | Student name (strip) | Caption without name |
|---:|---:|---|---|---|---|---|
| student-01 | 1 | `p01-art3410-plates-fall-2024.jpg` | 1055×928 | Art 3410, Plates, Intermediate Ceramics Plate Project, Stoneware, Celadon, Cone 10 Reduction, 9x9x1in, Fall 2024, William Cochran | **William Cochran** | Art 3410, Plates, Intermediate Ceramics Plate Project, Stoneware, Celadon, Cone 10 Reduction, 9x9x1in, Fall 2024 |
| student-02 | 2 | `p02-art3400-couch-jar-fall-2025.jpg` | 665×533 | Art 3400 Beginning Final Project, 4 Objects With A Theme, Student chose objects surrounding jewelry containment and display, Couch Jar, removable cushions, interior divided into two sections for jewelry, green slip, clear glaze, stoneware, cone 10 reduction, 4x6x4 in, Fall 2025, Neely C. Kiihnl | **Neely C. Kiihnl** | Art 3400 Beginning Final Project, 4 Objects With A Theme, Student chose objects surrounding jewelry containment and display, Couch Jar, removable cushions, interior divided into two sections for jewelry, green slip, clear glaze, stoneware, cone 10 reduction, 4x6x4 in, Fall 2025 |
| student-03 | 3 | `p03-art3410-teapot-spring-2025.jpg` | 781×666 | Art 3410 Intermediate Ceramics, Teapot, from the Teapot and Covered Vessel Project, purple glaze, stoneware, cone 10 reduction, 3x3x4 in, Spring 2025, Meri Parker P. Pigott | **Meri Parker P. Pigott** | Art 3410 Intermediate Ceramics, Teapot, from the Teapot and Covered Vessel Project, purple glaze, stoneware, cone 10 reduction, 3x3x4 in, Spring 2025 |
| student-04 | 4 | `p04-art3400-pedestal-bowl-fall-2024.jpg` | 345×433 | Art 3400 Beginning Final Project, 4 Objects With A Theme, Student chose objects with floral imagery and additions, stoneware, Pedestal Bowl, celadon, cone 10 reduction, 4x4x8 in, Fall 2024, Hamin Ahn | **Hamin Ahn** | Art 3400 Beginning Final Project, 4 Objects With A Theme, Student chose objects with floral imagery and additions, stoneware, Pedestal Bowl, celadon, cone 10 reduction, 4x4x8 in, Fall 2024 |
| student-05 | 5 | `p05-art3420-sheep-spring-2025.jpg` | 841×932 | Art 3420 Handbuilding First Project, Abstracted Animal Figures, Sheep, stoneware, white slip, underglaze and oxide wash, clear glaze, oxidation cone 6, 16x27x27 in, Spring 2025, Kennedy Turnbull | **Kennedy Turnbull** | Art 3420 Handbuilding First Project, Abstracted Animal Figures, Sheep, stoneware, white slip, underglaze and oxide wash, clear glaze, oxidation cone 6, 16x27x27 in, Spring 2025 |
| student-06 | 6 | `p06-art3400-dog-themed-set-fall-2024.jpg` | 762×623 | Art 3400 Beginning Final Project, 4 Objects With A Theme, Dog Themed Set, Student chose to make a drinkware set and snack dish based on her pet and made more than the requirement, bowl and stein unstack from 5 cups stoneware, white slip, clear glaze, cone 10 reduction, 8x4x8 in, Fall 2024, Chaeyeon An | **Chaeyeon An** | Art 3400 Beginning Final Project, 4 Objects With A Theme, Dog Themed Set, Student chose to make a drinkware set and snack dish based on her pet and made more than the requirement, bowl and stein unstack from 5 cups stoneware, white slip, clear glaze, cone 10 reduction, 8x4x8 in, Fall 2024 |
| student-07 | 7 | `p07-art3400-sculptural-plate-fall-2024.jpg` | 357×386 | Art 3400 Beginning Slab Plate Project, Student chose objects with floral imagery and additions, sculptural plate, Stoneware, celadon over matte white glaze, cone 10 reduction, 9x9x1 in, Fall 2024, Hamin Ahn | **Hamin Ahn** | Art 3400 Beginning Slab Plate Project, Student chose objects with floral imagery and additions, sculptural plate, Stoneware, celadon over matte white glaze, cone 10 reduction, 9x9x1 in, Fall 2024 |
| student-08 | 8 | `p08-art3420-majoras-mask-fall-2024.jpg` | 352×351 | Art 3420 Handbuilding Final Project, Pick Your Own Adventure, Majora’s Mask, Zelda, wall hanging, stoneware, multiple slips, underglaze and oxide wash, clear glaze, oxidation cone 6, 24x24x6 in, Fall 2024, Abby E. Burcham | **Abby E. Burcham** | Art 3420 Handbuilding Final Project, Pick Your Own Adventure, Majora’s Mask, Zelda, wall hanging, stoneware, multiple slips, underglaze and oxide wash, clear glaze, oxidation cone 6, 24x24x6 in, Fall 2024 |
| student-09 | 9 | `p09-art3420-abstracted-dear-spring-2025.jpg` | 837×1246 | Art 3420 Handbuilding Final Project, Pick Your Own Adventure, Abstracted Dear, stoneware, white slip, clear glaze, oxidation cone 10, 3x14x24 in, Spring 2025, Caitlynn M. Osgood | **Caitlynn M. Osgood** | Art 3420 Handbuilding Final Project, Pick Your Own Adventure, Abstracted Dear, stoneware, white slip, clear glaze, oxidation cone 10, 3x14x24 in, Spring 2025 |
| student-10 | 10 | `p10-art3420-wolf-mask-fall-2024.jpg` | 836×938 | Art 3420 Handbuilding Project 1, Abstracted Animal, Wolf Mask, stoneware, multiple slips, underglaze and oxide wash, clear glaze, oxidation cone 6, 12x12x14 in, Fall 2024, Abby E. Burcham | **Abby E. Burcham** | Art 3420 Handbuilding Project 1, Abstracted Animal, Wolf Mask, stoneware, multiple slips, underglaze and oxide wash, clear glaze, oxidation cone 6, 12x12x14 in, Fall 2024 |
| student-11 | 11 | `p11-art3400-swordfish-spring-2025.jpg` | 795×740 | Art 3400, Project 1 Pinch Pots, Swordfish, stoneware, multiple slips, clear glaze, reduction, cone 10, 2x5x3 in, Spring 2025, Nicholas R. Toepfer | **Nicholas R. Toepfer** | Art 3400, Project 1 Pinch Pots, Swordfish, stoneware, multiple slips, clear glaze, reduction, cone 10, 2x5x3 in, Spring 2025 |
| student-12 | 12 | `p12-art3400-anatomical-arm-study-spring-2025.jpg` | 815×1308 | Art 3400, Project 1, Pinch Pots, Anatomical Arm Study, stoneware, multiple slips, clear glaze, reduction, cone 10, 3x3x16 in, Spring 2025, Nicholas R. Toepfer | **Nicholas R. Toepfer** | Art 3400, Project 1, Pinch Pots, Anatomical Arm Study, stoneware, multiple slips, clear glaze, reduction, cone 10, 3x3x16 in, Spring 2025 |
| student-13 | 13 | `p13-art3400-hand-cup-spring-2025.jpg` | 818×606 | Art 3400, Final Project, 4 Objects With A Theme, Hand Cup, stoneware, multiple slips, Phil’s White, Tom Coleman Jet Black, Copper Red, reduction, cone 10, 2x8x4 in, Spring 2025, Nicholas R. Toepfer | **Nicholas R. Toepfer** | Art 3400, Final Project, 4 Objects With A Theme, Hand Cup, stoneware, multiple slips, Phil’s White, Tom Coleman Jet Black, Copper Red, reduction, cone 10, 2x8x4 in, Spring 2025 |
| student-14 | 13 | `p13-art3410-grouping-of-3-stemmed-glasses-spring-2025.jpg` | 787×624 | Art 3410, Final Project, Dinnerware Set, Grouping of 3 Stemmed Glasses, Stoneware, Oribe Glaze, Cone 10 Reduction, 2x2x7 in, Spring 2025, Luke Simpson | **Luke Simpson** | Art 3410, Final Project, Dinnerware Set, Grouping of 3 Stemmed Glasses, Stoneware, Oribe Glaze, Cone 10 Reduction, 2x2x7 in, Spring 2025 |
| student-15 | 14 | `p14-art3410-grouping-of-2-tankards-spring-2025.jpg` | 838×569 | Art 3410, Final Project, Dinnerware Set, Grouping of 2 Tankards, Stoneware, Oribe Glaze, Cone 10 Reduction, 2x3x5 in, Spring 2025, Luke Simpson | **Luke Simpson** | Art 3410, Final Project, Dinnerware Set, Grouping of 2 Tankards, Stoneware, Oribe Glaze, Cone 10 Reduction, 2x3x5 in, Spring 2025 |
| student-16 | 15 | `p15-art3420-articulated-frog-doll-fall-2023.jpg` | 905×1207 | Art 3420, Final Project, Articulated Frog Doll, Stoneware, Iron Glaze, Cone 10 Reduction, 1.5x1.5x6 in, Fall 2023, Tori N. Saenz | **Tori N. Saenz** | Art 3420, Final Project, Articulated Frog Doll, Stoneware, Iron Glaze, Cone 10 Reduction, 1.5x1.5x6 in, Fall 2023 |
| student-17 | 16 | `p16-art3410-cyanotype-inspired-lidded-casserole-dish-fall-2023.jpg` | 762×653 | Art 3410, Final Project, Centerpiece, Cyanotype Inspired Lidded Casserole Dish, Thrown, Altered, Condensation Bump Texture Under Lid, Stoneware, Dried Plant Resist, Blue slip, Cone 10 Reduction, 9x9x8 in, Fall 2023, Yazie E. Goulet | **Yazie E. Goulet** | Art 3410, Final Project, Centerpiece, Cyanotype Inspired Lidded Casserole Dish, Thrown, Altered, Condensation Bump Texture Under Lid, Stoneware, Dried Plant Resist, Blue slip, Cone 10 Reduction, 9x9x8 in, Fall 2023 |
| student-18 | 17 | `p17-art3400-strawberry-lidded-mug-fall-2025.jpg` | 858×882 | Art 3400, Final Project, 4 Objects With A Theme, Strawberry Lidded Mug, Stoneware, Red and Green Slip, Thrown Flanged lid, Cone 10 Reduction, 3x3x4 in, Fall 2025, Neely C. Kiihnl | **Neely C. Kiihnl** | Art 3400, Final Project, 4 Objects With A Theme, Strawberry Lidded Mug, Stoneware, Red and Green Slip, Thrown Flanged lid, Cone 10 Reduction, 3x3x4 in, Fall 2025 |
| student-19 | 18 | `p18-art3400-acorn-cap-jars-fall-2024.jpg` | 750×544 | Art 3400, Final Project, 4 Objects With A Theme, Acorn Cap Jars, Stoneware, Slip, Thrown, Flanged Rim and Thrown and Carved Lid, Tomato Red and Passion Purple Glazes, Cone 10 Reduction, 3x3x4 in, Fall 2024, Claire C. Reynolds | **Claire C. Reynolds** | Art 3400, Final Project, 4 Objects With A Theme, Acorn Cap Jars, Stoneware, Slip, Thrown, Flanged Rim and Thrown and Carved Lid, Tomato Red and Passion Purple Glazes, Cone 10 Reduction, 3x3x4 in, Fall 2024 |
| student-20 | 19 | `p19-art3400-floral-kylix-fall-2024.jpg` | 357×333 | Art 3400, Final Project, 4 Objects With A Theme, Floral Kylix, Thrown, Pinched, Sculpted Additions, Stoneware, Cone 10 Reduction, 6x6x5 in, Fall 2024, Hamin Ahn | **Hamin Ahn** | Art 3400, Final Project, 4 Objects With A Theme, Floral Kylix, Thrown, Pinched, Sculpted Additions, Stoneware, Cone 10 Reduction, 6x6x5 in, Fall 2024 |

---

## Uncertainties / notes for later incorporation

1. **Page 13 pairing** visually confirmed: top image = Hand Cup (Toepfer); bottom = Grouping of 3 Stemmed Glasses (Simpson).
2. Personal pieces with identical titles (e.g. two `Side Handled Teapot, 2026…` on pages 2–3; two `Ewer, 2025…` on 6–7; two `Pitcher, 2025…` on 11–12; two `Mugs, 2025…` on 15–16; two `Cup, 2026…` on 18 & 20) need distinct display labels if shown together.
3. No dimensions on personal captions — only on student work.
4. Low-resolution student embeds (esp. pages 4, 7, 8, 19) may look soft on retina/desktop; originals in the PDF are already this size.
5. Pronoun in Chaeyeon An caption (`based on her pet`) identifies gender but is not a name; decide whether to keep, rephrase, or leave as-is when building the public page.

