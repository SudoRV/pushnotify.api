import React, { useState, useEffect } from "react";
import "../styles/CustomAlert.scss";

const CustomAlert = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [resolveCallback, setResolveCallback] = useState(null);

  useEffect(() => {
    window.alert = (message) => {    
      return new Promise((resolve) => {
        setAlertMessage(message);
        setIsVisible(true);
        setResolveCallback(() => resolve);
      });
    };
  }, []);

  const closeAlert = () => {
    setIsVisible(false);
    if (resolveCallback) resolveCallback(); // Resolve promise when closed
  };

  return (
    isVisible && (
      <div className="custom-alert">
        <div className="alert-box flex fdc">
          <p>{alertMessage}</p>
          <button onClick={closeAlert}>OK</button>
        </div>
      </div>
    )
  );
};

export default CustomAlert;