const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      default: "5+ Years",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "🧔",
    },
    status: {
      type: String,
      enum: ["active", "on_leave"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Master", masterSchema);

