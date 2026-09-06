import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hook/useCourses';
import { 
  Plus, Pencil, Trash2, Eye, EyeOff, Star, Search, BookOpen, GraduationCap, Clock, DollarSign, Users, X 
} from 'lucide-react';
import './Courses.css';

export default function Courses() {
  const navigate = useNavigate();
  const { 
    courses, isLoading, error, fetchCourses, deleteCourse, togglePublish, toggleFeatured 
  } = useCourses();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    await deleteCourse(deleteConfirm);
    setDeleteConfirm(null);
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' 
      ? true 
      : filterStatus === 'published' 
        ? course.isPublished 
        : filterStatus === 'featured'
          ? course.isFeatured
          : !course.isPublished;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    drafts: courses.filter(c => !c.isPublished).length,
    featured: courses.filter(c => c.isFeatured).length
  };

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0';
    return `$${Number(price).toLocaleString('en-US')}`;
  };

  // Skeleton loader
  const CourseSkeleton = () => (
    <div className="course-card-skeleton">
      <div className="skeleton-thumbnail"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-actions"></div>
      </div>
    </div>
  );

  return (
    <div className="courses-page">
      {/* Header */}
      <div className="courses-page-header">
        <div className="header-left">
          <h1>Course Management</h1>
          <p>Manage your premium courses (Prices in USD)</p>
        </div>
        <button 
          className="btn-create-course"
          onClick={() => navigate('/courses/create')}
        >
          <Plus size={20} />
          Create Course
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon published">
            <GraduationCap size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.published}</span>
            <span className="stat-label">Published</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon draft">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.drafts}</span>
            <span className="stat-label">Drafts</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon featured">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.featured}</span>
            <span className="stat-label">Featured</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="courses-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'published' ? 'active' : ''}`}
            onClick={() => setFilterStatus('published')}
          >
            Published
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'draft' ? 'active' : ''}`}
            onClick={() => setFilterStatus('draft')}
          >
            Drafts
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'featured' ? 'active' : ''}`}
            onClick={() => setFilterStatus('featured')}
          >
            Featured
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={fetchCourses}>Retry</button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="courses-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-card-thumbnail">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250?text=Course';
                  }}
                />
                <div className="course-badges">
                  <span className={`course-status ${course.isPublished ? 'published' : 'draft'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  {course.isFeatured && (
                    <span className="course-featured">
                      <Star size={12} /> Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="course-card-body">
                <h3 className="course-card-title">{course.title}</h3>
                
                <div className="course-card-meta">
                  <span className="course-price">
                    <DollarSign size={14} />
                    {course.priceUSD || course.price || 0}
                  </span>
                  {(course.originalPriceUSD || course.originalPrice) > (course.priceUSD || course.price) && (
                    <span className="course-original-price">
                      {formatPrice(course.originalPriceUSD || course.originalPrice)}
                    </span>
                  )}
                  <span className="course-students">
                    <Users size={14} />
                    {course.studentsEnrolled || 0}
                  </span>
                </div>
                
                <p className="course-card-description">
                  {course.shortDescription || course.description}
                </p>
              </div>
              
              <div className="course-card-actions">
                <button 
                  className={`action-btn ${course.isFeatured ? 'featured-btn active' : 'featured-btn'}`}
                  onClick={() => toggleFeatured(course._id)}
                  title={course.isFeatured ? 'Remove Featured' : 'Make Featured'}
                >
                  <Star size={18} />
                </button>
                <button 
                  className="action-btn publish-btn"
                  onClick={() => togglePublish(course._id)}
                  title={course.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {course.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => navigate(`/courses/edit/${course._id}`)}
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(course._id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No courses found</h3>
          <p>{searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Start by creating your first course'}</p>
          {!searchTerm && filterStatus === 'all' && (
            <button 
              className="btn-create-course"
              onClick={() => navigate('/courses/create')}
            >
              <Plus size={20} />
              Create Course
            </button>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Course</h3>
            <p>Are you sure you want to delete this course? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}