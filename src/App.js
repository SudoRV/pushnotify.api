import "./styles.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login"; 
import ApiDocs from "./pages/ApiDocs";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment.js";
import TestApi from "./pages/TestApi";
import Profile from "./pages/Profile"
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>         
        <Route path="/" element={<Home />} /> 
        <Route path="/api/documentation" element={<ApiDocs />} />         
        <Route path="/login" element={<Login />} />        
        <Route path="/signup" element={<Login />} />
        <Route path="/profile" element={<Profile />} />     
        <Route path="/testapi" element={<TestApi />} />       
        <Route path="/dashboard" element={<Dashboard />} />          
        <Route path="/payment" element={<Payment />} />
        <Route path="/reset-password" element={<ResetPassword />} />                 
      </Routes>
    </Router>
  );
}

export default App;
