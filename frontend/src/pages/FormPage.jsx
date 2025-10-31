import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./FormPage.css";

const allFields = [
  { name: "radius_mean", placeholder: "Radius Mean" },
  { name: "texture_mean", placeholder: "Texture Mean" },
  { name: "perimeter_mean", placeholder: "Perimeter Mean" },
  { name: "area_mean", placeholder: "Area Mean" },
  { name: "smoothness_mean", placeholder: "Smoothness Mean" },
  { name: "compactness_mean", placeholder: "Compactness Mean" },
  { name: "concavity_mean", placeholder: "Concavity Mean" },
  { name: "concave_points_mean", placeholder: "Concave Points Mean" },
  { name: "symmetry_mean", placeholder: "Symmetry Mean" },
  { name: "fractal_dimension_mean", placeholder: "Fractal Dimension Mean" },

  { name: "radius_se", placeholder: "Radius SE" },
  { name: "texture_se", placeholder: "Texture SE" },
  { name: "perimeter_se", placeholder: "Perimeter SE" },
  { name: "area_se", placeholder: "Area SE" },
  { name: "smoothness_se", placeholder: "Smoothness SE" },
  { name: "compactness_se", placeholder: "Compactness SE" },
  { name: "concavity_se", placeholder: "Concavity SE" },
  { name: "concave_points_se", placeholder: "Concave Points SE" },
  { name: "symmetry_se", placeholder: "Symmetry SE" },
  { name: "fractal_dimension_se", placeholder: "Fractal Dimension SE" },

  { name: "radius_worst", placeholder: "Radius Worst" },
  { name: "texture_worst", placeholder: "Texture Worst" },
  { name: "perimeter_worst", placeholder: "Perimeter Worst" },
  { name: "area_worst", placeholder: "Area Worst" },
  { name: "smoothness_worst", placeholder: "Smoothness Worst" },
  { name: "compactness_worst", placeholder: "Compactness Worst" },
  { name: "concavity_worst", placeholder: "Concavity Worst" },
  { name: "concave_points_worst", placeholder: "Concave Points Worst" },
  { name: "symmetry_worst", placeholder: "Symmetry Worst" },
  { name: "fractal_dimension_worst", placeholder: "Fractal Dimension Worst" },
];

const FormPage = () => {
  const [formData, setFormData] = useState(() =>
    allFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();


  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  // Validate current step fields
  const validateStepFields = () => {
    const stepFields = allFields.slice(step * 10, step * 10 + 10);
    const newErrors = {};
    stepFields.forEach(({ name, placeholder }) => {
      const value = formData[name];
      if (value === "" || value == null) {
        newErrors[name] = `${placeholder} is required`;
      } else if (isNaN(parseFloat(value))) {
        newErrors[name] = `${placeholder} must be a number`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step navigation
  const handleNext = () => {
    if (validateStepFields()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStepFields()) return;

    if (!isLoggedIn) {
      alert("Please log in before submitting the prediction form.");
      return;
    }

    if (!token) {
      alert("Authorization token missing. Please log in again.");
      return;
    }

    const payload = {};
    for (const key in formData) {
      const val = parseFloat(formData[key]);
      payload[key] = isNaN(val) ? formData[key] : val;
    }

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //send token in header
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Prediction API Error:", result);
        alert(result.message || "Prediction failed. Please try again.");
        return;
      }

      navigate("/result", { state: { prediction: result } });
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network or server error: " + error.message);
    }
  };

  const fieldsForStep = allFields.slice(step * 10, step * 10 + 10);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Step {step + 1} of 3</h2>

        {fieldsForStep.map(({ name, placeholder }) => (
          <div key={name} className="form-group">
            <label htmlFor={name}>{placeholder}</label>
            <input
              type="number"
              step="any"
              id={name}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className={errors[name] ? "input-error" : ""}
            />
            {errors[name] && <p className="error-text">{errors[name]}</p>}
          </div>
        ))}

        <div className="form-navigation">
          {step > 0 && (
            <button type="button" onClick={handleBack} className="btn">
              Back
            </button>
          )}
          {step < 2 && (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
          {step === 2 && (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormPage;
