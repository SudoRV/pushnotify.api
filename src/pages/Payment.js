import React, { useState, useEffect } from "react";
import "../styles/Payment.scss";

const Payment = () => {
  const [amount] = useState(299);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default: India
  const [loading, setLoading] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const BASE_URL = "https://xnzd52zoqyuu7zkv5i5r42uiua0jzapk.lambda-url.eu-north-1.on.aws/";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => setResponseMessage("Failed to load Razorpay.");
    document.body.appendChild(script);
  }, []);

  
  const makePayment = async () => {
    const userData = JSON.parse(localStorage.getItem("creds"));

    if (!amount || amount <= 0) {
      setIsError(true);
      setResponseMessage("❌ Amount must be at least ₹1.");
      return;
    }
    if (!phone || phone.length !== 10) {
      setIsError(true);
      setResponseMessage("❌ Please enter a valid phone number.");
      return;
    }
    if (!razorpayReady) {
      setIsError(true);
      setResponseMessage("❌ Razorpay is still loading. Please wait.");
      return;
    }
    if (!userData) {
      setResponseMessage("❌ Please log in first.");
      window.open("/login?close=auto", "_blank");
      return;
    }

    setLoading(true);
    try {
      console.log(amount, userData.email)
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "payment", amount, currency: "INR", email: userData.email }),
      });

      const data = await response.json();
      console.log(data)
      if (data?.type === "error") {
        setIsError(true);
        setResponseMessage(data.message);
        setLoading(false);
        return;
      }
      if (!data?.orderId) {
        setIsError(true);
        setResponseMessage("❌ Payment initiation failed. Please try again.");
        setLoading(false);
        return;
      }

      // Proceed with Razorpay payment
      const options = {
        key: "rzp_live_Zy6koOmQNr2NyX",
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,
        name: "PushNotify API",
        description: "Payment to get access token to use PushNotify API",
        handler: async function (paymentResponse) {
          paymentResponse.creation_time = Date.now();
          paymentResponse.amount = data.amount;
          paymentResponse.user_id = userData["user-id"];
          paymentResponse.email = userData.email;
          verifyPayment(paymentResponse);
        },
        prefill: { name: userData.username, email: userData.email, contact: countryCode + phone },
        theme: { color: "#181818" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setIsError(true);
      setResponseMessage("❌ Payment request failed." + error);
    }
    setLoading(false);
  };

  const verifyPayment = async (paymentDetails) => {
    console.log(paymentDetails)
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "verify-payment", ...paymentDetails }),
      });

      const data = await response.json();

      console.log("tdata", data)
      if (data?.t_data) {
        setIsError(false);
        setResponseMessage("✅ Payment Successful");
        localStorage.setItem("t_data", JSON.stringify(data.t_data));
        setTimeout(() => (window.close()), 2000);
      } else if (data?.type === "error") {
        alert()
        setIsError(true);
        setResponseMessage(data.message);
      } else {
        setIsError(true);
        setResponseMessage("❌ Payment verification failed.");
      }
    } catch (error) {
      setIsError(true);
      setResponseMessage("❌ Payment verification failed.");
    }
  };

  return (

    <div className="payment">
      <div className="payment-card">
        <h2>Make a Payment</h2>

        {/* ✅ Response Message */}
        {responseMessage && (
          <div className={`response-message ${isError ? "error" : "success"}`}>{responseMessage}</div>
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
          value={amount}
          className="input-field amount"
          readOnly
        />

        <button onClick={makePayment} disabled={loading || !razorpayReady} className="pay-button">
          {loading ? <span className="loader"></span> : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
