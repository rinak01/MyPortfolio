"use client";

import { motion } from "framer-motion";
import { Outfit, DM_Sans } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["200", "300", "400", "500"] });
const sans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

// Cinematic, slow fade animation
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

export default function Var8ClassyAutoLight() {
  return (
    <div className={`${sans.className} min-h-screen bg-[#F7F7F7] text-[#595959] selection:bg-[#B39D82] selection:text-[#F7F7F7] font-light`}>
      
      {/* Subtle material texture overlay */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      {/* Refined Header */}
      <header className="px-8 md:px-16 pt-24 pb-16 max-w-[1600px] mx-auto">
        <motion.div initial="hidden" animate="visible" variants={slowFade} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className={`${outfit.className} text-5xl md:text-7xl font-light text-[#1A1A1A] tracking-tight mb-4`}>
              Rina Kim
            </h1>
            <p className="text-sm md:text-base tracking-[0.15em] uppercase text-[#8C8C8C]">
              Product Designer — Automotive & Spatial
            </p>
          </div>
          <div className="text-right text-sm leading-relaxed text-[#8C8C8C]">
            <p>Carnegie Mellon University (MHI)</p>
            <p>Prev. BMW Group Technology Office</p>
          </div>
        </motion.div>
        
        <motion.div initial="hidden" animate="visible" variants={lineReveal} className="w-full h-[1px] bg-gradient-to-r from-[#B39D82]/50 via-[#B39D82]/20 to-transparent" />
      </header>

      <main className="max-w-[1600px] mx-auto px-8 md:px-16 pb-32 space-y-40">

        {/* Project 00: BMW */}
        <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade} className="group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#1A1A1A]`}>01</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#B39D82]">BMW Group</span>
              </div>
              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#1A1A1A] mb-6`}>Adaptive Generative UI</h2>
                <div className="space-y-6 text-[15px] leading-relaxed">
                  <p>
                    Developed an adaptive generative UI system for BMW vehicles that dynamically adjusts interface elements based on driver behavior, environmental conditions, and personal preferences.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-4">
                      <span className="text-[#B39D82]">—</span>
                      <span>Engineered a modular multi-agent architecture delegating intensive rendering tasks.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-[#B39D82]">—</span>
                      <span>Developed a React-based orchestration layer eliminating synchronous execution stalls.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8 space-y-6">
              <div className="aspect-[21/9] overflow-hidden bg-[#EDEDED] rounded-sm">
                <img src="/images/00/neueklasse.webp" alt="BMW Interface" className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-video bg-[#EDEDED] rounded-sm p-8 flex items-center justify-center border border-[#E5E5E5]">
                  <img src="/images/00/layers.png" alt="Architecture" className="w-full h-auto opacity-80 mix-blend-multiply" />
                </div>
                <div className="aspect-video bg-[#EDEDED] rounded-sm p-8 flex items-center justify-center border border-[#E5E5E5]">
                  <img src="/images/00/pipeline.png" alt="Pipeline" className="w-full h-auto opacity-80 mix-blend-multiply" />
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-[#E5E5E5]" />

        {/* Project 01: SmaSH */}
        <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8 order-2 lg:order-1 space-y-6">
              <div className="aspect-[21/9] overflow-hidden bg-[#EDEDED] rounded-sm p-0 flex items-center justify-center border border-[#E5E5E5]">
                <img src="/images/01/proactive agent pipeline.png" alt="Pipeline" className="w-full h-full object-cover mix-blend-multiply opacity-80 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
              </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#1A1A1A]`}>02</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#B39D82]">CMU SmaSH Lab</span>
              </div>
              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#1A1A1A] mb-6`}>Proactive Agent</h2>
                <div className="space-y-6 text-[15px] leading-relaxed">
                  <p>
                    A semantic classification pipeline for adaptive multimodal systems that isolates relevant user intent from environmental noise and linguistic variations.
                  </p>
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <span className="block text-xs uppercase tracking-widest text-[#8C8C8C] mb-2">Performance Metric</span>
                    <span className={`${outfit.className} text-2xl text-[#1A1A1A]`}>&gt;90% Accuracy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-[#E5E5E5]" />

        {/* Project 02: Surefront */}
        <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#1A1A1A]`}>03</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#B39D82]">Surefront</span>
              </div>
              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#1A1A1A] mb-6`}>AI Trend Forecasting</h2>
                <div className="space-y-6 text-[15px] leading-relaxed">
                  <p>
                    B2B tool designed to bridge the gap between high-level data analytics and creative execution using dynamic data integration.
                  </p>
                  <ul className="space-y-4 pt-4 border-t border-[#E5E5E5]">
                    <li className="flex justify-between items-center">
                      <span className="text-xs uppercase tracking-widest text-[#8C8C8C]">Research Latency</span>
                      <span className={`${outfit.className} text-xl text-[#1A1A1A]`}>-75%</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-xs uppercase tracking-widest text-[#8C8C8C]">Interaction Cost</span>
                      <span className={`${outfit.className} text-xl text-[#1A1A1A]`}>-90%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="aspect-[21/9] overflow-hidden bg-[#EDEDED] rounded-sm">
                <img src="/images/02/trend_forecasting_dashboard 1.png" alt="Dashboard" className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
              </div>
            </div>
          </div>
        </motion.article>

        <div className="w-full h-[1px] bg-[#E5E5E5]" />

        {/* Project 03: Emma's Tree */}
        <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} variants={slowFade}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             <div className="lg:col-span-8 order-2 lg:order-1 flex gap-6">
              <div className="w-2/3 aspect-[4/3] overflow-hidden bg-[#EDEDED] rounded-sm">
                <img src="/images/03/emmastree.png" alt="Emma's Tree" className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all duration-1000 ease-out" />
              </div>
              <div className="w-1/3 flex flex-col gap-6">
                <div className="h-1/2 bg-[#EDEDED] rounded-sm p-6 flex items-center justify-center border border-[#E5E5E5]">
                  <img src="/images/03/treesystem.png" alt="System" className="w-full h-auto opacity-80 mix-blend-multiply" />
                </div>
                <div className="h-1/2 bg-[#EDEDED] rounded-sm p-6 flex items-center justify-center border border-[#E5E5E5]">
                  <img src="/images/03/tempchange.png" alt="Temp" className="w-full h-auto opacity-80 mix-blend-multiply" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <span className={`${outfit.className} text-5xl font-light text-[#1A1A1A]`}>04</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#B39D82]">Biomimicry</span>
              </div>
              <div>
                <h2 className={`${outfit.className} text-3xl font-light text-[#1A1A1A] mb-6`}>Emma's Tree</h2>
                <div className="space-y-6 text-[15px] leading-relaxed">
                  <p>
                    A synthetic plant reacting to environmental changes exactly like a biological organism, functioning as a seamless, stress-free monitor.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="text-xs uppercase tracking-widest text-[#8C8C8C] border border-[#E5E5E5] px-3 py-1.5 rounded-sm">Temp Filament</span>
                    <span className="text-xs uppercase tracking-widest text-[#8C8C8C] border border-[#E5E5E5] px-3 py-1.5 rounded-sm">Moisture Sensor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Visual Index */}
        <section className="pt-20">
          <h2 className={`${outfit.className} text-3xl font-light text-[#1A1A1A] mb-12`}>Spatial Environments & Prototypes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slowFade} className="col-span-2 row-span-2 aspect-square bg-[#EDEDED] overflow-hidden rounded-sm group relative">
              <img src="/images/ARVR/library.png" alt="Library VR" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
            {["ResponsiveTale 1.png", "peppersghost01.png", "stopmotion01.png", "flexvr 1.png", "emmasjellyfish01 1.png", "studyhall 1.png"].map((img, i) => (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slowFade} key={i} className="aspect-square bg-[#EDEDED] overflow-hidden rounded-sm group relative">
                 <img src={img.includes("1.") || img.includes("01.") ? `/images/prototypes/${img}` : `/images/ARVR/${img}`} alt="Visual" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700" onError={(e) => { e.currentTarget.src = "/images/ARVR/forest01 1.png" }} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Footer */}
        <footer className="pt-32 pb-16">
          <div className="bg-[#EDEDED] rounded-sm p-12 md:p-24 flex flex-col md:flex-row justify-between items-center gap-12 border border-[#E5E5E5]">
            <div className="max-w-xl">
              <h2 className={`${outfit.className} text-4xl text-[#1A1A1A] font-light mb-6`}>Initiate a conversation.</h2>
              <p className="text-[#8C8C8C] text-[15px] leading-relaxed mb-8">
                Available for opportunities at the intersection of physical systems and digital interfaces.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a href="mailto:by.rinakim@gmail.com" className="text-[#1A1A1A] hover:text-[#B39D82] transition-colors border-b border-[#1A1A1A]/20 hover:border-[#B39D82] pb-1 uppercase tracking-widest text-sm inline-block w-fit">by.rinakim@gmail.com</a>
                <a href="https://www.linkedin.com/in/rina-kim-9a3864171/" target="_blank" className="text-[#1A1A1A] hover:text-[#B39D82] transition-colors border-b border-[#1A1A1A]/20 hover:border-[#B39D82] pb-1 uppercase tracking-widest text-sm inline-block w-fit">LinkedIn Profile</a>
              </div>
            </div>
            
            <div className="flex gap-4">
               <img src="/images/NiceToMeetYou/rh.png" alt="Rina" className="w-32 h-40 object-cover opacity-90 rounded-sm" />
               <img src="/images/NiceToMeetYou/designworksgroup.png" alt="Team" className="w-32 h-40 object-cover opacity-90 rounded-sm" />
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
