"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const projects = [
  {
    title: "BMW Adoptive UI",
    desc: "AI-powered agentic coding assistant with multimodal interface design for autonomous software development.",
    year: "2025 June - 2026 January",
    tags: ["GenUI", "Chain-of-Thought", "Agentic Systems"],
    image: "/antigravity.png",
    link: "#", // Add actual project link here
  },
  {
    title: "CMU - SmaSH Lab",
    desc: "An AI agent that uses semantic filtering and NLP to intelligently distinguish between relevant user intent and ambient speech, ensuring a natural, non-intrusive voice interface experience.",
    year: "2024 September - 2025 August",
    tags: ["Adaptive Decision-Making", "Multimodal Voice Interface", "Semantic Filtering"],
    image: "/bmw-genui.png",
    link: "#", // Add actual project link here
  },
  {
    title: "Emma's Jellyfish",
    desc: "An AI agent that uses semantic filtering and NLP to intelligently distinguish between relevant user intent and ambient speech, ensuring a natural, non-intrusive voice interface experience",
    year: "2024 June - Present",
    tags: ["Personal Project", "Personal Agent", "LLM"],
    image: "/smash-lab.png",
    link: "#", // Add actual project link here
  },
];

type Mode = "Clean" | "Creative";

type Project = (typeof projects)[number];

/**
 * Custom hook that returns a Tailwind gradient class based on current time
 * Dawn (5-8am), Day (8am-5pm), Dusk (5-8pm), Night (8pm-5am)
 */
const useSkyGradient = () => {
  const [gradientClass, setGradientClass] = useState("");

  useEffect(() => {
    const updateGradient = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 8) {
        // Dawn: warm sunrise tones
        setGradientClass("bg-gradient-to-b from-slate-900 via-amber-500/40 to-orange-300/30");
      } else if (hour >= 8 && hour < 17) {
        // Day: bright blue sky
        setGradientClass("bg-gradient-to-b from-sky-400 via-blue-300 to-slate-50");
      } else if (hour >= 17 && hour < 20) {
        // Dusk: sunset colors
        setGradientClass("bg-gradient-to-b from-rose-400 via-purple-400 to-gray-800");
      } else {
        // Night: deep dark tones
        setGradientClass("bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950");
      }
    };

    updateGradient();
    const interval = setInterval(updateGradient, 60_000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return gradientClass;
};

const Dashboard = ({ projects }: { projects: Project[] }) => {
  const [hoveredProject, setHoveredProject] = useState<Project>(projects[0]);
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  useEffect(() => {
    const updateClock = () =>
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-black/40 p-5 text-white shadow-[0_0_40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
        <span>Portfolio</span>
        <span>{clock}</span>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Left Column: Project Preview */}
        <div className="flex flex-col gap-4">
          <div className="text-[11px] uppercase tracking-[0.25em] text-white/50">
            Preview
          </div>

          <motion.div
            key={hoveredProject.title}
            className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Project Icon/Visual */}
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/40 bg-gradient-to-br from-white/20 to-white/5">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-12 w-12 text-white/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3l6 8-6 10-6-10 6-8z" />
                <path d="M12 9v6" />
              </svg>
            </div>

            {/* Project Details */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{hoveredProject.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">
                {hoveredProject.desc}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {hoveredProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative Grid Pattern */}
            <div className="absolute bottom-0 right-0 grid grid-cols-3 gap-1 opacity-20">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`grid-${index}`}
                  className="h-8 w-8 rounded border border-white/20 bg-white/5"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Project List */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.25em] text-white/50">
              Projects
            </div>
            <div className="text-[10px] text-white/40">
              {projects.length} Total
            </div>
          </div>

          <ul className="space-y-2">
            {projects.map((project, index) => {
              const isHovered = project.title === hoveredProject.title;
              return (
                <motion.li
                  key={project.title}
                  className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-all hover:bg-white/10"
                  onMouseEnter={() => setHoveredProject(project)}
                  whileHover={{
                    borderColor: "rgba(56, 189, 248, 0.6)",
                    boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
                  }}
                  animate={
                    isHovered
                      ? {
                        borderColor: "rgba(14, 165, 233, 0.8)",
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                      }
                      : {}
                  }
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-light text-white/30">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h4 className="font-semibold text-white">
                            {project.title}
                          </h4>
                          <p className="mt-1 text-xs text-white/50">
                            {project.year}
                          </p>
                        </div>
                      </div>
                    </div>

                    <svg
                      className="h-5 w-5 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-sky-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("Clean");
  const skyGradient = useSkyGradient();

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-950">
      <header className="pointer-events-none absolute inset-x-0 top-6 z-30 flex items-center justify-center">
        <div className="pointer-events-auto rounded-full border border-zinc-200 bg-white/80 p-1 shadow-lg backdrop-blur">
          <div className="relative flex items-center gap-1">
            <motion.span
              layoutId="mode-pill"
              className="absolute inset-y-0 w-28 rounded-full bg-zinc-900"
              animate={{ x: mode === "Clean" ? 0 : 112 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            />
            {(["Clean", "Creative"] as Mode[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className="relative z-10 w-28 px-4 py-2 text-sm font-semibold tracking-wide transition"
              >
                <span
                  className={
                    mode === option ? "text-white" : "text-zinc-700"
                  }
                >
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {mode === "Clean" ? (
          <motion.main
            key="clean"
            className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-20 px-8 py-28"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Hero Section */}
            <header className="flex flex-col gap-6">
              <div className="flex items-end gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
                    Product Designer
                  </p>
                  <h1 className="text-6xl font-bold tracking-tight text-zinc-950">
                    Rina Kim
                  </h1>
                </div>

                {/* Resume Button */}
                <a
                  href="/resume.pdf"
                  download
                  className="group flex h-11 w-11 items-center justify-center rounded-full border-1 border-zinc-300 bg-white transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:shadow-lg"
                  aria-label="Download Resume"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5 text-zinc-600 transition-colors duration-300 group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                    />
                  </svg>
                </a>
              </div>

              <div className="flex flex-col gap-6 max-w-3xl">
                <p className="text-xl leading-relaxed text-zinc-600">
                  Master's in Human-Computer Interaction from{" "}
                  <span className="font-semibold text-zinc-900">Carnegie Mellon University</span>
                  . Previously at{" "}
                  <span className="font-semibold text-zinc-900">BMW Group Technology Office</span>
                  {/* <span className="font-semibold text-zinc-900">SmaSH Lab</span>. */}
                </p>
                <p className="text-lg leading-relaxed text-zinc-500">
                  Specializing in Automotive HMI, Interface Design,
                  and building functional prototypes that bridge research and production.
                </p>
              </div>

              <div className="flex gap-4 flex-wrap">
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
                  UX/UI Design
                </span>
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
                  Prototyping
                </span>
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
                  Systems Thinking
                </span>
              </div>
            </header>

            {/* Projects - Vertical Layout */}
            <section className="flex flex-col gap-10">
              <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
                <h2 className="text-2xl font-semibold text-zinc-950">
                  Selected Work
                </h2>
                <p className="text-sm text-zinc-400">
                  {projects.length} Projects
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {projects.map((project, index) => (
                  <a
                    key={project.title}
                    href={project.link || "#"}
                    className="group block cursor-pointer rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.08)] hover:bg-zinc-50/50"
                  >
                    <article className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                      {/* Project Number */}
                      <div className="flex-shrink-0">
                        <span className="text-6xl font-light tracking-tight text-zinc-200 transition-colors duration-300 group-hover:text-zinc-300">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Project Image - 20% smaller */}
                      <div className="flex-shrink-0 md:w-[307px]">
                        <div className="overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/50 transition-all duration-500 group-hover:ring-zinc-300">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-semibold tracking-tight text-zinc-950 transition-colors duration-300 group-hover:text-zinc-900">
                              {project.title}
                            </h3>
                            <span className="text-sm font-medium text-zinc-400">
                              {project.year}
                            </span>
                          </div>
                          <p className="text-base leading-relaxed text-zinc-600">
                            {project.desc}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  </a>
                ))}
              </div>
            </section>
          </motion.main>
        ) : (
          <motion.main
            key="creative"
            className="relative min-h-screen w-full"
            initial={{ opacity: 0, scale: 0.98, rotateX: -6 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.98, rotateX: 6 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ perspective: 1200 }}
          >
            {/* Stylized Painted Sky - Light Blue Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100" />

            {/* Painterly Pink/Purple Fluffy Clouds */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
                <defs>
                  {/* Painterly brush texture filter */}
                  <filter id="brushTexture" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
                  </filter>
                  <filter id="softBrush" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                  </filter>
                  {/* Cloud gradients - pink to purple */}
                  <linearGradient id="cloudPink1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F9A8D4" />
                    <stop offset="50%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#E879A0" />
                  </linearGradient>
                  <linearGradient id="cloudPurple1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DDD6FE" />
                    <stop offset="50%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                  <linearGradient id="cloudPinkLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FECDD3" />
                    <stop offset="100%" stopColor="#FDA4AF" />
                  </linearGradient>
                </defs>

                {/* Large fluffy cloud - left side */}
                <g filter="url(#brushTexture)">
                  <ellipse cx="150" cy="100" rx="140" ry="80" fill="url(#cloudPink1)" opacity="0.85" />
                  <ellipse cx="220" cy="85" rx="100" ry="65" fill="#FBCFE8" opacity="0.9" />
                  <ellipse cx="100" cy="120" rx="90" ry="55" fill="url(#cloudPurple1)" opacity="0.7" />
                  <ellipse cx="180" cy="130" rx="80" ry="50" fill="#F9A8D4" opacity="0.8" />
                </g>

                {/* Large fluffy cloud - right side */}
                <g filter="url(#brushTexture)">
                  <ellipse cx="1050" cy="90" rx="130" ry="75" fill="url(#cloudPurple1)" opacity="0.85" />
                  <ellipse cx="980" cy="110" rx="110" ry="70" fill="#FECDD3" opacity="0.9" />
                  <ellipse cx="1100" cy="130" rx="85" ry="55" fill="url(#cloudPink1)" opacity="0.75" />
                  <ellipse cx="1020" cy="80" rx="70" ry="45" fill="#DDD6FE" opacity="0.8" />
                </g>

                {/* Medium cloud - center top */}
                <g filter="url(#brushTexture)">
                  <ellipse cx="600" cy="60" rx="100" ry="55" fill="url(#cloudPinkLight)" opacity="0.8" />
                  <ellipse cx="650" cy="50" rx="80" ry="45" fill="#FBCFE8" opacity="0.85" />
                  <ellipse cx="550" cy="70" rx="70" ry="40" fill="url(#cloudPurple1)" opacity="0.7" />
                </g>

                {/* Smaller accent clouds */}
                <g filter="url(#softBrush)">
                  <ellipse cx="350" cy="140" rx="70" ry="40" fill="#F9A8D4" opacity="0.6" />
                  <ellipse cx="850" cy="150" rx="80" ry="45" fill="#DDD6FE" opacity="0.55" />
                  <ellipse cx="450" cy="180" rx="60" ry="35" fill="#FECDD3" opacity="0.5" />
                </g>

                {/* Visible brushstroke texture overlay */}
                <g opacity="0.15">
                  <path d="M 100 80 Q 200 60 300 90 Q 400 70 500 100" stroke="#F472B6" strokeWidth="20" fill="none" strokeLinecap="round" />
                  <path d="M 700 50 Q 850 80 1000 60 Q 1100 90 1150 70" stroke="#C4B5FD" strokeWidth="18" fill="none" strokeLinecap="round" />
                  <path d="M 200 150 Q 350 120 500 160" stroke="#FDA4AF" strokeWidth="15" fill="none" strokeLinecap="round" />
                </g>
              </svg>
            </div>

            {/* Deep Beige/Off-White Window Frame - Upper Dashboard, Roof, A-Pillars */}
            <div className="pointer-events-none absolute inset-0">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                <defs>
                  {/* Deep beige gradient - matching lower dashboard */}
                  <linearGradient id="beigeFrameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D4B89A" />
                    <stop offset="25%" stopColor="#C9A888" />
                    <stop offset="50%" stopColor="#BFA080" />
                    <stop offset="75%" stopColor="#B59878" />
                    <stop offset="100%" stopColor="#A88E70" />
                  </linearGradient>

                  {/* Beige highlight for edges */}
                  <linearGradient id="beigeFrameHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E8D4B8" />
                    <stop offset="100%" stopColor="#D4C0A0" />
                  </linearGradient>

                  {/* Inner shadow for depth */}
                  <linearGradient id="beigeShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9A8668" />
                    <stop offset="100%" stopColor="#8A7858" />
                  </linearGradient>

                  {/* Soft leather-like texture */}
                  <filter id="softTexture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" />
                    <feDisplacementMap in="SourceGraphic" scale="2" />
                  </filter>
                </defs>

                {/* Top frame / roof lining - curved (10% thinner) */}
                <path
                  d="M 0 0 L 1200 0 L 1200 85 Q 900 68 600 72 Q 300 68 0 85 Z"
                  fill="url(#beigeFrameGrad)"
                  filter="url(#softTexture)"
                />
                {/* Top frame highlight edge */}
                <path
                  d="M 0 83 Q 300 66 600 70 Q 900 66 1200 83"
                  stroke="url(#beigeFrameHighlight)"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.6"
                />
                {/* Top frame inner shadow */}
                <path
                  d="M 0 80 Q 300 63 600 67 Q 900 63 1200 80"
                  stroke="url(#beigeShadow)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.4"
                />

                {/* Left A-pillar (10% thinner) */}
                <path
                  d="M 0 0 L 117 0 Q 99 200 81 400 Q 63 600 45 800 L 0 800 Z"
                  fill="url(#beigeFrameGrad)"
                  filter="url(#softTexture)"
                />
                {/* Left pillar highlight */}
                <path
                  d="M 115 10 Q 97 200 79 400 Q 61 600 43 790"
                  stroke="url(#beigeFrameHighlight)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.5"
                />
                {/* Left pillar inner shadow */}
                <path
                  d="M 112 15 Q 94 200 76 400 Q 58 600 40 785"
                  stroke="url(#beigeShadow)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.3"
                />
                {/* Left pillar stitching detail */}
                <path
                  d="M 100 30 Q 82 200 64 400 Q 46 600 28 770"
                  stroke="#9A8A78"
                  strokeWidth="0.5"
                  strokeDasharray="5 4"
                  fill="none"
                  opacity="0.4"
                />

                {/* Right A-pillar (10% thinner) */}
                <path
                  d="M 1200 0 L 1083 0 Q 1101 200 1119 400 Q 1137 600 1155 800 L 1200 800 Z"
                  fill="url(#beigeFrameGrad)"
                  filter="url(#softTexture)"
                />
                {/* Right pillar highlight */}
                <path
                  d="M 1085 10 Q 1103 200 1121 400 Q 1139 600 1157 790"
                  stroke="url(#beigeFrameHighlight)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.5"
                />
                {/* Right pillar inner shadow */}
                <path
                  d="M 1088 15 Q 1106 200 1124 400 Q 1142 600 1160 785"
                  stroke="url(#beigeShadow)"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.3"
                />
                {/* Right pillar stitching detail */}
                <path
                  d="M 1100 30 Q 1118 200 1136 400 Q 1154 600 1172 770"
                  stroke="#9A8A78"
                  strokeWidth="0.5"
                  strokeDasharray="5 4"
                  fill="none"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* Frameless Rearview Mirror */}
            <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2">
              <motion.div
                animate={{ rotate: [-0.2, 0.2, -0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Sleek frameless mirror */}
                <div className="relative">
                  <div className="h-12 w-32 rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 shadow-lg">
                    {/* Mirror reflection */}
                    <div className="absolute inset-1 rounded-md bg-gradient-to-b from-sky-200/30 via-pink-200/20 to-slate-600/40" />
                    {/* Edge highlight */}
                    <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Lower Dashboard - Matching Deep Beige/Off-White with Upper Frame */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[340px]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 340" preserveAspectRatio="none">
                <defs>
                  {/* Deep beige dashboard gradient - matching upper frame */}
                  <linearGradient id="beigeDashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D4B89A" />
                    <stop offset="25%" stopColor="#C9A888" />
                    <stop offset="50%" stopColor="#BFA080" />
                    <stop offset="75%" stopColor="#B59878" />
                    <stop offset="100%" stopColor="#A88E70" />
                  </linearGradient>

                  {/* Light grey middle section - around display */}
                  <linearGradient id="greyMiddleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E8E4DE" />
                    <stop offset="30%" stopColor="#DDD8D0" />
                    <stop offset="70%" stopColor="#D0CAC0" />
                    <stop offset="100%" stopColor="#C8C4BC" />
                  </linearGradient>

                  {/* Geometric faceted pattern for center console - light grey */}
                  <linearGradient id="facetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E0DCD4" />
                    <stop offset="100%" stopColor="#D0CCC4" />
                  </linearGradient>
                  <linearGradient id="facetGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E8E4DC" />
                    <stop offset="100%" stopColor="#D8D4CC" />
                  </linearGradient>

                  {/* Beige highlight for edges */}
                  <linearGradient id="beigeHighlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E8D4B8" />
                    <stop offset="100%" stopColor="#D4C0A0" />
                  </linearGradient>

                  <filter id="dashSoftTexture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" />
                    <feDisplacementMap in="SourceGraphic" scale="1.5" />
                  </filter>
                </defs>

                {/* Main beige dashboard surface - left side (passenger to steering) */}
                <path
                  d="M 0 70 Q 150 50 300 55 L 300 340 L 0 340 Z"
                  fill="url(#beigeDashGrad)"
                  filter="url(#dashSoftTexture)"
                />

                {/* Main beige dashboard surface - right side */}
                <path
                  d="M 900 55 Q 1050 50 1200 70 L 1200 340 L 900 340 Z"
                  fill="url(#beigeDashGrad)"
                  filter="url(#dashSoftTexture)"
                />

                {/* Light grey middle section - around central display */}
                <path
                  d="M 300 55 Q 600 45 900 55 L 900 340 L 300 340 Z"
                  fill="url(#greyMiddleGrad)"
                  filter="url(#dashSoftTexture)"
                />

                {/* Transition blend - left beige to grey */}
                <linearGradient id="blendLeftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C9A888" />
                  <stop offset="100%" stopColor="#DDD8D0" />
                </linearGradient>
                <path
                  d="M 280 55 L 320 55 L 320 340 L 280 340 Z"
                  fill="url(#blendLeftGrad)"
                  opacity="0.7"
                />

                {/* Transition blend - right grey to beige */}
                <linearGradient id="blendRightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DDD8D0" />
                  <stop offset="100%" stopColor="#C9A888" />
                </linearGradient>
                <path
                  d="M 880 55 L 920 55 L 920 340 L 880 340 Z"
                  fill="url(#blendRightGrad)"
                  opacity="0.7"
                />

                {/* Dashboard top edge highlight */}
                <path
                  d="M 0 72 Q 300 52 600 50 Q 900 52 1200 72"
                  stroke="url(#beigeHighlightGrad)"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.7"
                />

                {/* Secondary highlight line */}
                <path
                  d="M 0 74 Q 300 54 600 52 Q 900 54 1200 74"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.4"
                />

                {/* Shadow line below top edge */}
                <path
                  d="M 0 78 Q 300 58 600 56 Q 900 58 1200 78"
                  stroke="#8A7A68"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />

                {/* Dark air vent / trim piece below screen area */}
                <rect x="350" y="175" width="500" height="14" rx="5" fill="#2A2A2A" />
                <rect x="352" y="177" width="496" height="10" rx="4" fill="#1A1A1A" />
                {/* Vent slats - more refined */}
                <g opacity="0.4">
                  {[380, 420, 460, 500, 540, 580, 620, 660, 700, 740, 780, 820].map((x) => (
                    <line key={x} x1={x} y1="179" x2={x} y2="185" stroke="#3A3A3A" strokeWidth="1.5" />
                  ))}
                </g>
                {/* Vent highlight */}
                <path d="M 355 177 L 845 177" stroke="#404040" strokeWidth="0.5" opacity="0.5" />

                {/* Geometric faceted center console area - light grey */}
                <g filter="url(#dashSoftTexture)">
                  {/* Left facet */}
                  <path d="M 480 205 L 550 205 L 575 290 L 495 290 Z" fill="url(#facetGrad1)" />
                  {/* Center facet */}
                  <path d="M 550 205 L 650 205 L 680 290 L 575 290 Z" fill="url(#facetGrad2)" />
                  {/* Right facet */}
                  <path d="M 650 205 L 720 205 L 705 290 L 680 290 Z" fill="url(#facetGrad1)" />
                  {/* Facet edge lines - sharper */}
                  <path d="M 550 205 L 575 290" stroke="#B8B4AC" strokeWidth="1.5" fill="none" opacity="0.7" />
                  <path d="M 650 205 L 680 290" stroke="#B8B4AC" strokeWidth="1.5" fill="none" opacity="0.7" />
                  {/* Facet highlights */}
                  <path d="M 552 206 L 576 288" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.3" />
                  <path d="M 652 206 L 681 288" stroke="#FFFFFF" strokeWidth="0.5" fill="none" opacity="0.3" />
                </g>

                {/* Subtle stitching detail on beige sections */}
                <g stroke="#9A8A78" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.4">
                  <path d="M 50 100 Q 50 200 60 300" />
                  <path d="M 1150 100 Q 1150 200 1140 300" />
                </g>
              </svg>
            </div>

            {/* Digital Instrument Cluster - Behind Steering Wheel */}
            <div className="pointer-events-none absolute bottom-52 left-16">
              <div className="relative h-20 w-80 rounded-lg bg-gradient-to-b from-slate-900 to-slate-950 shadow-lg">
                {/* Cluster bezel */}
                <div className="absolute inset-0 rounded-lg ring-1 ring-slate-700/50" />
                {/* Screen content */}
                <div className="absolute inset-1 flex items-center justify-between rounded-md bg-gradient-to-b from-slate-800 to-slate-900 px-4">
                  {/* Left section - Drive indicator */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-emerald-400">D</span>
                    <div className="h-8 w-px bg-slate-600" />
                  </div>
                  {/* Center section - Speed/Info */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400">MPH</span>
                    <span className="text-3xl font-light tabular-nums text-white">42</span>
                  </div>
                  {/* Right section - Time & Temp */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="h-8 w-px bg-slate-600" />
                    <div className="flex flex-col">
                      <span className="text-lg font-medium tabular-nums text-white">12:23</span>
                      <span className="text-xs text-slate-400">75°F</span>
                    </div>
                  </div>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 -z-10 rounded-xl bg-cyan-500/10 blur-md" />
              </div>
            </div>

            {/* Steering Wheel - Classic Vintage Racing Design - Premium 3D */}
            <motion.div
              className="pointer-events-none absolute -left-10 bottom-6 h-[420px] w-[420px]"
              animate={{ rotate: [-0.4, 0.4, -0.4] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              style={{
                filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.6)) drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
              }}
            >
              <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
                <defs>
                  {/* === WOOD RIM GRADIENTS === */}
                  {/* Main wood body - rich dark tones */}
                  <linearGradient id="woodBody" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3D3428" />
                    <stop offset="20%" stopColor="#2A2218" />
                    <stop offset="40%" stopColor="#1E1A14" />
                    <stop offset="60%" stopColor="#2A2420" />
                    <stop offset="80%" stopColor="#1A1610" />
                    <stop offset="100%" stopColor="#28231C" />
                  </linearGradient>

                  {/* Wood outer bevel - catches light */}
                  <linearGradient id="woodOuterBevel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4A4035" />
                    <stop offset="50%" stopColor="#2A2218" />
                    <stop offset="100%" stopColor="#1A1610" />
                  </linearGradient>

                  {/* Wood inner bevel - shadow side */}
                  <linearGradient id="woodInnerBevel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#18140E" />
                    <stop offset="50%" stopColor="#1A1610" />
                    <stop offset="100%" stopColor="#2A2420" />
                  </linearGradient>

                  {/* High-gloss lacquer - primary reflection */}
                  <linearGradient id="lacquerPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                    <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.25" />
                    <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>

                  {/* Sharp specular highlight */}
                  <linearGradient id="specularSharp" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>

                  {/* === CHROME GRADIENTS === */}
                  {/* Premium chrome - horizontal spoke */}
                  <linearGradient id="chromeH" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FAFAFA" />
                    <stop offset="8%" stopColor="#E0E0E0" />
                    <stop offset="20%" stopColor="#707070" />
                    <stop offset="35%" stopColor="#C0C0C0" />
                    <stop offset="50%" stopColor="#F5F5F5" />
                    <stop offset="65%" stopColor="#B0B0B0" />
                    <stop offset="80%" stopColor="#606060" />
                    <stop offset="92%" stopColor="#D0D0D0" />
                    <stop offset="100%" stopColor="#A0A0A0" />
                  </linearGradient>

                  {/* Premium chrome - vertical spoke */}
                  <linearGradient id="chromeV" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A0A0A0" />
                    <stop offset="8%" stopColor="#D0D0D0" />
                    <stop offset="20%" stopColor="#606060" />
                    <stop offset="35%" stopColor="#B0B0B0" />
                    <stop offset="50%" stopColor="#F5F5F5" />
                    <stop offset="65%" stopColor="#C0C0C0" />
                    <stop offset="80%" stopColor="#707070" />
                    <stop offset="92%" stopColor="#E0E0E0" />
                    <stop offset="100%" stopColor="#FAFAFA" />
                  </linearGradient>

                  {/* Chrome edge bevel */}
                  <linearGradient id="chromeBevel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#C0C0C0" />
                    <stop offset="100%" stopColor="#808080" />
                  </linearGradient>

                  {/* === HUB GRADIENTS === */}
                  {/* Polished hub plate */}
                  <radialGradient id="hubPlate" cx="30%" cy="25%" r="80%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="20%" stopColor="#D8D8D8" />
                    <stop offset="45%" stopColor="#B0B0B0" />
                    <stop offset="70%" stopColor="#888888" />
                    <stop offset="100%" stopColor="#606060" />
                  </radialGradient>

                  {/* Hub center - machined aluminum */}
                  <radialGradient id="hubCenter" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#E8E8E8" />
                    <stop offset="40%" stopColor="#C0C0C0" />
                    <stop offset="100%" stopColor="#707070" />
                  </radialGradient>

                  {/* Rivet - polished dome */}
                  <radialGradient id="rivetDome" cx="30%" cy="20%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E8E8E8" />
                    <stop offset="50%" stopColor="#B0B0B0" />
                    <stop offset="80%" stopColor="#707070" />
                    <stop offset="100%" stopColor="#505050" />
                  </radialGradient>

                  {/* Bolt head gradient */}
                  <radialGradient id="boltHead" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#4A4A4A" />
                    <stop offset="50%" stopColor="#2A2A2A" />
                    <stop offset="100%" stopColor="#1A1A1A" />
                  </radialGradient>

                  {/* Wood grain filter */}
                  <filter id="grainTexture" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03 0.003" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                  </filter>
                </defs>

                {/* === OUTER RIM - Multi-layer 3D Wood === */}

                {/* Deep shadow beneath wheel */}
                <ellipse cx="100" cy="106" r="90" ry="88" fill="#000000" opacity="0.35" />

                {/* Rim back face / depth */}
                <circle cx="100" cy="100" r="93" stroke="#0A0806" strokeWidth="6" fill="none" />

                {/* Rim outer bevel - light catching edge */}
                <circle cx="100" cy="100" r="91" stroke="url(#woodOuterBevel)" strokeWidth="3" fill="none" />

                {/* Main wood body - with grain texture */}
                <circle cx="100" cy="100" r="87" stroke="url(#woodBody)" strokeWidth="14" fill="none" filter="url(#grainTexture)" />

                {/* Rim inner bevel - shadowed edge */}
                <circle cx="100" cy="100" r="78" stroke="url(#woodInnerBevel)" strokeWidth="3" fill="none" />

                {/* Inner rim edge detail */}
                <circle cx="100" cy="100" r="76" stroke="#0D0B08" strokeWidth="1" fill="none" />

                {/* === LACQUER REFLECTIONS === */}

                {/* Primary gloss arc - top */}
                <path
                  d="M 18 80 A 88 88 0 0 1 182 80"
                  stroke="url(#lacquerPrimary)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Sharp specular highlight line */}
                <path
                  d="M 30 65 A 78 78 0 0 1 170 65"
                  stroke="url(#specularSharp)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Secondary reflection - side */}
                <path
                  d="M 15 100 A 88 88 0 0 1 25 55"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.15"
                  strokeLinecap="round"
                />

                {/* Bottom rim shadow for roundness */}
                <path
                  d="M 25 130 A 85 85 0 0 0 175 130"
                  stroke="#000000"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.2"
                  strokeLinecap="round"
                />

                {/* === 18 CHROME RIVETS - 3D Domed === */}
                <g>
                  {/* Each rivet has shadow + dome + highlight */}
                  {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const r = 82;
                    const cx = 100 + r * Math.sin(rad);
                    const cy = 100 - r * Math.cos(rad);
                    return (
                      <g key={i}>
                        <circle cx={cx + 0.3} cy={cy + 0.5} r="2.8" fill="#000000" opacity="0.4" />
                        <circle cx={cx} cy={cy} r="2.5" fill="url(#rivetDome)" />
                        <circle cx={cx - 0.5} cy={cy - 0.5} r="0.8" fill="#FFFFFF" opacity="0.6" />
                      </g>
                    );
                  })}
                </g>

                {/* === Y-SPOKES - Beveled Chrome with Depth === */}

                {/* LEFT SPOKE (9 o'clock) */}
                <g>
                  {/* Spoke shadow */}
                  <path d="M 20 91 L 65 91 Q 72 100 65 109 L 20 109 Q 13 100 20 91" fill="#000000" opacity="0.3" transform="translate(1, 2)" />
                  {/* Spoke back depth */}
                  <path d="M 18 90 L 66 90 Q 74 100 66 110 L 18 110 Q 10 100 18 90" fill="#505050" />
                  {/* Spoke main body */}
                  <path d="M 20 92 L 64 92 Q 70 100 64 108 L 20 108 Q 14 100 20 92" fill="url(#chromeH)" />
                  {/* Top bevel edge */}
                  <path d="M 22 92 L 62 92" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  {/* Bottom shadow edge */}
                  <path d="M 22 108 L 62 108" stroke="#404040" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                  {/* Slotted cutout - recessed */}
                  <rect x="28" y="96" width="28" height="8" rx="4" fill="#1A1A1A" />
                  <rect x="29" y="97" width="26" height="6" rx="3" fill="#0A0A0A" />
                  {/* Cutout inner highlight */}
                  <path d="M 32 97.5 L 52 97.5" stroke="#303030" strokeWidth="0.5" strokeLinecap="round" />
                </g>

                {/* RIGHT SPOKE (3 o'clock) */}
                <g>
                  {/* Spoke shadow */}
                  <path d="M 135 91 L 180 91 Q 187 100 180 109 L 135 109 Q 128 100 135 91" fill="#000000" opacity="0.3" transform="translate(1, 2)" />
                  {/* Spoke back depth */}
                  <path d="M 134 90 L 182 90 Q 190 100 182 110 L 134 110 Q 126 100 134 90" fill="#505050" />
                  {/* Spoke main body */}
                  <path d="M 136 92 L 180 92 Q 186 100 180 108 L 136 108 Q 130 100 136 92" fill="url(#chromeH)" />
                  {/* Top bevel edge */}
                  <path d="M 138 92 L 178 92" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  {/* Bottom shadow edge */}
                  <path d="M 138 108 L 178 108" stroke="#404040" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                  {/* Slotted cutout - recessed */}
                  <rect x="144" y="96" width="28" height="8" rx="4" fill="#1A1A1A" />
                  <rect x="145" y="97" width="26" height="6" rx="3" fill="#0A0A0A" />
                  {/* Cutout inner highlight */}
                  <path d="M 148 97.5 L 168 97.5" stroke="#303030" strokeWidth="0.5" strokeLinecap="round" />
                </g>

                {/* BOTTOM SPOKE (6 o'clock) */}
                <g>
                  {/* Spoke shadow */}
                  <path d="M 91 135 L 91 180 Q 100 187 109 180 L 109 135 Q 100 128 91 135" fill="#000000" opacity="0.3" transform="translate(1, 2)" />
                  {/* Spoke back depth */}
                  <path d="M 90 134 L 90 182 Q 100 190 110 182 L 110 134 Q 100 126 90 134" fill="#505050" />
                  {/* Spoke main body */}
                  <path d="M 92 136 L 92 180 Q 100 186 108 180 L 108 136 Q 100 130 92 136" fill="url(#chromeV)" />
                  {/* Left bevel edge */}
                  <path d="M 92 138 L 92 178" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  {/* Right shadow edge */}
                  <path d="M 108 138 L 108 178" stroke="#404040" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                  {/* Slotted cutout - recessed */}
                  <rect x="96" y="144" width="8" height="28" rx="4" fill="#1A1A1A" />
                  <rect x="97" y="145" width="6" height="26" rx="3" fill="#0A0A0A" />
                  {/* Cutout inner highlight */}
                  <path d="M 97.5 148 L 97.5 168" stroke="#303030" strokeWidth="0.5" strokeLinecap="round" />
                </g>

                {/* === CENTRAL HUB - Machined Metal === */}

                {/* Hub deep shadow */}
                <circle cx="100" cy="104" r="34" fill="#000000" opacity="0.35" />

                {/* Hub back plate */}
                <circle cx="100" cy="100" r="34" fill="#4A4A4A" />

                {/* Polished hub face */}
                <circle cx="100" cy="100" r="32" fill="url(#hubPlate)" />

                {/* Hub outer chamfer */}
                <circle cx="100" cy="100" r="32" stroke="#808080" strokeWidth="2" fill="none" />
                <circle cx="100" cy="100" r="31" stroke="#C0C0C0" strokeWidth="0.5" fill="none" />

                {/* Six-bolt hexagonal pattern - 3D bolts */}
                <g>
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const r = 22;
                    const cx = 100 + r * Math.sin(rad);
                    const cy = 100 - r * Math.cos(rad);
                    return (
                      <g key={i}>
                        <circle cx={cx + 0.3} cy={cy + 0.5} r="3.5" fill="#000000" opacity="0.4" />
                        <circle cx={cx} cy={cy} r="3.2" fill="url(#boltHead)" />
                        <circle cx={cx} cy={cy} r="3.2" stroke="#3A3A3A" strokeWidth="0.5" fill="none" />
                        {/* Hex socket detail */}
                        <circle cx={cx} cy={cy} r="1.8" fill="#0A0A0A" />
                      </g>
                    );
                  })}
                </g>

                {/* Center aperture ring */}
                <circle cx="100" cy="100" r="14" fill="#1A1A1A" />
                <circle cx="100" cy="100" r="14" stroke="#3A3A3A" strokeWidth="1.5" fill="none" />
                <circle cx="100" cy="100" r="12.5" stroke="#0A0A0A" strokeWidth="0.5" fill="none" />

                {/* "R" emblem - engraved chrome look */}
                <circle cx="100" cy="100" r="11" fill="url(#hubCenter)" />
                <text
                  x="100"
                  y="105"
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="Georgia, serif"
                  fontWeight="bold"
                  fill="#2A2A2A"
                >
                  R
                </text>
                <text
                  x="99.5"
                  y="104.5"
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="Georgia, serif"
                  fontWeight="bold"
                  fill="#E8E8E8"
                >
                  R
                </text>

                {/* Hub highlight reflection */}
                <ellipse cx="88" cy="88" rx="16" ry="10" fill="#FFFFFF" opacity="0.12" />
                <ellipse cx="90" cy="90" rx="8" ry="5" fill="#FFFFFF" opacity="0.08" />
              </svg>
            </motion.div>


            {/* Central Touchscreen Display */}
            <div className="absolute inset-x-0 bottom-0 z-20">
              <div className="mx-auto w-full max-w-4xl px-6 pb-8">
                {/* Display frame */}
                <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-[0_0_60px_rgba(0,0,0,0.7)]">
                  {/* Main content area */}
                  <div className="p-5">
                    <Dashboard projects={projects} />
                  </div>
                </div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
