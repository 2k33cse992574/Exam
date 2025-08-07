const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

const reportRoutes = require("./routes/reportRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const ipMiddleware = require("./middleware/ipMiddleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(ipMiddleware);

// Static folder to serve uploaded files (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/report", reportRoutes);

// Default route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to EduGuard API!");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start server only after DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // stop if DB fails
  });
