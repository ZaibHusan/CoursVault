// ============================================
// CoursesGuy - Main Entry Point
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

/**
 * Register service worker + handle updates
 */
function registerServiceWorker() {
  // Only register in production (not in dev mode)
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Worker not supported');
    return;
  }

  // Skip registration during local development
  // (Vite dev server uses HMR; SW would interfere)
  if (import.meta.env.DEV) {
    console.log('[SW] Skipping registration in dev mode');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration.scope);

        // ============================================
        // CHECK FOR UPDATES
        // ============================================
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[SW] New version found — installing...');

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('[SW] New version ready');
              
              // Dispatch custom event → your UI can show update banner
              window.dispatchEvent(
                new CustomEvent('sw-update-available', {
                  detail: { registration },
                })
              );
            }
          });
        });

        // Check for updates every 1 hour
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000);
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
  });

  // ============================================
  // RELOAD PAGE WHEN NEW SW TAKES OVER
  // ============================================
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('[SW] Controller changed — reloading...');
    window.location.reload();
  });
}

// Register SW
registerServiceWorker();

// ============================================
// RENDER APP
// ============================================

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);