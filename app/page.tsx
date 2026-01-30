"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const projects = [
  {
    title: "Antigravity",
    desc: "Speculative mobility interface exploring zero-g navigation.",
    year: "2024",
  },
  {
    title: "BMW GenUI",
    desc: "In-vehicle interface concept focused on clarity and trust.",
    year: "2023",
  },
  {
    title: "SmaSH Lab",
    desc: "Research-led design system for collaborative robotics.",
    year: "2022",
  },
];

type Mode = "Clean" | "Creative";

type Project = (typeof projects)[number];

const skyByHour = (hour: number) => {
  if (hour < 5) return "linear-gradient(180deg, #020617 0%, #0b1026 60%)";
  if (hour < 8) return "linear-gradient(180deg, #0f172a 0%, #fbbf24 70%)";
  if (hour < 12) return "linear-gradient(180deg, #60a5fa 0%, #e0f2fe 80%)";
  if (hour < 17) return "linear-gradient(180deg, #38bdf8 0%, #f1f5f9 75%)";
  if (hour < 20) return "linear-gradient(180deg, #fb7185 0%, #1f2937 80%)";
  return "linear-gradient(180deg, #0f172a 0%, #020617 70%)";
};

const DashboardScreen = ({ projects }: { projects: Project[] }) => {
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
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
    <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-6 text-white shadow-[0_0_40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
        <span>Active</span>
        <span>{clock}</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-5">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/50">
            <span>Navigation</span>
            <span>{activeProject.year}</span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3l6 8-6 10-6-10 6-8z" />
                <path d="M12 9v6" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold">{activeProject.title}</p>
              <p className="text-sm text-white/60">{activeProject.desc}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`map-tile-${index}`}
                className="h-10 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
            <span>History</span>
            <span className="text-[10px] text-white/40">Select</span>
          </div>
          <ul className="space-y-2">
            {projects.map((project) => {
              const isActive = project.title === activeProject.title;
              return (
                <motion.li
                  key={project.title}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  onClick={() => setActiveProject(project)}
                  whileHover={{
                    boxShadow: "0 0 20px rgba(56, 189, 248, 0.6)",
                    borderColor: "rgba(56, 189, 248, 0.8)",
                    color: "rgba(186, 230, 253, 1)",
                  }}
                  animate={
                    isActive
                      ? {
                          scale: 1.02,
                          boxShadow: "0 0 26px rgba(14, 165, 233, 0.8)",
                          borderColor: "rgba(14, 165, 233, 0.9)",
                        }
                      : { scale: 1, boxShadow: "none" }
                  }
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <span>{project.title}</span>
                  <span className="text-xs text-white/50">{project.year}</span>
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
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const tick = () => setHour(new Date().getHours());
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  const skyStyle = useMemo(
    () => ({ background: skyByHour(hour) }),
    [hour],
  );

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
            className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-8 py-28"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">
                Rinakim.com
              </p>
              <h1 className="max-w-2xl text-5xl font-semibold leading-tight">
                A minimalist HCI portfolio with a focus on craft and clarity.
              </h1>
              <p className="max-w-xl text-lg text-zinc-500">
                Selected works across interaction design, prototyping, and
                systems thinking.
              </p>
            </div>

            <section className="grid gap-8 md:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="group rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    <span>Project</span>
                    <span>{project.year}</span>
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                    {project.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    {project.desc}
                  </p>
                  <div className="mt-10 h-px w-12 bg-zinc-200 transition group-hover:w-24" />
                </article>
              ))}
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
            <div className="absolute inset-0" style={skyStyle} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/40" />

            <motion.div
              className="absolute left-10 top-28 h-28 w-28 rounded-full border border-white/40 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              animate={{ y: [0, -6, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute left-16 bottom-40 h-32 w-32 rounded-full border-2 border-white/50 bg-black/30"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-4 rounded-full border border-white/40" />
              <div className="absolute inset-10 rounded-full border border-white/40" />
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-8 -translate-x-1/2 text-center"
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="mx-auto h-10 w-px bg-white/60" />
              <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/20 text-[10px] uppercase tracking-[0.2em] text-white">
                Jellyfish
              </div>
            </motion.div>

            <div className="absolute inset-x-0 bottom-0 z-20">
              <div className="mx-auto w-full max-w-6xl px-8 pb-12">
                <div className="rounded-[36px] border border-white/30 bg-black/60 px-8 py-10 backdrop-blur-xl">
                  <div className="grid gap-8 md:grid-cols-[200px_1fr_200px]">
                    <div className="flex flex-col gap-4 text-white/70">
                      <p className="text-xs uppercase tracking-[0.4em]">
                        Systems
                      </p>
                      <div className="space-y-2 text-sm">
                        <p>Signal: Stable</p>
                        <p>Mode: Creative</p>
                        <p>Depth: 12.4m</p>
                      </div>
                    </div>

                    <DashboardScreen projects={projects} />

                    <div className="flex flex-col items-end justify-between text-white/70">
                      <p className="text-xs uppercase tracking-[0.4em]">
                        Cabin
                      </p>
                      <div className="space-y-2 text-sm text-right">
                        <p>Atmosphere: Calm</p>
                        <p>Altitude: 8,200ft</p>
                        <p>HUD: Active</p>
                      </div>
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
