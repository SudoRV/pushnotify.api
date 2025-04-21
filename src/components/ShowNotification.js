import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { FaBell } from "react-icons/fa";
import "../styles/ShowNotification.scss"; // keep styling separate

export function showNotification(message = "Notification", isError=false) {
  const actives = document.querySelectorAll(".custom-notification");
  actives.forEach((active) => active.remove());

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const Notification = ({ message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose("timeout");
      }, 3000);

      return () => clearTimeout(timer); // Clean up
    }, [onClose]);

    return (
      <div className={`custom-notification active ${isError ? "custom-notification-error" : ""}`}>
        <FaBell />
        <span>{message}</span>
      </div>
    );
  };

  const handleClose = (reason) => {
    //if (root) root.unmount();
    if (container && document.body.contains(container)) {
      //container.remove();
    }
  };

  root.render(<Notification message={message} onClose={handleClose} />);
}