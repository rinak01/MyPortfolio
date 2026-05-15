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
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end px-5 py-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9B49A] mb-1">{item.tag}</span>
        <span className={`${outfitClass} text-[#EAEAEA] text-base font-light`}>{item.label}</span>
        <span className="text-[#A3A3A3] text-[12px] mt-1">{item.desc}</span>
        {/* Category pills */}
        <div className="flex flex-wrap gap-1 mt-2">
          {item.categories.map((c) => (
            <span key={c} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm"
              style={{ color: CAT_STYLE[c].text }}>
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
            <h1 className={`${outfit.className} text-5xl md:text-7xl font-light text-[#EAEAEA] tracking-tight mb-6`}>
              Rina Kim
            </h1>
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
                  <div>
                    <SectionLabel>Overview</SectionLabel>
                    <p>
                      Developed a context-aware UI framework that utilizes generative models to synthesize interface components in real-time. By analyzing driver telemetry, cabin state, and environmental context, the system provides proactive information hierarchy, minimizing cognitive load while enhancing vehicle interaction.
                    </p>
                  </div>

                  <Hairline />

                  <div>
                    <SectionLabel>Key Contributions</SectionLabel>
                    <ul className="space-y-3">
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
                        <span>Co-authored a technical whitepaper on "Adaptive HMI" for automotive production, bridging the gap between experimental generative design and safety-critical dashboard implementation.</span>
                      </li>
                    </ul>
                  </div>

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

            <Hairline />

            {/* Research Approach */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <SectionLabel>Research Approach</SectionLabel>
                <p className="text-[13px] text-[#A3A3A3] leading-relaxed">
                  Grounded in two complementary methods: physiological measurement to capture what drivers cannot self-report, and structured usability testing to observe how they interact with dynamic interfaces.
                </p>
              </div>
              <div className="lg:col-span-8 space-y-5">
                <div className="bg-[#141414] rounded-sm p-6 border border-white/5">
                  <p className="text-[12px] uppercase tracking-widest text-[#C9B49A] mb-3">Physiological Data Collection</p>
                  <p className="text-[14px] text-[#A3A3A3] leading-relaxed mb-4">
                    Integrated a multi-sensor pipeline — PSI, PPG, heart rate, and CRM measurements — to capture driver state data that feeds directly into the UI&apos;s context gating logic. Design decisions grounded in measurable cognitive and physiological signals rather than self-reported preference alone.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Biometric data capture", "CSV export pipeline", "CRM measurements", "PPG + HR monitoring"].map(m => (
                      <span key={m} className="text-[10px] uppercase tracking-widest text-[#A3A3A3] border border-white/15 px-2 py-0.5 rounded-sm">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-[#141414] rounded-sm p-6 border border-white/5">
                  <p className="text-[12px] uppercase tracking-widest text-[#C9B49A] mb-3">Usability Testing Framework</p>
                  <p className="text-[14px] text-[#A3A3A3] leading-relaxed mb-4">
                    Designed a structured testing framework to evaluate how drivers interact with dynamically generated interfaces under varying scenario conditions. Testing ran Oct–Nov, with findings directly informing iteration on the isochrone GenUI concept and real-time layout logic.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Scenario-based task testing", "Observational sessions", "Iterative prototype refinement", "Data collection"].map(m => (
                      <span key={m} className="text-[10px] uppercase tracking-widest text-[#A3A3A3] border border-white/15 px-2 py-0.5 rounded-sm">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Hairline />

            {/* Key Design Decisions */}
            <div>
              <SectionLabel>Key Design Decisions</SectionLabel>
              <p className="text-[14px] text-[#A3A3A3] mb-8">Three principles shaped every design decision across the project.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Surface, don\u2019t bury", body: "Information the driver needs appears without navigation. The interface assembles itself around context \u2014 snowy roads, an incoming call, a known route \u2014 rather than waiting for the driver to request it." },
                  { title: "Minimum viable glance", body: "Every screen evaluated against a glance budget. Safety-critical data chunked into scannable modules readable in under two seconds without sustained visual attention." },
                  { title: "State over preference", body: "Driver state data \u2014 fatigue signals, cognitive load, speed \u2014 gates what is shown and how. Comfort controls auto-adjust. Map overlays appear and collapse based on current capacity, not just settings." },
                  { title: "Context continuity", body: "The system maintains awareness across modes \u2014 navigation, comfort, media, vehicle health \u2014 orchestrating agents so decisions in one domain inform layout choices in another." },
                ].map(({ title, body }) => (
                  <div key={title} className="bg-[#141414] rounded-sm p-6 border border-white/5 flex flex-col gap-3">
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
                    { step: "05", label: "Rendered Interface", sub: "Sub-50ms · Auto-dismissed when resolved" },
                  ].map(({ step, label, sub }, i, arr) => (
                    <div key={step} className="flex flex-col">
                      <div className="flex items-center gap-5">
                        {/* Step number + node */}
                        <div className="flex flex-col items-center" style={{ width: 36 }}>
                          <div className={`w-9 h-9 rounded-sm flex items-center justify-center border ${i === arr.length - 1 ? "border-[#C9B49A]/60 bg-[#C9B49A]/10" : "border-white/10 bg-[#1a1a1a]"}`}>
                            <span className="text-[10px] tracking-widest text-[#C9B49A]">{step}</span>
                          </div>
                        </div>
                        {/* Label */}
                        <div className="min-w-0">
                          <p className={`text-[13px] font-medium tracking-wide ${i === arr.length - 1 ? "text-[#C9B49A]" : "text-[#E5E5E5]"}`}>{label}</p>
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

            {/* Agent Architecture */}
            <div>
              <SectionLabel>Design System Architecture</SectionLabel>
              <p className="text-[14px] text-[#A3A3A3] mb-6 max-w-2xl break-words whitespace-normal">
                A five-domain agent architecture where each agent owns a discrete area of the driving experience. A central orchestrator determines priority and layout based on live context signals.
              </p>
              <div className="overflow-hidden rounded-sm border border-white/8">
                {[
                  { agent: "Navigation", detail: "Route and map layer \u2014 routine learning, live traffic, ETA, and proactive POI surfacing based on calendar and habitual patterns." },
                  { agent: "Comfort", detail: "Climate, seat controls, and cabin environment \u2014 auto-adjusts based on passenger profiles and ambient conditions." },
                  { agent: "Weather", detail: "Live precipitation radar, road condition prediction, ice and hydroplaning risk, fog detection \u2014 feeds directly into map overlay and alert design." },
                  { agent: "Media", detail: "Playback, audio zone management, and context-aware suggestions \u2014 attenuates automatically when safety-relevant alerts surface." },
                  { agent: "Vehicle Health", detail: "Continuous monitoring of tire pressure, oil level, brake fluid and pad wear. Triggers automatic video recording on impact detection. Feeds snow readiness and proactive maintenance surfaces." },
                ].map(({ agent, detail }, i) => (
                  <div key={agent} className={`grid grid-cols-12 border-b border-white/5 last:border-b-0 ${i % 2 === 0 ? "bg-[#141414]" : "bg-[#111]"}`}>
                    <div className="col-span-3 p-4 border-r border-white/5">
                      <span className="text-[12px] uppercase tracking-widest text-[#C9B49A]">{agent}</span>
                    </div>
                    <div className="col-span-9 p-4">
                      <span className="text-[13px] text-[#A3A3A3] leading-relaxed">{detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Reachability", "Passenger", "Road Focus", "Entertainment", "Eco"].map(mode => (
                  <span key={mode} className="text-[10px] uppercase tracking-widest text-[#A3A3A3] border border-white/15 px-3 py-1 rounded-sm">{mode} Mode</span>
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
              {/* Pipeline — near-square 1:1, full natural size */}
              <div className="aspect-[1/1] overflow-hidden bg-[#141414] rounded-sm">
                <img src="/images/01/proactive agent pipeline.png" alt="Proactive Agent Pipeline"
                  className="w-full h-full object-contain object-center opacity-85 hover:opacity-100 hover:scale-[1.02] transition-all duration-700 ease-out" />
              </div>
              {/* NLP diagram */}
              {/* <div className="bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                <img src="/images/01/NLP01.png" alt="NLP Semantic Analysis" className="w-[85%] h-auto opacity-70 invert" />
              </div> */}
              {/* Graph — centered card, constrained width so it doesn't stretch */}
              <div className="bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                <img src="/images/01/updatedGraph.png" alt="Response Accuracy Graph"
                  className="w-[75%] h-auto opacity-90 hover:opacity-100 transition-opacity duration-500" />
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

            {/* Right — imagery stacked vertically */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {/* Dashboard — full width, portrait 3:4 natural ratio */}
              <div className="w-full aspect-[3/4] overflow-hidden bg-[#141414] rounded-sm">
                <img src="/images/02/trend_forecasting_dashboard 1.png" alt="AI Trend Forecasting Dashboard"
                  className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-700 ease-out" />
              </div>
              {/* Surefront Interviews — full width, landscape 3:2 natural ratio */}
              <div className="w-full aspect-[3/2] overflow-hidden bg-[#141414] rounded-sm">
                <img src="/images/02/SurefrontInterviews.png" alt="Surefront Interviews"
                  className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-700 ease-out" />
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

                <div className="space-y-6 text-[15px] text-[#A3A3A3] leading-relaxed">
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

        {/* ─── Contact Footer ─── */}
        <footer id="project-meet" className="pt-32 pb-16">
          <div className="bg-[#141414] rounded-sm p-12 md:p-24 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="max-w-xl">
              <h2 className={`${outfit.className} text-4xl text-[#EAEAEA] font-light mb-6`}>
                It's Great To Meet You!
              </h2>
              <p className="text-[#A3A3A3] text-[15px] leading-relaxed mb-8">
                Let's build something together.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a href="mailto:by.rinakim@gmail.com"
                  className="text-[#EAEAEA] hover:text-[#B39D82] transition-colors border-b border-white/20 hover:border-[#B39D82] pb-1 uppercase tracking-widest text-sm inline-block w-fit">
                  by.rinakim@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/rina-kim-9a3864171/" target="_blank"
                  className="text-[#EAEAEA] hover:text-[#B39D82] transition-colors border-b border-white/20 hover:border-[#B39D82] pb-1 uppercase tracking-widest text-sm inline-block w-fit">
                  LinkedIn Profile
                </a>
                <a href="https://drive.google.com/file/d/1qvhnhcxOM4LrbB0SHHimeBg26k-70Wv9/view?usp=sharing" target="_blank"
                  className="text-[#EAEAEA] hover:text-[#B39D82] transition-colors border-b border-white/20 hover:border-[#B39D82] pb-1 uppercase tracking-widest text-sm inline-block w-fit">
                  Resume
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-[552px] shrink-0">
              {/* Row 1: portrait (1 col) + landscape rh.png (2 cols) */}
              <div className="overflow-hidden rounded-sm row-span-1 aspect-[2/3]">
                <img src="/images/NiceToMeetYou/buildingpeppersghost.png" alt="Building Pepper's Ghost" className="w-full h-full object-cover grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-500" />
              </div>
              <div className="col-span-2 overflow-hidden rounded-sm aspect-[3/2]">
                <img src="/images/NiceToMeetYou/rh.png" alt="Rina Kim" className="w-full h-full object-cover grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-500" />
              </div>
              {/* Row 2: landscape designworksgroup (2 cols) + portrait (1 col) */}
              <div className="col-span-2 overflow-hidden rounded-sm aspect-[3/2]">
                <img src="/images/NiceToMeetYou/designworksgroup.png" alt="BMW DesignWorks Group" className="w-full h-full object-cover grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-500" />
              </div>
              <div className="overflow-hidden rounded-sm aspect-[2/3]">
                <img src="/images/NiceToMeetYou/buildingcloud.png" alt="Building Cloud" className="w-full h-full object-cover grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-500" />
              </div>
            </div>
          </div>
        </footer >

      </main >
    </div >
  );
}
