import React, { useState } from "react";
import "../styles/Contact.scss";
import { FaPaperPlane, FaBell } from "react-icons/fa"; // Notification icon

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showNotification, setShowNotification] = useState(false); // Push effect

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowNotification(true);  // Show push notification
    setTimeout(() => setShowNotification(false), 3000); // Auto-hide after 3s
  };

  return (
    <div className="contact-wrapper fg1">
      {/* Push Notification Icon */}
      <div className={`push-notification ${showNotification ? "active" : ""}`}>
        <FaBell />
        <p>Message Sent Successfully!</p>
      </div>

      <div className="contact-container">
        <h2>Get in Touch</h2>
        <p>We’d love to hear from you! Fill out the form below.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
          </div>

          <button type="submit">
            Send Message <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
