/**
 * In-memory rate limiter.
 *
 * LIMITATION: This store lives in the memory of a single server instance and
 * is NOT durable. On serverless/edge platforms (e.g. Vercel) it resets on every
 * cold start and is NOT shared across concurrently running instances, so the
 * effective limit is per-instance rather than global. It provides basic,
 * best-effort throttling only.
 *
 * For strong guarantees (e.g. hardening auth against brute force at scale),
 * replace this with a shared, durable store such as Redis or a KV service.
 */

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 5;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  options?: RateLimitOptions,
): {
  allowed: boolean;
  retryAfterMs: number;
} {
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS;

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Extracts the client IP from request headers for use as a rate-limit key.
 *
 * Prefers `x-real-ip`, which Vercel and most proxies set to the true client IP
 * and which clients cannot spoof. Falls back to the `x-forwarded-for` chain,
 * taking the LAST entry (the hop closest to the trusted proxy) rather than the
 * first: on Vercel the client can prepend arbitrary values and the platform
 * appends the real IP as `<spoofed>, <realIp>`, so the leftmost token is
 * attacker-controllable and would let them rotate rate-limit buckets. Falls
 * back to "unknown" when neither header is present.
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (forwarded && forwarded.length > 0) {
    return forwarded[forwarded.length - 1];
  }

  return "unknown";
}
