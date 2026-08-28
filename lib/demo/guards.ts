// Spend and abuse controls for the live demo endpoints.
//
// The demo calls a metered API on behalf of anyone who finds the page, which
// includes crawlers. Everything here exists to bound what a stranger, or a bot
// in a loop, can cost. Three independent layers, because any one of them can be
// worked around on its own:
//
//   1. Per-IP rate limit    — stops one visitor hammering it
//   2. Per-request caps     — bounds the cost of any single call
//   3. Global daily budget  — the hard stop, regardless of how traffic arrives
//
// Layer 3 is the one that matters. Rate limits are per-identifier and a
// distributed caller defeats them; a global counter cannot be outrun.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Per-request caps. Audio is the expensive path, so it is capped hardest.
export const MAX_TEXT_CHARS = 280;
export const MAX_AUDIO_BYTES = 1_000_000; // ~1MB, roughly 15s of webm/opus
export const ALLOWED_AUDIO_TYPES = [
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
];

// Global ceiling across all visitors, per UTC day. Sized so a runaway cannot
// produce a surprising bill: audio requests cost roughly a cent each, text
// requests well under that.
export const DAILY_REQUEST_BUDGET = 500;

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

// Serverless functions do not share memory and cold-start constantly, so an
// in-process counter is not a real limit in production — it is only here so the
// route works locally without Redis. `usingDurableLimits` is surfaced so the
// route can refuse to run live without a real store behind it.
export const usingDurableLimits = hasUpstash;

const memoryHits = new Map<string, { count: number; resetAt: number }>();

export const textLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, "1 h"),
      prefix: "demo:text",
      analytics: false,
    })
  : null;

export const audioLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(6, "1 h"),
      prefix: "demo:audio",
      analytics: false,
    })
  : null;

function memoryLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = memoryHits.get(key);
  if (!entry || now > entry.resetAt) {
    memoryHits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }
  entry.count += 1;
  return { success: entry.count <= max };
}

export async function checkRateLimit(
  kind: "text" | "audio",
  identifier: string,
): Promise<{ success: boolean }> {
  const limiter = kind === "text" ? textLimiter : audioLimiter;
  if (limiter) {
    const { success } = await limiter.limit(identifier);
    return { success };
  }
  const max = kind === "text" ? 15 : 6;
  return memoryLimit(`${kind}:${identifier}`, max, 60 * 60 * 1000);
}

/**
 * Increments and checks the global daily counter. Returns false once the day's
 * budget is spent, which the routes turn into a friendly "come back tomorrow"
 * rather than an error — the panel should degrade, not break.
 */
export async function withinDailyBudget(): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const key = `demo:budget:${day}`;

  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) {
      // Expire a little after the day rolls over, so the key cleans itself up.
      await redis.expire(key, 60 * 60 * 26);
    }
    return count <= DAILY_REQUEST_BUDGET;
  }

  const entry = memoryHits.get(key);
  const now = Date.now();
  if (!entry || now > entry.resetAt) {
    memoryHits.set(key, { count: 1, resetAt: now + 60 * 60 * 26 * 1000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= DAILY_REQUEST_BUDGET;
}

/** Best-effort client identity. Vercel sets x-forwarded-for at the edge. */
export function clientId(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
