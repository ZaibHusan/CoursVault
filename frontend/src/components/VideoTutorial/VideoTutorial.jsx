import React, { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import './VideoTutorial.css';

const THUMB =
  'https://res.cloudinary.com/fzfzhvkj/image/upload/v1789715731/ChatGPT_Image_Sep_18_2026_12_15_14_AM.png';

const VIDEO_URL =
  'https://player.cloudinary.com/embed/?cloud_name=fzfzhvkj&public_id=Website_Guide';

export default function VideoTutorial() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <section className="vt-guide">
        <div className="vt-guide-inner">
          <button
            type="button"
            className="vt-card"
            onClick={() => setOpen(true)}
            aria-label="Watch how to use CoursesGuy"
          >
            <div className="vt-card-thumb">
              <img
                src={THUMB}
                alt="How to use CoursesGuy"
                loading="lazy"
              />

              <div className="vt-card-overlay">
                <span className="vt-card-play">
                  <Play
                    size={20}
                    fill="currentColor"
                  />
                </span>
              </div>

              <span className="vt-card-duration">
                0:58
              </span>
            </div>

            <div className="vt-card-info">
              <h2 className="vt-card-title">
                How to use CoursesGuy
              </h2>

              <p className="vt-card-subtitle">
                Watch the 60-sec guide
              </p>
            </div>
          </button>
        </div>
      </section>

      {open && (
        <div
          className="vt-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="CoursesGuy video guide"
        >
          <div
            className="vt-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vt-close"
              onClick={() => setOpen(false)}
              aria-label="Close video"
            >
              <X
                size={18}
                strokeWidth={2.5}
              />
            </button>

            <div className="vt-frame">
              <iframe
                className="vt-iframe"
                src={VIDEO_URL}
                title="CoursesGuy Website Guide"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}