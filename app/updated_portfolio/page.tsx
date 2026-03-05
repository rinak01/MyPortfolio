"use client";

import { useState } from "react";
import OriginalPortfolio from "./updated_page";
import Var4Gallery from "./variations/Var4Gallery";
import Var7ClassyAuto from "./variations/Var7ClassyAuto";
import Var8ClassyAutoLight from "./variations/Var8ClassyAutoLight";
import { motion, AnimatePresence } from "framer-motion";

export default function PortfolioSwitcher() {
  const [activeVariation, setActiveVariation] = useState<number>(1); // Default: Automotive HMI (Luxury Dark)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const variations = [
    { id: 0, name: "Gallery", component: Var4Gallery },
    { id: 1, name: "Automotive HMI (Luxury Dark)", component: Var7ClassyAuto },
    { id: 2, name: "Automotive HMI (Luxury Light)", component: Var8ClassyAutoLight },
  ];

  const ActiveComponent = variations[activeVariation].component;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVariation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>

      {/* Floating Switcher Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">

        {/* Expandable Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-1 w-72 overflow-hidden"
            >
              <div className="text-zinc-400 text-xs uppercase tracking-widest font-semibold p-3 pb-2 border-b border-white/10 mb-1 text-center">
                Select Aesthetic
              </div>
              {variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setActiveVariation(v.id);
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeVariation === v.id
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {v.id === 0 ? "0. " : `${v.id}. `}{v.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dock Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-zinc-900 text-white px-6 py-3.5 rounded-full border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 hover:bg-black hover:scale-105 transition-all font-sans group"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-zinc-900 text-xs font-bold shadow-sm">
            {activeVariation}
          </div>
          <span className="font-semibold text-sm tracking-wide">
            {variations[activeVariation].name}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 text-zinc-400 group-hover:text-white ${isMenuOpen ? "rotate-180" : ""}`}>
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      </div>
    </>
  );
}
