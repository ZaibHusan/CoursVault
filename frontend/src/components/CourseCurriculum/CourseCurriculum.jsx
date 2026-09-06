import React, { useState } from 'react';
import { ChevronDown, Play, FileText, Lock } from 'lucide-react';
import VideoModal from '../VideoModal/VideoModal';
import './CourseCurriculum.css';

export default function CourseCurriculum({ curriculum = [] }) {
  const [openModule, setOpenModule] = useState(0);
  const [previewLecture, setPreviewLecture] = useState(null);

  if (!curriculum.length) {
    return <p className="no-curriculum">Curriculum coming soon</p>;
  }

  return (
    <div className="curriculum">
      <h2>Course Content</h2>
      
      {curriculum.map((module, index) => (
        <div key={index} className="module">
          <button 
            className="module-header"
            onClick={() => setOpenModule(openModule === index ? -1 : index)}
          >
            <span>{module.title || `Module ${index + 1}`}</span>
            <span>{module.lectures?.length || 0} lectures</span>
            <ChevronDown className={openModule === index ? 'rotate' : ''} />
          </button>
          
          {openModule === index && (
            <div className="lectures">
              {(module.lectures || []).map((lecture, lIndex) => (
                <div key={lIndex} className="lecture">
                  {lecture.type === 'video' ? <Play size={14} /> : <FileText size={14} />}
                  <span>{lecture.title}</span>
                  
                  {/* Preview button if lecture has preview */}
                  {lecture.isPreview && lecture.previewUrl ? (
                    <button 
                      className="preview-btn"
                      onClick={() => setPreviewLecture(lecture)}
                    >
                      <Play size={12} />
                      Preview
                    </button>
                  ) : lecture.isPreview ? (
                    <span className="preview-tag">
                      <Play size={12} />
                      Preview
                    </span>
                  ) : (
                    <Lock size={12} className="lock-icon" />
                  )}
                  
                  <span className="duration">{lecture.duration}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Video Modal for Preview */}
      {previewLecture && (
        <VideoModal
          onClose={() => setPreviewLecture(null)}
          videoUrl={previewLecture.previewUrl}
        />
      )}
    </div>
  );
}