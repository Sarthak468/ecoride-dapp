import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import DriverLogin from "./pages/DriverLogin";
import UserSignup from "./pages/UserSignup";
import DriverSignup from "./pages/DriverSignup";
import UserDashboard from "./pages/UserDashboard";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/driver/signup" element={<DriverSignup />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
