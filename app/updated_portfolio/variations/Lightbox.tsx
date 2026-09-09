"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Overlay } from "./Overlay";
import { dimsOf } from "./imageDims";

/* ─── Click-to-zoom lightbox ───────────────────────────────────────────────
   One component pair, wired in at the image layer rather than per page.

   `LightboxGroup` marks a set of images that belong to one project: the
   arrow keys step within a group and never leave it, so a case study's
   figures are its slides and an archive project's gallery is its own.

   `ZoomableImage` is a drop-in for the `<Image>` calls inside those groups.
   It renders the same next/image with the same classes, wrapped in a real
   button, and registers itself with the group, so the set and its order come
   from what is actually on screen rather than a hand-kept list.

   The expand is framer-motion's `layoutId`: thumbnail and enlarged image
   share one id, so the enlarged one grows out of the thumbnail's box and
   returns into it — from wherever it is when you interrupt it, since layout
   projection animates from the current frame, not from the target. Reduced
   motion is handled by the page's <MotionConfig reducedMotion="user">, which
   drops the layout animation and leaves the opacity crossfade behind it: no
   scaling, no travel.

   `LightboxGroup`'s `compact` prop swaps in a floating panel — capped at
   80vw/80vh and never scaled past the source's own pixels — instead of the
   default near-fullscreen view. The Selected Projects case studies use it: a
   figure meant to be read at a glance shouldn't demand the whole viewport to
   look closer at it, and dimmed page around all four sides is what makes it
   read as something on top of the page rather than a different screen.
   ────────────────────────────────────────────────────────────────────────── */

const MotionImage = motion.create(Image);

/* Spring, no bounce, ~0.4s — the same one the archive tile already morphs
   with, so an image expanding reads as the same motion as a tile opening. */
const EXPAND = { layout: { type: "spring" as const, bounce: 0, duration: 0.4 } };

/* Hover affordance. Quiet on purpose: these sit in dense case-study sections,
   and a permanent icon on every figure would be louder than the figures. */
const ZOOMABLE_CSS = `
.zoomable img { transition: transform 150ms ease-out, filter 150ms ease-out; }
.zoomable:hover img, .zoomable:focus-visible img { transform: scale(1.01); filter: brightness(1.08); }
.zoomable-block { transition: filter 150ms ease-out; }
.zoomable-block:hover, .zoomable-block:focus-visible { filter: brightness(1.12); }
@media (prefers-reduced-motion: reduce) {
  .zoomable img { transition: none; }
  .zoomable:hover img, .zoomable:focus-visible img { transform: none; }
  .zoomable-block { transition: none; }
}
`;

type BaseEntry = {
  id: string;
  node: HTMLElement | null;
  /* The accessible name: an image's alt, a diagram's label. */
  label: string;
};

type ImageEntry = BaseEntry & {
  kind: "image";
  src: string;
  layoutId: string;
  /* Intrinsic pixels. The enlarged view never exceeds them — several sources
     here already render at close to 1:1, and going past that buys blur. */
  w: number;
  h: number;
};

/* A diagram drawn in JSX rather than exported as a picture. It has no
   intrinsic pixel size to enlarge toward, so it is scaled by a transform off
   the box it occupies on the page, and re-rendered rather than re-fetched —
   which is also why it stays sharp at any scale. */
type BlockEntry = BaseEntry & {
  kind: "block";
  /* Read at click time, not at registration: children change identity every
     render, and holding them in the entry would re-register constantly. */
  getContent: () => ReactNode;
};

type Entry = ImageEntry | BlockEntry;

type Ctx = {
  register: (e: Entry) => () => void;
  open: (id: string) => void;
};

const LightboxCtx = createContext<Ctx | null>(null);

export function LightboxGroup({
  children,
  compact,
}: {
  children: React.ReactNode;
  /* Swaps the near-fullscreen view for a floating panel that always leaves
     dimmed page visible around it. Set once per group, not per image — a
     study either reads at a glance or it doesn't. */
  compact?: boolean;
}) {
  const entries = useRef(new Map<string, Entry>());
  // The set is resolved when the lightbox opens, not while rendering: order
  // and visibility are facts about the DOM, and reading them at click time
  // costs one pass and cannot go stale. originRect rides along for the JSX
  // diagrams: they have no intrinsic size, so the box they occupy on the page
  // is the only thing there is to scale up from.
  const [session, setSession] = useState<{ list: Entry[]; index: number; originRect: DOMRect | null } | null>(null);

  const register = useCallback((e: Entry) => {
    entries.current.set(e.id, e);
    return () => {
      entries.current.delete(e.id);
    };
  }, []);

  const open = useCallback((id: string) => {
    const list = [...entries.current.values()]
      .filter((e) => {
        // Anything not actually on screen is not a slide. The BMW study ships
        // a light-mode and a dark-mode copy of one diagram and hides one with
        // display:none; without this the hidden twin would be a blank frame
        // in the middle of the arrow sequence.
        if (!e.node) return false;
        const r = e.node.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })
      // Reading order, not mount order: a figure rendered by a conditional
      // branch still takes the position it occupies on the page.
      .sort((a, b) => {
        const rel = a.node!.compareDocumentPosition(b.node!);
        if (rel & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (rel & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });
    const index = list.findIndex((e) => e.id === id);
    if (index >= 0) setSession({ list, index, originRect: list[index].node?.getBoundingClientRect() ?? null });
  }, []);

  const ctx = useMemo<Ctx>(() => ({ register, open }), [register, open]);

  return (
    <LightboxCtx.Provider value={ctx}>
      <style>{ZOOMABLE_CSS}</style>
      {children}
      <LightboxPortal>
        <AnimatePresence>
          {session && (
            <LightboxView
              entries={session.list}
              openIndex={session.index}
              originRect={session.originRect}
              compact={!!compact}
              onClose={() => setSession(null)}
              onStep={(i) => setSession((s) => (s ? { ...s, index: i } : s))}
            />
          )}
        </AnimatePresence>
      </LightboxPortal>
    </LightboxCtx.Provider>
  );
}

/* The lightbox opens from inside modals whose panels carry a transform while
   they animate, and a transformed ancestor makes `position: fixed` resolve
   against that ancestor instead of the viewport. Portalling to <body> keeps
   the enlarged image measured against the screen. */
function LightboxPortal({ children }: { children: React.ReactNode }) {
  // Client-only, without a mount effect: on the server this reads false, so
  // nothing is portalled into a document that does not exist yet.
  const isClient = useSyncExternalStore(subscribeNever, () => true, () => false);
  if (!isClient) return null;
  return createPortal(children, document.body);
}

const subscribeNever = () => () => {};

function LightboxView({
  entries,
  openIndex,
  originRect,
  compact,
  onClose,
  onStep,
}: {
  entries: Entry[];
  openIndex: number;
  originRect: DOMRect | null;
  compact: boolean;
  onClose: () => void;
  onStep: (index: number) => void;
}) {
  return compact ? (
    <LightboxViewCompact entries={entries} openIndex={openIndex} originRect={originRect} onClose={onClose} />
  ) : (
    <LightboxViewFull entries={entries} openIndex={openIndex} onClose={onClose} onStep={onStep} />
  );
}

function LightboxViewFull({
  entries,
  openIndex,
  onClose,
  onStep,
}: {
  entries: Entry[];
  openIndex: number;
  onClose: () => void;
  onStep: (index: number) => void;
}) {
  const current = entries[openIndex];
  // The archive grid registers pictures only; JSX diagrams are a case-study
  // thing and case studies are compact groups. The guard is here so the type
  // narrows, not because this is reachable.
  const many = entries.length > 1;
  // Only the image you actually clicked morphs out of its thumbnail, and only
  // until you step away from it. Stepping sideways fades instead: every other
  // thumbnail is behind the scrim, and growing out of one reads as a picture
  // thrown across the screen rather than opened.
  const [morphing, setMorphing] = useState(true);

  const step = useCallback(
    (i: number) => {
      setMorphing(false);
      onStep(i);
    },
    [onStep]
  );

  const handleKeys = useCallback(
    (e: KeyboardEvent) => {
      if (!many) return;
      if (e.key === "ArrowLeft" && openIndex > 0) step(openIndex - 1);
      if (e.key === "ArrowRight" && openIndex < entries.length - 1) step(openIndex + 1);
    },
    [many, openIndex, entries.length, step]
  );

  if (current.kind !== "image") return null;

  return (
    <Overlay
      label={current.label}
      onClose={onClose}
      onKeyDown={handleKeys}
      zIndex={120}
      className="p-2 sm:p-6 md:p-10"
    >
        {/* Fills the padded box rather than shrinking to the picture, so the
            image's own `100%` has something to measure against — a
            shrink-to-fit parent and a percentage child size each other in a
            circle and settle on whatever the srcset guessed. Transparent to
            clicks so the scrim still closes everywhere except on the image
            itself. */}
        <motion.div
          /* Re-keyed per image so stepping fades the next one up rather than
             hard-cutting. No AnimatePresence around it on purpose: this whole
             view is itself inside one, and a nested pair left the exiting
             subtree waiting on a child that had already gone. */
          key={current.id}
          className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <MotionImage
            layoutId={morphing ? current.layoutId : undefined}
            transition={EXPAND}
            src={current.src}
            alt={current.label}
            width={current.w}
            height={current.h}
            /* The display width is capped at the image's own pixels, so ask
               for exactly that. "100vw" made the browser resolve a candidate
               against a layout width it had not computed yet and settle on a
               640w variant for a picture it then drew at 1091. */
            sizes={`${current.w}px`}
            priority
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            className="block rounded-lg pointer-events-auto"
            /* Three caps, in one width: the padded viewport box, the image's
               own pixels — never past 1:1, several sources here already
               render at close to it and stretching them buys blur — and the
               height budget, converted through the aspect ratio so the
               picture stays whole instead of being letterboxed inside a box
               wider than itself. Width has to be explicit: with `auto`, an
               image carrying a srcset takes its intrinsic size from whichever
               candidate the browser picked, which is decided from the layout
               width it does not have yet. */
            style={{
              width: `min(100%, ${current.w}px, calc(88vh * ${current.w / current.h}))`,
              height: "auto",
            }}
          />
        </motion.div>

      {/* Close, previous and next float on the scrim so they never cover the
          image. Same surface tokens as the case-study modal's close button. */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        className="absolute top-3 right-3 md:top-6 md:right-6 z-20 w-11 h-11 rounded-full bg-fill hover:bg-fill-strong border border-line-strong flex items-center justify-center transition-all duration-150 active:scale-90 backdrop-blur-md cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-ink" aria-hidden>
          <line x1="3" y1="3" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="11" y1="3" x2="3" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {many && (
        <>
          <LightboxArrow side="left" disabled={openIndex === 0} onClick={() => step(openIndex - 1)} />
          <LightboxArrow side="right" disabled={openIndex === entries.length - 1} onClick={() => step(openIndex + 1)} />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-2xs uppercase tracking-[0.22em] text-meta">
            {openIndex + 1} / {entries.length}
          </span>
        </>
      )}
    </Overlay>
  );
}

/* A floating panel instead of the near-fullscreen view: capped so there is
   always dimmed page visible around all four sides, and never scaled past
   the source's own pixels, so a small image stays small and centred rather
   than being stretched into blur. Its own function, not a branch inside
   LightboxViewFull, so the default near-fullscreen path used by the archive
   grid stays exactly as it was — nothing here can regress it.

   No stepping, no counter: this is "enlarge the one I clicked," not a
   gallery. Closing and clicking a different thumbnail is the way to see a
   different figure — there is no arrow-key or on-screen equivalent here. */
function LightboxViewCompact({
  entries,
  openIndex,
  originRect,
  onClose,
}: {
  entries: Entry[];
  openIndex: number;
  originRect: DOMRect | null;
  onClose: () => void;
}) {
  const current = entries[openIndex];

  /* Three caps in one width, all in CSS so they track a resize while the
     panel is open: the image's own pixels first — never upscale, a small
     source stays small — then 80vw, then the 80vh height budget converted
     through the aspect ratio. Width has to be explicit rather than `auto`:
     an image carrying a srcset takes its intrinsic size from whichever
     candidate the browser picked, which it decides from a layout width it
     does not have yet. */
  const width =
    current.kind === "image"
      ? `min(${current.w}px, 80vw, calc(80vh * ${current.w / current.h}))`
      : undefined;

  /* A JSX diagram has no intrinsic size, so it scales off the box it occupies
     on the page. Floor of 1.5 so a click always buys something — at phone
     widths 80vw is roughly the box it already had, and a popup that changed
     nothing would be worse than no popup. Ceiling of 2.5 so a panel that is
     already wide doesn't turn into a wall. */
  const scale = (() => {
    if (current.kind !== "block" || !originRect || originRect.width === 0) return 1;
    return Math.min(2.5, Math.max(1.5, (window.innerWidth * 0.8) / originRect.width));
  })();

  return (
    <Overlay
      label={current.label}
      onClose={onClose}
      zIndex={120}
      className="p-6"
      /* Lighter than the modal scrim, and a softer blur: the page stays
         legible behind it, so this reads as something on top of the page
         rather than a different screen. */
      scrimStyle={{
        background: "rgba(0,0,0,0.66)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <motion.div
        key={current.id}
        className="relative"
        style={{ width, maxWidth: "80vw" }}
        /* Fade with a slight scale-up, ~180ms out. Under
           prefers-reduced-motion the page's <MotionConfig reducedMotion="user">
           drops the transform and leaves the fade, which is exactly the
           reduced-motion behaviour wanted here — no scaling, no travel. */
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {current.kind === "image" ? (
          <MotionImage
            src={current.src}
            alt={current.label}
            width={current.w}
            height={current.h}
            /* Ask for the full-resolution candidate: the card thumbnails load
               downscaled variants that would look soft blown up. */
            sizes={`${current.w}px`}
            priority
            draggable={false}
            onClick={onClose}
            className="block w-full h-auto rounded-sm shadow-[0_24px_60px_rgba(0,0,0,0.6)] cursor-zoom-out"
            style={{ objectFit: "contain" }}
          />
        ) : (
          /* The transform scales what is painted, not what is laid out, so the
             scroll box is sized to the scaled dimensions and the diagram is
             pinned to its top-left corner inside it. Without that the box
             would still measure the original height and never scroll. */
          <div
            className="overflow-auto rounded-lg shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
            style={{ maxWidth: "90vw", maxHeight: "85vh" }}
          >
            <div
              style={{
                width: (originRect?.width ?? 0) * scale,
                height: (originRect?.height ?? 0) * scale,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: originRect?.width,
                  height: originRect?.height,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                {current.getContent()}
              </div>
            </div>
          </div>
        )}

        {/* Always visible, never hover-only, and on its own solid disc: no
            translucency and no backdrop blur, so it never reads as a glass
            chip sitting on the picture. The shared --fill token is no good
            here either — in dark mode it is a *light* translucent, which
            disappears against a white screenshot. 32px on desktop, 44px on
            touch widths for the tap target. */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close enlarged image"
          className="absolute -top-3 -right-3 z-20 w-11 h-11 sm:w-8 sm:h-8 rounded-full border border-white/20 flex items-center justify-center transition-colors duration-150 cursor-pointer hover:border-white/40"
          style={{ background: "#1A1A1A" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white" aria-hidden>
            <line x1="3" y1="3" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="11" y1="3" x2="3" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </motion.div>
    </Overlay>
  );
}

/* Only LightboxViewFull steps between images, so this only ever renders
   viewport-pinned — the compact popup has no gallery to step through. */
function LightboxArrow({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const position = side === "left" ? "left-2 md:left-6" : "right-2 md:right-6";
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={`absolute top-1/2 -translate-y-1/2 ${position} w-11 h-11 z-20 rounded-full bg-fill hover:bg-fill-strong border border-line-strong flex items-center justify-center transition-all duration-150 active:scale-90 backdrop-blur-md cursor-pointer disabled:opacity-30 disabled:cursor-default`}
    >
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" className="text-ink" aria-hidden>
        <polyline
          points={side === "left" ? "9,2 4,7 9,12" : "5,2 10,7 5,12"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}

export function ZoomableImage({
  src,
  alt,
  className,
  sizes,
  loading,
  width,
  height,
  wrapperClassName,
  layoutId,
  priority,
  fill,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
  /* Mirrors next/image's `fill` for the callers that crop into a fixed box.
     The button becomes the filled layer so the image still measures against
     the same positioned parent it did before. */
  fill?: boolean;
  /* Classes for the button. It is a block that fills its cell, so whatever
     the old <Image> inherited from its parent still applies. */
  wrapperClassName?: string;
  /* For an image that already owns a layoutId — the archive hero morphs out
     of its grid tile. Reusing that id keeps one shared element instead of two
     fighting over the same pixels. */
  layoutId?: string;
  priority?: boolean;
}) {
  const ctx = useContext(LightboxCtx);
  const autoId = useId();
  const ref = useRef<HTMLButtonElement>(null);
  const dims = dimsOf(src);
  const w = width ?? dims.w;
  const h = height ?? dims.h;
  const lid = layoutId ?? `zoom-${autoId}`;

  const register = ctx?.register;
  useEffect(() => {
    if (!register) return;
    return register({ kind: "image", id: autoId, node: ref.current, src, label: alt, layoutId: lid, w, h });
  }, [register, autoId, src, alt, lid, w, h]);

  // Outside a group this is exactly the image it replaced.
  if (!ctx) {
    return fill ? (
      <Image src={src} alt={alt} fill sizes={sizes} loading={loading} priority={priority} className={className} />
    ) : (
      <Image src={src} alt={alt} width={w} height={h} sizes={sizes} loading={loading} priority={priority} className={className} />
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ctx.open(autoId)}
      aria-haspopup="dialog"
      aria-label={`Enlarge image: ${alt}`}
      className={`zoomable cursor-zoom-in bg-transparent border-0 p-0 ${fill ? "absolute inset-0" : "block w-full"} ${wrapperClassName ?? ""}`}
    >
      <MotionImage
        layoutId={lid}
        transition={EXPAND}
        src={src}
        alt={alt}
        {...(fill ? { fill: true as const } : { width: w, height: h })}
        sizes={sizes}
        loading={loading}
        priority={priority}
        className={className}
      />
    </button>
  );
}

/* ─── ZoomableBlock ────────────────────────────────────────────────────────
   The same click-to-enlarge for a diagram that is drawn in JSX rather than
   exported as a picture — the agent/capabilities mapping, the architecture
   diagram, the rebuilt trend module. Those have the same problem the images
   had, small type at column width, but none of an image's handles: no src,
   no intrinsic pixels, nothing to hand a lightbox.

   So it registers its own subtree instead, and the overlay re-renders it at a
   transform scale off the box it occupies on the page. Re-rendered rather
   than cloned or screenshotted, which is why it stays sharp at any scale —
   it is still text and borders, not pixels.

   Unlike an enlarged picture, this one does not close on click: it can be
   scrolled when it outgrows the viewport, and a click that both pans and
   dismisses is a click you cannot trust. Backdrop, Escape and the × still
   close it.
   ────────────────────────────────────────────────────────────────────────── */
export function ZoomableBlock({
  label,
  className,
  children,
}: {
  /* Names the diagram for the dialog and the trigger. Not decorative — it is
     the only accessible name either one gets. */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(LightboxCtx);
  const autoId = useId();
  const ref = useRef<HTMLButtonElement>(null);
  // Children change identity every render; holding them in the entry would
  // re-register on each one. The overlay reads this at click time instead.
  const contentRef = useRef<ReactNode>(children);
  useEffect(() => {
    contentRef.current = children;
  });

  const register = ctx?.register;
  useEffect(() => {
    if (!register) return;
    return register({
      kind: "block",
      id: autoId,
      node: ref.current,
      label,
      getContent: () => contentRef.current,
    });
  }, [register, autoId, label]);

  // Outside a group it is exactly the markup it wraps.
  if (!ctx) return <>{children}</>;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ctx.open(autoId)}
      aria-haspopup="dialog"
      aria-label={`Enlarge diagram: ${label}`}
      className={`zoomable-block block w-full text-left bg-transparent border-0 p-0 cursor-zoom-in ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
