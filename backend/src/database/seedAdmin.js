const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const User = require("../models/usermodel");

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  let admin = await User.findOne({ email: "admin@salon.com" });

  if (admin) {
    admin.role = "admin";
    admin.password = "Admin@123456";
    await admin.save();
    console.log("Admin account updated: admin@salon.com / Admin@123456");
  } else {
    admin = await User.create({
      name: "Salon Admin",
      email: "admin@salon.com",
      password: "Admin@123456",
      role: "admin",
    });
    console.log("Admin account created: admin@salon.com / Admin@123456");
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err.message);
  process.exit(1);
});

