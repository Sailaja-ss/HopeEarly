import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js"; // ✅ new route
import pool from "./db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend API running...");
});

// auth routes
app.use("/api/auth", authRoutes);

// prediction route
app.use("/api", predictionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Connected to MySQL database");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
  console.log(`🚀 Server running on port ${PORT}`);
});
