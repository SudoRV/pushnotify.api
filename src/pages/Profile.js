import React, { useState, useEffect } from "react";
import "../styles/Profile.scss";
import PasswordResetPopup from "../components/PasswordResetPopup";  // Import popup

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);  
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("creds"));
      const storedTransaction = JSON.parse(localStorage.getItem("t_data"));

      if (storedUser) setUserData(storedUser);
      if (storedTransaction) setTransactionData(storedTransaction);
    } catch (error) {
      console.error("Error parsing local storage data:", error);
    }
  }, []);

  return (
    <>
      <div className="profile-container fg1">
        <h2>👤 User Profile</h2>

        {/* User Details */}
        <div className="profile-card">
          <h3>🔹 Personal Information</h3>
          {userData ? (
            <ul>
              <li><strong>Name:</strong> {userData.username || "N/A"}</li>
              <li><strong>Email:</strong> {userData.email || "N/A"}</li>
              <li><strong>User ID:</strong> {userData["user-id"] || "N/A"}</li>
            </ul>
          ) : (
            <p className="error">No user data found. <a href="/login">Please login</a></p>
          )}
        </div>

        {/* Transaction Details */}
        <div className="profile-card">
          <h3>💰 Transaction Summary</h3>
          {transactionData ? (
            <ul>
              <li><strong>Amount:</strong> {transactionData["amount"] || 0}</li>
              <li><strong>Time: </strong>{new Date(transactionData["timestamp"]).toLocaleString()}</li>
              <li><strong>Transaction ID:</strong> {transactionData["transaction-id"] || "N/A"}</li>
            </ul>
          ) : (
            <p className="error">No transactions found.</p>
          )}
        </div>

        {/* Additional Features */}
        <div className="profile-card">
          <h3>⚙️ Account Settings</h3>
          <p>Manage your account security.</p>
          <button className="settings-btn reset" onClick={() => setShowPopup(true)}>
            Reset Password
          </button>
          <button
            className="settings-btn logout"
            onClick={async () => {
              await alert("Logging You Out");
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Password Reset Popup */}
      {showPopup && <PasswordResetPopup closePopup={() => setShowPopup(false)} />}
    </>
  );
};

export default Profile;
