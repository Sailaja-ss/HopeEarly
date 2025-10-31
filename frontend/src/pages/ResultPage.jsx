import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './ResultPage.css';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { prediction } = location.state || {};

  if (!prediction) {
    navigate("/");
    return null;
  }

  const { prediction: result, confidence, probabilities } = prediction;

  return (
    <div className="result-container">
      <h1>Prediction Result</h1>
      <p className="result-text">
        Based on your input data, the model predicts breast cancer status as{" "}
        <span className={result === "Malignant" ? "text-red" : "text-green"}>
          {result}
        </span>.
      </p>
      <p className="result-text">
        Confidence level: <span className="result-bold">{confidence}%</span>
      </p>
      {probabilities && (
        <div className="probabilities">
          <h3>Probabilities:</h3>
          <ul>
            <li>Benign: {probabilities.Benign}%</li>
            <li>Malignant: {probabilities.Malignant}%</li>
          </ul>
        </div>
      )}
      <button className="back-button" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default ResultPage;
