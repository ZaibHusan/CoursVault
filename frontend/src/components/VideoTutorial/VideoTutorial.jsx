import React, { useState, useEffect } from 'react';
import { Play, X, ShoppingCart, CreditCard, Download } from 'lucide-react';
import './VideoTutorial.css';

const VIDEO_ID = '3hDOD2V08NA';
const THUMB = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

export default function VideoTutorial() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <section className="vt-guide">
        <div className="vt-guide-inner">
          {/* ---- Small preview card ---- */}
          <button
            type="button"
            className="vt-card"
            onClick={() => setOpen(true)}
            aria-label="Watch how to buy a course"
          >
            <div className="vt-card-thumb">
              <img src={THUMB} alt="" loading="lazy" />
              <span className="vt-card-play">
                <Play size={14} fill="currentColor" />
              </span>
              <span className="vt-card-duration">0:58</span>
            </div>

            <div className="vt-card-info">
              <span className="vt-card-tag">
                <span className="vt-live-dot" />
                WEBSITE GUIDE
              </span>
              <strong className="vt-card-title">How To Buy Course</strong>
              <span className="vt-card-sub">Watch the 60-second walkthrough</span>
            </div>
          </button>

          {/* ---- Steps ---- */}
          <div className="vt-steps">
            <div className="vt-step">
              <ShoppingCart size={13} />
              <span>Pick a course</span>
            </div>
            <span className="vt-arrow">→</span>
            <div className="vt-step">
              <CreditCard size={13} />
              <span>Pay securely</span>
            </div>
            <span className="vt-arrow">→</span>
            <div className="vt-step">
              <Download size={13} />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Dialog ---- */}
      {open && (
        <div className="vt-overlay" onClick={() => setOpen(false)}>
          <div className="vt-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vt-close"
              onClick={() => setOpen(false)}
              aria-label="Close video"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="vt-frame">
              <iframe
                className="vt-iframe"
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="How to buy a course"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}