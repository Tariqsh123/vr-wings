import React from "react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaPinterestP,
  FaTiktok
} from "react-icons/fa6";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

import logo from "../assets/logo.webp";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "140px" }}
          />

          <h2 style={{ fontSize: "18px", margin: "10px 0" }}>
            Get updates.
          </h2>

          <div className="subscribe-box">
            <input type="email" placeholder="Enter your email" />
            <button>Submit</button>
          </div>

          <div className="social-icons">
            <a href="https://www.linkedin.com/company/vrwing/" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://www.instagram.com/#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.facebook.com/people/The-Vr-Wing/61579083286437/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.threads.com/" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
            <a href="https://www.youtube.com/@TheVrWing" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="https://www.pinterest.com/TheVrWing/" target="_blank" rel="noopener noreferrer"><FaPinterestP /></a>
            <a href="https://www.tiktok.com/@thevrwing" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>

          <p className="footer-description">
            Elevating collaboration to new dimensions—where VR, AR, MR and AI unite to shape smarter, more immersive experiences.
          </p>
        </div>

        {/* Right Section */}
        <div className="footer-right">

          {/* Services */}
          <div className="footer-column">
            <h4>Services</h4>
            <ul>
              <li>AR — Augmented Reality</li>
              <li>VR — Virtual Reality</li>
              <li>MR — Mixed Reality</li>
              <li>XR — Extended Reality</li>
              <li>VR360 — 360° Virtual Reality</li>
              <li>VR Simulation</li>
              <li>Copilot — AI Assistant</li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>Pricing</li>
              <li>Tools & Technologies</li>
              <li>Blogs</li>
              <li>About</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4>Contact Us</h4>
            <ul style={{ padding: 0, listStyle: "none" }}>

              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px"
                }}
              >
                <FaPhoneAlt style={{ fontSize: "16px" }} />
                +44 7463 151997
              </li>

              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px"
                }}
              >
                <FaEnvelope style={{ fontSize: "16px" }} />
                info@vrwings.com
              </li>

              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px"
                }}
              >
                <FaMapMarkerAlt style={{ fontSize: "16px" }} />
                20 Wenlock Road, London, N1 7GU
              </li>

            </ul>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        ©2026 VR Wings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;