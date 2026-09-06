// Testimonials.jsx - Advanced 3D Slider
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Testimonials.css';
import { X, ZoomIn, ChevronLeft, ChevronRight, Star, Quote, ArrowUpRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const trackRef = useRef(null);

  const reviews = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/fzfzhvkj/image/upload/v1788609683/review_1.jpg',
    student: 'Rahul Mehta',
    course: 'Guardneer Trading Course',
    rating: 5,
    review: 'Was skeptical about buying it cheaper here, but got the full Google Drive access instantly. Legit service!',
    date: '2 days ago'
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/fzfzhvkj/image/upload/v1788610871/copy_of_review_10.jpg",
    student: 'Ananya Sharma',
    course: 'Hamza Ali Facebook Ads',
    rating: 5,
    review: 'Saved so much money buying it here. All modules and updates are fully accessible. Thank you!',
    date: '1 week ago'
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/fzfzhvkj/image/upload/v1788609686/review_2.jpg',
    student: 'Kunal Patel',
    course: 'Guardneer Trading Course',
    rating: 5,
    review: 'Got my login credentials within minutes of payment. Super fast delivery and 100% working access.',
    date: '3 days ago'
  },
  {
    id: 7,
    image: 'https://res.cloudinary.com/fzfzhvkj/image/upload/v1788609695/review_7.jpg',
    student: 'Aatif Khan',
    course: 'Guardneer Trading Course',
    rating: 5,
    review: 'Super smooth transaction. Received the mega link instantly after payment confirmation.',
    date: '4 days ago'
  },
];
  const cardsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    }
    return 3;
  };

  const maxIndex = reviews.length - cardsToShow();

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev <= 0) return maxIndex;
      return prev - 1;
    });
  }, [maxIndex]);

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(Math.max(index, 0), maxIndex));
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setIsAutoPlaying(false);
      nextSlide();
      setTimeout(() => setIsAutoPlaying(true), 8000);
    }
    if (isRightSwipe) {
      setIsAutoPlaying(false);
      prevSlide();
      setTimeout(() => setIsAutoPlaying(true), 8000);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleManualNav = (action) => {
    setIsAutoPlaying(false);
    action();
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        
        {/* Header */}
        <div className="testimonials-header-row">
          <div className="testimonials-header">
            <span className="testimonials-subtitle">
              <Star size={12} fill="#FFB800" color="#FFB800" />
              STUDENT SUCCESS
            </span>
            <h2 className="testimonials-title">
              Real WhatsApp <span>Reviews</span>
            </h2>
          </div>
          <div className="testimonials-nav-btns">
            <button 
              className="nav-btn" 
              onClick={() => handleManualNav(prevSlide)} 
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              className="nav-btn" 
              onClick={() => handleManualNav(nextSlide)} 
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider Viewport */}
        <div 
          className="testimonials-viewport"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div 
            className="testimonials-track"
            ref={trackRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow())}%)`,
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {reviews.map((review, index) => (
              <div 
                key={review.id}
                className={`testimonial-card ${
                  index === currentIndex ? 'testimonial-card--active' : ''
                }`}
                style={{
                  width: `${100 / cardsToShow()}%`,
                  flex: `0 0 ${100 / cardsToShow()}%`
                }}
                onClick={() => setSelectedImage(review)}
              >
                <div className="testimonial-card-inner">
                  <div className="testimonial-img-wrap">
                    <img src={review.image} alt={`${review.student} review`} className="testimonial-thumb" loading="lazy" />
                    <div className="testimonial-overlay">
                      <Quote size={24} />
                    </div>
                    <div className="testimonial-zoom-overlay">
                      <ZoomIn size={20} />
                      <span>View Review</span>
                    </div>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={10}
                          fill={i < Math.floor(review.rating) ? '#FFB800' : 'none'}
                          color={i < Math.floor(review.rating) ? '#FFB800' : '#A1A1AA'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-info">
                    <div className="testimonial-student-row">
                      <span className="student-name">{review.student}</span>
                      <span className="student-date">{review.date}</span>
                    </div>
                    <span className="student-course">{review.course}</span>
                    <p className="student-review">"{review.review}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="testimonials-dots">
          {reviews.slice(0, maxIndex + 1).map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${index === currentIndex ? 'testimonial-dot--active' : ''}`}
              onClick={() => {
                setIsAutoPlaying(false);
                goToSlide(index);
                setTimeout(() => setIsAutoPlaying(true), 8000);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={() => setSelectedImage(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <img src={selectedImage.image} alt={selectedImage.student} className="lightbox-img" />
            <div className="lightbox-caption">
              <strong>{selectedImage.student}</strong>
              <span> — {selectedImage.course}</span>
              <p className="lightbox-review">"{selectedImage.review}"</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}