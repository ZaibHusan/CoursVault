// About.jsx - Premium Redesign
import React from 'react';
import './About.css';
import { FaTelegramPlane, FaWhatsapp, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { Sparkles, ShieldCheck, Zap, ArrowUpRight, Star, Users, Award, Target, CheckCircle2, Mail } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Users, value: '500+', label: 'Active Learners' },
    { icon: Award, value: '50+', label: 'Premium Courses' },
    { icon: Star, value: '4.9/5', label: 'Average Rating' },
    { icon: Target, value: '95%', label: 'Success Rate' }
  ];

  const channels = [
    { icon: FaWhatsapp, name: 'WhatsApp', desc: 'Direct community support chats', color: '#25D366', followers: 'Join Group', link: 'https://chat.whatsapp.com/GydM31mN4tTCV1GrclTynu?s=sh&p=a&ilr=4' },
    { icon: FaTelegramPlane, name: 'Telegram', desc: 'Instant course updates & alerts', color: '#0088cc', followers: 'Join Channel', link: 'https://t.me/+A3DdR0_t0T44Yzg0' },
    { icon: FaInstagram, name: 'Instagram', desc: 'Behind the scenes & reels', color: '#E4405F', followers: 'Follow Us', link: 'https://www.instagram.com/channel/AbZC5PlCXzouqxhD/' },
    { icon: FaFacebookF, name: 'Facebook', desc: 'Community discussions & groups', color: '#1877F2', followers: 'Like Page', link: 'https://www.facebook.com/share/1F7aasDcAe/' }
  ];

  const highlights = [
    'Curated premium content',
    'Lifetime access guarantee',
    'Regular course updates',
    'Community support',
    'Affordable pricing',
    'Industry experts'
  ];

  return (
    <section className="about-section">
      {/* Background decorations */}
      <div className="about-bg-glow about-bg-glow--red"></div>
      <div className="about-bg-glow about-bg-glow--gold"></div>
      <div className="about-bg-pattern"></div>

      <div className="about-container">
        
        {/* Header */}
        <div className="about-header">
          <div className="about-badge">
            <Sparkles size={12} />
            <span>ABOUT COURSESGUY</span>
          </div>
          <h2 className="about-title">
            Democratizing <span>Elite Education</span> For Everyone
          </h2>
          <p className="about-description">
            We're on a mission to make world-class learning accessible to ambitious minds everywhere.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="about-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="about-stat-card">
              <div className="about-stat-icon">
                <stat.icon size={20} />
              </div>
              <div className="about-stat-info">
                <span className="about-stat-value">{stat.value}</span>
                <span className="about-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Card */}
        <div className="about-mission-card">
          <div className="about-mission-content">
            <div className="about-story-badge">
              <Target size={14} color="#FFB800" />
              <span>OUR MISSION</span>
            </div>
            <h3 className="about-story-heading">
              Learning Without <span>Financial Barriers</span>
            </h3>
            <p className="about-story-text">
              At CoursesGuy, we believe that world-class knowledge shouldn't come with an inflated price tag. 
              We curate and provide top-tier, premium courses across development, design, and data science, 
              making them radically accessible and budget-friendly.
            </p>
            
            <div className="about-highlights-grid">
              {highlights.map((highlight, index) => (
                <div key={index} className="about-highlight-item">
                  <CheckCircle2 size={16} color="#FFB800" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            <div className="about-features-row">
              <div className="about-feature-item">
                <div className="about-feature-icon">
                  <Zap size={16} color="#E63946" />
                </div>
                <div>
                  <span className="about-feature-title">Instant Access</span>
                  <span className="about-feature-desc">Start learning immediately</span>
                </div>
              </div>
              <div className="about-feature-item">
                <div className="about-feature-icon about-feature-icon--gold">
                  <ShieldCheck size={16} color="#FFB800" />
                </div>
                <div>
                  <span className="about-feature-title">Lifetime Access</span>
                  <span className="about-feature-desc">Learn at your own pace</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div className="about-mission-visual">
            <div className="about-visual-circle">
              <div className="about-visual-circle-inner">
                <span className="about-visual-number">1.5K+</span>
                <span className="about-visual-label">Students Trust Us</span>
              </div>
            </div>
            <div className="about-visual-ring"></div>
          </div>
        </div>

        {/* Contact Email */}
        <div className="about-contact-row">
          <Mail size={16} color="#A1A1AA" />
          <span>electronzplus.official@gmail.com</span>
        </div>

        {/* Channels Section */}
        <div className="about-channels-wrapper">
          <div className="channels-header">
            <div>
              <h3 className="channels-heading">Join Our <span>Community</span></h3>
              <p className="channels-sub">Stay connected for daily updates, drops, and community support.</p>
            </div>
          </div>
          
          <div className="channels-grid">
            {channels.map((channel, index) => (
              <a 
                key={index}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-card"
                style={{ '--channel-color': channel.color }}
              >
                <div className="channel-icon">
                  <channel.icon size={22} />
                </div>
                <div className="channel-info">
                  <h4>{channel.name}</h4>
                  <span>{channel.desc}</span>
                </div>
                <div className="channel-followers">
                  {channel.followers}
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}