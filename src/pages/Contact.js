import React, { useState } from "react";
import "../styles/Contact.scss";
import { FaPaperPlane, FaBell } from "react-icons/fa"; // Notification icon
import { showNotification } from "../components/ShowNotification";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showNotification("Message Sent Successfully!")
  };

  return (
    <div className="contact-wrapper w100 fg1">    
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
