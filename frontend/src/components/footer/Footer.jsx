import React from 'react';
import './Footer.css';
import { Mail, ShieldCheck } from 'lucide-react';
import { FaTelegramPlane, FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        {/* Top Grid Structure */}
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-col footer-brand-col">
            <div className="footer-logo">
              <span className="footer-logo-badge">CV</span>
              <span>CoursVault</span>
            </div>
            <p className="footer-desc">
              High-impact, elite courses engineered for rapid growth. Instant deployment, smarter prices, and lifetime access.
            </p>
            <div className="footer-secure-badge">
              <ShieldCheck size={14} color="#FFB800" />
              <span>Secure Encrypted Platform</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/courses">Explore Courses</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>

          {/* Legal / Policy Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#refund">Refund Policy</a></li>
              <li><a href="#affiliate">Affiliate Program</a></li>
            </ul>
          </div>

          {/* Contact & Social Media / Channels Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Official Channels & Support</h4>
            <p className="footer-contact-text">
              <Mail size={14} /> electronzplus.official@gmail.com
            </p>
            <div className="footer-social-row">
              <a href="https://chat.whatsapp.com/GydM31mN4tTCV1GrclTynu?s=sh&p=a&ilr=4" target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp Group">
                <FaWhatsapp size={16} />
              </a>
              <a href="https://t.me/+A3DdR0_t0T44Yzg0" target="_blank" rel="noopener noreferrer" className="social-icon" title="Telegram Group">
                <FaTelegramPlane size={16} />
              </a>
              <a href="https://www.instagram.com/channel/AbZC5PlCXzouqxhD/" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram Channel">
                <FaInstagram size={16} />
              </a>
              <a href="https://www.facebook.com/share/1F7aasDcAe/" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook Page">
                <FaFacebookF size={16} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} CoursVault. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <span>&bull;</span>
            <a href="#terms">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
}