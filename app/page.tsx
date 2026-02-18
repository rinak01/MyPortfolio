"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const projects = [
  {
    title: "BMW Adoptive UI",
    desc: "AI-powered agentic coding assistant with multimodal interface design for autonomous software development.",
    year: "2025 June - 2026 January",
    tags: ["GenUI", "Chain-of-Thought", "Agentic Systems"],
    image: "/bmw_nueuklassa.png",
    link: "#",
    role: "UX Engineer Intern",
    team: "BMW Group Technology Office",
    highlights: [
      "Designed multimodal interaction patterns for AI-assisted coding",
      "Created chain-of-thought visualization system for debugging",
      "Shipped to 500+ internal developers with 4.8/5 satisfaction"
    ],
    details: "Extended project details and case study content goes here.",
  },
  {
    title: "CMU - SmaSH Lab | Proactive Agent ",
    desc: "An AI agent that uses semantic filtering and NLP to intelligently distinguish between relevant user intent and ambient speech, ensuring a natural, non-intrusive voice interface experience.",
    year: "2024 September - 2025 August",
    tags: ["Adaptive Decision-Making", "Multimodal Voice Interface", "Semantic Filtering"],
    image: "/smash-lab-hero.svg",
    link: "#",
    role: "Research Assistant",
    team: "Carnegie Mellon University",
    highlights: [
      "Developed semantic filtering algorithms for ambient speech detection",
      "Built multimodal voice interface prototypes for user studies",
      "Published findings at CHI 2025 conference"
    ],
    details: "Extended project details and case study content goes here.",
  },
  {
    title: "Emma's Jellyfish",
    desc: "An AI agent that uses semantic filtering and NLP to intelligently distinguish between relevant user intent and ambient speech, ensuring a natural, non-intrusive voice interface experience",
    year: "2024 June - Present",
    tags: ["Personal Project", "Personal Agent", "LLM"],
    image: "/smash-lab.png",
    link: "#",
    role: "Creator & Designer",
    team: "Personal Project",
    highlights: [
      "Built custom LLM-powered personal assistant from scratch",
      "Designed conversational UI with context-aware responses",
      "Integrated with daily workflows and productivity tools"
    ],
    details: "Extended project details and case study content goes here.",
  },
];

// type Mode = "Clean" | "Creative";
type Project = (typeof projects)[number];

const useSkyGradient = () => {
  const [gradientClass, setGradientClass] = useState("");

  useEffect(() => {
    const updateGradient = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8) {
        setGradientClass("bg-gradient-to-b from-teal-800 via-rose-300 to-amber-100");
      } else if (hour >= 8 && hour < 17) {
        setGradientClass("bg-gradient-to-b from-cyan-400 via-sky-300 to-indigo-100");
      } else if (hour >= 17 && hour < 20) {
        setGradientClass("bg-gradient-to-b from-indigo-500 via-purple-400 to-orange-200");
      } else {
        setGradientClass("bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950");
      }
    };
    updateGradient();
    const interval = setInterval(updateGradient, 60_000);
    return () => clearInterval(interval);
  }, []);

  return gradientClass;
};

const Dashboard = ({ projects }: { projects: Project[] }) => {
  const [hoveredProject, setHoveredProject] = useState<Project>(projects[0]);
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const updateClock = () =>
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 text-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-zinc-600">
        <span>RINA KIM</span>
        <span>{clock}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-400"></div>
          <motion.div
            key={hoveredProject.title}
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-zinc-300 bg-gradient-to-br from-zinc-100 to-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3l6 8-6 10-6-10 6-8z" />
                <path d="M12 9v6" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-zinc-900">{hoveredProject.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{hoveredProject.desc}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {hoveredProject.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">Projects</div>
            {/* <div className="text-[10px] text-zinc-400">{projects.length} Total</div> */}
          </div>
          <ul className="space-y-2">
            {projects.map((project, index) => {
              const isHovered = project.title === hoveredProject.title;
              return (
                <motion.li
                  key={project.title}
                  className="group cursor-pointer rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-all hover:bg-zinc-100"
                  onMouseEnter={() => setHoveredProject(project)}
                  whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" }}
                  animate={isHovered ? { borderColor: "rgba(59, 130, 246, 0.6)", backgroundColor: "rgba(239, 246, 255, 1)" } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-light text-zinc-300">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h4 className="font-semibold text-zinc-900">{project.title}</h4>
                          <p className="mt-1 text-xs text-zinc-500">{project.year}</p>
                        </div>
                      </div>
                    </div>
                    <svg className="h-5 w-5 text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
            {/* {(["Clean", "Creative"] as Mode[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className="relative z-10 w-28 px-4 py-2 text-sm font-semibold tracking-wide transition"
              >
                <span className={mode === option ? "text-white" : "text-zinc-700"}>{option}</span>
              </button>
            ))} */}
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
            <header className="flex flex-col gap-6">
              <div className="flex items-end gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">Product Designer</p>
                  <h1 className="text-6xl font-bold tracking-tight text-zinc-950">Rina Kim</h1>
                </div>
                <a href="/resume.pdf" download className="group flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white transition-all duration-300 hover:border-zinc-900 hover:bg-zinc-900 hover:shadow-lg" aria-label="Download Resume">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-zinc-600 transition-colors duration-300 group-hover:text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                </a>
              </div>
              <div className="flex flex-col gap-6 max-w-3xl">
                <p className="text-xl leading-relaxed text-zinc-600">
                  Master&apos;s in Human-Computer Interaction from <span className="font-semibold text-zinc-900">Carnegie Mellon University</span>. Previously at <span className="font-semibold text-zinc-900">BMW Group Technology Office</span>
                </p>
                <p className="text-lg leading-relaxed text-zinc-500">
                  Specializing in Automotive HMI, Interface Design, and building functional prototypes that bridge research and production.
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">UX/UI Design</span>
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">Prototyping</span>
                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">Systems Thinking</span>
              </div>
            </header>

            <section className="flex flex-col gap-10">
              <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
                <h2 className="text-2xl font-semibold text-zinc-950">Selected Work</h2>
                <p className="text-sm text-zinc-400">{projects.length} Projects</p>
              </div>
              <div className="flex flex-col gap-12">
                {projects.map((project, index) => (
                  <article key={project.title} className="flex flex-col gap-8">
                    {/* Header: Number, Title, Year, Role, Team */}
                    <div className="flex items-start gap-6">
                      <span className="text-7xl font-light tracking-tight text-zinc-200">{String(index + 1).padStart(2, "0")}</span>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-3xl font-semibold tracking-tight text-zinc-950">{project.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                          <span>{project.year}</span>
                          <span className="text-zinc-300">•</span>
                          <span>{project.role}</span>
                          <span className="text-zinc-300">•</span>
                          <span>{project.team}</span>
                        </div>
                      </div>
                    </div>

                    {/* Two-column grid: Image + Details */}
                    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
                      {/* Image (reduced 20%) */}
                      <div className="flex-shrink-0">
                        <div className="max-w-[280px] overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/50">
                          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                        </div>
                      </div>

                      {/* Details column */}
                      <div className="flex flex-col gap-6">
                        {/* Overview */}
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Overview</h4>
                          <p className="text-base leading-relaxed text-zinc-600">{project.desc}</p>
                        </div>

                        {/* Key Highlights */}
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Key Highlights</h4>
                          <ul className="flex flex-col gap-1.5">
                            {project.highlights.map((highlight, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-300" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span key={tag} className="rounded-md bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200/50">{tag}</span>
                          ))}
                        </div>

                        {/* Project Details
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Project Details</h4>
                          <p className="text-sm leading-relaxed text-zinc-500">{project.details}</p>
                        </div> */}

                        {/* View Project Link */}
                        <a href={project.link || "#"} className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600">
                          View Project
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* Divider between projects */}
                    {index < projects.length - 1 && (
                      <div className="border-b border-zinc-200" />
                    )}
                  </article>
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
            {/* Sky Background */}
            <div className={`absolute inset-0 ${skyGradient}`} />

            {/* Shinkai-Style Cumulus Clouds */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
                <defs>
                  {/* Painterly brush texture */}
                  <filter id="brushStroke" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                  </filter>

                  {/* Bloom/glow effect for highlights */}
                  <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Soft atmospheric blur for distant elements */}
                  <filter id="atmospheric" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                  </filter>

                  {/* Contrail chromatic aberration */}
                  <linearGradient id="contrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="15%" stopColor="#FFFBEB" stopOpacity="0.6" />
                    <stop offset="30%" stopColor="#FEF3C7" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#E0F2FE" stopOpacity="0.8" />
                    <stop offset="85%" stopColor="#DBEAFE" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="contrailRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="20%" stopColor="#FEF9C3" stopOpacity="0.5" />
                    <stop offset="35%" stopColor="#FDE68A" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#BBF7D0" stopOpacity="0.5" />
                    <stop offset="80%" stopColor="#A5F3FC" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>

                  {/* Cloud shadow colors - deep lavender/violet */}
                  <radialGradient id="shadowDeep" cx="50%" cy="70%" r="60%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="40%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6D28D9" />
                  </radialGradient>
                  <radialGradient id="shadowMid" cx="50%" cy="60%" r="65%">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="50%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </radialGradient>
                  <radialGradient id="shadowLight" cx="40%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#DDD6FE" />
                    <stop offset="60%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </radialGradient>

                  {/* Cloud highlight colors - cream/peach/yellow (light from upper-right) */}
                  <radialGradient id="highlightBright" cx="70%" cy="20%" r="60%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="30%" stopColor="#FEF3C7" />
                    <stop offset="70%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#FDF4FF" />
                  </radialGradient>
                  <radialGradient id="highlightPeach" cx="65%" cy="25%" r="65%">
                    <stop offset="0%" stopColor="#FFEDD5" />
                    <stop offset="40%" stopColor="#FED7AA" />
                    <stop offset="30%" stopColor="#FDBA74" />
                  </radialGradient>
                  <radialGradient id="highlightCreamy" cx="60%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#FFFBEB" />
                    <stop offset="100%" stopColor="#FEF3C7" />
                  </radialGradient>

                  {/* Rim lighting gradient (upper-right light source) */}
                  <radialGradient id="rimLight" cx="80%" cy="10%" r="80%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="30%" stopColor="#FFFBEB" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>

                  {/* Inner glow for blooming effect */}
                  <radialGradient id="innerBloom" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#FFFBEB" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* ===== CONTRAILS (upper-left diagonal streaks) ===== */}
                <g filter="url(#atmospheric)">
                  {/* Primary contrail */}
                  <line x1="50" y1="120" x2="350" y2="20" stroke="url(#contrailGrad)" strokeWidth="6" strokeLinecap="round" />
                  <line x1="50" y1="120" x2="350" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

                  {/* Secondary contrail with rainbow refraction */}
                  <line x1="120" y1="160" x2="450" y2="50" stroke="url(#contrailRainbow)" strokeWidth="5" strokeLinecap="round" />
                  <line x1="120" y1="160" x2="450" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
                </g>

                {/* ===== MAIN CUMULUS TOWER (bottom-center rising to upper-right) ===== */}

                {/* Base layer - dense atmospheric mass at bottom - EXTENDED RIGHT */}
                <g filter="url(#brushStroke)" opacity="0.9">
                  <ellipse cx="600" cy="480" rx="550" ry="120" fill="url(#shadowDeep)" opacity="0.7" />
                  <ellipse cx="500" cy="460" rx="400" ry="100" fill="url(#shadowMid)" opacity="0.8" />
                  <ellipse cx="750" cy="450" rx="400" ry="95" fill="url(#shadowLight)" opacity="0.75" />
                  <ellipse cx="950" cy="470" rx="300" ry="85" fill="url(#shadowMid)" opacity="0.7" />
                </g>

                {/* Lower cloud mass - heavy shadows - EXTENDED RIGHT */}
                <g filter="url(#brushStroke)">
                  <ellipse cx="450" cy="400" rx="180" ry="100" fill="url(#shadowMid)" />
                  <ellipse cx="650" cy="420" rx="200" ry="110" fill="url(#shadowDeep)" opacity="0.9" />
                  <ellipse cx="550" cy="380" rx="160" ry="90" fill="url(#shadowLight)" />
                  <ellipse cx="750" cy="390" rx="150" ry="85" fill="url(#shadowMid)" opacity="0.85" />
                  {/* Right side shadow mass */}
                  <ellipse cx="900" cy="400" rx="170" ry="95" fill="url(#shadowDeep)" opacity="0.85" />
                  <ellipse cx="1050" cy="420" rx="150" ry="85" fill="url(#shadowMid)" opacity="0.8" />
                  <ellipse cx="850" cy="370" rx="140" ry="80" fill="url(#shadowLight)" opacity="0.9" />
                </g>

                {/* Middle cloud layer - transitioning to highlights */}
                <g filter="url(#brushStroke)">
                  <ellipse cx="500" cy="320" rx="140" ry="80" fill="url(#shadowLight)" />
                  <ellipse cx="380" cy="340" rx="120" ry="70" fill="url(#shadowMid)" opacity="0.8" />
                  <ellipse cx="620" cy="300" rx="150" ry="85" fill="url(#highlightCreamy)" opacity="0.9" />
                  <ellipse cx="720" cy="320" rx="130" ry="75" fill="url(#shadowLight)" opacity="0.85" />
                  <ellipse cx="550" cy="280" rx="120" ry="70" fill="url(#highlightCreamy)" />
                  {/* Right side mid layer - more shadow depth */}
                  <ellipse cx="880" cy="310" rx="140" ry="78" fill="url(#shadowMid)" />
                  <ellipse cx="980" cy="330" rx="140" ry="80" fill="url(#shadowDeep)" opacity="0.9" />
                  <ellipse cx="1080" cy="350" rx="130" ry="75" fill="url(#shadowMid)" opacity="0.85" />
                  <ellipse cx="920" cy="290" rx="130" ry="72" fill="url(#shadowLight)" />
                  <ellipse cx="1020" cy="300" rx="125" ry="70" fill="url(#shadowMid)" opacity="0.9" />
                </g>

                {/* RIGHT SIDE shadow layer directly under highlights - KEY FOR DEPTH */}
                <g filter="url(#brushStroke)">
                  {/* Deep violet shadows positioned right under where highlights will be */}
                  <ellipse cx="920" cy="275" rx="120" ry="70" fill="url(#shadowDeep)" opacity="0.9" />
                  <ellipse cx="1030" cy="290" rx="115" ry="68" fill="url(#shadowDeep)" opacity="0.85" />
                  <ellipse cx="870" cy="255" rx="110" ry="65" fill="url(#shadowMid)" />
                  <ellipse cx="980" cy="265" rx="105" ry="62" fill="url(#shadowMid)" opacity="0.9" />
                  <ellipse cx="1100" cy="300" rx="100" ry="60" fill="url(#shadowDeep)" opacity="0.8" />
                  {/* Lavender transition shadows */}
                  <ellipse cx="950" cy="220" rx="100" ry="58" fill="url(#shadowLight)" />
                  <ellipse cx="1050" cy="245" rx="95" ry="55" fill="url(#shadowLight)" opacity="0.9" />
                  <ellipse cx="890" cy="200" rx="90" ry="52" fill="url(#shadowMid)" opacity="0.85" />
                  <ellipse cx="1000" cy="210" rx="88" ry="50" fill="url(#shadowLight)" opacity="0.9" />
                </g>

                {/* UPPER-RIGHT shadow depth - directly under peak highlights */}
                <g filter="url(#brushStroke)">
                  {/* Deep shadows under the peak billows for volumetric depth */}
                  <ellipse cx="920" cy="135" rx="75" ry="45" fill="url(#shadowDeep)" opacity="0.85" />
                  <ellipse cx="980" cy="155" rx="78" ry="48" fill="url(#shadowDeep)" opacity="0.8" />
                  <ellipse cx="1040" cy="175" rx="72" ry="44" fill="url(#shadowMid)" opacity="0.85" />
                  <ellipse cx="1090" cy="195" rx="68" ry="42" fill="url(#shadowDeep)" opacity="0.75" />
                  {/* Mid-tone lavender shadows for transition */}
                  <ellipse cx="895" cy="115" rx="65" ry="40" fill="url(#shadowMid)" opacity="0.9" />
                  <ellipse cx="960" cy="125" rx="70" ry="42" fill="url(#shadowMid)" opacity="0.85" />
                  <ellipse cx="1015" cy="145" rx="68" ry="40" fill="url(#shadowLight)" opacity="0.9" />
                  <ellipse cx="1070" cy="165" rx="62" ry="38" fill="url(#shadowMid)" opacity="0.8" />
                  {/* Light shadow edges for soft depth */}
                  <ellipse cx="875" cy="95" rx="55" ry="35" fill="url(#shadowLight)" opacity="0.85" />
                  <ellipse cx="940" cy="100" rx="58" ry="36" fill="url(#shadowLight)" opacity="0.9" />
                  <ellipse cx="1000" cy="118" rx="55" ry="34" fill="url(#shadowLight)" opacity="0.85" />
                </g>

                {/* Upper billows - bright highlights with rim lighting */}
                <g filter="url(#brushStroke)">
                  {/* Main tower puffs - left/center - with layered peach depth */}
                  {/* Shadow base under main peach area */}
                  <ellipse cx="730" cy="235" rx="95" ry="55" fill="url(#shadowLight)" opacity="0.6" />
                  <ellipse cx="680" cy="245" rx="85" ry="48" fill="url(#shadowMid)" opacity="0.5" />
                  {/* Layered peach-to-cream puffs */}
                  <ellipse cx="650" cy="220" rx="80" ry="48" fill="url(#highlightCreamy)" />
                  <ellipse cx="720" cy="210" rx="72" ry="44" fill="url(#highlightPeach)" opacity="0.8" />
                  <ellipse cx="780" cy="195" rx="68" ry="42" fill="url(#highlightPeach)" opacity="0.75" />
                  <ellipse cx="690" cy="195" rx="60" ry="38" fill="url(#highlightCreamy)" opacity="0.9" />
                  <ellipse cx="750" cy="185" rx="55" ry="36" fill="url(#highlightBright)" opacity="0.95" />
                  <ellipse cx="620" cy="205" rx="65" ry="40" fill="url(#highlightBright)" opacity="0.9" />
                  <ellipse cx="580" cy="200" rx="70" ry="42" fill="url(#highlightBright)" />
                  <ellipse cx="700" cy="170" rx="62" ry="38" fill="url(#highlightCreamy)" />
                  <ellipse cx="665" cy="178" rx="55" ry="35" fill="url(#highlightBright)" opacity="0.95" />

                  {/* Right side upper billows - layered with shadow-peach-cream depth */}
                  {/* Shadow bases for peach areas */}
                  <ellipse cx="920" cy="250" rx="100" ry="55" fill="url(#shadowLight)" opacity="0.7" />
                  <ellipse cx="1020" cy="275" rx="95" ry="52" fill="url(#shadowMid)" opacity="0.6" />
                  <ellipse cx="1080" cy="290" rx="85" ry="48" fill="url(#shadowLight)" opacity="0.65" />
                  {/* Main peach puffs - broken into smaller overlapping shapes */}
                  <ellipse cx="900" cy="235" rx="75" ry="45" fill="url(#highlightPeach)" opacity="0.85" />
                  <ellipse cx="945" cy="225" rx="68" ry="42" fill="url(#highlightCreamy)" opacity="0.9" />
                  <ellipse cx="870" cy="218" rx="60" ry="38" fill="url(#highlightBright)" opacity="0.95" />
                  <ellipse cx="1000" cy="250" rx="72" ry="44" fill="url(#highlightPeach)" opacity="0.8" />
                  <ellipse cx="1045" cy="242" rx="65" ry="40" fill="url(#highlightCreamy)" opacity="0.9" />
                  <ellipse cx="980" cy="232" rx="58" ry="36" fill="url(#highlightBright)" opacity="0.95" />
                  <ellipse cx="1070" cy="268" rx="68" ry="42" fill="url(#highlightPeach)" opacity="0.75" />
                  <ellipse cx="1105" cy="258" rx="60" ry="38" fill="url(#highlightCreamy)" opacity="0.85" />
                  <ellipse cx="1050" cy="248" rx="52" ry="34" fill="url(#highlightBright)" opacity="0.9" />
                  <ellipse cx="1130" cy="285" rx="55" ry="35" fill="url(#highlightCreamy)" opacity="0.8" />
                  <ellipse cx="1115" cy="275" rx="48" ry="32" fill="url(#highlightBright)" opacity="0.85" />

                  {/* Ascending puffs toward upper-right */}
                  <ellipse cx="800" cy="150" rx="90" ry="52" fill="url(#highlightPeach)" opacity="0.95" />
                  <ellipse cx="720" cy="140" rx="80" ry="48" fill="url(#highlightBright)" />
                  <ellipse cx="850" cy="120" rx="75" ry="45" fill="url(#highlightCreamy)" />
                  <ellipse cx="780" cy="110" rx="70" ry="42" fill="url(#highlightBright)" opacity="0.95" />

                  {/* More right-side ascending puffs */}
                  <ellipse cx="950" cy="170" rx="88" ry="52" fill="url(#highlightBright)" />
                  <ellipse cx="1030" cy="188" rx="82" ry="48" fill="url(#highlightCreamy)" opacity="0.95" />
                  <ellipse cx="1100" cy="215" rx="75" ry="44" fill="url(#highlightPeach)" opacity="0.9" />
                  <ellipse cx="1000" cy="155" rx="78" ry="46" fill="url(#highlightBright)" opacity="0.95" />
                  <ellipse cx="1070" cy="178" rx="72" ry="42" fill="url(#highlightCreamy)" opacity="0.9" />

                  {/* Peak billows */}
                  <ellipse cx="900" cy="95" rx="65" ry="40" fill="url(#highlightPeach)" opacity="0.9" />
                  <ellipse cx="830" cy="85" rx="60" ry="38" fill="url(#highlightBright)" />
                  <ellipse cx="950" cy="75" rx="55" ry="35" fill="url(#highlightCreamy)" opacity="0.95" />
                  <ellipse cx="1000" cy="120" rx="62" ry="38" fill="url(#highlightBright)" opacity="0.95" />
                  <ellipse cx="1070" cy="145" rx="58" ry="35" fill="url(#highlightPeach)" opacity="0.9" />
                  <ellipse cx="1120" cy="170" rx="52" ry="32" fill="url(#highlightCreamy)" opacity="0.85" />
                </g>

                {/* Rim lighting overlay - bright edges from upper-right */}
                <g filter="url(#bloom)">
                  <ellipse cx="900" cy="90" rx="70" ry="40" fill="url(#rimLight)" opacity="0.7" />
                  <ellipse cx="820" cy="100" rx="60" ry="35" fill="url(#rimLight)" opacity="0.6" />
                  <ellipse cx="750" cy="130" rx="55" ry="32" fill="url(#rimLight)" opacity="0.5" />
                  <ellipse cx="680" cy="160" rx="50" ry="30" fill="url(#rimLight)" opacity="0.45" />
                  {/* Right side rim lighting - enhanced */}
                  <ellipse cx="980" cy="115" rx="68" ry="40" fill="url(#rimLight)" opacity="0.7" />
                  <ellipse cx="1050" cy="145" rx="62" ry="36" fill="url(#rimLight)" opacity="0.6" />
                  <ellipse cx="1110" cy="175" rx="55" ry="32" fill="url(#rimLight)" opacity="0.5" />
                  <ellipse cx="940" cy="160" rx="50" ry="30" fill="url(#rimLight)" opacity="0.5" />
                </g>

                {/* Inner bloom/glow on brightest areas - extended right */}
                <g filter="url(#bloom)" opacity="0.65">
                  <ellipse cx="750" cy="140" rx="100" ry="55" fill="url(#innerBloom)" />
                  <ellipse cx="850" cy="100" rx="85" ry="48" fill="url(#innerBloom)" />
                  {/* Right side inner glow */}
                  <ellipse cx="980" cy="140" rx="95" ry="52" fill="url(#innerBloom)" />
                  <ellipse cx="1060" cy="170" rx="80" ry="45" fill="url(#innerBloom)" opacity="0.9" />
                </g>

                {/* Highlight accents - pure white peaks - extended right */}
                <g filter="url(#brushStroke)">
                  <ellipse cx="870" cy="80" rx="35" ry="22" fill="#FFFFFF" opacity="0.95" />
                  <ellipse cx="800" cy="95" rx="30" ry="20" fill="#FFFFFF" opacity="0.9" />
                  <ellipse cx="930" cy="70" rx="28" ry="18" fill="#FFFBEB" opacity="0.95" />
                  <ellipse cx="750" cy="120" rx="32" ry="20" fill="#FFFFFF" opacity="0.85" />
                  {/* Right side white peaks */}
                  <ellipse cx="1000" cy="105" rx="30" ry="19" fill="#FFFFFF" opacity="0.95" />
                  <ellipse cx="1060" cy="135" rx="26" ry="17" fill="#FFFFFF" opacity="0.9" />
                  <ellipse cx="1100" cy="160" rx="24" ry="15" fill="#FFFBEB" opacity="0.9" />
                </g>

                {/* ===== DISTANT SMALL CLOUDS (upper atmosphere) ===== */}
                <g filter="url(#atmospheric)" opacity="0.2">
                  <ellipse cx="200" cy="60" rx="60" ry="25" fill="url(#highlightCreamy)" />
                  <ellipse cx="180" cy="55" rx="45" ry="20" fill="#FFFFFF" opacity="0.9" />
                </g>
                <g filter="url(#atmospheric)" opacity="0.2">
                  <ellipse cx="1050" cy="45" rx="50" ry="22" fill="url(#highlightPeach)" opacity="0.8" />
                  <ellipse cx="1040" cy="40" rx="38" ry="18" fill="#FFFFFF" opacity="0.85" />
                </g>

                {/* ===== LEFT SIDE ACCENT CLOUDS ===== */}
                <g filter="url(#brushStroke)" opacity="0.8">
                  <ellipse cx="150" cy="250" rx="100" ry="55" fill="url(#shadowLight)" />
                  <ellipse cx="100" cy="240" rx="80" ry="45" fill="url(#highlightCreamy)" opacity="0.9" />
                  <ellipse cx="180" cy="230" rx="70" ry="40" fill="url(#highlightBright)" opacity="0.85" />
                  <ellipse cx="130" cy="220" rx="50" ry="30" fill="#FFFFFF" opacity="0.9" />
                </g>
              </svg>
            </div>

            {/* Dark Window Frame */}
            <div className="pointer-events-none absolute inset-0">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="beigeFrameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2A2A2A" />
                    <stop offset="25%" stopColor="#1F1F1F" />
                    <stop offset="50%" stopColor="#181818" />
                    <stop offset="75%" stopColor="#141414" />
                    <stop offset="100%" stopColor="#0F0F0F" />
                  </linearGradient>
                  <linearGradient id="beigeFrameHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#454545" />
                    <stop offset="100%" stopColor="#303030" />
                  </linearGradient>
                  <filter id="softTexture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" />
                    <feDisplacementMap in="SourceGraphic" scale="2" />
                  </filter>
                </defs>
                <path d="M 0 0 L 1200 0 L 1200 85 Q 900 68 600 72 Q 300 68 0 85 Z" fill="url(#beigeFrameGrad)" filter="url(#softTexture)" />
                <path d="M 0 83 Q 300 66 600 70 Q 900 66 1200 83" stroke="url(#beigeFrameHighlight)" strokeWidth="2.5" fill="none" opacity="0.6" />
                <path d="M 0 0 L 117 0 Q 99 200 81 400 Q 63 600 45 800 L 0 800 Z" fill="url(#beigeFrameGrad)" filter="url(#softTexture)" />
                <path d="M 115 10 Q 97 200 79 400 Q 61 600 43 790" stroke="url(#beigeFrameHighlight)" strokeWidth="3" fill="none" opacity="0.5" />
                <path d="M 1200 0 L 1083 0 Q 1101 200 1119 400 Q 1137 600 1155 800 L 1200 800 Z" fill="url(#beigeFrameGrad)" filter="url(#softTexture)" />
                <path d="M 1085 10 Q 1103 200 1121 400 Q 1139 600 1157 790" stroke="url(#beigeFrameHighlight)" strokeWidth="3" fill="none" opacity="0.5" />
              </svg>
            </div>

            {/* Frameless Rearview Mirror */}
            <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2">
              <motion.div animate={{ rotate: [-0.2, 0.2, -0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
                <div className="h-12 w-32 rounded-lg bg-gradient-to-b from-slate-700 to-slate-900 shadow-lg">
                  <div className="absolute inset-1 rounded-md bg-gradient-to-b from-sky-200/30 via-pink-200/20 to-slate-600/40" />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
                </div>
              </motion.div>
            </div>

            {/* Lower Dashboard */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[340px]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 340" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="beigeDashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2A2A2A" />
                    <stop offset="25%" stopColor="#222222" />
                    <stop offset="50%" stopColor="#1A1A1A" />
                    <stop offset="75%" stopColor="#151515" />
                    <stop offset="100%" stopColor="#101010" />
                  </linearGradient>
                  <linearGradient id="greyMiddleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E1E1E" />
                    <stop offset="30%" stopColor="#0D0D0D" />
                    <stop offset="70%" stopColor="#0A0A0A" />
                    <stop offset="100%" stopColor="#141414" />
                  </linearGradient>
                  <filter id="dashSoftTexture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" />
                    <feDisplacementMap in="SourceGraphic" scale="1.5" />
                  </filter>
                </defs>
                <path d="M 0 70 Q 150 50 300 55 L 300 340 L 0 340 Z" fill="url(#beigeDashGrad)" filter="url(#dashSoftTexture)" />
                <path d="M 900 55 Q 1050 50 1200 70 L 1200 340 L 900 340 Z" fill="url(#beigeDashGrad)" filter="url(#dashSoftTexture)" />
                <path d="M 300 55 Q 600 45 900 55 L 900 340 L 300 340 Z" fill="url(#greyMiddleGrad)" filter="url(#dashSoftTexture)" />
                <path d="M 0 72 Q 300 52 600 50 Q 900 52 1200 72" stroke="#3A3A3A" strokeWidth="2.5" fill="none" opacity="0.5" />
              </svg>
            </div>

            {/* Digital Instrument Cluster */}
            <div className="pointer-events-none absolute bottom-52 left-16">
              <div className="relative h-20 w-80 rounded-lg bg-gradient-to-b from-slate-900 to-slate-950 shadow-lg">
                <div className="absolute inset-0 rounded-lg ring-1 ring-slate-700/50" />
                <div className="absolute inset-1 flex items-center justify-between rounded-md bg-gradient-to-b from-slate-800 to-slate-900 px-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-emerald-400">D</span>
                    <div className="h-8 w-px bg-slate-600" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-slate-400">MPH</span>
                    <span className="text-3xl font-light tabular-nums text-white">42</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div className="h-8 w-px bg-slate-600" />
                    <div className="flex flex-col">
                      <span className="text-lg font-medium tabular-nums text-white">12:23</span>
                      <span className="text-xs text-slate-400">75°F</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-1 -z-10 rounded-xl bg-cyan-500/10 blur-md" />
              </div>
            </div>

            {/* Steering Wheel */}
            <motion.div
              className="pointer-events-none absolute -left-10 bottom-6 h-[420px] w-[420px]"
              animate={{ rotate: [-0.4, 0.4, -0.4] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            // style={{ filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.6)) drop-shadow(0 8px 20px rgba(0,0,0,0.4))" }}
            >
              <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
                <defs>
                  <linearGradient id="woodBody" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3D3428" />
                    <stop offset="20%" stopColor="#2A2218" />
                    <stop offset="40%" stopColor="#1E1A14" />
                    <stop offset="60%" stopColor="#2A2420" />
                    <stop offset="80%" stopColor="#1A1610" />
                    <stop offset="100%" stopColor="#28231C" />
                  </linearGradient>
                  <linearGradient id="lacquerPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7f7267ff" stopOpacity="0.5" />
                    <stop offset="20%" stopColor="#ac8964ff" stopOpacity="0.25" />
                    <stop offset="60%" stopColor="#5b2f0bff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#be751c" stopOpacity="0" />
                  </linearGradient>
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
                  <radialGradient id="hubPlate" cx="30%" cy="25%" r="80%">
                    <stop offset="0%" stopColor="#F0F0F0" />
                    <stop offset="20%" stopColor="#D8D8D8" />
                    <stop offset="45%" stopColor="#B0B0B0" />
                    <stop offset="70%" stopColor="#888888" />
                    <stop offset="100%" stopColor="#606060" />
                  </radialGradient>
                  <radialGradient id="hubCenter" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#E8E8E8" />
                    <stop offset="40%" stopColor="#C0C0C0" />
                    <stop offset="100%" stopColor="#707070" />
                  </radialGradient>
                  <radialGradient id="rivetDome" cx="30%" cy="20%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E8E8E8" />
                    <stop offset="50%" stopColor="#B0B0B0" />
                    <stop offset="80%" stopColor="#707070" />
                    <stop offset="100%" stopColor="#505050" />
                  </radialGradient>
                  <radialGradient id="boltHead" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#4A4A4A" />
                    <stop offset="50%" stopColor="#2A2A2A" />
                    <stop offset="100%" stopColor="#1A1A1A" />
                  </radialGradient>
                  <filter id="grainTexture" x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03 0.003" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                  </filter>
                </defs>

                <ellipse cx="100" cy="106" r="90" ry="88" fill="#000000" opacity="0.35" />
                <circle cx="100" cy="100" r="93" stroke="#0A0806" strokeWidth="6" fill="none" />
                <circle cx="100" cy="100" r="87" stroke="url(#woodBody)" strokeWidth="14" fill="none" filter="url(#grainTexture)" />
                <circle cx="100" cy="100" r="78" stroke="#1A1610" strokeWidth="3" fill="none" />
                <path d="M 18 80 A 88 88 0 0 1 182 80" stroke="url(#lacquerPrimary)" strokeWidth="12" fill="none" strokeLinecap="round" />

                {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const cx = 100 + 82 * Math.sin(rad);
                  const cy = 100 - 82 * Math.cos(rad);
                  return (
                    <g key={i}>
                      <circle cx={cx + 0.3} cy={cy + 0.5} r="2.8" fill="#000000" opacity="0.4" />
                      <circle cx={cx} cy={cy} r="2.5" fill="url(#rivetDome)" />
                      <circle cx={cx - 0.5} cy={cy - 0.5} r="0.8" fill="#FFFFFF" opacity="0.6" />
                    </g>
                  );
                })}

                <g>
                  <path d="M 20 91 L 65 91 Q 72 100 65 109 L 20 109 Q 13 100 20 91" fill="#000000" opacity="0.3" transform="translate(1, 2)" />
                  <path d="M 18 90 L 66 90 Q 74 100 66 110 L 18 110 Q 10 100 18 90" fill="#505050" />
                  <path d="M 20 92 L 64 92 Q 70 100 64 108 L 20 108 Q 14 100 20 92" fill="url(#chromeH)" />
                  <path d="M 22 92 L 62 92" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  <rect x="28" y="96" width="28" height="8" rx="4" fill="#1A1A1A" />
                </g>
                <g>
                  <path d="M 135 91 L 180 91 Q 187 100 180 109 L 135 109 Q 128 100 135 91" fill="#000000" opacity="0.3" transform="translate(1, 2)" />
                  <path d="M 134 90 L 182 90 Q 190 100 182 110 L 134 110 Q 126 100 134 90" fill="#505050" />
                  <path d="M 136 92 L 180 92 Q 186 100 180 108 L 136 108 Q 130 100 136 92" fill="url(#chromeH)" />
                  <path d="M 138 92 L 178 92" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  <rect x="144" y="96" width="28" height="8" rx="4" fill="#1A1A1A" />
                </g>
                <g>
                  <path d="M 91 135 L 91 180 Q 100 187 109 180 L 109 135 Q 100 128 91 135" fill="#000000" opacity="0.3" transform="translate(1, 2)" />
                  <path d="M 90 134 L 90 182 Q 100 190 110 182 L 110 134 Q 100 126 90 134" fill="#505050" />
                  <path d="M 92 136 L 92 180 Q 100 186 108 180 L 108 136 Q 100 130 92 136" fill="url(#chromeV)" />
                  <path d="M 92 138 L 92 178" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  <rect x="96" y="144" width="8" height="28" rx="4" fill="#1A1A1A" />
                </g>

                <circle cx="100" cy="104" r="34" fill="#000000" opacity="0.35" />
                <circle cx="100" cy="100" r="34" fill="#4A4A4A" />
                <circle cx="100" cy="100" r="32" fill="url(#hubPlate)" />
                <circle cx="100" cy="100" r="32" stroke="#808080" strokeWidth="2" fill="none" />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const cx = 100 + 22 * Math.sin(rad);
                  const cy = 100 - 22 * Math.cos(rad);
                  return (
                    <g key={i}>
                      <circle cx={cx + 0.3} cy={cy + 0.5} r="3.5" fill="#000000" opacity="0.4" />
                      <circle cx={cx} cy={cy} r="3.2" fill="url(#boltHead)" />
                      <circle cx={cx} cy={cy} r="1.8" fill="#0A0A0A" />
                    </g>
                  );
                })}
                <circle cx="100" cy="100" r="14" fill="#303030ff" />
                <circle cx="100" cy="100" r="11" fill="url(#hubCenter)" />
                {/* <text x="100" y="105" textAnchor="middle" fontSize="14" fontFamily="Georgia, serif" fontWeight="bold" fill="#2A2A2A">R</text>
              <text x="99.5" y="104.5" textAnchor="middle" fontSize="14" fontFamily="Georgia, serif" fontWeight="bold" fill="#E8E8E8">R</text> */}
                <ellipse cx="88" cy="88" rx="16" ry="10" fill="#FFFFFF" opacity="0.12" />
              </svg>
            </motion.div>

            {/* Central Touchscreen Display */}
            <div className="absolute inset-x-0 bottom-0 z-20">
              <div className="mx-auto w-full max-w-[986px] px-9 pb-9">
                {/* Dark bezel frame for blending */}
                <div className="rounded-3xl bg-gradient-to-b from-zinc-800 via-zinc-900 to-transparent p-[3px] shadow-[0_-20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(0,0,0,0.3)]">
                  <div className="overflow-hidden rounded-[21px] border border-zinc-700/50 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 shadow-[inset_0_0_30px_rgba(0,0,0,0.05)]">
                    <div className="px-3 py-5">
                      <Dashboard projects={projects} />
                    </div>
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
