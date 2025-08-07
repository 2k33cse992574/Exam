// controllers/reportController.js

const Report = require("../models/Report");
const sendReportAlert = require("../utils/emailService");
const path = require("path");

// ✅ Submit a new report
const submitReport = async (req, res) => {
  try {
    const { examName, centerName, description, mobile } = req.body;
    const ip = req.clientIP;
    const media = req.file ? req.file.filename : null;

    const report = new Report({
      examName,
      centerName,
      description,
      mobile,
      media,
      ip,
    });

    await report.save();

    // Send email alert to admin/NGOs/media
    await sendReportAlert({ examName, centerName, description, media });

    res.status(201).json({ message: "✅ Report submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting report:", error.message);
    res.status(500).json({ message: "❌ Server Error" });
  }
};

// ✅ Get all reports (admin)
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get only verified reports (public trending feed)
const getVerifiedReports = async (req, res) => {
  try {
    const reports = await Report.find({ isVerified: true }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Verify a report (admin)
const verifyReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.isVerified = true;
    await report.save();

    res.json({ message: "Report verified" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get reports by mobile number
const getReportByMobile = async (req, res) => {
  try {
    const mobile = req.params.mobile;
    const reports = await Report.find({ mobile }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  submitReport,
  getReports,
  getVerifiedReports,
  verifyReport,
  getReportByMobile,
};
