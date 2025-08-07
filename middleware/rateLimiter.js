// backend/middleware/rateLimiter.js

const rateLimit = require("express-rate-limit");

const reportLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Max 3 reports per IP per 5 minutes
  message: "🚫 Too many reports submitted. Please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = reportLimiter;
