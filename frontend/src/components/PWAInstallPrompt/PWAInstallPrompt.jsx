import { useState, useEffect } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import './PWAInstallPrompt.css';

export default function PWAInstallPrompt() {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isDismissed,
    promptInstall,
    dismissPrompt,
  } = usePWAInstall();

  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // ============================================
  // SMART TIMING: Show after 30 seconds
  // ============================================
  useEffect(() => {
    if (isInstalled || isDismissed) return;

    // Only show if installable (Android/Desktop) OR iOS
    if (!isInstallable && !isIOS) return;

    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [isInstallable, isIOS, isInstalled, isDismissed]);

  // ============================================
  // HANDLE INSTALL CLICK
  // ============================================
  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    const result = await promptInstall();
    if (result.outcome === 'accepted') {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    dismissPrompt();
  };

  // Don't render if already installed or dismissed
  if (isInstalled || isDismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <>
      {/* ============================================ */}
      {/* BOTTOM BANNER                                */}
      {/* ============================================ */}
      {showBanner && (
        <div className="pwa-banner">
          <div className="pwa-banner__content">
            <div className="pwa-banner__icon">CG</div>
            <div className="pwa-banner__text">
              <strong>Install CoursesGuy</strong>
              <span>Faster access, works offline</span>
            </div>
          </div>

          <div className="pwa-banner__actions">
            <button
              className="pwa-banner__btn pwa-banner__btn--ghost"
              onClick={handleDismiss}
            >
              Not now
            </button>
            <button
              className="pwa-banner__btn pwa-banner__btn--primary"
              onClick={handleInstall}
            >
              Install
            </button>
          </div>

          <button
            className="pwa-banner__close"
            onClick={handleDismiss}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      {/* ============================================ */}
      {/* iOS INSTRUCTIONS MODAL                       */}
      {/* ============================================ */}
      {showIOSModal && (
        <div
          className="pwa-modal__overlay"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="pwa-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pwa-modal__header">
              <h3>Install on iPhone / iPad</h3>
              <button
                className="pwa-modal__close"
                onClick={() => setShowIOSModal(false)}
              >
                ×
              </button>
            </div>

            <div className="pwa-modal__body">
              <ol className="pwa-modal__steps">
                <li>
                  <span className="pwa-modal__step-num">1</span>
                  <div>
                    Tap the <strong>Share</strong> button
                    <span className="pwa-modal__share-icon">⎋</span>
                    at the bottom of Safari
                  </div>
                </li>
                <li>
                  <span className="pwa-modal__step-num">2</span>
                  <div>
                    Scroll down and tap{' '}
                    <strong>Add to Home Screen</strong>
                  </div>
                </li>
                <li>
                  <span className="pwa-modal__step-num">3</span>
                  <div>
                    Tap <strong>Add</strong> in the top right corner
                  </div>
                </li>
              </ol>

              <p className="pwa-modal__note">
                💡 CoursesGuy will appear on your home screen like a native app.
              </p>
            </div>

            <div className="pwa-modal__footer">
              <button
                className="pwa-modal__btn"
                onClick={() => setShowIOSModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}