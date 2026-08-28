// Audio path for the live Proactive Agent demo: a recorded clip in, a
// transcript and a relevance verdict out. Both stages of the study's pipeline,
// in the order the diagram on the page shows them.
//
// This is the expensive path — Whisper plus the classifier — so it carries a
// tighter rate limit and a hard byte cap.

import { NextResponse } from "next/server";
import { TRANSCRIBE_MODEL, classify, getClient } from "@/lib/demo/classify";
import {
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_BYTES,
  checkRateLimit,
  clientId,
  withinDailyBudget,
} from "@/lib/demo/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { success } = await checkRateLimit("audio", clientId(req));
  if (!success) {
    return NextResponse.json(
      { error: "That's a lot of recordings. Give it a few minutes." },
      { status: 429 },
    );
  }

  if (!(await withinDailyBudget())) {
    return NextResponse.json(
      { error: "The demo has hit its daily limit. It resets tomorrow." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected form data." }, { status: 400 });
  }

  const file = form.get("audio");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No recording received." }, { status: 400 });
  }

  // Size is checked before the type sniff so an oversized upload is rejected
  // on the cheapest possible check.
  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "That recording is too long. Keep it under about 15 seconds." },
      { status: 413 },
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "That recording was empty." }, { status: 400 });
  }

  const baseType = (file.type || "").split(";")[0]!.trim();
  if (!ALLOWED_AUDIO_TYPES.includes(baseType)) {
    return NextResponse.json(
      { error: "That file type isn't supported." },
      { status: 415 },
    );
  }

  const limitedProficiency = form.get("limitedProficiency") === "true";

  try {
    const client = getClient();
    const transcription = await client.audio.transcriptions.create({
      model: TRANSCRIBE_MODEL,
      file,
    });

    const transcript = transcription.text?.trim() ?? "";
    if (!transcript) {
      return NextResponse.json({
        transcript: "",
        relevant: false,
        reply: "",
        reason: "Nothing intelligible was picked up.",
      });
    }

    const verdict = await classify(transcript, limitedProficiency);
    return NextResponse.json({ transcript, ...verdict });
  } catch (err) {
    console.error("[demo/transcribe]", err);
    return NextResponse.json(
      { error: "The pipeline is unavailable right now." },
      { status: 502 },
    );
  }
}
