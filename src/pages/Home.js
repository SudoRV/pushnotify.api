import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import "../styles/Home.scss";

const Home = () => {

  useEffect(() => {
    // Scroll Animations
    const sections = document.querySelectorAll(".features, .how-it-works, .pricing, .cta");
    const featureCards = document.querySelectorAll(".feature");
    const steps = document.querySelectorAll(".step");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));

    // Feature Cards Animation
    featureCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = "scale(1)";
      }, index * 200);
    });

    // Steps Animation (Slide-in)
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.style.opacity = 1;
        step.style.transform = "translateX(0)";
      }, index * 300);
    });

  }, []);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

      <div className="home">
        {/* Hero Section */}
        <header className="hero">
          <h1>Effortless JWT Token Generation for IoT Devices</h1>
          <p>Securely generate and manage JWT tokens for seamless IoT authentication.</p>

          <div style={{ gap: "16px" }} className="flex aic jcc">
            <a href="/testapi" className="btn">Test API</a>
            <a href="#features" className="btn">Explore Features</a>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="features">
          <h2>Why Choose PushNotify API?</h2>
          <div className="feature-grid">
            <div className="feature">
              <h3>🔒 Secure</h3>
              <p>Industry-standard encryption ensures safe authentication.</p>
            </div>
            <div className="feature">
              <h3>⚡ Fast</h3>
              <p>Generate JWT tokens instantly with a single request.</p>
            </div>
            <div className="feature">
              <h3>📡 IoT Ready</h3>
              <p>Optimized for IoT devices requiring lightweight authentication.</p>
            </div>
            <div className="feature">
              <h3>💰 Affordable</h3>
              <p>Start for free or unlock full access for just ₹100 one-time.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-icon">🔑</div>
              <h3>Get Access Token</h3>
              <p>Sign up and obtain your secure access token.</p>
            </div>
            <div className="step">
              <div className="step-icon">🛠️</div>
              <h3>Generate JWT Token</h3>
              <p>Use the API to generate a signed JWT token.</p>
            </div>
            <div className="step">
              <div className="step-icon">🚀</div>
              <h3>Send Push Notification</h3>
              <p>Save the token and send push notifications instantly.</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="pricing">
          <h2>Pricing Plans</h2>
          <div className="pricing-container">
            <div className="price-card">
              <h3>🆓 Free Plan</h3>
              <p>Get started with Freemium 1000 api calls/day.</p>
              <strong>₹0</strong>
              <ul>
                <li>✅ JWT Tokens Generation</li>
                <li>✅ Push notifications</li>
                <li>✅ Limited API access</li>
                <li>Limit 1000 API calls/day</li>
              </ul>
              <a href="/dashboard" className="btn">Start for Free</a>
            </div>
            <div className="price-card premium">
              <h3>🚀 Premium Plan</h3>
              <p>Unlock full API access and push notifications.</p>
              <strong>₹100 (One-time)</strong>
              <ul>
                <li>✅ JWT Token Generation</li>
                <li>✅ Push Notifications</li>
                <li>✅ Full API Access</li>
                <li>Unlimited API calls</li>
              </ul>
              <a href="/payment?amt=100" className="btn">Upgrade Now</a>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta">
          <h2>🚀 Start Using PushNotify API Today!</h2>
          <p>Secure, fast, easy JWT token generation and Push Notification for your IoT projects.</p>
          <a href="/documentation" className="btn">Read API Docs</a>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;
