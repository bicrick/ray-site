import { createImage } from "./data.js";

const SIZES = "(min-width: 960px) 16vw, 9.5rem";

/** Fill the hero wall with two interleaved runs of pieces, duplicated for a seamless loop. */
export function initHeroWall(works, openPiece) {
  const wall = document.querySelector("[data-hero-wall]");
  if (!wall) return;
  const tracks = wall.querySelectorAll(".hero-col-track");
  const runs = [works.filter((_, i) => i % 2 === 0), works.filter((_, i) => i % 2 === 1)];

  // Each tile gets its own freshly built image (never cloneNode, which drops the
  // load listener and leaves copies stuck invisible). All eager: the wall is above
  // the fold and moves via transform, which lazy-loading doesn't reliably notice.
  const makeTile = (work, decorative) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "hero-tile";
    if (decorative) {
      tile.setAttribute("aria-hidden", "true");
      tile.tabIndex = -1;
    } else {
      tile.setAttribute("aria-label", `${work.title} — view larger`);
    }
    const img = createImage(work, { sizes: SIZES, eager: true });
    if (decorative) img.alt = "";
    tile.append(img);
    tile.addEventListener("click", () => openPiece?.(works.indexOf(work)));
    return tile;
  };

  tracks.forEach((track, col) => {
    // second run is the seamless-loop copy
    track.append(...runs[col].map((w) => makeTile(w, false)), ...runs[col].map((w) => makeTile(w, true)));
  });
}
