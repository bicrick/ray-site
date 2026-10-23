import { createImage } from "./data.js";

/**
 * @param {{ categories: any[], works: any[] }} data
 * @param {{
 *   clip?: boolean,
 *   inquire?: boolean,
 *   inquireLabel?: string,
 *   noteOnly?: boolean,
 * }} [options]
 */
export function initWork({ categories, works }, options = {}) {
  const {
    clip = true,
    inquire = true,
    inquireLabel = "Inquire about this piece",
    noteOnly = false,
  } = options;
  const grid = document.querySelector("[data-work-grid]");
  const filters = document.querySelector("[data-filters]");
  if (!grid) return;

  const items = works.map((work, index) => {
    const li = document.createElement("li");
    li.className = "work-item";
    li.dataset.category = work.category;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "work-card";
    button.setAttribute("aria-label", `${work.title} — view larger`);
    button.addEventListener("click", () => openLightbox(index));

    const thumb = document.createElement("div");
    thumb.className =
      "work-thumb" +
      (work.ground === "light" ? " is-light" : "") +
      (work.nativeSmall ? " is-native-small" : "");
    thumb.append(
      createImage(work, { sizes: "(min-width: 1280px) 20rem, (min-width: 640px) 33vw, 92vw" })
    );

    const meta = document.createElement("div");
    meta.className = "work-meta";
    meta.innerHTML = `<span class="work-title"></span><span class="work-cat"></span>`;
    meta.children[0].textContent = work.title;
    meta.children[1].textContent = work.cardLabel || work.categoryLabel;

    button.append(thumb, meta);
    li.append(button);
    grid.append(li);
    return li;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          entry.target.style.setProperty("--stagger", i);
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
    },
    { rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((item) => observer.observe(item));

  const mobile = window.matchMedia("(max-width: 767px)");
  const more = document.querySelector("[data-work-more]");
  let expanded = false;
  let filter = "all";
  const syncClip = () => {
    if (!clip) {
      grid.classList.remove("is-clipped");
      return;
    }
    grid.classList.toggle("is-clipped", !mobile.matches && !expanded && filter === "all");
  };
  mobile.addEventListener("change", syncClip);

  const slideCount = document.querySelector("[data-work-count]");
  const slideBar = document.querySelector("[data-work-bar]");
  const syncProgress = () => {
    const shown = items.filter((item) => !item.hidden);
    if (!shown.length || !slideCount) return;
    const step = shown[0].getBoundingClientRect().width + 12;
    const index = Math.min(shown.length - 1, Math.round(grid.scrollLeft / step));
    slideCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(shown.length).padStart(2, "0")}`;
    slideBar?.parentElement.style.setProperty("--progress", ((index + 1) / shown.length).toFixed(3));
  };
  grid.addEventListener("scroll", () => requestAnimationFrame(syncProgress), { passive: true });
  syncProgress();
  more?.addEventListener("click", () => {
    expanded = true;
    syncClip();
  });
  if (more) more.textContent = `Show all ${works.length} pieces`;
  syncClip();

  let visible = works.map((_, i) => i);
  const optionsButtons = [{ id: "all", label: "All" }, ...categories].map((cat) => {
    const count =
      cat.id === "all" ? works.length : works.filter((w) => w.category === cat.id).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter";
    button.setAttribute("aria-pressed", String(cat.id === "all"));
    button.innerHTML = `<span></span><span class="filter-count">${count}</span>`;
    button.firstChild.textContent = cat.label;
    button.addEventListener("click", () => {
      optionsButtons.forEach((o) => o.setAttribute("aria-pressed", String(o === button)));
      filter = cat.id;
      syncClip();
      grid.scrollTo({ left: 0 });
      syncProgress();
      visible = [];
      items.forEach((item, i) => {
        const show = cat.id === "all" || item.dataset.category === cat.id;
        item.hidden = !show;
        if (show) {
          visible.push(i);
          item.classList.add("is-visible");
        }
      });
    });
    filters?.append(button);
    return button;
  });

  const dialog = document.querySelector("[data-lightbox]");
  if (!dialog) return;

  const media = dialog.querySelector("[data-lightbox-media]");
  const img = dialog.querySelector("[data-lightbox-img]");
  const title = dialog.querySelector("[data-lightbox-title]");
  const note = dialog.querySelector("[data-lightbox-note]");
  const count = dialog.querySelector("[data-lightbox-count]");
  const inquireEl = dialog.querySelector("[data-lightbox-inquire]");
  let current = 0;

  if (inquireEl) {
    inquireEl.hidden = !inquire;
    if (inquire) inquireEl.textContent = inquireLabel;
  }

  function render(index) {
    current = index;
    const work = works[index];
    const fresh = createImage(work, { sizes: "(min-width: 860px) 800px, 100vw", eager: true });
    img.srcset = fresh.srcset;
    img.sizes = fresh.sizes;
    img.src = fresh.src;
    img.alt = fresh.alt;
    media.classList.toggle("is-light", work.ground === "light");
    media.classList.toggle("is-native-small", Boolean(work.nativeSmall));
    title.textContent = work.title;
    note.textContent = noteOnly
      ? work.note || work.cardLabel || work.categoryLabel || ""
      : [work.categoryLabel, work.note].filter(Boolean).join(" · ");
    const pos = visible.indexOf(index);
    count.textContent = `${String(pos + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
    if (inquire && inquireEl) {
      inquireEl.href = `mailto:rlbrowni@olemiss.edu?subject=${encodeURIComponent(
        `Inquiry: ${work.title}`
      )}&body=${encodeURIComponent(
        `Hi Ray, I'm interested in the ${work.title.toLowerCase()} (${work.image}) on your website.`
      )}`;
    }
  }

  function step(delta) {
    const pos = visible.indexOf(current);
    render(visible[(pos + delta + visible.length) % visible.length]);
  }

  function openLightbox(index) {
    render(index);
    dialog.showModal();
  }

  initWork.open = openLightbox;
  dialog.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => step(-1));
  dialog.querySelector("[data-lightbox-next]")?.addEventListener("click", () => step(1));
  dialog.querySelector("[data-lightbox-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });

  let touchX = null;
  media.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  media.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    touchX = null;
  });
}
