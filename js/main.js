import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { loadWorks } from "./data.js";
import { initHeroWall } from "./hero-wall.js";
import { initWork } from "./work.js";
import { initStudio } from "./studio.js";
import { initTeachingPreview } from "./teaching-preview.js";
import { initMarkFields, layoutMarks, initStampIn } from "./marks.js";
import { initScrollFx } from "./scroll-fx.js";

initNav();
const setFields = initScrollFx();

Promise.allSettled([
  loadWorks().then((data) => {
    initWork(data);
    initHeroWall(data.works, (i) => initWork.open?.(i));
  }),
  initStudio(),
  initTeachingPreview(),
  initMarkFields().then((fields) => setFields?.(fields)),
]).then((results) => {
  results
    .filter((r) => r.status === "rejected")
    .forEach((r) => console.error(r.reason));
  initReveal();
  // Place marks exactly once, after content and fonts have settled, and only then let
  // them stamp in — so nothing appears in one spot and jumps to another.
  document.fonts.ready.then(() =>
    requestAnimationFrame(() => {
      layoutMarks();
      initStampIn();
    })
  );
  // re-place on real size changes only (rotation / desktop resize), not the iOS toolbar
  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutMarks, 250);
  });
});

// Duplicate ticker content so the marquee loops seamlessly
const ticker = document.querySelector(".ticker-track");
if (ticker) ticker.append(...Array.from(ticker.children, (node) => node.cloneNode(true)));
