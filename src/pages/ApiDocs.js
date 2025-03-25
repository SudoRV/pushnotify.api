import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ApiDocs from "../components/ApiDocs";
import Footer from "../components/Footer";

function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
        <ApiDocs />
        <Footer />
    </>
  );
}

export default Home;
