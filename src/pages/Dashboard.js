import React, { useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";
import generateTestToken from "../functions/generateTestToken";
import "../styles/Dashboard.scss";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [testToken, setTestToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("creds"));
      const transactionData = JSON.parse(localStorage.getItem("t_data"));

      if (storedData) setUserData(storedData);
      if (transactionData) {
        if (transactionData["transaction-id"]) {
          setTransaction(transactionData);
        }
        if (transactionData["access-token"]) setAccessToken(transactionData["access-token"]);
        setTestToken(transactionData["test-token"]);
        updateTokenExpiry(transactionData["test-token"]);
      }
    } catch (error) {
      console.error("Error parsing local storage data:", error);
    }
  }, []);

  // Function to update token expiry & start timer
  const updateTokenExpiry = (token) => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000; // Convert to milliseconds
      setTokenExpiry(expiryTime);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (!tokenExpiry) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= tokenExpiry) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const remainingTime = Math.max(0, (tokenExpiry - now) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const generateAccessToken = async () => {
    if (!localStorage.getItem("creds")) {
      await alert("Please login first.");
      window.open("/login?close=auto");
      return;
    } else if (accessToken) {
      navigator.clipboard.writeText(accessToken);
    } else {
      //get access token

      // Construct URL for generating a new test token        
      const BASE_URL = "https://inlmqkmxchdb5df6t3gjdqzpqi0jrfmc.lambda-url.eu-north-1.on.aws/";
      const url = `${BASE_URL}?req=access-token&user=${userData["user-id"]}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (!data["access-token"]) throw new Error("Invalid response");

        // Save new test token in local storage        
        setAccessToken(data["access-token"]);

        localStorage.setItem("t_data", JSON.stringify({
          ...JSON.parse(localStorage.getItem("t_data") || "{}"),
          "access-token": data["access-token"]
        }));

        return { error: null, token: data["access-token"] };
      } catch (error) {
        console.error("Error fetching access token:", error);
        return { error: "Failed to fetch access token" };
      }
    }
  };

  const makePayment = async () => {
    await alert("Redirecting to Payment Page");
    const paymentWindow = window.open("/payment?amt=100", "_blank");
    const checkPageClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkPageClosed);
        window.location.reload();
      }
    }, 500);
  };

  return (        
    <div className="dashboard w100 fg1">
        <h2>User Dashboard</h2>

        {/* User Info */}
        <div className="user-info card">
          <h3>👤 User Information</h3>
          {userData ? (
            <ul>
              <li><strong>Username:</strong> {userData.username}</li>
              <li><strong>Email:</strong> {userData.email}</li>
              <li><strong>User ID:</strong> {userData["user-id"]}</li>
            </ul>
          ) : (
            <p className="error">No user data found. <a href="/login">Please login</a></p>
          )}
        </div>

        {/* Transaction History */}
        <div className="transaction-history card">
          <h3>💳 Transaction History</h3>
          {transaction ? (
            <ul>
              <li><strong>Amount:</strong> ₹{transaction.amount || "N/A"}</li>
              <li><strong>Time:</strong> {new Date(transaction["timestamp"]).toLocaleString()}</li>
              <li><strong>Transaction ID:</strong> {transaction["transaction-id"]}</li>
            </ul>
          ) : (
            <p className="error">
              No transactions found. <button style={{ all: "unset", color: "blue", textDecoration: "underline" }} onClick={makePayment}>Make Payment</button>
            </p>
          )}
        </div>

        {/* Test Token Section */}
        <div className="access-token-section card">
          <span style={{ float: "left", fontSize: "14px", color: timeLeft === "Expired" ? "red" : "green", fontWeight: "bold" }}>Expiry : {timeLeft || "..."}</span>
          <h3>🔑 Test Token</h3>
          <p>{testToken ? testToken : "No test token generated yet"}</p>

          <button
            className="generate-btn"
            onClick={async () => {
              const result = await generateTestToken(testToken);
              setTestToken(result.token);
              updateTokenExpiry(result.token);
              navigator.clipboard.writeText(result.token);
            }}
          >
            {timeLeft === "Expired" ? "Regenerate Token" : (testToken ? "Copy Token" : "Generate Token")}
          </button>
        </div>

        {/* Access Token Section */}
        <div className="access-token-section card">
          <h3>🔑 Access Token</h3>
          <p>{accessToken ? accessToken : "No access token generated yet"}</p>

          <div style={{ gap: "8px" }} className="flex jcc aic ">
            <button className="generate-btn" onClick={generateAccessToken}>
              {accessToken ? "Copy Token" : "Get Access Token"}
            </button>

            {accessToken ? (<button onClick={() => window.open("/payment?close=auto&amt=1")} className="buy-premium generate-btn">
              {transaction?.amount ? (transaction?.amount < 1 ? "Extend Limit" : "Unlimited") : "Extend Limit"}
            </button>) : ""}
          </div>
        </div>

    </div>
  );
};

export default Dashboard;
