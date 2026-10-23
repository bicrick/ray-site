import { prefersReducedMotion } from "./data.js";

export function initReveal(root = document) {
  const nodes = root.querySelectorAll(".reveal:not(.is-visible)");
  if (!nodes.length) return;

  if (prefersReducedMotion()) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

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
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}
