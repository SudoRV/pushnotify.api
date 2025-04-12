import React, { useState } from "react";
import "../styles/PasswordResetPopup.scss";

const PasswordResetPopup = ({ closePopup }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return await alert("Please enter your email.");
    
    const BASE_URL = "https://inlmqkmxchdb5df6t3gjdqzpqi0jrfmc.lambda-url.eu-north-1.on.aws/";

    //send reset link 
    const response = await fetch(BASE_URL+`?req=reset-password-link&email=${email}`)
    const res = response.json();
    console.log(res)
    
    setTimeout(() => {
      alert("A password reset link has been sent to " + email);
      closePopup(); // Close the popup after submission
    }, 1000);
  };

  return (
    <div className="password-reset-popup popup-overlay">
      <div className="popup-box">
        <h2>🔒 Reset Password</h2>
        <p>Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit" className="submit-btn">Send Reset Link</button>
          <button type="button" className="close-btn" onClick={closePopup}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPopup;
