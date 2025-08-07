// backend/server.js

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
    origin: "https://examcheatchecker.netlify.app", // ✅ exact Netlify domain
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected:", mongoose.connection.host))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// ✅ Test email route
const sendReportAlert = require("./utils/emailService");

app.get("/test-email", async (req, res) => {
  try {
    await sendReportAlert({
      examName: "Test Exam",
      centerName: "Test Center",
      description: "This is a test email from EduGuard 🚨",
      media: "test.jpg",
    });

    console.log("📤 Email sent successfully from /test-email");
    res.send("✅ Test email sent — check your inbox or spam.");
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    res.status(500).send("❌ Failed to send test email.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
