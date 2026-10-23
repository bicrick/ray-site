import { loadJSON, develop, prefersReducedMotion } from "./data.js";

const EMBED_SRC = "https://www.instagram.com/embed.js";
const MOSAIC_CELLS = 4;
const ROTATE_EVERY = 3200;

// The API gives ISO dates, the preview scrape gives "June 16, 2026" — show both as "Jun 2026"
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const firstLine = (text) => (text || "").split("\n")[0].replace(/\s+#\S+/g, "").trim();
const glyph = (cls = "ig-glyph") =>
  `<svg class="${cls}" aria-hidden="true"><use href="#ig-glyph" /></svg>`;

function loadEmbedScript() {
  if (window.instgrm) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.append(script);
  });
}

function image(src, alt = "") {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.decoding = "async";
  develop(img);
  return img;
}

/** Cross-fade a new image in over whatever the container currently shows. */
function swapImage(container, src) {
  const old = container.querySelectorAll("img");
  const next = image(src);
  container.prepend(next);
  old.forEach((img) => {
    img.classList.add("is-leaving");
    setTimeout(() => img.remove(), 900);
  });
}

function initReelDialog() {
  const dialog = document.querySelector("[data-reel-dialog]");
  const body = dialog.querySelector("[data-reel-body]");
  dialog.querySelector("[data-reel-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => (body.innerHTML = ""));

  // Only pull Instagram's heavy embed script when someone actually asks to play
  return async (post) => {
    body.innerHTML = "";
    const quote = document.createElement("blockquote");
    quote.className = "instagram-media";
    quote.dataset.instgrmPermalink = post.url;
    quote.dataset.instgrmVersion = "14";
    quote.innerHTML = `<a href="${post.url}" target="_blank" rel="noopener noreferrer">View on Instagram</a>`;
    body.append(quote);
    dialog.showModal();
    try {
      await loadEmbedScript();
      window.instgrm?.Embeds?.process();
    } catch {
      window.open(post.url, "_blank", "noopener");
      dialog.close();
    }
  };
}

function initReels(feed, play) {
  const feature = document.querySelector("[data-reel-feature]");
  const list = document.querySelector("[data-reel-list]");
  const count = document.querySelector("[data-reel-count]");
  if (!feature || !list || !feed.posts.length) return;
  count.textContent = String(feed.posts.length);

  const caption = (post) => firstLine(post.caption) || "Studio reel";
  feature.innerHTML = `
    <span class="reel-feature-top"><span data-f-index></span>${glyph()}</span>
    <span class="reel-play" aria-hidden="true"></span>
    <span class="reel-feature-body">
      <span class="reel-feature-caption" data-f-caption></span>
      <span class="reel-feature-meta" data-f-meta></span>
    </span>`;
  const fIndex = feature.querySelector("[data-f-index]");
  const fCaption = feature.querySelector("[data-f-caption]");
  const fMeta = feature.querySelector("[data-f-meta]");
  let current = 0;

  const items = feed.posts.map((post, i) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reel-item";
    button.innerHTML = `
      <span class="reel-item-index">${String(i + 1).padStart(2, "0")}</span>
      <span class="reel-item-thumb"></span>
      <span class="reel-item-caption"></span>
      <span class="reel-item-meta">${formatDate(post.date)}</span>`;
    button.querySelector(".reel-item-thumb").append(image(post.poster));
    const cap = button.querySelector(".reel-item-caption");
    cap.textContent = caption(post);
    if (post.author && post.author !== feed.handle.replace("@", "")) {
      const by = document.createElement("small");
      by.textContent = `via @${post.author}`;
      cap.append(by);
    }
    button.setAttribute("aria-label", `Show reel: ${caption(post)}`);
    button.addEventListener("click", () => select(i));
    li.append(button);
    list.append(li);
    return button;
  });

  function select(i) {
    current = i;
    const post = feed.posts[i];
    swapImage(feature, post.poster);
    fIndex.textContent = `${String(i + 1).padStart(2, "0")} / ${String(feed.posts.length).padStart(2, "0")}`;
    fCaption.textContent = caption(post);
    fMeta.textContent = [formatDate(post.date), post.likes && `${post.likes} likes`, post.author && post.author !== feed.handle.replace("@", "") && `via @${post.author}`]
      .filter(Boolean)
      .join("  ·  ");
    feature.setAttribute("aria-label", `Play reel: ${caption(post)}`);
    items.forEach((b, n) => b.setAttribute("aria-current", String(n === i)));
  }

  feature.addEventListener("click", () => play(feed.posts[current]));
  select(0);
}

function initMosaic(feed) {
  const mosaic = document.querySelector("[data-kiln]");
  const posts = feed.recentPosts || [];
  if (!mosaic || !posts.length) return;

  const label = (post) => firstLine(post.caption).replace(/…$/, "") || "Recent work";
  let next = 0;
  const cells = Array.from({ length: Math.min(MOSAIC_CELLS, posts.length) }, () => {
    const post = posts[next++];
    const cell = document.createElement("a");
    cell.className = "kiln-cell";
    cell.target = "_blank";
    cell.rel = "noopener noreferrer";
    cell.innerHTML = `<span class="kiln-cell-label"></span>`;
    mosaic.append(cell);
    const show = (p) => {
      swapImage(cell, p.poster);
      cell.href = p.url;
      cell.querySelector(".kiln-cell-label").textContent = label(p);
      cell.setAttribute("aria-label", `${label(p)} — open on Instagram`);
    };
    show(post);
    return show;
  });

  const ig = document.createElement("a");
  ig.className = "kiln-cell kiln-ig";
  ig.href = feed.profile;
  ig.target = "_blank";
  ig.rel = "noopener noreferrer";
  ig.innerHTML = `${glyph()}<span><strong>More from the studio</strong><span>${feed.followers ? `${feed.followers} followers · ` : ""}${feed.handle}</span></span><svg class="icon kiln-ig-arrow" aria-hidden="true"><use href="#icon-arrow-ne" /></svg>`;
  mosaic.append(ig);

  // Cycle one tile at a time so every recent post gets its turn, only while in view
  if (prefersReducedMotion() || posts.length <= cells.length) return;
  let timer;
  let turn = 0;
  const tick = () => {
    cells[turn % cells.length](posts[next % posts.length]);
    next++;
    turn += 3; // skip around the grid rather than marching in order
  };
  new IntersectionObserver(([entry]) => {
    window.clearInterval(timer);
    if (entry.isIntersecting) timer = window.setInterval(tick, ROTATE_EVERY);
  }).observe(mosaic);
}

export async function initStudio() {
  let feed;
  try {
    feed = await loadJSON("assets/content/instagram.json");
  } catch {
    return;
  }
  initReels(feed, initReelDialog());
  initMosaic(feed);

  const followers = document.querySelector("[data-ig-followers]");
  if (followers && feed.followers) followers.textContent = `${feed.followers} followers`;
}
