"use client";

/* ─── Luminous Jellyfish: design system feature ────────────────────────────
   Rendered full width at the top of the archive modal for this one project
   (GridItem.feature).

   Palette-and-Light-Language.md and Locked-Design-System-v1.pdf disagree on
   three points. Each was called once, by hand, and is fixed here rather than
   argued from the docs again:

   - Thinking reads lavender #9298CF (Palette doc's violet interior pole),
     not the PDF's teal-cyan #59DBD6. Nothing else in the palette is violet,
     so the hue stays unambiguous, and it doubles as the waking-on-boot color.
   - No alarm this phase. The PDF's reversal (cursor/jab escalates to a full
     emerald alarm register) is cut; cursor jabbing does not escalate past
     startle, and no separate alarm token exists yet.
   - Two golds, not three: signal.greeting (#FFCC6E) does double duty for the
     greeting bloom and reef-gold accents, per the PDF's merge. creature.warm.gold
     (#FFE1A8, the PDF's value) stays the creature's own earned-only warmth.
   ────────────────────────────────────────────────────────────────────────── */

function Block({ title, lede, children }: { title: string; lede?: string; children: React.ReactNode }) {
  return (
    <section className="py-10 md:py-12 border-t border-line-soft first:border-t-0 first:pt-2">
      <h4 className="text-xl md:text-2xl font-light text-ink leading-tight">{title}</h4>
      {lede && <p className="mt-2 text-sm text-body leading-relaxed max-w-[62ch]">{lede}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

const SYSTEM_CREATURE: { name: string; hex: string; role: string }[] = [
  { name: "creature.core", hex: "#F5F6FF", role: "Brightest pixel in the scene; ≤1% of frame." },
  { name: "creature.idle", hex: "#1DA181", role: "Resting emerald-teal, vertical, slow pulse — the tone of voice." },
  { name: "creature.curious", hex: "#A4D7E5", role: "Pale cyan. Orienting, tilting, tentacles begin to stream." },
  { name: "creature.happy", hex: "#F4E6AF", role: "Cream-gold. Near-horizontal, fully streaming — earned warmth." },
  { name: "creature.surprised", hex: "#9298CF", role: "Lavender-periwinkle. Dormant interior pole; also the waking-on-boot color." },
  { name: "creature.surprised.haze", hex: "#BCB5E2", role: "Softer violet body-haze companion." },
  { name: "creature.warm.gold", hex: "#FFE1A8", role: "Earned-only body warmth. Mood-driven only; trust weighting is Phase 2." },
  { name: "creature.rim", hex: "#BFF6F0", role: "Lit veil edges (lost-and-found)." },
  { name: "creature.tentacle", hex: "#5CF2E8", role: "Ribbon light-lines and traveling beads." },
  { name: "creature.orbcharm", hex: "#39E0FF", role: "The two signature bead-charms — identity marker." },
];

const SYSTEM_WORLD: { name: string; hex: string; role: string }[] = [
  { name: "void.black", hex: "#000810", role: "True black; ≥40% of frame, never lifted." },
  { name: "void.deep", hex: "#0D365A", role: "Deep water fill, night-dominant." },
  { name: "water.mid", hex: "#165A83", role: "Mid water column." },
  { name: "depth.silhouette", hex: "#233E58", role: "Far background corals." },
  { name: "reef.cyan.glow", hex: "#32CCE0", role: "Lit cloud-coral masses — the reef's body." },
  { name: "reef.cyan.deep", hex: "#1D8EB2", role: "Coral shadow and structure." },
  { name: "reef.cyan.soft", hex: "#6FBDD5", role: "Diffuse cool masses, mid-depth." },
  { name: "reef.coral.pink", hex: "#FF6FA8", role: "Hero pink coral, the warmest zone." },
  { name: "reef.coral.muted", hex: "#C77BA0", role: "Receding pink, background depth." },
  { name: "signal.greeting", hex: "#FFCC6E", role: "Greeting bloom, merged with reef gold — anemone hearts, spore-lights." },
];

const SYSTEM_WORDS: { word: string; hex: string; envelope: string; direction: string; trigger: string; cadence: string; status: string }[] = [
  { word: "Greeting", hex: "#FFCC6E", envelope: "Slow warm swell", direction: "Crown → tips · telling", trigger: "Page load, or return after 5 min away", cadence: "Priority 2 · cooldown 60s", status: "Active" },
  { word: "Acknowledgment", hex: "#59EB96", envelope: "Quick double-flash", direction: "Whole body · reflex", trigger: "Tap or click the creature", cadence: "Priority 3 · cooldown 0.5s", status: "Active" },
  { word: "Playful", hex: "#FFE1A8", envelope: "Bubble stream + bob", direction: "Upward · pure expression", trigger: "Gentle cursor play", cadence: "Priority 1 · no cooldown", status: "Active" },
  { word: "Surprised", hex: "#9298CF", envelope: "Sustained dreamy shimmer", direction: "Whole body · inward", trigger: "Reserved for a future chat feature", cadence: "Priority 1 · no cooldown", status: "Seeded, dormant" },
  { word: "Startle “boo!”", hex: "#CFEFE8", envelope: "Sharp pop → sparkle-burst, ~3s dreamy drift", direction: "Burst · tips into play", trigger: "Sudden cursor dart toward it", cadence: "Cooldown ~2s", status: "Active, own register" },
];

const SYSTEM_LAWS: [string, string][] = [
  ["Continuity", "Every animated value moves as a smooth curve. A hard step is a defect, not a style."],
  ["Redundancy", "Every distinct meaning differs in ≥2 channels (hue+envelope, or hue+direction). Colorblind-legible by construction."],
  ["Luminance", "Nothing in the world outshines the creature's core. Attention has exactly one anchor."],
  ["Etiquette", "One word at a time. Higher priority interrupts only via slew-limited cross-fade; lower priority is dropped, never queued."],
  ["80/20", "Cool foundation dominates ~80% of frame; warm accent is the rare ~20%, and never out-saturates the creature."],
  ["Void", "≥40% of the frame stays open dark swim-path. Life clings to edges, never the center."],
];

function TokenSwatchList({ tokens }: { tokens: { name: string; hex: string; role: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {tokens.map((t) => (
        <li key={t.name} className="grid grid-cols-[28px_1fr] gap-3 items-start">
          <span className="w-7 h-7 rounded-sm border border-line-strong" style={{ background: t.hex }} aria-hidden />
          <div className="min-w-0">
            <div className="font-mono text-xs text-ink">{t.name} <span className="text-meta">{t.hex}</span></div>
            <div className="text-xs text-body leading-snug mt-0.5">{t.role}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function DesignSystemLocked() {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h5 className="text-sm text-ink mb-3">Creature tokens</h5>
          <TokenSwatchList tokens={SYSTEM_CREATURE} />
        </div>
        <div>
          <h5 className="text-sm text-ink mb-3">World tokens</h5>
          <TokenSwatchList tokens={SYSTEM_WORLD} />
        </div>
      </div>

      <div>
        <h5 className="text-sm text-ink mb-3">Light-language</h5>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm border-collapse">
            <thead>
              <tr className="text-2xs uppercase tracking-[0.16em] text-meta">
                <th className="text-left font-normal py-2 pr-4">Word</th>
                <th className="text-left font-normal py-2 pr-4">Envelope + direction</th>
                <th className="text-left font-normal py-2 pr-4">Trigger</th>
                <th className="text-left font-normal py-2">Cadence</th>
              </tr>
            </thead>
            <tbody>
              {SYSTEM_WORDS.map((w) => (
                <tr key={w.word} className="border-t border-line-soft align-top">
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-line-strong shrink-0" style={{ background: w.hex }} aria-hidden />
                      <span className="text-ink">{w.word}</span>
                    </span>
                    <div className="text-2xs text-meta mt-0.5">{w.status}</div>
                  </td>
                  <td className="py-3 pr-4 text-body leading-snug">
                    {w.envelope}
                    <br />
                    <span className="text-meta">{w.direction}</span>
                  </td>
                  <td className="py-3 pr-4 text-body leading-snug">{w.trigger}</td>
                  <td className="py-3 text-meta tabular-nums">{w.cadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-meta leading-relaxed">
          Grammar: crown → tips means the creature is telling you something; tips → crown means it&apos;s sensing something. Play-bubbles rise outward but are neither — play isn&apos;t a message, it&apos;s joy for its own sake.
        </p>
      </div>

      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SYSTEM_LAWS.map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm text-ink">{k}</dt>
            <dd className="text-xs text-body leading-relaxed mt-1">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ─── Composition ────────────────────────────────────────────────────────── */

export default function JellyfishSystem() {
  return (
    <div className="px-5 md:px-8 pt-8 md:pt-10 pb-4">
      <Block
        title="The Design System"
        lede="Palette-and-Light-Language.md and Locked-Design-System-v1.pdf disagree on three points. Each was called once, by hand, and fixed here rather than re-argued from the docs."
      >
        <DesignSystemLocked />
      </Block>
    </div>
  );
}
