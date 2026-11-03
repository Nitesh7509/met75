const nodemailer = require("nodemailer");

const SALON_NAME = process.env.SALON_NAME || "MET75 Salon";
const SALON_TAGLINE = "Luxury Salon & Barbershop";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Master responsive HTML email layout for MET75 Salon
 */
function renderSalonEmailLayout({
  headerBadge = "SALON NOTIFICATION",
  title,
  subtitle = "",
  recipientName = "Valued Customer",
  bodyHtml,
  ctaText = "",
  ctaUrl = "",
  accentColor = "#66513e",
  statusBadgeText = "",
  statusBadgeColor = "#fef3c7",
  statusBadgeTextColor = "#92400e",
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - ${SALON_NAME}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f6f4ef;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #24231f;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    a {
      text-decoration: none;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f4ef;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f6f4ef; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e7e0d5; box-shadow: 0 4px 20px rgba(57, 41, 24, 0.06);">
          
          <!-- Brand Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #241d1a 0%, #392918 100%); padding: 32px 28px; text-align: center; border-bottom: 3px solid #c5a880;">
              <!-- Salon Scissors Icon Badge -->
              <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; font-size: 22px; margin-bottom: 12px;">
                ✂️
              </div>
              <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: bold; letter-spacing: 2.5px; color: #ffffff; text-transform: uppercase;">
                ${SALON_NAME}
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #d6c6b2; text-transform: uppercase;">
                ${SALON_TAGLINE}
              </p>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              
              <!-- Category Badge -->
              <div style="margin-bottom: 12px;">
                <span style="display: inline-block; padding: 4px 12px; background-color: #f4efe8; border: 1px solid #e2dacd; border-radius: 20px; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: #66513e; text-transform: uppercase;">
                  ${headerBadge}
                </span>
              </div>

              <!-- Title & Subtitle -->
              <h2 style="margin: 0 0 8px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; color: #24231f; line-height: 1.3;">
                ${title}
              </h2>
              ${
                subtitle
                  ? `<p style="margin: 0 0 20px 0; font-size: 14px; color: #767067; line-height: 1.5;">${subtitle}</p>`
                  : ""
              }

              <!-- Greeting -->
              <p style="margin: 16px 0; font-size: 15px; color: #24231f; line-height: 1.6;">
                Hello <strong>${recipientName}</strong>,
              </p>

              <!-- Custom Body HTML -->
              <div style="margin: 20px 0;">
                ${bodyHtml}
              </div>

              <!-- Status Badge (if provided) -->
              ${
                statusBadgeText
                  ? `
                <div style="margin: 20px 0; text-align: center;">
                  <span style="display: inline-block; padding: 8px 18px; background-color: ${statusBadgeColor}; color: ${statusBadgeTextColor}; font-size: 12px; font-weight: 800; letter-spacing: 1px; border-radius: 8px; text-transform: uppercase;">
                    ${statusBadgeText}
                  </span>
                </div>`
                  : ""
              }

              <!-- Call To Action Button (if provided) -->
              ${
                ctaText && ctaUrl
                  ? `
                <div style="margin: 32px 0 24px 0; text-align: center;">
                  <a href="${ctaUrl}" style="display: inline-block; padding: 14px 32px; background-color: ${accentColor}; color: #ffffff; font-size: 14px; font-weight: bold; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(102, 81, 62, 0.25); text-align: center;">
                    ${ctaText}
                  </a>
                </div>`
                  : ""
              }

              <!-- Quick Studio Snapshot Box -->
              <div style="background-color: #faf8f5; border: 1px solid #ebd9c8; border-radius: 14px; padding: 18px 20px; margin-top: 30px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #66513e;">
                  💈 ${SALON_NAME} Studio Information
                </p>
                <p style="margin: 2px 0; font-size: 12px; color: #6a645d; line-height: 1.6;">
                  <strong>Working Hours:</strong> Monday – Sunday: 9:00 AM – 8:00 PM (Daily)<br />
                  <strong>Signature Grooming:</strong> Precision Haircuts • Royal Hot-Towel Shaving • Beard Sculpting • Facial Care<br />
                  <strong>Walk-ins & Appointments:</strong> Both welcomed anytime
                </p>
              </div>

              <!-- Sign-off -->
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f0ebe1;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #392918;">
                  Warm regards,
                </p>
                <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 700; color: #66513e;">
                  The ${SALON_NAME} Master Team
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #1f1d1a; padding: 24px 28px; text-align: center; border-top: 1px solid #332d27;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #e2dacd; letter-spacing: 1px;">
                ${SALON_NAME} MANAGEMENT SYSTEM
              </p>
              <p style="margin: 0 0 10px 0; font-size: 11px; color: #8e877e; line-height: 1.5;">
                You are receiving this notification because you have a registered profile with ${SALON_NAME}.
              </p>
              <p style="margin: 0; font-size: 11px; color: #6b655d;">
                © ${new Date().getFullYear()} ${SALON_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. AUTOMATED 30-DAY HAIRCUT REMINDER
 */
async function sendHaircutReminder(user) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is not configured in .env");
  }

  const formattedDate = user.lastCuttingDate
    ? new Date(user.lastCuttingDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: process.env.TIMEZONE || "Asia/Kolkata",
      })
    : "N/A";

  const nextDueDate = user.nextReminderDate
    ? new Date(user.nextReminderDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: process.env.TIMEZONE || "Asia/Kolkata",
      })
    : "Today";

  const bodyHtml = `
    <div style="background-color: #fbf9f6; border: 1px solid #ebd9c8; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #392918; line-height: 1.6;">
        It has been approximately <strong>30 days</strong> since your last haircut at <strong>${SALON_NAME}</strong>.
      </p>
      
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 14px; border-top: 1px dashed #ded8ce; padding-top: 14px;">
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #767067;">Last Haircut Date:</td>
          <td style="padding: 6px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #767067;">Cycle Duration:</td>
          <td style="padding: 6px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">30 Days Complete</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #767067;">Next Recommended Cut:</td>
          <td style="padding: 6px 0; font-size: 13px; font-weight: bold; color: #66513e; text-align: right;">${nextDueDate}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 14px; color: #5a554e; line-height: 1.6; margin: 0;">
      A fresh haircut ensures your fade, taper, and hairline remain sharply defined. Our master stylists are ready to give you the perfect grooming experience.
    </p>
  `;

  const html = renderSalonEmailLayout({
    headerBadge: "30-DAY HAIRCUT REMINDER",
    title: "Time for Your Next Haircut!",
    subtitle: `Keep your style looking crisp with ${SALON_NAME}`,
    recipientName: user.name,
    bodyHtml,
    ctaText: `📅 Book Your Appointment at ${SALON_NAME}`,
    ctaUrl: `${CLIENT_URL}/dashboard`,
    statusBadgeText: "30 DAYS CYCLE COMPLETE • RECUT DUE",
    statusBadgeColor: "#fef3c7",
    statusBadgeTextColor: "#92400e",
  });

  const text = [
    `Hello ${user.name},`,
    "",
    `It's time for your next haircut at ${SALON_NAME}!`,
    `Your last haircut date was ${formattedDate}. Exactly 30 days have passed.`,
    "",
    "Book your next appointment online or visit our studio:",
    `${CLIENT_URL}/dashboard`,
    "",
    `Working Hours: Monday – Sunday: 9:00 AM – 8:00 PM`,
    "",
    `Thank you for choosing ${SALON_NAME}!`,
    `The ${SALON_NAME} Master Team`,
  ].join("\n");

  return transporter.sendMail({
    from: `"${SALON_NAME}" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `✂️ Time for Your Next Haircut! - ${SALON_NAME}`,
    text,
    html,
  });
}

/**
 * 2. CUSTOM ADMIN / MANUAL CUSTOMER REMINDER
 */
async function sendManualCustomerEmail(user, { subject, message } = {}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is not configured in .env");
  }

  const formattedDate = user.lastCuttingDate
    ? new Date(user.lastCuttingDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: process.env.TIMEZONE || "Asia/Kolkata",
      })
    : "Not recorded yet";

  const emailSubject = subject?.trim() || `Your Next Haircut Visit - ${SALON_NAME}`;
  const customMessage = message?.trim() || [
    `This is a friendly reminder from ${SALON_NAME} that your next haircut is due!`,
    `Your last haircut was recorded on ${formattedDate}.`,
    `We would love to see you again soon at our studio.`,
  ].join("\n\n");

  const safeHtmlMessage = customMessage.replace(/\n/g, "<br/>");

  const bodyHtml = `
    <div style="background-color: #fbf9f6; border-left: 4px solid #66513e; border-radius: 8px; padding: 20px; margin: 16px 0; color: #24231f; line-height: 1.6; font-size: 14px;">
      ${safeHtmlMessage}
    </div>

    <div style="background-color: #ffffff; border: 1px solid #e7e0d5; border-radius: 12px; padding: 14px 18px; margin-top: 18px;">
      <p style="margin: 0; font-size: 12px; color: #767067;">
        <strong>Your Last Haircut Date on File:</strong> ${formattedDate}
      </p>
    </div>
  `;

  const html = renderSalonEmailLayout({
    headerBadge: "OFFICIAL SALON NOTIFICATION",
    title: emailSubject,
    subtitle: `Direct communication from ${SALON_NAME}`,
    recipientName: user.name,
    bodyHtml,
    ctaText: `Schedule Session on ${SALON_NAME}`,
    ctaUrl: `${CLIENT_URL}/dashboard`,
  });

  const text = [
    `Hello ${user.name},`,
    "",
    customMessage,
    "",
    `Last recorded haircut date: ${formattedDate}`,
    "",
    `Client Portal: ${CLIENT_URL}/dashboard`,
    "",
    `Thank you for choosing ${SALON_NAME}!`,
    `The ${SALON_NAME} Master Team`,
  ].join("\n");

  return transporter.sendMail({
    from: `"${SALON_NAME}" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `${emailSubject} - ${SALON_NAME}`,
    text,
    html,
  });
}

/**
 * 3. PASSWORD RESET EMAIL (OTP & DIRECT LINK)
 */
async function sendPasswordResetEmail(user, otp, resetLink) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD is not configured in .env");
  }

  const bodyHtml = `
    <p style="font-size: 14px; color: #5a554e; line-height: 1.6; margin: 0 0 20px 0;">
      We received a request to reset the password for your account on <strong>${SALON_NAME}</strong>. Enter the 6-digit verification code below on the reset page:
    </p>

    <!-- Large OTP Display Card -->
    <div style="background-color: #faf7f2; border: 2px dashed #66513e; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
      <p style="margin: 0; font-size: 11px; color: #8a7057; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">
        YOUR 6-DIGIT VERIFICATION CODE
      </p>
      <h1 style="margin: 10px 0; font-size: 40px; letter-spacing: 8px; color: #24231f; font-family: 'Courier New', Courier, monospace; font-weight: bold;">
        ${otp}
      </h1>
      <p style="margin: 0; font-size: 12px; font-weight: 600; color: #817d76;">
        ⏱ Valid for 15 minutes only
      </p>
    </div>

    <p style="font-size: 13px; color: #767067; line-height: 1.6; margin: 20px 0 0 0;">
      You can also click the button below to directly reset your password in your browser:
    </p>
  `;

  const html = renderSalonEmailLayout({
    headerBadge: "SECURITY VERIFICATION",
    title: "Password Reset Code",
    subtitle: `Secure account access for ${SALON_NAME}`,
    recipientName: user.name,
    bodyHtml,
    ctaText: "Reset Password Directly",
    ctaUrl: resetLink,
  });

  const text = [
    `Hello ${user.name},`,
    "",
    `We received a request to reset your password on ${SALON_NAME}.`,
    "",
    `Your 6-Digit Password Reset Code: ${otp}`,
    "(This code expires in 15 minutes)",
    "",
    "Or reset directly using this link:",
    resetLink,
    "",
    "If you did not request this change, please ignore this email. Your account remains secure.",
    "",
    `The ${SALON_NAME} Security Team`,
  ].join("\n");

  return transporter.sendMail({
    from: `"${SALON_NAME}" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `🔐 Password Reset Code: ${otp} - ${SALON_NAME}`,
    text,
    html,
  });
}

/**
 * 4. APPOINTMENT REQUEST RECEIVED (CLIENT CONFIRMATION)
 */
async function sendAppointmentRequestEmail(user, appointment) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("[EMAIL NOTE] Email credentials not configured, skipped sending request email.");
    return;
  }

  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const bodyHtml = `
    <p style="font-size: 14px; color: #5a554e; line-height: 1.6; margin: 0 0 16px 0;">
      Thank you for booking with <strong>${SALON_NAME}</strong>! We have received your appointment request and our salon masters are reviewing your chosen schedule.
    </p>

    <!-- Appointment Details Table -->
    <div style="background-color: #fbf9f6; border: 1px solid #ebd9c8; border-radius: 14px; padding: 20px; margin: 20px 0;">
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Selected Service:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">${appointment.service}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Master Stylist:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">${appointment.masterName || "Any Available Master"}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Requested Date:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Time Slot:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #66513e; text-align: right;">${appointment.timeSlot}</td>
        </tr>
        ${
          appointment.notes
            ? `<tr>
                <td style="padding: 7px 0; font-size: 13px; color: #767067;">Notes:</td>
                <td style="padding: 7px 0; font-size: 13px; color: #24231f; text-align: right;">${appointment.notes}</td>
              </tr>`
            : ""
        }
      </table>
    </div>

    <p style="font-size: 13px; color: #767067; line-height: 1.6; margin: 0;">
      You will receive a confirmation email once your master barber accepts the session. You can also monitor your live status anytime in your client dashboard.
    </p>
  `;

  const html = renderSalonEmailLayout({
    headerBadge: "APPOINTMENT REQUEST RECEIVED",
    title: "Appointment Request Received ⏳",
    subtitle: `Your booking request has reached ${SALON_NAME}`,
    recipientName: user.name,
    bodyHtml,
    ctaText: "Check Booking Status in Portal",
    ctaUrl: `${CLIENT_URL}/dashboard`,
    statusBadgeText: "STATUS: PENDING SALON CONFIRMATION",
    statusBadgeColor: "#fef3c7",
    statusBadgeTextColor: "#92400e",
  });

  const text = [
    `Hello ${user.name},`,
    "",
    `Thank you for requesting an appointment at ${SALON_NAME}!`,
    "",
    `Service: ${appointment.service}`,
    `Master Stylist: ${appointment.masterName || "Any Available Master"}`,
    `Date: ${formattedDate}`,
    `Time Slot: ${appointment.timeSlot}`,
    appointment.notes ? `Notes: ${appointment.notes}` : "",
    "",
    "Status: PENDING SALON CONFIRMATION",
    "",
    `Check your booking live: ${CLIENT_URL}/dashboard`,
    "",
    `The ${SALON_NAME} Master Team`,
  ].join("\n");

  return transporter.sendMail({
    from: `"${SALON_NAME}" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `📅 Appointment Request: ${appointment.service} on ${formattedDate} - ${SALON_NAME}`,
    text,
    html,
  });
}

/**
 * 5. APPOINTMENT STATUS UPDATE (ACCEPTED / CONFIRMED / CANCELLED / DECLINED)
 */
async function sendAppointmentStatusEmail(user, appointment, newStatus, adminNote = "") {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("[EMAIL NOTE] Email credentials not configured, skipped sending status email.");
    return;
  }

  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isAccepted = newStatus === "accepted";
  const isCompleted = newStatus === "completed";
  const isDeclined = newStatus === "declined";

  let statusTitle = "Appointment Status Update";
  let statusBadgeText = `STATUS: ${newStatus.toUpperCase()}`;
  let statusBadgeColor = "#f3f4f6";
  let statusBadgeTextColor = "#374151";

  if (isAccepted) {
    statusTitle = "Appointment Accepted & Confirmed! 🎉";
    statusBadgeText = "STATUS: ACCEPTED & CONFIRMED ✓";
    statusBadgeColor = "#d1fae5";
    statusBadgeTextColor = "#065f46";
  } else if (isCompleted) {
    statusTitle = "Haircut Session Completed! ✂️";
    statusBadgeText = "STATUS: COMPLETED ✓";
    statusBadgeColor = "#e0e7ff";
    statusBadgeTextColor = "#3730a3";
  } else if (isDeclined) {
    statusTitle = "Appointment Request Update";
    statusBadgeText = "STATUS: DECLINED";
    statusBadgeColor = "#fee2e2";
    statusBadgeTextColor = "#991b1b";
  }

  const bodyHtml = `
    <p style="font-size: 15px; color: #24231f; line-height: 1.6; margin: 0 0 16px 0;">
      ${
        isAccepted
          ? `Great news! Your haircut & grooming session at <strong>${SALON_NAME}</strong> has been <strong>accepted and confirmed</strong> by our salon master.`
          : isCompleted
          ? `Thank you for visiting <strong>${SALON_NAME}</strong>! Your haircut session was marked as completed. We have logged your haircut date to ensure your 30-day reminder starts accurately.`
          : `Your salon appointment status has been updated to <strong>${newStatus}</strong>.`
      }
    </p>

    <!-- Appointment Summary Card -->
    <div style="background-color: #fbf9f6; border: 1px solid #ebd9c8; border-radius: 14px; padding: 20px; margin: 20px 0;">
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Service:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">${appointment.service}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Master Barber:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">${appointment.masterName || "Assigned Salon Master"}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Scheduled Date:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #24231f; text-align: right;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; font-size: 13px; color: #767067;">Time Slot:</td>
          <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #66513e; text-align: right;">${appointment.timeSlot}</td>
        </tr>
        ${
          adminNote
            ? `<tr>
                <td style="padding: 7px 0; font-size: 13px; color: #767067;">Salon Note:</td>
                <td style="padding: 7px 0; font-size: 13px; font-weight: bold; color: #b45309; text-align: right;">${adminNote}</td>
              </tr>`
            : ""
        }
      </table>
    </div>

    ${
      isAccepted
        ? `<div style="background-color: #ecfdf5; border-radius: 10px; padding: 14px 18px; margin: 18px 0; text-align: center;">
             <p style="margin: 0; font-size: 13px; font-weight: 700; color: #047857;">
               ★ Please arrive 5 minutes before your scheduled slot. We look forward to seeing you at ${SALON_NAME}!
             </p>
           </div>`
        : ""
    }
  `;

  const html = renderSalonEmailLayout({
    headerBadge: isAccepted ? "BOOKING CONFIRMED" : "BOOKING UPDATE",
    title: statusTitle,
    subtitle: `Appointment status at ${SALON_NAME}`,
    recipientName: user.name,
    bodyHtml,
    ctaText: `View Details on ${SALON_NAME}`,
    ctaUrl: `${CLIENT_URL}/dashboard`,
    statusBadgeText,
    statusBadgeColor,
    statusBadgeTextColor,
  });

  const text = [
    `Hello ${user.name},`,
    "",
    isAccepted
      ? `Your appointment at ${SALON_NAME} has been accepted and confirmed!`
      : `Your appointment status at ${SALON_NAME} has been updated to: ${newStatus.toUpperCase()}`,
    "",
    `Service: ${appointment.service}`,
    `Master Barber: ${appointment.masterName || "Assigned Salon Master"}`,
    `Date: ${formattedDate}`,
    `Time Slot: ${appointment.timeSlot}`,
    adminNote ? `Salon Note: ${adminNote}` : "",
    "",
    `Client Dashboard: ${CLIENT_URL}/dashboard`,
    "",
    `Thank you for choosing ${SALON_NAME}!`,
    `The ${SALON_NAME} Master Team`,
  ].join("\n");

  return transporter.sendMail({
    from: `"${SALON_NAME}" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `${statusTitle} - ${appointment.service} | ${SALON_NAME}`,
    text,
    html,
  });
}

/**
 * 6. WELCOME EMAIL ON REGISTRATION
 */
async function sendWelcomeEmail(user) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("[EMAIL NOTE] Email credentials not configured, skipped sending welcome email.");
    return;
  }

  const bodyHtml = `
    <p style="font-size: 15px; color: #24231f; line-height: 1.6; margin: 0 0 16px 0;">
      Welcome to <strong>${SALON_NAME}</strong>! We are thrilled to have you join our grooming family. Your personal salon client portal is now active.
    </p>

    <!-- Welcome Feature Highlights Box -->
    <div style="background-color: #fbf9f6; border: 1px solid #ebd9c8; border-radius: 14px; padding: 22px 20px; margin: 20px 0;">
      <p style="margin: 0 0 14px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #66513e;">
        What you can do with your account:
      </p>

      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="top" style="padding: 8px 0; width: 32px; font-size: 18px;">📅</td>
          <td valign="top" style="padding: 8px 0;">
            <strong style="color: #24231f; font-size: 13px;">Instant Appointment Requests</strong>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6a645d; line-height: 1.5;">
              Choose your preferred hairstyle, pick an available master barber, and select your ideal time slot online.
            </p>
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding: 8px 0; width: 32px; font-size: 18px;">⏱</td>
          <td valign="top" style="padding: 8px 0;">
            <strong style="color: #24231f; font-size: 13px;">Automated 30-Day Reminder Engine</strong>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6a645d; line-height: 1.5;">
              Never worry about tracking your haircut cadence. We automatically notify you on day 30 so your fade is always on point.
            </p>
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding: 8px 0; width: 32px; font-size: 18px;">✂️</td>
          <td valign="top" style="padding: 8px 0;">
            <strong style="color: #24231f; font-size: 13px;">Hair Designs & Multi-Angle Catalog</strong>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6a645d; line-height: 1.5;">
              Browse curated cuts with full-screen angle views, face shape matching, and recommended styling products.
            </p>
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding: 8px 0; width: 32px; font-size: 18px;">💰</td>
          <td valign="top" style="padding: 8px 0;">
            <strong style="color: #24231f; font-size: 13px;">Transparent Pricing & Estimate Calculator</strong>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6a645d; line-height: 1.5;">
              Explore our complete rate card for haircuts, hot-towel shaves, beard trims, and facials with zero hidden fees.
            </p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Registered Details Box -->
    <div style="background-color: #ffffff; border: 1px solid #e7e0d5; border-radius: 12px; padding: 14px 18px; margin: 18px 0;">
      <p style="margin: 0; font-size: 12px; color: #767067;">
        <strong>Registered Email:</strong> ${user.email}<br />
        <strong>Client Name:</strong> ${user.name}
      </p>
    </div>

    <p style="font-size: 14px; color: #5a554e; line-height: 1.6; margin: 16px 0 0 0;">
      Ready for your first session? Click below to book an appointment or explore haircut inspirations:
    </p>
  `;

  const html = renderSalonEmailLayout({
    headerBadge: "WELCOME TO THE SALON FAMILY",
    title: `Welcome to ${SALON_NAME}! 👋`,
    subtitle: "Your premier grooming journey begins here.",
    recipientName: user.name,
    bodyHtml,
    ctaText: `Book Your First Haircut at ${SALON_NAME}`,
    ctaUrl: `${CLIENT_URL}/dashboard`,
    statusBadgeText: "MEMBERSHIP ACTIVE ✓",
    statusBadgeColor: "#ecfdf5",
    statusBadgeTextColor: "#047857",
  });

  const text = [
    `Hello ${user.name},`,
    "",
    `Welcome to ${SALON_NAME}! We are thrilled to have you join our salon family.`,
    "",
    "With your new account, you can:",
    "• Request haircut & grooming appointments online",
    "• Receive automated 30-day reminders when your fade or trim is due",
    "• Browse hair designs with 360-degree angles and styling tips",
    "• View our full rate card and calculate your service package",
    "",
    `Your Client Portal: ${CLIENT_URL}/dashboard`,
    "",
    `Hours: Monday – Sunday: 9:00 AM – 8:00 PM`,
    "",
    `Thank you for choosing ${SALON_NAME}!`,
    `The ${SALON_NAME} Master Team`,
  ].join("\n");

  return transporter.sendMail({
    from: `"${SALON_NAME}" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `👋 Welcome to ${SALON_NAME}! Your Grooming Journey Begins`,
    text,
    html,
  });
}

module.exports = {
  SALON_NAME,
  SALON_TAGLINE,
  sendHaircutReminder,
  sendManualCustomerEmail,
  sendPasswordResetEmail,
  sendAppointmentRequestEmail,
  sendAppointmentStatusEmail,
  sendWelcomeEmail,
  verifyEmailConnection: () => transporter.verify(),
};
