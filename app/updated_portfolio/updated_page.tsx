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
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-light text-zinc-300">00</span>
            <div>
              <h3 className="text-xl font-medium text-zinc-900">BMW Adaptive Generative UI</h3>
              <p className="text-xs text-zinc-500 mt-1">
                2025 June - Present · UX Engineer Intern · BMW Group Technology Office · US Expansion Team
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mb-8 rounded-lg overflow-hidden bg-zinc-100">
            <img
              src="/assets/project-00-hero.png"
              alt="BMW Adaptive Generative UI - Car interior with digital interface"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left - Diagram */}
            <div className="bg-zinc-50 rounded-lg p-6">
              <img
                src="/assets/project-00-diagram.png"
                alt="System architecture diagram"
                className="w-full h-auto"
              />
            </div>

            {/* Right - Overview & Highlights */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Overview</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Developed an adaptive generative UI system for BMW vehicles that dynamically adjusts interface elements based on driver behavior, environmental conditions, and personal preferences.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Key Contributions</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Led UX research with 50+ participants</li>
                  <li>• Designed adaptive UI component library</li>
                  <li>• Implemented real-time personalization engine</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-medium text-zinc-900">MVP</p>
                  <p className="text-xs text-zinc-500">Delivered</p>
                </div>
                <div className="bg-zinc-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-medium text-zinc-900">+32</p>
                  <p className="text-xs text-zinc-500">Net Promoter Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          <div className="grid grid-cols-3 gap-4">
            <img
              src="/assets/project-00-detail-1.png"
              alt="BMW UI Detail 1"
              className="w-full h-40 object-cover rounded-lg bg-zinc-100"
            />
            <img
              src="/assets/project-00-detail-2.png"
              alt="BMW UI Detail 2"
              className="w-full h-40 object-cover rounded-lg bg-zinc-100"
            />
            <img
              src="/assets/project-00-detail-3.png"
              alt="BMW UI Detail 3"
              className="w-full h-40 object-cover rounded-lg bg-zinc-100"
            />
          </div>
        </article>

        {/* Project 01 - SmaSH Lab | Proactive Agent */}
        <article className="mb-24">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-light text-zinc-300">01</span>
            <div>
              <h3 className="text-xl font-medium text-zinc-900">SmaSH Lab | Proactive Agent</h3>
              <p className="text-xs text-zinc-500 mt-1">
                2024 · Research Assistant · Carnegie Mellon University SmaSH Lab · Research Assistant
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left - NLP Diagram */}
            <div>
              <h4 className="text-sm font-medium text-zinc-700 mb-4">NLP & Semantic Analysis</h4>
              <div className="bg-zinc-50 rounded-lg p-6">
                <img
                  src="/assets/project-01-diagram.png"
                  alt="NLP and Semantic Analysis diagram"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right - Overview & Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Overview</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Developed a proactive AI agent that anticipates user needs through semantic analysis and contextual understanding.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Key Contributions</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• NLP pipeline development</li>
                  <li>• User intent prediction model</li>
                  <li>• Real-time response generation</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Capabilities</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Context-aware suggestions</li>
                  <li>• Multi-modal interaction</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chart and Additional Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-zinc-50 rounded-lg p-6">
              <img
                src="/assets/project-01-chart.png"
                alt="Research data visualization"
                className="w-full h-auto"
              />
            </div>
            <div className="bg-zinc-50 rounded-lg p-6">
              <p className="text-sm text-zinc-600 leading-relaxed">
                Proactive Agent improves response accuracy and user satisfaction through intelligent anticipation.
              </p>
            </div>
          </div>

          {/* Additional Images */}
          <div className="grid grid-cols-4 gap-4">
            <img src="/assets/project-01-img-1.png" alt="SmaSH Lab Image 1" className="w-full h-32 object-cover rounded-lg bg-zinc-100" />
            <img src="/assets/project-01-img-2.png" alt="SmaSH Lab Image 2" className="w-full h-32 object-cover rounded-lg bg-zinc-100" />
            <img src="/assets/project-01-img-3.png" alt="SmaSH Lab Image 3" className="w-full h-32 object-cover rounded-lg bg-zinc-100" />
            <img src="/assets/project-01-img-4.png" alt="SmaSH Lab Image 4" className="w-full h-32 object-cover rounded-lg bg-zinc-100" />
          </div>
        </article>

        {/* Project 02 - AI Trend Forecasting Plugin */}
        <article className="mb-24">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left - Screenshots */}
            <div className="space-y-4">
              <img
                src="/assets/project-02-screen-1.png"
                alt="AI Trend Forecasting Plugin screenshot 1"
                className="w-full h-auto rounded-lg bg-zinc-100"
              />
              <div className="grid grid-cols-4 gap-2">
                <img src="/assets/project-02-thumb-1.png" alt="Thumbnail 1" className="w-full h-16 object-cover rounded bg-zinc-100" />
                <img src="/assets/project-02-thumb-2.png" alt="Thumbnail 2" className="w-full h-16 object-cover rounded bg-zinc-100" />
                <img src="/assets/project-02-thumb-3.png" alt="Thumbnail 3" className="w-full h-16 object-cover rounded bg-zinc-100" />
                <img src="/assets/project-02-thumb-4.png" alt="Thumbnail 4" className="w-full h-16 object-cover rounded bg-zinc-100" />
              </div>
            </div>

            {/* Right - Overview & Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Overview</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Designed and developed an AI-powered trend forecasting plugin that helps businesses predict market trends and consumer behavior patterns.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Key Highlights</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Machine learning integration</li>
                  <li>• Real-time data visualization</li>
                  <li>• Predictive analytics dashboard</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Value</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-medium text-zinc-900">12</p>
                    <p className="text-xs text-zinc-500">Industries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-medium text-zinc-900">12</p>
                    <p className="text-xs text-zinc-500">Data Sources</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-medium text-zinc-900">7</p>
                    <p className="text-xs text-zinc-500">Prediction Models</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Project 03 - Emma's Tree */}
        <article className="mb-24">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-light text-zinc-300">03</span>
            <div>
              <h3 className="text-xl font-medium text-zinc-900">Emma's Tree</h3>
              <p className="text-xs text-zinc-500 mt-1">
                2023 July - 2023 Oct · Capstone Project · Designer & Illustrator
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left - Tree Image */}
            <div className="bg-zinc-50 rounded-lg p-8 flex items-center justify-center">
              <img
                src="/assets/project-03-tree.png"
                alt="Emma's Tree - 3D printed tree sculpture"
                className="w-full max-w-sm h-auto"
              />
            </div>

            {/* Right - Overview & Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Overview</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  A 3D printed art installation exploring the relationship between nature and technology through generative design.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Key Highlights</h4>
                <ul className="text-sm text-zinc-600 space-y-1">
                  <li>• Generative algorithm design</li>
                  <li>• Multi-material 3D printing</li>
                  <li>• Exhibition at CMU Gallery</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">Tools</h4>
                <p className="text-sm text-zinc-600">
                  Rhino, Grasshopper, Prusa Slicer
                </p>
              </div>
            </div>
          </div>

          {/* Filament Temperature Sidebar + Process Images */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 text-white rounded-lg p-4 flex items-center justify-center">
              <p className="text-xs tracking-widest uppercase transform -rotate-90 whitespace-nowrap">
                Filament Temperature
              </p>
            </div>
            <img src="/assets/project-03-process-1.png" alt="Process 1" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
            <img src="/assets/project-03-process-2.png" alt="Process 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
            <img src="/assets/project-03-process-3.png" alt="Process 3" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
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
          <img src="/assets/prototype-1.png" alt="Prototype 1" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/prototype-2.png" alt="Prototype 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/prototype-3.png" alt="Prototype 3" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/prototype-4.png" alt="Prototype 4" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/prototype-5.png" alt="Prototype 5" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/prototype-6.png" alt="Prototype 6" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src="/assets/arvr-1.png" alt="AR/VR Project 1" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/arvr-2.png" alt="AR/VR Project 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/arvr-3.png" alt="AR/VR Project 3" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/arvr-4.png" alt="AR/VR Project 4" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/arvr-5.png" alt="AR/VR Project 5" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/assets/arvr-6.png" alt="AR/VR Project 6" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
        </div>
      </section>

      {/* Nice to Meet You Section */}
      <section className="mx-auto max-w-6xl px-8 pb-16">
        <h2 className="text-lg font-medium text-zinc-900 mb-8">
          NICE TO MEET YOU!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-2">
            <img src="/photo-group.png" alt="Group photo" className="col-span-2 row-span-2 w-full h-full object-cover rounded-lg" />
            <img src="/photo-laptop.png" alt="Working" className="w-full h-24 object-cover rounded-lg" />
            <img src="/photo-spray.png" alt="Creating" className="w-full h-24 object-cover rounded-lg" />
          </div>

          {/* Contact Card + Beach Photo */}
          <div className="grid grid-rows-2 gap-2">
            {/* Contact Card */}
            <div className="border border-zinc-200 rounded-lg p-6 flex flex-col justify-between">
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

            {/* Beach Photo */}
            <img src="/photo-beach.png" alt="Beach photo" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
