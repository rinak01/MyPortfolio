"use client";

// The live half of case study 02. A visitor types or records an utterance, it
// goes through the same two stages the diagram above describes — transcription,
// then a relevance decision — and the panel reports whether the agent would
// have spoken.
//
// Deliberately does not claim to be the system that produced the study's
// numbers: the classifier here returns a structured verdict, where the original
// harness detected relevance by string-matching a sentinel the model was asked
// to emit. Same pipeline shape, more robust decision stage. The footnote on the
// panel says so.

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400"] });

// Off by default. The API routes fail safely on their own (missing
// OPENAI_API_KEY throws, the route catches it and returns a plain "the
// classifier is unavailable" message) — but a visitor still shouldn't see a
// panel that invites them to try something and then errors. More importantly,
// the rate limiter only becomes a real limit once Upstash is configured
// (see lib/demo/guards.ts); until then this stays off in production so the
// metered endpoint is never live without a durable ceiling behind it.
// NEXT_PUBLIC_* is inlined at build time, so flip it in Vercel's project env
// vars and redeploy — not something a visitor's browser can influence.
const DEMO_ENABLED = process.env.NEXT_PUBLIC_DEMO_ENABLED === "true";

type Verdict = {
  transcript: string;
  relevant: boolean;
  reply: string;
  reason: string;
};

// Drawn from the study's own condition set, so the presets exercise the cases
// the case study actually reports on rather than invented ones.
const PRESETS = [
  { label: "On topic", text: "how do I keep the grain from tearing when I sand this edge" },
  { label: "Off topic", text: "did you see what happened in the game last night" },
  { label: "Thinking aloud", text: "hmm okay so the clamp goes here I think, maybe" },
];

const MAX_CHARS = 280;
// Recording is capped client-side too, so a long take is never uploaded and
// rejected — the limit is visible rather than discovered.
const MAX_RECORD_MS = 15_000;

export default function ProactiveAgentDemo() {
  // A conditional return before the hooks below would trip rules-of-hooks —
  // DEMO_ENABLED is a build-time constant so it can't actually change between
  // renders, but the linter can't know that statically. Split into two
  // components instead: this one is a plain switch, LiveDemo owns every hook.
  return DEMO_ENABLED ? <LiveDemo /> : <DemoDisabled />;
}

function DemoDisabled() {
  return (
    <div className="rounded-sm border border-line bg-raised p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className={`${outfit.className} text-lg text-ink`}>Try it yourself</span>
        <span className="text-2xs uppercase tracking-[0.18em] text-meta shrink-0">Soon</span>
      </div>
      <p className="text-sm text-body leading-snug">
        A live version of this pipeline runs here when the demo is enabled — type
        or speak an utterance and watch the agent decide whether to answer.
        Currently off while the abuse controls around the live API are finished.
      </p>
    </div>
  );
}

function LiveDemo() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const [result, setResult] = useState<Verdict | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [canRecord, setCanRecord] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCanRecord(
      typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== "undefined",
    );
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const submitText = useCallback(async () => {
    const value = text.trim();
    if (!value || busy) return;

    setBusy(true);
    setError(null);
    setResult(null);
    setStage("Classifying");

    try {
      const res = await fetch("/api/demo/relevance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as Verdict);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setStage(null);
    }
  }, [text, busy]);

  const sendAudio = useCallback(async (blob: Blob) => {
    setBusy(true);
    setError(null);
    setResult(null);
    setStage("Transcribing");

    try {
      const form = new FormData();
      form.append("audio", blob, "clip.webm");

      const res = await fetch("/api/demo/transcribe", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as Verdict);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setStage(null);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    recorderRef.current?.stop();
    setRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (busy || recording) return;
    setError(null);
    setResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        if (blob.size > 0) void sendAudio(blob);
      };

      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      stopTimerRef.current = setTimeout(stopRecording, MAX_RECORD_MS);
    } catch {
      setError("Microphone access was blocked.");
      setRecording(false);
    }
  }, [busy, recording, sendAudio, stopRecording]);

  return (
    // Material weight carries the hierarchy here. The two tiles above are
    // passive readings, so they take the flat border; this panel is the only
    // thing on the page a visitor can operate, and styling it identically made
    // it read as a third stat card. Accent border, a lifted surface and a real
    // shadow mark it as the live layer.
    <div className="rounded-sm border border-accent/40 bg-raised p-5 md:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.18)]">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className={`${outfit.className} text-lg text-ink`}>Try it yourself</span>
        <span className="flex items-center gap-2 shrink-0">
          {/* A slow pulse, ~0.5Hz, to say the panel is live rather than a
              screenshot. Disabled under reduced motion, where the dot still
              carries the meaning on its own. */}
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse motion-reduce:animate-none"
          />
          <span className="text-2xs uppercase tracking-[0.18em] text-meta">Live</span>
        </span>
      </div>
      {/* Gives the visitor a goal rather than an explanation. "See whether it
          speaks" describes the mechanism; "try to make it ignore you" is
          something a person can actually go and do. */}
      <p className="text-sm text-body leading-snug mb-4">
        The agent only answers questions about woodworking.{" "}
        <span className="text-ink">Try to make it ignore you.</span>
      </p>

      {/* Presets. Most visitors click rather than type, and these exercise the
          three cases the case study reports on. Labelled as the starting point
          so the panel suggests a first move instead of presenting a blank field. */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-2xs uppercase tracking-[0.18em] text-meta shrink-0 mr-0.5">
          Start with
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={busy || recording}
            onClick={() => setText(p.text)}
            // Scale on :active, not on click — feedback belongs on pointer-down,
            // where waiting for the release reads as a dead control.
            className="rounded-sm border border-line bg-panel-2 px-3 py-1.5 text-xs text-body hover:text-ink hover:border-accent/50 active:scale-[0.97] transition-[color,border-color,transform] duration-100 disabled:opacity-40"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={text}
          maxLength={MAX_CHARS}
          disabled={busy || recording}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void submitText();
          }}
          placeholder="…or type your own"
          aria-label="Utterance to classify"
          // focus-visible ring rather than a bare outline-none: removing the
          // indicator outright strands keyboard users.
          className="flex-1 min-w-0 rounded-sm border border-line bg-panel-2 px-3 py-2.5 text-sm text-ink placeholder:text-meta focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus:border-accent/50 transition-colors disabled:opacity-40"
        />
        <div className="flex gap-2">
          {/* Send is the primary action and is the only filled control in the
              panel. Previously it was outlined exactly like Speak and the
              presets, which left four controls competing at one weight. */}
          <button
            type="button"
            onClick={() => void submitText()}
            disabled={busy || recording || !text.trim()}
            className="rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-[var(--ground)] hover:opacity-90 active:scale-[0.97] transition-[opacity,transform] duration-100 disabled:opacity-30 whitespace-nowrap"
          >
            Send
          </button>
          {canRecord && (
            <button
              type="button"
              onClick={() => (recording ? stopRecording() : void startRecording())}
              disabled={busy}
              aria-label={recording ? "Stop recording" : "Record from microphone"}
              className={`rounded-sm border px-4 py-2.5 text-sm active:scale-[0.97] transition-[color,border-color,transform] duration-100 disabled:opacity-40 whitespace-nowrap ${
                recording
                  ? "border-accent bg-accent/10 text-ink"
                  : "border-line bg-panel-2 text-body hover:text-ink hover:border-accent/50"
              }`}
            >
              {recording ? "Stop" : "Speak"}
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[92px] mt-4">
        <AnimatePresence mode="wait">
          {busy && (
            <motion.p
              key="busy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-meta"
            >
              {stage}…
            </motion.p>
          )}

          {!busy && error && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="status"
              className="text-sm text-meta"
            >
              {error}
            </motion.p>
          )}

          {!busy && !error && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              role="status"
              className="space-y-2.5"
            >
              {result.transcript && (
                <p className="text-sm text-meta leading-snug">
                  Heard: <span className="text-body">&ldquo;{result.transcript}&rdquo;</span>
                </p>
              )}

              {/* The verdict is the point of the panel, so it gets the weight.
                  Never colour alone — the words carry the state too. */}
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    result.relevant ? "bg-accent" : "bg-fill-strong"
                  }`}
                />
                <span className="text-sm font-medium text-ink">
                  {result.relevant ? "Agent responds" : "Agent stays silent"}
                </span>
              </div>

              {result.relevant && result.reply && (
                <p className="text-sm text-body leading-snug pl-[18px]">{result.reply}</p>
              )}
              {result.reason && (
                <p className="text-xs text-meta leading-snug pl-[18px]">{result.reason}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-2xs text-meta leading-snug mt-4 pt-3 border-t border-line">
        Runs the pipeline live. The decision stage returns a structured verdict
        rather than the sentinel string the original study matched on, so this is
        the pipeline rebuilt, not the exact build that produced the numbers above.
      </p>
    </div>
  );
}
