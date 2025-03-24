import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DriverSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [driverAddress, setDriverAddress] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (username && password && vehicleDetails && licenseNumber && driverAddress) {
      alert("Driver signup successful!");
      navigate("/driver/login");
    } else {
      alert("Please fill in all fields!");
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5"
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    width: "320px",
    textAlign: "center"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    margin: "16px 0",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Driver Signup</h2>
        <input
          type="text"
          placeholder="Username"
          style={inputStyle}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Vehicle Details"
          style={inputStyle}
          onChange={(e) => setVehicleDetails(e.target.value)}
        />
        <input
          type="text"
          placeholder="License Number"
          style={inputStyle}
          onChange={(e) => setLicenseNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Driver ETH Address (0x...)"
          style={inputStyle}
          onChange={(e) => setDriverAddress(e.target.value)}
        />
        <button onClick={handleSignup} style={buttonStyle}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default DriverSignup;
