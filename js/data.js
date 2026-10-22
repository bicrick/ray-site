const cache = new Map();

export function loadJSON(path) {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(path).then((res) => {
        if (!res.ok) throw new Error(`${path}: ${res.status}`);
        return res.json();
      })
    );
  }
  return cache.get(path);
}

export async function loadWorks() {
  const [catalogue, images] = await Promise.all([
    loadJSON("assets/content/works.json"),
    loadJSON("assets/content/images.json"),
  ]);
  const labels = Object.fromEntries(catalogue.categories.map((c) => [c.id, c.label]));
  const works = catalogue.works
    .filter((work) => images[work.image])
    .map((work) => ({ ...work, categoryLabel: labels[work.category], meta: images[work.image] }));
  return { categories: catalogue.categories, works };
}

/** Build an <img> whose srcset only lists renditions that exist (never upscaled). */
export function createImage(work, { sizes, eager = false } = {}) {
  const { widths, w, h } = work.meta;
  const img = document.createElement("img");
  const src = (width) => `assets/img/${work.image}-${width}.webp`;
  img.src = src(widths.find((x) => x >= 800) || widths[widths.length - 1]);
  img.srcset = widths.map((x) => `${src(x)} ${x}w`).join(", ");
  img.sizes = sizes || "100vw";
  img.width = w;
  img.height = h;
  img.alt = work.alt || work.title;
  img.decoding = "async";
  if (!eager) img.loading = "lazy";
  develop(img);
  return img;
}

/** Photos "develop" in: blurred and faint until decoded, then settle sharp. */
export function develop(img) {
  img.dataset.develop = "";
  const done = () => img.classList.add("is-loaded");
  if (img.complete && img.naturalWidth) requestAnimationFrame(done);
  else {
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  }
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
