"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Outfit, DM_Sans } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["200", "300", "400", "500"] });
const sans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

// ─── Filter System ────────────────────────────────────────────────────────────
type Category =
  | "Spatial Computing"
  | "Physical Computing"
  | "Multimodal Systems"
  | "Rapid Prototyping"
  | "Interface Design"
  | "Tangible Environments";

const ALL_CATEGORIES: Category[] = [
  "Multimodal Systems",
  "Interface Design",
  "Spatial Computing",
  "Physical Computing",
  "Rapid Prototyping",
  "Tangible Environments",
];

const CAT_STYLE: Record<Category, { dot: string; active: string; text: string }> = {
  "Spatial Computing": { dot: "#60a5fa", active: "rgba(59,130,246,0.18)", text: "#93c5fd" },
  "Physical Computing": { dot: "#34d399", active: "rgba(16,185,129,0.18)", text: "#6ee7b7" },
  "Multimodal Systems": { dot: "#fbbf24", active: "rgba(245,158,11,0.18)", text: "#fde68a" },
  "Rapid Prototyping": { dot: "#f87171", active: "rgba(239,68,68,0.18)", text: "#fca5a5" },
  "Interface Design": { dot: "#f472b6", active: "rgba(236,72,153,0.18)", text: "#f9a8d4" },
  "Tangible Environments": { dot: "#d97706", active: "rgba(180,110,30,0.20)", text: "#fcd34d" },
};

interface GridItem {
  src: string;
  alt: string;
  tag: string;
  label: string;
  desc: string;
  categories: Category[];
  colSpan?: number;
  aspectClass?: string;
  scaleClass?: string;
}

const ALL_PROJECTS: GridItem[] = [
  // Prototypes
  { src: "/images/prototypes/ResponsiveTale 1.png", alt: "ResponsiveTale", tag: "Interactive · XR", label: "Responsive Tale", desc: "Adaptive storytelling interface reacting to reader behavior", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Interface Design", "Multimodal Systems", "Physical Computing"] },
  { src: "/images/prototypes/peppersghost01.png", alt: "Pepper's Ghost", tag: "Spatial · Illusion", label: "Pepper's Ghost", desc: "Holographic display using classic stage illusion technique", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Rapid Prototyping", "Tangible Environments"] },
  { src: "/images/prototypes/flexvr 1.png", alt: "FlexVR", tag: "XR · Wearable", label: "FlexVR", desc: "Flexible VR interface that adapts to body movement", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Interface Design", "Physical Computing", "Rapid Prototyping"] },
  { src: "/images/prototypes/emmasjellyfish01 1.png", alt: "Emma's Jellyfish", tag: "Interactive · Bio", label: "Emma's Jellyfish", desc: "Bioluminescent jellyfish environment responding to gesture", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Physical Computing", "Rapid Prototyping", "Interface Design", "Multimodal Systems"] },
  { src: "/images/prototypes/LeARn.png", alt: "LeARn", tag: "AR · Education", label: "LeARn", desc: "Augmented reality learning environment for spatial comprehension", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Interface Design", "Rapid Prototyping"] },
  { src: "/images/prototypes/stopmotion02.png", alt: "Stop Motion 02", tag: "Physical · Animation", label: "Stop Motion 02", desc: "Stop motion study with extended material and texture exploration", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Rapid Prototyping", "Tangible Environments"] },
  { src: "/images/prototypes/cmupopup 1.png", alt: "CMU Popup", tag: "Installation", label: "CMU Popup", desc: "Pop-up exhibition experience designed for CMU campus", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Rapid Prototyping", "Tangible Environments"] },
  { src: "/images/prototypes/portalreef 1.png", alt: "Portal Reef", tag: "XR · Environment", label: "Portal Reef", desc: "Immersive underwater portal experience in mixed reality", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Rapid Prototyping", "Physical Computing", "Interface Design"] },
  { src: "/images/prototypes/stopmotion01.png", alt: "Stop Motion", tag: "Physical · Animation", label: "Stop Motion", desc: "Frame-by-frame physical animation exploring material storytelling", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Rapid Prototyping", "Tangible Environments"] },
  // Spatial / ARVR
  { src: "/images/ARVR/library.png", alt: "Library VR", tag: "VR · Environment", label: "Library", desc: "Immersive virtual library space designed for focused study", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"] },
  { src: "/images/ARVR/RHcloud 1.png", alt: "RH Cloud", tag: "Responsive · Atmospheric", label: "RH Cloud", desc: "Volumetric cloud environment exploring presence and scale", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Rapid Prototyping", "Tangible Environments"] },
  { src: "/images/ARVR/pianoroom02 1.png", alt: "Music Box Room", tag: "Virtual Reality · Acoustic", label: "Music Box Room", desc: "Second iteration with updated lighting and material studies", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"] },
  { src: "/images/ARVR/pianoroom 1.png", alt: "Piano Room", tag: "Virtual Reality · Acoustic", label: "Piano Room", desc: "Intimate virtual music room built around spatial audio", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"] },
  { src: "/images/ARVR/studyhall 1.png", alt: "Study Hall", tag: "3D Model · Architecture", label: "Study Hall", desc: "Collaborative virtual study hall with adaptive ambient zones", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"] },
  { src: "/images/ARVR/trees01 1.png", alt: "Trees 01", tag: "Augmented Reality · Nature", label: "Trees 01", desc: "Forest density study exploring depth and spatial perception", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"] },
  { src: "/images/ARVR/flowers 1.png", alt: "Flowers", tag: "Augmented Reality · Nature", label: "Flowers", desc: "Botanical virtual space with reactive flora and ambient sound", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"] },
  { src: "/images/prototypes/june19th_fragrance.jpg", alt: "Forest Fragrance", tag: "Multimodal · Sensory", label: "Forest Fragrance", desc: "Multimodal sensory experience exploring fragrance interaction", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Multimodal Systems"] },
  { src: "/images/ARVR/forest01 1.png", alt: "Forest", tag: "Virtual Reality · Environment", label: "Forest", desc: "Full immersive forest environment with layered ambient depth", colSpan: 2, aspectClass: "aspect-[16/9]", scaleClass: "scale-[1.3] group-hover:scale-[1.32]", categories: ["Spatial Computing"] },
];

// ─── Static Tailwind col-span map (dynamic strings get purged) ───────────────
const COL_SPAN_CLASS: Record<number, string> = {
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  6: "col-span-6",
};

// ─── FilterCategoryButton ────────────────────────────────────────────────────
function FilterCategoryButton({
  cat,
  isActive,
  onClick,
}: {
  cat: Category;
  isActive: boolean;
  onClick: () => void;
}) {
  const s = CAT_STYLE[cat];
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide border transition-all duration-300 cursor-pointer whitespace-nowrap select-none"
      style={isActive
        ? { background: s.active, borderColor: s.dot, color: s.text, boxShadow: `0 0 12px ${s.dot}50` }
        : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.15)", color: "#909090" }
      }
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: isActive ? s.dot : "#555" }} />
      {cat}
    </button>
  );
}

// ─── FilteredThumb ────────────────────────────────────────────────────────────
function FilteredThumb({
  item,
  activeFilter,
  outfitClass,
}: {
  item: GridItem;
  activeFilter: Category | null;
  outfitClass: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Color logic:
  // - Filter active → always full color (only matches are rendered)
  // - No filter + hovering → full color
  // - No filter + not hovering → grayscale
  const inColor = activeFilter !== null || isHovered;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={slowFade}
      className={`${COL_SPAN_CLASS[item.colSpan ?? 3]} ${item.aspectClass ?? "aspect-[16/9]"} bg-[#141414] overflow-hidden rounded-sm group relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={item.src}
        alt={item.alt}
        className={`w-full h-full object-cover ${item.scaleClass ?? ""}`}
        animate={{
          filter: inColor ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.7)",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/20 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end px-5 py-5">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#E8D4BE] mb-1 font-semibold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
          {item.tag}
        </span>
        <span className={`${outfitClass} text-white text-base font-medium mb-1`} style={{ textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>
          {item.label}
        </span>
        <span className="text-[#E5E5E5] text-[12.5px] leading-relaxed font-normal mb-2.5" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
          {item.desc}
        </span>
        {/* Category pills */}
        <div className="flex flex-wrap gap-1 mt-1">
          {item.categories.map((c) => (
            <span
              key={c}
              className="text-[9px] font-semibold px-2.5 py-0.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md"
              style={{ color: CAT_STYLE[c].text, textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const slowFade = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1, filter: "blur(0px)",
    transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const lineReveal = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }
  }
};

// Label / section heading style
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-[13px] uppercase tracking-[0.22em] text-[#C9B49A] mb-2.5">
    {children}
  </span>
);

// Divider
const Hairline = () => <div className="w-full h-[1px] bg-white/5 my-5" />;

// ─── Scrollspy Nav ───
const NAV_ITEMS = [
  { id: "project-00", label: "BMW Adaptive UI" },
  { id: "project-01", label: "CMU Proactive Agent" },
  { id: "project-02", label: "AI Trend Forecasting" },
  { id: "project-03", label: "Emma's Tree" },
  { id: "selected-projects", label: "Selected Projects" },
  { id: "project-meet", label: "Nice to Meet You" },
];

function ScrollNav() {
  const [active, setActive] = useState("project-00");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: "-10% 0px -60% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed left-5 top-[320px] z-50 hidden lg:flex flex-col items-center gap-0">
      {NAV_ITEMS.map(({ id, label }, i) => (
        <div key={id} className="flex flex-col items-center">
          {/* Dot + tooltip row */}
          <a
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative flex items-center group/dot py-1"
          >
            {/* Dot */}
            <div
              className={`w-[7px] h-[7px] rounded-full transition-all duration-300 ${active === id
                ? "bg-[#EAEAEA] scale-125 shadow-[0_0_6px_rgba(234,234,234,0.4)]"
                : "bg-[#444] group-hover/dot:bg-[#888]"
                }`}
            />
            {/* Tooltip label — appears to the right on hover */}
            <span
              className="absolute left-5 whitespace-nowrap text-[11px] tracking-wide pointer-events-none
                opacity-0 group-hover/dot:opacity-100 -translate-x-1 group-hover/dot:translate-x-0
                transition-all duration-200 px-2 py-1 rounded-sm bg-[#1A1A1A] border border-white/10
                text-[#EAEAEA]"
            >
              {label}
            </span>
          </a>
          {/* Connector line */}
          {i < NAV_ITEMS.length - 1 && (
            <div className="w-[1px] h-5 bg-white/10" />
          )}
        </div>
      ))}
    </nav>
  );
}

export default function Var7ClassyAuto() {
  const [pinned, setPinned] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Category | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; scale: number; rotation: number; fill: string; highlight: string; outline: string }[]>([]);

  const handleAddHearts = () => {
    const newHearts = Array.from({ length: 4 }).map((_, i) => {
      // Warm yellow shades to coordinate beautifully with the rose bouquet
      const baseYellows = ["#facc15", "#fde047", "#eab308", "#ca8a04", "#b45309"];
      const highlights = ["#fef08a", "#fef9c3", "#fef08a", "#fde047", "#ca8a04"];

      const idx = Math.floor(Math.random() * baseYellows.length);
      const randomFill = baseYellows[idx];
      const randomHighlight = highlights[idx];

      // Ring distribution so they spawn AROUND the main center heart, not on top of it!
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 100; // 40px to 140px away from center
      const randomX = Math.cos(angle) * distance * 1.8; // stretched horizontally to the sides!
      const randomY = Math.sin(angle) * distance * 0.65 - 10; // flatter vertically to avoid overlapping headers/footers!

      const randomScale = 0.45 + Math.random() * 0.65; // scales dynamically from 0.45 (tiny) to 1.1 (slightly larger) for beautiful depth!
      const randomRotation = (Math.random() - 0.5) * 40; // natural random tilt

      return {
        id: Date.now() + Math.random() + i,
        x: randomX,
        y: randomY,
        scale: randomScale,
        rotation: randomRotation,
        fill: randomFill,
        highlight: randomHighlight,
        outline: "#b45309"
      };
    });
    setHearts((prev) => [...prev, ...newHearts]);
  };

  const filterBarRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`${sans.className} min-h-screen bg-[#0C0C0C] text-[#A3A3A3] selection:bg-[#B39D82] selection:text-[#0C0C0C] font-light`}>

      <ScrollNav />

      {/* Subtle material texture overlay */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* ─── Header ─── */}
      <header className="px-8 md:px-16 pt-24 pb-16 max-w-[1600px] mx-auto">
        <motion.div initial="hidden" animate="visible" variants={slowFade}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-baseline gap-6 mb-6 flex-wrap sm:flex-nowrap">
              <h1 className={`${outfit.className} text-5xl md:text-7xl font-light text-[#EAEAEA] tracking-tight`}>
                Rina Kim
              </h1>
              <a
                href="/images/Rina%20Kim%20Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-sm text-[9px] font-semibold uppercase tracking-[0.15em] border transition-all duration-300 cursor-pointer relative -translate-y-[9px]
                  bg-[#1C1A17] text-[#A3A3A3] border-[#B39D82]/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:bg-[#B39D82] hover:text-[#0C0C0C] hover:border-[#B39D82] hover:shadow-[0_0_15px_rgba(179,157,130,0.35)] shrink-0"
              >
                <span className="pl-[0.15em] text-center">Resume</span>
              </a>
            </div>
            <p className="text-sm tracking-[0.15em] uppercase text-[#737373] mb-2">
              <span className="font-semibold text-[#A3A3A3]">Product Designer</span> — UX/UI Design · Prototyping · Systems Thinking
            </p>
            <p className="text-[15px] text-[#A3A3A3] leading-relaxed max-w-xl mt-6">
              Masters in Human-Computer Interaction from <span className="text-[#EAEAEA] font-medium">Carnegie Mellon University</span>.
              Previously at <span className="text-[#EAEAEA] font-medium">BMW Group Technology Office</span>.
              Specializing in Automotive HMI, Interface Design, and Rapid Prototyping that bridge research and production.
            </p>
          </div>
          <div className="text-right text-sm leading-relaxed text-[#A3A3A3]">
          </div>
        </motion.div>
        <motion.div initial="hidden" animate="visible" variants={lineReveal}
          className="w-full h-[1px] bg-gradient-to-r from-[#B39D82]/40 via-[#B39D82]/10 to-transparent" />
      </header>

      <main className="max-w-[1600px] mx-auto px-8 md:px-16 pb-32 space-y-40">

        {/* ─── Project 00: BMW Adaptive Generative UI ─── */}
        <motion.article id="project-00" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade} className="group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left — meta + content */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#EAEAEA]`}>00</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[#C9B49A]">BMW Group</span>
              </div>

              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#EAEAEA] mb-1`}>
                  Adaptive Generative UI
                </h2>
                <p className="text-[12px] tracking-widest uppercase text-[#A3A3A3] mb-6">
                  2025 Jun – 2026 Jan &nbsp;·&nbsp; UX Engineer Intern
                </p>

                <div className="space-y-6 text-[15px] text-[#A3A3A3] leading-relaxed">
                  {/* The Problem */}
                  <div>
                    <SectionLabel>The Problem</SectionLabel>
                    <div className="bg-[#1A1A1A] rounded-sm p-6 border border-white/10">
                      <p className="mb-3">
                        In-vehicle interfaces are static. They show the same things the same way, forcing drivers to dig for information at the exact moments road conditions, fatigue, or hazards make digging dangerous.
                      </p>
                      <p>
                        <span className="text-[#EAEAEA] font-medium">Design challenge:</span> Compose the interface itself from contex. Driver state, road conditions, route - instead of asking the driver to navigate to what they need.
                      </p>
                    </div>
                  </div>

                  <Hairline />

                  {/* Overview moved to full-width row below */}

                  <Hairline />

                  <div>
                    <SectionLabel>Technologies</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Three.js", "Generative AI", "Automotive UI"].map(t => (
                        <span key={t} className="text-[11px] uppercase tracking-widest text-[#A3A3A3] border border-white/20 px-3 py-1 rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — imagery */}
            <div className="lg:col-span-8 space-y-4">
              <div className="aspect-[21/9] overflow-hidden bg-[#141414] rounded-sm">
                <img src="/images/00/neueklasse.webp" alt="BMW Interface"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                  <img src="/images/00/layers_whitetext.png" alt="Layers diagram" className="w-full h-auto opacity-90" />
                </div>
                <div className="aspect-video bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                  <img src="/images/00/pipeline.png" alt="Pipeline diagram" className="w-full h-auto opacity-90" />
                </div>
              </div>
            </div>

            {/* Overview + Agent → Capabilities diagram (full width) */}
            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
              {/* Overview text */}
              <div className="lg:col-span-5 text-[15px] text-[#A3A3A3] leading-relaxed">
                <SectionLabel>Overview</SectionLabel>
                <p>
                  Developed a context-aware UI framework that utilizes generative models to synthesize interface components in real-time. By analyzing driver telemetry, cabin state, and environmental context, the system provides proactive information hierarchy, minimizing cognitive load while enhancing vehicle interaction.
                </p>
              </div>

              {/* Agent → Capabilities mapping */}
              <div className="lg:col-span-7">
                <div className="bg-[#111] rounded-md border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.55)] p-5 md:p-6">
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
                    {/* Agent column */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-center text-center py-2 rounded bg-[#1A1A1A] border border-[#C9B49A]/40 min-h-[36px]">
                        <span className="text-[11px] md:text-[13px] font-medium tracking-wider text-[#EAEAEA]">Agent</span>
                      </div>
                      {[
                        "Models: Plans and decides",
                        "Tools: Acts and integrates",
                        "Orchestration: Manages memory, tools, and errors",
                        "Runtime: Executes",
                      ].map((label, i) => (
                        <div key={label} className="flex-1 flex items-center px-3 py-2.5 rounded bg-[#161616] border border-white/[0.06]">
                          <span className="text-[#C9B49A] text-[10px] md:text-[11px] font-semibold mr-2 shrink-0">{i + 1}.</span>
                          <span className="text-[10px] md:text-[11.5px] text-[#B0B0B0] leading-[1.35]">{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
                        <path d="M0 9 H22 M17 3 L23 9 L17 15" stroke="#C9B49A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Capabilities column */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-center text-center py-2 rounded bg-[#1A1A1A] border border-[#C9B49A]/40 min-h-[36px]">
                        <span className="text-[11px] md:text-[13px] font-medium tracking-wider text-[#EAEAEA]">Capabilities</span>
                      </div>
                      {[
                        "Conversation Analytics",
                        "Data Exploration",
                        "Reasoning",
                        "Dynamic Tool Selection",
                        "Data Governance",
                      ].map(cap => (
                        <div key={cap} className="flex-1 flex items-center justify-center text-center px-3 py-2.5 rounded bg-[#161616] border border-white/[0.06]">
                          <span className="text-[10px] md:text-[11.5px] text-[#B0B0B0] leading-[1.35]">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider spanning full width */}
            <div className="lg:col-span-12 my-2">
              <Hairline />
            </div>

            {/* Key Contributions & Agent Architecture Diagram */}
            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-4 text-[15px] text-[#A3A3A3] leading-relaxed">
                <SectionLabel>Key Contributions</SectionLabel>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-[#C9B49A] shrink-0">—</span>
                    <span>Designed and implemented a modular HMI architecture that decouples UI layout from underlying data streams, enabling seamless adaptation to varying driver contexts.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#C9B49A] shrink-0">—</span>
                    <span>Developed a React-based orchestration layer that synchronizes generative model outputs with high-fidelity vehicle displays, ensuring sub-50ms latency for interface transitions.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#C9B49A] shrink-0">—</span>
                    <span>Prototyped an Adaptive HMI concept for automotive production, translating experimental generative design into a safety-critical dashboard implementation.</span>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-7">
                {/* ── Inline Agent Architecture Diagram ── */}
                <div className="bg-[#111] rounded-md p-5 md:p-7 border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
                  {/* ── Main Agent ── */}
                  <div className="flex justify-center mb-3">
                    <div className="px-8 py-2.5 rounded-full border border-[#C9B49A]/40 bg-[#1A1A1A]">
                      <span className={`${outfit.className} text-[13px] md:text-[14px] font-medium tracking-wide text-[#EAEAEA]`}>Main Agent</span>
                    </div>
                  </div>

                  {/* ── Connector lines (SVG) ── */}
                  <svg viewBox="0 0 500 36" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Vertical stem */}
                    <line x1="250" y1="0" x2="250" y2="12" stroke="#C9B49A" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
                    {/* Horizontal rail */}
                    <line x1="50" y1="12" x2="450" y2="12" stroke="#C9B49A" strokeWidth="0.8" opacity="0.35" />
                    {/* 5 vertical drops */}
                    {[50, 150, 250, 350, 450].map(x => (
                      <line key={x} x1={x} y1="12" x2={x} y2="36" stroke="#C9B49A" strokeWidth="0.8" opacity="0.35" />
                    ))}
                  </svg>

                  {/* ── Agent cards grid ── */}
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {[
                      {
                        agent: "Agent A",
                        domain: "Navigation",
                        mode: "Reachability",
                        items: ["Navigation Mapping", "Route Itinerary Preview", "Adaptive Route Analytics", "Live Traffic", "Arrival Metrics"],
                      },
                      {
                        agent: "Agent B",
                        domain: "Comfort",
                        mode: "Passenger",
                        items: ["Thermal Cabin Comfort", "Visibility Optimization", "Thermodynamic Seating", "Spa Mode"],
                      },
                      {
                        agent: "Agent C",
                        domain: "Weather",
                        mode: "Road Focus",
                        items: ["Microclimate & Destination Outlook", "En-Route Environmental Timeline", "Active Weather Advisories", "Predictive Road Analytics"],
                      },
                      {
                        agent: "Agent D",
                        domain: "Media",
                        mode: "Entertainment",
                        items: ["Playback Control", "Music Queue", "Audio Engineering", "Source Switching", "Multizone Audio", "Podcast Audiobook Control"],
                      },
                      {
                        agent: "Agent E",
                        domain: "Vehicle Shadow",
                        mode: "Vehicle Health",
                        items: ["Tire Pressure Analytics", "Engine Oil Level Metrics", "Incident Telemetry Recorder", "Hydraulic Brake Fluid Integrity", "Kinetic Brake Pad Wear Analytics"],
                      },
                    ].map(({ agent, domain, mode, items }) => (
                      <div key={agent} className="flex flex-col gap-2">
                        {/* Agent header — fixed min-height so single & double-line labels align */}
                        <div className="flex flex-col items-center justify-center text-center px-1 py-1.5 rounded border border-[#C9B49A]/30 bg-[#1A1A1A] min-h-[44px]">
                          <span className="block text-[8px] md:text-[10px] font-medium tracking-wider text-[#EAEAEA] leading-[1.25]">
                            {agent}
                          </span>
                          <span className="block text-[8px] md:text-[10px] font-medium tracking-wider text-[#EAEAEA] leading-[1.25]">
                            {domain}
                          </span>
                        </div>

                        {/* Capability list — flex-1 stretches all cards to equal height */}
                        <div className="flex-1 rounded bg-[#161616] border border-white/[0.04] px-2.5 py-2.5">
                          <ul className="space-y-[4px]">
                            {items.map(item => (
                              <li key={item} className="flex gap-1.5 items-start">
                                <span className="text-[#C9B49A] text-[6px] md:text-[7px] mt-[4px] shrink-0">•</span>
                                <span className="text-[7px] md:text-[8.5px] text-[#B0B0B0] leading-[1.35]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Mode badge — fixed min-height so single & double-line labels align */}
                        <div className="flex items-center justify-center text-center px-1 rounded bg-[#1A1A1A] border border-[#C9B49A]/20 min-h-[26px]">
                          <span className="text-[7px] md:text-[9px] font-semibold uppercase tracking-[0.12em] text-[#C9B49A] leading-[1.2]">{mode} Mode</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Expanded case-study content ── */}
          <div className="mt-20 space-y-20">

            {/* Project Brief */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <SectionLabel>Project Brief</SectionLabel>
                <div className="space-y-2 text-[13px] text-[#A3A3A3]">
                  <p><span className="text-[#C9B49A]">Project</span> — Adaptive In-Vehicle AI Interface</p>
                  <p><span className="text-[#C9B49A]">Timeline</span> — June – December 2025</p>
                  <p><span className="text-[#C9B49A]">Role</span> — UX Research · Interaction Design · Prototyping</p>
                  <p><span className="text-[#C9B49A]">Unit</span> — BMW Group · ZI-14 · Automotive HMI</p>
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-[15px] text-[#A3A3A3] leading-relaxed mb-5">
                  In-vehicle interfaces are static. They present information uniformly regardless of who is driving, what conditions exist outside, or what cognitive demands the driver is already managing.
                </p>
                <div className="border-l-2 border-[#B39D82]/40 pl-5 py-1">
                  <p className="text-[15px] text-[#EAEAEA] leading-relaxed italic">
                    Design a generative UI system for the BMW X5 that dynamically composes its own interface in response to driver state, environment, and task context — reducing cognitive load while surfacing the right information at the right moment.
                  </p>
                </div>
              </div>
            </div> */}


            <Hairline />

            {/* Research & Design Timeline */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <SectionLabel>Research &amp; Design Timeline</SectionLabel>
                <p className="text-[13px] text-[#A3A3A3] leading-relaxed">
                  Work ran across two parallel tracks: <span className="text-[#EAEAEA]">ORPHEO</span> (interaction design, generative UI architecture, high-fidelity prototyping) and <span className="text-[#EAEAEA]">ALPHA</span> (physiological sensor integration, research framework design, usability testing and data collection).
                </p>
              </div>
              <div className="lg:col-span-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { month: "Jun", phase: "Onboarding & Discovery" },
                    { month: "Jul", phase: "Ideation" },
                    { month: "Aug", phase: "Concept Pitch + Sensors" },
                    { month: "Sep", phase: "Research Framework" },
                    { month: "Oct", phase: "Usability Testing + Iteration" },
                    { month: "Nov", phase: "Refinement + Testing" },
                    { month: "Dec", phase: "Final Design Delivery" },
                  ].map(({ month, phase }) => (
                    <div key={month} className="bg-[#141414] rounded-sm px-4 py-3 border border-white/5">
                      <span className="block text-[11px] uppercase tracking-widest text-[#C9B49A] mb-1">{month}</span>
                      <span className="text-[13px] text-[#A3A3A3]">{phase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}


            <Hairline />

            {/* Skills Applied */}
            <div>
              <SectionLabel>Skills Applied</SectionLabel>
              <div className="overflow-hidden rounded-sm border border-white/8">
                {[
                  { area: "UX Research", detail: "Interpreted biometric and behavioral signals through scenario-based testing to surface interaction principles for high-stakes, low-attention driving contexts" },
                  { area: "Interaction Design", detail: "Designed a generative UI system with context-gated surfacing and glance-budget constraints, prototyped through adaptive driving modes in Figma" },
                  { area: "Systems Thinking", detail: "Modeled multi-agent orchestration across sensor, context, and intent layers to map real-time inputs into legible, prioritized UI decisions" },
                  { area: "Cross-functional", detail: "Translated raw sensor outputs and engineering constraints into shared design requirements, aligning research, product, and engineering on what the car should show and when" },
                ].map(({ area, detail }, i) => (
                  <div key={area} className={`grid grid-cols-12 border-b border-white/5 last:border-b-0 ${i % 2 === 0 ? "bg-[#141414]" : "bg-[#111]"}`}>
                    <div className="col-span-3 p-4 border-r border-white/5">
                      <span className="text-[12px] uppercase tracking-widest text-[#C9B49A]">{area}</span>
                    </div>
                    <div className="col-span-9 p-4">
                      <span className="text-[13px] text-[#A3A3A3] leading-relaxed">{detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Approach — hidden */}
            <div className="hidden">
              <SectionLabel>Research Approach</SectionLabel>
              <p className="text-[14px] text-[#A3A3A3] leading-relaxed max-w-2xl mb-8">
                Grounded in two complementary methods: physiological measurement to capture what drivers cannot self-report, and structured usability testing to observe how they interact with dynamic interfaces.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[
                  {
                    title: "Physiological Data Collection",
                    body: "Integrated a multi-sensor pipeline to capture driver state data that feeds directly into the UI's context gating logic. Design decisions grounded in measurable cognitive and physiological signals rather than self-reported preference alone.",
                    meta: [
                      { label: "Method", value: "Multi-sensor capture" },
                      { label: "Instruments", value: "PSI · PPG · HR · CRM" },
                      { label: "Output", value: "CSV pipeline → context gating" },
                    ],
                    icon: (
                      // Waveform / pulse — biometric capture
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5" />
                      </svg>
                    ),
                  },
                  {
                    title: "Usability Testing Framework",
                    body: "Designed a structured testing framework to evaluate how drivers interact with dynamically generated interfaces under varying scenario conditions. Findings directly informed iteration on the isochrone GenUI concept and real-time layout logic.",
                    meta: [
                      { label: "Method", value: "Scenario-based task testing" },
                      { label: "Window", value: "Oct – Nov 2025" },
                      { label: "Output", value: "GenUI iteration · layout logic" },
                    ],
                    icon: (
                      // Clipboard checklist — structured testing
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <rect x="5" y="4" width="14" height="17" rx="1.5" />
                        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                        <path d="M8.5 11l1.5 1.5L13 9.5" />
                        <path d="M8.5 16l1.5 1.5L13 14.5" />
                      </svg>
                    ),
                  },
                ].map(({ title, body, meta, icon }) => (
                  <div key={title} className="bg-[#141414] rounded-sm border border-white/5 p-6 flex flex-col gap-5">
                    {/* Header — icon + title */}
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-sm flex items-center justify-center border border-[#C9B49A]/30 bg-[#1A1A1A] text-[#C9B49A] shrink-0">
                        {icon}
                      </span>
                      <span className="text-[12px] uppercase tracking-widest text-[#C9B49A]">{title}</span>
                    </div>

                    {/* Body */}
                    <p className="text-[14px] text-[#A3A3A3] leading-relaxed">
                      {body}
                    </p>

                    {/* Methods strip */}
                    <div className="border-t border-white/5 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                      {meta.map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#737373]">{label}</span>
                          <span className="text-[12px] text-[#EAEAEA] leading-snug break-words">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Hairline />

            {/* Key Design Decisions */}
            <div>
              <SectionLabel>Key Design Decisions</SectionLabel>
              <p className="text-[14px] text-[#A3A3A3] mb-8">Three principles shaped every design decision across the project.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Surface, don\u2019t bury",
                    body: "Information the driver needs appears without navigation. The interface assembles itself around context \u2014 snowy roads, an incoming call, a known route \u2014 rather than waiting for the driver to request it.",
                    icon: (
                      // Eye \u2014 visibility / surface
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ),
                  },
                  {
                    title: "Minimum viable glance",
                    body: "Every screen evaluated against a glance budget. Safety-critical data chunked into scannable modules readable in under two seconds without sustained visual attention.",
                    icon: (
                      // Stopwatch \u2014 glance budget
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="12" cy="14" r="7" />
                        <path d="M12 10v4l2 2" />
                        <path d="M9 3h6" />
                        <path d="M12 3v3" />
                      </svg>
                    ),
                  },
                  {
                    title: "State over preference",
                    body: "Driver state data \u2014 fatigue signals, cognitive load, speed \u2014 gates what is shown and how. Comfort controls auto-adjust. Map overlays appear and collapse based on current capacity, not just settings.",
                    icon: (
                      // Pulse line \u2014 biometric / state
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M3 12h4l2-5 3 10 2-7 2 4 2-2h3" />
                      </svg>
                    ),
                  },
                  {
                    title: "Context continuity",
                    body: "The system maintains awareness across modes \u2014 navigation, comfort, media, vehicle health \u2014 orchestrating agents so decisions in one domain inform layout choices in another.",
                    icon: (
                      // Connected nodes \u2014 orchestration / network
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="5" cy="6" r="2" />
                        <circle cx="19" cy="6" r="2" />
                        <circle cx="12" cy="18" r="2" />
                        <path d="M6.5 7.3 10.7 16.7" />
                        <path d="M17.5 7.3 13.3 16.7" />
                        <path d="M7 6h10" />
                      </svg>
                    ),
                  },
                ].map(({ title, body, icon }) => (
                  <div key={title} className="bg-[#141414] rounded-sm p-6 border border-white/5 flex flex-col gap-3">
                    <span className="w-9 h-9 rounded-sm flex items-center justify-center border border-[#C9B49A]/30 bg-[#1A1A1A] text-[#C9B49A]">
                      {icon}
                    </span>
                    <span className="text-[#EAEAEA] text-[13px] font-medium">{title}</span>
                    <span className="text-[13px] text-[#A3A3A3] leading-relaxed">{body}</span>
                  </div>
                ))}
              </div>
            </div>

            <Hairline />

            {/* Interaction Model */}
            <div>
              <SectionLabel>Interaction Model</SectionLabel>
              <div className="rounded-sm border border-white/8 bg-[#141414] p-8">
                <p className="text-[13px] text-[#A3A3A3] leading-relaxed mb-8 max-w-xl">
                  Voice and sensor input become generators of new interface components. The driver does not navigate — the interface responds.
                </p>

                {/* Flow */}
                <div className="flex flex-col gap-0">
                  {[
                    { step: "01", label: "Driver Input", sub: "Voice · Sensor · Telemetry" },
                    { step: "02", label: "Intent Parsing", sub: "NLP · Context classification" },
                    { step: "03", label: "UI Generation", sub: "Component synthesis · Agent selection" },
                    { step: "04", label: "Layout Orchestration", sub: "Priority scoring · Glance-budget check" },
                    { step: "05", label: "Rendered Interface", sub: "Sub-50ms · Auto-dismissed when resolved", hoverImage: "/images/00/BMW_Roadstoavoid.png" },
                  ].map(({ step, label, sub, hoverImage }, i, arr) => (
                    <div key={step} className={`flex flex-col relative ${hoverImage ? "group/step" : ""}`}>
                      <div className="flex items-center gap-5">
                        {/* Step number + node */}
                        <div className="flex flex-col items-center" style={{ width: 36 }}>
                          <div className={`w-9 h-9 rounded-sm flex items-center justify-center border ${i === arr.length - 1 ? "border-[#C9B49A]/60 bg-[#C9B49A]/10" : "border-white/10 bg-[#1a1a1a]"}`}>
                            <span className="text-[10px] tracking-widest text-[#C9B49A]">{step}</span>
                          </div>
                        </div>
                        {/* Label */}
                        <div className={`min-w-0 ${hoverImage ? "cursor-default" : ""}`}>
                          <p className={`text-[13px] font-medium tracking-wide ${i === arr.length - 1 ? "text-[#C9B49A]" : "text-[#E5E5E5]"}`}>
                            {label}
                            {hoverImage && (
                              <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm bg-white/10 text-[9px] uppercase tracking-widest text-white/70">
                                Hover Me
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-[#555] tracking-wide mt-0.5">{sub}</p>
                        </div>
                      </div>
                      {/* Connector */}
                      {i < arr.length - 1 && (
                        <div className="flex items-start gap-5">
                          <div style={{ width: 36 }} className="flex justify-center">
                            <div className="w-px h-6 bg-white/8" />
                          </div>
                        </div>
                      )}

                      {/* Hover image panel */}
                      {hoverImage && (
                        <div
                          className="absolute left-[280px] top-1/2 -translate-y-1/2 z-50 w-[300px] md:w-[400px]
                            opacity-0 translate-x-4 pointer-events-none group-hover/step:opacity-100 group-hover/step:translate-x-0
                            transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                        >
                          <div className="relative rounded-md border border-white/10 bg-[#0C0C0C] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden p-1">
                            <img
                              src={hoverImage}
                              alt={label}
                              className="w-full h-auto object-cover rounded-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Example callout */}
                <div className="mt-8 border border-white/8 rounded-sm bg-[#111] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#C9B49A] mb-2">Example</p>
                  <p className="text-[12px] text-[#A3A3A3] leading-relaxed break-words whitespace-normal">
                    Driver says <span className="text-[#E5E5E5]">"Show me roads to avoid"</span> during a snowstorm → system generates a contextual map overlay with icy patch markers, congestion warnings, and a black ice alert — assembled on demand, dismissed automatically when conditions clear.
                  </p>
                </div>
              </div>
            </div>
            <Hairline />

            {/* High-Fidelity Screens */}
            <div>
              <SectionLabel>High-Fidelity Screens</SectionLabel>
              <p className="text-[13px] text-[#A3A3A3] mb-8 max-w-2xl break-words whitespace-normal">
                Designed in Figma, validated against one primary scenario — Kennedy Expressway, Chicago, 32°F. High information density, genuine safety stakes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Passenger Comfort Panel", body: "Identity, dual-zone temp, seat controls, tire pressure, and range — one glanceable view. No multi-step navigation." },
                  { title: "Danger Zone Map Overlay", body: "Icy patch markers, congestion flags, and black ice alert. Auto-surfaces on weather trigger. Dismissed when conditions clear." },
                  { title: "Snow Readiness Module", body: "Tire pressure, brake wear, road focus mode, heated steering — assembled proactively. Surfaces without being asked." },
                  { title: "Climate Ring Display", body: "Dual-zone temp as ambient rings in the instrument cluster. Communicates state without pulling sustained attention from the road." },
                ].map(({ title, body }) => (
                  <div key={title} className="bg-[#141414] rounded-sm p-6 border border-white/5">
                    <p className="text-[11px] uppercase tracking-widest text-[#C9B49A] mb-2">{title}</p>
                    <p className="text-[13px] text-[#A3A3A3] leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <Hairline />

            {/* Industry Exposure */}
            {/* <div>
              <SectionLabel>Industry Exposure</SectionLabel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-[#141414] rounded-sm p-6 border border-white/5 space-y-4">
                  <div>
                    <p className="text-[#EAEAEA] text-[14px] font-medium mb-0.5">Stanford HAI</p>
                    <p className="text-[11px] uppercase tracking-widest text-[#C9B49A]">September 2025 · Human-Centered AI Symposium</p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Agents are shifting from features within an interface to the interface layer itself \u2014 validating the GenUI orchestrator approach.",
                      "Stanford Medicine\u2019s EHR integration showed AI can move fast in high-stakes, regulated environments \u2014 relevant to automotive safety constraints.",
                      "Haptic and relational modalities are the next frontier for building user trust beyond text \u2014 directly applicable to low-glance HMI design.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-[13px] text-[#A3A3A3] leading-relaxed list-none">
                        <span className="text-[#C9B49A] shrink-0 mt-0.5">\u2014</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#141414] rounded-sm p-6 border border-white/5 space-y-4">
                  <div>
                    <p className="text-[#EAEAEA] text-[14px] font-medium mb-0.5">Google DevFest SV</p>
                    <p className="text-[11px] uppercase tracking-widest text-[#C9B49A]">November 2025 · Google Developer Groups</p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "The four-stage agent lifecycle (Models, Tools, Orchestration, Runtime) gave clearer language for structuring the orchestrator\u2019s decision logic in design documentation.",
                      "Trajectory scoring and hallucination checks as evaluation metrics informed how I thought about testing GenUI consistency across scenarios.",
                      "The shift from writing code to orchestrating agent \u2018brains\u2019 mirrors the shift from designing screens to designing decision systems.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-[13px] text-[#A3A3A3] leading-relaxed list-none">
                        <span className="text-[#C9B49A] shrink-0 mt-0.5">\u2014</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div> */}

            <Hairline />

            {/* IND / myPPMI Relevance */}
            {/* <div>
              <SectionLabel>Why This Work Is Relevant to IND / myPPMI.org</SectionLabel>
              <p className="text-[14px] text-[#A3A3A3] mb-6 max-w-2xl leading-relaxed">
                Designing for drivers navigating complex, high-stakes environments and designing for Parkinson&apos;s research participants managing their own health data share the same fundamental challenge: <span className="text-[#EAEAEA]">surface what matters, reduce friction, and never assume a fixed user state.</span>
              </p>
              <div className="overflow-hidden rounded-sm border border-white/8">
                {[
                  { theme: "Adaptive accessibility", connection: "Designing UI that responds to driver state \u2014 fatigue, cognitive load, motor engagement \u2014 maps directly to designing for PPMI\u2019s participant base: older adults, those with motor symptoms, and users across widely varying digital literacy levels." },
                  { theme: "Research-to-design synthesis", connection: "I built the research framework and used sensor data to drive interface decisions \u2014 not as a handoff but as a continuous loop. IND needs the same: qualitative and quantitative research translated into actionable design for myPPMI." },
                  { theme: "Complex data, human interface", connection: "Translating multi-sensor physiological data into glanceable, non-clinical UI is the same problem as making Parkinson\u2019s biomarker data meaningful and accessible to participants who are not researchers." },
                  { theme: "Global, inclusive design", connection: "Multi-modal, multi-context design for an international platform (50+ BMW markets) developed habits of localization and cultural flexibility directly applicable to PPMI\u2019s 50+ global clinical sites." },
                  { theme: "Healthcare AI context", connection: "Stanford HAI exposure to AI integration in regulated clinical environments (Epic/EHR) provides relevant context for designing responsibly within IND\u2019s research and compliance constraints." },
                ].map(({ theme, connection }, i) => (
                  <div key={theme} className={`grid grid-cols-12 border-b border-white/5 last:border-b-0 ${i % 2 === 0 ? "bg-[#141414]" : "bg-[#111]"}`}>
                    <div className="col-span-3 p-4 border-r border-white/5">
                      <span className="text-[12px] uppercase tracking-widest text-[#C9B49A]">{theme}</span>
                    </div>
                    <div className="col-span-9 p-4">
                      <span className="text-[13px] text-[#A3A3A3] leading-relaxed">{connection}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-white/5" />

        {/* ─── Project 01: SmaSH Lab | Proactive Agent ─── */}
        <motion.article id="project-01" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left — imagery (reversed column) */}
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              {/* ── Inline Speech-Flow Chart (translucent navy panel) ── */}
              <div
                className="rounded-md border border-[#60A5FA]/20 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
                style={{ background: "rgba(11, 28, 48, 0.55)" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#7DD3FC] font-semibold">Speech Pipeline</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400">Real-time</span>
                </div>

                {/* Sample utterance caption */}
                <p className="text-[11px] md:text-[12px] text-slate-400 italic mb-5 leading-snug">
                  Sample input: <span className="text-slate-200 not-italic">&ldquo;hey um, can you turn up the… volume thing?&rdquo;</span>
                </p>

                {/* Flow chart SVG */}
                <svg
                  viewBox="0 0 1000 1140"
                  className="w-full h-auto block"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ fontFamily: "inherit" }}
                >
                  <defs>
                    {/* Arrow marker */}
                    <marker id="pa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M0,1 L9,5 L0,9 Z" fill="#60A5FA" />
                    </marker>
                    {/* Soft drop shadow for boxes */}
                    <filter id="pa-shadow" x="-5%" y="-5%" width="110%" height="120%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.10" />
                    </filter>
                  </defs>

                  {/* ── 1. User Input Speech — pill ── */}
                  <g filter="url(#pa-shadow)">
                    <rect x="40" y="14" width="560" height="100" rx="50" fill="white" stroke="#60A5FA" strokeWidth="3" />
                  </g>
                  <text x="320" y="64" textAnchor="middle" dominantBaseline="central"
                    fontSize="26" fontWeight="700" fill="#0F172A">User Input Speech</text>

                  {/* Dashed connector with open dots (source link) */}
                  <circle cx="320" cy="124" r="5" fill="white" stroke="#60A5FA" strokeWidth="2" />
                  <line x1="320" y1="132" x2="320" y2="184" stroke="#60A5FA" strokeWidth="2" strokeDasharray="6 6" />
                  <circle cx="320" cy="192" r="5" fill="white" stroke="#60A5FA" strokeWidth="2" />

                  {/* ── 2. Audio Dataset — large rounded rect with list ── */}
                  <g filter="url(#pa-shadow)">
                    <rect x="40" y="200" width="560" height="320" rx="22" fill="white" stroke="#60A5FA" strokeWidth="3" />
                  </g>
                  <text x="90" y="246" fontSize="26" fontWeight="700" fill="#0F172A">Audio Dataset</text>
                  {[
                    "Prompt Relevant Speech File",
                    "Prompt Irrelevant Speech Files",
                    "Formal Speech Files",
                    "Informal Speech Files",
                    "Background Noise Speech Files",
                  ].map((item, i) => {
                    const y = 308 + i * 38;
                    return (
                      <g key={item}>
                        <circle cx="130" cy={y - 5} r="3.5" fill="#0F172A" />
                        <text x="150" y={y} fontSize="18" fill="#1E293B">{item}</text>
                      </g>
                    );
                  })}

                  {/* Connector ↓ to Speech To Text */}
                  <circle cx="320" cy="528" r="5" fill="white" stroke="#60A5FA" strokeWidth="2" />
                  <line x1="320" y1="536" x2="320" y2="588" stroke="#60A5FA" strokeWidth="2.5" markerEnd="url(#pa-arrow)" />

                  {/* ── 3. Speech To Text — rounded rect ── */}
                  <g filter="url(#pa-shadow)">
                    <rect x="40" y="598" width="560" height="140" rx="22" fill="white" stroke="#60A5FA" strokeWidth="3" />
                  </g>
                  <text x="320" y="650" textAnchor="middle" dominantBaseline="central"
                    fontSize="26" fontWeight="700" fill="#0F172A">Speech To Text</text>
                  <text x="320" y="694" textAnchor="middle" dominantBaseline="central"
                    fontSize="22" fontWeight="700" fill="#0F172A">NLP + Semantic Analysis</text>

                  {/* Side annotation: Labeled Audio Dataset */}
                  <line x1="600" y1="668" x2="668" y2="668" stroke="#60A5FA" strokeWidth="2" strokeDasharray="5 5" />
                  <rect x="668" y="618" width="3" height="100" fill="#60A5FA" />
                  <g filter="url(#pa-shadow)">
                    <rect x="680" y="610" width="290" height="116" rx="6" fill="#EFF6FF" stroke="#60A5FA" strokeWidth="1.8" />
                  </g>
                  <text x="700" y="646" fontSize="16" fontWeight="700" fill="#0F172A">Labeled Audio Dataset:</text>
                  <text x="700" y="676" fontSize="15" fill="#1E293B">For validating semantic</text>
                  <text x="700" y="696" fontSize="15" fill="#1E293B">recognition</text>

                  {/* Connector ↓ to Classification */}
                  <circle cx="320" cy="746" r="5" fill="white" stroke="#60A5FA" strokeWidth="2" />
                  <line x1="320" y1="754" x2="320" y2="794" stroke="#60A5FA" strokeWidth="2.5" markerEnd="url(#pa-arrow)" />

                  {/* ── 4. Classification — diamond ── */}
                  <g filter="url(#pa-shadow)">
                    <polygon points="320,800 530,920 320,1040 110,920"
                      fill="white" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round" />
                  </g>
                  <text x="320" y="900" textAnchor="middle" dominantBaseline="central"
                    fontSize="24" fontWeight="700" fill="#0F172A">Classification</text>
                  {/* Sub-question with bullet */}
                  <circle cx="208" cy="938" r="3.5" fill="#0F172A" />
                  <text x="222" y="942" fontSize="17" fill="#1E293B">Are semantics relevant</text>
                  <text x="222" y="966" fontSize="17" fill="#1E293B">to the system?</text>

                  {/* Side annotation: Evaluation notes */}
                  <line x1="530" y1="920" x2="668" y2="920" stroke="#60A5FA" strokeWidth="2" strokeDasharray="5 5" />
                  <rect x="668" y="830" width="3" height="180" fill="#60A5FA" />
                  <g filter="url(#pa-shadow)">
                    <rect x="680" y="820" width="290" height="200" rx="6" fill="#EFF6FF" stroke="#60A5FA" strokeWidth="1.8" />
                  </g>
                  {/* Annotation text — two bullet entries */}
                  <text x="700" y="858" fontSize="14" fill="#3B82F6" fontWeight="700">▸</text>
                  <text x="718" y="858" fontSize="14" fill="#1E293B">In evaluation, loop through all</text>
                  <text x="718" y="878" fontSize="14" fill="#1E293B">audio files/dataset to calculate</text>
                  <text x="718" y="898" fontSize="14" fill="#1E293B">accuracy</text>
                  <text x="700" y="938" fontSize="14" fill="#3B82F6" fontWeight="700">▸</text>
                  <text x="718" y="938" fontSize="14" fill="#1E293B">the evaluation process involves</text>
                  <text x="718" y="958" fontSize="14" fill="#1E293B">systematically looping through all</text>
                  <text x="718" y="978" fontSize="14" fill="#1E293B">audio files to calculate model</text>
                  <text x="718" y="998" fontSize="14" fill="#1E293B">accuracy.</text>

                  {/* Branch connector — open dot at diamond bottom */}
                  <circle cx="320" cy="1046" r="5" fill="white" stroke="#60A5FA" strokeWidth="2" />

                  {/* YES branch — left, with rounded turn */}
                  <path d="M 320 1054 L 320 1066 Q 320 1078 308 1078 L 152 1078 Q 140 1078 140 1090 L 140 1108"
                    stroke="#60A5FA" strokeWidth="2.5" fill="none" markerEnd="url(#pa-arrow)" strokeLinejoin="round" strokeLinecap="round" />

                  {/* NO branch — right, with rounded turn */}
                  <path d="M 320 1054 L 320 1066 Q 320 1078 332 1078 L 488 1078 Q 500 1078 500 1090 L 500 1108"
                    stroke="#60A5FA" strokeWidth="2.5" fill="none" markerEnd="url(#pa-arrow)" strokeLinejoin="round" strokeLinecap="round" />

                  {/* Check badge — YES */}
                  <g filter="url(#pa-shadow)">
                    <circle cx="140" cy="1098" r="18" fill="#60A5FA" stroke="white" strokeWidth="2" />
                  </g>
                  <path d="M 131 1098 L 138 1105 L 150 1092" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                  {/* X badge — NO */}
                  <g filter="url(#pa-shadow)">
                    <circle cx="500" cy="1098" r="18" fill="#60A5FA" stroke="white" strokeWidth="2" />
                  </g>
                  <path d="M 491 1089 L 509 1107 M 509 1089 L 491 1107" stroke="white" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                </svg>

                {/* Output row — Agent Responds | Agent Ignores */}
                <div className="grid grid-cols-2 gap-4 -mt-2">
                  <div className="rounded-2xl border-[3px] border-[#60A5FA] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.10)] py-4 px-4 text-center">
                    <span className="text-[15px] md:text-[17px] font-bold text-slate-900 tracking-tight">Agent Responds</span>
                  </div>
                  <div className="rounded-2xl border-[3px] border-[#60A5FA] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.10)] py-4 px-4 text-center">
                    <span className="text-[15px] md:text-[17px] font-bold text-slate-900 tracking-tight">Agent Ignores</span>
                  </div>
                </div>

                {/* Footer metric */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.22em] text-slate-400">Classification Accuracy</span>
                  <span className={`${outfit.className} text-[16px] text-white font-light`}>&gt;90<span className="text-[#7DD3FC]">%</span></span>
                </div>
              </div>
              {/* NLP diagram */}
              {/* <div className="bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                <img src="/images/01/NLP01.png" alt="NLP Semantic Analysis" className="w-[85%] h-auto opacity-70 invert" />
              </div> */}
              {/* ── Response Accuracy — Formal vs Informal Comparison ── */}
              <div
                className="rounded-md border border-[#60A5FA]/20 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
                style={{ background: "rgba(11, 28, 48, 0.55)" }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-[#7DD3FC] font-semibold">Response Accuracy</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400">Formal vs Informal</span>
                </div>

                {/* Caption */}
                <p className="text-[11px] md:text-[12px] text-slate-400 italic mb-5 leading-snug">
                  Classification accuracy across speech conditions, split by speaking style.
                </p>

                {/* Legend */}
                <div className="flex items-center gap-5 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(90deg,#38BDF8,#7DD3FC)", boxShadow: "0 0 8px rgba(56,189,248,0.5)" }} />
                    <span className="text-[10.5px] uppercase tracking-[0.18em] text-slate-200 font-medium">Formal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm border border-[#7DD3FC]/60" style={{ background: "rgba(125,211,252,0.15)" }} />
                    <span className="text-[10.5px] uppercase tracking-[0.18em] text-slate-200 font-medium">Informal</span>
                  </div>
                </div>

                {/* Vertical double-bar chart */}
                {(() => {
                  const data = [
                    { condition: "Prompt Relevant", formal: 96, informal: 93 },
                    { condition: "Prompt Irrelevant", formal: 94, informal: 90 },
                    { condition: "Background Noise", formal: 89, informal: 84 },
                  ];
                  return (
                    <div>
                      {/* Chart area */}
                      <div className="relative pt-6" style={{ height: 280 }}>
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-6 bottom-7 w-7 flex flex-col justify-between items-end text-[9px] text-slate-500 tracking-wide">
                          <span>100</span>
                          <span>75</span>
                          <span>50</span>
                          <span>25</span>
                          <span>0</span>
                        </div>

                        {/* Plot area */}
                        <div className="absolute left-9 right-2 top-6 bottom-7">
                          {/* Horizontal gridlines */}
                          {[0, 25, 50, 75, 100].map(v => (
                            <div
                              key={v}
                              className="absolute left-0 right-0 h-px bg-white/[0.06]"
                              style={{ bottom: `${v}%` }}
                            />
                          ))}

                          {/* Bar groups */}
                          <div className="absolute inset-0 flex items-end justify-around">
                            {data.map(({ condition, formal, informal }, i) => (
                              <div key={condition} className="relative flex items-end gap-1.5 h-full">
                                {/* Formal bar column */}
                                <div className="relative h-full w-9 md:w-11">
                                  {/* Value label */}
                                  <span
                                    className={`${outfit.className} absolute left-1/2 -translate-x-1/2 text-[10.5px] md:text-[11.5px] text-white font-light whitespace-nowrap`}
                                    style={{ bottom: `calc(${formal}% + 4px)` }}
                                  >
                                    {formal}<span className="text-[#7DD3FC] text-[8.5px]">%</span>
                                  </span>
                                  {/* Bar */}
                                  <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${formal}%` }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="absolute bottom-0 left-0 right-0 rounded-t-md"
                                    style={{
                                      background: "linear-gradient(180deg, #7DD3FC 0%, #38BDF8 100%)",
                                      boxShadow: "0 0 12px rgba(56,189,248,0.4)",
                                    }}
                                  />
                                </div>

                                {/* Informal bar column */}
                                <div className="relative h-full w-9 md:w-11">
                                  <span
                                    className={`${outfit.className} absolute left-1/2 -translate-x-1/2 text-[10.5px] md:text-[11.5px] text-slate-200 font-light whitespace-nowrap`}
                                    style={{ bottom: `calc(${informal}% + 4px)` }}
                                  >
                                    {informal}<span className="text-[#7DD3FC] text-[8.5px]">%</span>
                                  </span>
                                  <motion.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${informal}%` }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, delay: i * 0.15 + 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="absolute bottom-0 left-0 right-0 rounded-t-md border border-b-0 border-[#7DD3FC]/60"
                                    style={{
                                      background: "rgba(125,211,252,0.16)",
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* X-axis labels */}
                      <div className="ml-9 mr-2 mt-2 flex justify-around items-start">
                        {data.map(({ condition }) => (
                          <div key={condition} className="flex flex-col items-center text-center max-w-[110px]">
                            <span className="text-[10.5px] md:text-[11.5px] text-slate-200 font-medium tracking-wide leading-tight">
                              {condition}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Footer metric */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.22em] text-slate-400">Overall Mean Accuracy</span>
                  <span className={`${outfit.className} text-[20px] text-white font-light`}>
                    &gt;90<span className="text-[#7DD3FC]">%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right — meta + content */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#EAEAEA] leading-none`}>01</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[#C9B49A]">CMU SmaSH Lab</span>

                {/* Jellyfish button + aquarium panel (hover preview, click to pin) */}
                <div className="relative group/jelly shrink-0">
                  {/* The button */}
                  <button
                    onClick={() => setPinned(p => !p)}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer
                      group-hover/jelly:scale-110
                      ${pinned
                        ? 'border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                        : 'border-[#93C5FD]/60 hover:border-[#93C5FD] group-hover/jelly:shadow-[0_0_16px_rgba(147,197,253,0.45)]'
                      }`}
                    style={{ background: 'radial-gradient(circle at 40% 35%, #0a2a3a 0%, #041520 55%, #020d18 100%)' }}
                    aria-label={pinned ? 'Unpin Aquarium' : 'Pin Aquarium'}
                  >
                    <img src="/images/kawaii_jellyfish.png" alt="Jellyfish" className="w-full h-full object-cover" />
                  </button>

                  {/* Aquarium panel: shows on hover OR when pinned */}
                  <div
                    className={`absolute left-14 top-1/2 -translate-y-1/2 z-50 w-[340px]
                      transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                      ${pinned
                        ? 'opacity-100 translate-x-0 pointer-events-auto'
                        : 'opacity-0 translate-x-2 pointer-events-none group-hover/jelly:opacity-100 group-hover/jelly:translate-x-0'
                      }`}
                  >
                    <div className="relative rounded-[28px] border-2 border-[#38BDF8] bg-[#050d1a]/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(56,189,248,0.15),inset_0_0_60px_rgba(0,20,50,0.6)] overflow-hidden">
                      {/* Diorama image */}
                      <div className="relative">
                        <img
                          src="/images/deep_sea_diorama.png"
                          alt="Deep Sea Diorama"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a]/60 via-transparent to-[#050d1a]/20 pointer-events-none" />
                      </div>

                      {/* X close button — only visible when pinned */}
                      {pinned && (
                        <button
                          onClick={e => { e.stopPropagation(); setPinned(false); }}
                          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/40 border border-white/20 flex items-center justify-center hover:bg-black/70 hover:border-white/50 transition-all duration-200"
                          aria-label="Close"
                        >
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <line x1="1" y1="1" x2="7" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="7" y1="1" x2="1" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#EAEAEA] mb-1`}>
                  Proactive Agent
                </h2>
                <p className="text-[12px] tracking-widest uppercase text-[#A3A3A3] mb-6">
                  2024 Sep – 2025 Aug &nbsp;·&nbsp; Research Assistant
                </p>

                <div className="space-y-6 text-[15px] text-[#A3A3A3] leading-relaxed">
                  {/* The Problem */}
                  <div>
                    <SectionLabel>The Problem</SectionLabel>
                    <div className="bg-[#1A1A1A] rounded-sm p-6 border border-white/10">
                      <p className="text-[13px] mb-3">
                        Voice assistants react to whatever they hear. They transcribe filler, misread half-finished thoughts, and respond when nobody was talking to them — then stay silent at the moment a user actually needs help.
                      </p>
                      <p className="text-[13px]">
                        <span className="text-[#EAEAEA] font-medium">Design challenge:</span> Classify intent from noisy, real-world speech so the agent acts only when the signal is clear.
                      </p>
                    </div>
                  </div>

                  <Hairline />

                  {/* Overview */}
                  <div>
                    <SectionLabel>Overview</SectionLabel>
                    <p className="text-[13px]">
                      Researched &amp; built a semantic classification pipeline for adaptive multimodal systems that isolates relevant user intent from environmental noise and linguistic variations, achieving &gt;90% response accuracy.
                    </p>
                  </div>

                  <Hairline />

                  {/* Key Contributions */}
                  <div>
                    <SectionLabel>Key Contributions</SectionLabel>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>NLP pipeline development</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>User intent prediction model</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>Real-time response generation</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Impact */}
                  <div>
                    <SectionLabel>Impact</SectionLabel>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="font-semibold text-[#EAEAEA]">Robust Semantic Orchestration:</span> Engineered a classification pipeline that bridges the gap between raw speech-to-text and actionable intent, handling the nuance of informal speech.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="font-semibold text-[#EAEAEA]">Multimodal Scalability:</span> Created a modular framework for adaptive systems that can be integrated into various hardware environments, from smart homes to automotive HMIs.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="font-semibold text-[#EAEAEA]">Real-time Decision Logic:</span> Developed the logic for "Agent Responds vs. Agent Ignores," a critical component for the next generation of "always-on" ambient computing.</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Performance metric */}
                  <div className="pt-2">
                    <SectionLabel>Performance Metric</SectionLabel>
                    <span className={`${outfit.className} text-2xl text-[#EAEAEA]`}>&gt;90% Accuracy</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-white/5" />

        {/* ─── Project 02: AI Trend Forecasting ─── */}
        <motion.article id="project-02" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start justify-center">

            {/* Left — meta + content */}
            <div className="lg:col-span-6 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#EAEAEA]`}>02</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[#C9B49A]">CMU & Surefront</span>
              </div>

              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#EAEAEA] mb-1`}>
                  AI Trend Forecasting
                </h2>
                <p className="text-[12px] tracking-widest uppercase text-[#A3A3A3] mb-6">
                  2024 Jan – 2024 Aug &nbsp;·&nbsp; UX Researcher &amp; Developer
                </p>

                <div className="space-y-6 text-[15px] text-[#A3A3A3] leading-relaxed">
                  {/* Overview */}
                  <div>
                    <SectionLabel>Overview</SectionLabel>
                    <p>
                      Built a B2B tool designed to bridge the gap between high-level data analytics and creative execution. It leverages real-time data and AI to empower fashion professionals — from designers to merchandisers — to make informed, proactive decisions.
                    </p>
                  </div>

                  <Hairline />

                  {/* Key Features */}
                  <div>
                    <SectionLabel>Key Features</SectionLabel>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Dynamic Data Integration:</span> Built to process and visualize real-time growth metrics, search volumes, and month-over-month performance curves.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Agentic AI Implementation:</span> The Personal Fashion Assistant democratizes data — instead of navigating three layers of menus, a user can simply ask: "What footwear is trending in Paris right now?"</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Advanced Analytics &amp; Visualization:</span> Real-time growth metrics, search volumes, and month-over-month performance curves.</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Impact */}
                  <div>
                    <SectionLabel>Impact</SectionLabel>
                    <ul className="space-y-5">
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">75% Reduction in Research Latency:</span> Consolidating real-time APIs into a single HMI — reducing validation time from 4 hours of manual cross-referencing to &lt;60 seconds.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">90% Decrease in Interaction Cost:</span> Replaced a 12-click multi-step filtering process with a single natural language input, significantly lowering cognitive load for non-technical stakeholders.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Trend Velocity Accuracy:</span> Month-over-month performance curves provide a 42.5% more granular view of trend momentum vs. traditional static quarterly reports.</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <SectionLabel>Research Latency</SectionLabel>
                      <span className={`${outfit.className} text-2xl text-[#EAEAEA]`}>−75%</span>
                    </div>
                    <div>
                      <SectionLabel>Interaction Cost</SectionLabel>
                      <span className={`${outfit.className} text-2xl text-[#EAEAEA]`}>−90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — imagery stacked vertically, framed in semi-transparent panels (enlarged ~30%, grows rightward) */}
            <div className="lg:col-span-4 flex flex-col gap-4 lg:scale-[1.30] lg:origin-top-left lg:ml-4">
              {/* Dashboard — framed, image scales within panel */}
              <div
                className="w-full rounded-md border border-[#C9B49A]/15 p-4 md:p-5 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.4)]"
                style={{ background: "rgba(20, 18, 14, 0.42)" }}
              >
                <div className="w-full aspect-[3/4] overflow-hidden rounded-sm bg-black/20">
                  <img
                    src="/images/02/trend_forecasting_dashboard 1.png"
                    alt="AI Trend Forecasting Dashboard"
                    className="w-full h-full object-contain object-center opacity-95 hover:opacity-100 hover:scale-[1.02] transition-all duration-700 ease-out"
                  />
                </div>
              </div>

              {/* Surefront Interviews — framed, image scales within panel */}
              <div
                className="w-full rounded-md border border-[#C9B49A]/15 p-4 md:p-5 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.4)]"
                style={{ background: "rgba(20, 18, 14, 0.42)" }}
              >
                <div className="w-full aspect-[3/2] overflow-hidden rounded-sm bg-black/20">
                  <img
                    src="/images/02/SurefrontInterviews.png"
                    alt="Surefront Interviews"
                    className="w-full h-full object-contain object-center opacity-95 hover:opacity-100 hover:scale-[1.02] transition-all duration-700 ease-out"
                  />
                </div>
              </div>
            </div>

          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-white/5" />

        {/* ─── Project 03: Emma's Tree ─── */}
        <motion.article id="project-03" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left — imagery */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
              <div className="w-[70%] mx-auto aspect-[3/4] overflow-hidden bg-[#141414] rounded-sm">
                <img src="/images/03/emmastree.png" alt="Emma's Tree"
                  className="w-full h-full object-cover object-top opacity-80 hover:opacity-100 transition-all duration-1000 ease-out" />
              </div>
              <div className="bg-[#141414] rounded-sm p-10 flex items-center justify-center">
                <img src="/images/03/treesystem.png" alt="Tree System" className="w-[90%] h-auto opacity-90 mx-auto" />
              </div>
              <div className="bg-[#141414] rounded-sm p-10 flex items-center justify-center">
                <img src="/images/03/tempchange.png" alt="Temperature Change" className="w-[90%] h-auto opacity-90 mx-auto" />
              </div>
            </div>

            {/* Right — meta + content */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#EAEAEA]`}>03</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[#C9B49A]">Biomimicry Hardware</span>
              </div>

              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#EAEAEA] mb-1`}>
                  Emma&apos;s Tree
                </h2>
                <p className="text-[12px] tracking-widest uppercase text-[#A3A3A3] mb-6">
                  2023 Jun – 2024 Jun &nbsp;·&nbsp; Designer &amp; Developer
                </p>

                <div className="space-y-12 text-[15px] text-[#A3A3A3] leading-relaxed">
                  {/* The Problem */}
                  <div>
                    <SectionLabel>The Problem</SectionLabel>
                    <div className="bg-[#1A1A1A] rounded-sm p-6 border border-white/10">
                      <p className="mb-3">
                        My best friend Emma is a medical student who wanted a plant but knew she&apos;d kill it, not out of carelessness, but because 80-hour weeks leave no room for it. Existing alternatives are either lifeless decorations or still demand the attention she doesn&apos;t have, failing to capture what makes plants worth having in the first place.
                      </p>
                      <p>
                        <span className="text-[#EAEAEA] font-medium">Design Challenge:</span> Design a plant for Emma that she can never kill. Still reacting to sunlight, signaling when it wants water, and changing with the seasons, so it feels alive without ever depending on her to keep it that way.
                      </p>
                    </div>
                  </div>

                  <Hairline />

                  {/* Overview */}
                  <div>
                    <SectionLabel>Overview</SectionLabel>
                    <p>
                      Built this tree for a med student who wanted greenery without maintenance stress. Using biomimicry, the tree reacts to environmental changes just like a real organism — a functional, stress-free monitor designed to never die.
                    </p>
                  </div>

                  <Hairline />

                  {/* Key Highlights */}
                  <div>
                    <SectionLabel>Key Highlights</SectionLabel>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">The "Bloom" Effect:</span> Temperature Sensitive Filament enables color transformation on touch or warmth.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Moisture Sensing:</span> Moisture Sensor signals watering cues organically.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Visual Feedback:</span> LED Indicators communicate environmental state at a glance.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Growth &amp; Structure:</span> 3D Pen for organic branching forms.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span><span className="text-[#EAEAEA]">Sustainability:</span> Solar-powered Battery Bank.</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Design Thinking */}
                  <div>
                    <SectionLabel>Design Thinking</SectionLabel>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>Designed using biomimicry to solve "care fatigue" — a synthetic plant that lives and reacts right along with Emma. Temperature-sensitive filaments and environmental sensors make it a responsive sensory anchor that mimics the energy of a real plant.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>Natural materials — real moss, a ceramic pot — keep the technology grounded rather than clinical, delivering restorative nature vibes that are durable and emotionally meaningful.</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {["Temp Filament", "Moisture Sensor", "LED Feedback", "3D Pen", "Solar Power"].map(tag => (
                      <span key={tag} className="text-[11px] uppercase tracking-widest text-[#A3A3A3] border border-white/20 px-3 py-1 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.article>

        {/* ─── More Projects Header ─── */}
        <div className="pt-16 pb-12 text-center">
          <h2 className={`${outfit.className} text-3xl md:text-4xl font-light text-[#EAEAEA]`}>
            More things I built! ＿〆(。╹‿ ╹ 。)
          </h2>
        </div>

        {/* ─── Sticky Filter Bar ──────────────────────────────────────────── */}
        <div
          ref={filterBarRef}
          className="sticky top-0 z-40 -mx-8 md:-mx-16 px-8 md:px-16 py-4 border-b border-white/5"
          style={{ background: "rgba(12,12,12,0.92)", backdropFilter: "blur(14px)" }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            {/* Label */}
            <span className="text-[12px] uppercase tracking-[0.2em] text-[#5a5a5a] shrink-0 mr-1">Filter</span>
            {/* All pill */}
            <button
              onClick={() => setActiveFilter(null)}
              className="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide border transition-all duration-300 cursor-pointer whitespace-nowrap"
              style={activeFilter === null
                ? { background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.40)", color: "#EAEAEA" }
                : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)", color: "#888" }
              }
            >
              <span className="w-2 h-2 rounded-full bg-[#EAEAEA] shrink-0"
                style={{ opacity: activeFilter === null ? 1 : 0.3 }} />
              All
            </button>
            {/* Category pills */}
            {ALL_CATEGORIES.map((cat) => (
              <FilterCategoryButton
                key={cat}
                cat={cat}
                isActive={activeFilter === cat}
                onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
              />
            ))}
          </div>

        </div>

        {/* ─── Selected Projects ─── */}
        <section id="selected-projects" className="pt-12">
          <h2 className={`${outfit.className} text-3xl font-light text-[#EAEAEA] mb-12`}>
            Selected Projects
          </h2>
          <div className="grid grid-cols-6 gap-2">
            {(activeFilter === null
              ? ALL_PROJECTS
              : ALL_PROJECTS.filter(item => item.categories.includes(activeFilter))
            ).map((item) => (
              <FilteredThumb key={item.alt} item={item} activeFilter={activeFilter} outfitClass={outfit.className} />
            ))}
          </div>
        </section>

        {/* ─── About Me & Footer Transition ─── */}
        <section id="about-me" className="-mx-8 md:-mx-16 relative pt-48 pb-32 overflow-hidden flex flex-col items-center">

          {/* Font Import for Pixel Text */}
          <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');" }} />

          {/* Black Background */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[#0C0C0C]" />

          {/* Pixel Stars Overlay
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `url("data:image/svg+xml,%3Csvg width='240' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 30h1v1h-1zM110 200h1v1h-1zM10 100h1v1h-1z' fill='%23ffffff' fill-opacity='0.3'/%3E%3Cpath d='M140 60h2v2h-2zM80 150h2v2h-2zM210 180h2v2h-2z' fill='%23ffffff' fill-opacity='0.5'/%3E%3Cpath d='M170 110h3v3h-3z' fill='%23ffffff' fill-opacity='0.8'/%3E%3C/svg%3E")`,
              backgroundSize: "240px 240px",
              imageRendering: "pixelated"
            }}
          /> */}

          {/* About Me Title */}
          <div className="relative z-10 w-full max-w-[1600px] px-8 md:px-10 flex flex-col items-center justify-center pt-24 pb-32">
            <h2 className="text-2xl md:text-4xl text-white tracking-widest drop-shadow-[4px_4px_0_rgba(0,0,0,0.4)]" style={{ fontFamily: "'Press Start 2P', cursive", imageRendering: "pixelated" }}>
              About Me
            </h2>
          </div>

          {/* ─── Contact Footer ─── */}
          <footer id="project-meet" className="relative z-10 w-full max-w-[1600px] px-8 md:px-16 flex justify-center">
            <div className="relative w-full max-w-3xl mx-auto group">
              <img
                src="/images/NiceToMeetYou/myboard.png"
                alt="My Contact Board"
                className="w-full h-auto object-contain rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              />

              {/* Gmail Hover Area */}
              <div
                className="absolute z-20 block group/gmail cursor-pointer"
                style={{ left: '26.5%', top: '15.5%', width: '10.5%', height: '10.5%' }}
                onClick={() => {
                  navigator.clipboard.writeText("by.rinakim@gmail.com");
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
              >
                {/* Distinctive hover outline */}
                <div className="w-full h-full rounded-sm border-4 border-transparent group-hover/gmail:border-black/30 group-hover/gmail:bg-white/10 group-hover/gmail:scale-110 transition-all duration-300" />

                {/* Copy/Pasteable Tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6 pointer-events-none opacity-0 group-hover/gmail:opacity-100 group-hover/gmail:pointer-events-auto group-hover/gmail:translate-x-2 transition-all duration-300 z-50">
                  <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                    <p className={`${copiedEmail ? "text-green-500" : "text-black"} text-[12px] font-bold whitespace-nowrap mb-2`} style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                      {copiedEmail ? "Copied!" : "Click to copy!"}
                    </p>
                    <a href="mailto:by.rinakim@gmail.com" className="block text-gray-500 hover:text-black transition-colors select-all cursor-pointer font-bold"
                      style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", fontSize: "10px" }}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText("by.rinakim@gmail.com");
                        setCopiedEmail(true);
                        setTimeout(() => setCopiedEmail(false), 2000);
                      }}>
                      by.rinakim@gmail.com
                    </a>

                    {/* Bubble tail left */}
                    <div className="absolute -left-[16px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-black" />
                    <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-white" />
                  </div>
                </div>
              </div>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/rina-kim-9a3864171/"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute z-10 block group/linkedin"
                style={{ left: '26.5%', top: '28.5%', width: '10.5%', height: '10.5%' }}
                aria-label="LinkedIn Profile"
              >
                <div className="w-full h-full rounded-sm border-4 border-transparent group-hover/linkedin:border-black/30 group-hover/linkedin:bg-white/10 group-hover/linkedin:scale-110 transition-all duration-300 cursor-pointer" />
                {/* Tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6 pointer-events-none opacity-0 group-hover/linkedin:opacity-100 group-hover/linkedin:translate-x-2 transition-all duration-300 z-50">
                  <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                    <p className="text-black text-[12px] font-bold whitespace-nowrap" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                      Connect with me!
                    </p>

                    {/* Bubble tail left */}
                    <div className="absolute -left-[16px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-black" />
                    <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-white" />
                  </div>
                </div>
              </a>

              {/* Nana Polaroid Hover */}
              <div
                className="absolute z-10 block cursor-pointer group/nana"
                style={{ left: '38%', top: '35%', width: '14.5%', height: '25%' }}
              >
                <div className="w-full h-full rounded-sm group-hover/nana:bg-white/10 transition-colors duration-300" />
                {/* Pop-out image */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[240px] sm:w-[320px] pointer-events-none opacity-0 group-hover/nana:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                  <div className="relative rounded-sm border-[6px] border-[#F2F0E6] bg-[#F2F0E6] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden p-1 pb-12 transform -rotate-2">
                    <img src="/images/NiceToMeetYou/nana01.jpg" alt="Nana" className="w-full h-auto object-cover border border-black/10" />
                    <p className="absolute bottom-3 left-0 w-full text-center text-[#333] font-medium text-lg" style={{ fontFamily: "'Marker Felt', 'Comic Sans MS', cursive" }}>Nana</p>
                  </div>
                </div>
              </div>

              {/* Cortada Polaroid Hover */}
              <div
                className="absolute z-10 block cursor-pointer group/cortada"
                style={{ left: '50.5%', top: '16.5%', width: '15.5%', height: '24%' }}
              >
                <div className="w-full h-full rounded-sm group-hover/cortada:bg-white/10 transition-colors duration-300" />
                {/* Pop-out image */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[240px] sm:w-[320px] pointer-events-none opacity-0 group-hover/cortada:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                  <div className="relative rounded-sm border-[6px] border-[#F2F0E6] bg-[#F2F0E6] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden p-1 pb-12 transform rotate-2">
                    <img src="/images/NiceToMeetYou/cortada01.JPEG" alt="Cortada" className="w-full h-auto object-cover border border-black/10" />
                    <p className="absolute bottom-3 left-0 w-full text-center text-[#333] font-medium text-lg" style={{ fontFamily: "'Marker Felt', 'Comic Sans MS', cursive" }}>Cortada</p>
                  </div>
                </div>
              </div>

              {/* Pennant Hover */}
              <div
                className="absolute z-10 block group/pennant"
                style={{ left: '68%', top: '9%', width: '28%', height: '18%' }}
              >
                <div className="w-full h-full rounded-sm group-hover/pennant:bg-white/5 transition-colors duration-300 cursor-help" />

                {/* Pixelated thought bubble */}
                <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/pennant:opacity-100 group-hover/pennant:-translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                    <p className="text-black text-[12px] font-bold whitespace-nowrap text-center" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                      CMU MHCI &apos;25!
                    </p>
                    {/* Bubble tail */}
                    <div className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black" />
                    <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white" />
                  </div>
                </div>
              </div>

              {/* Bouquet Hover */}
              <div
                className="absolute z-10 block group/bouquet"
                style={{ left: '16%', top: '32%', width: '22%', height: '48%' }}
              >
                <div className="w-full h-full rounded-sm group-hover/bouquet:bg-white/5 transition-colors duration-300 cursor-help" />

                {/* Pixelated thought bubble floating to the left */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-6 pointer-events-none opacity-0 group-hover/bouquet:opacity-100 group-hover/bouquet:-translate-x-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50">
                  <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                    <p className="text-[#b45309] text-[14px] font-bold whitespace-nowrap text-center" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", fontSize: "14px", lineHeight: "1.5" }}>
                      &lt;3
                    </p>
                    {/* Bubble tail right */}
                    <div className="absolute -right-[16px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-black" />
                    <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-white" />
                  </div>
                </div>
              </div>

              {/* 3D Printer Hover */}
              <div
                className="absolute z-10 block group/printer"
                style={{ left: '57%', top: '48%', width: '38%', height: '45%' }}
              >
                <div className="w-full h-full rounded-sm group-hover/printer:bg-white/5 transition-colors duration-300 cursor-help" />

                {/* Pixelated thought bubble */}
                <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/printer:opacity-100 group-hover/printer:-translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                    <p className="text-black text-[14px] font-bold whitespace-nowrap" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", fontSize: "12px", lineHeight: "1.5" }}>
                      Currently printing<br />a cat toy 🐾
                    </p>
                    {/* Bubble tail */}
                    <div className="absolute -bottom-[16px] right-12 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black" />
                    <div className="absolute -bottom-[8px] right-12 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white" />
                  </div>
                </div>
              </div>

              {/* Iced Coffee Hover — "Strawberry Latte" */}
              <div
                className="absolute z-20 block group/coffee"
                style={{ left: '5%', top: '64%', width: '13%', height: '33%' }}
              >
                <div className="w-full h-full rounded-sm group-hover/coffee:bg-white/5 transition-colors duration-300 cursor-help" />

                {/* Pixelated thought bubble */}
                <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/coffee:opacity-100 group-hover/coffee:-translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                  <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                    <p className="text-[#b45309] text-[12px] font-bold whitespace-nowrap text-center" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                      Strawberry Latte
                    </p>
                    {/* Bubble tail */}
                    <div className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black" />
                    <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white" />
                  </div>
                </div>
              </div>

            </div>
          </footer>

          {/* Small yellow pixelated heart at the bottom center */}
          <div className="relative z-10 mt-32 flex justify-center items-center pb-16">

            {/* Render heart bundle (behind the main clickable heart) */}
            {hearts.map((h) => (
              <div
                key={h.id}
                className="absolute pointer-events-none z-10"
                style={{
                  transform: `translate(${h.x}px, ${h.y}px) scale(${h.scale}) rotate(${h.rotation}deg)`,
                  transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              >
                <svg
                  width="32"
                  height="28"
                  viewBox="0 0 11 9"
                  style={{ imageRendering: 'pixelated' }}
                  className="drop-shadow-[2px_3px_0px_rgba(0,0,0,0.5)]"
                >
                  {/* Outline (#b45309) */}
                  <g fill="#b45309">
                    <rect x="2" y="0" width="1" height="1" />
                    <rect x="8" y="0" width="1" height="1" />
                    <rect x="1" y="1" width="1" height="1" />
                    <rect x="3" y="1" width="1" height="1" />
                    <rect x="7" y="1" width="1" height="1" />
                    <rect x="9" y="1" width="1" height="1" />
                    <rect x="0" y="2" width="1" height="1" />
                    <rect x="4" y="2" width="1" height="1" />
                    <rect x="6" y="2" width="1" height="1" />
                    <rect x="10" y="2" width="1" height="1" />
                    <rect x="0" y="3" width="1" height="1" />
                    <rect x="5" y="3" width="1" height="1" />
                    <rect x="10" y="3" width="1" height="1" />
                    <rect x="1" y="4" width="1" height="1" />
                    <rect x="9" y="4" width="1" height="1" />
                    <rect x="2" y="5" width="1" height="1" />
                    <rect x="8" y="5" width="1" height="1" />
                    <rect x="3" y="6" width="1" height="1" />
                    <rect x="7" y="6" width="1" height="1" />
                    <rect x="4" y="7" width="1" height="1" />
                    <rect x="6" y="7" width="1" height="1" />
                    <rect x="5" y="8" width="1" height="1" />
                  </g>

                  {/* Dynamic Yellow Shade Fill */}
                  <g fill={h.fill}>
                    <rect x="2" y="1" width="1" height="1" />
                    <rect x="8" y="1" width="1" height="1" />
                    <rect x="1" y="2" width="1" height="1" />
                    <rect x="2" y="2" width="1" height="1" />
                    <rect x="3" y="2" width="1" height="1" />
                    <rect x="7" y="2" width="1" height="1" />
                    <rect x="9" y="2" width="1" height="1" />
                    <rect x="1" y="3" width="1" height="1" />
                    <rect x="2" y="3" width="1" height="1" />
                    <rect x="3" y="3" width="1" height="1" />
                    <rect x="4" y="3" width="1" height="1" />
                    <rect x="4" y="4" width="1" height="1" />
                    <rect x="5" y="4" width="1" height="1" />
                    <rect x="6" y="4" width="1" height="1" />
                    <rect x="5" y="5" width="1" height="1" />
                    <rect x="6" y="5" width="1" height="1" />
                    <rect x="7" y="5" width="1" height="1" />
                    <rect x="4" y="6" width="1" height="1" />
                    <rect x="5" y="6" width="1" height="1" />
                    <rect x="6" y="6" width="1" height="1" />
                    <rect x="5" y="7" width="1" height="1" />
                  </g>

                  {/* Lighter Highlights */}
                  <g fill={h.highlight}>
                    <rect x="6" y="3" width="1" height="1" />
                    <rect x="3" y="4" width="1" height="1" />
                    <rect x="7" y="4" width="1" height="1" />
                    <rect x="4" y="5" width="1" height="1" />
                  </g>

                  {/* White Sparkles/Reflections */}
                  <g fill="#ffffff">
                    <rect x="8" y="2" width="1" height="1" />
                    <rect x="7" y="3" width="1" height="1" />
                    <rect x="8" y="3" width="1" height="1" />
                    <rect x="9" y="3" width="1" height="1" />
                    <rect x="2" y="4" width="1" height="1" />
                    <rect x="8" y="4" width="1" height="1" />
                    <rect x="3" y="5" width="1" height="1" />
                  </g>
                </svg>
              </div>
            ))}

            <svg
              width="32"
              height="28"
              viewBox="0 0 11 9"
              style={{ imageRendering: 'pixelated' }}
              className="w-8 h-7 drop-shadow-[2px_3px_0px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-125 cursor-pointer relative z-20"
              onClick={handleAddHearts}
            >
              {/* Outline (#b45309) */}
              <g fill="#b45309">
                <rect x="2" y="0" width="1" height="1" />
                <rect x="8" y="0" width="1" height="1" />
                <rect x="1" y="1" width="1" height="1" />
                <rect x="3" y="1" width="1" height="1" />
                <rect x="7" y="1" width="1" height="1" />
                <rect x="9" y="1" width="1" height="1" />
                <rect x="0" y="2" width="1" height="1" />
                <rect x="4" y="2" width="1" height="1" />
                <rect x="6" y="2" width="1" height="1" />
                <rect x="10" y="2" width="1" height="1" />
                <rect x="0" y="3" width="1" height="1" />
                <rect x="5" y="3" width="1" height="1" />
                <rect x="10" y="3" width="1" height="1" />
                <rect x="1" y="4" width="1" height="1" />
                <rect x="9" y="4" width="1" height="1" />
                <rect x="2" y="5" width="1" height="1" />
                <rect x="8" y="5" width="1" height="1" />
                <rect x="3" y="6" width="1" height="1" />
                <rect x="7" y="6" width="1" height="1" />
                <rect x="4" y="7" width="1" height="1" />
                <rect x="6" y="7" width="1" height="1" />
                <rect x="5" y="8" width="1" height="1" />
              </g>

              {/* Standard Fill (#facc15 - Vibrant Golden Yellow) */}
              <g fill="#facc15">
                <rect x="2" y="1" width="1" height="1" />
                <rect x="8" y="1" width="1" height="1" />
                <rect x="1" y="2" width="1" height="1" />
                <rect x="2" y="2" width="1" height="1" />
                <rect x="3" y="2" width="1" height="1" />
                <rect x="7" y="2" width="1" height="1" />
                <rect x="9" y="2" width="1" height="1" />
                <rect x="1" y="3" width="1" height="1" />
                <rect x="2" y="3" width="1" height="1" />
                <rect x="3" y="3" width="1" height="1" />
                <rect x="4" y="3" width="1" height="1" />
                <rect x="4" y="4" width="1" height="1" />
                <rect x="5" y="4" width="1" height="1" />
                <rect x="6" y="4" width="1" height="1" />
                <rect x="5" y="5" width="1" height="1" />
                <rect x="6" y="5" width="1" height="1" />
                <rect x="7" y="5" width="1" height="1" />
                <rect x="4" y="6" width="1" height="1" />
                <rect x="5" y="6" width="1" height="1" />
                <rect x="6" y="6" width="1" height="1" />
                <rect x="5" y="7" width="1" height="1" />
              </g>

              {/* Light Highlights (#fef08a - Pastel Shading) */}
              <g fill="#fef08a">
                <rect x="6" y="3" width="1" height="1" />
                <rect x="3" y="4" width="1" height="1" />
                <rect x="7" y="4" width="1" height="1" />
                <rect x="4" y="5" width="1" height="1" />
              </g>

              {/* White Sparkle/Reflection Highlights (#ffffff) */}
              <g fill="#ffffff">
                <rect x="8" y="2" width="1" height="1" />
                <rect x="7" y="3" width="1" height="1" />
                <rect x="8" y="3" width="1" height="1" />
                <rect x="9" y="3" width="1" height="1" />
                <rect x="2" y="4" width="1" height="1" />
                <rect x="8" y="4" width="1" height="1" />
                <rect x="3" y="5" width="1" height="1" />
              </g>
            </svg>
          </div>
        </section>

      </main >
    </div >
  );
}
