import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Dashboard from "./pages/Dashboard.js";
import Orders from "./pages/Orders.js";
import Navbar from "./components/Navbar.js";

// Main App component
function App() {
  return (
    <Router>
      <Navbar /> {/* This is your navigation bar, included in every page */}
      <div className="App">
        <Routes>
          {/* Define routes and associate them with the correct components */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
