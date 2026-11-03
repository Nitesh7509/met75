const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = require("./src/app");
const connectDB = require("./src/database/db");
const startReminderJob = require("./src/jobs/remiderjobs");

async function startServer() {
  const { JWT_SECRET, MONGO_URI, PORT = 5000 } = process.env;

  if (!JWT_SECRET || !MONGO_URI) {
    throw new Error("JWT_SECRET and MONGO_URI are required.");
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  startReminderJob();
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
