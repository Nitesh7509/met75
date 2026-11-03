const cron = require("node-cron");
const User = require("../models/usermodel");
const {
  sendHaircutReminder,
} = require("../services/emailservices");

function startReminderJob() {
  // Run every day at 09:00 AM in configured timezone (default: Asia/Kolkata)
  const timezone = process.env.TIMEZONE || "Asia/Kolkata";

  cron.schedule(
    "0 9 * * *",
    async () => {
      console.log(`[CRON] Checking due haircut reminders at 09:00 AM (${timezone})...`);

      const now = new Date();

      try {
        const dueUsers = await User.find({
          role: "user",
          lastCuttingDate: { $ne: null },
          nextReminderDate: { $ne: null, $lte: now },
          lastReminderSentAt: null,
        });

        console.log(`[CRON] Found ${dueUsers.length} customer(s) due for reminders.`);

        for (const user of dueUsers) {
          try {
            await sendHaircutReminder(user);

            user.lastReminderSentAt = new Date();
            await user.save();

            console.log(`[CRON] Reminder successfully sent to ${user.email}`);
          } catch (error) {
            console.error(
              `[CRON] Failed to send reminder to ${user.email}:`,
              error.message
            );
          }
        }
      } catch (error) {
        console.error("[CRON] Reminder job failed:", error.message);
      }
    },
    {
      timezone,
    }
  );

  console.log(`Daily reminder job scheduled (09:00 AM, timezone: ${timezone}).`);
}

module.exports = startReminderJob;
