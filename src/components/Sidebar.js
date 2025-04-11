import React, { useEffect, useState } from "react";
import "../styles/Sidebar.scss";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  let userData = null;
  try {
    userData = JSON.parse(window.localStorage.getItem("creds"));
  } catch (error) {
    console.error("Invalid JSON in localStorage:", error);
  }

  const authMode = userData ? "profile" : "Login";
    
  //download button
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Stop automatic prompt
      setInstallPrompt(event); // Store event for later use
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt(); // ✅ Now inside user gesture
      setInstallPrompt(null); // Remove after prompting
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""} flex fdc`}>
      <div style={{ margin: "0 8px 8px 8px", "borderBottom": "1px solid #9e9e9ee1"}} className="flex aic jcsb">
        <h2 style={{ padding: "2px 0px", margin: 0, "fontSize": "21px", color: "#007BFF" }}>Quick Links</h2>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
      </div>      
      <ul className="flex fdc fg1">
        <li>
          <a href={`/${authMode.toLowerCase()}`}>
            { userData ? `👤 ${userData.username}` : authMode }
          </a>
        </li>  
                  
        { !userData && (
          <li>
              <a href="/signup">Signup</a>
          </li>  
        )}
        
        <li>
          <a href="/">Home</a>
        </li> 
        
        <li>
          <a href="/testapi">Test API</a>
        </li>
                                       
        <li>
          <a href="/documentation">Documentation</a>
        </li>  
        
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>  
        
        <li style={{ "marginTop": "auto" }}>
          <a href="/contact">Contact Us</a>
        </li>  
        
        <li>
          {/* Install App Button */}
          {installPrompt && (
            <button onClick={handleInstallClick} className="install-btn">Install App</button>
          )}
        </li>
                   
      </ul>
    </div>
  );
};

export default Sidebar;
