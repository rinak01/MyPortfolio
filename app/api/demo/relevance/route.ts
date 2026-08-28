// Text path for the live Proactive Agent demo: a typed utterance in, a
// relevance verdict out. The cheap path — no transcription, one classifier
// call, bounded output.

import { NextResponse } from "next/server";
import { classify } from "@/lib/demo/classify";
import {
  MAX_TEXT_CHARS,
  checkRateLimit,
  clientId,
  withinDailyBudget,
} from "@/lib/demo/guards";

export const runtime = "nodejs";
// Never cached: every call is metered, and a cached verdict would misreport
// what the classifier did for this particular input.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  const text = (body as { text?: unknown })?.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "Say something first." }, { status: 400 });
  }
  if (text.length > MAX_TEXT_CHARS) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_TEXT_CHARS} characters.` },
      { status: 400 },
    );
  }

  const { success } = await checkRateLimit("text", clientId(req));
  if (!success) {
    return NextResponse.json(
      { error: "That's a lot of tries. Give it a few minutes." },
      { status: 429 },
    );
  }

  if (!(await withinDailyBudget())) {
    return NextResponse.json(
      { error: "The demo has hit its daily limit. It resets tomorrow." },
      { status: 429 },
    );
  }

  const limitedProficiency =
    (body as { limitedProficiency?: unknown })?.limitedProficiency === true;

  try {
    const verdict = await classify(text.trim(), limitedProficiency);
    return NextResponse.json({ transcript: text.trim(), ...verdict });
  } catch (err) {
    // The upstream message can carry billing and account detail; log it, don't
    // return it. A visitor gets a panel that degrades, not a stack trace.
    console.error("[demo/relevance]", err);
    return NextResponse.json(
      { error: "The classifier is unavailable right now." },
      { status: 502 },
    );
  }
}
