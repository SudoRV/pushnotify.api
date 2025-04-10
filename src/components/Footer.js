import React from "react";
import "../styles/Footer.scss"; 
import { FaGithub, FaYoutube, FaEnvelope } from "react-icons/fa"; 

const Footer = () => {
  return (
    <footer className="footer w100">
      <div className="container">
        {/* Left Side - API Name */}
        <div className="left">
          <h2>PushNotify API</h2>
          <p>Reliable and fast API for your needs.</p>
        </div>

        {/* Middle - Quick Links */}
        <div className="middle">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/documentation">Docs</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Right Side - Social Links */}
        <div className="right">
          <h3>Follow Us</h3>
          <div className="socialIcons">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://www.youtube.com/@PankajTechnicalWorld" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="mailto:help.sudorv@gmail.com"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="bottom flex jcc">
        <p>© {new Date().getFullYear()} PushNotify API. All rights reserved.</p>
        <p className="terms">
          <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms & Conditions</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
