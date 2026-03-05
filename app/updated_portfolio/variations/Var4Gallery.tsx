"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import { useRef } from "react";

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function Var4Gallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yImage1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yImage2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className={`${montserrat.className} min-h-screen bg-[#0A0A0A] text-[#E0E0E0] selection:bg-[#D4AF37] selection:text-black overflow-hidden`}>

      {/* Refined Navigation */}
      <nav className="fixed w-full z-50 mix-blend-difference top-0 py-8 px-12 flex justify-between items-center text-xs tracking-[0.3em] uppercase text-[#E0E0E0]">
        <span>R. Kim</span>
        <div className="flex gap-12">
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Exhibition</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Archive</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: "easeOut" }}
          className="relative z-10"
        >
          <h1 className={`${bodoni.className} text-7xl md:text-9xl font-normal tracking-tight text-white mb-6`}>
            Rina Kim<span className="text-[#D4AF37]">.</span>
          </h1>
          <p className="text-sm md:text-base font-light tracking-[0.2em] uppercase text-[#888] max-w-xl mx-auto leading-loose">
            Curating human-computer interactions.<br />
            Bridging research & production.
          </p>
        </motion.div>

        {/* Decorative thin line */}
        <motion.div
          initial={{ height: 0 }} animate={{ height: "150px" }} transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-0 w-px bg-gradient-to-b from-[#D4AF37] to-transparent"
        />
      </header>

      <main className="max-w-7xl mx-auto px-8 py-32 space-y-48">

        {/* Project 00 */}
        <div className="flex flex-col md:flex-row items-center gap-24">
          <div className="w-full md:w-1/2 relative h-[80vh] overflow-hidden group">
            <motion.div style={{ y: yImage1 }} className="absolute inset-0 -top-[20%] -bottom-[20%]">
              <img src="/images/00/neueklasse.webp" alt="BMW" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            </motion.div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </div>

          <div className="w-full md:w-1/2">
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1 }}>
              <span className={`${bodoni.className} text-8xl text-[#222] absolute -z-10 -ml-12 -mt-16`}>I</span>
              <h2 className={`${bodoni.className} text-4xl md:text-5xl text-white mb-6 leading-snug`}>BMW Adaptive<br />Generative UI</h2>
              <div className="h-px w-24 bg-[#D4AF37] mb-8" />
              <p className="text-[#A0A0A0] leading-relaxed font-light mb-8 max-w-md">
                An adaptive generative UI system designed for BMW vehicles, dynamically adjusting interface elements based on telemetry and driver behavior.
              </p>
              <a href="#" className="text-xs tracking-[0.2em] uppercase text-white border-b border-[#333] pb-1 hover:border-[#D4AF37] transition-colors">View Details</a>
            </motion.div>
          </div>
        </div>

        {/* Project 01 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-24">
          <div className="w-full md:w-1/2 relative h-[80vh] overflow-hidden group">
            <motion.div style={{ y: yImage2 }} className="absolute inset-0 -top-[20%] -bottom-[20%]">
              <img src="/images/01/proactive agent pipeline.png" alt="SmaSH Lab" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0" />
            </motion.div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />
          </div>

          <div className="w-full md:w-1/2 text-right">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1 }}>
              <span className={`${bodoni.className} text-8xl text-[#222] absolute -z-10 ml-24 -mt-16`}>II</span>
              <h2 className={`${bodoni.className} text-4xl md:text-5xl text-white mb-6 leading-snug`}>SmaSH Lab<br />Proactive Agent</h2>
              <div className="h-px w-24 bg-[#D4AF37] mb-8 ml-auto" />
              <p className="text-[#A0A0A0] leading-relaxed font-light mb-8 max-w-md ml-auto">
                Semantic filtering and NLP built to intelligently distinguish relevant user intent from ambient speech for non-intrusive voice interfaces.
              </p>
              <a href="#" className="text-xs tracking-[0.2em] uppercase text-white border-b border-[#333] pb-1 hover:border-[#D4AF37] transition-colors">View Details</a>
            </motion.div>
          </div>
        </div>

      </main>

      <footer className="py-24 border-t border-[#222] text-center mt-32">
        <h2 className={`${bodoni.className} text-4xl text-white mb-8`}>Inquiries</h2>
        <a href="mailto:by.rinakim@gmail.com" className="text-xs tracking-[0.3em] uppercase text-[#A0A0A0] hover:text-[#D4AF37] transition-colors">
          by.rinakim@gmail.com
        </a>
      </footer>
    </div>
  );
}
