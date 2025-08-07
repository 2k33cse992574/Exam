// backend/models/Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  centerName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  ip: {
    type: String, // ✅ New field to store user's IP
  },
});

module.exports = mongoose.model("Report", reportSchema);
