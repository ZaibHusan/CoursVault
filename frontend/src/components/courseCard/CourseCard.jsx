import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Clock, Shield } from 'lucide-react';
import './CourseCard.css';

export default function CourseCard({ course, onClick }) {
  const navigate = useNavigate();
  
  const {
    _id,
    title = 'Course Title',
    shortDescription = '',
    thumbnail = '',
    formattedPrice = '$0',
    formattedOriginalPrice = '',
    price = 0,
    originalPrice = 0,
    rating = 4.5,
    studentsEnrolled = 0,
    totalLectures = 0,
    access = 'Lifetime Access',
    slug = ''
  } = course || {};

  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleClick = () => {
    if (onClick) onClick();
    else if (slug) navigate(`/courses/${slug}`);
  };

  return (
    <article className="course-card" onClick={handleClick}>
      <div className="card-image">
        <img 
          src={thumbnail} 
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=Course';
          }}
        />
        {discount > 0 && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
        )}
        <span className="access-badge">
          <Shield size={12} />
          {access}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        
        {shortDescription && (
          <p className="card-desc">{shortDescription}</p>
        )}

        <div className="card-meta">
          <span className="meta-item">
            <Star size={14} />
            {rating.toFixed(1)}
          </span>
          <span className="meta-item">
            <Users size={14} />
            {studentsEnrolled.toLocaleString('en-IN')}
          </span>
          {totalLectures > 0 && (
            <span className="meta-item">
              <Clock size={14} />
              {totalLectures} lectures
            </span>
          )}
        </div>

        <div className="card-footer">
          <div className="price-section">
            <span className="current-price">
              {formattedPrice}
            </span>
            {originalPrice > price && formattedOriginalPrice && (
              <span className="original-price">
                {formattedOriginalPrice}
              </span>
            )}
          </div>
          <button className="view-btn">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}