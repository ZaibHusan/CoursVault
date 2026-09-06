import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseHeader from '../../components/courseHeader/CourseHeader';
import CourseCard from '../../components/courseCard/CourseCard';
import { useCourses } from '../../hooks/useCourses';
import { useCurrency } from '../../hooks/useCurrency';
import { Search, X } from 'lucide-react';
import './Courses.css';

export default function Courses() {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { 
    allCourses, isLoadingAll, error, fetchAllCourses, dismissError 
  } = useCourses();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllCourses(currency);
  }, [currency]);

  // Filter courses
  const filteredCourses = allCourses.filter(course => {
    if (!searchTerm) return true;
    return course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
    <div className="courses-page">
      <div className="container">
        <CourseHeader />

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results count */}
        {searchTerm && !isLoadingAll && (
          <p className="results-count">
            {filteredCourses.length} course(s) found for "{searchTerm}"
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <div>
              <button onClick={() => fetchAllCourses(currency)}>Retry</button>
              <button onClick={dismissError}>Dismiss</button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoadingAll ? (
          <div className="courses-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <CourseSkeleton key={i} />)}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course._id} 
                course={course}
                onClick={() => navigate(`/courses/${course.slug}`)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>{searchTerm ? 'Try different keywords' : 'Courses coming soon'}</p>
          </div>
        )}
      </div>
    </div>
  );
}