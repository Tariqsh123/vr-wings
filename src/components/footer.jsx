import React from "react";
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaXTwitter, FaYoutube } from "react-icons/fa6";
import logo from "../assets/logo.webp";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <img src={logo} alt="Company Logo" className="footer-logo" />

          <h2 className="footer-heading">Get updates.</h2>

          <div className="subscribe-box">
            <input type="email" placeholder="Enter your email" />
            <button>Submit</button>
          </div>

          <div className="social-icons">
            <FaLinkedinIn />
            <FaInstagram />
            <FaFacebookF />
            <FaXTwitter />
            <FaYoutube />
          </div>

          <p className="footer-description">
            VR Wings is the leading immersive procedural-skills training platform in healthcare. Co-founded in 2016 by UCLA- and Harvard-trained pediatric orthopedic surgeon Justin Barad, MD, our award-winning platform is trusted by hospitals and used by more than 100,000 healthcare professionals worldwide. 
          </p>
        </div>

        {/* Right Section */}
        <div className="footer-right">

          <div className="footer-column">
            <h4>Nurse Training</h4>
            <h4>Other Solutions</h4>
            <ul>
              <li>Enterprise</li>
              <li>Academy</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>Blog</li>
              <li>Newsroom</li>
              <li>Partnerships</li>
              <li>Podcasts</li>
              <li>Support</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li>Terms</li>
              <li>Privacy</li>
              <li>EULA</li>
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