"use client";

import { useState, useEffect, useRef, useId, Fragment } from "react";
import type { ReactElement, ReactNode } from "react";
import { motion, AnimatePresence, MotionConfig, useIsPresent } from "framer-motion";
import Image from "next/image";
import { Outfit, DM_Sans } from "next/font/google";
import { dimsOf } from "./imageDims";

// The archive tile and the modal hero are a layoutId pair, so both halves must
// be motion components. Created once at module scope — rebuilding it per render
// would remount the image and break the shared-element transition.
const MotionImage = motion.create(Image);

const outfit = Outfit({ subsets: ["latin"], weight: ["200", "300", "400", "500"] });
const sans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

// ─── Filter System ────────────────────────────────────────────────────────────
type Category =
  | "Spatial Computing"
  | "Physical Computing"
  | "Multimodal Systems"
  | "Rapid Prototyping"
  | "Interface Design"
  | "Tangible Environments"
  | "Ambient Computing";

const ALL_CATEGORIES: Category[] = [
  "Multimodal Systems",
  "Interface Design",
  "Ambient Computing",
  "Spatial Computing",
  "Physical Computing",
  "Rapid Prototyping",
  "Tangible Environments",
];

const CAT_STYLE: Record<Category, { dot: string; active: string; text: string }> = {
  "Spatial Computing": { dot: "var(--cat-spatial)", active: "rgba(59,130,246,0.18)", text: "var(--cat-spatial)" },
  "Physical Computing": { dot: "var(--cat-physical)", active: "rgba(16,185,129,0.18)", text: "var(--cat-physical)" },
  "Multimodal Systems": { dot: "var(--cat-multi)", active: "rgba(245,158,11,0.18)", text: "var(--cat-multi)" },
  "Rapid Prototyping": { dot: "var(--cat-rapid)", active: "rgba(239,68,68,0.18)", text: "var(--cat-rapid)" },
  "Interface Design": { dot: "var(--cat-interface)", active: "rgba(236,72,153,0.18)", text: "var(--cat-interface)" },
  "Tangible Environments": { dot: "var(--cat-tangible)", active: "rgba(180,110,30,0.20)", text: "var(--cat-tangible)" },
  "Ambient Computing": { dot: "var(--cat-ambient)", active: "rgba(92,242,232,0.18)", text: "var(--cat-ambient)" },
};

export interface GridItem {
  src: string;
  alt: string;
  tag: string;
  label: string;
  desc: string;
  categories: Category[];
  colSpan?: number;
  aspectClass?: string;
  scaleClass?: string;
  // Which part of a non-16/9 source survives the tile crop. Only set where a
  // centre crop lands on the wrong thing — see the four below.
  objectPosition?: string;
  // Modal-only fields (optional). Render only when provided.
  year?: string;             // e.g. "2024", "Spring 2023"
  context?: string;          // e.g. "CMU coursework", "Personal", "BMW internship"
  tools?: string[];          // e.g. ["Unity", "Figma", "Arduino"]
  notes?: string;            // Longer paragraph: process, outcome, what you'd change
  designThinking?: string;   // Design rationale, principles, decisions
  links?: { label: string; href: string }[]; // e.g. demo, repo, paper
  // Optional video shown at the top of the modal's image column.
  // Accepts a full YouTube URL (youtu.be or youtube.com); embed URL is derived automatically.
  video?: { url: string; caption?: string };
  // Optional interactive demo shown at the top of the modal's image column via iframe.
  // Use for self-contained HTML pages served from /public.
  demo?: { url: string; caption?: string; height?: string; aspect?: string };
  // Process images shown by scrolling the modal's image column.
  // If omitted, the modal falls back to a single image from `src`.
  // First entry = hero/final shot, subsequent entries = build/process shots.
  images?: { src: string; caption?: string }[];
}

// Extract a YouTube video ID from any common URL shape (youtu.be / watch?v= / embed)
function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export const ALL_PROJECTS: GridItem[] = [
    {
    src: "/images/prototypes/BMWDesignworks/BMW-Designworks-hero.jpg", alt: "BMW Designworks", tag: "BMW Group · Internship", label: "BMW Designworks", desc: "Interaction Design internship at BMW Group's design subsidiary, investigating how designers can work with and incorporate AI tools into their process", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Interface Design", "Rapid Prototyping"], year: "2024", context: "BMW Designworks · Santa Monica, CA", tools: ["Figma", "Internal Tools"], notes: "Interaction Design internship at BMW Designworks, BMW Group's design subsidiary. The primary brief was to investigate the user experience surrounding how designers work with, and incorporate, AI tools into their process. The role involved partnering with multiple departments to brainstorm how rapidly developing technology shifts the perception of complexity in software development, and how to mitigate that complexity for the benefit of the end user.", designThinking: "Rather than treating AI as a feature to be bolted into a design tool, the brief asked the harder question: what do designers themselves need from AI? Where should it be visible, where should it disappear, and where should it refuse to act on the designer's behalf?\n\nCross-functional sessions surfaced the underlying concern: every new capability adds perceived complexity for users downstream. The investigation centered on how to absorb that complexity inside the tool, so the surfaces designers ship out to end users feel simpler, not more crowded.", images: [
      { src: "/images/prototypes/BMWDesignworks/BMW-Designworks-hero.jpg", caption: "BMW Designworks studio entrance, Newbury Park, California." },
      { src: "/images/prototypes/BMWDesignworks/unnamed.png", caption: "Inside the studio: an M1 race car staged in the presentation room." },
      { src: "/images/prototypes/BMWDesignworks/designworksteam.jpg", caption: "Team photo with the Designworks studio after a project review." },
      { src: "/images/prototypes/BMWDesignworks/interns.jpg", caption: "Off-hours with the intern cohort, Santa Monica Pier." },
    ]
  },
    {
    src: "/images/prototypes/ResponsiveTale/ResponsiveTale 1.png", alt: "ResponsiveTale", tag: "Interactive · XR", label: "Responsive Tale", desc: "Adaptive storytelling interface reacting to reader behavior", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Interface Design", "Multimodal Systems", "Physical Computing"], year: "2024", context: "CMU MHCI coursework", tools: ["Unity", "Figma", "Arduino"], notes: "A spatial story where pacing and visual treatment adapt to the reader's gaze and posture. Eye-tracking signals shifted the typography weight and ambient sound to match attention level, slowing down when readers paused on a passage, accelerating when they skimmed.", designThinking: "Started from the observation that reading is an active, embodied process: eye movement, posture, and breath all telegraph engagement. The prototype treats those signals as design input rather than passive data: when the reader pauses, the system slows, holds the page, and dims peripheral light.\n\nA deliberate trade-off was favoring inferential cues over explicit settings: readers shouldn't have to manage their own pacing for a story to feel responsive.", video: { url: "https://youtu.be/MEf5QaX5Qp0", caption: "Walkthrough of Responsive Tale: gaze-driven pacing and adaptive typography in motion." }, links: [{ label: "Watch Demo", href: "https://youtu.be/MEf5QaX5Qp0?si=N33tx1IwKpvPDvN0" }], images: [
      { src: "/images/prototypes/ResponsiveTale/ResponsiveTale 1.png", caption: "The book held open, an instrumented surface that drives a spatial story in VR." },
      { src: "/images/prototypes/ResponsiveTale/RT_product02.jpg", caption: "Internal architecture: battery, ESP32, and sensor array routed across the spine." },
      { src: "/images/prototypes/ResponsiveTale/RT_product03.jpg", caption: "VR controllers dock into the book frame. Physical and virtual reading collapse into one object." },
      { src: "/images/prototypes/ResponsiveTale/unnamed.jpg", caption: "In use: the reader holds the book while the story unfolds in VR around them." },
    ]
  },
    {
    src: "/images/prototypes/EmmasTree/emmastree.png", alt: "Emma's Tree", tag: "Biomimicry Hardware", label: "Emma's Tree", desc: "A synthetic plant built for a friend who works 80-hour weeks — it reacts to sunlight, signals for water, and changes with the seasons, without ever depending on her to stay alive", colSpan: 2, aspectClass: "aspect-[16/9]", objectPosition: "center 30%", categories: ["Physical Computing", "Tangible Environments", "Rapid Prototyping"], year: "2023 Jun – 2024 Jun", context: "The June 19th Project · Designer & Developer, personal commission", tools: ["Temperature-sensitive filament", "Moisture sensor", "LED indicators", "3D pen", "Solar battery bank"], notes: "My best friend Emma is a medical student who wanted a plant but knew she'd kill it — not out of carelessness, but because 80-hour weeks leave no room for it. Existing alternatives are either lifeless decorations or still demand the attention she doesn't have. The brief became: design a plant for Emma that she can never kill, one that still reacts to sunlight, signals when it wants water, and changes with the seasons, so it feels alive without depending on her to keep it that way.\n\nThe Bloom effect uses temperature-sensitive filament so the tree changes colour on touch or warmth. A moisture sensor signals watering cues organically rather than through an app. LED indicators communicate environmental state at a glance. The branching structure was drawn by hand with a 3D pen for organic form, and the whole thing runs off a solar-powered battery bank.", designThinking: "Designed using biomimicry to solve care fatigue — a synthetic plant that lives and reacts right along with Emma rather than waiting on her. Temperature-sensitive filaments and environmental sensors make it a responsive sensory anchor that mimics the energy of a real plant, so the room still feels inhabited on the days she isn't in it.\n\nNatural materials — real moss, a ceramic pot — keep the technology grounded rather than clinical. The electronics are never the point; they are what lets the object stay restorative and durable and emotionally meaningful instead of reading as a gadget.\n\nThe deliberate inversion: most plant tech tells you what your plant needs, turning a living thing into another task. This one absorbs the need entirely. The tree still expresses state — it blooms, it signals, it shifts with the season — but nothing it expresses is ever a demand.", images: [
      { src: "/images/prototypes/EmmasTree/emmastree.png", caption: "The finished tree: 3D-pen branching, real moss, ceramic pot. Technology grounded in natural material." },
      { src: "/images/prototypes/EmmasTree/treesystem.png", caption: "System diagram: sensor inputs, solar power path, and the filament and LED output channels." },
      { src: "/images/prototypes/EmmasTree/tempchange.png", caption: "The Bloom effect — temperature-sensitive filament shifting colour on touch or ambient warmth." },
    ]
  },
    {
    src: "/images/prototypes/LuminousJellyfish/Jellyfish_InEnclosure.png", alt: "Luminous Jellyfish", tag: "Light Interface · Ambient Agent", label: "Luminous Jellyfish", desc: "A wordless agent that expresses emotion, status, and intent purely through light, staying readable from midnight to noon", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Ambient Computing", "Interface Design", "Multimodal Systems"], year: "2026", context: "The June 19th Project · Designer", tools: ["Light modelling", "Contrast normalisation", "Motion design", "Particle systems"], notes: "How can we design real-time agent state indicators (emotion, status, intent) that remain readable in bright ambient light while preventing user cognitive overload?\n\nThe answer is a creature with no words and no face. The reef sets ambient light; the jellyfish emits light. Because the creature is always read against its environment, its expression is normalised against ambient rather than set as an absolute — emit = base(state) × (1 + k · (1 − ambient)), with k ≈ 0.8 so Night reads bold and Day stays legible.", designThinking: "Day caps the brightness channel at 1.00, and that ceiling is the interesting constraint rather than a limitation. Once brightness runs out, high-arousal states like Happy have to be carried by particles and motion instead, which forces the expression system to be multi-channel from the start.\n\nThe second rule is traceability: the jellyfish has no words and no face, so everything the user learns about it, they learn by watching light change in response to their own voice. A reply the user cannot trace back to something they did is not a reply, it is noise.\n\nEach mechanism was built for a jellyfish in a tank, but each answers a constraint any real-time agent interface faces under changing ambient light.", images: [
      { src: "/images/prototypes/LuminousJellyfish/Jellyfish_InEnclosure.png", caption: "The creature drifting in its glass enclosure above a bioluminescent reef." },
      { src: "/images/prototypes/LuminousJellyfish/reef_day.jpg", caption: "Day: ambient light at its peak, where the emission channel saturates and motion has to carry expression." },
      { src: "/images/prototypes/LuminousJellyfish/reef_day_detail01.png", caption: "Day detail: the reef's bioluminescent coral bed, dimmer pocket beneath the canopy." },
      { src: "/images/prototypes/LuminousJellyfish/reef_day_detail02.png", caption: "Day detail: the same coral bed under full sunbeam." },
      { src: "/images/prototypes/LuminousJellyfish/reef_dusk.jpg", caption: "Dusk: the crossover point where emitted light begins to outrun ambient." },
      { src: "/images/prototypes/LuminousJellyfish/reef_night.jpg", caption: "Night: ambient near zero, the same emotion rendered at a fraction of the daytime output." },
      { src: "/images/prototypes/LuminousJellyfish/night_enclosure01.png", caption: "Night detail: the coral bed's bioluminescence carrying the scene with no ambient light left." },
      { src: "/images/prototypes/LuminousJellyfish/night_enclosure02.png", caption: "Night detail: close on the reef's glowing anemones against the dark." },
      { src: "/images/prototypes/LuminousJellyfish/state_happy.png", caption: "Happy: particles and motion added once brightness alone hits its ceiling." },
      { src: "/images/prototypes/LuminousJellyfish/state_idle.png", caption: "Idle: contracted silhouette and dimmed, slower pulse." },
      { src: "/images/prototypes/LuminousJellyfish/state_curious.png", caption: "Curious: alert posture, tendrils reaching outward toward the stimulus." },
    ]
  },
    {
    src: "/images/prototypes/Mopad IXD/mopadui.jpg", alt: "Mopad IXD", tag: "Physical Prototype · Vehicle HMI", label: "Mopad IXD", desc: "A dual-screen self-driving moped HMI prototype built from cardboard, PVC pipes, and salvaged phones", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Interface Design", "Physical Computing", "Tangible Environments"], year: "2024", context: "Carnegie Mellon · Interaction Design coursework", tools: ["Figma", "Cardboard", "PVC piping", "iPhone", "iPad", "Video prototyping"], notes: "A rapidly-built hardware mockup for the interface of a Self-Autonomous Vehicle (SAV) moped. The rig pairs an iPad windshield that surfaces environmental information (SAV state, upcoming turns, low-battery alerts) with an iPhone dashboard for speed, ETA, and battery. Physical SAV / ON buttons on the handlebars let riders toggle autonomy by hand.", designThinking: "The design problem was interaction for a vehicle you don't fully control. Attention had to be layered: when the moped drives itself the rider becomes a passenger, so the windshield can carry richer content; when they take over, the dashboard becomes primary and everything else quiets down.\n\nBuilding the physical form was as important as designing the screens. A rider's field of view and reach shape what UI can actually live where, so we prototyped the cardboard-and-PVC handlebars before committing to any digital fidelity.", images: [
      { src: "/images/prototypes/Mopad IXD/mopadui.jpg", caption: "SAV Enabled state: windshield confirms autonomous mode; dashboard shows speed, time, battery, and range." },
      { src: "/images/prototypes/Mopad IXD/IMG_3782.jpg", caption: "Navigation prompt: a 200-ft turn cue appears on the windshield while the dashboard tracks live speed and battery." },
      { src: "/images/prototypes/Mopad IXD/IMG_3781 4.jpg", caption: "Low-battery scenario: the interface surfaces the nearest charge station with a one-tap GO route." },
      { src: "/images/prototypes/Mopad IXD/IMG_6550.jpg", caption: "In-class user testing: classmates try the prototype with paper safety helmets for full role-play immersion." },
    ]
  },
    {
    src: "/images/prototypes/Ember | The Pepper's Ghost Installation/peppersghost01.png", alt: "Ember", tag: "Installation · Spatial Illusion", label: "Ember | The Pepper's Ghost Installation", desc: "A character that lives in a 100-year-old fireplace, reacting to passersby through Pepper's Ghost", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Tangible Environments", "Interface Design"], year: "2024", context: "Reality Hack 24 · MIT Media Lab", tools: ["Pepper's Ghost optics", "Procreate", "After Effects", "Projector", "Acrylic"], notes: "An animated fire character named Ember inhabits a long-disused fireplace in CMU's Walker Hall, surfaced through a Pepper's Ghost optical setup. Ember reacts to passersby with shifting moods (heart-eyes, frustration, sleep, delight), giving the empty hearth a small living presence without altering a single brick of the historic mantel.", designThinking: "Began with a site, not a tech: the fireplaces in Walker Hall sit unused for fire-code reasons, but they're the emotional center of every room they occupy. The brief became how do you give a heritage object a second life without invasive intervention.\n\nPepper's Ghost let us add an animated layer on top of the existing space rather than retrofit anything into it. Treating Ember as a character with emotional states (rather than a flame loop) was the decision that turned the install from a tech demo into something people lingered with.", images: [
      { src: "/images/prototypes/Ember | The Pepper's Ghost Installation/peppersghost01.png", caption: "Ember lit inside the historic Walker Hall fireplace, reflected through angled glass." },
      { src: "/images/prototypes/Ember | The Pepper's Ghost Installation/walker fireplace.jpg", caption: "The site: a 100-year-old stone fireplace, sealed for fire code, waiting to be reactivated." },
      { src: "/images/prototypes/Ember | The Pepper's Ghost Installation/RH24_Ember_Circular.jpg", caption: "Design exploration: circular forms feeding into the flame character's silhouette." },
      { src: "/images/prototypes/Ember | The Pepper's Ghost Installation/RH24_Pepper's_Ghost_Ember_Reacts.jpg", caption: "Interaction states: Ember reacts differently to ambient input (warmth, hearts, anger, sleep)." },
      { src: "/images/prototypes/Ember | The Pepper's Ghost Installation/RH24_Ember_Rectangular.jpg", caption: "Rectangular variant of the burning logs, refining how the body would be read at distance." },
    ]
  },
    {
    src: "/images/prototypes/MIT Reality Hack 2024/hackinginprogress.jpg", alt: "MIT Reality Hack 2024", tag: "Spatial Design · Visual Identity", label: "MIT Reality Hack 2024 | Spatial Design", desc: "Spatial design and illustrated banners for a week-long, 500-person hackathon at MIT", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Interface Design", "Tangible Environments", "Rapid Prototyping"], year: "2024", context: "MIT Reality Hack 2024 · MIT Media Lab", tools: ["Procreate", "Photoshop", "Large-format print", "Site planning"], notes: "The constraint set the brief: aesthetic that elevates the space, but never gets in the way of 500+ hackers building for a full week. The work covered venue planning, visual identity, and banner illustration, deciding where atmosphere belongs and where it should quietly disappear so participants stay in flow.", designThinking: "Mapped the venue by attention budget before drawing anything. Hand-annotated plans came first, marking AR mural placement, up-lighting, and decor positions against existing architecture. High-transit zones got minimal treatment so participants weren't slowed by visual noise; the most considered work went into rest areas, transitions, and arrival moments where a banner could become a small breath between sessions.\n\nThe illustration concept (MIT campus framed through enchanted gothic windows) was chosen for dual-distance behavior. Up close, the carved arch reads as warmth and craft. At a glance across a long room, the carved frame recedes and the building behind becomes a landmark, wayfinding without signage.", images: [
      { src: "/images/prototypes/MIT Reality Hack 2024/hackinginprogress.jpg", caption: "The hall in full use: 500+ hackers working under the installed banners, custom murals, and event lighting." },
      { src: "/images/prototypes/MIT Reality Hack 2024/day1_02.jpg", caption: "Install close-up: the daylight and night-time Stata banners hung between the columns where the team had planned them." },
      { src: "/images/prototypes/MIT Reality Hack 2024/day1_01.jpg", caption: "Wide view of the main hall during Day 1, banners visible across multiple bays as hackers move between sponsor booths." },
      { src: "/images/prototypes/MIT Reality Hack 2024/sketchofwalker.jpg", caption: "Presentation render of Walker Hall with all banner positions in situ, used to align stakeholders on the spatial design before fabrication." },
      { src: "/images/prototypes/MIT Reality Hack 2024/RH24_Walker_Hacking_Space.jpg", caption: "Hand-annotated venue plan: mapping AR murals, up-lighting, and decor placement against the existing architecture." },
      { src: "/images/prototypes/MIT Reality Hack 2024/RH24_Banner_Design_02.JPG", caption: "Banner: Killian Court at sunset framed through an ornate carved arch, sized for the main gathering space." },
      { src: "/images/prototypes/MIT Reality Hack 2024/RH24_Banner_Design_04_Final.JPG", caption: "Banner: Stata Center reimagined as a daylight reverie, scaled for transit corridors." },
      { src: "/images/prototypes/MIT Reality Hack 2024/RH24_Banner_Design_01.JPG", caption: "Banner: night-time variant for low-light zones, fireflies and a starlit sky as the rest moment." },
    ]
  },
    { src: "/images/ARVR/library.png", alt: "Immersive Library", tag: "VR · Environment", label: "Immersive Library", desc: "An immersive virtual library designed for focused, single-occupant deep work", colSpan: 2, aspectClass: "aspect-[16/9]", objectPosition: "center 75%", categories: ["Spatial Computing"], year: "2024", context: "CMU 3D environments", tools: ["Unity", "Maya", "Substance Painter"], notes: "A virtual reading room designed for solo deep work. Lighting and shelf scale were tuned so the space felt sized to a single occupant, not a crowd. A quiet counterweight to the usual maximalist VR environment.", video: { url: "https://youtu.be/je2r3acZWLg", caption: "Walkthrough of the immersive library, lit and scaled for one." }, links: [{ label: "Watch Walkthrough", href: "https://youtu.be/je2r3acZWLg?si=1ukq9WEP7v_z4TiF" }] },
    {
    src: "/images/prototypes/flexvr 1.png", alt: "FlexVR Wellness", tag: "Hackathon · XR Wellness", label: "FlexVR Wellness", desc: "A 24-hour hardware hack reimagining VR as a wellness, not stimulation, surface", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Physical Computing", "Multimodal Systems"], year: "2024", context: "Hardware Hack: Creative Inputs/Outputs", tools: ["Unity", "Arduino", "3D printing", "Biofeedback sensors", "Fabric"], notes: "A 24-hour hardware hackathon prototype that reframed VR away from intensity (combat, exploration) and toward calm: breath-driven pacing, posture-sensitive ambient light, and tactile soft controls. Built end-to-end with a small team in a single weekend.", designThinking: "Most VR pitches itself on intensity. We started from the opposite question: what would VR look like if it were tuned for nervous-system regulation instead of dopamine?\n\nThe hardware constraint forced honesty. With only 24 hours, every input/output had to earn its place. We landed on three: breath as the master clock, posture as the volume knob, and soft tactile controls instead of triggers, all serving a single goal of lowering, not raising, arousal.", video: { url: "https://youtu.be/7zpdAQw5Y1k", caption: "Demo of FlexVR Wellness from the Hardware Hack showcase." }, links: [{ label: "Watch Demo", href: "https://youtu.be/7zpdAQw5Y1k?si=b45U6UR1hrWtO3bM" }], images: [
      { src: "/images/prototypes/FlexVR Wellness/HardwareCreativeInputOutput.png", caption: "Final presentation: FlexVR Wellness pitched at the Hardware Hack showcase." },
      { src: "/images/prototypes/FlexVR Wellness/building.jpg", caption: "Mid-hack: prototyping the breath-sensor pipeline alongside the team." },
      { src: "/images/prototypes/FlexVR Wellness/building02.jpg", caption: "Build station at 2am: 3D-printed enclosures, soldering, and the soft-controller mockup." },
      { src: "/images/prototypes/FlexVR Wellness/testing1.jpg", caption: "Showcase floor: a teammate wears the EMS sleeve and soft controller while the team documents the demo." },
      { src: "/images/prototypes/FlexVR Wellness/hardware.jpg", caption: "Inside the build: a Neuralaxy NeuroBio sensor board housed in a custom 3D-printed enclosure, status LEDs lit." },
      { src: "/images/prototypes/FlexVR Wellness/redbull tower 2.JPG", caption: "The All-Nighter Tower." },
    ]
  },
    { src: "/images/prototypes/LeARn.png", alt: "LeARn", tag: "AR · Education · Hackathon", label: "LeARn", desc: "An AR learning app that brings interactivity and joy back into elementary school subjects, tracking student progress across Art, Math, and Music", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Interface Design", "Rapid Prototyping"], year: "April 2022", context: "Venture In Metaverse Hackathon · Harvard", tools: ["Unity", "C#", "Procreate"], notes: "LeARn is an augmented reality application built to help educators and parents teach with more interactivity, longer attention spans, and more enjoyment for elementary school students. The app tracks each student's progress through Art, Math, and Music, with planned expansion into Physics Circuits and Language. Designed to live alongside the traditional classroom rather than replace it.", designThinking: "Started from the question every K-12 teacher asks: how do you hold attention when worksheets are competing with phones? AR lets the same lesson live on the desk in front of a student, making the rotation, manipulation, and exploration of a concept the lesson itself rather than the textbook page.\n\nThe progress-tracking layer was the design move that took the idea from gimmick to tool: educators see what each student has spent time with, and the app calibrates difficulty without surfacing it to the child.", video: { url: "https://youtu.be/Dkjj-q0xRaE", caption: "Demo reel from Venture In Metaverse at Harvard, April 2022." }, links: [{ label: "Watch Demo", href: "https://youtu.be/Dkjj-q0xRaE?si=UeQRA4jqXGIMeJXA" }] },
    {
    src: "/images/prototypes/CMUPopUp/cmupopup 1.png", alt: "CMU Popup", tag: "Spatial Design · Guest Experience", label: "CMU Popup", desc: "A pop-up book scale model of a Tuscan-themed wine bar guest experience", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Rapid Prototyping", "Tangible Environments", "Interface Design"], year: "2024", context: "Carnegie Mellon · Guest Experience in Theme Parks · Fall 2024", tools: ["Pop-up book construction", "Printed textures", "3D-printed terrain", "Sculpted moss", "Tabletop modeling"], notes: "A foldable, book-style scale model of a Tuscan-themed wine bar guest experience, developed for CMU's Guest Experience in Theme Parks studio. The piece reads as flat from the side and unfolds into a multi-room interior with vineyards, stone garden, and seating, used as a stand-alone presentation artifact rather than a digital render.", designThinking: "Wanted a presentation format that could be carried into any review, no laptop, no projector. The pop-up form gave the design two states: a quiet closed book that invites curiosity, and an opened diorama that lets stakeholders read the spatial logic of a guest's path at a glance.\n\nWorking at a tabletop scale also forced material honesty: every brick texture, table, and tree had to earn its place because there was no room to hide weak detail.", images: [
      { src: "/images/prototypes/CMUPopUp/cmupopup 1.png", caption: "Hero view: the wine bar concept opened to full diorama." },
      { src: "/images/prototypes/CMUPopUp/IMG_6534 2.jpg", caption: "Mid-fold view: the pop-up book structure that supports the standing scene." },
      { src: "/images/prototypes/CMUPopUp/IMG_6540.jpg", caption: "Detail: stone seating, sculpted moss, and tree placement in the garden zone." },
    ]
  },
    {
    src: "/images/prototypes/CMU BusWatch/WatchUI.png", alt: "CMU BusWatch", tag: "Wearable · Transit UI", label: "CMU BusWatch", desc: "An Apple Watch companion that helps CMU students catch the 61B bus at a glance", colSpan: 2, aspectClass: "aspect-[16/9]", objectPosition: "center 0%", categories: ["Interface Design", "Rapid Prototyping"], year: "2024", context: "Carnegie Mellon · Interaction Design coursework", tools: ["Figma", "Pencil sketching", "Storyboarding", "Video prototyping"], notes: "A smartwatch companion for CMU's 61B bus route, letting students glance-check arrival time, pull up a mini map, or voice-modify their default route from the wrist. The scope covered the full IxD arc: storyboarding pain points, sketching UI flow, then producing tappable Figma screens and a video prototype.", designThinking: "Students already know their bus number by heart; they pull the phone out just to check the ETA. The watch face removes that friction: glance, see the number, decide whether to sprint or catch a later run.\n\nThe voice-driven Modify MyBus state came from watching users type on watches (they don't). Restricting keyboard input by default made every downstream input decision self-answer.", images: [
      { src: "/images/prototypes/CMU BusWatch/WatchUI.png", caption: "UI states across the three primary flows: home selector, en-route ETA with mini map, and voice-driven route modification." },
      { src: "/images/prototypes/CMU BusWatch/PencilSketch.png", caption: "Storyboard: the user oversleeps, misses the bus, and walks late to class; resolved by the watch surfacing ETA at a glance." },
      { src: "/images/prototypes/CMU BusWatch/MyBusWatch.png", caption: "Title card from the video prototype documenting the flow end to end." },
    ]
  },
    {
    src: "/images/prototypes/Together/stopmotion02.png", alt: "Together", tag: "Themed Experience · Sculptural Narrative", label: "Together", desc: "A handcrafted stop-motion vignette imagined as a moment inside a themed attraction, where guests pass from cold solitude into shared warmth", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Rapid Prototyping", "Tangible Environments", "Multimodal Systems"], year: "2019", context: "Carnegie Mellon · Guest Experience in Theme Parks", tools: ["Polymer clay", "Hand-knotted yarn", "DSLR", "Chroma key"], notes: "A guest-experience concept developed as a stop-motion short for a CMU course on theme park design. Two small characters move from a snowy exterior into a candlelit apothecary lined with books, bottles, and music. Built as a tabletop maquette of a scene a guest could one day walk through, with the camera staging shot-by-shot what the eye should find on entry, mid-journey, and arrival.", designThinking: "The course brief was about staging emotional arrivals: guests don't remember individual props, they remember how a sequence of moments made them feel. The piece is structured around a single temperature change, cold to warm, with no dialogue and no overt event. The 'plot' is the threshold itself.\n\nMaterial choice did the rest of the work. Yarn trees, hand-twisted hair, and ground-up flake snow were chosen so that whoever made it could be felt inside it, the same way the best themed environments hide their craft in plain sight.", video: { url: "https://youtu.be/xhVKbuqAVjY", caption: "The full stop-motion short: cold solitude resolving into shared warmth." }, links: [{ label: "Watch Film", href: "https://youtu.be/xhVKbuqAVjY?si=juypLgVGXBM1c-cw" }], images: [
      { src: "/images/prototypes/Together/stopmotion02.png", caption: "Interior: the figure absorbed in sheet music among practical candlelight." },
      { src: "/images/prototypes/Together/20190210_055418.JPG", caption: "Apothecary corner: leather-bound books, corked bottles, a cameo, the warm interior the cold story moves toward." },
      { src: "/images/prototypes/Together/L1050899.JPG", caption: "Two characters in falling snow, hair built from twisted thread, captured from above." },
      { src: "/images/prototypes/Together/L1060096.JPG", caption: "Detail: floral dress and teal stockings half-buried in real, ground-up snow." },
    ]
  },
    {
    src: "/images/prototypes/Portal Reef/portalreef 1.png", alt: "Portal Reef", tag: "Mixed Reality · EEG · Conservation", label: "Portal Reef", desc: "A multimodal MR coral reef built to raise awareness of coral bleaching, with Neuos EEG measuring delight as the cause of the damage", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Multimodal Systems", "Physical Computing"], year: "2022", context: "MIT Reality Hack 2022 · Semi-Finalist", tools: ["Hololens 2", "Arctop Neuos Headband", "Arctop SDK", "Unity", "C#", "Blender", "GitHub"], notes: "A multimodal Mixed Reality coral reef built during MIT Reality Hack 2022 (semi-finalist) to raise awareness of coral destruction. The user explores a vivid reef through a Hololens 2 passthrough environment; when they reach out and touch a coral, the coral turns grey and dies on contact, making the cause of bleaching legible as a behaviour rather than a statistic.\n\nAn Arctop Neuos EEG headband recorded the user's enjoyment in real time while they interacted, capturing the uncomfortable insight at the heart of the brief: people destroy what they love because they love it.", designThinking: "The team's hypothesis was that conservation messaging fails when it relies on guilt or distance. We treated wonder as the entry point and let the consequence land as the user enjoyed it most. Touching a beautiful coral and watching it die in the same instant collapses the emotional gap between visitor and impact.\n\nLayering the Neuos EEG signal on top of the interaction added a second axis. Recording enjoyment exactly when destruction occurs gave us a data artefact that names the contradiction without us having to write it on a wall.", images: [
      { src: "/images/prototypes/Portal Reef/portalreef 1.png", caption: "Inside the experience: an Anacropora coral information panel surfaces as the user approaches, narrating the species before they reach to touch." },
      { src: "/images/prototypes/Portal Reef/coralreef.jpg", caption: "The reef the user enters: fish, sponges, and stony coral staged as a living scene to walk into." },
      { src: "/images/prototypes/Portal Reef/handtracking.png", caption: "Hand-tracking debug pass: the axis gizmo locates the user's hand against the reef, the input that triggers bleaching on contact." },
      { src: "/images/prototypes/Portal Reef/unityenv.png", caption: "Unity build overview: shipwreck, coral clusters, and floating information cards composed across the seafloor." },
    ]
  },
    { src: "/images/prototypes/stopmotion01.png", alt: "Stop Motion", tag: "Physical · Animation", label: "Stop Motion", desc: "Frame-by-frame physical animation exploring material storytelling", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Rapid Prototyping", "Tangible Environments"], year: "2023", context: "CMU rapid prototyping", tools: ["Dragonframe", "DSLR", "Mixed materials"], notes: "First stop-motion study, focused on the rhythm and patience of frame-by-frame work. Forced a slower making process: every 12 frames bought less than a second of motion." },
    {
    src: "/images/prototypes/RH Cloud/RHcloud 1.png", alt: "RH Cloud", tag: "Responsive · Atmospheric", label: "RH Cloud", desc: "Volumetric cloud environment exploring presence and scale", colSpan: 2, aspectClass: "aspect-[16/9]", objectPosition: "center 40%", categories: ["Spatial Computing", "Rapid Prototyping", "Tangible Environments"], year: "2024", context: "Personal exploration", tools: ["LED lights", "Cotton", "Craft tools"], notes: "Real-time volumetric clouds rendered at room scale, exploring how vapor and weather can become a spatial interface element. The user's movement subtly displaced the cloud volume, hinting at presence without a literal avatar.", images: [
      { src: "/images/prototypes/RH Cloud/RHcloud 1.png", caption: "Overview of the main hall, multiple clouds suspended at table height across the room." },
      { src: "/images/prototypes/RH Cloud/RH24_Day1_Venue_Atmosphere.jpg", caption: "Day 1 close-up: a team works directly beneath one of the cotton clouds, the blue underlight diffusing across the work surface." },
      { src: "/images/prototypes/RH Cloud/day1.jpg", caption: "Day 1 setup: a smaller cloud staged at the front of the hall as hackers arrive and gather." },
    ]
  },
    {
    src: "/images/prototypes/PressfToPlay/Screen Shot 2019-11-03 at 3.16.53 PM.PNG", alt: "Press F To Play", tag: "3D Environment · Interactive Narrative", label: "Press F To Play", desc: "A moody, low-poly first-person environment exploring atmospheric storytelling through space", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Interface Design", "Rapid Prototyping"], year: "2019", context: "Early 3D environment exploration", tools: ["Unity", "Maya", "Low-poly modeling", "Practical lighting"], notes: "A walk-and-look interactive scene where the player explores a green-lit, gothic-inflected interior: stone halls, a balance scale, a grand piano upstairs, a grandfather clock with a watching eye. The only prompt the player ever sees is the title itself, leaving everything else to atmosphere.", designThinking: "Set the constraint early: no NPCs, no dialogue, no objectives. The room had to do the work.\n\nLighting carried the tone. Cool green ambient against single warm pools of practical light meant the player's eye was always pulled to where the next moment of interest lived, navigation through atmosphere rather than UI. The piece is less a game and more a study in how an interior can suggest a story without ever telling one.", images: [
      { src: "/images/prototypes/PressfToPlay/Screen Shot 2019-11-03 at 3.16.53 PM.PNG", caption: "The title prompt in situ, beside a grandfather clock with a watching green eye." },
      { src: "/images/prototypes/PressfToPlay/Screen Shot 2019-11-03 at 3.27.11 PM 2.PNG", caption: "Main hall reframe: stairs, balance scale, and cobblestone underfoot. The space was built to be wandered." },
      { src: "/images/prototypes/PressfToPlay/PressfToPlay02.png", caption: "Upstairs interior: piano and twin lamps. Whatever happens here is left to the player to imagine." },
    ]
  },
    { src: "/images/ARVR/studyhall 1.png", alt: "Study Hall", tag: "3D Model · Architecture", label: "Study Hall", desc: "Collaborative virtual study hall with adaptive ambient zones", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"], year: "2024", context: "CMU 3D environments", tools: ["Maya", "Unity", "Substance Painter"], notes: "A multi-user study hall with zones tuned for different work modes: silent reading at one end, collaborative writing at the other. Ambient audio and lighting shifted as users crossed thresholds, without explicit mode switches." },
    {
    src: "/images/prototypes/Forest Frangrance/june19th_fragrance.jpg", alt: "Forest Fragrance", tag: "Multimodal · Sensory Design", label: "Forest Fragrance", desc: "A hand-blended pine fragrance paired with a self-built VR forest, designing scent as an equal channel to sight and sound", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Multimodal Systems"], year: "2022", context: "VR forest experience · June 19, 2022 project", tools: ["Perfumery workshop", "Essential oils", "Unity", "Maya"], notes: "A multimodal forest experience pairing an immersive VR environment, built from the ground up in Unity, with a custom pine fragrance composed by hand at a perfumery workshop. The user journey was designed in layers: scent enters first, then ambient sound, then rain, then exploration. The room smelled of pine, damp earth, and faint resin while the headset rendered a forest meant to be wandered, not solved.", designThinking: "Sight and sound are well-mapped in VR; smell is usually treated like a parlor trick. The brief was to design the scent first, with the same care normally given to a soundtrack or shader, then let the visuals support what the nose already knew.\n\nThe user journey added a second decision: the experience stacks senses rather than presenting them all at once. The visitor enters quietly, sprays the fragrance themselves to begin, and only then do rain, ambient audio, and motion layer in. By the time they reach the hidden garden, a new scent is the only signal that they've crossed into a different part of the world. The design rule throughout was the same: never tell the visitor what to feel, give them the layers and let it happen.", images: [
      { src: "/images/prototypes/Forest Frangrance/june19th_fragrance.jpg", caption: "The hand-blended pine fragrance composed at the perfumery workshop, staged before the experience begins." },
      { src: "/images/prototypes/Forest Frangrance/frangrancemaking.png", caption: "At the perfumery workshop: composing the pine note by hand, sampling vial by vial." },
      { src: "/images/prototypes/Forest Frangrance/user journey.jpg", caption: "User journey map: scent, sound, and visual layered across the visitor's path from arrival to hidden garden." },
      { src: "/images/prototypes/Forest Frangrance/unityforest.png", caption: "The Unity forest at dusk: layered foliage and silhouetted treeline against a colored sky." },
      { src: "/images/prototypes/Forest Frangrance/forestlantern.png", caption: "Inside the canopy: a single lantern as the only warm point of light, drawing the visitor deeper in." },
    ]
  },
    { src: "/images/ARVR/flowers 1.png", alt: "Flowers", tag: "3D Modeling · Texture Study", label: "Flowers", desc: "A botanical 3D study built to practice modeling and hand-painted texture mapping from petal to stem", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing", "Rapid Prototyping"], year: "2024", context: "Personal study · 3D modeling and texture mapping practice", tools: ["Maya", "Procreate", "Unity"], notes: "A small botanical scene built as a deliberate technical exercise. Each flower, leaf, and stem was modeled by hand in Maya, UV-unwrapped, then painted petal-by-petal in Procreate so every texture map was hand-made rather than generated. The goal was less to ship an experience and more to internalize the modeling-to-texture pipeline at a craft level." },
    { src: "/images/ARVR/trees01 1.png", alt: "Trees 01", tag: "Augmented Reality · Nature", label: "Trees 01", desc: "Forest density study exploring depth and spatial perception", colSpan: 2, aspectClass: "aspect-[16/9]", categories: ["Spatial Computing"], year: "2024", context: "Personal exploration", tools: ["Spark AR", "Maya"], notes: "A density and parallax study: how many tree instances are needed before AR foliage reads as 'forest' rather than 'set dressing'. Found the threshold sat around 40 unique silhouettes within view distance." }
  ];

// ─── Static Tailwind col-span map (dynamic strings get purged) ───────────────
// mobile fix: col-span only applies at lg; on mobile each item takes 1 column of grid-cols-2
const COL_SPAN_CLASS: Record<number, string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  6: "lg:col-span-6",
};

// ─── FilterCategoryButton ────────────────────────────────────────────────────
function FilterCategoryButton({
  cat,
  isActive,
  onClick,
}: {
  cat: Category;
  isActive: boolean;
  onClick: () => void;
}) {
  const s = CAT_STYLE[cat];
  // mobile fix: tap target ≥40px on phones via py-2.5 + min-h-[40px]; desktop tightness preserved at lg:
  return (
    <button
      onClick={onClick}
      className="relative flex items-center pl-4 pr-4 py-2.5 lg:py-1.5 min-h-[40px] lg:min-h-0 shrink-0 rounded-full text-sm font-medium tracking-wide border transition-all duration-250 active:scale-[0.96] active:duration-150 cursor-pointer whitespace-nowrap select-none"
      style={isActive
        ? { background: s.active, borderColor: s.dot, color: s.text, boxShadow: `0 0 12px ${s.dot}50` }
        : { background: "var(--fill-soft)", borderColor: "var(--line-strong)", color: "var(--muted)" }
      }
    >
      {/* No leading dot — the active state still carries the category's
          color via border and glow (above), just not as a standalone glyph. */}
      {cat}
    </button>
  );
}

// ─── FilteredThumb ────────────────────────────────────────────────────────────
function FilteredThumb({
  item,
  activeFilter,
  outfitClass,
  onOpen,
}: {
  item: GridItem;
  activeFilter: Category | null;
  outfitClass: string;
  onOpen: (item: GridItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  // False for the ~200ms an exiting tile spends fading out under
  // AnimatePresence. Without this, a filtered-out tile stayed fully
  // clickable and tabbable at opacity 0 for that whole window — a keyboard
  // user tabbing right after a filter change could land on an invisible
  // ghost tile.
  const isPresent = useIsPresent();

  // Color logic:
  // - Filter active → always full color (only matches are rendered)
  // - No filter + hovering → full color
  // - No filter + not hovering → grayscale
  const inColor = activeFilter !== null || isHovered;

  return (
    <motion.button
      type="button"
      // A div with an onClick is invisible to the keyboard and announces
      // nothing. These 21 thumbs are the whole archive, so they are buttons:
      // tabbable, Enter/Space activated, and named for the project they open.
      aria-haspopup="dialog"
      aria-label={`${item.label} — ${item.tag}`}
      // Filtering used to teleport: non-matches vanished, survivors snapped
      // to new grid slots. `layout` animates each survivor to its new
      // position; pairing the grid's own AnimatePresence with mode="popLayout"
      // pulls a leaving tile out of flow immediately so the others can start
      // reflowing without waiting on its exit to finish.
      layout
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={slowFade}
      exit={{ opacity: 0, scale: 0.9, pointerEvents: "none", transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }}
      // Only the layout key — slowFade's own transition still governs the
      // scroll-reveal fade, this just tunes the reflow separately.
      transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 } }}
      whileTap={{ scale: 0.99, transition: { type: "spring", bounce: 0, duration: 0.25 } }}
      onClick={() => onOpen(item)}
      tabIndex={isPresent ? undefined : -1}
      aria-hidden={!isPresent}
      className={`${COL_SPAN_CLASS[item.colSpan ?? 3]} group cursor-pointer flex flex-col text-left`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Image well: aspect-ratio container holds the picture + (desktop-only) hover overlay */}
      <div className={`${item.aspectClass ?? "aspect-[16/9]"} bg-raised overflow-hidden rounded-sm relative`}>
        <MotionImage
          // Paired with the same layoutId on the modal's hero shot, so the
          // tile physically becomes the detail view and returns to its own
          // slot on close, instead of the modal cutting in from centre.
          layoutId={`archive-${item.alt}`}
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 33vw"
          // Where the 16/9 crop bites. Portrait and near-square sources lose
          // most of their frame to a centre crop, so those items say which
          // part has to survive.
          style={{ objectPosition: item.objectPosition ?? "center" }}
          className={`object-cover ${item.scaleClass ?? ""}`}
          animate={{
            filter: inColor ? "grayscale(0%) brightness(1)" : "var(--thumb-idle)",
          }}
          transition={{
            duration: 0.4, ease: [0.25, 0.1, 0.25, 1],
            layout: { type: "spring", bounce: 0, duration: 0.4 },
          }}
        />
        {/* Hover overlay — desktop only (lg+). On phones the caption strip below the image carries metadata. */}
        <div className="hidden lg:flex absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/20 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-400 flex-col justify-end px-5 py-5">
          <span className="text-xs uppercase tracking-[0.2em] text-accent-soft mb-1 font-semibold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
            {item.tag}
          </span>
          <span className={`${outfitClass} text-white text-base font-medium mb-1 leading-tight`} style={{ textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>
            {item.label}
          </span>
          <span className="text-ink-2 text-sm leading-relaxed font-normal mb-2.5" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
            {item.desc}
          </span>
          {/* Category pills (desktop modal-substitute) */}
          <div className="flex flex-wrap gap-1 mt-1">
            {item.categories.map((c) => (
              <span
                key={c}
                className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-black/60 border border-line-strong backdrop-blur-md"
                style={{ color: CAT_STYLE[c].text, textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Caption strip — phones/tablets only. Editorial two-line block: tag (small uppercase) then title. */}
      <div className="lg:hidden pt-2 pb-1 px-0.5">
        <p className="text-2xs uppercase tracking-[0.2em] text-meta font-semibold leading-none mb-1.5 truncate">
          {item.tag}
        </p>
        <p className={`${outfitClass} text-sm text-ink font-medium leading-snug line-clamp-2`}>
          {item.label}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Selected Project Cards ───────────────────────────────────────────────────
// Media block with a notch bitten out of its bottom-right corner, holding a
// circular arrow. The notch is not a clip-path or a mask: it is three plain
// divs painted in the page background colour and clipped by the media block's
// own overflow — a 96px square with one corner rounded to 50% carves the bite,
// and two small squares with an inverted radius (transparent fill, spread
// box-shadow) round off where the bite meets the media's straight edges.
//
// Because the bite is painted rather than cut, CARD_SURFACE has to match
// whatever sits behind the card. Move these onto a gradient or a different
// section colour and the notch shows up as a square of the wrong shade.

interface CaseStudy {
  num: string;
  org: string;
  title: string;
  meta: string;
  desc: string;
  outcome?: string;      // what the work produced — the card states a problem, this states the result
  tags: string[];
  id: string;            // stable key; the body renders in the overlay, not on the page
  img: string;
  fit?: "cover" | "contain";  // diagrams need contain, photography needs cover
  Body: () => ReactElement;   // the matching long-form section, shared with the modal below
}

// Mirrors the three long-form case studies below, in the same order.
const CASE_STUDIES: CaseStudy[] = [
  {
    num: "01",
    org: "BMW Group",
    title: "Adaptive Generative UI",
    meta: "2025 Jun – 2026 Jan · UX Engineer Intern",
    desc: "Compose the interface itself from context — driver state, road conditions, route — instead of asking the driver to navigate to what they need.",
    outcome: "Aligned research, product, and engineering on one set of context-gating rules — what the car surfaces, and when.",
    tags: ["Automotive HMI", "Generative UI"],
    id: "bmw-adaptive-ui",
    img: "/images/01/neueklasse.webp",
    Body: BMWCaseStudyBody,
  },
  {
    num: "02",
    org: "CMU SmaSH Lab",
    title: "Proactive Agent",
    meta: "2024 Sep – 2025 Aug · Research Assistant",
    desc: "Classify intent from noisy, real-world speech so the agent acts only when the signal is clear, instead of answering every stray sentence.",
    outcome: "Over 90% intent-classification accuracy on unscripted speech, in a modular pipeline built to port across hardware.",
    tags: ["Voice Interfaces", "ML Research"],
    id: "cmu-proactive-agent",
    img: "/images/02/proactive agent pipeline.png",
    fit: "contain",
    Body: SmashCaseStudyBody,
  },
  {
    num: "03",
    org: "CMU × Surefront",
    title: "Making PLM the place apparel teams actually work",
    meta: "2024 Winter – 2025 Summer · MHCI Capstone",
    // Subtitle history, kept for comparison per Rina's request:
    // v1, accurate but abstract: "Give apparel teams a reason to work inside the PLM instead of beside it, in a market where every team already owns one and quietly works around it."
    // v2, concrete but unsupported — the trends/tab-switching story belongs to the
    //     Trends module that was cut in 2fc16aa, so the body never paid it off:
    //     "Merchandisers were checking Instagram, Google Trends, and their PLM in three different tabs to spot a trend. We put the trend data inside the PLM so the tab-switching stopped."
    desc: "Designers duplicated one jacket nineteen times to create it. Merchandisers waited three weeks for data the PLM already held. Both worked around the system meant to hold their work.",
    outcome: "Team scored 4–5 of 5 on willingness to buy and shipped a design system, engineer-agreed feasibility ratings, and a roadmap through Q4 2026, on research and a prototype I owned.",
    tags: ["Enterprise UX", "Product Design"],
    id: "cmu-surefront-plm",
    img: "/images/03/surefront/surefront-lineplanning.jpg",
    Body: SurefrontCaseStudyBody,
  },
];

// The notch is painted, not cut, so this must equal the ground behind the
// card. It reads a custom property rather than a literal, which is what lets
// the corner survive a theme switch — see THEME_TOKENS.
const CARD_SURFACE = "var(--ground)";



function CaseStudyCard({ item, outfitClass }: { item: CaseStudy; outfitClass: string }) {
  // The arrow opens an inline detail overlay instead of following a link —
  // the card headline still owns the real navigation to the long-form
  // write-up further down the page.
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={slowFade}
      whileHover="lifted"
      // Deep-link target: /#project-01, -02, -03 address a specific case
      // study, so a single project can be linked directly from a CV, an
      // email or anywhere else. Derived from item.num so the anchors can't
      // drift from the cards they point at.
      id={`project-${item.num}`}
      // scroll-mt keeps the card clear of the viewport edge on arrival.
      className="scroll-mt-24 group relative flex flex-col [--notch:76px] [--btn:60px] [--fillet:20px] lg:[--notch:96px] lg:[--btn:77px] lg:[--fillet:24px] focus-within:outline focus-within:outline-1 focus-within:outline-offset-[14px] focus-within:outline-accent/70 rounded-lg transition-transform duration-250 active:scale-[0.99] active:duration-150"
    >
      <div style={{ background: "var(--raised)", boxShadow: "var(--card-shadow), var(--well-rim)" }}
        className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/20">
        <Image
          src={item.img}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`${
            item.fit === "contain" ? "object-contain p-5" : "object-cover"
          }`}
        />

        {/* The bite: one corner rounded to a half-width quarter circle. */}
        <div
          className="absolute -right-1.5 -bottom-1.5 h-[var(--notch)] w-[var(--notch)]"
          style={{ borderRadius: "50% 0 0 0", background: CARD_SURFACE }}
        />
        {/* Fillets: transparent squares whose spread shadow paints the region
            outside a rounded corner, softening the two joins. */}
        <div
          className="absolute bottom-0 h-[var(--fillet)] w-[var(--fillet)]"
          style={{
            right: "calc(var(--notch) - 6px)",
            borderRadius: "0 0 var(--fillet) 0",
            boxShadow: `5px 5px 0 5px ${CARD_SURFACE}`,
          }}
        />
        <div
          className="absolute right-0 h-[var(--fillet)] w-[var(--fillet)]"
          style={{
            bottom: "calc(var(--notch) - 6px)",
            borderRadius: "0 0 var(--fillet) 0",
            boxShadow: `5px 5px 0 5px ${CARD_SURFACE}`,
          }}
        />

        {/* Decoration only. The headline button below stretches a ::after over
            the whole card, so this must stay out of the stacking order or it
            would punch a dead hole in the card's hit area. */}
        <motion.div
          aria-hidden="true"
          // Variant, not a group-hover utility: Framer Motion propagates the
          // parent's whileHover to child variants, and it owns the transform
          // outright rather than fighting Tailwind over it.
          variants={{ lifted: { scale: 1.04 } }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "var(--mark-fill)", borderColor: "var(--mark-ring)" }}
          className="absolute bottom-1 right-1 grid h-[var(--btn)] w-[var(--btn)] place-items-center rounded-full border transition-colors duration-250"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mark-glyph)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </motion.div>
      </div>

      <div className="pt-5 flex flex-1 flex-col">
        <div className="flex items-baseline gap-3 mb-2">
          <span className={`${outfitClass} text-xl font-light leading-none text-meta`}>
            {item.num}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {item.org}
          </span>
        </div>

        <h3 className={`${outfitClass} text-xl font-light leading-snug text-[var(--ink)]`}>
          {/* One control per card, and it opens the detail overlay rather than
              navigating. The ::after stretches over the whole article so the
              entire card is the hit area, while the accessible name stays the
              project title and there is still only a single tab stop. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="text-left cursor-pointer after:absolute after:inset-0 after:content-[''] hover:opacity-70 active:opacity-50 active:duration-150 transition-opacity duration-250 focus:outline-none"
          >
            {item.title}
          </button>
        </h3>

        <p className="text-xs uppercase tracking-[0.16em] text-[var(--meta)] mt-2">
          {item.meta}
        </p>
        <p className="text-sm text-[var(--muted)] leading-relaxed mt-3">
          {item.desc}
        </p>

        {/* The desc states the problem; this states what came of it. Given its
            own rule and label so a reader scanning the three cards can find
            the results without opening anything. */}
        {item.outcome && (
          <div className="mt-4 pt-4 border-t border-line-soft">
            <span className="block text-2xs uppercase tracking-[0.22em] text-accent mb-1.5">
              Outcome
            </span>
            <p className="text-sm text-[var(--body)] leading-relaxed">
              {item.outcome}
            </p>
          </div>
        )}

        <ul className="flex flex-wrap gap-2 mt-auto pt-4">
          {item.tags.map((t) => (
            <li
              key={t}
              className="text-2xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--fill-soft)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>

    <AnimatePresence>
      {open && (
        <CaseStudyDetail item={item} onClose={() => setOpen(false)} />
      )}
    </AnimatePresence>
    </Fragment>
  );
}

// Lightweight lightbox for a single card: the same content, larger, plus a
// link down to the matching long-form write-up. Closing it never navigates —
// only the CTA link and the card headline do that.
function CaseStudyDetail({
  item,
  onClose,
}: {
  item: CaseStudy;
  onClose: () => void;
}) {
  const Body = item.Body;

  return (
    <Overlay label={item.title} onClose={onClose}>

      {/* The full long-form write-up, the same component the page renders
          further down — widened well past the summary card so its 12-column
          layout has room, and capped/scrollable the same way the archive
          grid's ProjectModal already handles long content. */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 12 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ background: "var(--raised)", scrollbarWidth: "thin" }}
        className="relative z-10 w-full max-w-6xl max-h-[88vh] overflow-y-auto rounded-lg border border-line-soft shadow-[0_20px_80px_rgba(0,0,0,0.45)] px-5 py-12 sm:px-10 sm:py-16 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Body />
      </motion.div>

      {/* Close button, floats on the backdrop so it never overlaps content */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-11 h-11 rounded-full bg-fill hover:bg-fill-strong border border-line-strong flex items-center justify-center transition-all duration-150 active:scale-90 backdrop-blur-md cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-ink" aria-hidden>
          <line x1="3" y1="3" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="11" y1="3" x2="3" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </Overlay>
  );
}

function CaseStudyCards({ items, outfitClass }: { items: CaseStudy[]; outfitClass: string }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <CaseStudyCard key={item.id} item={item} outfitClass={outfitClass} />
      ))}
    </div>
  );
}

/* ─── Overlay ──────────────────────────────────────────────────────────────
   One dialog shell, consumed by both the case-study and the archive modal.
   They were two copies of the same markup that had drifted apart: only one
   carried dialog semantics, and the scrim was tokenised in one and hardcoded
   in the other. Everything a dialog owes the user — role, label, Escape,
   scroll lock, focus trap, focus return — lives here, so a caller cannot
   forget it and the two cannot drift again.
   ────────────────────────────────────────────────────────────────────────── */
function Overlay({
  label,
  onClose,
  onKeyDown,
  children,
}: {
  label: string;
  onClose: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Held in refs so the effect runs once per open. Callers pass inline
  // closures, and re-running would yank focus back to the first control
  // every time a parent re-rendered.
  const closeRef = useRef(onClose);
  const keyRef = useRef(onKeyDown);
  // Kept fresh after every render — writing a ref during render is not allowed.
  useEffect(() => {
    closeRef.current = onClose;
    keyRef.current = onKeyDown;
  });

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    // Land focus inside the dialog so the next Tab continues here, not behind it.
    (focusables()[0] ?? containerRef.current)?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key === "Tab") {
        const els = focusables();
        if (els.length === 0) {
          e.preventDefault();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        const active = document.activeElement;
        const inside = containerRef.current?.contains(active ?? null);
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      keyRef.current?.(e);
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 focus:outline-none"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "var(--scrim)",
          backdropFilter: "blur(18px) saturate(120%)",
          WebkitBackdropFilter: "blur(18px) saturate(120%)",
        }}
      />
      {children}
    </motion.div>
  );
}

// ─── ProjectModal, opens when a selected-projects thumb is clicked ─────────
function ProjectModal({
  item,
  outfitClass,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  index,
  total,
}: {
  item: GridItem;
  outfitClass: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  index: number;
  total: number;
}) {
  // Build image list, use `images` if provided, else fall back to single `src`
  const images = item.images && item.images.length > 0
    ? item.images
    : [{ src: item.src, caption: undefined as string | undefined }];

  // Reset scroll on project change
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [item.alt]);

  // The shared-element morph is only truthful when the tile and the hero are
  // the same asset; otherwise it would cross-fade two different pictures
  // mid-flight, which reads as a glitch rather than a transition.
  const heroIsThumb = images[0].src === item.src;

  // Escape, the scroll lock and the focus trap belong to every dialog and are
  // Overlay's job. Only the gallery's own arrow-key stepping lives here.
  const handleArrows = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" && hasPrev) onPrev();
    if (e.key === "ArrowRight" && hasNext) onNext();
  };

  return (
    <Overlay label={item.label} onClose={onClose} onKeyDown={handleArrows}>

      {/* Modal content, whole panel scrolls as one unit */}
      <motion.div
        ref={panelRef}
        // Opacity only. The hero image's shared-element morph is what carries
        // this open now — a second scale/translate on the panel would fight it
        // and put two competing entrances on the same pixels.
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-lg bg-sunken border border-line-soft shadow-[0_20px_80px_rgba(0,0,0,0.7)]"
        style={{ scrollbarWidth: "thin" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row md:items-start">

          {/* Image column, magazine spread: hero shot + editorial grid */}
          <div className="w-full md:w-3/5 bg-sunken flex flex-col">
            {/* Optional video, sits above the hero shot when present */}
            {item.video && getYouTubeId(item.video.url) && (
              <figure className="flex flex-col bg-black">
                <div className="relative w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(item.video.url)}`}
                    title={`${item.label} demo video`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                {item.video.caption && (
                  <figcaption className="px-5 md:px-7 py-4">
                    <div className="h-px w-8 bg-accent/50 mb-2.5" />
                    <p className="text-xs md:text-sm text-body-2 italic leading-snug">
                      {item.video.caption}
                    </p>
                  </figcaption>
                )}
              </figure>
            )}

            {/* Optional interactive demo iframe, sits above hero shot when present */}
            {item.demo && (
              <figure className="flex flex-col bg-black">
                <div
                  className="relative w-full bg-black"
                  style={{ height: item.demo.height ?? undefined, aspectRatio: item.demo.aspect ?? (item.demo.height ? undefined : "3 / 4") }}
                >
                  <iframe
                    src={item.demo.url}
                    title={`${item.label} interactive demo`}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
                {item.demo.caption && (
                  <figcaption className="px-5 md:px-7 py-4">
                    <div className="h-px w-8 bg-accent/50 mb-2.5" />
                    <p className="text-xs md:text-sm text-body-2 italic leading-snug">
                      {item.demo.caption}
                    </p>
                  </figcaption>
                )}
              </figure>
            )}

            {/* Hero, feature shot, full bleed */}
            <figure className="flex flex-col">
              <div className="relative w-full bg-black">
                <MotionImage
                  layoutId={heroIsThumb ? `archive-${item.alt}` : undefined}
                  src={images[0].src}
                  alt={images[0].caption || item.alt}
                  width={dimsOf(images[0].src).w}
                  height={dimsOf(images[0].src).h}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className={`w-full h-auto block ${item.scaleClass ?? ""}`}
                  transition={{ layout: { type: "spring", bounce: 0, duration: 0.4 } }}
                />
              </div>
              {images[0].caption && (
                <figcaption className="px-5 md:px-7 py-4">
                  <div className="h-px w-8 bg-accent/50 mb-2.5" />
                  <p className="text-xs md:text-sm text-body-2 italic leading-snug">
                    {images[0].caption}
                  </p>
                </figcaption>
              )}
            </figure>

            {/* Editorial stack: single column, natural aspect ratios for full legibility */}
            {images.length > 1 && (
              <div className="flex flex-col gap-y-7 px-3 md:px-4 pt-3 pb-5 md:pb-6">
                {images.slice(1).map((img, i) => (
                  <figure key={`${img.src}-${i}`} className="flex flex-col">
                    <div className="relative w-full bg-black overflow-hidden">
                      <Image
                        src={img.src}
                        alt={img.caption || `${item.label}`}
                        width={dimsOf(img.src).w}
                        height={dimsOf(img.src).h}
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="w-full h-auto block"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="pt-3 px-1">
                        <div className="h-px w-8 bg-accent/45 mb-2" />
                        <p className="text-xs md:text-sm text-body italic leading-snug">
                          {img.caption}
                        </p>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>

          {/* Details column, sticky to top of scroll panel on desktop */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col gap-4 bg-gradient-to-b from-sunken to-sunken md:sticky md:top-0 md:self-start md:max-h-[88vh] md:overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Tag + Year header row */}
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                {item.tag}
              </span>
              {item.year && (
                <span className="text-xs uppercase tracking-[0.18em] text-meta font-medium shrink-0">
                  {item.year}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className={`${outfitClass} text-2xl md:text-3xl font-light text-ink leading-tight`}>
              {item.label}
            </h3>

            {/* Short description */}
            <p className="text-base text-body leading-relaxed">
              {item.desc}
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {item.categories.map((c) => (
                <span
                  key={c}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-fill-soft border border-line-strong"
                  style={{ color: CAT_STYLE[c].text }}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Optional sections, render only if data present */}
            {(item.context || (item.tools && item.tools.length > 0)) && (
              <div className="pt-4 mt-2 border-t border-line-soft grid grid-cols-2 gap-x-4 gap-y-4">
                {item.context && (
                  <div>
                    <span className="block text-2xs uppercase tracking-[0.2em] text-meta mb-1.5">Context</span>
                    <span className="text-sm text-ink leading-snug">{item.context}</span>
                  </div>
                )}
                {item.tools && item.tools.length > 0 && (
                  <div>
                    <span className="block text-2xs uppercase tracking-[0.2em] text-meta mb-1.5">Tools</span>
                    <div className="flex flex-wrap gap-1">
                      {item.tools.map(t => (
                        <span key={t} className="text-xs text-ink border border-line-strong px-2 py-0.5 rounded-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes / process paragraph */}
            {item.notes && (
              <div className="pt-4 mt-1 border-t border-line-soft">
                <span className="block text-2xs uppercase tracking-[0.2em] text-meta mb-2">Notes</span>
                <p className="text-sm text-body leading-relaxed">{item.notes}</p>
              </div>
            )}

            {/* Design Thinking, rationale / approach / principles */}
            {item.designThinking && (
              <div className="pt-4 mt-1 border-t border-line-soft">
                <span className="block text-2xs uppercase tracking-[0.2em] text-accent mb-2">Design Thinking</span>
                <p className="text-sm text-body leading-relaxed whitespace-pre-line">{item.designThinking}</p>
              </div>
            )}


            {/* External links */}
            {item.links && item.links.length > 0 && (
              <div className="pt-4 mt-1 border-t border-line-soft flex flex-wrap gap-2">
                {item.links.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink border border-accent/40 hover:border-accent hover:bg-accent/10 px-3 py-1.5 rounded-sm transition-all duration-150 active:scale-[0.96]"
                  >
                    {link.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

      </motion.div>

      {/* Close button, floats on backdrop above the panel so it doesn't overlap content */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-11 h-11 rounded-full bg-fill hover:bg-fill-strong border border-line-strong flex items-center justify-center transition-all duration-150 active:scale-90 backdrop-blur-md cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <line x1="3" y1="3" x2="11" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="11" y1="3" x2="3" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev / Next arrows, outside the panel, floating against backdrop */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous project"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-fill hover:bg-fill-strong border border-line-strong items-center justify-center transition-all duration-150 active:scale-90 backdrop-blur-md cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next project"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-fill hover:bg-fill-strong border border-line-strong items-center justify-center transition-all duration-150 active:scale-90 backdrop-blur-md cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Position in the filtered set. selectedIndex was already computed to
          drive the arrows and never shown, so stepping told you nothing about
          where you were or how much was left. Sits with the controls it
          describes, in the same chrome, so the grouping is obvious. */}
      <div
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-fill border border-line-strong backdrop-blur-md pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-2xs uppercase tracking-[0.18em] text-ink font-medium tabular-nums">
          {String(index + 1).padStart(2, "0")}
          <span className="text-meta"> / {String(total).padStart(2, "0")}</span>
        </span>
      </div>
    </Overlay>
  );
}

const slowFade = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1, filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const lineReveal = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }
  }
};

// Label / section heading style
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-sm uppercase tracking-[0.22em] text-accent mb-2.5">
    {children}
  </span>
);

// Divider
const Hairline = () => <div className="w-full h-[1px] bg-fill-soft my-5" />;

// ─── Scrollspy Nav ───
// One entry per section, in document order, labelled with the heading the
// section actually shows (§16: direct, specific labels; wayfinding should
// answer "what's there?"). The archive was previously unrepresented.
const NAV_ITEMS = [
  { id: "selected-projects", label: "Selected Projects" },
  // Nav label is terser than the section's own heading on purpose: headings
  // can carry voice, nav labels should be scannable. "More Projects" also
  // avoids the false temporal signal "Archive" would send — the newest work
  // on the page (Luminous Jellyfish, 2026) lives in this section.
  { id: "more-projects", label: "More Projects" },
  { id: "about-me", label: "About Me" },
];

function ScrollNav() {
  const [active, setActive] = useState("selected-projects");

  useEffect(() => {
    // Scroll-based active detection: find the last section whose top
    // has passed the activation line (~30% from the top of the viewport).
    const updateActive = () => {
      const activationLine = window.innerHeight * 0.3;
      let current = NAV_ITEMS[0].id;
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= activationLine) current = id;
      }
      setActive(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <nav className="fixed right-5 top-[320px] z-50 hidden lg:flex flex-col items-center gap-0">
      {NAV_ITEMS.map(({ id, label }, i) => (
        <div key={id} className="flex flex-col items-center">
          {/* Dot + tooltip row */}
          <a
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative flex items-center justify-center group/dot py-2 px-2 transition-transform duration-250 active:scale-90 active:duration-150"
          >
            {/* Dot, active state has a silver metallic glow */}
            <div
              className={`w-[9px] h-[9px] rounded-full transition-all duration-250 ${active === id
                ? "bg-[var(--nav-dot)] scale-150 shadow-[0_0_8px_rgba(229,231,235,0.95),0_0_18px_rgba(192,192,192,0.6),0_0_30px_rgba(148,163,184,0.35)]"
                : "bg-meta group-hover/dot:bg-body-2"
                }`}
            />
            {/* Tooltip label, appears to the left on hover (nav lives on right) */}
            <span
              className="absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-xs tracking-wide pointer-events-none
                opacity-0 group-hover/dot:opacity-100 translate-x-2 group-hover/dot:translate-x-0
                transition-all duration-150 px-2.5 py-1 rounded bg-panel-2 border border-line-strong
                text-[var(--nav-dot)] shadow-lg"
            >
              {label}
            </span>
          </a>
          {/* Connector line */}
          {i < NAV_ITEMS.length - 1 && (
            <div className="w-[1px] h-6 bg-fill" />
          )}
        </div>
      ))}
    </nav>
  );
}

// ─── Back-to-Top Button (clean modern circular button) ─────────────────────
function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
        w-11 h-11 rounded-full flex items-center justify-center
        bg-white/95 hover:bg-white border border-black/5
        shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.35)]
        hover:-translate-y-0.5 active:translate-y-0 active:scale-90 active:duration-150
        transition-all duration-250 backdrop-blur-sm cursor-pointer
        ${visible ? "" : "pointer-events-none"}`}
      aria-label="Back to top"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--dgm-fill)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </motion.button>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: "dark" | "light"; onToggle: () => void }) {
  const light = theme === "light";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={light}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      style={{ background: "var(--raised)", borderColor: "var(--line)", color: "var(--body)" }}
      className="fixed top-5 right-5 z-50 grid h-10 w-10 place-items-center rounded-full border transition-all duration-250 active:scale-90 active:duration-150 cursor-pointer"
    >
      {light ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}

function BMWCaseStudyBody() {
  return (
<>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Left, meta + content */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="flex items-baseline gap-4">
                  <span className={`${outfit.className} text-5xl font-light text-ink`}>01</span>
                  <span className="text-sm uppercase tracking-[0.2em] text-accent">BMW Group</span>
                </div>

                <div>
                  <h2 className={`${outfit.className} text-3xl font-light text-ink mb-1`}>
                    Adaptive Generative UI
                  </h2>
                  <p className="text-sm tracking-widest uppercase text-body mb-6">
                    2025 Jun – 2026 Jan &nbsp;·&nbsp; UX Engineer Intern
                  </p>

                  <div className="space-y-6 text-base text-body leading-relaxed">
                    {/* The Problem */}
                    <div>
                      <SectionLabel>The Problem</SectionLabel>
                      <div className="bg-panel-2 rounded-sm p-6 border border-line">
                        <p className="mb-3">
                          In-vehicle interfaces are static. They show the same things the same way, forcing drivers to dig for information at the exact moments road conditions, fatigue, or hazards make digging dangerous.
                        </p>
                        <p>
                          <span className="text-[var(--ink)] font-medium">Design challenge:</span> Compose the interface itself from contex. Driver state, road conditions, route - instead of asking the driver to navigate to what they need.
                        </p>
                      </div>
                    </div>

                    <Hairline />

                    {/* Overview moved to full-width row below */}

                    <Hairline />

                    <div>
                      <SectionLabel>Technologies</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {["React", "Three.js", "Generative AI", "Automotive UI"].map(t => (
                          <span key={t} className="text-xs uppercase tracking-widest text-body border border-line-strong px-3 py-1 rounded-sm">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right, imagery */}
              <div className="lg:col-span-8 space-y-4">
                <div className="relative aspect-[21/9] overflow-hidden bg-raised rounded-sm">
                  <Image src="/images/01/neueklasse.webp" alt="BMW Interface" fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover opacity-80 hover:opacity-100 hover:scale-[1.02] transition-all duration-400 ease-out" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-raised rounded-sm p-6 flex items-center justify-center">
                    <>
                      <Image src="/images/01/layers_whitetext.png" alt="Layers diagram" width={dimsOf("/images/01/layers_whitetext.png").w} height={dimsOf("/images/01/layers_whitetext.png").h} sizes="(max-width: 1024px) 50vw, 33vw" className="only-dark w-full h-auto opacity-90" />
                      <Image src="/images/01/layers.png" alt="Layers diagram" width={dimsOf("/images/01/layers.png").w} height={dimsOf("/images/01/layers.png").h} sizes="(max-width: 1024px) 50vw, 33vw" className="only-light w-full h-auto opacity-90" />
                    </>
                  </div>
                  <div className="aspect-video bg-raised rounded-sm p-6 flex items-center justify-center">
                    <Image src="/images/01/pipeline.png" alt="Pipeline diagram" width={dimsOf("/images/01/pipeline.png").w} height={dimsOf("/images/01/pipeline.png").h} sizes="(max-width: 1024px) 50vw, 33vw" className="w-full h-auto opacity-90" />
                  </div>
                </div>
              </div>

              {/* Overview + Agent → Capabilities diagram (full width) */}
              <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-16">
                {/* Overview text */}
                <div className="lg:col-span-5 text-base text-body leading-relaxed">
                  <SectionLabel>Overview</SectionLabel>
                  <p>
                    Developed a context-aware UI framework that utilizes generative models to synthesize interface components in real-time. By analyzing driver telemetry, cabin state, and environmental context, the system provides proactive information hierarchy, minimizing cognitive load while enhancing vehicle interaction.
                  </p>
                </div>

                {/* Agent → Capabilities mapping */}
                <div className="lg:col-span-7">
                  <div className="bg-panel-2 rounded-lg border border-line-soft shadow-[0_4px_24px_rgba(0,0,0,0.55)] p-5 md:p-6">
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch">
                      {/* Agent column */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-center text-center py-2 rounded bg-panel-2 border border-accent/40 min-h-[36px]">
                          <span className="text-xs md:text-sm font-medium tracking-wider text-ink">Agent</span>
                        </div>
                        {[
                          "Models: Plans and decides",
                          "Tools: Acts and integrates",
                          "Orchestration: Manages memory, tools, and errors",
                          "Runtime: Executes",
                        ].map((label, i) => (
                          <div key={label} className="flex-1 flex items-center px-3 py-2.5 rounded bg-panel border border-line-soft">
                            <span className="text-accent text-xs font-semibold mr-2 shrink-0">{i + 1}.</span>
                            <span className="text-xs text-body-2 leading-[1.35]">{label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
                          <path d="M0 9 H22 M17 3 L23 9 L17 15" stroke="#C9B49A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      {/* Capabilities column */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-center text-center py-2 rounded bg-panel-2 border border-accent/40 min-h-[36px]">
                          <span className="text-xs md:text-sm font-medium tracking-wider text-ink">Capabilities</span>
                        </div>
                        {[
                          "Conversation Analytics",
                          "Data Exploration",
                          "Reasoning",
                          "Dynamic Tool Selection",
                          "Data Governance",
                        ].map(cap => (
                          <div key={cap} className="flex-1 flex items-center justify-center text-center px-3 py-2.5 rounded bg-panel border border-line-soft">
                            <span className="text-xs text-body-2 leading-[1.35]">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Contributions & Agent Architecture Diagram */}
              <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-3 text-sm text-body leading-relaxed">
                  <SectionLabel>Key Contributions</SectionLabel>
                  <ul className="space-y-2.5">
                    <li className="flex gap-2.5">
                      <span className="text-accent shrink-0">·</span>
                      <span>Modular HMI architecture decoupling UI layout from data streams, enabling seamless adaptation to driver context.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-accent shrink-0">·</span>
                      <span>React-based orchestration layer synchronizing generative model outputs with vehicle displays at sub-50ms latency.</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-accent shrink-0">·</span>
                      <span>Adaptive HMI prototype translating experimental generative design into safety-critical dashboard implementation.</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-7">
                  {/* ── Inline Agent Architecture Diagram ── */}
                  <div className="bg-panel-2 rounded-lg p-5 md:p-7 border border-line-soft shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
                    {/* ── Main Agent ── */}
                    <div className="flex justify-center mb-3">
                      <div className="px-8 py-2.5 rounded-full border border-accent/40 bg-panel-2">
                        <span className={`${outfit.className} text-sm md:text-base font-medium tracking-wide text-ink`}>Main Agent</span>
                      </div>
                    </div>

                    {/* ── Connector lines (SVG) ── */}
                    <svg viewBox="0 0 500 36" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                      {/* Vertical stem */}
                      <line x1="250" y1="0" x2="250" y2="12" stroke="#C9B49A" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" />
                      {/* Horizontal rail */}
                      <line x1="50" y1="12" x2="450" y2="12" stroke="#C9B49A" strokeWidth="0.8" opacity="0.35" />
                      {/* 5 vertical drops */}
                      {[50, 150, 250, 350, 450].map(x => (
                        <line key={x} x1={x} y1="12" x2={x} y2="36" stroke="#C9B49A" strokeWidth="0.8" opacity="0.35" />
                      ))}
                    </svg>

                    {/* ── Agent cards grid ── */}
                    {/* mobile fix: 2 cols on phones, 3 on small tablets, 5 on desktop so text stays legible */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                      {[
                        {
                          agent: "Agent A",
                          domain: "Navigation",
                          mode: "Reachability",
                          items: ["Navigation Mapping", "Route Itinerary Preview", "Adaptive Route Analytics", "Live Traffic", "Arrival Metrics"],
                        },
                        {
                          agent: "Agent B",
                          domain: "Comfort",
                          mode: "Passenger",
                          items: ["Thermal Cabin Comfort", "Visibility Optimization", "Thermodynamic Seating", "Spa Mode"],
                        },
                        {
                          agent: "Agent C",
                          domain: "Weather",
                          mode: "Road Focus",
                          items: ["Microclimate & Destination Outlook", "En-Route Environmental Timeline", "Active Weather Advisories", "Predictive Road Analytics"],
                        },
                        {
                          agent: "Agent D",
                          domain: "Media",
                          mode: "Entertainment",
                          items: ["Playback Control", "Music Queue", "Audio Engineering", "Source Switching", "Multizone Audio", "Podcast Audiobook Control"],
                        },
                        {
                          agent: "Agent E",
                          domain: "Vehicle Shadow",
                          mode: "Vehicle Health",
                          items: ["Tire Pressure Analytics", "Engine Oil Level Metrics", "Incident Telemetry Recorder", "Hydraulic Brake Fluid Integrity", "Kinetic Brake Pad Wear Analytics"],
                        },
                      ].map(({ agent, domain, mode, items }) => (
                        <div key={agent} className="flex flex-col gap-2">
                          {/* Agent header, fixed min-height so single & double-line labels align */}
                          <div className="flex flex-col items-center justify-center text-center px-1 py-1.5 rounded border border-accent/30 bg-panel-2 min-h-[44px]">
                            {/* mobile fix: 11px when cards are 2-up on phone; tighten to 10px at desktop's 5-up density */}
                            <span className="block text-xs font-medium tracking-wider text-ink leading-[1.25]">
                              {agent}
                            </span>
                            <span className="block text-xs font-medium tracking-wider text-ink leading-[1.25]">
                              {domain}
                            </span>
                          </div>

                          {/* Capability list, flex-1 stretches all cards to equal height */}
                          <div className="flex-1 rounded bg-panel border border-line-soft px-2.5 py-2.5">
                            <ul className="space-y-[4px]">
                              {items.map(item => (
                                <li key={item} className="flex gap-1.5 items-start">
                                  {/* mobile fix: bullet readable on phones (was 6px) */}
                                  <span className="text-accent text-2xs mt-[4px] shrink-0">•</span>
                                  {/* mobile fix: body 11px on phones (was 7px → illegible) */}
                                  <span className="text-xs lg:text-2xs text-body-2 leading-[1.35]">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Mode badge, fixed min-height so single & double-line labels align */}
                          <div className="flex items-center justify-center text-center px-1 py-1 rounded bg-panel-2 border border-accent/20 min-h-[26px]">
                            {/* mobile fix: legible mode label on phones */}
                            <span className="text-xs lg:text-2xs font-semibold uppercase tracking-[0.12em] text-accent leading-[1.2]">{mode} Mode</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Expanded case-study content ── */}
            <div className="mt-20 space-y-20">

              {/* Project Brief */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <SectionLabel>Project Brief</SectionLabel>
                <div className="space-y-2 text-sm text-body">
                  <p><span className="text-accent">Project</span>, Adaptive In-Vehicle AI Interface</p>
                  <p><span className="text-accent">Timeline</span>, June – December 2025</p>
                  <p><span className="text-accent">Role</span>, UX Research · Interaction Design · Prototyping</p>
                  <p><span className="text-accent">Unit</span>, BMW Group · ZI-14 · Automotive HMI</p>
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base text-body leading-relaxed mb-5">
                  In-vehicle interfaces are static. They present information uniformly regardless of who is driving, what conditions exist outside, or what cognitive demands the driver is already managing.
                </p>
                <div className="border-l-2 border-accent-deep/40 pl-5 py-1">
                  <p className="text-base text-ink leading-relaxed italic">
                    Design a generative UI system for the BMW X5 that dynamically composes its own interface in response to driver state, environment, and task context, reducing cognitive load while surfacing the right information at the right moment.
                  </p>
                </div>
              </div>
            </div> */}


              <Hairline />

              {/* Research & Design Timeline */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <SectionLabel>Research &amp; Design Timeline</SectionLabel>
                <p className="text-sm text-body leading-relaxed">
                  Work ran across two parallel tracks: <span className="text-ink">ORPHEO</span> (interaction design, generative UI architecture, high-fidelity prototyping) and <span className="text-ink">ALPHA</span> (physiological sensor integration, research framework design, usability testing and data collection).
                </p>
              </div>
              <div className="lg:col-span-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { month: "Jun", phase: "Onboarding & Discovery" },
                    { month: "Jul", phase: "Ideation" },
                    { month: "Aug", phase: "Concept Pitch + Sensors" },
                    { month: "Sep", phase: "Research Framework" },
                    { month: "Oct", phase: "Usability Testing + Iteration" },
                    { month: "Nov", phase: "Refinement + Testing" },
                    { month: "Dec", phase: "Final Design Delivery" },
                  ].map(({ month, phase }) => (
                    <div key={month} className="bg-raised rounded-sm px-4 py-3 border border-line-soft">
                      <span className="block text-xs uppercase tracking-widest text-accent mb-1">{month}</span>
                      <span className="text-sm text-body">{phase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}


              <Hairline />

              {/* Skills Applied */}
              <div>
                <SectionLabel>Skills Applied</SectionLabel>
                <div className="overflow-hidden rounded-sm border border-line-soft">
                  {[
                    { area: "UX Research", detail: "Interpreted biometric and behavioral signals through scenario-based testing to surface interaction principles for high-stakes, low-attention driving contexts" },
                    { area: "Interaction Design", detail: "Designed a generative UI system with context-gated surfacing and glance-budget constraints, prototyped through adaptive driving modes in Figma" },
                    { area: "Systems Thinking", detail: "Modeled multi-agent orchestration across sensor, context, and intent layers to map real-time inputs into legible, prioritized UI decisions" },
                    { area: "Cross-functional", detail: "Translated raw sensor outputs and engineering constraints into shared design requirements, aligning research, product, and engineering on what the car should show and when" },
                    /* mobile fix: stack the area label above the detail on phones; restore 3/9 row at md+ */
                  ].map(({ area, detail }, i) => (
                    <div key={area} className={`grid grid-cols-1 md:grid-cols-12 border-b border-line-soft last:border-b-0 ${i % 2 === 0 ? "bg-raised" : "bg-panel-2"}`}>
                      <div className="md:col-span-3 px-4 pt-4 pb-1 md:py-4 md:border-r border-line-soft">
                        <span className="text-sm uppercase tracking-widest text-accent">{area}</span>
                      </div>
                      <div className="md:col-span-9 px-4 pb-4 pt-1 md:py-4">
                        <span className="text-base md:text-sm text-body leading-relaxed">{detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Approach, hidden */}
              <div className="hidden">
                <SectionLabel>Research Approach</SectionLabel>
                <p className="text-base text-body leading-relaxed max-w-2xl mb-8">
                  Grounded in two complementary methods: physiological measurement to capture what drivers cannot self-report, and structured usability testing to observe how they interact with dynamic interfaces.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[
                    {
                      title: "Physiological Data Collection",
                      body: "Integrated a multi-sensor pipeline to capture driver state data that feeds directly into the UI's context gating logic. Design decisions grounded in measurable cognitive and physiological signals rather than self-reported preference alone.",
                      meta: [
                        { label: "Method", value: "Multi-sensor capture" },
                        { label: "Instruments", value: "PSI · PPG · HR · CRM" },
                        { label: "Output", value: "CSV pipeline → context gating" },
                      ],
                      icon: (
                        // Waveform / pulse, biometric capture
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M2 12h3l2-6 3 12 3-9 2 5 2-2h5" />
                        </svg>
                      ),
                    },
                    {
                      title: "Usability Testing Framework",
                      body: "Designed a structured testing framework to evaluate how drivers interact with dynamically generated interfaces under varying scenario conditions. Findings directly informed iteration on the isochrone GenUI concept and real-time layout logic.",
                      meta: [
                        { label: "Method", value: "Scenario-based task testing" },
                        { label: "Window", value: "Oct – Nov 2025" },
                        { label: "Output", value: "GenUI iteration · layout logic" },
                      ],
                      icon: (
                        // Clipboard checklist, structured testing
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <rect x="5" y="4" width="14" height="17" rx="1.5" />
                          <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
                          <path d="M8.5 11l1.5 1.5L13 9.5" />
                          <path d="M8.5 16l1.5 1.5L13 14.5" />
                        </svg>
                      ),
                    },
                  ].map(({ title, body, meta, icon }) => (
                    <div key={title} className="bg-raised rounded-sm border border-line-soft p-6 flex flex-col gap-5">
                      {/* Header, icon + title */}
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-sm flex items-center justify-center border border-accent/30 bg-panel-2 text-accent shrink-0">
                          {icon}
                        </span>
                        <span className="text-sm uppercase tracking-widest text-accent">{title}</span>
                      </div>

                      {/* Body */}
                      <p className="text-base text-body leading-relaxed">
                        {body}
                      </p>

                      {/* Methods strip */}
                      <div className="border-t border-line-soft pt-4 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                        {meta.map(({ label, value }) => (
                          <div key={label} className="flex flex-col gap-1 min-w-0">
                            <span className="text-2xs uppercase tracking-[0.2em] text-meta">{label}</span>
                            <span className="text-sm text-ink leading-snug break-words">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Hairline />

              {/* Key Design Decisions */}
              <div>
                <SectionLabel>Key Design Decisions</SectionLabel>
                <p className="text-base text-body mb-8">Three principles shaped every design decision across the project.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      title: "Surface, don\u2019t bury",
                      body: "Information the driver needs appears without navigation. The interface assembles itself around context \u2014 snowy roads, an incoming call, a known route \u2014 rather than waiting for the driver to request it.",
                      icon: (
                        // Eye \u2014 visibility / surface
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ),
                    },
                    {
                      title: "Minimum viable glance",
                      body: "Every screen evaluated against a glance budget. Safety-critical data chunked into scannable modules readable in under two seconds without sustained visual attention.",
                      icon: (
                        // Stopwatch \u2014 glance budget
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <circle cx="12" cy="14" r="7" />
                          <path d="M12 10v4l2 2" />
                          <path d="M9 3h6" />
                          <path d="M12 3v3" />
                        </svg>
                      ),
                    },
                    {
                      title: "State over preference",
                      body: "Driver state data \u2014 fatigue signals, cognitive load, speed \u2014 gates what is shown and how. Comfort controls auto-adjust. Map overlays appear and collapse based on current capacity, not just settings.",
                      icon: (
                        // Pulse line \u2014 biometric / state
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M3 12h4l2-5 3 10 2-7 2 4 2-2h3" />
                        </svg>
                      ),
                    },
                    {
                      title: "Context continuity",
                      body: "The system maintains awareness across modes \u2014 navigation, comfort, media, vehicle health \u2014 orchestrating agents so decisions in one domain inform layout choices in another.",
                      icon: (
                        // Connected nodes \u2014 orchestration / network
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <circle cx="5" cy="6" r="2" />
                          <circle cx="19" cy="6" r="2" />
                          <circle cx="12" cy="18" r="2" />
                          <path d="M6.5 7.3 10.7 16.7" />
                          <path d="M17.5 7.3 13.3 16.7" />
                          <path d="M7 6h10" />
                        </svg>
                      ),
                    },
                  ].map(({ title, body, icon }) => (
                    <div key={title} className="bg-raised rounded-sm p-6 border border-line-soft flex flex-col gap-3">
                      <span className="w-9 h-9 rounded-sm flex items-center justify-center border border-accent/30 bg-panel-2 text-accent">
                        {icon}
                      </span>
                      <span className="text-ink text-sm font-medium">{title}</span>
                      <span className="text-sm text-body leading-relaxed">{body}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Hairline />

              {/* Interaction Model */}
              <div>
                <SectionLabel>Interaction Model</SectionLabel>
                <div className="rounded-sm border border-line-soft bg-raised p-8">
                  <p className="text-sm text-body leading-relaxed mb-8 max-w-xl">
                    Voice and sensor input become generators of new interface components. The driver does not navigate, the interface responds.
                  </p>

                  {/* Flow */}
                  <div className="flex flex-col gap-0">
                    {[
                      { step: "01", label: "Driver Input", sub: "Voice · Sensor · Telemetry" },
                      { step: "02", label: "Intent Parsing", sub: "NLP · Context classification" },
                      { step: "03", label: "UI Generation", sub: "Component synthesis · Agent selection" },
                      { step: "04", label: "Layout Orchestration", sub: "Priority scoring · Glance-budget check" },
                      { step: "05", label: "Rendered Interface", sub: "Sub-50ms · Auto-dismissed when resolved", hoverImage: "/images/01/BMW_Roadstoavoid.png" },
                    ].map(({ step, label, sub, hoverImage }, i, arr) => (
                      <div key={step} className={`flex flex-col relative ${hoverImage ? "group/step" : ""}`}>
                        <div className="flex items-center gap-5">
                          {/* Step number + node */}
                          <div className="flex flex-col items-center" style={{ width: 36 }}>
                            <div className={`w-9 h-9 rounded-sm flex items-center justify-center border ${i === arr.length - 1 ? "border-accent/60 bg-accent/10" : "border-line bg-panel-2"}`}>
                              <span className="text-xs tracking-widest text-accent">{step}</span>
                            </div>
                          </div>
                          {/* Label */}
                          <div className={`min-w-0 ${hoverImage ? "cursor-default" : ""}`}>
                            <p className={`text-sm font-medium tracking-wide ${i === arr.length - 1 ? "text-accent" : "text-ink-2"}`}>
                              {label}
                              {hoverImage && (
                                <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-sm bg-fill text-2xs uppercase tracking-widest text-body">
                                  Hover Me
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-meta tracking-wide mt-0.5">{sub}</p>
                          </div>
                        </div>
                        {/* Connector */}
                        {i < arr.length - 1 && (
                          <div className="flex items-start gap-5">
                            <div style={{ width: 36 }} className="flex justify-center">
                              <div className="w-px h-6 bg-fill-soft" />
                            </div>
                          </div>
                        )}

                        {/* Hover image panel */}
                        {/* mobile fix: hidden on phones/tablets (hover-only affordance + would overflow viewport); shown at md+ */}
                        {hoverImage && (
                          <div
                            className="hidden md:block absolute left-[280px] top-1/2 -translate-y-1/2 z-50 w-[300px] md:w-[400px]
                            opacity-0 translate-x-4 pointer-events-none group-hover/step:opacity-100 group-hover/step:translate-x-0
                            transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                          >
                            <div className="relative rounded-lg border border-line bg-ground shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden p-1">
                              <Image
                                src={hoverImage}
                                alt={label}
                                width={dimsOf(hoverImage).w}
                                height={dimsOf(hoverImage).h}
                                sizes="420px"
                                className="w-full h-auto object-cover rounded-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Example callout */}
                  <div className="mt-8 border border-line-soft rounded-sm bg-panel-2 p-4">
                    <p className="text-xs uppercase tracking-widest text-accent mb-2">Example</p>
                    <p className="text-sm text-body leading-relaxed break-words whitespace-normal">
                      Driver says <span className="text-ink-2">"Show me roads to avoid"</span> during a snowstorm → system generates a contextual map overlay with icy patch markers, congestion warnings, and a black ice alert, assembled on demand, dismissed automatically when conditions clear.
                    </p>
                  </div>
                </div>
              </div>
              <Hairline />

              {/* High-Fidelity Screens */}
              <div>
                <SectionLabel>High-Fidelity Screens</SectionLabel>
                <p className="text-sm text-body mb-8 max-w-2xl break-words whitespace-normal">
                  Designed in Figma, validated against one primary scenario, Kennedy Expressway, Chicago, 32°F. High information density, genuine safety stakes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Passenger Comfort Panel", body: "Identity, dual-zone temp, seat controls, tire pressure, and range, one glanceable view. No multi-step navigation." },
                    { title: "Danger Zone Map Overlay", body: "Icy patch markers, congestion flags, and black ice alert. Auto-surfaces on weather trigger. Dismissed when conditions clear." },
                    { title: "Snow Readiness Module", body: "Tire pressure, brake wear, road focus mode, heated steering, assembled proactively. Surfaces without being asked." },
                    { title: "Climate Ring Display", body: "Dual-zone temp as ambient rings in the instrument cluster. Communicates state without pulling sustained attention from the road." },
                  ].map(({ title, body }) => (
                    <div key={title} className="bg-raised rounded-sm p-6 border border-line-soft">
                      <p className="text-xs uppercase tracking-widest text-accent mb-2">{title}</p>
                      <p className="text-sm text-body leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Hairline />

              {/* Industry Exposure */}
              {/* <div>
              <SectionLabel>Industry Exposure</SectionLabel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-raised rounded-sm p-6 border border-line-soft space-y-4">
                  <div>
                    <p className="text-ink text-base font-medium mb-0.5">Stanford HAI</p>
                    <p className="text-xs uppercase tracking-widest text-accent">September 2025 · Human-Centered AI Symposium</p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Agents are shifting from features within an interface to the interface layer itself \u2014 validating the GenUI orchestrator approach.",
                      "Stanford Medicine\u2019s EHR integration showed AI can move fast in high-stakes, regulated environments \u2014 relevant to automotive safety constraints.",
                      "Haptic and relational modalities are the next frontier for building user trust beyond text \u2014 directly applicable to low-glance HMI design.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-body leading-relaxed list-none">
                        <span className="text-accent shrink-0 mt-0.5">\u2014</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-raised rounded-sm p-6 border border-line-soft space-y-4">
                  <div>
                    <p className="text-ink text-base font-medium mb-0.5">Google DevFest SV</p>
                    <p className="text-xs uppercase tracking-widest text-accent">November 2025 · Google Developer Groups</p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "The four-stage agent lifecycle (Models, Tools, Orchestration, Runtime) gave clearer language for structuring the orchestrator\u2019s decision logic in design documentation.",
                      "Trajectory scoring and hallucination checks as evaluation metrics informed how I thought about testing GenUI consistency across scenarios.",
                      "The shift from writing code to orchestrating agent \u2018brains\u2019 mirrors the shift from designing screens to designing decision systems.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-body leading-relaxed list-none">
                        <span className="text-accent shrink-0 mt-0.5">\u2014</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div> */}

              <Hairline />


            </div></>

            );
}

function SmashCaseStudyBody() {
  // Two SVG ids in this diagram (arrow marker, drop-shadow filter) need to be
  // unique per mount: the same body renders both in the long-form section
  // below and inside the case-study modal above it, and duplicate ids in a
  // shared document break `url(#id)` lookups.
  const arrowId = useId();
  const shadowId = useId();
  return (
<>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Right, imagery */}
              <div className="lg:col-span-6 order-2 space-y-4">
                {/* ── Inline Speech-Flow Chart (translucent navy panel) ── */}
                <div
                  className="rounded-lg border border-[var(--dgm-stroke)]/20 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
                  style={{ background: "var(--dgm-plate)" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs uppercase tracking-[0.24em] text-[var(--dgm-accent)] font-semibold">Speech Pipeline</span>
                    <span className="text-2xs uppercase tracking-[0.2em] text-slate-400">Real-time</span>
                  </div>

                  {/* Sample utterance caption */}
                  <p className="text-xs md:text-sm text-slate-400 italic mb-5 leading-snug">
                    Sample input: <span className="text-slate-200 not-italic">&ldquo;hey um, can you turn up the… volume thing?&rdquo;</span>
                  </p>

                  {/* Flow chart SVG */}
                  <svg
                    viewBox="0 0 1000 1140"
                    className="w-full h-auto block"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ fontFamily: "inherit" }}
                  >
                    <defs>
                      {/* Arrow marker */}
                      <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M0,1 L9,5 L0,9 Z" fill="var(--dgm-stroke)" />
                      </marker>
                      {/* Soft drop shadow for boxes */}
                      <filter id={shadowId} x="-5%" y="-5%" width="110%" height="120%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="var(--dgm-fill)" floodOpacity="0.10" />
                      </filter>
                    </defs>

                    {/* ── 1. User Input Speech, pill ── */}
                    <g filter={`url(#${shadowId})`}>
                      <rect x="40" y="14" width="560" height="100" rx="50" fill="white" stroke="var(--dgm-stroke)" strokeWidth="3" />
                    </g>
                    <text x="320" y="64" textAnchor="middle" dominantBaseline="central"
                      fontSize="26" fontWeight="700" fill="var(--dgm-fill)">User Input Speech</text>

                    {/* Dashed connector with open dots (source link) */}
                    <circle cx="320" cy="124" r="5" fill="white" stroke="var(--dgm-stroke)" strokeWidth="2" />
                    <line x1="320" y1="132" x2="320" y2="184" stroke="var(--dgm-stroke)" strokeWidth="2" strokeDasharray="6 6" />
                    <circle cx="320" cy="192" r="5" fill="white" stroke="var(--dgm-stroke)" strokeWidth="2" />

                    {/* ── 2. Audio Dataset, large rounded rect with list ── */}
                    <g filter={`url(#${shadowId})`}>
                      <rect x="40" y="200" width="560" height="320" rx="22" fill="white" stroke="var(--dgm-stroke)" strokeWidth="3" />
                    </g>
                    <text x="90" y="246" fontSize="26" fontWeight="700" fill="var(--dgm-fill)">Audio Dataset</text>
                    {[
                      "Prompt Relevant Speech File",
                      "Prompt Irrelevant Speech Files",
                      "Formal Speech Files",
                      "Informal Speech Files",
                      "Background Noise Speech Files",
                    ].map((item, i) => {
                      const y = 308 + i * 38;
                      return (
                        <g key={item}>
                          <circle cx="130" cy={y - 5} r="3.5" fill="var(--dgm-fill)" />
                          <text x="150" y={y} fontSize="18" fill="var(--dgm-fill-2)">{item}</text>
                        </g>
                      );
                    })}

                    {/* Connector ↓ to Speech To Text */}
                    <circle cx="320" cy="528" r="5" fill="white" stroke="var(--dgm-stroke)" strokeWidth="2" />
                    <line x1="320" y1="536" x2="320" y2="588" stroke="var(--dgm-stroke)" strokeWidth="2.5" markerEnd={`url(#${arrowId})`} />

                    {/* ── 3. Speech To Text, rounded rect ── */}
                    <g filter={`url(#${shadowId})`}>
                      <rect x="40" y="598" width="560" height="140" rx="22" fill="white" stroke="var(--dgm-stroke)" strokeWidth="3" />
                    </g>
                    <text x="320" y="650" textAnchor="middle" dominantBaseline="central"
                      fontSize="26" fontWeight="700" fill="var(--dgm-fill)">Speech To Text</text>
                    <text x="320" y="694" textAnchor="middle" dominantBaseline="central"
                      fontSize="22" fontWeight="700" fill="var(--dgm-fill)">NLP + Semantic Analysis</text>

                    {/* Side annotation: Labeled Audio Dataset */}
                    <line x1="600" y1="668" x2="668" y2="668" stroke="var(--dgm-stroke)" strokeWidth="2" strokeDasharray="5 5" />
                    <rect x="668" y="618" width="3" height="100" fill="var(--dgm-stroke)" />
                    <g filter={`url(#${shadowId})`}>
                      <rect x="680" y="610" width="290" height="116" rx="6" fill="var(--dgm-text)" stroke="var(--dgm-stroke)" strokeWidth="1.8" />
                    </g>
                    <text x="700" y="646" fontSize="16" fontWeight="700" fill="var(--dgm-fill)">Labeled Audio Dataset:</text>
                    <text x="700" y="676" fontSize="15" fill="var(--dgm-fill-2)">For validating semantic</text>
                    <text x="700" y="696" fontSize="15" fill="var(--dgm-fill-2)">recognition</text>

                    {/* Connector ↓ to Classification */}
                    <circle cx="320" cy="746" r="5" fill="white" stroke="var(--dgm-stroke)" strokeWidth="2" />
                    <line x1="320" y1="754" x2="320" y2="794" stroke="var(--dgm-stroke)" strokeWidth="2.5" markerEnd={`url(#${arrowId})`} />

                    {/* ── 4. Classification, diamond ── */}
                    <g filter={`url(#${shadowId})`}>
                      <polygon points="320,800 530,920 320,1040 110,920"
                        fill="white" stroke="var(--dgm-stroke)" strokeWidth="3" strokeLinejoin="round" />
                    </g>
                    <text x="320" y="900" textAnchor="middle" dominantBaseline="central"
                      fontSize="24" fontWeight="700" fill="var(--dgm-fill)">Classification</text>
                    {/* Sub-question with bullet */}
                    <circle cx="208" cy="938" r="3.5" fill="var(--dgm-fill)" />
                    <text x="222" y="942" fontSize="17" fill="var(--dgm-fill-2)">Are semantics relevant</text>
                    <text x="222" y="966" fontSize="17" fill="var(--dgm-fill-2)">to the system?</text>

                    {/* Side annotation: Evaluation notes */}
                    <line x1="530" y1="920" x2="668" y2="920" stroke="var(--dgm-stroke)" strokeWidth="2" strokeDasharray="5 5" />
                    <rect x="668" y="830" width="3" height="180" fill="var(--dgm-stroke)" />
                    <g filter={`url(#${shadowId})`}>
                      <rect x="680" y="820" width="290" height="200" rx="6" fill="var(--dgm-text)" stroke="var(--dgm-stroke)" strokeWidth="1.8" />
                    </g>
                    {/* Annotation text, two bullet entries */}
                    <text x="700" y="858" fontSize="14" fill="var(--dgm-accent-2)" fontWeight="700">▸</text>
                    <text x="718" y="858" fontSize="14" fill="var(--dgm-fill-2)">In evaluation, loop through all</text>
                    <text x="718" y="878" fontSize="14" fill="var(--dgm-fill-2)">audio files/dataset to calculate</text>
                    <text x="718" y="898" fontSize="14" fill="var(--dgm-fill-2)">accuracy</text>
                    <text x="700" y="938" fontSize="14" fill="var(--dgm-accent-2)" fontWeight="700">▸</text>
                    <text x="718" y="938" fontSize="14" fill="var(--dgm-fill-2)">the evaluation process involves</text>
                    <text x="718" y="958" fontSize="14" fill="var(--dgm-fill-2)">systematically looping through all</text>
                    <text x="718" y="978" fontSize="14" fill="var(--dgm-fill-2)">audio files to calculate model</text>
                    <text x="718" y="998" fontSize="14" fill="var(--dgm-fill-2)">accuracy.</text>

                    {/* Branch connector, open dot at diamond bottom */}
                    <circle cx="320" cy="1046" r="5" fill="white" stroke="var(--dgm-stroke)" strokeWidth="2" />

                    {/* YES branch, left, with rounded turn */}
                    <path d="M 320 1054 L 320 1066 Q 320 1078 308 1078 L 152 1078 Q 140 1078 140 1090 L 140 1108"
                      stroke="var(--dgm-stroke)" strokeWidth="2.5" fill="none" markerEnd={`url(#${arrowId})`} strokeLinejoin="round" strokeLinecap="round" />

                    {/* NO branch, right, with rounded turn */}
                    <path d="M 320 1054 L 320 1066 Q 320 1078 332 1078 L 488 1078 Q 500 1078 500 1090 L 500 1108"
                      stroke="var(--dgm-stroke)" strokeWidth="2.5" fill="none" markerEnd={`url(#${arrowId})`} strokeLinejoin="round" strokeLinecap="round" />

                    {/* Check badge, YES */}
                    <g filter={`url(#${shadowId})`}>
                      <circle cx="140" cy="1098" r="18" fill="var(--dgm-stroke)" stroke="white" strokeWidth="2" />
                    </g>
                    <path d="M 131 1098 L 138 1105 L 150 1092" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                    {/* X badge, NO */}
                    <g filter={`url(#${shadowId})`}>
                      <circle cx="500" cy="1098" r="18" fill="var(--dgm-stroke)" stroke="white" strokeWidth="2" />
                    </g>
                    <path d="M 491 1089 L 509 1107 M 509 1089 L 491 1107" stroke="white" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                  </svg>

                  {/* Output row, Agent Responds | Agent Ignores */}
                  <div className="grid grid-cols-2 gap-4 -mt-2">
                    <div className="rounded-lg border-[3px] border-[var(--dgm-stroke)] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.10)] py-4 px-4 text-center">
                      <span className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Agent Responds</span>
                    </div>
                    <div className="rounded-lg border-[3px] border-[var(--dgm-stroke)] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.10)] py-4 px-4 text-center">
                      <span className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Agent Ignores</span>
                    </div>
                  </div>

                  {/* Footer metric */}
                  <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
                    <span className="text-2xs uppercase tracking-[0.22em] text-slate-400">Classification Accuracy</span>
                    <span className={`${outfit.className} text-lg text-[var(--dgm-fill)] font-light`}>&gt;90<span className="text-[var(--dgm-accent)]">%</span></span>
                  </div>
                </div>
                {/* NLP diagram */}
                {/* <div className="bg-raised rounded-sm p-6 flex items-center justify-center">
                <Image loading="lazy" src="/images/02/NL01.png" alt="NLP Semantic Analysis" width={dimsOf("/images/02/NL01.png").w} height={dimsOf("/images/02/NL01.png").h} sizes="(max-width: 1024px) 100vw, 50vw" className="w-[85%] h-auto opacity-70 dark-invert" />
              </div> */}
                {/* ── Response Accuracy, Formal vs Informal Comparison ── */}
                <div
                  className="rounded-lg border border-[var(--dgm-stroke)]/20 p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md"
                  style={{ background: "var(--dgm-plate)" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs uppercase tracking-[0.24em] text-[var(--dgm-accent)] font-semibold">Response Accuracy</span>
                    <span className="text-2xs uppercase tracking-[0.2em] text-slate-400">Formal vs Informal</span>
                  </div>

                  {/* Caption */}
                  <p className="text-xs md:text-sm text-slate-400 italic mb-5 leading-snug">
                    Classification accuracy across speech conditions, split by speaking style.
                  </p>

                  {/* Legend */}
                  <div className="flex items-center gap-5 mb-6 pb-4 border-b border-line">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(90deg,#38BDF8,#7DD3FC)", boxShadow: "0 0 8px rgba(56,189,248,0.5)" }} />
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-200 font-medium">Formal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm border border-[var(--dgm-accent)]/60" style={{ background: "rgba(125,211,252,0.15)" }} />
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-200 font-medium">Informal</span>
                    </div>
                  </div>

                  {/* Vertical double-bar chart */}
                  {(() => {
                    const data = [
                      { condition: "Prompt Relevant", formal: 96, informal: 93 },
                      { condition: "Prompt Irrelevant", formal: 94, informal: 90 },
                      { condition: "Background Noise", formal: 89, informal: 84 },
                    ];
                    return (
                      <div>
                        {/* Chart area */}
                        <div className="relative pt-6" style={{ height: 280 }}>
                          {/* Y-axis labels */}
                          <div className="absolute left-0 top-6 bottom-7 w-7 flex flex-col justify-between items-end text-2xs text-slate-500 tracking-wide">
                            <span>100</span>
                            <span>75</span>
                            <span>50</span>
                            <span>25</span>
                            <span>0</span>
                          </div>

                          {/* Plot area */}
                          <div className="absolute left-9 right-2 top-6 bottom-7">
                            {/* Horizontal gridlines */}
                            {[0, 25, 50, 75, 100].map(v => (
                              <div
                                key={v}
                                className="absolute left-0 right-0 h-px bg-fill-soft"
                                style={{ bottom: `${v}%` }}
                              />
                            ))}

                            {/* Bar groups */}
                            <div className="absolute inset-0 flex items-end justify-around">
                              {data.map(({ condition, formal, informal }, i) => (
                                <div key={condition} className="relative flex items-end gap-1.5 h-full">
                                  {/* Formal bar column */}
                                  <div className="relative h-full w-9 md:w-11">
                                    {/* Value label */}
                                    <span
                                      className={`${outfit.className} absolute left-1/2 -translate-x-1/2 text-xs text-[var(--dgm-fill)] whitespace-nowrap`}
                                      style={{ bottom: `calc(${formal}% + 4px)` }}
                                    >
                                      {formal}<span className="text-[var(--dgm-accent)] text-2xs">%</span>
                                    </span>
                                    {/* Bar */}
                                    <motion.div
                                      initial={{ height: 0 }}
                                      whileInView={{ height: `${formal}%` }}
                                      viewport={{ once: true, margin: "-10%" }}
                                      transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                                      className="absolute bottom-0 left-0 right-0 rounded-t-md"
                                      style={{
                                        background: "linear-gradient(180deg, #7DD3FC 0%, #38BDF8 100%)",
                                        boxShadow: "0 0 12px rgba(56,189,248,0.4)",
                                      }}
                                    />
                                  </div>

                                  {/* Informal bar column */}
                                  <div className="relative h-full w-9 md:w-11">
                                    <span
                                      className={`${outfit.className} absolute left-1/2 -translate-x-1/2 text-xs text-slate-200 whitespace-nowrap`}
                                      style={{ bottom: `calc(${informal}% + 4px)` }}
                                    >
                                      {informal}<span className="text-[var(--dgm-accent)] text-2xs">%</span>
                                    </span>
                                    <motion.div
                                      initial={{ height: 0 }}
                                      whileInView={{ height: `${informal}%` }}
                                      viewport={{ once: true, margin: "-10%" }}
                                      transition={{ duration: 0.4, delay: i * 0.06 + 0.04, ease: [0.25, 0.1, 0.25, 1] }}
                                      className="absolute bottom-0 left-0 right-0 rounded-t-md border border-b-0 border-[var(--dgm-accent)]/60"
                                      style={{
                                        background: "rgba(125,211,252,0.16)",
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* X-axis labels */}
                        <div className="ml-9 mr-2 mt-2 flex justify-around items-start">
                          {data.map(({ condition }) => (
                            <div key={condition} className="flex flex-col items-center text-center max-w-[110px]">
                              <span className="text-xs text-slate-200 font-medium tracking-wide leading-tight">
                                {condition}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Footer metric */}
                  <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                    <span className="text-2xs uppercase tracking-[0.22em] text-slate-400">Overall Mean Accuracy</span>
                    <span className={`${outfit.className} text-xl text-[var(--dgm-fill)] font-light`}>
                      &gt;90<span className="text-[var(--dgm-accent)]">%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Left, meta + content */}
              <div className="lg:col-span-5 order-1 flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <span className={`${outfit.className} text-5xl font-light text-ink leading-none`}>02</span>
                  <span className="text-sm uppercase tracking-[0.2em] text-accent">CMU SmaSH Lab</span>
                </div>

                <div>
                  <h2 className={`${outfit.className} text-3xl font-light text-ink mb-1`}>
                    Proactive Agent
                  </h2>
                  <p className="text-sm tracking-widest uppercase text-body mb-6">
                    2024 Sep – 2025 Aug &nbsp;·&nbsp; Research Assistant
                  </p>

                  <div className="space-y-6 text-base text-body leading-relaxed">
                    {/* The Problem */}
                    <div>
                      <SectionLabel>The Problem</SectionLabel>
                      <div className="bg-panel-2 rounded-sm p-6 border border-line">
                        <p className="text-sm mb-3">
                          Voice assistants react to whatever they hear. They transcribe filler, misread half-finished thoughts, and respond when nobody was talking to them, then stay silent at the moment a user actually needs help.
                        </p>
                        <p className="text-sm">
                          <span className="text-[var(--ink)] font-medium">Design challenge:</span> Classify intent from noisy, real-world speech so the agent acts only when the signal is clear.
                        </p>
                      </div>
                    </div>

                    <Hairline />

                    {/* Overview */}
                    <div>
                      <SectionLabel>Overview</SectionLabel>
                      <p className="text-sm">
                        Researched &amp; built a semantic classification pipeline for adaptive multimodal systems that isolates relevant user intent from environmental noise and linguistic variations, achieving &gt;90% response accuracy.
                      </p>
                    </div>

                    <Hairline />

                    {/* Key Contributions */}
                    <div>
                      <SectionLabel>Key Contributions</SectionLabel>
                      <ul className="space-y-3">
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
                          <span>NLP pipeline development</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
                          <span>User intent prediction model</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
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
                          <span className="text-accent shrink-0">·</span>
                          <span><span className="font-semibold text-ink">Robust Semantic Orchestration:</span> Engineered a classification pipeline that bridges the gap between raw speech-to-text and actionable intent, handling the nuance of informal speech.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
                          <span><span className="font-semibold text-ink">Multimodal Scalability:</span> Created a modular framework for adaptive systems that can be integrated into various hardware environments, from smart homes to automotive HMIs.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
                          <span><span className="font-semibold text-ink">Real-time Decision Logic:</span> Developed the logic for "Agent Responds vs. Agent Ignores," a critical component for the next generation of "always-on" ambient computing.</span>
                        </li>
                      </ul>
                    </div>

                    <Hairline />

                    {/* Performance metric */}
                    <div className="pt-2">
                      <SectionLabel>Performance Metric</SectionLabel>
                      <span className={`${outfit.className} text-2xl text-ink`}>&gt;90% Accuracy</span>
                    </div>
                  </div>
                </div>
              </div>

            </div></>

            );
}

// ─── Trend Signals, redesigned ───────────────────────────────────────────────
// The version that shipped read as a consumer app: purple gradient, a mocked
// Instagram post, a $89.99 product tile, and a "Personal Fashion Assistant".
// Real PLM users are merchandisers and PD managers, so this is the same module
// in the register they actually work in. Rendered in JSX rather than as an
// image because the original export is only 692px wide and cannot survive a
// full-width slot on a 2x display.
//
// Palette is the product's own light UI, not the portfolio's dark chrome, so it
// reads as a screen rather than as page furniture — same treatment the style
// flow diagram already gets.
const TS = {
  page: "#F4F6F8",
  card: "#FFFFFF",
  line: "#E3E8EF",
  ink: "#0F172A",
  ink2: "#334155",
  muted: "#64748B",
  accent: "#2563EB",
  accentSoft: "#EFF4FF",
  // #059669 measured 3.77:1 on white, under AA for the 10-11px it is used at.
  pos: "#047857",   // 5.48:1
};

function TrendSignalsMock() {
  const signals = [
    { r: 1, name: "Vintage dresses", m: 95, g: "+45%", v: "89K", w: "6 wks", s: "4 styles" },
    { r: 2, name: "Sustainable fashion", m: 87, g: "+38%", v: "67K", w: "5 wks", s: "7 styles" },
    { r: 3, name: "Athleisure", m: 82, g: "+32%", v: "54K", w: "9 wks", s: "12 styles" },
    { r: 4, name: "Minimalist style", m: 78, g: "+28%", v: "43K", w: "4 wks", s: "6 styles" },
    { r: 5, name: "Streetwear", m: 75, g: "+25%", v: "38K", w: "3 wks", s: "9 styles" },
  ];
  const sources = [
    { label: "Google Trends search volume", val: "89K", d: "+45%" },
    { label: "Retailer new arrivals", val: "312 SKUs", d: "+18%" },
    { label: "Social mention volume", val: "24K", d: "+52%" },
  ];
  const matches = [
    { id: "XXYY11-0", nm: "Midi Dress – Gathered Fit", se: "SS26", c: "Coral Pink", st: "68%" },
    { id: "XXYY12-0", nm: "Midi Dress – Long Sleeve", se: "SS26", c: "Sage", st: "54%" },
    { id: "XXYY13-0", nm: "V-Neck Dress", se: "FW25", c: "Elephant Blue", st: "71%" },
  ];
  // 6 months of momentum; rises then eases, matching the shipped chart's shape
  const pts = [14, 19, 26, 31, 29, 23];
  const maxY = 35;
  const path = pts.map((v, i) => `${(i / (pts.length - 1)) * 300},${70 - (v / maxY) * 62}`).join(" L ");

  return (
    <div style={{ background: TS.page, color: TS.ink }} className="w-full rounded-sm p-3 sm:p-4 text-[11px] leading-tight">
      {/* Header + query */}
      <div style={{ background: TS.card, borderColor: TS.line }} className="rounded-sm border p-3 mb-2.5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2.5">
          <span className="text-[13px] font-semibold tracking-tight">Trend signals</span>
          <span style={{ color: TS.muted }} className="text-[10px]">
            Sources: Google Trends · retailer new-arrival feeds · social mention volume
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <div style={{ borderColor: TS.line, color: TS.muted }} className="flex-1 min-w-[140px] rounded-sm border px-2 py-1.5">
            Search a category, fabric, or silhouette
          </div>
          {["Region: NA", "Window: 12 mo", "Category: Dresses"].map(f => (
            <div key={f} style={{ borderColor: TS.line, color: TS.ink2 }} className="rounded-sm border px-2 py-1.5 whitespace-nowrap">
              {f} <span style={{ color: TS.muted }}>▾</span>
            </div>
          ))}
          <div style={{ background: TS.accent }} className="rounded-sm px-3 py-1.5 text-white font-medium whitespace-nowrap">
            Run
          </div>
        </div>
      </div>

      {/* Ranked signals, with the index broken into its parts */}
      <div style={{ background: TS.card, borderColor: TS.line }} className="rounded-sm border p-3 mb-2.5 overflow-x-auto">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: TS.muted }}>
          Ranked signals
        </div>
        <table className="w-full min-w-[440px] border-collapse">
          <thead>
            <tr style={{ color: TS.muted }} className="text-left text-[10px]">
              {["#", "Signal", "Momentum", "Growth", "Volume", "Sustained", "In your line"].map(h => (
                <th key={h} style={{ borderColor: TS.line }} className="border-b pb-1.5 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {signals.map(s => (
              <tr key={s.r} style={{ borderColor: TS.line }} className="border-b last:border-0">
                <td style={{ color: TS.muted }} className="py-1.5 pr-2 tabular-nums">{s.r}</td>
                <td className="py-1.5 pr-2 font-medium whitespace-nowrap">{s.name}</td>
                <td className="py-1.5 pr-2">
                  <span style={{ background: TS.accentSoft, color: TS.accent }} className="rounded-sm px-1.5 py-0.5 font-semibold tabular-nums">
                    {s.m}
                  </span>
                </td>
                <td style={{ color: TS.pos }} className="py-1.5 pr-2 tabular-nums">{s.g}</td>
                <td className="py-1.5 pr-2 tabular-nums" style={{ color: TS.ink2 }}>{s.v}</td>
                <td className="py-1.5 pr-2 tabular-nums" style={{ color: TS.ink2 }}>{s.w}</td>
                <td className="py-1.5 whitespace-nowrap" style={{ color: TS.accent }}>{s.s}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* The shipped version showed a bare "95" with nothing to anchor it */}
        <p style={{ color: TS.muted }} className="text-[10px] mt-2 leading-snug">
          Momentum is search growth, absolute volume, and weeks sustained, normalised to 0–100 over the selected window.
          The three inputs stay on the row so the index can be argued with.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
        {/* Momentum curve + the editorial read */}
        <div style={{ background: TS.card, borderColor: TS.line }} className="rounded-sm border p-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: TS.muted }}>
              Vintage dresses, 6 months
            </span>
            <span style={{ color: TS.pos }} className="text-[11px] font-semibold tabular-nums">+42.5%</span>
          </div>
          <svg viewBox="0 0 300 80" className="w-full h-auto" preserveAspectRatio="none" aria-hidden="true">
            {[0, 20, 40, 60].map(y => (
              <line key={y} x1="0" y1={y + 8} x2="300" y2={y + 8} stroke={TS.line} strokeWidth="1" />
            ))}
            <path d={`M ${path} L 300,70 L 0,70 Z`} fill={TS.accent} fillOpacity="0.10" />
            <path d={`M ${path}`} fill="none" stroke={TS.accent} strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <div className="flex justify-between text-[9px] mt-1" style={{ color: TS.muted }}>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => <span key={m}>{m}</span>)}
          </div>
          <p className="text-[10px] mt-2 leading-snug" style={{ color: TS.ink2 }}>
            <span className="font-semibold">Read:</span> sustained six-week growth suggests a season-level shift, not a
            viral spike. Plan against it for SS26 rather than chasing it in-season.
          </p>
        </div>

        {/* Evidence, attributed rather than a mocked social post */}
        <div style={{ background: TS.card, borderColor: TS.line }} className="rounded-sm border p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: TS.muted }}>
            Signal sources
          </div>
          {sources.map(s => (
            <div key={s.label} style={{ borderColor: TS.line }} className="flex items-center justify-between gap-2 border-b last:border-0 py-2">
              <span style={{ color: TS.ink2 }} className="leading-snug">{s.label}</span>
              <span className="flex items-baseline gap-2 shrink-0">
                <span className="tabular-nums font-medium">{s.val}</span>
                <span style={{ color: TS.pos }} className="tabular-nums text-[10px]">{s.d}</span>
              </span>
            </div>
          ))}
          <p style={{ color: TS.muted }} className="text-[10px] mt-2 leading-snug">
            Each signal is traceable to a counted source. Nothing is asserted without one.
          </p>
        </div>
      </div>

      {/* The move that makes this belong in a PLM at all */}
      <div style={{ background: TS.card, borderColor: TS.line }} className="rounded-sm border p-3 mb-2.5 overflow-x-auto">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: TS.muted }}>
          Matching styles in your line
        </div>
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            <tr style={{ color: TS.muted }} className="text-left text-[10px]">
              {["Style #", "Name", "Season", "Colorway", "Sell-through"].map(h => (
                <th key={h} style={{ borderColor: TS.line }} className="border-b pb-1.5 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id} style={{ borderColor: TS.line }} className="border-b last:border-0">
                <td className="py-1.5 pr-2 tabular-nums" style={{ color: TS.accent }}>{m.id}</td>
                <td className="py-1.5 pr-2 whitespace-nowrap">{m.nm}</td>
                <td className="py-1.5 pr-2" style={{ color: TS.ink2 }}>{m.se}</td>
                <td className="py-1.5 pr-2" style={{ color: TS.ink2 }}>{m.c}</td>
                <td className="py-1.5 tabular-nums font-medium">{m.st}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No persona, no chat character: a query surface with real questions */}
      <div style={{ background: TS.card, borderColor: TS.line }} className="rounded-sm border p-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: TS.muted }}>
          Ask of the data
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            "Which SS26 styles map to rising signals?",
            "Where is olive trending against last season?",
            "Which signals have we no styles for?",
          ].map(q => (
            <span key={q} style={{ borderColor: TS.line, color: TS.ink2 }} className="rounded-sm border px-2 py-1">
              {q}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SurefrontCaseStudyBody() {
  return (
<>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Title, then the result. Impact leads: a reader who stops after
                  the first screen should still leave knowing how it landed and
                  which parts were mine. The narrative picks up below. */}
              <div className="lg:col-span-12">
                <div className="flex items-baseline gap-4 mb-8">
                  <span className={`${outfit.className} text-5xl font-light text-ink`}>03</span>
                  <span className="text-sm uppercase tracking-[0.2em] text-accent">CMU &times; Surefront</span>
                </div>
                <h2 className={`${outfit.className} text-3xl font-light text-ink mb-1`}>
                  Making PLM the place apparel teams actually work
                </h2>
                <p className="text-sm tracking-widest uppercase text-body">
                  2024 Winter – 2025 Summer &nbsp;·&nbsp; MHCI Capstone &nbsp;·&nbsp; UX Research &amp; Product Design
                </p>
              </div>

              {/* Outcome, moved above the narrative to lead with impact, and given
                  a panel of its own so it reads as the headline rather than as one
                  more row of body copy. Same panel vocabulary as The Problem box
                  below it, with the accent border doing the emphasis. */}
              <div className="lg:col-span-12 rounded-sm border border-accent/30 bg-panel-2 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-4 text-base text-body leading-relaxed">
                  <SectionLabel>Outcome</SectionLabel>
                  <p className="mb-4">
                    Designers and product developers scored the redesigned workflows four to five out of five on whether they would buy the software. Merchandisers described the line planner as strategic at a glance, and the concept campaign confirmed the demand independently of our interview pool.
                  </p>
                  <p>
                    We handed off a design system and implementation guidelines, feasibility ratings agreed with Surefront&rsquo;s engineer feature by feature, and a quarterly roadmap running from Q4 2025 to Q4 2026.
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      // Lead with the outcome, not the effort: the step collapse is the
                      // strongest number here. Co-design partners still appear in Research
                      // and in "How it was tested", so nothing is lost by demoting them.
                      { value: "19 \u2192 1", label: "Duplications per style" },
                      { value: "30+", label: "Interviews" },
                      { value: "11", label: "Usability sessions" },
                      { value: "4–5 / 5", label: "Would-buy score" },
                    ].map(({ value, label }) => (
                      <div key={label} className="rounded-sm border border-line bg-raised p-5">
                        <span className={`${outfit.className} block text-2xl md:text-3xl text-ink mb-2 whitespace-nowrap`}>{value}</span>
                        <span className="block text-sm uppercase tracking-[0.16em] text-meta leading-relaxed">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Left, framing */}
              <div className="lg:col-span-5 flex flex-col gap-8">
                <div>
                  <div className="space-y-6 text-base text-body leading-relaxed">
                    {/* The Problem */}
                    <div>
                      <SectionLabel>The Problem</SectionLabel>
                      <div className="bg-panel-2 rounded-sm p-6 border border-line">
                        <p className="mb-3">
                          Surefront&rsquo;s MerchOps platform served jewelry and furniture brands and wanted to enter apparel, a market where every team already owns a product lifecycle management tool and quietly works around it. Designers rebuilt the same product data by hand. Merchandisers ran entire seasons out of Excel and waited two to three weeks for product developers to migrate data out of the system that was supposed to hold it.
                        </p>
                        {/* Earlier versions, kept for comparison per Rina's request:
                            v1: "give apparel teams a reason to work inside the PLM instead of beside it."
                            v2: "merchandisers were tab-switching between Instagram, Google Trends,
                                 and the PLM to spot a trend. Put the trend inside the PLM so they
                                 didn't have to." — cut because the Trends module it refers to is not
                                 part of this case study, so the promise had no payoff below. */}
                        <p>
                          <span className="text-[var(--ink)] font-medium">Design challenge:</span> collapse the work that pushed teams out of the PLM in the first place, duplicating a style per variant, retyping shared data, and waiting on someone else to export a season.
                        </p>
                      </div>
                    </div>

                    <Hairline />

                    {/* My Role */}
                    <div>
                      <SectionLabel>My Role</SectionLabel>
                      <p>
                        Five-person MHCI capstone team, working directly with Surefront&rsquo;s product and engineering leads. My scope was three things. I owned primary research end to end, thirty-plus interviews, the study protocol, and synthesis. I owned the trend signals module below, from the tab-switching finding that justified it through to the shipped screens. And I led the coded analytics prototype, so the interaction patterns could be tested with merchandisers rather than described to them.
                      </p>
                    </div>

                    <Hairline />

                    {/* Research */}
                    <div>
                      <SectionLabel>Research</SectionLabel>
                      <ul className="space-y-4">
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
                          <span><span className="text-ink">Thirty-plus interviews</span> with designers, product developers, and merchandisers, followed by six card-sorting sessions that separated table stakes from switching triggers.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
                          <span><span className="text-ink">Eleven usability sessions</span> with practitioners averaging twelve years in apparel, three of them former PLM procurement decision-makers, run as think-aloud against interactive prototypes.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-accent shrink-0">·</span>
                          <span><span className="text-ink">Merchandisers were the hardest group to reach,</span> so we treated recruitment as a demand test: outreach to 250+ merchandisers, a concept landing page, and a paid campaign. Merchandisers and buyers clicked at the highest rate of any job title, and five became weekly co-design partners.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right, research exhibit then product imagery. The interviews
                  panel leads: it sits beside the Research column on the left, so
                  the two halves of the row cover the same beat before the page
                  moves on to what was designed. */}
              <div className="lg:col-span-7 space-y-4">
                {/* 481px source: rendering it wider only upscales an already small
                    export. Left-aligned in the column rather than stretched. */}
                <figure className="space-y-2 max-w-[481px]">
                  <div className="w-full overflow-hidden rounded-sm border border-accent/15 bg-raised">
                    <Image loading="lazy" src="/images/03/surefront/SurefrontInterviews.png" alt="Breakdown of thirty-plus research participants by role and company type, with averages for years of experience, in-house PLM selection team members, and PLM consultants" width={dimsOf("/images/03/surefront/SurefrontInterviews.png").w} height={dimsOf("/images/03/surefront/SurefrontInterviews.png").h} sizes="(max-width: 640px) 100vw, 481px" className="w-full h-auto opacity-95 hover:opacity-100 transition-opacity duration-400 ease-out" />
                  </div>
                  <figcaption className="text-sm text-meta leading-relaxed">
                    Who the thirty-plus interviews actually reached, by role and company type. Twelve years of experience on average, seven people who had sat on an in-house PLM selection team, and three consultants who run PLM selection and implementation for a living. Recruiting, protocol, and synthesis were mine.
                  </figcaption>
                </figure>

                <figure className="space-y-2">
                  {/* Annotated: the screenshot alone cannot say which parts are the
                      design decision and which were already there. Pins are
                      aria-hidden decoration; the numbered legend below carries the
                      text, so nothing is lost without them. Positions are % of the
                      image box, so they track it at every breakpoint. */}
                  <div className="relative w-full overflow-hidden rounded-sm border border-accent/15 bg-raised">
                    <Image loading="lazy" src="/images/03/surefront/surefront-lineplanning.jpg" alt="Line planning workspace showing season KPIs, style rows, and a merchant notes panel" width={dimsOf("/images/03/surefront/surefront-lineplanning.jpg").w} height={dimsOf("/images/03/surefront/surefront-lineplanning.jpg").h} sizes="(max-width: 1024px) 100vw, 60vw" className="w-full h-auto opacity-95 hover:opacity-100 transition-opacity duration-400 ease-out" />
                    {[
                      // Placed on labels and chrome, never on data: the KPI values,
                      // their targets, and every style row stay readable underneath.
                      { n: 1, left: "26%", top: "22%" },
                      { n: 2, left: "30%", top: "35.5%" },
                      { n: 3, left: "79%", top: "19%" },
                    ].map(({ n, left, top }) => (
                      <span
                        key={n}
                        aria-hidden="true"
                        style={{ left, top, background: "var(--mark-fill)", borderColor: "var(--mark-ring)", color: "var(--mark-glyph)" }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 grid h-5 w-5 md:h-6 md:w-6 place-items-center rounded-full border text-2xs md:text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                  <figcaption className="text-sm text-meta leading-relaxed">
                    Line planning: assortment, targets, and merchant intent in one editable view, replacing the line sheet and spreadsheet pair.
                  </figcaption>
                  <ol className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 pt-1">
                    {[
                      "Season targets sit on the plan itself, so net sales, cost, and margin are read against goal rather than in a separate sheet.",
                      "Assortment and line sheet collapsed into one editable table, the pair merchandisers previously kept in parallel.",
                      "Merchant intent, notes and focus colours, captured beside the assortment it refers to instead of in email.",
                    ].map((text, i) => (
                      <li key={i} className="flex gap-2 text-sm text-body leading-snug">
                        <span className="text-accent shrink-0 tabular-nums">{i + 1}</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ol>
                </figure>

                {/* Full width, not the old two-up: at half column these read as
                    texture rather than as screens anyone can inspect. */}
                <figure className="space-y-2">
                  <div className="w-full overflow-hidden rounded-sm border border-accent/15 bg-raised">
                    <Image loading="lazy" src="/images/03/surefront/surefront-library.jpg" alt="Centralized fabric library with filters and coded material records" width={dimsOf("/images/03/surefront/surefront-library.jpg").w} height={dimsOf("/images/03/surefront/surefront-library.jpg").h} sizes="(max-width: 1024px) 100vw, 60vw" className="w-full h-auto opacity-95 hover:opacity-100 transition-opacity duration-400 ease-out" />
                  </div>
                  <figcaption className="text-sm text-meta leading-relaxed">
                    Centralized libraries: fabrics, colors, components, and measurement sheets as reusable records.
                  </figcaption>
                </figure>
              </div>

              {/* Trend signals: the module that started the whole thesis, shown as
                  it shipped and as it should have been. Kept honest — the revision
                  is labelled as a revision, not passed off as delivered work. */}
              <div className="lg:col-span-12 pt-16">
                <SectionLabel>Trend Signals</SectionLabel>

                <p className={`${outfit.className} text-2xl md:text-3xl font-light text-ink leading-snug max-w-3xl mb-4`}>
                  Merchandisers were spotting trends in three tabs, none of them the PLM.
                </p>
                <p className="text-base text-body leading-relaxed max-w-2xl mb-10">
                  Instagram for what people were wearing, Google Trends for whether it was growing, then the PLM to see
                  whether they had anything like it. The trend and the line lived in different tools, so the answer to
                  &ldquo;should we make this&rdquo; was assembled by hand every time. This module put the signal next to
                  the catalogue it applies to.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  <div className="lg:col-span-4">
                    <figure className="space-y-2 max-w-[346px]">
                      <div className="w-full overflow-hidden rounded-sm border border-line bg-raised">
                        <Image loading="lazy" src="/images/03/surefront/trend_forecasting_dashboard 1.png" alt="The trend dashboard as shipped, with a purple gradient background, a mocked social post, and a product tile with a retail price" width={dimsOf("/images/03/surefront/trend_forecasting_dashboard 1.png").w} height={dimsOf("/images/03/surefront/trend_forecasting_dashboard 1.png").h} sizes="(max-width: 640px) 100vw, 346px" className="w-full h-auto opacity-95 hover:opacity-100 transition-opacity duration-400 ease-out" />
                      </div>
                      <figcaption className="text-sm text-meta leading-relaxed">
                        <span className="text-ink">As shipped.</span> It works, and it tested well on comprehension. It also
                        reads as a shopping app: a consumer gradient, a mocked influencer post, and a product tile with a
                        retail price, in a tool whose users are merchandisers and product developers.
                      </figcaption>
                    </figure>
                  </div>

                  <div className="lg:col-span-8">
                    <figure className="space-y-2">
                      <div className="w-full overflow-hidden rounded-sm border border-accent/15 bg-raised p-2 sm:p-3">
                        <TrendSignalsMock />
                      </div>
                      <figcaption className="text-sm text-meta leading-relaxed">
                        <span className="text-ink">Revision, not delivered work.</span> Same data, same module, rebuilt in the
                        register its users actually work in. Built in code rather than redrawn as an image, so it stays sharp
                        at any size and follows the page rather than sitting on it as a screenshot.
                      </figcaption>
                    </figure>
                  </div>
                </div>

                <div className="pt-10">
                  <span className="block text-sm uppercase tracking-[0.16em] text-meta mb-4">What changed, and why</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                    {[
                      ["A score with nothing behind it", "The shipped version showed a bare 95 and asked to be trusted. Momentum now states its inputs, growth, volume, and weeks sustained, keeps all three on the row, and says how they combine. A number a merchandiser cannot argue with is a number they will not act on."],
                      ["A price tag, in a PLM", "The $89.99 product tile answered a shopper's question. Merchandisers are asking whether they already carry anything like this, so it became matching styles in your line, with style number, season, colourway, and sell-through. This is the whole argument for putting trends inside the PLM rather than beside it."],
                      ["Invented social proof", "A mocked @handle with likes and comments is evidence of nothing, and it invites the reader to check whether the account is real. Replaced with counted, attributed sources."],
                      ["A persona nobody asked for", "\u201cPersonal Fashion Assistant\u201d framed a merchandising tool as a companion app. The queries underneath were the useful part, so they stayed and the character went."],
                      ["Data with no reading", "The growth curve showed a shape and left the interpretation to the viewer. It now carries the read: sustained six-week growth is a season-level shift, and should be planned against rather than chased in-season."],
                      ["Consumer skin on an enterprise tool", "The purple gradient set an expectation the rest of the platform does not meet. The revision uses the product's own neutral surface, so the module looks like it belongs in the PLM the rest of this case study is about."],
                    ].map(([h, body]) => (
                      <div key={h}>
                        <span className="block text-ink mb-1.5">{h}</span>
                        <p className="text-base text-body leading-relaxed">{body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full width, design decisions */}
              <div className="lg:col-span-12 pt-16">
                <SectionLabel>Design Decisions</SectionLabel>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  <div className="lg:col-span-7">
                    <figure className="space-y-2">
                      <div className="w-full overflow-hidden rounded-sm border border-line bg-white/[0.96] p-3">
                        <Image loading="lazy" src="/images/03/surefront/surefront-style-flow.png" alt="Before and after diagram of style creation, from four steps repeated per variant to a maximum of two" width={dimsOf("/images/03/surefront/surefront-style-flow.png").w} height={dimsOf("/images/03/surefront/surefront-style-flow.png").h} sizes="(max-width: 1024px) 100vw, 60vw" className="w-full h-auto" />
                      </div>
                      <figcaption className="text-sm text-meta leading-relaxed">
                        Creating a jacket in five sizes and four colors meant duplicating the base product nineteen times and relinking every child. Restructured into one variant-set step, with per-variant editing only where something genuinely differs.
                      </figcaption>
                    </figure>

                    {/* The diagram above claims the collapse; this shows it happening.
                        Nineteen -> one is the headline stat now, so it should not rest
                        on a before/after drawing alone. Same preload="none" + poster
                        treatment as the analytics clip: nothing ships until play. */}
                    <figure className="space-y-2 pt-6">
                      <div className="w-full overflow-hidden rounded-sm border border-accent/15 bg-raised">
                        <video
                          controls
                          preload="none"
                          playsInline
                          poster="/images/03/surefront/style-creation-poster.jpg"
                          className="w-full h-auto block"
                        >
                          <source src="/images/03/surefront/style-creation.mp4" type="video/mp4" />
                          Your browser does not support embedded video. The clip shows one style being
                          created with every size and colour variant selected in a single pass.
                        </video>
                      </div>
                      <figcaption className="text-sm text-meta leading-relaxed">
                        One pass, every variant. Sizes and colours are multi-selected on the style itself, and fabric, finish, and the measurement sheet are pulled from the centralized libraries rather than retyped, which is the second decision below doing the work that makes the first one possible.
                      </figcaption>
                    </figure>
                  </div>

                  <div className="lg:col-span-5 space-y-6 text-base text-body leading-relaxed">
                    <div>
                      <span className="block text-ink mb-1.5">Collapse the work, not the control</span>
                      <p>
                        Variant creation went from three-plus-N steps to a maximum of two. The second step stays optional, because the exceptions, a different fabric, price, or measurement, are exactly where designers still want to be in the details.
                      </p>
                    </div>
                    <div>
                      <span className="block text-ink mb-1.5">Make shared data a record, not a field</span>
                      <p>
                        Fabrics, colors, components, and measurement sheets became centralized libraries. It removes retyping, and it is also the structural precondition for analytics: you can only ask which materials sell once materials are consistently defined.
                      </p>
                    </div>
                    <div>
                      <span className="block text-ink mb-1.5">Design for the user no PLM serves</span>
                      <p>
                        A competitive review against CentricPLM, FlexPLM, and Excel showed strategic line planning unaddressed everywhere. We paired a stacked bar chart with the catalogue on one screen so merchandisers never lose the products behind the numbers, and gave line planning embedded targets for net sales, cost, and margin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deep dive: the analytics module, and the version of it that failed.
                  Every figure and quote below is drawn from the Surefront x CMU
                  summer report, Jan-Aug 2025. Placed before Outcome: this is the
                  design story, so it should not read as an appendix to the result. */}
              <div className="lg:col-span-12 pt-16">
                <SectionLabel>Analytics Dashboard</SectionLabel>

                <p className={`${outfit.className} text-2xl md:text-3xl font-light text-ink leading-snug max-w-3xl mb-4`}>
                  Merchandisers said they would switch PLM for this one feature.
                </p>
                <p className="text-base text-body leading-relaxed max-w-2xl mb-12">
                  Past-season analysis was happening off-platform, or not at all. Merchandisers waited two to three
                  weeks for a product developer to migrate data out of the PLM into Excel before they could judge
                  whether a season was balanced.
                </p>

                {/* Capped at 545px: the source is 1089px wide, so anything larger
                    is upscaling on a 2x display, and this is dense UI where the
                    legibility is the whole point. */}
                <figure className="space-y-2 mb-10 max-w-[545px]">
                  <div className="w-full overflow-hidden rounded-sm border border-accent/15 bg-raised">
                    <Image loading="lazy" src="/images/03/surefront/surefront-analytics.jpg" alt="Analytics dashboard with a stacked bar chart bound to the product catalogue" width={dimsOf("/images/03/surefront/surefront-analytics.jpg").w} height={dimsOf("/images/03/surefront/surefront-analytics.jpg").h} sizes="(max-width: 640px) 100vw, 545px" className="w-full h-auto opacity-95 hover:opacity-100 transition-opacity duration-400 ease-out" />
                  </div>
                  <figcaption className="text-sm text-meta leading-relaxed">
                    Version two: the chart and the catalogue on one screen, so a filter is always visibly acting on the products behind the numbers.
                  </figcaption>
                </figure>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <blockquote className="border-l border-accent pl-5">
                      <p className="text-base text-body leading-relaxed italic">
                        &ldquo;Past sales analysis happens off-PLM or not at all. If it had that, I&rsquo;d put it at
                        the top. I would switch today if the software had this feature.&rdquo;
                      </p>
                      <cite className="not-italic block text-xs uppercase tracking-[0.16em] text-meta mt-3">
                        Merchandiser, usability session
                      </cite>
                    </blockquote>

                    <div>
                      <span className="block text-sm uppercase tracking-[0.16em] text-meta mb-2">
                        What the first version got wrong
                      </span>
                      <p className="text-base text-body leading-relaxed">
                        Version one put analytics beside the catalogue but kept the two separate. Testing killed it
                        for two specific reasons. Merchandisers would not trust a filter they could not watch act on
                        the products, and two-dimensional charts could not carry the three dimensions their pivot
                        tables already gave them. Version two bound the chart to the catalogue and added the third axis.
                      </p>
                    </div>

                    {/* The coded prototype, version two. A still cannot show a filter
                        acting on the products, which is the whole thing testing said
                        version one failed at, so this claim is carried by the clip.
                        preload="none" keeps the 9.9MB off the initial page load: the
                        poster is all that ships until someone presses play. */}
                    <figure className="space-y-2 pt-2">
                      <div className="w-full overflow-hidden rounded-sm border border-accent/15 bg-raised">
                        <video
                          controls
                          preload="none"
                          playsInline
                          poster="/images/03/surefront/analytics-prototype-poster.jpg"
                          className="w-full h-auto block"
                        >
                          <source src="/images/03/surefront/analytics-prototype.mp4" type="video/mp4" />
                          Your browser does not support embedded video. The clip shows filters in the
                          coded analytics prototype updating the product catalogue and the stacked chart together.
                        </video>
                      </div>
                      <figcaption className="text-sm text-meta leading-relaxed">
                        Version two, running. Filter chips narrow the catalogue and the chart at the same time, and
                        Stack&nbsp;By adds the third dimension that flat charts could not carry. Coded prototype, mine.
                      </figcaption>
                    </figure>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    {[
                      { value: "2\u20133 wks", label: "Wait for a season\u2019s data, before" },
                      { value: "Q1\u2013Q3 2026", label: "Analytics milestones on Surefront\u2019s roadmap" },
                      { value: "2", label: "Coded prototype rounds with merchandisers" },
                      // Placeholder: exact split TBD, confirm before shipping.
                      { value: "9 \u00b7 6 \u00b7 3", label: "[Placeholder] Companies \u00b7 verticals \u00b7 countries in the research pool" },
                    ].map(({ value, label }) => (
                      <div key={label} className="rounded-sm border border-line bg-raised p-5">
                        <span className={`${outfit.className} block text-2xl text-ink mb-2`}>{value}</span>
                        <span className="block text-sm uppercase tracking-[0.16em] text-meta leading-relaxed">{label}</span>
                      </div>
                    ))}

                    <div className="rounded-sm border border-line bg-panel-2 p-5 text-base text-body leading-relaxed">
                      <span className="block text-sm uppercase tracking-[0.16em] text-meta mb-2">How it was tested</span>
                      Eleven think-aloud sessions with designers and product developers averaging twelve years in
                      apparel, plus co-design with five merchandisers. Demand for the merchandiser segment was tested
                      separately with LinkedIn ads, where merchandiser, buyer, and IT manager titles clicked through
                      at materially higher rates than other job titles.
                    </div>
                  </div>
                </div>
              </div>
              {/* Closes the case study. The result is at the top now, so what is
                  still unsolved is the honest note to end on. */}
              <div className="lg:col-span-12 pt-20 border-t border-line-strong mt-16">
                <div className="lg:w-7/12">
                  <SectionLabel>Left open</SectionLabel>
                  <p className="text-base text-body leading-relaxed">
                    Pivot-table depth, libraries that differ company to company, and migrating legacy data from systems that all report their numbers differently. Each is named in the handoff rather than designed around.
                  </p>
                </div>
              </div>

            </div></>

            );
}

export default function RinasPortfolio() {
  const [activeFilter, setActiveFilter] = useState<Category | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; scale: number; rotation: number; fill: string; highlight: string; outline: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<GridItem | null>(null);

  // Filtered list mirrors what's rendered in the grid, used for modal prev/next
  const filteredProjects = activeFilter === null
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(item => item.categories.includes(activeFilter));
  const selectedIndex = selectedProject
    ? filteredProjects.findIndex(p => p.alt === selectedProject.alt)
    : -1;

  const handleAddHearts = () => {
    const newHearts = Array.from({ length: 4 }).map((_, i) => {
      // Warm yellow shades to coordinate beautifully with the rose bouquet
      const baseYellows = ["#facc15", "#fde047", "#eab308", "#ca8a04", "#b45309"];
      const highlights = ["#fef08a", "#fef9c3", "#fef08a", "#fde047", "#ca8a04"];

      const idx = Math.floor(Math.random() * baseYellows.length);
      const randomFill = baseYellows[idx];
      const randomHighlight = highlights[idx];

      // Ring distribution so they spawn AROUND the main center heart, not on top of it!
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 100; // 40px to 140px away from center
      const randomX = Math.cos(angle) * distance * 1.8; // stretched horizontally to the sides!
      const randomY = Math.sin(angle) * distance * 0.65 - 10; // flatter vertically to avoid overlapping headers/footers!

      const randomScale = 0.45 + Math.random() * 0.65; // scales dynamically from 0.45 (tiny) to 1.1 (slightly larger) for beautiful depth!
      const randomRotation = (Math.random() - 0.5) * 40; // natural random tilt

      return {
        id: Date.now() + Math.random() + i,
        x: randomX,
        y: randomY,
        scale: randomScale,
        rotation: randomRotation,
        fill: randomFill,
        highlight: randomHighlight,
        outline: "#b45309"
      };
    });
    setHearts((prev) => [...prev, ...newHearts]);
  };

  const filterBarRef = useRef<HTMLDivElement>(null);
  // The bar's hard 1px bottom border marked where it ends regardless of
  // whether it's actually floating over anything yet. `sticky` only starts
  // overlapping content once it's clamped to top:0 — before that it's still
  // in normal flow, nothing is passing underneath it. isStuck distinguishes
  // the two states, so the fade (added below) only appears once there's
  // something for it to be a scroll edge over.
  const [filterBarStuck, setFilterBarStuck] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const el = filterBarRef.current;
      if (!el) return;
      setFilterBarStuck(el.getBoundingClientRect().top <= 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  // Dropping the dot only bought back ~90px against a 93px overflow — 3px
  // short, confirmed both in measurement and in a real browser, so it still
  // wrapped. The pill row scrolls horizontally instead, with a trailing fade
  // (§12: scroll edge effects, not a hard cutoff) that only shows when there
  // is actually more to scroll to.
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [filterOverflows, setFilterOverflows] = useState(false);
  useEffect(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    const check = () => setFilterOverflows(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    /* mobile fix: MotionConfig reducedMotion="user" makes every motion.* respect prefers-reduced-motion */
    <MotionConfig reducedMotion="user">
      <div
        // Light mode is built (see the palette in globals.css) but parked for
        // now: <html data-theme="dark"> in layout.tsx is the single switch, so
        // the root background and the overscroll bounce match the page.
        style={{ background: "var(--ground)", color: "var(--body)" }}
        className={`${sans.className} min-h-screen selection:bg-accent-deep selection:text-ground transition-colors duration-400`}
      >
        <ScrollNav />
        <BackToTopButton />

        {/* Subtle material texture overlay */}
        <div className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* ─── Header ─── */}
        {/* mobile fix: tighter horizontal + top padding on phones */}
        <header className="px-5 sm:px-8 md:px-16 pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-16 max-w-[1600px] mx-auto">
          <motion.div initial="hidden" animate="visible" variants={slowFade}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-baseline gap-6 mb-6 flex-wrap sm:flex-nowrap">
                <h1 className={`${outfit.className} text-5xl md:text-7xl font-light text-ink tracking-tight`}>
                  Rina Kim
                </h1>
                {/* mobile fix: bigger tap target (≥40px tall via py-2.5 + min-h on phones) and slightly larger label */}
                <a
                  href="/images/Resume_RinaKim.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 lg:px-3.5 py-2.5 lg:py-1.5 min-h-[40px] lg:min-h-0 rounded-sm text-xs lg:text-2xs font-semibold uppercase tracking-[0.15em] border transition-all duration-250 active:scale-[0.96] active:duration-150 cursor-pointer relative -translate-y-0 lg:-translate-y-[9px]
                  bg-btn-face text-body border-accent-deep/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:bg-accent-deep hover:text-ground hover:border-accent-deep hover:shadow-[0_0_15px_rgba(179,157,130,0.35)] shrink-0"
                >
                  <span className="pl-[0.15em] text-center">Resume</span>
                </a>
              </div>
              <p className="text-sm tracking-[0.15em] uppercase text-[var(--meta)] mb-2">
                <span className="font-semibold text-[var(--body)]">Product Designer</span>, UX/UI Design ·{" "}
                <button
                  type="button"
                  onClick={() => document.getElementById("selected-projects")?.scrollIntoView({ behavior: "smooth" })}
                  aria-label="Jump to Selected Projects"
                  className="relative inline cursor-pointer uppercase tracking-[0.15em] transition-all duration-400 ease-out active:opacity-60 active:duration-150
                  hover:text-[var(--ink)]
                  hover:[text-shadow:0_0_8px_rgba(234,234,234,0.45),0_0_18px_rgba(201,180,154,0.25)]"
                >
                  Prototyping
                </button>
                {" "}· Systems Thinking
              </p>
              <p className="text-base text-[var(--body)] leading-relaxed max-w-xl mt-6">
                Masters in Human-Computer Interaction from <span className="text-[var(--ink)] font-medium">Carnegie Mellon University</span>.
                Previously at <span className="text-[var(--ink)] font-medium">BMW Group Technology Office</span>.
                Specializing in Automotive HMI, Interface Design, and Rapid Prototyping that bridge research and production.
              </p>
            </div>
            <div className="text-right text-sm leading-relaxed text-body">
            </div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={lineReveal}
            className="w-full h-[1px] bg-gradient-to-r from-accent-deep/40 via-accent-deep/10 to-transparent" />
        </header>

        {/* mobile fix: reduce side padding + section spacing on phones (was 32px/160px, now 20px/64px) */}
        <main className="max-w-[1600px] mx-auto px-5 sm:px-8 md:px-16 pb-16 sm:pb-24 md:pb-32 space-y-16 sm:space-y-24 md:space-y-40">

          {/* ─── Selected Projects (notched article cards, opens the page) ─── */}
          <section id="selected-projects">
            <h2 className={`${outfit.className} text-3xl md:text-4xl font-light text-[var(--ink)] mb-3`}>
              Selected Projects
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-10 max-w-xl">
              Three I&rsquo;d want to talk through. Each one opens up in full below.
            </p>
            <CaseStudyCards items={CASE_STUDIES} outfitClass={outfit.className} />
          </section>

          {/* The three long-form case studies are not rendered inline any more.
              Each one opens from its card above via CaseStudyDetail, so the
              BMW / SmaSH / Surefront bodies have exactly one render site. */}

          {/* ─── More Projects Header + Sticky Filter Bar (grouped so they sit close together, independent of the section rhythm above) ─── */}
          {/* Addressable: this is the largest section on the page and the nav
              had no entry for it, so scrollspy reported "Selected Projects"
              as active for the whole archive. */}
          <div id="more-projects">
            {/* Left-aligned heading + muted subtitle, matching every other
                section on the page (see Selected Projects above) instead of
                being the one centered exception. The kaomoji moves into the
                subtitle at paragraph scale — a signature, not a headline —
                which also takes it out of the <h2>'s accessible name, where
                a screen reader was announcing the literal glyph as the
                heading itself. */}
            {/* pb-4, not pb-14. The filter operates on what this heading
                introduces, so it reads as part of the header group — 16px here
                plus the bar's own 16px padding puts the pills 32px under the
                subtitle. The 112px break below the bar then does the
                separating, so the asymmetry says "controls belong up here,
                content starts down there" (§16 Grouping). */}
            <div className="pt-48 pb-4">
              <h2 className={`${outfit.className} text-3xl md:text-4xl font-light text-ink mb-3`}>
                More things I built
              </h2>
              <p className="text-sm text-muted leading-relaxed max-w-xl">
                {ALL_PROJECTS.length} projects from coursework, hackathons, and independent study.{" "}
                <span className="text-meta">＿〆(。╹‿ ╹ 。)</span>
              </p>
            </div>

            {/* ─── Sticky Filter Bar ──────────────────────────────────────────── */}
            <div
              ref={filterBarRef}
              className="sticky top-0 z-40 -mx-8 md:-mx-16 px-8 md:px-16 py-4"
              style={{ background: "var(--bar-bg)", backdropFilter: "blur(14px)" }}
            >
              {/* Scroll edge, not a hard divider (§12) — a soft fade where the
                  floating bar actually overlaps content, instead of a line
                  that was there whether or not anything was underneath it. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-8 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(to bottom, var(--bar-bg), transparent)",
                  opacity: filterBarStuck ? 1 : 0,
                }}
              />
              {/* Pills wrap among themselves; the count sits on its own row
                  below rather than sharing this one. ml-auto inside a
                  flex-wrap row re-anchors to whatever row it lands on, so a
                  lightly populated wrapped row (e.g. one pill alone) stranded
                  the count in a huge empty gap next to it. Two intentional
                  rows instead of one that wraps unpredictably. */}
              <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {/* Label — pinned outside the scroller, not part of what scrolls */}
                <span className="text-sm uppercase tracking-[0.2em] text-meta shrink-0">Filter</span>
                <div
                  ref={filterScrollRef}
                  className="flex items-center gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                  style={{
                    scrollbarWidth: "none",
                    maskImage: filterOverflows ? "linear-gradient(to right, black calc(100% - 40px), transparent)" : undefined,
                    WebkitMaskImage: filterOverflows ? "linear-gradient(to right, black calc(100% - 40px), transparent)" : undefined,
                  }}
                >
                  {/* All pill */}
                  {/* mobile fix: All-pill tap target matches category pills (≥40px on phones) */}
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="flex items-center pl-4 pr-4 py-2.5 lg:py-1.5 min-h-[40px] lg:min-h-0 shrink-0 rounded-full text-sm font-medium tracking-wide border transition-all duration-250 active:scale-[0.96] active:duration-150 cursor-pointer whitespace-nowrap"
                    style={activeFilter === null
                      ? { background: "var(--fill-strong)", borderColor: "var(--line-strong)", color: "var(--ink)" }
                      : { background: "var(--fill-soft)", borderColor: "var(--line)", color: "var(--muted)" }
                    }
                  >
                    All
                  </button>
                  {/* Category pills */}
                  {ALL_CATEGORIES.map((cat) => (
                    <FilterCategoryButton
                      key={cat}
                      cat={cat}
                      isActive={activeFilter === cat}
                      onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
                    />
                  ))}
                </div>
              </div>

              {/* Filtering used to happen in silence — the grid just became
                  shorter. This answers "what's there?" for everyone, and
                  role="status" means the count is announced, not just seen.
                  Its own row, right-aligned against the full bar width, not
                  against whatever pill row it happens to trail. */}
              <div className="flex justify-end">
                <span
                  role="status"
                  aria-live="polite"
                  className="text-sm text-meta tabular-nums"
                >
                  {filteredProjects.length}{filteredProjects.length === 1 ? " project" : " projects"}
                </span>
              </div>
              </div>

            </div>

            {/* ─── Project archive (grouped with the header + filter bar above so the section rhythm doesn't reintroduce the gap) ─── */}
            <section className="pt-28">
              {/* mobile fix: stack 2 thumbs per row on phones, 4 on small tablets, 6 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((item) => (
                    <FilteredThumb
                      key={item.alt}
                      item={item}
                      activeFilter={activeFilter}
                      outfitClass={outfit.className}
                      onOpen={setSelectedProject}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* ─── About Me & Footer Transition ─── */}
          {/* mobile fix: section negative margin matches main padding; vertical padding scales down on phones */}
          <section id="about-me" className="-mx-5 sm:-mx-8 md:-mx-16 relative pt-20 sm:pt-32 md:pt-48 pb-16 sm:pb-24 md:pb-32 overflow-hidden flex flex-col items-center">

            {/* Font Import for Pixel Text */}
            <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');" }} />

            {/* Black Background */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-ground transition-colors duration-400" />

            {/* Pixel Stars Overlay
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `url("data:image/svg+xml,%3Csvg width='240' height='240' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 30h1v1h-1zM110 200h1v1h-1zM10 100h1v1h-1z' fill='%23ffffff' fill-opacity='0.3'/%3E%3Cpath d='M140 60h2v2h-2zM80 150h2v2h-2zM210 180h2v2h-2z' fill='%23ffffff' fill-opacity='0.5'/%3E%3Cpath d='M170 110h3v3h-3z' fill='%23ffffff' fill-opacity='0.8'/%3E%3C/svg%3E")`,
              backgroundSize: "240px 240px",
              imageRendering: "pixelated"
            }}
          /> */}

            {/* About Me Title */}
            {/* mobile fix: tighten container padding and inner gap on phones */}
            <div className="relative z-10 w-full max-w-[1600px] px-5 sm:px-8 md:px-10 flex flex-col items-center justify-center pt-12 sm:pt-20 md:pt-24 pb-16 sm:pb-24 md:pb-32">
              {/* mobile fix: smaller pixel headline so the 320px viewport doesn't push it off the title baseline */}
              <h2 className="text-xl sm:text-2xl md:text-4xl text-ink tracking-widest [text-shadow:4px_4px_0_var(--line-strong)]" style={{ fontFamily: "'Press Start 2P', cursive", imageRendering: "pixelated" }}>
                About Me
              </h2>
            </div>

            {/* ─── Contact Footer ─── */}
            {/* mobile fix: tighter side padding so the contact board image fills more of the phone screen */}
            <footer id="project-meet" className="relative z-10 w-full max-w-[1600px] px-4 sm:px-8 md:px-16 flex justify-center">
              <div className="relative w-full max-w-3xl mx-auto group">
                <Image loading="lazy" src="/images/NiceToMeetYou/myboard.png" alt="My Contact Board" width={dimsOf("/images/NiceToMeetYou/myboard.png").w} height={dimsOf("/images/NiceToMeetYou/myboard.png").h} sizes="(max-width: 1024px) 100vw, 768px" className="w-full h-auto object-contain rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.6)]" />

                {/* Gmail Hover Area */}
                <div
                  className="absolute z-20 block group/gmail cursor-pointer"
                  style={{ left: '26.5%', top: '15.5%', width: '10.5%', height: '10.5%' }}
                  onClick={() => {
                    navigator.clipboard.writeText("by.rinakim@gmail.com");
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2000);
                  }}
                >
                  {/* Distinctive hover outline */}
                  <div className="w-full h-full rounded-sm border-4 border-transparent group-hover/gmail:border-black/30 group-hover/gmail:bg-fill group-hover/gmail:scale-110 group-active/gmail:scale-100 transition-all duration-250 group-active/gmail:duration-150" />

                  {/* Copy/Pasteable Tooltip */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6 pointer-events-none opacity-0 group-hover/gmail:opacity-100 group-hover/gmail:pointer-events-auto group-hover/gmail:translate-x-2 transition-all duration-250 z-50">
                    <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                      <p className={`${copiedEmail ? "text-green-500" : "text-black"} text-sm font-bold whitespace-nowrap mb-2`} style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                        {copiedEmail ? "Copied!" : "Click to copy!"}
                      </p>
                      <a href="mailto:by.rinakim@gmail.com" className="block text-gray-500 hover:text-black active:opacity-60 active:duration-150 transition-colors duration-250 select-all cursor-pointer font-bold"
                        style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", fontSize: "var(--text-xs)" }}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigator.clipboard.writeText("by.rinakim@gmail.com");
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 2000);
                        }}>
                        by.rinakim@gmail.com
                      </a>

                      {/* Bubble tail left */}
                      <div className="absolute -left-[16px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-black" />
                      <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-white" />
                    </div>
                  </div>
                </div>

                {/* LinkedIn Link */}
                <a
                  href="https://www.linkedin.com/in/rina-kim-9a3864171/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute z-10 block group/linkedin"
                  style={{ left: '26.5%', top: '28.5%', width: '10.5%', height: '10.5%' }}
                  aria-label="LinkedIn Profile"
                >
                  <div className="w-full h-full rounded-sm border-4 border-transparent group-hover/linkedin:border-black/30 group-hover/linkedin:bg-fill group-hover/linkedin:scale-110 group-active/linkedin:scale-100 transition-all duration-250 group-active/linkedin:duration-150 cursor-pointer" />
                  {/* Tooltip */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6 pointer-events-none opacity-0 group-hover/linkedin:opacity-100 group-hover/linkedin:translate-x-2 transition-all duration-250 z-50">
                    <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                      <p className="text-black text-sm font-bold whitespace-nowrap" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                        Connect with me!
                      </p>

                      {/* Bubble tail left */}
                      <div className="absolute -left-[16px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-black" />
                      <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-white" />
                    </div>
                  </div>
                </a>

                {/* Nana Polaroid Hover */}
                <div
                  className="absolute z-10 block cursor-pointer group/nana"
                  style={{ left: '38%', top: '35%', width: '14.5%', height: '25%' }}
                >
                  <div className="w-full h-full rounded-sm group-hover/nana:bg-fill group-active/nana:scale-95 transition-all duration-250 group-active/nana:duration-150" />
                  {/* Pop-out image */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[240px] sm:w-[320px] pointer-events-none opacity-0 group-hover/nana:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                    <div className="relative rounded-sm border-[6px] border-[#F2F0E6] bg-[#F2F0E6] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden p-1 pb-12 transform -rotate-2">
                      <Image loading="lazy" src="/images/NiceToMeetYou/nana01.jpg" alt="Nana" width={dimsOf("/images/NiceToMeetYou/nana01.jpg").w} height={dimsOf("/images/NiceToMeetYou/nana01.jpg").h} sizes="320px" className="w-full h-auto object-cover border border-black/10" />
                      <p className="absolute bottom-3 left-0 w-full text-center text-[#333] font-medium text-lg" style={{ fontFamily: "'Marker Felt', 'Comic Sans MS', cursive" }}>Nana</p>
                    </div>
                  </div>
                </div>

                {/* Cortada Polaroid Hover */}
                <div
                  className="absolute z-10 block cursor-pointer group/cortada"
                  style={{ left: '50.5%', top: '16.5%', width: '15.5%', height: '24%' }}
                >
                  <div className="w-full h-full rounded-sm group-hover/cortada:bg-fill group-active/cortada:scale-95 transition-all duration-250 group-active/cortada:duration-150" />
                  {/* Pop-out image */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[240px] sm:w-[320px] pointer-events-none opacity-0 group-hover/cortada:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                    <div className="relative rounded-sm border-[6px] border-[#F2F0E6] bg-[#F2F0E6] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden p-1 pb-12 transform rotate-2">
                      <Image loading="lazy" src="/images/NiceToMeetYou/cortada01.JPEG" alt="Cortada" width={dimsOf("/images/NiceToMeetYou/cortada01.JPEG").w} height={dimsOf("/images/NiceToMeetYou/cortada01.JPEG").h} sizes="320px" className="w-full h-auto object-cover border border-black/10" />
                      <p className="absolute bottom-3 left-0 w-full text-center text-[#333] font-medium text-lg" style={{ fontFamily: "'Marker Felt', 'Comic Sans MS', cursive" }}>Cortada</p>
                    </div>
                  </div>
                </div>

                {/* Pennant Hover */}
                <div
                  className="absolute z-10 block group/pennant"
                  style={{ left: '68%', top: '9%', width: '28%', height: '18%' }}
                >
                  <div className="w-full h-full rounded-sm group-hover/pennant:bg-fill-soft transition-colors duration-250 cursor-help" />

                  {/* Pixelated thought bubble */}
                  <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/pennant:opacity-100 group-hover/pennant:-translate-y-3 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                      <p className="text-black text-sm font-bold whitespace-nowrap text-center" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                        CMU MHCI &apos;25!
                      </p>
                      {/* Bubble tail */}
                      <div className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black" />
                      <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white" />
                    </div>
                  </div>
                </div>

                {/* Bouquet Hover */}
                <div
                  className="absolute z-10 block group/bouquet"
                  style={{ left: '16%', top: '32%', width: '22%', height: '48%' }}
                >
                  <div className="w-full h-full rounded-sm group-hover/bouquet:bg-fill-soft transition-colors duration-250 cursor-help" />

                  {/* Pixelated thought bubble floating to the left */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-6 pointer-events-none opacity-0 group-hover/bouquet:opacity-100 group-hover/bouquet:-translate-x-2 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50">
                    <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                      <p className="text-[#b45309] text-base font-bold whitespace-nowrap text-center" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>
                        &lt;3
                      </p>
                      {/* Bubble tail right */}
                      <div className="absolute -right-[16px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-black" />
                      <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-white" />
                    </div>
                  </div>
                </div>

                {/* 3D Printer Hover */}
                <div
                  className="absolute z-10 block group/printer"
                  style={{ left: '57%', top: '48%', width: '38%', height: '45%' }}
                >
                  <div className="w-full h-full rounded-sm group-hover/printer:bg-fill-soft transition-colors duration-250 cursor-help" />

                  {/* Pixelated thought bubble */}
                  <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/printer:opacity-100 group-hover/printer:-translate-y-3 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                      <p className="text-black text-base font-bold whitespace-nowrap" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", fontSize: "var(--text-xs)", lineHeight: "1.5" }}>
                        Currently printing<br />a cat toy 🐾
                      </p>
                      {/* Bubble tail */}
                      <div className="absolute -bottom-[16px] right-12 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black" />
                      <div className="absolute -bottom-[8px] right-12 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white" />
                    </div>
                  </div>
                </div>

                {/* Iced Coffee Hover, "Strawberry Latte" */}
                <div
                  className="absolute z-20 block group/coffee"
                  style={{ left: '5%', top: '64%', width: '13%', height: '33%' }}
                >
                  <div className="w-full h-full rounded-sm group-hover/coffee:bg-fill-soft transition-colors duration-250 cursor-help" />

                  {/* Pixelated thought bubble */}
                  <div className="absolute bottom-[90%] left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/coffee:opacity-100 group-hover/coffee:-translate-y-3 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    <div className="bg-white border-4 border-black p-4 relative" style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.5)", borderRadius: "4px" }}>
                      <p className="text-[#b45309] text-sm font-bold whitespace-nowrap text-center" style={{ fontFamily: "'Press Start 2P', 'Courier New', Courier, monospace", lineHeight: "1.5" }}>
                        Strawberry Latte
                      </p>
                      {/* Bubble tail */}
                      <div className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black" />
                      <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-white" />
                    </div>
                  </div>
                </div>

              </div>
            </footer>

            {/* Small yellow pixelated heart at the bottom center */}
            <div className="relative z-10 mt-32 flex justify-center items-center pb-16">

              {/* Render heart bundle (behind the main clickable heart) */}
              {hearts.map((h) => (
                <div
                  key={h.id}
                  className="absolute pointer-events-none z-10"
                  style={{
                    transform: `translate(${h.x}px, ${h.y}px) scale(${h.scale}) rotate(${h.rotation}deg)`,
                    transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  <svg
                    width="32"
                    height="28"
                    viewBox="0 0 11 9"
                    style={{ imageRendering: 'pixelated' }}
                    className="drop-shadow-[2px_3px_0px_rgba(0,0,0,0.5)]"
                  >
                    {/* Outline (#b45309) */}
                    <g fill="#b45309">
                      <rect x="2" y="0" width="1" height="1" />
                      <rect x="8" y="0" width="1" height="1" />
                      <rect x="1" y="1" width="1" height="1" />
                      <rect x="3" y="1" width="1" height="1" />
                      <rect x="7" y="1" width="1" height="1" />
                      <rect x="9" y="1" width="1" height="1" />
                      <rect x="0" y="2" width="1" height="1" />
                      <rect x="4" y="2" width="1" height="1" />
                      <rect x="6" y="2" width="1" height="1" />
                      <rect x="10" y="2" width="1" height="1" />
                      <rect x="0" y="3" width="1" height="1" />
                      <rect x="5" y="3" width="1" height="1" />
                      <rect x="10" y="3" width="1" height="1" />
                      <rect x="1" y="4" width="1" height="1" />
                      <rect x="9" y="4" width="1" height="1" />
                      <rect x="2" y="5" width="1" height="1" />
                      <rect x="8" y="5" width="1" height="1" />
                      <rect x="3" y="6" width="1" height="1" />
                      <rect x="7" y="6" width="1" height="1" />
                      <rect x="4" y="7" width="1" height="1" />
                      <rect x="6" y="7" width="1" height="1" />
                      <rect x="5" y="8" width="1" height="1" />
                    </g>

                    {/* Dynamic Yellow Shade Fill */}
                    <g fill={h.fill}>
                      <rect x="2" y="1" width="1" height="1" />
                      <rect x="8" y="1" width="1" height="1" />
                      <rect x="1" y="2" width="1" height="1" />
                      <rect x="2" y="2" width="1" height="1" />
                      <rect x="3" y="2" width="1" height="1" />
                      <rect x="7" y="2" width="1" height="1" />
                      <rect x="9" y="2" width="1" height="1" />
                      <rect x="1" y="3" width="1" height="1" />
                      <rect x="2" y="3" width="1" height="1" />
                      <rect x="3" y="3" width="1" height="1" />
                      <rect x="4" y="3" width="1" height="1" />
                      <rect x="4" y="4" width="1" height="1" />
                      <rect x="5" y="4" width="1" height="1" />
                      <rect x="6" y="4" width="1" height="1" />
                      <rect x="5" y="5" width="1" height="1" />
                      <rect x="6" y="5" width="1" height="1" />
                      <rect x="7" y="5" width="1" height="1" />
                      <rect x="4" y="6" width="1" height="1" />
                      <rect x="5" y="6" width="1" height="1" />
                      <rect x="6" y="6" width="1" height="1" />
                      <rect x="5" y="7" width="1" height="1" />
                    </g>

                    {/* Lighter Highlights */}
                    <g fill={h.highlight}>
                      <rect x="6" y="3" width="1" height="1" />
                      <rect x="3" y="4" width="1" height="1" />
                      <rect x="7" y="4" width="1" height="1" />
                      <rect x="4" y="5" width="1" height="1" />
                    </g>

                    {/* White Sparkles/Reflections */}
                    <g fill="#ffffff">
                      <rect x="8" y="2" width="1" height="1" />
                      <rect x="7" y="3" width="1" height="1" />
                      <rect x="8" y="3" width="1" height="1" />
                      <rect x="9" y="3" width="1" height="1" />
                      <rect x="2" y="4" width="1" height="1" />
                      <rect x="8" y="4" width="1" height="1" />
                      <rect x="3" y="5" width="1" height="1" />
                    </g>
                  </svg>
                </div>
              ))}

              <svg
                width="32"
                height="28"
                viewBox="0 0 11 9"
                style={{ imageRendering: 'pixelated' }}
                className="w-8 h-7 drop-shadow-[2px_3px_0px_rgba(0,0,0,0.6)] transition-transform duration-250 hover:scale-125 active:scale-100 active:duration-150 cursor-pointer relative z-20"
                onClick={handleAddHearts}
              >
                {/* Outline (#b45309) */}
                <g fill="#b45309">
                  <rect x="2" y="0" width="1" height="1" />
                  <rect x="8" y="0" width="1" height="1" />
                  <rect x="1" y="1" width="1" height="1" />
                  <rect x="3" y="1" width="1" height="1" />
                  <rect x="7" y="1" width="1" height="1" />
                  <rect x="9" y="1" width="1" height="1" />
                  <rect x="0" y="2" width="1" height="1" />
                  <rect x="4" y="2" width="1" height="1" />
                  <rect x="6" y="2" width="1" height="1" />
                  <rect x="10" y="2" width="1" height="1" />
                  <rect x="0" y="3" width="1" height="1" />
                  <rect x="5" y="3" width="1" height="1" />
                  <rect x="10" y="3" width="1" height="1" />
                  <rect x="1" y="4" width="1" height="1" />
                  <rect x="9" y="4" width="1" height="1" />
                  <rect x="2" y="5" width="1" height="1" />
                  <rect x="8" y="5" width="1" height="1" />
                  <rect x="3" y="6" width="1" height="1" />
                  <rect x="7" y="6" width="1" height="1" />
                  <rect x="4" y="7" width="1" height="1" />
                  <rect x="6" y="7" width="1" height="1" />
                  <rect x="5" y="8" width="1" height="1" />
                </g>

                {/* Standard Fill (#facc15 - Vibrant Golden Yellow) */}
                <g fill="#facc15">
                  <rect x="2" y="1" width="1" height="1" />
                  <rect x="8" y="1" width="1" height="1" />
                  <rect x="1" y="2" width="1" height="1" />
                  <rect x="2" y="2" width="1" height="1" />
                  <rect x="3" y="2" width="1" height="1" />
                  <rect x="7" y="2" width="1" height="1" />
                  <rect x="9" y="2" width="1" height="1" />
                  <rect x="1" y="3" width="1" height="1" />
                  <rect x="2" y="3" width="1" height="1" />
                  <rect x="3" y="3" width="1" height="1" />
                  <rect x="4" y="3" width="1" height="1" />
                  <rect x="4" y="4" width="1" height="1" />
                  <rect x="5" y="4" width="1" height="1" />
                  <rect x="6" y="4" width="1" height="1" />
                  <rect x="5" y="5" width="1" height="1" />
                  <rect x="6" y="5" width="1" height="1" />
                  <rect x="7" y="5" width="1" height="1" />
                  <rect x="4" y="6" width="1" height="1" />
                  <rect x="5" y="6" width="1" height="1" />
                  <rect x="6" y="6" width="1" height="1" />
                  <rect x="5" y="7" width="1" height="1" />
                </g>

                {/* Light Highlights (#fef08a - Pastel Shading) */}
                <g fill="#fef08a">
                  <rect x="6" y="3" width="1" height="1" />
                  <rect x="3" y="4" width="1" height="1" />
                  <rect x="7" y="4" width="1" height="1" />
                  <rect x="4" y="5" width="1" height="1" />
                </g>

                {/* White Sparkle/Reflection Highlights (#ffffff) */}
                <g fill="#ffffff">
                  <rect x="8" y="2" width="1" height="1" />
                  <rect x="7" y="3" width="1" height="1" />
                  <rect x="8" y="3" width="1" height="1" />
                  <rect x="9" y="3" width="1" height="1" />
                  <rect x="2" y="4" width="1" height="1" />
                  <rect x="8" y="4" width="1" height="1" />
                  <rect x="3" y="5" width="1" height="1" />
                </g>
              </svg>
            </div>
          </section>

        </main >

        {/* Selected Projects modal, opens on thumbnail click */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              key={selectedProject.alt}
              item={selectedProject}
              outfitClass={outfit.className}
              onClose={() => setSelectedProject(null)}
              onPrev={() => {
                if (selectedIndex > 0) setSelectedProject(filteredProjects[selectedIndex - 1]);
              }}
              onNext={() => {
                if (selectedIndex < filteredProjects.length - 1) setSelectedProject(filteredProjects[selectedIndex + 1]);
              }}
              hasPrev={selectedIndex > 0}
              hasNext={selectedIndex < filteredProjects.length - 1}
              index={selectedIndex}
              total={filteredProjects.length}
            />
          )}
        </AnimatePresence>
      </div >
    </MotionConfig>
  );
}
