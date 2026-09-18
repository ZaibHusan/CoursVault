// ============================================
// usePWAInstall Hook
// Handles PWA install prompt for:
// - Android / Desktop (beforeinstallprompt)
// - iOS (manual instructions)
// ============================================

import { useState, useEffect, useCallback } from 'react';

const DISMISS_KEY = 'coursesguy_pwa_dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // ============================================
  // DETECT PLATFORM + INSTALL STATE
  // ============================================
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();

    const iosDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    const androidDevice = /android/.test(ua);
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    setIsIOS(iosDevice);
    setIsAndroid(androidDevice);
    setIsStandalone(standalone);
    setIsInstalled(standalone);

    console.log('[PWA] Platform:', {
      ios: iosDevice,
      android: androidDevice,
      standalone,
    });
  }, []);

  // ============================================
  // ANDROID / DESKTOP - Capture install prompt
  // ============================================
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log('[PWA] beforeinstallprompt captured');
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect when user actually installs
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.removeItem(DISMISS_KEY);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // ============================================
  // CHECK DISMISS STATE
  // ============================================
  const isDismissed = useCallback(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) return false;

    const dismissedAt = parseInt(dismissed, 10);
    const now = Date.now();

    if (now - dismissedAt > DISMISS_DURATION) {
      localStorage.removeItem(DISMISS_KEY);
      return false;
    }
    return true;
  }, []);

  // ============================================
  // TRIGGER INSTALL PROMPT
  // ============================================
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] No deferred prompt available');
      return { outcome: 'unavailable' };
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }

      setDeferredPrompt(null);
      return { outcome };
    } catch (err) {
      console.error('[PWA] Install prompt error:', err);
      return { outcome: 'error', error: err };
    }
  }, [deferredPrompt]);

  // ============================================
  // DISMISS PROMPT (remember for 7 days)
  // ============================================
  const dismissPrompt = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setIsInstallable(false);
  }, []);

  // ============================================
  // RESET (for testing)
  // ============================================
  const resetDismiss = useCallback(() => {
    localStorage.removeItem(DISMISS_KEY);
  }, []);

  return {
    // State
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    isAndroid,
    isDismissed: isDismissed(),

    // Actions
    promptInstall,
    dismissPrompt,
    resetDismiss,

    // Helpers
    hasNativePrompt: !!deferredPrompt,
  };
}