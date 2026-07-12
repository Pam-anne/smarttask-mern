import rateLimit from "express-rate-limit";

/**
 * Limits repeated auth attempts from the same IP to reduce the risk of
 * brute-force / credential-stuffing attacks. 20 requests per 15 minutes.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
  },
});
