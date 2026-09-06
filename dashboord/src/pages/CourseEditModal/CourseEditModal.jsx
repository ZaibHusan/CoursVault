import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../../hook/useCourses';
import { 
  ArrowLeft, Upload, Save, X, Plus, Trash2, Play, Star, Link as LinkIcon, Eye, EyeOff, DollarSign 
} from 'lucide-react';
import './CourseEditModal.css';

export default function CourseEditModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    singleCourse, fetchCourse, updateCourse, togglePublish, toggleFeatured, uploadThumbnail, isLoading 
  } = useCourses();
  
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    thumbnail: '',
    price: '',
    originalPrice: '',
    access: 'Lifetime Access',
    driveLink: '',
    rating: 4.5,
    studentsEnrolled: 0,
    isFeatured: false,
    isPublished: false,
    curriculum: []
  });

  useEffect(() => {
    const loadCourse = async () => {
      if (id) {
        const result = await fetchCourse(id);
        if (!result?.success) {
          setError(result?.message || 'Failed to load course');
        }
      }
    };
    loadCourse();
  }, [id]);

  useEffect(() => {
    if (singleCourse && singleCourse._id === id) {
      setFormData({
        title: singleCourse.title || '',
        shortDescription: singleCourse.shortDescription || singleCourse.description || '',
        thumbnail: singleCourse.thumbnail || '',
        price: singleCourse.priceUSD || singleCourse.price || '',
        originalPrice: singleCourse.originalPriceUSD || singleCourse.originalPrice || '',
        access: singleCourse.access || 'Lifetime Access',
        driveLink: singleCourse.driveLink || singleCourse.fulfillment?.driveLink || '',
        rating: singleCourse.rating || 4.5,
        studentsEnrolled: singleCourse.studentsEnrolled || 0,
        isFeatured: singleCourse.isFeatured || false,
        isPublished: singleCourse.isPublished || false,
        curriculum: singleCourse.curriculum ? JSON.parse(JSON.stringify(singleCourse.curriculum)) : []
      });
    }
  }, [singleCourse, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingImg(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const result = await uploadThumbnail(file);
      if (result?.success && result?.url) {
        setFormData(prev => ({ ...prev, thumbnail: result.url }));
        setSuccessMessage('Image uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setError(result?.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImg(false);
    }
  };

  // Curriculum handlers - Immutable updates
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: '', lectures: [] }]
    }));
  };

  const updateModule = (index, title) => {
    setFormData(prev => {
      const updated = prev.curriculum.map((module, i) => 
        i === index ? { ...module, title } : module
      );
      return { ...prev, curriculum: updated };
    });
  };

  const removeModule = (index) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }));
  };

  const addLecture = (moduleIndex) => {
    setFormData(prev => {
      const updated = prev.curriculum.map((module, i) => {
        if (i === moduleIndex) {
          return {
            ...module,
            lectures: [...(module.lectures || []), {
              title: '', duration: '', type: 'video', isPreview: false, previewUrl: ''
            }]
          };
        }
        return module;
      });
      return { ...prev, curriculum: updated };
    });
  };

  const updateLecture = (moduleIndex, lectureIndex, field, value) => {
    setFormData(prev => {
      const updated = prev.curriculum.map((module, i) => {
        if (i === moduleIndex) {
          return {
            ...module,
            lectures: (module.lectures || []).map((lecture, j) => {
              if (j === lectureIndex) {
                return { ...lecture, [field]: value };
              }
              return lecture;
            })
          };
        }
        return module;
      });
      return { ...prev, curriculum: updated };
    });
  };

  const removeLecture = (moduleIndex, lectureIndex) => {
    setFormData(prev => {
      const updated = prev.curriculum.map((module, i) => {
        if (i === moduleIndex) {
          return {
            ...module,
            lectures: (module.lectures || []).filter((_, j) => j !== lectureIndex)
          };
        }
        return module;
      });
      return { ...prev, curriculum: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Course title is required');
      return;
    }
    if (!formData.shortDescription.trim()) {
      setError('Short description is required');
      return;
    }
    if (!formData.price || Number(formData.price) < 0) {
      setError('Price (USD) must be a valid number');
      return;
    }
    if (!formData.driveLink.trim()) {
      setError('Google Drive link is required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const courseId = singleCourse?._id || id;
      const result = await updateCourse(courseId, formData);
      
      if (result?.success) {
        setSuccessMessage('Course updated successfully!');
        setTimeout(() => navigate('/courses'), 1500);
      } else {
        setError(result?.message || 'Failed to update course');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPublish = async () => {
    setError('');
    try {
      const result = await togglePublish(id);
      if (result?.success) {
        setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }));
        setSuccessMessage(formData.isPublished ? 'Course unpublished!' : 'Course published!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setError(result?.message || 'Failed to toggle');
      }
    } catch (err) {
      setError('Failed to toggle publish status');
    }
  };

  const handleQuickFeatured = async () => {
    setError('');
    try {
      const result = await toggleFeatured(id);
      if (result?.success) {
        setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }));
        setSuccessMessage(formData.isFeatured ? 'Removed from featured!' : 'Marked as featured!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setError(result?.message || 'Failed to toggle');
      }
    } catch (err) {
      setError('Failed to toggle featured status');
    }
  };

  // Loading skeleton
  if (isLoading || !singleCourse || singleCourse._id !== id) {
    return (
      <div className="course-form-page">
        <div className="form-container">
          <div className="edit-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-field"></div>
            <div className="skeleton-field"></div>
            <div className="skeleton-field"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-page">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/courses')}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1>Edit Course</h1>
              <p>Update course details (Price in USD)</p>
            </div>
          </div>
          <div className="quick-actions">
            <button 
              className={`quick-btn ${formData.isPublished ? 'active' : ''}`}
              onClick={handleQuickPublish}
            >
              {formData.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
              {formData.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <button 
              className={`quick-btn ${formData.isFeatured ? 'active' : ''}`}
              onClick={handleQuickFeatured}
            >
              <Star size={18} />
              {formData.isFeatured ? 'Featured' : 'Feature'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-banner">
            <X size={18} />
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        {successMessage && (
          <div className="success-banner">
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          {/* Basic Info */}
          <div className="form-section">
            <div className="section-header">
              <h2>Basic Information</h2>
            </div>
            
            <div className="form-group">
              <label>Course Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Short Description * (Max 150 chars)</label>
              <textarea 
                name="shortDescription" 
                value={formData.shortDescription} 
                onChange={handleChange} 
                required 
                rows="2"
                maxLength="150"
              />
              <span className="char-count">{formData.shortDescription.length}/150</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (USD) *</label>
                <div className="input-with-icon">
                  <DollarSign size={16} />
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Original Price (USD)</label>
                <div className="input-with-icon">
                  <DollarSign size={16} />
                  <input 
                    type="number" 
                    name="originalPrice" 
                    value={formData.originalPrice} 
                    onChange={handleChange} 
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rating</label>
                <input 
                  type="number" 
                  name="rating" 
                  value={formData.rating} 
                  onChange={handleChange} 
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>
              <div className="form-group">
                <label>Students Enrolled</label>
                <input 
                  type="number" 
                  name="studentsEnrolled" 
                  value={formData.studentsEnrolled} 
                  onChange={handleChange} 
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="form-section">
            <div className="section-header">
              <h2>Thumbnail</h2>
            </div>
            
            <div className="upload-area">
              {formData.thumbnail ? (
                <div className="thumbnail-preview">
                  <img src={formData.thumbnail} alt="Thumbnail" />
                  <button 
                    type="button"
                    className="remove-thumbnail"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={32} />
                  <span>Upload Thumbnail</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploadingImg}
                className="file-input"
              />
              {uploadingImg && <span className="uploading-text">Uploading...</span>}
            </div>
          </div>

          {/* Drive Link */}
          <div className="form-section">
            <div className="section-header">
              <h2>Fulfillment</h2>
            </div>
            
            <div className="form-group">
              <label>Google Drive Link *</label>
              <div className="input-with-icon">
                <LinkIcon size={16} />
                <input 
                  type="url" 
                  name="driveLink" 
                  value={formData.driveLink} 
                  onChange={handleChange} 
                  required 
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Access Type</label>
              <select 
                name="access" 
                value={formData.access} 
                onChange={handleChange}
              >
                <option value="Lifetime Access">Lifetime Access</option>
                <option value="1 Year Access">1 Year Access</option>
                <option value="6 Months Access">6 Months Access</option>
              </select>
            </div>
          </div>

          {/* Curriculum */}
          <div className="form-section">
            <div className="section-header">
              <h2>Curriculum (Optional)</h2>
              <button 
                type="button" 
                className="btn-add-section" 
                onClick={addModule}
              >
                <Plus size={18} />
                Add Module
              </button>
            </div>
            
            {formData.curriculum.length === 0 ? (
              <div className="curriculum-empty">
                <p>No modules yet. Optional - add for better trust.</p>
              </div>
            ) : (
              formData.curriculum.map((module, mIndex) => (
                <div key={mIndex} className="module-card">
                  <div className="module-header">
                    <span>Module {mIndex + 1}</span>
                    <button 
                      type="button" 
                      className="btn-remove" 
                      onClick={() => removeModule(mIndex)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Module Title"
                    value={module.title}
                    onChange={(e) => updateModule(mIndex, e.target.value)}
                    className="module-title-input"
                  />
                  
                  <div className="lessons-list">
                    {(module.lectures || []).map((lecture, lIndex) => (
                      <div key={lIndex} className="lesson-item">
                        <input 
                          type="text" 
                          placeholder="Lecture Title"
                          value={lecture.title}
                          onChange={(e) => updateLecture(mIndex, lIndex, 'title', e.target.value)}
                        />
                        <input 
                          type="text" 
                          placeholder="Duration"
                          value={lecture.duration}
                          onChange={(e) => updateLecture(mIndex, lIndex, 'duration', e.target.value)}
                          className="duration-input"
                        />
                        <label className="preview-checkbox">
                          <input 
                            type="checkbox"
                            checked={lecture.isPreview}
                            onChange={(e) => updateLecture(mIndex, lIndex, 'isPreview', e.target.checked)}
                          />
                          <Play size={12} /> Preview
                        </label>
                        {lecture.isPreview && (
                          <input 
                            type="text" 
                            placeholder="Preview URL"
                            value={lecture.previewUrl}
                            onChange={(e) => updateLecture(mIndex, lIndex, 'previewUrl', e.target.value)}
                            className="preview-url-input"
                          />
                        )}
                        <button 
                          type="button" 
                          className="btn-remove-lesson" 
                          onClick={() => removeLecture(mIndex, lIndex)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn-add-lesson" 
                      onClick={() => addLecture(mIndex)}
                    >
                      <Plus size={16} />
                      Add Lecture
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => navigate('/courses')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save" 
              disabled={loading || uploadingImg}
            >
              {loading ? 'Saving...' : (
                <>
                  <Save size={18} />
                  Update Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}