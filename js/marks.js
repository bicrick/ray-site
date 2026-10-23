import { prefersReducedMotion, loadJSON } from "./data.js";

const SPRITE = "assets/marks/marks.svg";
// Ray's whole marks, recoloured in his glaze palette
const GLAZES = {
  light: [["var(--color-ink)", 4], ["var(--glaze-teal)", 2], ["var(--glaze-orange)", 2], ["var(--glaze-gold)", 2]],
  dark: [["var(--color-cream)", 3], ["var(--glaze-teal)", 2], ["var(--glaze-orange)", 2], ["var(--glaze-gold)", 2]],
};

function weighted(rand, list) {
  let n = rand() * list.reduce((sum, [, w]) => sum + w, 0);
  for (const [value, w] of list) if ((n -= w) < 0) return value;
  return list[0][0];
}

/** Small deterministic PRNG so every visit gets the same composition. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rand, marks, tone) {
  const mark = marks[Math.floor(rand() * marks.length)];
  return { id: mark.id, color: weighted(rand, GLAZES[tone]) };
}

export function createMark(id, color) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "mark");
  svg.style.color = color;
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `${SPRITE}#${id}`);
  svg.append(use);
  return svg;
}

/** Scatter marks in a section's margins (gutters plus top/bottom padding). */
function scatter(section, index, marks) {
  const count = Number(section.dataset.marks) || 6;
  const tone = section.dataset.marksTone || "light";
  const rand = rng(index * 97 + count * 13 + 7);
  const field = document.createElement("div");
  field.className = "mark-field";
  field.setAttribute("aria-hidden", "true");

  for (let i = 0; i < count; i++) {
    const choice = pick(rand, marks, tone);
    const mark = createMark(choice.id, choice.color);
    // Zones are computed in CSS so marks only ever sit in gutters or section padding
    const roll = rand();
    mark.dataset.zone = roll < 0.35 ? "left" : roll < 0.7 ? "right" : roll < 0.85 ? "top" : "bottom";
    const size = 1.6 + rand() * 1.6;
    const dir = rand() < 0.5 ? -1 : 1;
    mark.style.cssText += `;--gx:${rand().toFixed(3)};--gy:${rand().toFixed(3)};--s:${size.toFixed(2)}rem;--r:${Math.round(rand() * 360)}deg;--d:${(dir * (0.4 + rand() * 0.9)).toFixed(2)};--o:${(0.6 + rand() * 0.3).toFixed(2)}`;
    field.append(mark);
  }

  section.classList.add("has-field");
  section.prepend(field);
  return field;
}

/** Every mark stamps itself in when it scrolls into view, then drifts. Call once marks are placed. */
export function initStampIn() {
  const marks = document.querySelectorAll(".mark:not(.brand .mark):not(.ticker .mark)");
  marks.forEach((mark, i) => {
    mark.dataset.draw = "";
    mark.style.setProperty("--float-dur", `${7 + (i % 5) * 1.3}s`);
    mark.style.setProperty("--float-delay", `${-(i % 7) * 1.1}s`);
  });

  const io = new IntersectionObserver(
    (entries) =>
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          const mark = entry.target;
          mark.style.setProperty("--draw-delay", `${i * 110}ms`);
          mark.classList.add("is-drawn");
          io.unobserve(mark);
          if (!mark.closest(".vocab, .about-media") && !prefersReducedMotion()) {
            setTimeout(() => mark.classList.add("is-floating"), 1000 + i * 110);
          }
        }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  marks.forEach((mark) => io.observe(mark));
}

const PHONE = window.matchMedia("(max-width: 767px)");
// Anything a mark must never sit on or behind
const OBSTACLES =
  "h1, h2, h3, p, a, button, img, li, figure, blockquote, .work-grid, .reels, .kiln-mosaic, .hero-wall, .filters, .work-progress, .cv";
const CLEARANCE = 14; // px: covers the slow float and rotation

/**
 * An element's box relative to `container`, from offsetTop/Left — layout positions that
 * ignore transforms, i.e. where content settles once entrance animations finish.
 * Measuring this way never pauses or restarts any animation.
 */
function settledBox(el, container) {
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
    if (node && node !== container && !container.contains(node)) return null;
  }
  if (!node) return null;
  return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight };
}

function obstacleBoxes(section) {
  return Array.from(section.querySelectorAll(OBSTACLES))
    .filter((el) => !el.closest(".mark-field, .hero-marks") && el.offsetWidth && el.offsetHeight)
    .map((el) => settledBox(el, section))
    .filter(Boolean)
    .map((b) => ({ l: b.l - CLEARANCE, t: b.t - CLEARANCE, r: b.r + CLEARANCE, b: b.b + CLEARANCE }));
}

const hits = (a, list) => list.some((o) => a.l < o.r && a.r > o.l && a.t < o.b && a.b > o.t);

/**
 * Phones: give every scattered mark a spot that's clear of text, buttons, photos and
 * the header — try several, and drop the mark if nothing on that page is free.
 * Larger screens keep the gutter/padding zones from CSS.
 */
function placeFreely(container, marks, seed, navH) {
  const origin = { width: container.offsetWidth, height: container.offsetHeight };
  const blocked = obstacleBoxes(container);
  const rand = rng(seed);
  marks.forEach((mark) => {
    mark.dataset.homeZone ||= mark.dataset.zone || "";
    const size = parseFloat(getComputedStyle(mark).width) || 28;
    const reach = size * 0.21; // a rotated mark's corners poke out ~21% past its box
    let spot = null;
    for (let attempt = 0; attempt < 40 && !spot; attempt++) {
      const x = 6 + reach + rand() * (origin.width - size - 12 - 2 * reach);
      const y = navH + 6 + reach + rand() * (origin.height - size - navH - 12 - 2 * reach);
      const box = { l: x - reach, t: y - reach, r: x + size + reach, b: y + size + reach };
      if (!hits(box, blocked)) spot = { l: x, t: y, r: x + size, b: y + size };
    }
    mark.toggleAttribute("hidden", !spot); // SVG elements have no .hidden property
    if (!spot) return;
    blocked.push({ l: spot.l - 24, t: spot.t - 24, r: spot.r + 24, b: spot.b + 24 }); // keep marks apart too
    mark.dataset.zone = "free";
    mark.style.left = `${spot.l.toFixed(0)}px`;
    mark.style.top = `${spot.t.toFixed(0)}px`;
  });
}

function restoreZones(marks) {
  marks.forEach((mark) => {
    mark.removeAttribute("hidden");
    if (mark.dataset.homeZone !== undefined) mark.dataset.zone = mark.dataset.homeZone;
    mark.style.removeProperty("left");
    mark.style.removeProperty("top");
  });
}

/**
 * Phones: give every mark a spot that's clear of text, buttons, photos and the
 * header — try several, and drop the mark if nothing on that page is free.
 * Layout is measured where content settles (transforms ignored), without touching animations.
 * Larger screens keep the gutter/padding zones from CSS.
 */
export function layoutMarks() {
  const navH = document.querySelector(".site-header")?.offsetHeight || 56;
  const groups = [
    ...Array.from(document.querySelectorAll(".mark-field"), (field) => [field.parentElement, Array.from(field.children)]),
    [document.querySelector(".hero"), Array.from(document.querySelectorAll(".hero-marks .mark"))],
  ].filter(([container]) => container);

  if (!PHONE.matches) return groups.forEach(([, marks]) => restoreZones(marks));

  groups.forEach(([container, marks], i) => placeFreely(container, marks, i * 131 + 17, navH));
}

export async function initMarkFields() {
  let manifest;
  try {
    manifest = await loadJSON("assets/marks/marks.json");
  } catch {
    return [];
  }
  return Array.from(document.querySelectorAll("[data-marks]"), (s, i) => scatter(s, i, manifest.marks));
}
