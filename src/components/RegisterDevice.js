import React, { useState, useEffect, useRef } from "react";
import { requestNotificationPermission, getDeviceToken } from "../functions/getDeviceToken";

import notification_on from "../icons/notification_on.svg";
import notification_off from "../icons/notification_off.svg";
import "../styles/RegisterDevice.scss"; // Import styles

const RegisterDevice = ({ onToken }) => {
  const [deviceToken, setDeviceToken] = useState("");  
  const [notificationStatus, setNotificationStatus] = useState(window.Notification?.permission);  

  const preRef = useRef(null);
  const textRef = useRef(null);
  const iconRef = useRef(null);

  // Fetch saved token on mount
  useEffect(() => {
    const savedData = localStorage.getItem("t_data");
    if (savedData) {
      const { "web-device-token": storedToken } = JSON.parse(savedData);
      if (storedToken) setDeviceToken(storedToken);
    }
  }, []);

  const handleRegisterDevice = async () => {
    await handleRequestPermission();
    
    if (deviceToken) {
      navigator.clipboard.writeText(deviceToken);
      if (onToken) onToken(deviceToken);
      return;
    }

    const token = await getDeviceToken();
    if (token) {
      setDeviceToken(token);
      const updatedData = { ...JSON.parse(localStorage.getItem("t_data") || "{}"), "web-device-token": token };
      localStorage.setItem("t_data", JSON.stringify(updatedData));
    }
  };

  const handleRequestPermission = async () => {
    const isGranted = await requestNotificationPermission();
    setNotificationStatus(isGranted ? "granted" : "denied");

    // Show permission status temporarily
    if (preRef.current && iconRef.current) {
      preRef.current.classList.add("show-notification-status");
      iconRef.current.classList.add("shake");

      textRef.current.innerText = isGranted ? "Allowed" : "Blocked";

      setTimeout(() => {
        preRef.current.classList.remove("show-notification-status");
        iconRef.current.classList.remove("shake");
      }, 4000);
    }
  };

  return (
    <div className="register-device flex fdc api-step">
      <div className="flex jcsb aic">
        <h3>2️⃣ Get Device Token</h3>
        <div ref={preRef} className="notification_cont flex jcfe aic">
          <p ref={textRef}>{notificationStatus === "granted" ? "Allowed" : "Blocked"}</p>
          <img 
            ref={iconRef} 
            className="notification_icon"
            src={notificationStatus === "granted" ? notification_on : notification_off} 
            alt="Notification Status"
            onClick={handleRequestPermission}
            style={{ cursor: "pointer" }} 
          />
        </div>
      </div>

      <div className="w100 flex fdc">
        <input type="text" className="api-input" placeholder="Device Token" value={deviceToken} readOnly />
        <button onClick={handleRegisterDevice} className="api-btn">
          {deviceToken ? "Copy Token" : "Register Device"}
        </button>
      </div>
    </div>
  );
};

export default RegisterDevice;
