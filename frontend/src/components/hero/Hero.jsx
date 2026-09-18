import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, ExternalLink } from 'lucide-react';
import { useCourses } from '../../hooks/useCourses';
import { PERMANENT_BANNER } from "../../assets";
// Permanent banner (non-clickable)


const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState([PERMANENT_BANNER]);
  
  const { featuredCourses } = useCourses();

  // Build slides: 1 permanent + 4 course slides
  useEffect(() => {
    if (featuredCourses && featuredCourses.length > 0) {
      const courseSlides = featuredCourses
        .filter(course => course.thumbnail)
        .slice(0, 4)
        .map(course => ({
          image: course.thumbnail,
          title: course.title,
          subtitle: course.shortDescription || 'Premium Course',
          type: 'course',
          slug: course.slug,
          price: course.formattedPrice || `$${course.priceUSD}`,
          discount: course.originalPrice > course.price 
            ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
            : 0
        }));
      
      setSlides([PERMANENT_BANNER, ...courseSlides]);
    }
  }, [featuredCourses]);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleManualNav = (action) => {
    setIsAutoPlaying(false);
    action();
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Handle slide click
  const handleSlideClick = (slide) => {
    if (slide.type === 'course' && slide.slug) {
      navigate(`/courses/${slide.slug}`);
    }
    // Permanent banner does nothing
  };

  return (
    <section className="hero">
      <div className="hero__container">
        
        {/* Slider - Left side */}
        <div className="hero__slider">
          <div className="hero__slider-frame">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="hero__slide-wrapper"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                onClick={() => handleSlideClick(slides[currentSlide])}
                style={{ cursor: slides[currentSlide]?.type === 'course' ? 'pointer' : 'default' }}
              >
                <img
                  src={slides[currentSlide]?.image}
                  alt={slides[currentSlide]?.title || 'Course'}
                  className="hero__slider-img"
                  loading="eager"
                  onError={(e) => {
                    e.target.src = PERMANENT_BANNER.image;
                  }}
                />
                
                {/* Course info overlay */}
                {slides[currentSlide]?.type === 'course' && (
                  <div className="hero__slide-info">
                    <div className="hero__slide-content">
                      {slides[currentSlide].discount > 0 && (
                        <span className="hero__slide-discount">
                          {slides[currentSlide].discount}% OFF
                        </span>
                      )}
                      <h3 className="hero__slide-title">
                        {slides[currentSlide].title}
                      </h3>
                      <p className="hero__slide-price">
                        {slides[currentSlide].price}
                      </p>
                    </div>
                    <span className="hero__slide-link">
                      View Course <ExternalLink size={12} />
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Slider top */}
            <div className="hero__slider-top">
              <span className="hero__brand">
                <span className="hero__brand-badge">CG</span>
                COURSESGUY
              </span>
              <span className="hero__premium">
                <Sparkles size={10} />
                PREMIUM
              </span>
            </div>
            
            {/* Slider arrows */}
            <button className="hero__arrow hero__arrow--left" onClick={() => handleManualNav(prevSlide)}>
              <ArrowLeft size={16} />
            </button>
            <button className="hero__arrow hero__arrow--right" onClick={() => handleManualNav(nextSlide)}>
              <ArrowRight size={16} />
            </button>
            
            {/* Slider dots */}
            <div className="hero__dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`hero__dot ${index === currentSlide ? 'hero__dot--active' : ''}`}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentSlide(index);
                    setTimeout(() => setIsAutoPlaying(true), 10000);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text - Right side */}
        <div className="hero__text">
          <span className="hero__eyebrow">PREMIUM LEARNING</span>
          <h1 className="hero__heading">
            Premium Courses.
            <br />
            <span className="hero__heading-accent">Smarter Prices.</span>
          </h1>
          <p className="hero__subtitle">Learn more. Spend less.</p>
          <a href="/courses" className="hero__cta">
            Explore Courses
            <ArrowUpRight size={14} />
          </a>
          <div className="hero__counter">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;