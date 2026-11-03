const mongoose = require("mongoose");
const Master = require("../models/mastermodel");

// Get all masters (public or admin)
exports.getAllMasters = async (req, res) => {
  try {
    const masters = await Master.find().sort({ createdAt: 1 });
    res.json({ masters });
  } catch (error) {
    console.error("Error fetching masters:", error.message);
    res.status(500).json({ message: "Could not fetch masters." });
  }
};

// Create a new master (Admin only)
exports.createMaster = async (req, res) => {
  try {
    const { name, specialty, experience, bio, phone, avatar, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Master name is required." });
    }

    if (!specialty || !specialty.trim()) {
      return res.status(400).json({ message: "Specialty / role is required." });
    }

    const newMaster = await Master.create({
      name: name.trim(),
      specialty: specialty.trim(),
      experience: experience ? experience.trim() : "3+ Years",
      bio: bio ? bio.trim() : "",
      phone: phone ? phone.trim() : "",
      avatar: avatar || "🧔",
      status: status || "active",
    });

    res.status(201).json({
      message: `Master "${newMaster.name}" added successfully.`,
      master: newMaster,
    });
  } catch (error) {
    console.error("Error creating master:", error.message);
    res.status(500).json({ message: "Could not add master." });
  }
};

// Update master details (Admin only)
exports.updateMaster = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid master ID." });
    }

    const { name, specialty, experience, bio, phone, avatar, status } = req.body;

    const master = await Master.findById(id);

    if (!master) {
      return res.status(404).json({ message: "Master not found." });
    }

    if (name !== undefined && name.trim()) master.name = name.trim();
    if (specialty !== undefined && specialty.trim()) master.specialty = specialty.trim();
    if (experience !== undefined) master.experience = experience.trim();
    if (bio !== undefined) master.bio = bio.trim();
    if (phone !== undefined) master.phone = phone.trim();
    if (avatar !== undefined) master.avatar = avatar;
    if (status !== undefined) master.status = status;

    await master.save();

    res.json({
      message: `Master "${master.name}" details updated successfully.`,
      master,
    });
  } catch (error) {
    console.error("Error updating master:", error.message);
    res.status(500).json({ message: "Could not update master." });
  }
};

// Delete a master (Admin only)
exports.deleteMaster = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid master ID." });
    }

    const deleted = await Master.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Master not found." });
    }

    res.json({
      message: `Master "${deleted.name}" has been removed.`,
      id,
    });
  } catch (error) {
    console.error("Error deleting master:", error.message);
    res.status(500).json({ message: "Could not delete master." });
  }
};
