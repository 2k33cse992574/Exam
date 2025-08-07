// routes/reportRoutes.js

const express = require("express");
const router = express.Router();
const {
  submitReport,
  getReports,
  getVerifiedReports,
  verifyReport,
  getReportByMobile,
} = require("../controllers/reportController");

const upload = require("../middleware/uploadMiddleware");
const getClientIP = require("../middleware/ipMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

// Public: Submit report
router.post("/reports", rateLimiter, getClientIP, upload.single("media"), submitReport);

// Public: Get all verified reports (trending feed)
router.get("/verified", getVerifiedReports);

// Admin: Get all reports
router.get("/", getReports);

// Admin: Verify a report
router.put("/:id/verify", verifyReport);

// Public: Get reports by mobile
router.get("/mobile/:mobile", getReportByMobile);

module.exports = router;
