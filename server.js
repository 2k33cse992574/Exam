// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://examcheatchecker.netlify.app", // ✅ your Netlify domain
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// Test email route (optional)
const sendReportAlert = require("./utils/emailService");
app.get("/test-email", async (req, res) => {
  try {
    await sendReportAlert({
      examName: "Test Exam",
      centerName: "Test Center",
      description: "This is a test email from EduGuard 🚨",
      media: "test.jpg",
    });
    res.send("✅ Test email sent.");
  } catch (error) {
    console.error("❌ Email error:", error.message);
    res.status(500).send("❌ Failed to send test email.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
