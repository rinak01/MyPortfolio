"use client";

import React from "react";
import { newsreader, spaceMono } from "./tankType";

/* The card deck that used to spread inside the tank hero, moved down into
   Selected Projects and rebuilt for normal page flow. Absolute positioning
   and the scroll-driven stack are gone; the overlap, rotation and vertical
   stagger that gave the deck its look are kept as static layout.

   Scoped under .tkc-root, deliberately NOT .tk-root: the hero owns that
   scope, and names this generic would otherwise collide. */

export type TankCardView = {
  title: string;
  type: string;
  year: string;
  note: string;
  thumb: string;
  tint: string;
  /* Diagrams and dashboards are letterboxed rather than cropped — a 4:5
     centre crop of a flowchart is unreadable. */
  fit?: "cover" | "contain";
};

/* Final geometry from the hero's `layout` object, so the row reads the same:
   ~3% overlap, a little rotation, rows one and three sitting lower. */
const ROT = [-1.6, 0.9, -0.7, 1.3];
const RISE = [0, -18, 6, -14];

const CSS = `
.tkc-root { --bone:#E8E2D6; --foam:#9FE0DA;
  font-family:var(--tk-serif), Georgia, 'Times New Roman', serif; }
.tkc-root *, .tkc-root *::before, .tkc-root *::after { box-sizing:border-box; }

.tkc-mono { font-family:var(--tk-mono), ui-monospace, 'SFMono-Regular', Menlo, monospace;
  text-transform:uppercase; letter-spacing:0.2em; font-size:10px; font-weight:400;
  color:rgba(232,226,214,0.5); }

.tkc-row { display:flex; align-items:flex-start; }
.tkc-card { position:relative; flex:1 1 0; min-width:0; }
.tkc-card + .tkc-card { margin-left:-3%; }

.tkc-inner { background:rgba(8,16,24,0.62); backdrop-filter:blur(9px);
  -webkit-backdrop-filter:blur(9px); border:1px solid rgba(232,226,214,0.13);
  border-radius:2px; padding:9px 9px 12px;
  transition:transform .45s cubic-bezier(.2,.7,.3,1), border-color .45s; }
/* Hover lifts the card and pulls it clear of the two it overlaps. */
.tkc-card:hover, .tkc-card:focus-within { z-index:20; }
.tkc-card:hover .tkc-inner, .tkc-card:focus-within .tkc-inner {
  transform:translateY(-10px); border-color:rgba(232,226,214,0.4); }

.tkc-thumb { position:relative; width:100%; aspect-ratio:4/5; overflow:hidden;
  border-radius:1px; background:#0A1017; }
.tkc-thumb img { width:100%; height:100%; display:block; }
.tkc-thumb img.cover { object-fit:cover; }
.tkc-thumb img.contain { object-fit:contain; padding:10px; }
.tkc-veil { position:absolute; inset:0; pointer-events:none; }

.tkc-meta { display:flex; justify-content:space-between; align-items:baseline;
  gap:8px; margin-top:11px; }
.tkc-card h3 { margin:5px 0 0; font-weight:300; letter-spacing:-0.01em;
  line-height:1.15; font-size:1.35rem; color:var(--bone); }
/* One control per card, stretched over the whole card so the entire surface
   is the hit area while the accessible name stays the project title and
   there is still a single tab stop. */
.tkc-hit { display:inline; text-align:left; background:none; border:0; padding:0;
  font:inherit; color:inherit; cursor:pointer;
  transition:opacity .25s; }
.tkc-hit::after { content:''; position:absolute; inset:0; border-radius:2px; }
.tkc-hit:hover { opacity:0.72; }
.tkc-hit:focus-visible { outline:none; }
.tkc-card:has(.tkc-hit:focus-visible) { outline:2px solid var(--foam); outline-offset:6px;
  border-radius:2px; }
.tkc-note { margin:6px 0 0; font-weight:300; line-height:1.4; font-size:0.86rem;
  color:rgba(232,226,214,0.62); }

@media (max-width: 760px) {
  .tkc-row { flex-wrap:wrap; }
  .tkc-card { flex:0 0 50%; padding:0 5px 14px; }
  .tkc-card + .tkc-card { margin-left:0; }
  /* Overlap and rotation are a wide-row effect; in a 2x2 they just collide. */
  .tkc-card { transform:none !important; }
  /* No line clamp on the title here: these cards are in normal flow, so a
     third line grows the card instead of overflowing a fixed panel. */
  .tkc-card h3 { font-size:1.05rem; }
  .tkc-note { display:none; }
}
@media (prefers-reduced-motion: reduce) {
  .tkc-card { transform:none !important; }
  .tkc-inner { transition:none; }
}
`;

export function TankCardRow({ children }: { children: React.ReactNode }) {
  return (
    <div className={`tkc-root ${newsreader.variable} ${spaceMono.variable}`}>
      <style>{CSS}</style>
      <div className="tkc-row">{children}</div>
    </div>
  );
}

export function TankCard({
  view,
  index,
  id,
  onOpen,
  expanded,
}: {
  view: TankCardView;
  index: number;
  id?: string;
  onOpen: () => void;
  expanded?: boolean;
}) {
  return (
    <article
      id={id}
      // scroll-mt keeps a deep-linked card clear of the viewport edge.
      className="tkc-card scroll-mt-24"
      style={{
        zIndex: 10 + index,
        transform: `rotate(${ROT[index % 4]}deg) translateY(${RISE[index % 4]}px)`,
      }}
    >
      <div className="tkc-inner" style={{ boxShadow: `0 22px 60px -26px ${view.tint}66` }}>
        <div className="tkc-thumb">
          <img
            src={view.thumb}
            alt={`${view.title} — ${view.type}`}
            className={view.fit === "contain" ? "contain" : "cover"}
            loading="lazy"
            draggable={false}
          />
          <div
            className="tkc-veil"
            style={{ background: `linear-gradient(180deg, transparent 55%, ${view.tint}22)` }}
          />
        </div>
        <div className="tkc-meta">
          <span className="tkc-mono">{view.type}</span>
          <span className="tkc-mono">{view.year}</span>
        </div>
        <h3>
          <button
            type="button"
            className="tkc-hit"
            onClick={onOpen}
            aria-haspopup="dialog"
            aria-expanded={expanded}
          >
            {view.title}
          </button>
        </h3>
        <p className="tkc-note">{view.note}</p>
      </div>
    </article>
  );
}
