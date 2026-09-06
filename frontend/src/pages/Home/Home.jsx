import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Home.css';
import Hero from '../../components/hero/Hero';
import Testimonials from '../../components/Testimonials/Testimonials';
import FAQ from '../../components/FAQ/FAQ';
import { useCourses } from '../../hooks/useCourses';
import { useCurrency } from '../../hooks/useCurrency';
import CourseCard from '../../components/courseCard/CourseCard';

export default function Home() {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { 
    featuredCourses, 
    isLoadingFeatured, 
    error,
    fetchFeaturedCourses 
  } = useCourses();

  useEffect(() => {
    fetchFeaturedCourses(currency);
  }, [currency]);

  // Loading skeleton
  const CourseSkeleton = () => (
    <div className="course-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-price"></div>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      <Hero/>

      {/* Featured Courses Section */}
      <section className="featured-section">
        <div className="container">
          {/* Section Header */}
          <div className="section-header">
            <span className="section-subtitle">
              <Sparkles size={16} />
              PREMIUM COURSES
            </span>
            <h2 className="section-title">
              Get Top Courses at <span>Unbeatable Prices</span>
            </h2>
            <p className="section-desc">
              Access world-class courses without breaking the bank
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => fetchFeaturedCourses(currency)}>Retry</button>
            </div>
          )}

          {/* Loading State */}
          {isLoadingFeatured ? (
            <div className="courses-grid">
              {[1, 2, 3].map(i => <CourseSkeleton key={i} />)}
            </div>
          ) : featuredCourses.length > 0 ? (
            <>
              {/* Courses Grid - Show max 5 */}
              <div className="courses-grid">
                {featuredCourses.slice(0, 5).map(course => (
                  <CourseCard 
                    key={course._id} 
                    course={course}
                    onClick={() => navigate(`/courses/${course.slug}`)}
                  />
                ))}
              </div>

              {/* View All Button */}
              <div className="view-all-wrapper">
                <button 
                  className="view-all-btn"
                  onClick={() => navigate('/courses')}
                >
                  View All Courses
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="empty-state">
              <p>No featured courses yet. Check back soon!</p>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/courses')}
              >
                Browse All Courses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />
    </div>
  );
}