const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authmiddleware");
const {
  requestAppointment,
  getMyFellowAppointments,
  cancelMyAppointment,
} = require("../controllers/appointmentcontroller");

router.use(protect);

router.post("/", requestAppointment);
router.get("/my", getMyFellowAppointments);
router.patch("/:id/cancel", cancelMyAppointment);

module.exports = router;

