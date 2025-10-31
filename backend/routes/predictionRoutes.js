// backend/routes/predictionRoutes.js
import express from "express";
import axios from "axios";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; //match token structure from login
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

//POST /api/predict
router.post("/predict", verifyToken, async (req, res) => {
  try {
    const inputData = req.body;

    // Validate input (must have 30 features)
    if (!inputData || Object.keys(inputData).length !== 30) {
      return res.status(400).json({ message: "Invalid input: 30 features required" });
    }

    // Call FastAPI backend
    const fastApiUrl = process.env.FASTAPI_URL || "http://127.0.0.1:8000";
    const response = await axios.post(`${fastApiUrl}/predict`, inputData, {
      headers: { "Content-Type": "application/json" },
    });

    const { prediction, confidence, probabilities } = response.data;

    // Debugging logs
    // console.log("🧠 Saving Prediction Details:", {
    //   userId: req.userId,
    //   hasInputData: !!inputData,
    //   prediction,
    //   confidence,
    // });
    // if (!req.userId) console.error("❌ userId is undefined!");
    // if (!prediction) console.error("❌ prediction is undefined!");

    // Save to DB
    await db.execute(
      `INSERT INTO predictions (user_id, input_data, result, precautions, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [
        req.userId || null,
        JSON.stringify(inputData) || null,
        prediction || null,
        null, // precautions optional
      ]
    );

    // Send response to frontend
    res.json({ prediction, confidence, probabilities });
  } catch (err) {
    console.error("Prediction error:", err.message);

    if (err.response) {
      console.error("FastAPI error:", err.response.data);
      return res.status(err.response.status).json(err.response.data);
    }

    res.status(500).json({ message: "Prediction failed" });
  }
});

export default router;
