import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/Payment.scss";

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default: India
  const [loading, setLoading] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const BASE_URL = "https://inlmqkmxchdb5df6t3gjdqzpqi0jrfmc.lambda-url.eu-north-1.on.aws/";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => setResponseMessage("Failed to load Razorpay.");
    document.body.appendChild(script);

    const urlParams = new URLSearchParams(window.location.search);
    setAmount(parseInt(urlParams.get("amt") || "100"));
  }, []);

  const handleResponse = async (response) => {
    try {
      const data = await response.json();
      
      if (data.success) {
        setIsError(false);
        setResponseMessage("✅ Payment successful! Redirecting...");

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setIsError(true);
        setResponseMessage(data.message || "❌ Payment failed. Please try again.");
      }
    } catch (error) {
      setIsError(true);
      setResponseMessage("❌ An error occurred. Please try again.");
    }
  };

  const makePayment = async () => {
    const userData = JSON.parse(localStorage.getItem("creds"));
    
    if (!amount || amount < 100) {
      setIsError(true);
      setResponseMessage("❌ Amount must be at least ₹100.");
      return;
    }
    if (!phone || phone.length < 10) {
      setIsError(true);
      setResponseMessage("❌ Please enter a valid phone number.");
      return;
    }
    if (!razorpayReady) {
      setIsError(true);
      setResponseMessage("❌ Razorpay is still loading. Please wait.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "payment", amount, currency: "INR", email: userData.email }),
      });

      handleResponse(response);

      const data = await response.json();
      if (!data.success) {
        setLoading(false);
        return;
      }
      
      if (!userData) {
        setResponseMessage("❌ Please log in first.");
        window.open("/login?close=auto", "_blank");
        setLoading(false);
        return;
      }

      const { username, email } = userData;

      const options = {
        key: "rzp_test_mTlsMRB3xieqUY",
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        name: "PushNotify API",
        description: "Payment to get access token to use PushNotify API",
        handler: async function (response) {
          response.creation_time = data.creation_time;
          response.amount = data.amount;
          response.user_id = userData["user-id"];
          verifyPayment(response);
        },
        prefill: { username, email, contact: countryCode + phone },
        theme: { color: "#181818" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setIsError(true);
      setResponseMessage("❌ Payment failed.");
    }
    setLoading(false);
  };

  const verifyPayment = async (paymentDetails) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "verify-payment", ...paymentDetails }),
      });

      const data = await response.json();
      if (data.success) {
        delete data.success;
        delete data.message;
        localStorage.setItem("t_data", JSON.stringify(data));

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setIsError(true);
        setResponseMessage("❌ Payment verification failed.");
      }
    } catch (error) {
      setIsError(true);
      setResponseMessage("❌ Payment verification failed.");
    }
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h100 flex fdc">
      <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

      <div className="payment">
        <div className="payment-card">
          <h2>Make a Payment</h2>

          {/* ✅ Render Response Message Here */}
          {responseMessage && (
            <div className={`response-message ${isError ? "error" : "success"}`}>
              {responseMessage}
            </div>
          )}

          <p>Enter the amount and phone number to proceed.</p>

          <div className="phone-input">
            <select
              className="country-code input-field"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="+91">🇮🇳 +91 (India)</option>
              <option value="+1">🇺🇸 +1 (USA)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
              <option value="+61">🇦🇺 +61 (Australia)</option>
              <option value="+81">🇯🇵 +81 (Japan)</option>
            </select>

            <input
              type="tel"
              placeholder="Enter phone number"
              maxLength="10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="phone-field input-field"
            />
          </div>

          <input
            type="number"
            placeholder="Enter amount (₹)"          
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field amount"
            readOnly
          />

          <button onClick={makePayment} disabled={loading || !razorpayReady} className="pay-button">
            {loading ? <span className="loader"></span> : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;