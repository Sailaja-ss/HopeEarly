// src/pages/Welcome.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import AuthModal from "./AuthModal";
import logo from "../assets/logo.jpg";
import background from "../assets/background.jpg";
import testImage from "../assets/test.webp";
import { useAuth } from "./AuthContext";

const Welcome = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();

  const handlePredictClick = () => {
    if (isLoggedIn) {
      navigate("/formpage");
    } else {
      alert("Please sign in or register before using prediction.");
      setShowModal(true);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </div>
        <div className="navbar-right">
          <button className="nav-btn" onClick={handlePredictClick}>
            Predict
          </button>
          <button className="nav-btn" onClick={() => setShowModal(true)}>
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="welcome-body"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="welcome-content">
          <h1>Welcome to HopeEarly</h1>
          <p>
            Empower yourself with early detection and knowledge. <br />
            Your health is the best investment you can make!
          </p>
        </div>
      </div>

      {/* Self-Check Tips */}
      <div className="tips-section-flex">
        <div className="tips-section">
          <h2>Self-Examination for Breast Cancer</h2>

          <h5>1. Visual Inspection in Front of a Mirror</h5>
          <p>
            Stand undressed from the waist up in front of a mirror. Look for
            changes in breast size, shape, or symmetry. Check for dimpling,
            swelling, redness, or visible lumps. Examine nipples for inversion,
            discharge, or sores. Remember, perfect symmetry is rare.
          </p>

          <h5>2. Raise Arms and Inspect</h5>
          <p>
            Lift both arms overhead and observe your breasts for the same
            changes. This position can reveal subtle differences in contour or
            skin texture.
          </p>

          <h5>3. Hands on Hips, Flex Chest Muscles</h5>
          <p>
            Place your hands firmly on your hips and flex your chest muscles.
            This can highlight any dimpling or puckering.
          </p>

          <h5>4. Manual Check Lying Down</h5>
          <p>
            Lie flat on your back with a pillow under one shoulder. Use your
            fingers to press gently in circles over the entire breast and
            armpit. Use light, medium, and firm pressure.
          </p>

          <h5>5. Manual Check in the Shower</h5>
          <p>
            While showering, raise one arm and use the opposite hand to check
            the breast and armpit with small circular motions.
          </p>

          <h5>6. Check Nipples for Discharge</h5>
          <p>
            Gently squeeze each nipple to check for any unusual discharge such
            as blood or clear fluid.
          </p>
        </div>

        <div className="tips-image-container">
          <img
            src={testImage}
            alt="Self-exam illustration"
            className="tips-image"
          />
        </div>
      </div>

      {/* Signup/Login Modal */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Welcome;
