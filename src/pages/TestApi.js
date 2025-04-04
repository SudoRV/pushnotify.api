import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TestApiModule from "../components/TestApi";
import Footer from "../components/Footer";

function TestApi(){
    const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
        <TestApiModule /> 
        <Footer />    
    </>
  );
}

export default TestApi;

