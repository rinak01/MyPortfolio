"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function Portfolio() {
  return (
    <div className={`${inter.className} min-h-screen bg-white`}>
      {/* Header Section */}
      <header className="mx-auto max-w-6xl px-10 pt-19 pb-29">
        <p className="mb-1 text-[14px] font-medium uppercase tracking-[0.2em] text-zinc-400">
          Product Designer
        </p>
        <h1 className="text-5xl font-medium tracking-tight text-zinc-900 mb-1 -ml-[4px]">
          Rina Kim
        </h1>
        <p className="text-lg text-zinc-400 font-light mb-6">
          UX/UI Design · Prototyping · Systems Thinking
        </p>
        <p className="text-lg text-zinc-600 leading-normal max-w-2xl mb-1">
          Masters in Human-Computer Interaction from <span className="font-medium text-zinc-900">Carnegie Mellon University</span>.
        </p>
        <p className="text-lg text-zinc-600 leading-normal max-w-2xl mb-6">
          Previously at <span className="font-medium text-zinc-900">BMW Group Technology Office</span>.
        </p>
        <p className="text-lg text-zinc-500 leading-normal max-w-3xl mb-12">
          Specializing in Automotive HMI, Interface Design, and Rapid Prototyping that bridge research and production.
        </p>

        {/* Navigation Links */}
        <nav className="flex text-[18px]">
          {/* Vertical line with dots */}
          <div className="flex flex-col items-center mr-3">
            <div className="w-[5px] h-[5px] rounded-full bg-zinc-300" />
            <div className="w-[1px] flex-1 bg-zinc-300" style={{ minHeight: '28px' }} />
            <div className="w-[5px] h-[5px] rounded-full bg-zinc-300" />
            <div className="w-[1px] flex-1 bg-zinc-300" style={{ minHeight: '28px' }} />
            <div className="w-[5px] h-[5px] rounded-full bg-zinc-300" />
          </div>

          {/* Text links */}
          <div className="flex flex-col justify-between py-[px]">
            <a
              href="#selected-works"
              onClick={(e) => { e.preventDefault(); document.getElementById('selected-works')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-zinc-400 hover:text-zinc-700 hover:font-medium transition-all cursor-pointer leading-none"
            >
              Selected Works
            </a>
            <a
              href="#prototypes"
              onClick={(e) => { e.preventDefault(); document.getElementById('prototypes')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-zinc-400 hover:text-zinc-700 hover:font-medium transition-all cursor-pointer leading-none"
            >
              Rapid Prototypes
            </a>
            <a
              href="#arvr"
              onClick={(e) => { e.preventDefault(); document.getElementById('arvr')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="text-zinc-400 hover:text-zinc-700 hover:font-medium transition-all cursor-pointer leading-none"
            >
              AR/VR
            </a>
          </div>
        </nav>
      </header>

      {/* Selected Works Section */}
      <section id="selected-works" className="mx-auto max-w-6xl px-10 pb-16">
        <div className="mb-12">
          <h2 className="text-lg font-semibold uppercase tracking-[0.1em] text-zinc-900 mb-1.5">
            Selected Works
          </h2>
          <div className="w-full h-[1px] bg-zinc-300" />
        </div>

        {/* Project 00 - BMW Adaptive Generative UI */}
        <article className="mb-24">
          {/* Header - Full Width */}
          <div className="flex items-start gap-[8px] mb-8">
            <div className="flex items-center gap-0">
              <img src="/images/00/lock01.png" alt="Lock icon" className="w-[53px] h-[53px] -mt-[32px]" />
              <span className="text-[55px] font-light text-zinc-300 -mt-[10px]">00</span>
            </div>
            <div className="-ml-[-1px]">
              <h3 className="text-[26px] font-medium text-zinc-900">BMW Adaptive Generative UI</h3>
              <p className="text-[15px] text-zinc-500 mt-1">
                2025 June - 2026 January &nbsp;·&nbsp; <span className="font-semibold">BMW Group Technology Office</span> &nbsp;·&nbsp; UX Engineer Intern
              </p>
            </div>
          </div>

          {/* Top Row - Hero Image + Overview/Contributions/Impact */}
          <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8 mb-8">
            {/* Left - Hero Image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src="/images/00/neueklasse.webp"
                alt="BMW Adaptive Generative UI - Car interior"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Right - Overview, Key Contributions, Impact */}
            <div className="space-y-11">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Overview</h4>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  • Developed an adaptive generative UI system for BMW vehicles that dynamically adjusts interface elements based on driver behavior, environmental conditions, and personal preferences.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Key Contributions</h4>
                <ul className="text-[14px] text-zinc-500 leading-relaxed space-y-1">
                  <li>• Developed a robust React-based orchestration layer to synchronize real-time telemetry between asynchronous sub-agents and the end-user interface, ensuring seamless human-machine interaction.</li>
                  <li>• Engineered a modular multi-agent architecture that delegates intensive rendering tasks to specialized sub-agents, eliminating synchronous execution stalls and ensuring high-fidelity, fluid interface responsiveness.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-1">Topics Researched</h4>
                <ul className="text-[14px] text-zinc-500 leading-relaxed space-y-0.5">
                  <li>• Generative AI</li>
                  <li>• System Design</li>
                  <li>• LLM</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row - 2 Column Layout: bmwinfograph | layers+pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left - Capabilities Diagram */}
            <div className="mt-8">
              <img
                src="/images/00/bmwinfograph.png"
                alt="Capabilities diagram"
                className="w-[83%] h-auto"
              />
              <p className="text-[10px] text-zinc-400 mt-2">• Layered Architecture Diagram</p>
            </div>

            {/* Right - Layers (top) + Pipeline (bottom) */}
            <div className="flex flex-col gap-1">
              <div className="rounded-lg p-4">
                <img
                  src="/images/00/layers.png"
                  alt="Layers diagram"
                  className="w-[70%] h-auto"
                />
                <p className="text-[10px] text-zinc-400 mt-2">• GenUI architecture illustrates a tiered synthesis pipeline that orchestrates contextual processing to deliver a real-time adoptive interface.</p>
              </div>
              <div className="rounded-lg p-4">
                <img
                  src="/images/00/pipeline.png"
                  alt="Pipeline diagram"
                  className="w-[75%] h-auto"
                />
                <p className="text-[10px] text-zinc-400 mt-2">• Synthesis pipeline that transitions from raw contextual processing to a fluid, high-fidelity adoptive interface.</p>
              </div>
            </div>
          </div>
        </article>

        {/* Project 01 - SmaSH Lab | Proactive Agent */}
        <article className="mb-24">
          {/* Header */}
          <div className="flex items-start gap-[15px] mb-8">
            <span className="text-[55px] font-light text-zinc-300 -mt-[10px]">01</span>

            <div>
              <h3 className="text-[26px] font-medium text-zinc-900">SmaSH Lab | Proactive Agent</h3>
              <p className="text-[15px] text-zinc-500 mt-1">
                2024 September - 2025 August &nbsp;·&nbsp; <span className="font-semibold">Carnegie Mellon University SmaSH Lab</span> &nbsp;·&nbsp; Research Assistant
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left - NLP Diagram + Pipeline */}
            <div className="space-y-4">
              <div>
                {/* <h4 className="text-sm font-medium text-zinc-700 mb-3">NLP & Semantic Analysis</h4> */}
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="/images/01/NLP01.png"
                    alt="NLP and Semantic Analysis diagram"
                    className="w-[90%] h-auto -mt-[80px]"
                  />
                </div>
              </div>

              <div className="rounded-lg p-4 -mt-[40px]">
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
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Overview</h4>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  • Researched & built a semantic classification pipeline for adaptive multimodal systems that isolates relevant user intent from environmental noise and linguistic variations, achieving &gt;90% response accuracy.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Key Contributions</h4>
                <ul className="text-[12px] text-zinc-500 leading-relaxed space-y-1">
                  <li>• NLP pipeline development</li>
                  <li>• User intent prediction model</li>
                  <li>• Real-time response generation</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Impact</h4>
                <ul className="text-[12px] text-zinc-500 leading-relaxed space-y-0.5">
                  <li>• UX Design</li>
                  <li>• System Design</li>
                  <li>• LLM</li>
                </ul>
              </div>

              {/* Chart */}
              <div className="rounded-lg p-4">
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
          <div className="flex items-start gap-[8px] mb-8">
            <span className="text-[55px] font-light text-zinc-300 -mt-[10px]">02</span>
            <div>
              <h3 className="text-[26px] font-medium text-zinc-900">AI Trend Forecasting Tool</h3>
              <p className="text-[15px] text-zinc-500 mt-[-1px]">
                2024 January - 2024 August &nbsp;·&nbsp; <span className="font-semibold">Carnegie Mellon University | Surefront</span> &nbsp;·&nbsp; UX Researcher & Developer
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left - Screenshots */}
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-zinc-100 w-[95%]">
                <img
                  src="/images/02/trend_forecasting_dashboard 1.png"
                  alt="AI Trend Forecasting Plugin dashboard"
                  className="w-full h-auto"
                />
              </div>
              <div className="rounded-lg overflow-hidden w-[102%] -ml-[26px]">
                <img
                  src="/images/02/SurefrontInterviews.png"
                  alt="Surefront Interviews"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right - Overview & Details */}
            <div className="space-y-10">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Overview</h4>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  • Built B2B tool designed to bridge the gap between high-level data analytics and creative execution. It leverages real-time data and AI to empower fashion professionals from designers to merchandisers to make informed, proactive decisions.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Key Features</h4>
                <ul className="text-[13px] text-zinc-500 leading-relaxed space-y-1">
                  <li>• <span className="font-semibold">Dynamic Data Integration:</span> Built to process and visualize real-time growth metrics, search volumes, and month-over-month performance curves.</li>
                  <li>• <span className="font-semibold">Agentic AI Implementation:</span> The Personal Fashion Assistant democratizes data. Instead of digging through three layers of menus to find "shoes in France," a user can simply type: "What footwear is trending in Paris right now?"</li>
                  <li>• <span className="font-semibold">Advanced Analytics & Visualization:</span> Built to process and visualize real-time growth metrics, search volumes, and month-over-month performance curves.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Impact</h4>
                <ul className="text-[13px] text-zinc-500 leading-relaxed space-y-1">
                  <li>• <span className="font-semibold">75% Reduction in Research Latency:</span> By consolidating real-time Google Trends APIs and social media scraping into a single HMI, the time required to validate a trend aesthetic against hard search data was reduced from 4 hours of manual cross-referencing to less than 60 seconds of automated dashboard interaction.</li>
                  <li>• <span className="font-semibold">90% Decrease in Interaction Cost:</span> The implementation of the "Agentic AI Co-pilot" replaced a multi-step filtering process (Average of 12 clicks per query) with a single natural language input, significantly lowering the cognitive load for non-technical stakeholders.</li>
                  <li>• <span className="font-semibold">Trend Velocity Accuracy:</span> The "Month-over-Month" performance curves provide a 42.5% more granular view of trend momentum compared to traditional static quarterly reports.</li>
                </ul>
              </div>

              {/* <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Impact</h4>
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
              </div> */}
            </div>
          </div>
        </article>

        {/* Project 03 - Emma's Tree */}
        <article className="mb-24">
          {/* Header */}
          <div className="flex items-start gap-[8px] mb-8">
            <span className="text-[55px] font-light text-zinc-300 -mt-[10px]">03</span>
            <div>
              <h3 className="text-[26px] font-medium text-zinc-900">Emma&apos;s Tree</h3>
              <p className="text-[15px] text-zinc-500 mt-1">
                2023 June - 2024 June &nbsp;·&nbsp; <span className="font-semibold">The June 19th Project, Personal Project</span> &nbsp;·&nbsp; Designer & Developer
              </p>
            </div>
          </div>

          {/* Top Row - Emma's Tree Image + Overview/Key Highlights/Tools */}
          <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-8 mb-8">
            {/* Left - Emma's Tree Main Image */}
            <div>
              <img
                src="/images/03/emmastree.png"
                alt="Emma's Tree - 3D printed tree sculpture"
                className="w-[80%] h-auto rounded-lg"
              />
            </div>

            {/* Right - Overview, Key Highlights, Tools */}
            <div className="space-y-10">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Overview</h4>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  • I built this tree for my best friend, a med student who wanted greenery without the maintenance stress. Using biomimicry, the tree reacts to environmental changes just like a real tree, functioning as both interactive companion and a functional monitor that won't die.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Key Highlights</h4>
                <ul className="text-[12px] text-zinc-500 leading-relaxed space-y-1">
                  <li>• <span className="font-semibold">The "Bloom" Effect, Color Transformation:</span> Temperature Sensitive Filament</li>
                  <li>• <span className="font-semibold">Moisture Sensing:</span> Moisture Sensor</li>
                  <li>• <span className="font-semibold">Visual Feedback:</span> LED Indicators</li>
                  <li>• <span className="font-semibold">Growth & Structure:</span> 3D Pen </li>
                  <li>• <span className="font-semibold">Sustainbility:</span> Solar-powered Battery Bank</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 mb-2">Design Thinking</h4>
                <ul className="text-[12px] text-zinc-500 leading-relaxed space-y-1.5">
                  <li>• I wanted to design using biomimicry to solve "care fatigue," so I built a synthetic plant that basically lives and reacts right along with Emma. Using temperature-sensitive filaments and environmental sensors, the tree acts as a responsive sensory anchor that mimics the energy of a real plant.</li>
                  <li className="mt-3"> I used natural materials like real moss and a ceramic pot to keep the tech feeling grounded rather than clinical. Emma was a busy med student, so I wanted to give her those restorative nature vibes in a way that's actually durable and emotionally meaningful.</li>
                  {/* <li>• Physical Build: Beyond the electronics, the project features organic aesthetics including a pot and real moss to make the tech look natural and feels grounded.</li>
                  <li>• The "Bloom" Effect: When Emma interacts with the plant—either by placing it in a warm spot, touching it, or adding warm water—the flowers transition from their base color to a vibrant pink.</li>
                  <li>• Interactive Personality: The project responds to its environment (light, heat, and moisture) just as a biological organism would.</li>
                  <li>• Multi-Sensory Elements: While the project focused on visual and thermal responses, it fits into a larger body of work that explores presence through customized fragrances.</li>
                  <li>• Durability: Building the plant "designed to never die," it removes the stress of maintenance while retaining the aesthetic benefits of greenery.</li> */}
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Row - Tree System Diagram */}
          <div className="flex justify-center mb-8">
            <img
              src="/images/03/treesystem.png"
              alt="Tree system diagram - Photosynthesis, Flower Blooming, Water the Plant"
              className="w-[70%] h-auto rounded-lg"
            />
          </div>

          {/* Bottom Row - Temperature Change Diagram */}
          <div className="flex justify-center">
            <img
              src="/images/03/tempchange.png"
              alt="Filament temperature change diagram"
              className="w-[60%] h-auto rounded-lg"
            />
          </div>
        </article>
      </section>

      {/* Prototypes Section */}
      <section id="prototypes" className="mx-auto max-w-6xl px-8 pb-16">
        <div className="mb-12">
          <h2 className="text-lg font-semibold uppercase tracking-[0.1em] text-zinc-900 mb-4">
            Prototypes
          </h2>
          <div className="w-full h-[1px] bg-zinc-300" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Row 1 */}
          <img src="/images/prototypes/ResponsiveTale 1.png" alt="ResponsiveTale" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/peppersghost01.png" alt="Pepper's Ghost" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/prototypes/stopmotion01.png" alt="Stop Motion 1" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
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
        <div className="mb-12">
          <h2 className="text-lg font-semibold uppercase tracking-[0.1em] text-zinc-900 mb-1.5">
            AR/VR
          </h2>
          <div className="w-full h-[1px] bg-zinc-300" />
        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Featured: Library - spans 2 columns and 2 rows */}
          <img src="/images/ARVR/library.png" alt="Library VR" className="w-full h-full object-cover rounded-lg bg-zinc-100 col-span-2 row-span-2 md:h-[400px]" />
          <img src="/images/ARVR/pianoroom 1.png" alt="Piano Room VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/pianoroom02 1.png" alt="Piano Room VR 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/studyhall 1.png" alt="Study Hall VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/forest01 1.png" alt="Forest VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/trees01 1.png" alt="Trees VR 1" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/trees02 1.png" alt="Trees VR 2" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/flowers 1.png" alt="Flowers VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
          <img src="/images/ARVR/RHcloud 1.png" alt="RH Cloud VR" className="w-full h-48 object-cover rounded-lg bg-zinc-100" />
        </div>
      </section>

      {/* Nice to Meet You Section */}
      <section className="mx-auto max-w-6xl px-8 pb-16">
        <div className="mb-12">
          <h2 className="text-lg font-semibold uppercase tracking-[0.1em] text-zinc-900 mb-4">
            It's great to meet you! :)
          </h2>
          <div className="w-full h-[1px] bg-zinc-300" />
        </div>

        <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
          {/* Left side - Contact Card + designworksgroup */}
          <div className="flex flex-col gap-5 items-center">
            <div className="border border-zinc-200 rounded-lg p-5 flex flex-col justify-between h-[257px] w-[400px]">
              <div className="text-center">
                <p className="text-[13px] tracking-[0.2em] text-zinc-500 mb-1">PRODUCT DESIGNER</p>
                <h3 className="text-lg tracking-[0.15em] text-zinc-800 font-normal">RINA KIM</h3>
              </div>

              <div className="text-center">
                <p className="text-[13px] tracking-[0.1em] text-zinc-500 mb-1">BY.RINAKIM@GMAIL.COM</p>
                <a
                  href="https://drive.google.com/file/d/1lGNm_Zh5L_niGyPaLJNQ7LzrP30lhi_t/view?usp=sharing"
                  target="_blank"
                  className="text-[13px] tracking-[0.1em] text-zinc-500 underline hover:text-zinc-900"
                >
                  RESUME
                </a>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-[13px] tracking-[0.1em] text-zinc-700">LETS BUILD TOGETHER</span>
                <a
                  href="https://www.linkedin.com/in/rina-kim-9a3864171/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <img src="/images/NiceToMeetYou/linkedin.png" alt="LinkedIn" className="w-5 h-5 -mt-[1px]" />
                </a>
              </div>
            </div>
            <img src="/images/NiceToMeetYou/designworksgroup.png" alt="DesignWorks group photo" className="w-[400px] h-[286px] object-cover rounded-lg" />
          </div>

          {/* Right side - 2 images on top, rh below */}
          <div className="flex flex-col gap-5 items-center">
            <div className="flex gap-5 justify-center">
              <img src="/images/NiceToMeetYou/buildingpeppersghost.png" alt="Building pepper's ghost" className="w-[182px] h-[257px] object-cover rounded-lg" />
              <img src="/images/NiceToMeetYou/buildingcloud.png" alt="Building cloud" className="w-[182px] h-[257px] object-cover rounded-lg" />
            </div>
            <img src="/images/NiceToMeetYou/rh.png" alt="Portrait" className="w-[374px] h-[286px] object-cover rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
