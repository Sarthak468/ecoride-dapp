import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (username && password && email) {
      alert("User signup successful!");
      navigate("/user/login");
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
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>User Signup</h2>
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
          type="email"
          placeholder="Email"
          style={inputStyle}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSignup} style={buttonStyle}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default UserSignup;
