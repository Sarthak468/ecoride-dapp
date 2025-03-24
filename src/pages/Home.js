import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const containerStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
    textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
    overflow: "hidden"
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 0
  };

  const contentStyle = {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "20px"
  };

  const buttonStyle = {
    margin: "10px",
    padding: "12px 24px",
    fontSize: "18px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#333"
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      <div style={contentStyle}>
        <h1 style={{ fontSize: "60px", marginBottom: "20px" }}>
          Welcome to Eco Ride
        </h1>
        <p style={{ fontSize: "24px", marginBottom: "40px" }}>
          Experience sustainable ride sharing like never before.
        </p>
        <div>
          <Link to="/user/login">
            <button style={buttonStyle}>User Login</button>
          </Link>
          <Link to="/user/signup">
            <button style={buttonStyle}>User Signup</button>
          </Link>
          <Link to="/driver/login">
            <button style={buttonStyle}>Driver Login</button>
          </Link>
          <Link to="/driver/signup">
            <button style={buttonStyle}>Driver Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
