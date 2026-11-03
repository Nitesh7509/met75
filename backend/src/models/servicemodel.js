const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Hair Cutting",
        "Shaving & Beard",
        "Head Massage & Spa",
        "Face Care & D-Tan",
        "Hair & Beard Color",
        "Super Saver Combos",
      ],
      default: "Hair Cutting",
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    duration: {
      type: String,
      default: "20 mins",
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "✂️",
    },
    popularBadge: {
      type: String,
      default: "", // e.g. "Most Popular", "Best Value", "Bestseller"
    },
    savings: {
      type: String,
      default: "", // e.g. "Save ₹100"
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);

