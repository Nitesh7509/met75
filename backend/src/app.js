const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const { getAllMasters } = require("./controllers/mastercontroller");
const { getAllHairStyles } = require("./controllers/hairstylecontroller");
const { getAllServices } = require("./controllers/servicecontroller");

const app = express();

// Flexible CORS setup supporting all local dev ports (5173, 5174, etc.) and CLIENT_URL
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Permissive fallback for local network dev
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Debug request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[DEBUG LOG] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms`
    );
  });
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Salon Management API is running." });
});

app.get("/api/masters", getAllMasters);
app.get("/api/hairstyles", getAllHairStyles);
app.get("/api/services", getAllServices);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error.",
  });
});

module.exports = app;
