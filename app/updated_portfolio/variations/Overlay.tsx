"use client";

import { useCallback, useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useIsPresent } from "framer-motion";

/* ─── Overlay ──────────────────────────────────────────────────────────────
   One dialog shell, consumed by the case-study modal, the archive modal and
   the lightbox. They were copies of the same markup that had drifted apart:
   only one carried dialog semantics, and the scrim was tokenised in one and
   hardcoded in the other. Everything a dialog owes the user — role, label,
   Escape, scroll lock, focus trap, focus return — lives here, so a caller
   cannot forget it and the copies cannot drift again.

   Lives in its own file because the lightbox needs it too, and importing it
   back out of RinasPortfolio would close an import cycle.
   ────────────────────────────────────────────────────────────────────────── */

/* Open dialogs, outermost first. The lightbox opens on top of a case-study
   modal, and without this both would answer the same Escape — one keypress
   closing two dialogs — and both would run a focus trap against the other.
   Only the top of the stack listens.

   A dialog leaves this stack when it starts animating out, not when React
   finally unmounts it. AnimatePresence keeps an exiting dialog mounted for
   the length of its exit, and a closed-but-still-fading dialog that still
   held the top of the stack would swallow the next Escape — the one meant
   for the dialog underneath it. */
const stack: string[] = [];

/* The page's own scroll lock. Held here rather than in each dialog so that
   nesting locks once and unlocks once, and so the compensation below is
   applied exactly one time. */
let lockCount = 0;
let prevOverflow = "";
let prevPadding = "";

function lockScroll() {
  if (lockCount++ > 0) return;
  const body = document.body;
  prevOverflow = body.style.overflow;
  prevPadding = body.style.paddingRight;
  // Removing the scrollbar hands its width back to the layout and everything
  // fixed or centred jumps sideways. Pay the width back as padding. Overlay
  // scrollbars (macOS default) measure 0, so this is a no-op there.
  const gutter = window.innerWidth - document.documentElement.clientWidth;
  if (gutter > 0) {
    const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + gutter}px`;
  }
  body.style.overflow = "hidden";
}

function unlockScroll() {
  if (--lockCount > 0) return;
  document.body.style.overflow = prevOverflow;
  document.body.style.paddingRight = prevPadding;
}

export function Overlay({
  label,
  onClose,
  onKeyDown,
  className,
  zIndex = 100,
  scrimStyle,
  children,
}: {
  label: string;
  onClose: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  /* Padding around the panel. Defaults to the modal inset; the lightbox
     passes a tighter one so a phone gets a near-full-bleed image. */
  className?: string;
  /* Inline, not a class: a dialog stacked on another dialog has to outrank
     it, and two arbitrary Tailwind z- values resolve by stylesheet order
     rather than by which one the caller passed last. */
  zIndex?: number;
  /* Overrides the scrim. The default is the modal scrim every dialog on the
     page shares; the lightbox lightens it, because a figure floating over a
     page you can still make out reads as a closer look rather than a
     different screen. */
  scrimStyle?: CSSProperties;
  children: ReactNode;
}) {
  const id = useId();
  const isPresent = useIsPresent();
  const containerRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const releasedRef = useRef(false);

  // Idempotent: the exit path and the unmount path both call it, and whichever
  // runs first is the one that hands back the scroll lock and the focus.
  const release = useCallback(() => {
    if (releasedRef.current) return;
    releasedRef.current = true;
    const i = stack.indexOf(id);
    if (i >= 0) stack.splice(i, 1);
    unlockScroll();
    openerRef.current?.focus?.();
  }, [id]);

  // Held in refs so the effect runs once per open. Callers pass inline
  // closures, and re-running would yank focus back to the first control
  // every time a parent re-rendered.
  const closeRef = useRef(onClose);
  const keyRef = useRef(onKeyDown);
  // Kept fresh after every render — writing a ref during render is not allowed.
  useEffect(() => {
    closeRef.current = onClose;
    keyRef.current = onKeyDown;
  });

  useEffect(() => {
    releasedRef.current = false;
    stack.push(id);
    const isTop = () => !releasedRef.current && stack[stack.length - 1] === id;

    openerRef.current = document.activeElement as HTMLElement | null;
    lockScroll();

    const focusables = () =>
      Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    // Land focus inside the dialog so the next Tab continues here, not behind it.
    (focusables()[0] ?? containerRef.current)?.focus();

    const handleKey = (e: KeyboardEvent) => {
      // Capture phase: a nested dialog stops the key before the one beneath
      // it sees the same event on the bubble.
      if (!isTop()) return;
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key === "Tab") {
        e.stopPropagation();
        const els = focusables();
        if (els.length === 0) {
          e.preventDefault();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        const active = document.activeElement;
        const inside = containerRef.current?.contains(active ?? null);
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      keyRef.current?.(e);
    };

    window.addEventListener("keydown", handleKey, true);
    return () => {
      window.removeEventListener("keydown", handleKey, true);
      release();
    };
  }, [id, release]);

  // The moment AnimatePresence marks this one as leaving, it stops being a
  // dialog: it gives up the key handling, the scroll lock and the focus while
  // its exit animation plays out.
  useEffect(() => {
    if (!isPresent) release();
  }, [isPresent, release]);

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      /* On the way out it is decoration, not a dialog. */
      aria-hidden={!isPresent || undefined}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ zIndex }}
      className={`fixed inset-0 flex items-center justify-center focus:outline-none ${className ?? "p-4 md:p-10"}`}
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={
          scrimStyle ?? {
            background: "var(--scrim)",
            backdropFilter: "blur(18px) saturate(120%)",
            WebkitBackdropFilter: "blur(18px) saturate(120%)",
          }
        }
      />
      {children}
    </motion.div>
  );
}
