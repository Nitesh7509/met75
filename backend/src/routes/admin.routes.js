const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/authmiddleware");

const {
  getAllUsers,
  updateCuttingDate,
  getDueUsers,
  sendManualReminder,
  sendBulkDueReminders,
  deleteUser,
} = require("../controllers/admincontrollers");

const {
  getAllMasters,
  createMaster,
  updateMaster,
  deleteMaster,
} = require("../controllers/mastercontroller");

const {
  getAllHairStyles,
  createHairStyle,
  updateHairStyle,
  deleteHairStyle,
} = require("../controllers/hairstylecontroller");

const {
  getAllAppointmentsAdmin,
  updateAppointmentStatusAdmin,
  deleteAppointmentAdmin,
} = require("../controllers/appointmentcontroller");

const {
  getAllServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/servicecontroller");

router.use(protect, adminOnly);

// Customer management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/reminders", getDueUsers);
router.patch("/users/:id/cutting-date", updateCuttingDate);
router.post("/users/:id/send-email", sendManualReminder);
router.post("/send-due-reminders", sendBulkDueReminders);

// Master (Stylist / Barber) management
router.get("/masters", getAllMasters);
router.post("/masters", createMaster);
router.patch("/masters/:id", updateMaster);
router.put("/masters/:id", updateMaster);
router.delete("/masters/:id", deleteMaster);

// Haircut Style & Design management
router.get("/hairstyles", getAllHairStyles);
router.post("/hairstyles", createHairStyle);
router.patch("/hairstyles/:id", updateHairStyle);
router.put("/hairstyles/:id", updateHairStyle);
router.delete("/hairstyles/:id", deleteHairStyle);

// Appointment management
router.get("/appointments", getAllAppointmentsAdmin);
router.patch("/appointments/:id/status", updateAppointmentStatusAdmin);
router.delete("/appointments/:id", deleteAppointmentAdmin);

// Salon Services & Amount / Pricing management
router.get("/services", getAllServices);
router.post("/services", createService);
router.patch("/services/:id", updateService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

module.exports = router;
