import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CourseDetails.css';

import CourseCurriculum from '../../components/CourseCurriculum/CourseCurriculum';
import Testimonials from '../../components/Testimonials/Testimonials';
import CoursePricingCard from '../../components/CoursePricingCard/CoursePricingCard';

import { useCourses } from '../../hooks/useCourses';
import { useCurrency } from '../../hooks/useCurrency';

import {
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  Clock
} from 'lucide-react';

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const {
    singleCourse,
    isLoadingSingle,
    error,
    fetchCourseBySlug,
    clearCourse
  } = useCourses();

  useEffect(() => {
    if (slug) {
      fetchCourseBySlug(slug, currency);
    }

    return () => clearCourse();
  }, [slug, currency]);

  // Loading Skeleton
  if (isLoadingSingle) {
    return (
      <div className="course-details-page">
        <div className="container">

          <div className="skeleton-breadcrumb"></div>

          <div className="course-top-section">

            <div className="course-hero">

              <div className="skeleton-thumbnail"></div>

              <div className="skeleton-badges">
                <div className="skeleton-badge"></div>
                <div className="skeleton-badge"></div>
              </div>

              <div className="skeleton-title"></div>
              <div className="skeleton-title short"></div>

              <div className="skeleton-trust">
                <div className="skeleton-trust-item"></div>
                <div className="skeleton-trust-item"></div>
                <div className="skeleton-trust-item"></div>
              </div>

              <div className="skeleton-desc"></div>
              <div className="skeleton-desc short"></div>

            </div>

            <div className="course-sidebar">
              <div className="skeleton-pricing"></div>
            </div>

          </div>

          <div className="skeleton-curriculum">
            <div className="skeleton-module"></div>
            <div className="skeleton-module"></div>
            <div className="skeleton-module"></div>
          </div>

        </div>
      </div>
    );
  }

  // Error State
  if (error || !singleCourse) {
    return (
      <div className="course-details-page">
        <div className="container">

          <div className="course-details-error">

            <AlertCircle
              size={64}
              style={{ color: '#EF4444' }}
            />

            <h2>Course Not Found</h2>

            <p>
              {error || 'Course unavailable'}
            </p>

            <button
              onClick={() => navigate('/courses')}
              className="back-btn"
            >
              Back to Courses
            </button>

          </div>

        </div>
      </div>
    );
  }

  const {
    title,
    shortDescription,
    thumbnail,
    rating = 4.5,
    studentsEnrolled = 0,
    totalLectures = 0,
    access = 'Lifetime Access',
    curriculum = []
  } = singleCourse;

  return (
    <div className="course-details-page">

      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb">

          <Link
            to="/"
            className="breadcrumb-link"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            to="/courses"
            className="breadcrumb-link"
          >
            Courses
          </Link>

          <ChevronRight size={14} />

          <span className="breadcrumb-current">
            {title?.slice(0, 30)}...
          </span>

        </div>

        {/* Top Section */}
        <div className="course-top-section">

          {/* Left Side */}
          <div className="course-hero">

            {/* Thumbnail */}
            <div className="hero-thumbnail">

              <img
                src={thumbnail}
                alt={title}
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/800x450?text=Course';
                }}
              />

            </div>

            {/* Simple Badges */}
            <div className="hero-badges">

              <span className="badge-access">
                {access}
              </span>

              <span className="badge-verified">
                <ShieldCheck size={12} />
                Verified
              </span>

            </div>

            {/* Title */}
            <h1 className="hero-title">
              {title}
            </h1>

            {/* Course Stats */}
            <div className="hero-trust">

              <span>
                <Star size={14} />
                {rating.toFixed(1)} Rating
              </span>

              <span>
                <Users size={14} />
                {studentsEnrolled.toLocaleString('en-IN')} Students
              </span>

              {totalLectures > 0 && (
                <span>
                  <Clock size={14} />
                  {totalLectures} Lectures
                </span>
              )}

            </div>

            {/* Description */}
            {shortDescription && (
              <p className="hero-desc">
                {shortDescription}
              </p>
            )}

          </div>

          {/* Right Side Pricing Card */}
          <div className="course-sidebar">

            <CoursePricingCard
              course={singleCourse}
            />

          </div>

        </div>

        {/* Curriculum */}
        <div className="course-body-section">

          <CourseCurriculum
            curriculum={curriculum}
          />

        </div>

        {/* Testimonials */}
        <div className="course-testimonials-section">

          <Testimonials
            courseId={singleCourse._id}
          />

        </div>

      </div>

    </div>
  );
}