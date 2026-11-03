const mongoose = require("mongoose");

const hairStyleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Fades & Tapers",
    },
    icon: {
      type: String,
      default: "✂️",
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    cycle: {
      type: String,
      default: "3 - 4 Weeks",
      trim: true,
    },
    hairType: {
      type: String,
      default: "All hair types",
      trim: true,
    },
    faceShape: {
      type: String,
      default: "All face shapes",
      trim: true,
    },
    product: {
      type: String,
      default: "Matte Clay / Pomade",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    stylingTips: {
      type: String,
      default: "",
      trim: true,
    },
    masterProfile: {
      type: String,
      default: "MET75 Master Team",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HairStyle", hairStyleSchema);
