// backend/controllers/reportController.js

const Report = require("../models/Report");
const sendReportAlert = require("../utils/emailService");

// Submit Report
exports.submitReport = async (req, res) => {
  try {
    const { examName, centerName, description } = req.body;

    const report = new Report({
      examName,
      centerName,
      description,
      media: req.file ? req.file.filename : null,
      ip: req.clientIP,
    });

    await report.save();

    // Optionally send alert email
    await sendReportAlert(report);

    res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    console.error("Error submitting report:", error.message);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

// Get All Reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// Verify Report (admin)
exports.verifyReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
};

// Delete Report (admin)
exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ error: "Deletion failed" });
  }
};
