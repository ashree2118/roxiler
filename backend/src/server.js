import express from "express";
import cors from "cors";
import prisma, { testConnection, disconnect } from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/db-test", async (_req, res) => {
  try {
    await testConnection();
    const userCount = await prisma.user.count();
    res.json({
      status: "connected",
      message: "Database connection successful",
      userCount,
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

async function startServer() {
  try {
    await testConnection();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
}

async function shutdown() {
  await disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
