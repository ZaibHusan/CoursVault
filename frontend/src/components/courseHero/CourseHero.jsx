import React from 'react';
import './CourseHero.css';
import { CheckCircle2, ChevronRight, ShieldCheck, Star, Users, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseHero({ course }) {
  const {
    title = 'Course Title',
    shortDescription = '',
    thumbnail = '',
    rating = 4.5,
    studentsEnrolled = 0,
    totalLectures = 0,
    access = 'Lifetime Access',
    originalPrice = 0,
    price = 0
  } = course || {};

  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="course-hero">
      
      {/* Breadcrumb Navigation */}
      <div className="course-breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <ChevronRight size={14} />
        <Link to="/courses" className="breadcrumb-link">Courses</Link>
        <ChevronRight size={14} />
        <span className="breadcrumb-current">{title?.slice(0, 30)}...</span>
      </div>

      {/* Badges Row */}
      <div className="course-badge-row">
        {discount > 0 && (
          <span className="course-tag-discount">{discount}% OFF</span>
        )}
        <span className="course-tag-access">{access}</span>
        <span className="course-tag-verified">
          <ShieldCheck size={12} /> Verified
        </span>
      </div>

      {/* Title & Description */}
      <div className="course-hero-content">
        <h1 className="course-hero-title">{title}</h1>
        
        {shortDescription && (
          <p className="course-hero-desc">{shortDescription}</p>
        )}

        {/* Trust Signals */}
        <div className="course-trust-row">
          <span className="trust-item">
            <Star size={14} />
            {rating.toFixed(1)} Rating
          </span>
          <span className="trust-item">
            <Users size={14} />
            {studentsEnrolled.toLocaleString('en-IN')} Students
          </span>
          {totalLectures > 0 && (
            <span className="trust-item">
              <Clock size={14} />
              {totalLectures} Lectures
            </span>
          )}
        </div>

        {/* Value Highlights */}
        <div className="course-highlights-row">
          <div className="highlight-pill">
            <CheckCircle2 size={14} color="#22C55E" />
            <span>Instant Access</span>
          </div>
          <div className="highlight-pill">
            <CheckCircle2 size={14} color="#FFB800" />
            <span>Complete Syllabus</span>
          </div>
          <div className="highlight-pill">
            <CheckCircle2 size={14} color="#E63946" />
            <span>Save {discount}%</span>
          </div>
        </div>
      </div>

      {/* Thumbnail (No Video Preview) */}
      <div className="course-hero-thumbnail">
        <img 
          src={thumbnail} 
          alt={title}
          className="hero-thumb-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x450?text=Course';
          }}
        />
      </div>

    </div>
  );
}