"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function Portfolio() {
  return (
    <div className={`${inter.className} min-h-screen bg-white`}>
      {/* Header Section */}
      <header className="mx-auto max-w-6xl px-8 pt-16 pb-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
          Product Designer
        </p>
        <h1 className="text-4xl font-medium tracking-tight text-zinc-900 mb-1">
          Rina Kim
        </h1>
        <p className="text-lg text-zinc-400 font-light mb-6">
          UX/UI Design · Prototyping · Systems Thinking
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl mb-1">
          Masters in Human-Computer Interaction from <span className="font-medium text-zinc-900">Carnegie Mellon University</span>.
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl mb-6">
          Previously at <span className="font-medium text-zinc-900">BMW Group Technology Office</span>.
        </p>
        <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl mb-8">
          Specializing in generative interfaces, interface design, and rapid prototypes that bridge research and production.
        </p>

        {/* Navigation Links */}
        <nav className="flex gap-6 text-sm">
          <a href="#selected-works" className="text-zinc-500 hover:text-zinc-900 transition-colors">
            → Selected Works
          </a>
          <a href="#prototypes" className="text-zinc-500 hover:text-zinc-900 transition-colors">
            → Rapid Prototypes
          </a>
          <a href="#arvr" className="text-zinc-500 hover:text-zinc-900 transition-colors">
            → AR/VR
          </a>
        </nav>
      </header>

      {/* Selected Works Section */}
      <section id="selected-works" className="mx-auto max-w-6xl px-8 pb-16">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-900">
            Selected Works
          </h2>
          <div className="flex-1 h-[3px] bg-[#FDE992]" />
        </div>

        {/* Project 00 - BMW Adaptive Generative UI */}
        <article className="mb-24">
          {/* Header */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-light text-zinc-300">00</span>
            <div>
              <h3 className="text-xl font-medium text-zinc-900">BMW Adaptive Generative UI</h3>
              <p className="text-xs text-zinc-500 mt-1">
                2025 June - 2026 January · BMW Group Technology Office · UX Engineer Intern
              </p>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Left Column - Hero + Capabilities */}
            <div className="space-y-4">
              {/* Hero Image */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/images/00/neueklasse.webp"
                  alt="BMW Adaptive Generative UI - Car interior"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Capabilities Diagram */}
              <div>
                <img
                  src="/images/00/bmwinfograph.png"
                  alt="System architecture diagram"
                  className="w-full h-auto"
                />
                <p className="text-[10px] text-zinc-400 mt-2 tracking-wide">Capabilities</p>
              </div>
            </div>

            {/* Middle Column - Overview, Contributions, Impact */}
            <div className="space-y-5">
              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Overview</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Developed an adaptive generative UI system for BMW vehicles that dynamically adjusts interface elements based on driver behavior, environmental conditions, and personal preferences.
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Key Contributions</h4>
                <ul className="text-[11px] text-zinc-500 leading-relaxed space-y-0.5">
                  <li>• Led UX research with 50+ participants</li>
                  <li>• Designed adaptive UI component library</li>
                  <li>• Implemented real-time personalization engine</li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-2">Impact</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-zinc-200 rounded p-2 text-center">
                    <p className="text-sm font-medium text-zinc-800">MVP</p>
                    <p className="text-[9px] text-zinc-400">Delivered</p>
                  </div>
                  <div className="border border-zinc-200 rounded p-2 text-center">
                    <p className="text-sm font-medium text-zinc-800">+32</p>
                    <p className="text-[9px] text-zinc-400">Net Promoter Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Diagrams */}
            <div className="space-y-4">
              {/* Adaptive Interface */}
              <div className="border border-zinc-100 rounded-lg p-3 bg-white">
                <img
                  src="/images/00/Group 8.png"
                  alt="Adaptive Interface Diagram"
                  className="w-full h-auto"
                />
                <p className="text-[9px] text-zinc-400 mt-2">Multi-Modal Categorization</p>
              </div>

              {/* Pepino Layers */}
              <div className="border border-zinc-100 rounded-lg p-3 bg-white">
                <p className="text-[10px] font-medium text-zinc-500 mb-2">Pepino</p>
                <img
                  src="/images/00/portfolio infograph (1).png"
                  alt="Interface layers diagram"
                  className="w-full h-auto"
                />
                <p className="text-[9px] text-zinc-400 mt-2">Interface Design + Code</p>
              </div>
            </div>
          </div>
        </article>

        {/* Project 01 - SmaSH Lab | Proactive Agent */}
        <article className="mb-24">
          {/* Header */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-light text-zinc-300">01</span>
            <div>
              <h3 className="text-xl font-medium text-zinc-900">SmaSH Lab | Proactive Agent</h3>
              <p className="text-xs text-zinc-500 mt-1">
                2024 September - 2025 August · Carnegie Mellon University SmaSH Lab · Research Assistant
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left - NLP Diagram + Pipeline */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-700 mb-3">NLP & Semantic Analysis</h4>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="/images/01/NLP.png"
                    alt="NLP and Semantic Analysis diagram"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="border border-zinc-100 rounded-lg p-4 bg-white">
                <img
                  src="/images/01/proactive agent pipeline.png"
                  alt="Proactive Agent Pipeline"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right - Overview, Contributions, Capabilities, Chart */}
            <div className="space-y-5">
              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Overview</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Researched & built a semantic classification pipeline for adaptive multimodal systems that isolates relevant user intent from environmental noise and linguistic variations, achieving &gt;90% response accuracy.
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Key Contributions</h4>
                <ul className="text-[11px] text-zinc-500 leading-relaxed space-y-0.5">
                  <li>• NLP pipeline development</li>
                  <li>• User intent prediction model</li>
                  <li>• Real-time response generation</li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Capabilities</h4>
                <ul className="text-[11px] text-zinc-500 leading-relaxed space-y-0.5">
                  <li>• UX Design</li>
                  <li>• System Design</li>
                  <li>• LLM</li>
                </ul>
              </div>

              {/* Chart */}
              <div className="border border-zinc-100 rounded-lg p-4 bg-white">
                <img
                  src="/images/01/updatedGraph.png"
                  alt="Proactive Agent Response Accuracy"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </article>

        {/* Project 02 - AI Trend Forecasting Plugin */}
        <article className="mb-24">
          {/* Header */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-light text-zinc-300">02</span>
            <div>
              <h3 className="text-xl font-medium text-zinc-900">AI Trend Forecasting Plugin</h3>
              <p className="text-xs text-zinc-500 mt-1">
                2024 January - 2024 August · Carnegie Mellon University & AccuWeek · UX Researcher
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left - Screenshots */}
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-zinc-100">
                <img
                  src="/images/02/trend_forecasting_dashboard 1.png"
                  alt="AI Trend Forecasting Plugin dashboard"
                  className="w-full h-auto"
                />
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-100">
                <img
                  src="/images/02/SurefrontInterviews.png"
                  alt="Surefront Interviews"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right - Overview & Details */}
            <div className="space-y-5">
              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Overview</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Designed and developed an AI-powered trend forecasting plugin that helps businesses predict market trends and consumer behavior patterns.
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Key Highlights</h4>
                <ul className="text-[11px] text-zinc-500 leading-relaxed space-y-0.5">
                  <li>• Machine learning integration</li>
                  <li>• Real-time data visualization</li>
                  <li>• Predictive analytics dashboard</li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-2">Value</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-zinc-200 rounded p-2 text-center">
                    <p className="text-lg font-medium text-zinc-800">12</p>
                    <p className="text-[9px] text-zinc-400">Industries</p>
                  </div>
                  <div className="border border-zinc-200 rounded p-2 text-center">
                    <p className="text-lg font-medium text-zinc-800">12</p>
                    <p className="text-[9px] text-zinc-400">Data Sources</p>
                  </div>
                  <div className="border border-zinc-200 rounded p-2 text-center">
                    <p className="text-lg font-medium text-zinc-800">7</p>
                    <p className="text-[9px] text-zinc-400">Models</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Project 03 - Emma's Tree */}
        <article className="mb-24">
          {/* Header */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-light text-zinc-300">03</span>
            <div>
              <h3 className="text-xl font-medium text-zinc-900">Emma&apos;s Tree</h3>
              <p className="text-xs text-zinc-500 mt-1">
                2023 July - 2023 Oct · Capstone Project · Designer & Illustrator
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left - Tree Image */}
            <div className="space-y-4">
              <div className="bg-zinc-50 rounded-lg p-6 flex items-center justify-center">
                <img
                  src="/images/03/likearealtree 1.png"
                  alt="Emma's Tree - 3D printed tree sculpture"
                  className="w-full max-w-xs h-auto"
                />
              </div>

              {/* Filament Temperature + Process Images */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-900 text-white rounded-lg p-3 flex items-center justify-center min-h-[100px]">
                  <p className="text-[8px] tracking-widest uppercase transform -rotate-90 whitespace-nowrap">
                    Filament Temperature
                  </p>
                </div>
                <img src="/images/03/12 1.png" alt="Process 1" className="w-full h-auto object-cover rounded-lg" />
                <img src="/images/03/Group 13.png" alt="Process 2" className="w-full h-auto object-cover rounded-lg" />
              </div>
            </div>

            {/* Right - Overview & Details */}
            <div className="space-y-5">
              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Overview</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  A 3D printed art installation exploring the relationship between nature and technology through generative design.
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Key Highlights</h4>
                <ul className="text-[11px] text-zinc-500 leading-relaxed space-y-0.5">
                  <li>• Generative algorithm design</li>
                  <li>• Multi-material 3D printing</li>
                  <li>• Exhibition at CMU Gallery</li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400 mb-1.5">Tools</h4>
                <p className="text-[11px] text-zinc-500">
                  Rhino, Grasshopper, Prusa Slicer
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Prototypes Section */}
      <section id="prototypes" className="mx-auto max-w-6xl px-8 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-900">
            Prototypes
          </h2>
          <div className="flex-1 h-[3px] bg-[#FDE992]" />
        </div>

        <div className="flex gap-2 mb-6 text-xs text-zinc-400">
          <span className="px-2 py-1 bg-zinc-100 rounded">→ SKILLS</span>
          <span className="px-2 py-1 bg-zinc-100 rounded">→ BUILDS</span>
          <span className="px-2 py-1 bg-zinc-100 rounded">→ SKILLS</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Row 1 */}
          <img src="/images/prototypes/ResponsiveTale 1.png" alt="ResponsiveTale" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/peppersghost01.png" alt="Pepper's Ghost" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/stopmotion 1.png" alt="Stop Motion 1" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          {/* Row 2 */}
          <img src="/images/prototypes/flexvr 1.png" alt="FlexVR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/emmasjellyfish01 1.png" alt="Emma's Jellyfish" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/stopmotion02.png" alt="Stop Motion 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          {/* Row 3 */}
          <img src="/images/prototypes/LeARn.png" alt="LeARn" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/portalreef 1.png" alt="Portal Reef" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/cmupopup 1.png" alt="CMU Popup" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
        </div>
      </section>

      {/* AR/VR Section */}
      <section id="arvr" className="mx-auto max-w-6xl px-8 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-zinc-900">
            AR/VR
          </h2>
          <div className="flex-1 h-[3px] bg-[#FDE992]" />
        </div>

        <div className="flex gap-2 mb-6 text-xs text-zinc-400">
          <span className="px-2 py-1 bg-zinc-100 rounded">→ UNITY</span>
          <span className="px-2 py-1 bg-zinc-100 rounded">→ META SDK</span>
          <span className="px-2 py-1 bg-zinc-100 rounded">→ BLENDER</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="/images/ARVR/pianoroom 1.png" alt="Piano Room VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/pianoroom02 1.png" alt="Piano Room VR 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/studyhall 1.png" alt="Study Hall VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/forest01 1.png" alt="Forest VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/trees01 1.png" alt="Trees VR 1" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/trees02 1.png" alt="Trees VR 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/flowers 1.png" alt="Flowers VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/Untitled design (10) 1.png" alt="VR Design" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
        </div>
      </section>

      {/* Nice to Meet You Section */}
      <section className="mx-auto max-w-6xl px-8 pb-16">
        <h2 className="text-lg font-medium text-zinc-900 mb-8">
          NICE TO MEET YOU!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-2">
            <img src="/images/NiceToMeetYou/designworksgroup.png" alt="DesignWorks group photo" className="w-full h-48 object-cover rounded-lg" />
            <img src="/images/NiceToMeetYou/buildingcloud.png" alt="Building cloud" className="w-full h-48 object-cover rounded-lg" />
            <img src="/images/NiceToMeetYou/buildingpeppersghost.png" alt="Building pepper's ghost" className="w-full h-48 object-cover rounded-lg" />
            <img src="/images/NiceToMeetYou/rh.png" alt="Portrait" className="w-full h-48 object-cover rounded-lg" />
          </div>

          {/* Contact Card */}
          <div className="border border-zinc-200 rounded-lg p-6 flex flex-col justify-between min-h-[400px]">
            <div className="text-center">
              <p className="text-xs tracking-[0.2em] text-zinc-400 mb-1">PRODUCT DESIGNER</p>
              <h3 className="text-xl tracking-[0.15em] text-zinc-800 font-normal">RINA KIM</h3>
            </div>

            <div className="text-center">
              <p className="text-xs tracking-[0.1em] text-zinc-500 mb-1">BY.RINAKIM@GMAIL.COM</p>
              <a
                href="https://drive.google.com/file/d/1lGNm_Zh5L_niGyPaLJNQ7LzrP30lhi_t/view?usp=sharing"
                target="_blank"
                className="text-xs tracking-[0.1em] text-zinc-500 underline hover:text-zinc-900"
              >
                RESUME
              </a>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-xs tracking-[0.1em] text-zinc-700">LETS WORK TOGETHER</span>
              <a
                href="https://www.linkedin.com/in/rina-kim-9a3864171/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <img src="/linkedin-icon.png" alt="LinkedIn" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
