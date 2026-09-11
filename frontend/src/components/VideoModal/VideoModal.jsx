// VideoModal.jsx
import React, { useEffect } from 'react';
import './VideoModal.css';
import { X, ExternalLink } from 'lucide-react';

export default function VideoModal({ onClose, videoUrl, title = 'Course Preview Trailer' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const formatEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  const embedUrl = formatEmbedUrl(videoUrl);
  const externalUrl = embedUrl.replace('/preview', '/view');

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="video-modal-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="video-responsive-wrapper">
          <iframe
            src={embedUrl}
            title={title}
            className="video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="video-modal-info">
          <div className="video-modal-info-content">
            <span className="video-modal-badge">FREE PREVIEW</span>
            <h3 className="video-modal-title">{title}</h3>
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