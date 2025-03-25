import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TestApiPage from "../components/TestApi";

function TestApi(){
    const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
        <TestApiPage />     
    </>
  );
}

export default TestApi;

