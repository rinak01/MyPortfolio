"use client";

import React, { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { newsreader, spaceMono } from "./tankType";

/* ------------------------------------------------------------------
   EDIT ME — everything below the fold is layout.
------------------------------------------------------------------- */

/* The four day-cycle plates already ship with the Luminous Jellyfish
   project, so the hero reads them in place rather than keeping a second
   copy under /tank. Card thumbnails come from the projects they link to. */
const BASE = "/images/prototypes/LuminousJellyfish";

const IMG = {
  bg_dawn: `${BASE}/reef_dawn.jpg`,
  bg_day: `${BASE}/reef_day.jpg`,
  bg_dusk: `${BASE}/reef_dusk.jpg`,
  bg_night: `${BASE}/reef_night.jpg`,
};

const NAME = "Rina Kim";
const RESUME = "/images/Resume_RinaKim.pdf";

type Phase = {
  key: string;
  label: string;
  src: string;
  minutes: number;
  surround: string;
  /* Colour of the dial's travelling mark at this phase: the sun warms
     through the day and reads as a cold moon once it is dark. */
  disc: string;
};

const PHASES: Phase[] = [
  { key: "dawn", label: "Dawn", src: IMG.bg_dawn, minutes: 314, surround: "#121C27", disc: "#F0B27A" },
  { key: "day", label: "Day", src: IMG.bg_day, minutes: 750, surround: "#0E1A24", disc: "#FFE9B0" },
  { key: "dusk", label: "Dusk", src: IMG.bg_dusk, minutes: 1142, surround: "#1A1109", disc: "#E9A23B" },
  { key: "night", label: "Night", src: IMG.bg_night, minutes: 1427, surround: "#04090F", disc: "#9FE0DA" },
];

/* The flat ground the tank fades to once night lands, matching the
   themeColor in app/layout.tsx so the hero and the page share one black. */
const NIGHT_GROUND = "#0C0C0C";

/* Intrinsic size of every day-cycle plate. */
const PLATE_W = 1600;
const PLATE_H = 900;

/* How much ground sits over the reef once the glass arrives. 0.72 leaves the
   night plate at roughly a quarter strength: the corals read as soft colour
   through the blur without competing with the text on the pane. */
const REEF_REST = 0.72;

/* ------------------------------------------------------------------ */

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = (t: number) =>
  clamp(t) < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const hexToRgb = (h: string): number[] =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(t)))).join(",")})`;
};

/* Dial geometry. Noon sits at the top and midnight at the bottom, so the
   mark rises up the left, crosses the top at midday and sets down the
   right — the path the sun actually takes. Midnight-at-top is the other
   24-hour convention, but it buries noon at the bottom of the dial. */
/* Quarter-day marks: noon at the top, then 18:00, midnight, 06:00. These
   used to sit at each phase's true time — 12:30, 19:02, 23:47, 05:14 — which
   is honest but lands every tick 7 to 16 degrees off the cardinal points and
   reads as a crooked dial rather than a precise one. The travelling mark
   still carries the real time; the ticks are just the frame it moves in. */
const DIAL_TICKS = [0, 90, 180, 270];
const DIAL_R = 22;
const DIAL_C = 2 * Math.PI * DIAL_R;
const dialAngle = (m: number) => ((m - 720) / 1440) * 360;
const polar = (deg: number, r: number): [number, number] => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [28 + r * Math.cos(rad), 28 + r * Math.sin(rad)];
};

const RM_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia(RM_QUERY).matches;

/* Interpolate the dial's travelling mark across the phase table, wrapping
   from night back round to dawn so a full revolution stays continuous. */
const discAt = (m: number) => {
  const wrapped = ((m % 1440) + 1440) % 1440;
  const stops = [
    ...PHASES.map((ph) => ({ m: ph.minutes, c: ph.disc })),
    { m: PHASES[0].minutes + 1440, c: PHASES[0].disc },
  ];
  const t = wrapped < stops[0].m ? wrapped + 1440 : wrapped;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.m && t <= b.m) return mixHex(a.c, b.c, (t - a.m) / (b.m - a.m));
  }
  return stops[0].c;
};

/* Which phase the dial is nearest, measured round the circle rather than
   along a line, so 01:00 reads as Night and not as Dawn-minus-a-lot. */
const phaseAt = (m: number) => {
  const wrapped = ((m % 1440) + 1440) % 1440;
  let best = PHASES[0];
  let bestD = Infinity;
  for (const ph of PHASES) {
    const raw = Math.abs(wrapped - ph.minutes);
    const d = Math.min(raw, 1440 - raw);
    if (d < bestD) {
      bestD = d;
      best = ph;
    }
  }
  return best.label;
};

const clockAt = (m: number) => {
  const t = Math.round(m) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

const CSS = `
.tk-root { --bone:#E8E2D6; --foam:#9FE0DA; --anem:#F58BA0;
  /* Ink floor is 0.72: on a translucent panel over variable artwork, thinner
     text dissolves wherever the reef brightens behind it. Hierarchy is
     carried by size, weight and tracking instead. */
  --ink-hi:rgba(246,243,238,0.96); --ink-mid:rgba(240,236,229,0.90);
  --ink-low:rgba(232,226,214,0.78);
  --type-display:clamp(2.25rem, 4.6vw, 3.5rem);
  --type-lede:clamp(1.25rem, 1.9vw, 1.5rem);
  --type-body:clamp(1.125rem, 1.7vw, 1.375rem);
  --type-sub:clamp(1.0625rem, 1.5vw, 1.1875rem);
  --type-label:0.75rem; --track-label:0.12em;
  background:${NIGHT_GROUND}; color:var(--bone); position:relative;
  font-family:var(--tk-serif), Georgia, 'Times New Roman', serif; }
.tk-root *, .tk-root *::before, .tk-root *::after { box-sizing:border-box; }

.tk-mono { font-family:var(--tk-mono), ui-monospace, 'SFMono-Regular', Menlo, monospace;
  text-transform:uppercase; letter-spacing:0.2em; font-size:10px; font-weight:400; }

.tk-scroller { position:relative; height:700vh; }
.tk-stage { position:sticky; top:0; height:100vh; overflow:hidden;
  display:flex; align-items:center; justify-content:center; }

.tk-panel { position:relative; overflow:hidden; }
/* True cover, no extra scale: the matte hides the plate edges, so the tank
   frame painted into each plate reads as a frame instead of stray verticals. */
/* One group per phase, cross-faded as a unit: the plate plus its mirrors. */
.tk-plate { position:absolute; inset:0; }
/* The plate itself, whole and unscaled — every painted wall stays in frame. */
.tk-plate img.tk-bg { position:absolute; display:block; }
/* Mirrored continuations. Blur only, deliberately no brightness or
   saturation change: any of those puts a step exactly at the seam, which is
   the one place the mirror exists to make continuous. All the darkening is
   the veil's job, and the veil starts fully transparent at the join. */
.tk-plate img.tk-edge { position:absolute; display:block; filter:blur(10px); }
.tk-veil { position:absolute; pointer-events:none; }
.tk-panel::after { content:''; position:absolute; inset:0; pointer-events:none;
  box-shadow:inset 0 0 90px 20px rgba(2,7,12,0.55); }

.tk-hero { position:absolute; left:0; right:0; top:50%; padding:0 7%;
  transform:translateY(-50%); text-align:center; isolation:isolate; }
/* Local scrim behind the title only. The plates run from lit surface water
   to open sand under this text and the type has to hold across all four, so
   it gets its own pool of shade rather than the whole tank being darkened
   to suit one block. Feathered to nothing well inside the frame so it never
   reads as a shape. */
.tk-hero::before { content:''; position:absolute; z-index:0; pointer-events:none;
  left:50%; top:50%; transform:translate(-50%,-50%);
  width:min(112%, 60rem); height:min(120%, 26rem);
  background:radial-gradient(closest-side,
    rgba(3,9,15,0.62) 0%, rgba(3,9,15,0.46) 46%,
    rgba(3,9,15,0.18) 76%, rgba(3,9,15,0) 100%); }
.tk-hero > * { position:relative; z-index:1; }
.tk-display { margin:0; font-weight:200; line-height:1.05; font-optical-sizing:auto;
  font-size:clamp(2.6rem, 8vw, 6.6rem); letter-spacing:-0.02em;
  color:#F4F1EA;
  text-shadow:0 2px 10px rgba(2,10,18,0.75), 0 8px 44px rgba(2,10,18,0.55); }
/* Same demotion as the card's: the name is the primary element. */
.tk-display em { display:block; font-style:italic; font-weight:300;
  font-size:0.64em; line-height:1.15; letter-spacing:-0.015em;
  color:rgba(240,236,229,0.82); margin-top:0.12em; }
/* The instruction belongs here, at dawn, where there is still a sun to move. */
.tk-sub { margin:26px auto 0; max-width:30ch; font-weight:300;
  font-size:clamp(0.95rem,1.5vw,1.15rem); line-height:1.5;
  color:rgba(240,236,229,0.88);
  text-shadow:0 1px 3px rgba(2,10,18,0.8), 0 0 10px rgba(2,10,18,0.5); }

/* ── Aquarium glass ───────────────────────────────────────────────────────
   Tank glass is CLEAR, so the blur stays small and saturation does the work.
   What actually sells thickness is the rim, and a flat 1px border does not:
   a real pane's edge is brightest where light enters it, at the top and down
   the two verticals, and it stays visible the whole way round. So the rim is
   a gradient ring (masked border), the cut face sits 4px in as its own ring,
   and the corners carry glints because that is where the glass is deepest.
   A web approximation, not Apple's Liquid Glass, which is a platform
   material with no public web package. */
.tk-glass-wrap { position:absolute; left:0; right:0; top:50%; padding:0 7%;
  transform:translateY(-50%); display:flex; justify-content:center; }

.tk-glass { position:relative; isolation:isolate;
  width:min(92vw, 920px); padding:clamp(2rem, 4vw, 3.5rem);
  border-radius:3px; transform-origin:50% 50%;
  /* Clear glass: barely any blur, but the reef behind reads more vivid and a
     touch brighter, the way water lenses colour toward you. */
  backdrop-filter:blur(var(--tk-glass-blur,7px)) saturate(175%) brightness(1.06);
  -webkit-backdrop-filter:blur(var(--tk-glass-blur,7px)) saturate(175%) brightness(1.06);
  background:
    /* Two specular bands, angled: strip lights reflecting off the pane. */
    linear-gradient(104deg,
      transparent 11%, rgba(255,255,255,0.055) 16%, rgba(255,255,255,0.018) 20%,
      transparent 25%, transparent 57%, rgba(255,255,255,0.038) 62%,
      rgba(255,255,255,0.012) 66%, transparent 71%),
    /* Reading scrim, set at the lightest value the small type can survive.
       Measured against the worst case, a lit coral directly behind: below
       about 0.56 no text alpha clears AA at all, so 0.60 is close to the
       floor. It leaves the reef at 40% rather than the 34% a safer scrim
       would, and the small type is carried at 0.90 to pay for it. */
    radial-gradient(140% 180% at 50% 50%,
      rgba(4,12,17,0.62) 0%,
      rgba(4,12,17,0.60) 70%,
      rgba(4,12,17,0.48) 92%,
      rgba(4,12,17,0.32) 100%),
    rgba(9,20,26,0.06);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.30),
    /* Light bouncing up off the substrate, not a plain shadow. */
    inset 0 -1px 0 rgba(159,224,218,0.16),
    inset 0 0 64px -20px rgba(159,224,218,0.55),
    0 40px 90px -34px rgba(2,12,18,0.95); }

/* Caustic wash from the surface, plus glints at the corners where the cut
   edge is deepest and gathers the most light. */
.tk-glass::before { content:''; position:absolute; inset:0; z-index:0;
  border-radius:inherit; pointer-events:none;
  background:
    radial-gradient(90px 64px at 0% 0%, rgba(196,240,236,0.15), transparent 62%),
    radial-gradient(90px 64px at 100% 0%, rgba(196,240,236,0.10), transparent 62%),
    radial-gradient(80px 56px at 0% 100%, rgba(159,224,218,0.08), transparent 62%),
    radial-gradient(80px 56px at 100% 100%, rgba(159,224,218,0.08), transparent 62%),
    radial-gradient(130% 70% at 22% -8%, rgba(196,240,236,0.12), transparent 52%); }

/* The rim. A masked gradient ring rather than a border, so the edge can be
   bright at the top and down the sides and never fully disappear. */
.tk-glass::after { content:''; position:absolute; inset:0; z-index:3;
  border-radius:inherit; padding:1px; pointer-events:none;
  background:linear-gradient(157deg,
    rgba(206,245,240,0.78) 0%,
    rgba(159,224,218,0.30) 20%,
    rgba(159,224,218,0.16) 48%,
    rgba(159,224,218,0.34) 76%,
    rgba(206,245,240,0.62) 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite:exclude; }

/* Refraction. Thick glass bends what is behind it, and it bends it most at
   the edges where the light crosses the most material — the middle of a pane
   is nearly true. So the displacement is masked to a frame: the reef visibly
   swims where the glass is thickest and stays honest in the centre.

   Its own layer, deliberately: backdrop-filter with a url() filter is well
   supported on the standard property but not on the -webkit- one, so a
   browser that refuses it drops this layer alone and the pane underneath is
   unchanged. */
.tk-glass-refract { position:absolute; inset:5px; z-index:0; pointer-events:none;
  border-radius:2px;
  backdrop-filter:url(#tk-refract);
  -webkit-mask-image:
    linear-gradient(to right, #000 0, transparent 17%, transparent 83%, #000 100%),
    linear-gradient(to bottom, #000 0, transparent 27%, transparent 73%, #000 100%);
  -webkit-mask-composite:source-over;
  mask-image:
    linear-gradient(to right, #000 0, transparent 17%, transparent 83%, #000 100%),
    linear-gradient(to bottom, #000 0, transparent 27%, transparent 73%, #000 100%);
  mask-composite:add; }
.tk-defs { position:absolute; width:0; height:0; overflow:hidden; }

/* The cut face of the pane. The gap between this and the rim is the depth
   the eye reads as thickness. */
.tk-glass-edge { position:absolute; inset:4px; z-index:2; pointer-events:none;
  border-radius:2px; border:1px solid rgba(159,224,218,0.13);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.06); }

.tk-glass > *:not(.tk-glass-edge):not(.tk-glass-refract) { position:relative; z-index:1; }

.tk-glass-grid { display:grid; grid-template-columns:minmax(0,0.78fr) minmax(0,1.22fr);
  gap:clamp(1.75rem,4vw,3.25rem); align-items:stretch; }
/* Stretched, so the rule between the columns runs their full height and the
   CTA can sit on the baseline of the taller column instead of leaving a hole
   under the name. */
.tk-glass-id { display:flex; flex-direction:column; justify-content:center; }

/* Stepped up from 10px/400. With "Portfolio" gone this is the only line
   saying what she does, so it carries real weight rather than sitting as a
   faint label. Size and weight do the work; the colour stays short of pure
   white so the name still leads. */
.tk-glass-eyebrow { margin:0 0 0.85rem; margin-left:-0.06em;
  font-size:var(--type-label); font-weight:700; letter-spacing:var(--track-label);
  color:var(--ink-mid);
  text-shadow:0 1px 2px rgba(2,10,16,0.9), 0 0 8px rgba(2,10,16,0.6); }

/* Tight leading and negative tracking: the name is the largest type here and
   large text reads too loose at default spacing. */
.tk-glass-name { margin:0; text-shadow:0 2px 12px rgba(2,10,16,0.5); font-weight:200;
  letter-spacing:-0.02em; line-height:1.05; font-optical-sizing:auto;
  font-size:var(--type-display); color:var(--ink-hi); }
/* No subtitle on the card any more: the name stands alone and the role
   above it does the qualifying. */

/* Ranks second only to the name. It was the same size as a CV value and
   dimmer than one, so a credential was outranking the positioning line. */
.tk-glass-line { margin:1.25rem 0 0; max-width:40ch; font-weight:400;
  font-size:var(--type-lede); line-height:1.4; letter-spacing:0;
  font-optical-sizing:auto; color:var(--ink-hi);
  text-shadow:0 1px 3px rgba(2,10,16,0.8); }

.tk-resume { margin-top:1.9rem; display:inline-flex;
  text-transform:none; letter-spacing:0.02em; font-size:1rem; align-items:center; justify-content:center;
  min-height:3rem; padding:0.85rem 1.9rem; align-self:flex-start; border-radius:3px; text-decoration:none;
  border:1px solid rgba(159,224,218,0.55); color:var(--bone);
  background:rgba(6,16,22,0.55);
  transition:background .3s, color .3s, border-color .3s; }
.tk-resume:hover { background:var(--foam); color:#04090F; border-color:var(--foam); }
/* Fires on pointer-down: waiting for click release reads as dead. */
.tk-resume:active { transform:scale(0.97); transition:transform 100ms ease-out; }
.tk-resume:focus-visible { outline:2px solid var(--foam); outline-offset:4px; }
/* A 44px target without inflating the visible control. */
.tk-resume::after { content:''; position:absolute; inset:-4px -6px; min-height:44px; }
.tk-resume { position:relative; }
@media (prefers-reduced-motion: reduce) {
  .tk-resume { transition:none; }
  .tk-resume:active { transform:none; }
}

.tk-glass-detail { border-left:1px solid rgba(232,226,214,0.12);
  padding-left:clamp(1.5rem,3vw,2.5rem); }

/* Vibrancy: text over a translucent surface needs more contrast and a touch
   more weight than the same text on a solid ground, or the reef behind it
   eats the strokes. */
/* Labels left, values right. No rule per row and no bullet glyphs: three
   rows do not need ruling, and the label already does the job a bullet
   would. Vibrancy applies to the values, which sit over moving reef. */
.tk-glass-facts { margin:0; display:grid; gap:2.5rem; }
.tk-nb { white-space:nowrap; }
.tk-glass-facts > div { display:grid;
  grid-template-columns:clamp(6rem, 9vw, 7.5rem) minmax(0,1fr);
  gap:1.5rem; align-items:baseline; }
.tk-glass-facts dt { margin:0 0 0 -0.06em; font-size:var(--type-label);
  letter-spacing:var(--track-label); line-height:1.2;
  font-weight:700; color:var(--ink-low);
  text-shadow:0 1px 2px rgba(2,10,16,0.85), 0 0 7px rgba(2,10,16,0.55); }
.tk-glass-facts dd { margin:0; font-weight:400; letter-spacing:0; font-optical-sizing:auto;
  font-size:var(--type-body); line-height:1.5; text-wrap:balance;
  color:var(--ink-mid);
  text-shadow:0 1px 3px rgba(2,10,16,0.85), 0 0 9px rgba(2,10,16,0.5); }
/* Italic at its parent's ink rather than a dimmer roman: under the 0.72
   floor there is not enough transparency left to separate them. */
.tk-glass-facts .tk-fact-sub { display:block; margin-top:0.25rem; font-style:italic;
  font-size:var(--type-sub); line-height:1.5; font-weight:400;
  color:var(--ink-low);
  text-shadow:0 1px 3px rgba(2,10,16,0.85), 0 0 8px rgba(2,10,16,0.5); }

@media (max-width: 760px) {
  .tk-glass { padding:1.4rem; }
  .tk-glass-grid { grid-template-columns:1fr; gap:1.4rem; }
  .tk-glass-name { font-size:1.85rem; }
  .tk-resume { margin-top:1.2rem; }
  /* Stacked, a left rule would point at nothing, so it becomes a top rule. */
  .tk-glass-detail { border-left:0; border-top:1px solid rgba(232,226,214,0.12);
    padding-left:0; padding-top:1.3rem; }
  .tk-glass-facts { gap:1.7rem; }
  .tk-glass-facts > div { grid-template-columns:1fr; gap:0.3rem; }

}
/* Frostier and near-solid when the viewer has asked for less transparency. */
@media (prefers-reduced-transparency: reduce) {
  .tk-glass-refract { display:none; }
  .tk-glass { background:rgba(9,15,21,0.96);
    backdrop-filter:none; -webkit-backdrop-filter:none; }
}

.tk-hint { position:absolute; left:50%; bottom:26px; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:10px;
  color:rgba(232,226,214,0.6); }
.tk-hint span { display:block; width:1px; height:34px;
  background:linear-gradient(rgba(232,226,214,0.55), rgba(232,226,214,0)); }

/* A 24-hour dial, in place of the digits and the vertical rail both.
   A real analog face is wrong here: minutes runs 314 to 1427 across the
   cycle, so a minute hand would turn ~18 times and strobe. Mapped to 24
   hours it is a single 0.77-turn sweep, smooth at any scroll speed. The
   travelling mark is the sun, which is what the dawn copy promises.

   It used to sit in the surround beside the vitrine, back when that surround
   was 130px wide. The matte is 40px now and cannot hold a 56px instrument,
   so the dial moved inside the panel: 64px from the viewport edge puts it
   24px in from the frame, and it carries its own scrim below because the
   reef behind it is lit. */
.tk-gauge { position:absolute; right:64px; top:50%; transform:translateY(-50%);
  display:flex; flex-direction:column; align-items:center; gap:12px;
  isolation:isolate; }
/* Glass, not blur. backdrop-filter redistributes background detail but
   leaves average luminance alone, so it cannot buy contrast — over the
   tank's light streak it just smears the streak. The tint is the contrast
   lever; the gradient falling to zero is what makes it read as a material
   instead of a sticker; the bright top edge is the glass. Capsule-shaped so
   the ring and the label sit on one surface rather than the label floating
   on bare artwork. No backdrop-filter at all: this control sits over an
   animating background and a per-frame repaint here shimmers at the edges. */
/* Sized as a square and centred, so border-radius gives a true circle. It
   was inset per-edge off a taller-than-wide flex column, which made an oval:
   108 x 123. 132 clears the ring and still contains the label at its widest. */
.tk-gauge::before { content:''; position:absolute; z-index:0;
  left:50%; top:50%; width:132px; height:132px;
  transform:translate(-50%,-50%);
  pointer-events:none; border-radius:50%;
  background:radial-gradient(closest-side,
    rgba(8,14,26,0.82) 0%,
    rgba(8,14,26,0.72) 58%,
    rgba(8,14,26,0.38) 84%,
    rgba(8,14,26,0) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.20),
    inset 0 -1px 0 rgba(255,255,255,0.04),
    0 10px 28px rgba(0,0,0,0.30); }

@media (prefers-reduced-transparency: reduce) {
  .tk-gauge::before { background:rgb(8,14,26); }
}
@media (prefers-contrast: more) {
  .tk-gauge::before { background:rgb(8,14,26);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,0.5); }
}
.tk-gauge > * { position:relative; z-index:1; }
.tk-dial { width:56px; height:56px; overflow:visible; }
.tk-dial-ring { fill:none; stroke:rgba(232,226,214,0.50); stroke-width:1.25; }
.tk-dial-tick { stroke:rgba(232,226,214,0.68); stroke-width:1.25; stroke-linecap:round; }
/* Elapsed arc: how far through the day the scroll has carried you. */
.tk-dial-arc { fill:none; stroke:rgba(244,241,235,0.9); stroke-width:1.75;
  stroke-linecap:round; }
.tk-dial-label { display:grid; color:rgba(240,236,229,0.92); font-weight:700; letter-spacing:0.24em;
  /* Tracking adds a full advance after the final glyph, so a geometrically
     centred label reads left of centre. Measured offset was 1.79px at 10px;
     this pushes the glyphs back over the ring's axis. */
  text-indent:0.18em; }
.tk-dial-label > span { grid-area:1/1; justify-self:center;
  text-shadow:0 1px 3px rgba(2,10,16,0.9), 0 0 9px rgba(2,10,16,0.7); }

@media (max-width: 900px) {
  .tk-gauge { display:none; }
}
`;

export default function TankHero() {
  const [p, setP] = useState(0);
  const [vp, setVp] = useState({ w: 1200, h: 800 });
  // Subscribed rather than set from inside the effect: setState in an effect
  // body trips react-hooks/set-state-in-effect, and this reads cleaner anyway.
  // The third argument is the server snapshot — no media queries during SSR.
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const raf = useRef(0);
  // The original read() divided by the whole document's scroll height, which
  // only works when this component IS the page. Mounted above the portfolio
  // it stretched the day cycle across the entire site, so progress is now
  // measured against the scroller's own box.
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const measure = () => setVp({ w: window.innerWidth, h: window.innerHeight });

    const read = () => {
      const el = scroller.current;
      if (el) {
        const span = el.offsetHeight - window.innerHeight;
        setP(span > 0 ? clamp(-el.getBoundingClientRect().top / span) : 0);
      }
      raf.current = 0;
    };
    const onScroll = () => {
      if (!raf.current) raf.current = window.requestAnimationFrame(read);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  /* The panel is the viewport: no matte, no black. Fitting the whole plate
     inside it is what keeps the aquarium's border visible — the tank's
     vertical walls are painted at x=1.8% and x=97.7% of the plate, so a
     cover crop wide enough to fill a 16:10 window (80px a side at 1440x900)
     removes both. The plate is therefore CONTAINed, and the strip that
     would otherwise be black is filled by a blurred, scaled copy of the
     same frame. On an exactly-16:9 window the two coincide and the fill is
     never seen. */
  const panelW = vp.w;
  const panelH = vp.h;

  /* Where the contained plate actually paints, and how much is left over.
     Only one axis ever has leftover: whichever the window is longer in. */
  const plateScale = Math.min(panelW / PLATE_W, panelH / PLATE_H);
  const drawW = PLATE_W * plateScale;
  const drawH = PLATE_H * plateScale;
  const padX = (panelW - drawW) / 2;
  const padY = (panelH - drawH) / 2;

  /* time-of-day scrub — the cycle now completes at 0.40 rather than 0.60,
     because the back half of the scroller carries the flatten and then the
     intro, which is now where the hero ends. */
  const tp = clamp(p / 0.6);
  const pos = tp * (PHASES.length - 1);
  const i0 = Math.min(Math.floor(pos), PHASES.length - 2);
  const f = easeInOut(pos - i0);
  const surround = mixHex(PHASES[i0].surround, PHASES[i0 + 1].surround, f);

  /* The dial keeps its own clock. The plates finish their cross-fade at
     night (p 0.6), but the dial carries on through the small hours and
     closes a full 360 exactly as the glass card finishes arriving at 0.84 —
     so the circle completes on the same beat as the card, and the mark comes
     back round to the dawn position it started from. */
  const dialP = clamp(p / 0.84);
  const dialMinutes = PHASES[0].minutes + dialP * 1440;
  const dawnAngle = dialAngle(PHASES[0].minutes);
  const sunAngle = dialAngle(dialMinutes);
  const sweep = dialP * 360;
  const [sunX, sunY] = polar(sunAngle, DIAL_R);
  const sunColor = discAt(dialMinutes);
  const dialPhase = phaseAt(dialMinutes);
  /* Held at full strength throughout. Fading it out with the tank would have
     hidden the last quarter of its own sweep, and it has something to say
     once the circle closes. */
  const dialOn = 1;
  /* Once the day has come all the way round and the card is up, the readout
     stops reporting a phase and says hello instead. Cross-faded rather than
     swapped so the two never both read at once. */
  const greet = easeOut((p - 0.8) / 0.06);

  /* Three overlapping timelines, all pure functions of p:
       0.05→0.18  the tank's own opener clears
       0.58→0.74  the ground eases over the reef, down to REEF_REST
       0.70→0.84  the glass pane materialises over it, and holds to the end

     The separate flat-black identity beat is gone: its content lives on the
     pane now, so keeping it would have staged an empty black screen. */
  const heroOut = easeOut((p - 0.05) / 0.13);
  const flat = easeInOut(clamp((p - 0.58) / 0.16)) * REEF_REST;
  const glassOn = easeOut((p - 0.7) / 0.14);
  const blur = reduced ? 0 : (flat / REEF_REST) * 4;

  return (
    <div className={`tk-root ${newsreader.variable} ${spaceMono.variable}`}>
      <style>{CSS}</style>

      {/* Displacement map for the glass edge. Soft fractal noise rather than a
          regular ripple: water does not repeat. Declared once, referenced by
          the refraction layer's backdrop-filter. */}
      <svg className="tk-defs" aria-hidden="true" focusable="false">
        <filter
          id="tk-refract"
          x="-12%"
          y="-12%"
          width="124%"
          height="124%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.016" numOctaves={2} seed={11} result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.2" result="soft" />
          <feDisplacementMap in="SourceGraphic" in2="soft" scale={12} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div
        ref={scroller}
        className="tk-scroller"
        style={{ background: mixHex(surround, NIGHT_GROUND, flat) }}
      >
        <div className="tk-stage">
          <div className="tk-panel" style={{ width: `${panelW}px`, height: `${panelH}px` }}>
            {PHASES.map((ph, i) => {
              const o = i === i0 ? 1 - f : i === i0 + 1 ? f : 0;
              const box = { top: padY, width: drawW, height: drawH } as const;
              return (
                <div
                  key={ph.key}
                  className="tk-plate"
                  style={{ opacity: o, filter: `blur(${blur}px)` }}
                >
                  {/* Edge extension. A blurred cover-crop can never line up
                      with the plate's own edge, so the seam always stepped.
                      A mirrored copy shares the seam pixel exactly, which
                      makes the join invisible; the veil below then carries it
                      off into the dark. */}
                  {padX > 1 && (
                    <>
                      <img className="tk-edge" src={ph.src} alt="" aria-hidden="true"
                        draggable={false}
                        style={{ ...box, left: padX - drawW, transform: "scaleX(-1)" }} />
                      <img className="tk-edge" src={ph.src} alt="" aria-hidden="true"
                        draggable={false}
                        style={{ ...box, left: padX + drawW, transform: "scaleX(-1)" }} />
                    </>
                  )}
                  {padY > 1 && (
                    <>
                      <img className="tk-edge" src={ph.src} alt="" aria-hidden="true"
                        draggable={false}
                        style={{ left: padX, width: drawW, height: drawH, top: padY - drawH, transform: "scaleY(-1)" }} />
                      <img className="tk-edge" src={ph.src} alt="" aria-hidden="true"
                        draggable={false}
                        style={{ left: padX, width: drawW, height: drawH, top: padY + drawH, transform: "scaleY(-1)" }} />
                    </>
                  )}
                  <img
                    className="tk-bg"
                    src={ph.src}
                    alt={i === 0 ? "A reef tank lit from above, drawn in soft gouache." : ""}
                    aria-hidden={i !== 0}
                    draggable={false}
                    style={{ ...box, left: padX }}
                  />
                </div>
              );
            })}

            {/* Falloff over the mirrored strips. Transparent at the seam so
                the join stays invisible, deepening to the page ground at the
                viewport edge. */}
            {padX > 1 && (
              <>
                <div className="tk-veil" style={{ left: 0, width: padX, top: 0, bottom: 0,
                  background: `linear-gradient(to left, rgba(12,12,12,0) 0%, rgba(12,12,12,0.72) 62%, ${NIGHT_GROUND} 100%)` }} />
                <div className="tk-veil" style={{ right: 0, width: padX, top: 0, bottom: 0,
                  background: `linear-gradient(to right, rgba(12,12,12,0) 0%, rgba(12,12,12,0.72) 62%, ${NIGHT_GROUND} 100%)` }} />
              </>
            )}
            {padY > 1 && (
              <>
                <div className="tk-veil" style={{ top: 0, height: padY, left: 0, right: 0,
                  background: `linear-gradient(to top, rgba(12,12,12,0) 0%, rgba(12,12,12,0.72) 62%, ${NIGHT_GROUND} 100%)` }} />
                <div className="tk-veil" style={{ bottom: 0, height: padY, left: 0, right: 0,
                  background: `linear-gradient(to bottom, rgba(12,12,12,0) 0%, rgba(12,12,12,0.72) 62%, ${NIGHT_GROUND} 100%)` }} />
              </>
            )}

            {/* Night going out. The corals are painted into reef_night.jpg,
                so there is no layer to switch off — the plate fades to the
                site's own ground and takes them with it. */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: NIGHT_GROUND,
                opacity: flat,
                pointerEvents: "none",
              }}
            />

            {/* the tank's opener */}
            <div
              className="tk-hero"
              style={{
                opacity: 1 - heroOut,
                transform: `translateY(calc(-50% - ${heroOut * 26}px))`,
                pointerEvents: heroOut > 0.6 ? "none" : "auto",
              }}
            >
              {/* The opener is the title alone. NAME rather than a literal so
                  the h1 and the intro further down cannot drift apart. The
                  italic accent on the second line is what "the tank" had. */}
              <h1 className="tk-display">
                {NAME}
                <br />
                <em>Portfolio</em>
              </h1>
              <p className="tk-sub">Scroll to move the sun.</p>
            </div>

            {/* One glass pane carrying the whole identity. It materialises
                rather than fades: blur radius and scale animate together, so
                it reads as a real surface arriving in front of the reef. The
                reef behind it is what it refracts. */}
            <div
              className="tk-glass-wrap"
              style={{
                opacity: glassOn,
                pointerEvents: glassOn > 0.6 ? "auto" : "none",
              }}
              aria-hidden={glassOn <= 0.6}
            >
              <div
                className="tk-glass"
                style={
                  {
                    "--tk-glass-blur": `${(reduced ? 1 : glassOn) * 7}px`,
                    transform: reduced ? undefined : `scale(${lerp(0.97, 1, glassOn)})`,
                  } as React.CSSProperties
                }
              >
                <span className="tk-glass-refract" aria-hidden="true" />
                <span className="tk-glass-edge" aria-hidden="true" />

                <div className="tk-glass-grid">
                  <div className="tk-glass-id">
                    <p className="tk-mono tk-glass-eyebrow">Product Designer</p>
                    <h2 className="tk-glass-name">{NAME}</h2>
                    {/* Nested under FOCUS this read as a caption qualifying the
                        focus areas. It is a statement about the person, so it
                        sits with the name at body size. */}
                    <p className="tk-glass-line">Bridging research and production.</p>
                    <a className="tk-mono tk-resume" href={RESUME} target="_blank" rel="noopener noreferrer">
                      View résumé
                    </a>
                  </div>

                  <div className="tk-glass-detail">
                    {/* Three facts, so they get labels rather than bullets: a
                        reader scanning for "where did she work" should find it
                        by its label, not by parsing a sentence. A description
                        list is literally what this is, so dl/dt/dd. The old
                        role line is gone — it listed the same disciplines the
                        Focus row now carries. */}
                    <dl className="tk-glass-facts">
                      <div>
                        <dt className="tk-mono">Education</dt>
                        <dd>
                          Master of <span className="tk-nb">Human-Computer</span> Interaction
                          <span className="tk-fact-sub">Carnegie Mellon University</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="tk-mono">Previously</dt>
                        <dd>BMW Group Technology Office</dd>
                      </div>
                      <div>
                        <dt className="tk-mono">Focus</dt>
                        <dd>Automotive HMI, Interface Design, Rapid Prototyping</dd>
                      </div>
                    </dl>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Light gauge — reads the day cycle, so it retires with it. The
              dial replaces the digital readout and the rail together: one
              instrument showing position in the day rather than two elements
              reporting the same value. Ticks sit at each phase's true time,
              not at even quarters, so the spacing is honest. */}
          <div className="tk-gauge" style={{ opacity: dialOn * 0.9 }}>
            <svg
              className="tk-dial"
              viewBox="0 0 56 56"
              role="img"
              // The time is no longer on screen, so it lives here instead of
              // being lost for anyone not reading the dial visually.
              aria-label={`${clockAt(dialMinutes)}, ${dialPhase}`}
            >
              <circle className="tk-dial-ring" cx="28" cy="28" r="22" />
              {DIAL_TICKS.map((deg) => {
                const [x1, y1] = polar(deg, 19);
                const [x2, y2] = polar(deg, 22);
                return <line key={deg} className="tk-dial-tick" x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
              <circle
                className="tk-dial-arc"
                cx="28"
                cy="28"
                r="22"
                strokeDasharray={`${(sweep / 360) * DIAL_C} ${DIAL_C}`}
                transform={`rotate(${dawnAngle - 90} 28 28)`}
              />
              <circle cx={sunX} cy={sunY} r="3.4" fill={sunColor}>
              </circle>
              <circle cx={sunX} cy={sunY} r="6.5" fill={sunColor} opacity="0.22" />
            </svg>
            <span className="tk-mono tk-dial-label">
              <span style={{ opacity: 1 - greet }} aria-hidden={greet > 0.5}>
                {dialPhase}
              </span>
              <span style={{ opacity: greet }} aria-hidden={greet <= 0.5}>
                Hello!
              </span>
            </span>
          </div>

          {/* scroll hint */}
          <div className="tk-hint" style={{ opacity: (1 - heroOut) * 0.9 }} aria-hidden="true">
            <span />
          </div>
        </div>
      </div>

    </div>
  );
}
