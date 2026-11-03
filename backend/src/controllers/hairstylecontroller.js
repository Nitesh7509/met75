const mongoose = require("mongoose");
const HairStyle = require("../models/hairstylemodel");

// Helper to sanitize images array
function sanitizeImages(images, imageUrl) {
  let imgArray = [];
  if (Array.isArray(images)) {
    imgArray = images.map((u) => (typeof u === "string" ? u.trim() : "")).filter(Boolean);
  } else if (typeof images === "string" && images.trim()) {
    imgArray = images
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter(Boolean);
  }

  if (imgArray.length === 0 && imageUrl && imageUrl.trim()) {
    imgArray = [imageUrl.trim()];
  }

  return imgArray;
}

// Get all hairstyles (Public or Admin)
exports.getAllHairStyles = async (req, res) => {
  try {
    const hairStyles = await HairStyle.find().sort({ createdAt: 1 });
    res.json({ hairStyles });
  } catch (error) {
    console.error("Error fetching hairstyles:", error.message);
    res.status(500).json({ message: "Could not fetch hairstyles." });
  }
};

// Create a new haircut style (Admin only)
exports.createHairStyle = async (req, res) => {
  try {
    const {
      title,
      category,
      icon,
      imageUrl,
      images,
      cycle,
      hairType,
      faceShape,
      product,
      description,
      stylingTips,
      masterProfile,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Style title is required." });
    }

    const imgArray = sanitizeImages(images, imageUrl);
    const mainImg = imgArray.length > 0 ? imgArray[0] : (imageUrl ? imageUrl.trim() : "");

    const createdStyle = await HairStyle.create({
      title: title.trim(),
      category: category ? category.trim() : "Fades & Tapers",
      icon: icon || "✂️",
      imageUrl: mainImg,
      images: imgArray,
      cycle: cycle ? cycle.trim() : "3 - 4 Weeks",
      hairType: hairType ? hairType.trim() : "All hair types",
      faceShape: faceShape ? faceShape.trim() : "All face shapes",
      product: product ? product.trim() : "Matte Clay",
      description: description ? description.trim() : "",
      stylingTips: stylingTips ? stylingTips.trim() : "",
      masterProfile: masterProfile ? masterProfile.trim() : "MET75 Master Team",
    });

    res.status(201).json({
      message: `Haircut style "${createdStyle.title}" added successfully.`,
      hairStyle: createdStyle,
    });
  } catch (error) {
    console.error("Error creating hairstyle:", error.message);
    res.status(500).json({ message: "Could not add hairstyle." });
  }
};

// Update haircut style (Admin only)
exports.updateHairStyle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hairstyle ID." });
    }

    const style = await HairStyle.findById(id);
    if (!style) {
      return res.status(404).json({ message: "Hairstyle not found." });
    }

    const fields = [
      "title",
      "category",
      "icon",
      "cycle",
      "hairType",
      "faceShape",
      "product",
      "description",
      "stylingTips",
      "masterProfile",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        style[field] = typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
      }
    });

    if (req.body.images !== undefined || req.body.imageUrl !== undefined) {
      const imgArray = sanitizeImages(req.body.images, req.body.imageUrl);
      style.images = imgArray;
      if (imgArray.length > 0) {
        style.imageUrl = imgArray[0];
      } else if (req.body.imageUrl !== undefined) {
        style.imageUrl = req.body.imageUrl.trim();
      }
    }

    await style.save();

    res.json({
      message: `Haircut style "${style.title}" updated successfully.`,
      hairStyle: style,
    });
  } catch (error) {
    console.error("Error updating hairstyle:", error.message);
    res.status(500).json({ message: "Could not update hairstyle." });
  }
};

// Delete haircut style (Admin only)
exports.deleteHairStyle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hairstyle ID." });
    }

    const deleted = await HairStyle.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Hairstyle not found." });
    }

    res.json({
      message: `Haircut style "${deleted.title}" deleted successfully.`,
      id,
    });
  } catch (error) {
    console.error("Error deleting hairstyle:", error.message);
    res.status(500).json({ message: "Could not delete hairstyle." });
  }
};
