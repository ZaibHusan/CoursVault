import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hook/useCourses';
import { 
  ArrowLeft, Upload, Save, X, Plus, Trash2, Play, Star, Link as LinkIcon, DollarSign 
} from 'lucide-react';
import './CourseCreate.css';

export default function CourseCreate() {
  const navigate = useNavigate();
  const { createCourse, uploadThumbnail } = useCourses();
  
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
    curriculum: []
  });

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
    
    try {
      const result = await uploadThumbnail(file);
      if (result?.success && result?.url) {
        setFormData(prev => ({ ...prev, thumbnail: result.url }));
        setSuccessMessage('Image uploaded!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        setError(result?.message || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Try again.');
    } finally {
      setUploadingImg(false);
    }
  };

  // Curriculum
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
    
    if (!formData.title.trim()) {
      setError('Course title is required');
      return;
    }
    if (!formData.shortDescription.trim()) {
      setError('Short description is required');
      return;
    }
    if (!formData.price || Number(formData.price) < 0) {
      setError('Price (USD) is required');
      return;
    }
    if (!formData.driveLink.trim()) {
      setError('Google Drive link is required');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await createCourse(formData);
      if (result?.success) {
        navigate('/courses');
      } else {
        setError(result?.message || 'Failed to create course');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
              <h1>Create Course</h1>
              <p>Add a new premium course (Price in USD)</p>
            </div>
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
                placeholder="e.g. Complete Web Development Bootcamp"
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
                placeholder="Short punchy description..."
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
                    placeholder="10"
                    min="0"
                  />
                </div>
                <span className="form-hint">Base price in USD. Auto-converts to INR/PKR.</span>
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
                    placeholder="99"
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

            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="isFeatured" 
                  checked={formData.isFeatured} 
                  onChange={handleChange} 
                />
                <Star size={16} />
                Mark as Featured Course
              </label>
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
              {loading ? 'Creating...' : (
                <>
                  <Save size={18} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}