import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Limits each IP to 300 requests per 15 minutes
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * Strict Rate Limiter for OTP Generation & Resending
 * Limits each IP to 3 code dispatches per minute to prevent email flooding
 */
export const otpDispatchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification code requests. Please wait 60 seconds before requesting another code.',
  },
});

/**
 * Strict Rate Limiter for Login and OTP Verification
 * Limits brute-force attempts to 5 per 5 minutes
 */
export const authAttemptLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 5 minutes before trying again.',
  },
});

/**
 * Input sanitization middleware to prevent XSS and script injection
 */
export const sanitizeInputData = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        // Strip dangerous <script> tags and javascript: URLs
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '');
      }
    }
  }
  next();
};
