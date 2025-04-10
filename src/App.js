import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login"; 
import ApiDocs from "./pages/ApiDocs";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment.js";
import TestApi from "./pages/TestApi";
import Profile from "./pages/Profile"
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import "./styles.css";

function App() {

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="main-frame h100 w100 flex fdc">
      <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(prev => !prev)} />
        
    <Router>
      <Routes>         
        <Route path="/" element={<Home />} /> 
        <Route path="/documentation" element={<ApiDocs />} />         
        <Route path="/login" element={<Login />} />        
        <Route path="/signup" element={<Login />} />
        <Route path="/profile" element={<Profile />} />     
        <Route path="/testapi" element={<TestApi />} />       
        <Route path="/dashboard" element={<Dashboard />} />          
        <Route path="/payment" element={<Payment />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
    
      { 
        !["/login", "/signup", "/payment"].includes(window.location.pathname) && <Footer /> 
      }

    </div>
  );
}

export default App;
