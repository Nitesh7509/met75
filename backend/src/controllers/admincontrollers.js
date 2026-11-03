const mongoose = require("mongoose");
const User = require("../models/usermodel");
const {
  sendHaircutReminder,
  sendManualCustomerEmail,
} = require("../services/emailservices");

// Add one calendar month, safely handling month-end dates.
function addOneMonth(date) {
  const result = new Date(date);
  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + 1);

  const lastDayOfMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(originalDay, lastDayOfMonth));

  return result;
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select(
        "name email lastCuttingDate nextReminderDate lastReminderSentAt createdAt"
      )
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error("Error fetching all users:", error.message);
    res.status(500).json({ message: "Could not fetch users." });
  }
};

exports.updateCuttingDate = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format to prevent CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid customer ID format.",
      });
    }

    const { lastCuttingDate } = req.body || {};

    if (
      typeof lastCuttingDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(lastCuttingDate)
    ) {
      return res.status(400).json({
        message: "Provide a valid date in YYYY-MM-DD format.",
      });
    }

    const date = new Date(`${lastCuttingDate}T12:00:00.000Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== lastCuttingDate ||
      date > new Date()
    ) {
      return res.status(400).json({
        message: "Haircut date must be a valid date that is not in the future.",
      });
    }

    const user = await User.findOne({
      _id: id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        message: "Customer not found.",
      });
    }

    user.lastCuttingDate = date;
    user.nextReminderDate = addOneMonth(date);
    user.lastReminderSentAt = null;

    await user.save();

    res.json({
      message: "Haircut date updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastCuttingDate: user.lastCuttingDate,
        nextReminderDate: user.nextReminderDate,
        lastReminderSentAt: user.lastReminderSentAt,
      },
    });
  } catch (error) {
    console.error("Error updating cutting date:", error.message);
    res.status(500).json({
      message: "Could not update haircut date.",
    });
  }
};

exports.getDueUsers = async (req, res) => {
  try {
    const now = new Date();

    // In MongoDB BSON, null is less than Date.
    // Explicitly exclude null to prevent newly registered users with no haircut from appearing due.
    const users = await User.find({
      role: "user",
      lastCuttingDate: { $ne: null },
      nextReminderDate: { $ne: null, $lte: now },
    }).select(
      "name email lastCuttingDate nextReminderDate lastReminderSentAt"
    );

    res.json({ users });
  } catch (error) {
    console.error("Error fetching due customers:", error.message);
    res.status(500).json({
      message: "Could not fetch due customers.",
    });
  }
};

exports.sendManualReminder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid customer ID format.",
      });
    }

    const user = await User.findOne({ _id: id, role: "user" });

    if (!user) {
      return res.status(404).json({
        message: "Customer not found.",
      });
    }

    const { subject, message } = req.body || {};

    await sendManualCustomerEmail(user, { subject, message });

    user.lastReminderSentAt = new Date();
    await user.save();

    res.json({
      message: `Reminder email successfully sent to ${user.email}.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastCuttingDate: user.lastCuttingDate,
        nextReminderDate: user.nextReminderDate,
        lastReminderSentAt: user.lastReminderSentAt,
      },
    });
  } catch (error) {
    console.error("Error sending manual reminder email:", error.message);
    res.status(500).json({
      message: `Failed to send email: ${error.message}`,
    });
  }
};

exports.sendBulkDueReminders = async (req, res) => {
  try {
    const now = new Date();

    const dueUsers = await User.find({
      role: "user",
      lastCuttingDate: { $ne: null },
      nextReminderDate: { $ne: null, $lte: now },
    });

    if (dueUsers.length === 0) {
      return res.json({
        message: "No customers are currently due for haircut reminders.",
        sentCount: 0,
      });
    }

    let sentCount = 0;
    const errors = [];

    for (const user of dueUsers) {
      try {
        await sendHaircutReminder(user);
        user.lastReminderSentAt = new Date();
        await user.save();
        sentCount += 1;
      } catch (err) {
        errors.push({ email: user.email, error: err.message });
      }
    }

    res.json({
      message: `Successfully dispatched reminders to ${sentCount} customer(s).`,
      sentCount,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error sending bulk due reminders:", error.message);
    res.status(500).json({
      message: `Failed to send bulk reminders: ${error.message}`,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID format." });
    }

    const deleted = await User.findOneAndDelete({ _id: id, role: "user" });

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json({
      message: `Customer "${deleted.name}" (${deleted.email}) deleted successfully.`,
      id,
    });
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    res.status(500).json({ message: "Could not delete customer." });
  }
};

