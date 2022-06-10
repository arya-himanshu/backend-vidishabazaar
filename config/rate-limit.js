import RateLimit from "express-rate-limit";

export function limiter() {
  return new RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    delayMs: 0, // disable delaying - full speed until the max limit is reached
  });
}
