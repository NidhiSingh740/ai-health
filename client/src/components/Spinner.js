
import React from "react";
import "./Spinner.css"; // optional CSS for animation

function Spinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>Please wait...</p>
    </div>
  );
}

export default Spinner;
