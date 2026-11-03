const Appointment = require("../models/appointmentmodel");
const User = require("../models/usermodel");
const {
  sendAppointmentRequestEmail,
  sendAppointmentStatusEmail,
} = require("../services/emailservices");

// USER: Request a new salon appointment
exports.requestAppointment = async (req, res) => {
  try {
    const {
      service,
      servicePrice,
      hairStyleId,
      hairStyleImage,
      masterId,
      masterName,
      appointmentDate,
      timeSlot,
      notes,
      userPhone,
    } = req.body;

    if (!service || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        message: "Please provide service name, appointment date, and time slot.",
      });
    }

    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid appointment date format.",
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: userPhone || "",
      service: service.trim(),
      servicePrice: servicePrice || "",
      hairStyleId: hairStyleId || null,
      hairStyleImage: hairStyleImage || "",
      masterId: masterId || null,
      masterName: (masterName || "Any Available Master").trim(),
      appointmentDate: parsedDate,
      timeSlot: timeSlot.trim(),
      notes: (notes || "").trim(),
      status: "pending",
    });

    // Try sending email notification (non-blocking)
    try {
      await sendAppointmentRequestEmail(req.user, appointment);
    } catch (emailErr) {
      console.warn("[APPOINTMENT EMAIL WARN]", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully! Waiting for salon confirmation.",
      appointment,
    });
  } catch (error) {
    console.error("[APPOINTMENT ERROR]", error);
    return res.status(500).json({
      message: error.message || "Failed to submit appointment request.",
    });
  }
};

// USER: Get logged-in user's appointments
exports.getMyFellowAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({
      appointmentDate: -1,
      createdAt: -1,
    });

    return res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("[APPOINTMENT ERROR]", error);
    return res.status(500).json({
      message: "Failed to load appointments.",
    });
  }
};

// USER: Cancel pending appointment
exports.cancelMyAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Completed appointments cannot be cancelled.",
      });
    }

    appointment.status = "cancelled";
    appointment.statusUpdatedAt = new Date();
    await appointment.save();

    return res.json({
      success: true,
      message: "Appointment cancelled successfully.",
      appointment,
    });
  } catch (error) {
    console.error("[APPOINTMENT ERROR]", error);
    return res.status(500).json({
      message: "Failed to cancel appointment.",
    });
  }
};

// ADMIN: Get all appointments with optional filters
exports.getAllAppointmentsAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { userName: regex },
        { userEmail: regex },
        { userPhone: regex },
        { service: regex },
        { masterName: regex },
      ];
    }

    const appointments = await Appointment.find(filter)
      .populate("user", "name email lastCuttingDate nextReminderDate")
      .sort({ appointmentDate: -1, createdAt: -1 });

    const stats = {
      total: await Appointment.countDocuments(),
      pending: await Appointment.countDocuments({ status: "pending" }),
      accepted: await Appointment.countDocuments({ status: "accepted" }),
      completed: await Appointment.countDocuments({ status: "completed" }),
      declined: await Appointment.countDocuments({ status: "declined" }),
    };

    return res.json({
      success: true,
      stats,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("[APPOINTMENT ERROR]", error);
    return res.status(500).json({
      message: "Failed to retrieve appointments.",
    });
  }
};

// ADMIN: Update status (Accept, Decline, Complete)
exports.updateAppointmentStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, updateLastCuttingDate } = req.body;

    const allowed = ["pending", "accepted", "declined", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowed.join(", ")}`,
      });
    }

    const appointment = await Appointment.findById(id).populate("user");
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    appointment.status = status;
    if (adminNotes !== undefined) {
      appointment.adminNotes = adminNotes;
    }
    appointment.statusUpdatedAt = new Date();
    await appointment.save();

    // If completed or marked to update cutting date, update user's last cutting date
    if (status === "completed" || (status === "accepted" && updateLastCuttingDate)) {
      if (appointment.user) {
        const user = await User.findById(appointment.user._id);
        if (user) {
          const cutDate = new Date(appointment.appointmentDate);
          user.lastCuttingDate = cutDate;
          const nextDate = new Date(cutDate);
          nextDate.setDate(nextDate.getDate() + 30);
          user.nextReminderDate = nextDate;
          user.lastReminderSentAt = null;
          await user.save();
        }
      }
    }

    // Try sending email update to user
    try {
      if (appointment.userEmail) {
        await sendAppointmentStatusEmail(
          { name: appointment.userName, email: appointment.userEmail },
          appointment,
          status,
          adminNotes
        );
      }
    } catch (emailErr) {
      console.warn("[APPOINTMENT EMAIL WARN]", emailErr.message);
    }

    return res.json({
      success: true,
      message: `Appointment ${status === "accepted" ? "accepted successfully!" : `status changed to ${status}.`}`,
      appointment,
    });
  } catch (error) {
    console.error("[APPOINTMENT ERROR]", error);
    return res.status(500).json({
      message: error.message || "Failed to update appointment status.",
    });
  }
};

// ADMIN: Delete appointment
exports.deleteAppointmentAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    console.error("[APPOINTMENT ERROR]", error);
    return res.status(500).json({
      message: "Failed to delete appointment.",
    });
  }
};

