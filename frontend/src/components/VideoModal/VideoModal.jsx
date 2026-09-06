// VideoModal.jsx
import React, { useEffect } from 'react';
import './VideoModal.css';
import { X, ExternalLink } from 'lucide-react';

export default function VideoModal({ onClose, videoUrl }) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Format URL to ensure it uses /preview for iframes
  const formatEmbedUrl = (url) => {
    if (!url) return "https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/preview";
    
    // Extract the Drive file ID and force the /preview endpoint
    const driveIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
    }
    return url;
  };

  const embedUrl = formatEmbedUrl(videoUrl);
  
  // Create a proper external view link
  const externalUrl = embedUrl.replace('/preview', '/view');

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          className="video-modal-close" 
          onClick={onClose}
          aria-label="Close preview"
        >
          <X size={20} />
        </button>

        {/* Video Wrapper */}
        <div className="video-responsive-wrapper">
          <iframe 
            src={embedUrl}
            title="Course Preview Trailer"
            className="video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Info & Action Bar */}
        <div className="video-modal-info">
          <div className="video-modal-info-content">
            <span className="video-modal-badge">FREE PREVIEW</span>
            <h3 className="video-modal-title">Course Preview Trailer</h3>
          </div>
          
          <a 
            href={externalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="video-modal-external"
          >
            <ExternalLink size={14} />
            Open in Google Drive
          </a>
        </div>

      </div>
    </div>
  );
}