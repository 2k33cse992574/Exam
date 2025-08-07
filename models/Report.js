// models/Report.js

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
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
    mobile: {
      type: String,
      required: true,
    },
    media: {
      type: String,
    },
    ip: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
