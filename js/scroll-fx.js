import { prefersReducedMotion } from "./data.js";

/**
 * Scroll-linked motion on top of native scrolling: one passive listener, one rAF,
 * only transforms and opacity are written.
 */
export function initScrollFx() {
  if (prefersReducedMotion()) {
    document.querySelectorAll(".statement-quote .word").forEach((w) => w.classList.add("is-lit"));
    return;
  }

  const hero = document.querySelector(".hero");
  const wall = document.querySelector("[data-hero-wall]");
  const desktop = window.matchMedia("(min-width: 960px)");
  const quote = document.querySelector(".statement-quote");
  const words = splitWords(quote);
  let fields = [];

  const vh = () => window.innerHeight;

  function frame() {
    const y = window.scrollY;

    // Hero: marks drift up and turn; the featured photo eases back as you leave
    if (hero) {
      hero.style.setProperty("--parallax", Math.min(y, 1200).toFixed(0));
      hero.style.setProperty("--spin", `${(y * 0.06).toFixed(2)}deg`);
    }
    // the two columns of the wall slide against each other as you scroll
    if (wall && desktop.matches && y < vh() * 1.5) wall.style.setProperty("--wall-shift", `${(y * -0.35).toFixed(1)}px`);

    // Scattered marks: drift + slow rotation relative to the viewport centre
    // phones: marks stay exactly where layoutMarks() found clear space
    if (desktop.matches) fields.forEach((field) => {
      const rect = field.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh() + 200) return;
      const offset = rect.top + rect.height / 2 - vh() / 2;
      field.style.setProperty("--shift", `${(offset * -0.14).toFixed(1)}px`);
      field.style.setProperty("--spin", `${(offset * -0.05).toFixed(2)}deg`);
    });

    // Statement: words light up as the quote travels up the screen
    if (quote && words.length) {
      const rect = quote.getBoundingClientRect();
      const progress = Math.min(Math.max((vh() * 0.85 - rect.top) / (vh() * 0.55), 0), 1);
      const lit = Math.round(progress * words.length);
      words.forEach((word, i) => word.classList.toggle("is-lit", i < lit));
    }
    ticking = false;
  }

  let ticking = false;
  const request = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  request();

  return (newFields) => {
    fields = newFields;
    request();
  };
}

function splitWords(root) {
  if (!root) return [];
  const words = [];
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) return frag.append(part);
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = part;
          words.push(span);
          frag.append(span);
        });
        child.replaceWith(frag);
      } else {
        walk(child);
      }
    });
  };
  walk(root);
  return words;
}
