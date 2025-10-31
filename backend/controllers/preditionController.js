// backend/controllers/predictionController.js
import axios from "axios";
import pool from "../config/db.js";

export const predictCancer = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length !== 30) {
      return res.status(400).json({ message: "Invalid input: 30 features required" });
    }

    // Send data to FastAPI for prediction
    const response = await axios.post(
      `${process.env.FASTAPI_URL || "http://127.0.0.1:8000"}/predict`,
      req.body
    );

    const { prediction, confidence, probabilities } = response.data;

    const userId = req.user?.id || 1;

    // Store prediction record in MySQL
    await pool.query(
      "INSERT INTO predictions (user_id, input_data, result) VALUES (?, ?, ?)",
      [userId, JSON.stringify(req.body), prediction]
    );

    res.json({ prediction, confidence, probabilities });
  } catch (err) {
    if (err.response) {
      console.error("FastAPI error:", err.response.data);
      return res.status(err.response.status).json(err.response.data);
    }
    console.error("Prediction error:", err.message);
    res.status(500).json({ message: "Prediction failed" });
  }
};
