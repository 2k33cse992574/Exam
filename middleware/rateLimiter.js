// middleware/rateLimiter.js

const rateLimit = require("express-rate-limit");

const reportRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 3 report submissions per windowMs
  message: {
    success: false,
    error: "⚠️ Too many reports from this IP. Please try again later.",
  },
});

module.exports = reportRateLimiter;
