"use client";

import React from "react";
import { newsreader, spaceMono } from "./tankType";

/* The card deck that used to spread inside the tank hero, moved down into
   Selected Projects and rebuilt for normal page flow. Absolute positioning,
   the overlap and the scroll-driven stack are gone: the four cards sit in a
   gapped grid, every one of them fully readable without hovering or
   scrolling anything. The deck's tilt survives — a couple of degrees of
   static rotation per card — because the grid's real gaps swallow the few
   px a tilt that small shifts a corner by, so nothing needs to overlap for
   the tilt to be safe.

   Scoped under .tkc-root, deliberately NOT .tk-root: the hero owns that
   scope, and names this generic would otherwise collide. */

// Same values the old overlapping deck used. Kept small on purpose: this is
// the amount of tilt the grid's gap (16-20px) can absorb without a rotated
// corner crossing into the neighbouring column.
const ROT = [-1.6, 0.9, -0.7, 1.3];

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
  /* Where a cover crop is anchored, e.g. "left center". Defaults to centre. */
  pos?: string;
};

const CSS = `
.tkc-root { --bone:#E8E2D6; --foam:#9FE0DA;
  font-family:var(--tk-serif), Georgia, 'Times New Roman', serif; }
.tkc-root *, .tkc-root *::before, .tkc-root *::after { box-sizing:border-box; }

.tkc-mono { font-family:var(--tk-mono), ui-monospace, 'SFMono-Regular', Menlo, monospace;
  text-transform:uppercase; letter-spacing:0.2em; font-size:10px; font-weight:400;
  color:rgba(232,226,214,0.5); }

/* Four equal columns with real gaps — no overlap, no rotation, no stagger,
   so nothing covers a neighbour and no card needs to be raised to be read.
   align-items:start lets each card keep its own natural height. */
.tkc-row { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr));
  gap:20px; align-items:start; }
.tkc-card { position:relative; min-width:0; z-index:1; }
/* Raise the hovered/focused card above every neighbour it might be
   overlapped by — not just the one next to it in DOM order — so the thumb
   bleed below never traps a card underneath. */
.tkc-card:hover, .tkc-card:focus-within { z-index:30; }

.tkc-inner { background:rgba(8,16,24,0.62); backdrop-filter:blur(9px);
  -webkit-backdrop-filter:blur(9px); border:1px solid rgba(232,226,214,0.13);
  border-radius:2px; padding:9px 9px 12px;
  transition:transform .35s cubic-bezier(.2,.7,.3,1), border-color .45s; }
/* Hover lifts the card straight up, independent of the tilt: the rotation
   lives on .tkc-card (the parent), the lift on .tkc-inner (the child), so
   they compose instead of one replacing the other. Nothing to reorder or
   pull clear of any more — the grid already keeps every card separate. */
.tkc-card:hover .tkc-inner, .tkc-card:focus-within .tkc-inner {
  transform:translateY(-6px); border-color:rgba(232,226,214,0.4); }

.tkc-thumb { position:relative; width:100%; aspect-ratio:4/5; border-radius:1px; background:#0A1017; }
.tkc-thumb-fill { position:absolute; inset:0;
  overflow:hidden; border-radius:2px; background:#0A1017;
  border:1px solid rgba(232,226,214,0.13); }
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

/* Fewer columns as the row runs out of width. The note stays visible at
   every size — a card that hides its description is a collapsed card. */
@media (max-width: 1024px) {
  .tkc-row { grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; }
}
@media (max-width: 560px) {
  .tkc-row { grid-template-columns:minmax(0, 1fr); gap:16px; }
}
@media (max-width: 760px) {
  .tkc-card h3 { font-size:1.05rem; }
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
  id,
  index = 0,
  onOpen,
  expanded,
}: {
  view: TankCardView;
  id?: string;
  index?: number;
  onOpen: () => void;
  expanded?: boolean;
}) {
  return (
    <article
      id={id}
      // scroll-mt keeps a deep-linked card clear of the viewport edge.
      className="tkc-card scroll-mt-24"
      style={{ transform: `rotate(${ROT[index % ROT.length]}deg)` }}
    >
      <div className="tkc-inner" style={{ boxShadow: `0 22px 60px -26px ${view.tint}66` }}>
        <div className="tkc-thumb">
          <div className="tkc-thumb-fill">
            <img
              src={view.thumb}
              alt={`${view.title} — ${view.type}`}
              className={view.fit === "contain" ? "contain" : "cover"}
              style={view.pos ? { objectPosition: view.pos } : undefined}
              loading="lazy"
              draggable={false}
            />
            <div
              className="tkc-veil"
              style={{ background: `linear-gradient(180deg, transparent 55%, ${view.tint}22)` }}
            />
          </div>
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
