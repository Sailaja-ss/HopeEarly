// src/pages/AuthModal.jsx
import React, { useState } from "react";
import "./Authpopup.css";
import { useAuth } from "./AuthContext";

const AuthModal = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isSignup
      ? "http://localhost:5000/api/auth/signup"
      : "http://localhost:5000/api/auth/login";

    const payload = isSignup ? form : { email: form.email, password: form.password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isSignup) {
          setMessage("Signup successful! Please sign in.");
          setIsSignup(false);
          setForm({ name: "", email: "", password: "" });
        } else {
          if (data.token) {
            login(data.token);
            setMessage("Login successful!");
            onClose();
          } else {
            setMessage("Login successful, but no token received.");
          }
        }
      } else {
        setMessage(data.message || (isSignup ? "Signup failed" : "Login failed"));
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="auth-title">{isSignup ? "Sign Up" : "Sign In"}</h2>

        <div className="auth-tab-row">
          <button
            className={`auth-tab ${isSignup ? "active" : ""}`}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
          <button
            className={`auth-tab ${!isSignup ? "active" : ""}`}
            onClick={() => setIsSignup(false)}
          >
            Sign In
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email id"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="auth-btn-group">
            <button type="submit" className="auth-action active">
              {isSignup ? "Sign up" : "Sign in"}
            </button>
          </div>
          <p className="auth-message">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
