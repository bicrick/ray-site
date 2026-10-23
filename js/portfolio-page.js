import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { loadWorks } from "./data.js";
import { initWork } from "./work.js";
import { initMarkFields, layoutMarks, initStampIn } from "./marks.js";
import { initScrollFx } from "./scroll-fx.js";

const page = document.body.dataset.portfolioPage;
const catalogue =
  page === "student"
    ? "assets/content/student-work.json"
    : "assets/content/personal-work.json";

initNav();
const setFields = initScrollFx();

Promise.allSettled([
  loadWorks(catalogue).then((data) => {
    initWork(data, {
      clip: false,
      inquire: page !== "student",
      inquireLabel: page === "student" ? "" : "Inquire about this piece",
    });
    const countEl = document.querySelector("[data-portfolio-count]");
    if (countEl) countEl.textContent = String(data.works.length);
  }),
  initMarkFields().then((fields) => setFields?.(fields)),
]).then((results) => {
  results
    .filter((r) => r.status === "rejected")
    .forEach((r) => console.error(r.reason));
  initReveal();
  document.fonts.ready.then(() =>
    requestAnimationFrame(() => {
      layoutMarks();
      initStampIn();
    })
  );
  let lastWidth = window.innerWidth;
  let resizeTimer;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutMarks, 250);
  });
});
