// backend/routes/reportRoutes.js

const express = require("express");
const router = express.Router();

const {
  submitReport,
  getAllReports,
  verifyReport,
  deleteReport,
} = require("../controllers/reportController");

const upload = require("../middleware/uploadMiddleware");
const getClientIP = require("../middleware/ipMiddleware");
const rateLimiter = require("../middleware/rateLimiter");

// 📥 Submit a new report (rate-limited, IP tracked, with media)
router.post("/", rateLimiter, getClientIP, upload.single("media"), submitReport);

// 📤 Get all reports
router.get("/", getAllReports);

// 🔐 Admin verify a report
router.put("/verify/:id", verifyReport);

// 🗑️ Admin delete a report
router.delete("/:id", deleteReport);

module.exports = router;
