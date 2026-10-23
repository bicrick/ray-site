import { loadWorks, createImage } from "./data.js";

/** Compact homepage strip: a few student pieces linking to /student-work. */
const PREVIEW_IDS = [
  "student-p01-plates",
  "student-p05-sheep",
  "student-p13-hand-cup",
  "student-p16-cyanotype-casserole",
];

export async function initTeachingPreview() {
  const strip = document.querySelector("[data-teaching-strip]");
  if (!strip) return;

  const { works } = await loadWorks("assets/content/student-work.json");
  const byImage = Object.fromEntries(works.map((w) => [w.image, w]));
  const picks = PREVIEW_IDS.map((id) => byImage[id]).filter(Boolean);

  picks.forEach((work) => {
    const li = document.createElement("li");
    li.className = "teaching-strip-item";

    const link = document.createElement("a");
    link.className = "teaching-strip-card";
    link.href = "student-work.html";
    link.setAttribute(
      "aria-label",
      `Student work: ${work.title} — see more from my classes`
    );

    const thumb = document.createElement("div");
    thumb.className =
      "teaching-strip-thumb" + (work.nativeSmall ? " is-native-small" : "");
    thumb.append(
      createImage(work, {
        sizes: "(min-width: 900px) 12rem, 40vw",
      })
    );

    const meta = document.createElement("div");
    meta.className = "teaching-strip-meta";
    const title = document.createElement("span");
    title.className = "teaching-strip-title";
    title.textContent = work.title;
    const credit = document.createElement("span");
    credit.className = "teaching-strip-credit";
    credit.textContent = work.cardLabel || "Student work";
    meta.append(title, credit);

    link.append(thumb, meta);
    li.append(link);
    strip.append(li);
  });
}
