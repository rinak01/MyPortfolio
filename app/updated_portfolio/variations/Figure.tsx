"use client";

import type { CSSProperties, ReactNode } from "react";

/* ─── Figure ───────────────────────────────────────────────────────────────
   One frame for every screenshot, diagram and clip in a case study.

   Before this there were four: BMW framed its shots in `bg-raised rounded-sm`
   with no border and no caption, Surefront in `rounded-sm border
   border-accent/15 bg-raised` with a caption — except two figures that said
   `border-line` instead — and the archive modal in raw `bg-black` with no
   radius at all. Captions had drifted the same way: two different rules
   (`bg-accent/45 mb-2` and `bg-accent/50 mb-2.5`), two different body tokens,
   and three different paddings. Same kind of artifact, four different
   components, which is what made the page read as assembled rather than
   designed.

   Surefront's is the one that won, because it is the one that was reasoned
   about: a hairline in the accent at low alpha, the small radius, and the
   raised surface, so a light screenshot sits on something instead of floating
   on the ground.

   Deliberately NOT covered: the SmaSH study's charts. Those live on the
   `--dgm-plate` material with their own token set (`--dgm-on-plate*`), which
   is a designed light-diagram context, not drift. Flattening them into this
   frame would break a system that is already internally consistent.
   ────────────────────────────────────────────────────────────────────────── */

export function Figure({
  children,
  caption,
  className,
  ratio,
  inset,
  bleed,
  light,
  wellClassName,
  wellStyle,
}: {
  /* The media: a ZoomableImage, a <video>, plus any overlay the figure owns
     (the line-planning shot hangs numbered pins in here). The well is always
     `relative`, so an absolutely positioned child measures against it. */
  children: ReactNode;
  caption?: ReactNode;
  /* On the <figure> itself — where a max-width cap belongs, since capping the
     figure keeps the caption the same measure as the picture. */
  className?: string;
  /* Aspect class for wells that crop to a fixed shape rather than flowing at
     the image's own ratio. */
  ratio?: string;
  /* Line art needs air between the drawing and the frame; a screenshot does
     not — it already has its own margins. */
  inset?: "sm" | "md";
  /* No border, no radius: the archive modal's hero runs edge to edge in its
     column, and a card border around a full-bleed shot fights that. */
  bleed?: boolean;
  /* A white plate, for art whose own ground is light. Use it with `inset`:
     inset light art in a dark well reads as a lit slab floating in a black
     box, because the padding shows the well through. Screenshots do not need
     it — a screenshot fills its frame edge to edge and is its own plate. */
  light?: boolean;
  wellClassName?: string;
  /* For a well whose shape is data, not a class — the archive's demo iframes
     carry their own height or aspect ratio per project. */
  wellStyle?: CSSProperties;
}) {
  // The hairline exists to separate a dark surface from a dark ground. A white
  // plate on that ground is already its own edge, so it gets no border rather
  // than one that computes to invisible.
  const surface = bleed
    ? "bg-sunken"
    : light
      ? "rounded-sm bg-white/[0.96]"
      : "rounded-sm border border-accent/15 bg-raised";

  // Inset pads; it does not centre. Centring was there for a raster diagram
  // that sat in the middle of a fixed-ratio well. The diagrams are drawn in
  // JSX now and start at the top of the well, so a pair of them side by side
  // line their first rows up instead of each floating at its own height.
  const padding = inset === "sm" ? "p-3" : inset === "md" ? "p-4 md:p-6" : "";

  return (
    <figure className={`${bleed ? "flex flex-col" : "space-y-2"} ${className ?? ""}`}>
      <div
        className={`relative w-full overflow-hidden ${surface} ${ratio ?? ""} ${padding} ${wellClassName ?? ""}`}
        style={wellStyle}
      >
        {children}
      </div>
      {caption && (
        <figcaption
          className={`text-sm text-meta leading-relaxed ${bleed ? "px-5 md:px-7 pt-3 pb-4" : ""}`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
