// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public pages (no sidebar)
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgetPassword from "./pages/ForgetPassword";

// Dashboard layout (with sidebar on every screen below)
import DashboardLayout from "./pages/_DashboardLayout";

// Dashboard pages
import Home from "./pages/Home";
import MyPortfolio from "./pages/MyPortfolio";
import MyAgent from "./pages/MyAgent";
import MyDashboard from "./pages/MyDashboard";
import CreateResume from "./pages/CreateResume";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget" element={<ForgetPassword />} />

        {/* Private shell with sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/portfolio" element={<MyPortfolio />} />
          <Route path="/agent" element={<MyAgent />} />
          <Route path="/dashboard" element={<MyDashboard />} />
          <Route path="/resume" element={<CreateResume />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
