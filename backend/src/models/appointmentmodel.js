const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userPhone: {
      type: String,
      default: "",
      trim: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    servicePrice: {
      type: String,
      default: "",
    },
    hairStyleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HairStyle",
      default: null,
    },
    hairStyleImage: {
      type: String,
      default: "",
    },
    masterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Master",
      default: null,
    },
    masterName: {
      type: String,
      default: "Any Available Master",
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed", "cancelled"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },
    statusUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

