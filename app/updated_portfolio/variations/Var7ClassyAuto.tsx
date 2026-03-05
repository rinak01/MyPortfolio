"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Outfit, DM_Sans } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["200", "300", "400", "500"] });
const sans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

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
  <span className="block text-[11px] uppercase tracking-[0.22em] text-[#C9B49A] mb-2">
    {children}
  </span>
);

// Divider
const Hairline = () => <div className="w-full h-[1px] bg-white/5 my-5" />;

// ─── Scrollspy Nav ───
const NAV_ITEMS = [
  { id: "project-01", label: "BMW Adaptive UI" },
  { id: "project-02", label: "CMU Proactive Agent" },
  { id: "project-03", label: "AI Trend Forecasting" },
  { id: "project-04", label: "Emma's Tree" },
  { id: "project-meet", label: "Nice to Meet You" },
];

function ScrollNav() {
  const [active, setActive] = useState("project-01");

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
            {/* <p>Carnegie Mellon University (HCI)</p>
            <p>Prev. BMW Group Technology Office</p> */}
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
                  {/* Overview */}
                  <div>
                    <SectionLabel>Overview</SectionLabel>
                    <p>
                      Developed an adaptive generative UI system for BMW vehicles that dynamically adjusts interface elements based on driver behavior, environmental conditions, and personal preferences.
                    </p>
                  </div>

                  <Hairline />

                  {/* Key Contributions */}
                  <div>
                    <SectionLabel>Key Contributions</SectionLabel>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>Developed a robust React-based orchestration layer to synchronize real-time telemetry between asynchronous sub-agents and the end-user interface, ensuring seamless human-machine interaction.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>Engineered a modular multi-agent architecture that delegates intensive rendering tasks to specialized sub-agents, eliminating synchronous execution stalls and ensuring high-fidelity, fluid interface responsiveness.</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Topics Researched */}
                  <div>
                    <SectionLabel>Topics Researched</SectionLabel>
                    <div className="flex flex-wrap gap-2">
                      {["Generative AI", "System Design", "LLM"].map(t => (
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
                  <img src="/images/00/layers.png" alt="Layers diagram" className="w-full h-auto opacity-90" />
                </div>
                <div className="aspect-video bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                  <img src="/images/00/pipeline.png" alt="Pipeline diagram" className="w-full h-auto opacity-90" />
                </div>
              </div>
              <div className="bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                <img src="/images/00/bmwinfograph.png" alt="BMW capabilities diagram" className="w-[75%] h-auto opacity-90" />
              </div>
            </div>

          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-white/5" />

        {/* ─── Project 01: SmaSH Lab | Proactive Agent ─── */}
        <motion.article id="project-02" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left — imagery (reversed column) */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
              <div className="aspect-[21/9] overflow-hidden bg-[#141414] rounded-sm flex items-center justify-center">
                <img src="/images/01/proactive agent pipeline.png" alt="Proactive Agent Pipeline"
                  className="w-full h-full object-cover mix-blend-screen opacity-70 invert hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
              </div>
              <div className="bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                <img src="/images/01/NLP01.png" alt="NLP Semantic Analysis" className="w-[85%] h-auto opacity-70 invert" />
              </div>
              <div className="bg-[#141414] rounded-sm p-6 flex items-center justify-center">
                <img src="/images/01/updatedGraph.png" alt="Response Accuracy Graph" className="w-full h-auto opacity-80" />
              </div>
            </div>

            {/* Right — meta + content */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#EAEAEA]`}>01</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[#C9B49A]">CMU SmaSH Lab</span>
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
                    <p>
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
                        <span>UX Design</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>System Design</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-[#C9B49A] shrink-0">—</span>
                        <span>LLM</span>
                      </li>
                    </ul>
                  </div>

                  <Hairline />

                  {/* Performance metric */}
                  <div className="pt-2">
                    <SectionLabel>Performance Metric</SectionLabel>
                    <span className={`${outfit.className} text-3xl text-[#EAEAEA]`}>&gt;90% Accuracy</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-white/5" />

        {/* ─── Project 02: AI Trend Forecasting ─── */}
        <motion.article id="project-03" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left — meta + content */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#EAEAEA]`}>02</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[#C9B49A]">Surefront</span>
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

            {/* Right — imagery */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-5 gap-4 items-start">
                {/* portrait: 692×951 ≈ 3:4 */}
                <div className="col-span-2 aspect-[3/4] overflow-hidden bg-[#141414] rounded-sm">
                  <img src="/images/02/trend_forecasting_dashboard 1.png" alt="Dashboard"
                    className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
                </div>
                {/* landscape: 481×312 ≈ 3:2 */}
                <div className="col-span-3 aspect-[3/2] overflow-hidden bg-[#141414] rounded-sm">
                  <img src="/images/02/SurefrontInterviews.png" alt="Surefront Interviews"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>

          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-white/5" />

        {/* ─── Project 03: Emma's Tree ─── */}
        <motion.article id="project-04" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left — imagery */}
            <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
              <div className="flex gap-4">
                <div className="w-2/3 aspect-[4/3] overflow-hidden bg-[#141414] rounded-sm">
                  <img src="/images/03/emmastree.png" alt="Emma's Tree"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
                </div>
                <div className="w-1/3 flex flex-col gap-4">
                  <div className="flex-1 bg-[#141414] rounded-sm p-5 flex items-center justify-center">
                    <img src="/images/03/treesystem.png" alt="Tree System" className="w-full h-auto opacity-90 invert" />
                  </div>
                  <div className="flex-1 bg-[#141414] rounded-sm p-5 flex items-center justify-center">
                    <img src="/images/03/tempchange.png" alt="Temperature Change" className="w-full h-auto opacity-90 invert" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — meta + content */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#EAEAEA]`}>03</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[#C9B49A]">Biomimicry</span>
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

        {/* ─── Visual Index ─── */}
        <section className="pt-20">
          <h2 className={`${outfit.className} text-3xl font-light text-[#EAEAEA] mb-12`}>
            Spatial Environments &amp; Prototypes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slowFade}
              className="col-span-2 row-span-2 aspect-square bg-[#141414] overflow-hidden rounded-sm group relative">
              <img src="/images/ARVR/library.png" alt="Library VR"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
            {[
              { src: "/images/prototypes/ResponsiveTale 1.png", alt: "ResponsiveTale" },
              { src: "/images/prototypes/peppersghost01.png", alt: "Pepper's Ghost" },
              { src: "/images/prototypes/stopmotion01.png", alt: "Stop Motion" },
              { src: "/images/prototypes/flexvr 1.png", alt: "FlexVR" },
              { src: "/images/prototypes/emmasjellyfish01 1.png", alt: "Emma's Jellyfish" },
              { src: "/images/ARVR/studyhall 1.png", alt: "Study Hall" },
            ].map((img, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slowFade}
                className="aspect-square bg-[#141414] overflow-hidden rounded-sm group relative">
                <img src={img.src} alt={img.alt}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-700"
                  onError={(e) => { e.currentTarget.src = "/images/ARVR/forest01 1.png"; }} />
              </motion.div>
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
                <a href="https://drive.google.com/file/d/1lGNm_Zh5L_niGyPaLJNQ7LzrP30lhi_t/view?usp=sharing" target="_blank"
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
        </footer>

      </main>
    </div>
  );
}
