import React, { useState, useEffect } from "react";
import { showNotification } from "../components/ShowNotification";
import "../styles/PasswordResetPopup.scss";

const PasswordResetPopup = ({ closePopup }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpValidity, setOtpValidity] = useState(0);

  const BASE_URL = "https://xnzd52zoqyuu7zkv5i5r42uiua0jzapk.lambda-url.eu-north-1.on.aws/"
  
 //"https://inlmqkmxchdb5df6t3gjdqzpqi0jrfmc.lambda-url.eu-north-1.on.aws/";

  // Countdown timer effects
  useEffect(() => {
    let resendInterval;
    if (resendTimer > 0) {
      resendInterval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(resendInterval);
  }, [resendTimer]);

  useEffect(() => {
    let otpInterval;
    if (otpValidity > 0) {
      otpInterval = setInterval(() => {
        setOtpValidity(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(otpInterval);
  }, [otpValidity]);

  const handleGenerateOtp = async (e, isResend = false) => {
    e?.preventDefault?.();
    if (!email || email.trim() !== JSON.parse(localStorage.getItem("creds")).email) return alert("Please enter your email.");

    try {
      const res = await fetch(BASE_URL + `?req=reset-password-link&action=otp&email=${email}`);
      const response = await res.json();
      console.log(response);

      if (response.type === "success") {
        showNotification("OTP sent to " + email);
        setOtpSent(true);
        setResendTimer(60);          // 60 sec disable resend
        setOtpValidity(900);         // 5 mins = 300 sec OTP validity
        setOtp("");                  // Clear OTP field
      } else {
        showNotification(response.message || "Failed to send OTP", true);
      }
    } catch (err) {
      console.error(err);
      showNotification("Something went wrong.", true);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP.");

    try {
      const res = await fetch(BASE_URL + `?req=reset-password-link&action=verify-otp&email=${email}&otp=${otp}`);
      const response = await res.json();

      if (response.type === "success") {
        showNotification("OTP Verified. Reset link sent to email.");
        const timeout = setTimeout(()=>{
            closePopup();
            clearTimeout(timeout);
        },3000);
        // Optional: Redirect to reset page
      } else {
        showNotification(response.message || "Invalid OTP", true);
      }
    } catch (err) {
      console.error(err);
      showNotification("Something went wrong.", true);
    }
  };

  return (
    <div className="password-reset-popup popup-overlay">
      <div className="popup-box">
        <h2>🔒 Reset Password</h2>
        <p>Enter your email to receive an OTP.</p>

        <form onSubmit={otpSent ? handleVerifyOtp : handleGenerateOtp}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={otpSent}
          />

          {otpSent && (
            <>
              <input 
                type="text" 
                placeholder="Enter OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
              />
              
              <div className="flex jcsb aic">
                <p style={{ fontSize: "14px", color: "#555" }}>
                OTP valid for: <strong>{otpValidity}s</strong>
                </p>
              
                <button style={{ "marginLeft":"auto" }}
                type="button" 
                onClick={(e) => handleGenerateOtp(e, true)} 
                disabled={resendTimer > 0}
                className="resend-btn"
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
              
            </>
          )}

          <button type="submit" className="submit-btn">
            {otpSent ? "Verify OTP" : "Generate OTP"}
          </button>

          <button type="button" className="close-btn" onClick={closePopup}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPopup;
