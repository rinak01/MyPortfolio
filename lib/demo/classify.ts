// The relevance stage of the Proactive Agent pipeline, as it runs live on the
// case study page. This mirrors classify() in the study's Python harness
// (pipeline.py) so the demo and the research code share one definition of what
// "relevant" means — if they drift, the demo stops being evidence for the
// case study it sits inside.
//
// The original study detected relevance by asking the model to emit the literal
// string ":D ?" when off-topic and then string-matching it. That fails open:
// any drift the model produces reads as an on-topic response. Here the verdict
// is a structured field instead.

import OpenAI from "openai";
import { z } from "zod";

export const CLASSIFY_MODEL = "gpt-4o";
export const TRANSCRIBE_MODEL = "whisper-1";

// The topic the agent is scoped to. Relevance is defined against this and
// nothing else — the pipeline ports, this definition does not travel with it.
export const TOPIC = "woodworking";

export const VerdictSchema = z.object({
  relevant: z
    .boolean()
    .describe("True if the utterance is addressed to an assistant scoped to this topic."),
  reply: z
    .string()
    .describe("The assistant's reply if relevant. Empty string if not relevant."),
  reason: z
    .string()
    .describe("One short clause explaining the relevance decision."),
});

export type Verdict = z.infer<typeof VerdictSchema>;

// Kept verbatim in shape with the Python harness's _system_prompt().
function systemPrompt(limitedProficiency: boolean): string {
  let prompt =
    `You are an assistant that listens to transcribed speech and only responds ` +
    `when the speech is relevant to your topic. Your topic is ${TOPIC}.\n\n` +
    `Decide whether the utterance was addressed to you as an assistant for this ` +
    `topic. Side conversation, thinking aloud, and unrelated talk are not ` +
    `addressed to you, even when they mention your topic in passing.\n\n` +
    `Set relevant=true and write a reply only when you should speak. ` +
    `Set relevant=false with an empty reply when you should stay silent. ` +
    `Keep any reply to two sentences at most.`;

  if (limitedProficiency) {
    prompt += `\n\nThe speaker may have limited proficiency in English.`;
  }
  return prompt;
}

let cached: OpenAI | null = null;

export function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  cached ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return cached;
}

export async function classify(
  text: string,
  limitedProficiency = false,
): Promise<Verdict> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model: CLASSIFY_MODEL,
    // temperature 0 so the same utterance gives the same verdict — a demo that
    // answers differently on a refresh reads as broken rather than as sampling.
    temperature: 0,
    // The reply is capped at two sentences by the prompt; this is the hard stop
    // that bounds what a single request can cost.
    max_tokens: 300,
    messages: [
      { role: "system", content: systemPrompt(limitedProficiency) },
      { role: "user", content: text },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "verdict",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["relevant", "reply", "reason"],
          properties: {
            relevant: { type: "boolean" },
            reply: { type: "string" },
            reason: { type: "string" },
          },
        },
      },
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Classifier returned no content");
  }

  // Parse rather than trust: strict json_schema makes this very unlikely to
  // fail, but the route needs a typed value or a clean error, not a cast.
  return VerdictSchema.parse(JSON.parse(raw));
}
