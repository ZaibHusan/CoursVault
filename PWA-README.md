# 📘 CoursesGuy PWA — Complete Implementation Guide

**Domain:** https://coursesguy.com  
**Stack:** React 19 + Vite 8 + Redux + React Router  
**PWA Version:** 1.0.0  
**Theme Color:** #E63946 (Red)  
**Background:** #080808 (Black)

---

## 🎯 WHAT IS A PWA?

A **Progressive Web App** = website + native app features:
- ✅ Installable on Android / iOS / Desktop
- ✅ Works offline (cached pages)
- ✅ Fullscreen (no browser UI)
- ✅ Home screen icon
- ✅ Splash screen
- ✅ Auto-updating

---

## 📁 COMPLETE FOLDER STRUCTURE

```
frontend/
├── public/
│   ├── sw.js                          ← Service Worker (core)
│   ├── offline.html                   ← Offline fallback page
│   ├── manifest.json                  ← PWA config
│   ├── favicon.svg                    ← Browser tab icon (SVG)
│   ├── app-icon.svg                   ← Source icon (SVG)
│   ├── logo-box.svg                   ← Brand logo
│   ├── og-image.jpg                   ← Social share image
│   ├── robots.txt                     ← SEO crawler rules
│   ├── sitemap.xml                    ← SEO sitemap
│   └── icons/                         ← PWA icons (PNG)
│       ├── android/
│       │   ├── launchericon-48x48.png
│       │   ├── launchericon-72x72.png
│       │   ├── launchericon-96x96.png
│       │   ├── launchericon-144x144.png
│       │   ├── launchericon-192x192.png
│       │   └── launchericon-512x512.png
│       ├── ios/
│       │   ├── 16.png  32.png  48.png
│       │   ├── 72.png  96.png  128.png
│       │   ├── 144.png  152.png  167.png
│       │   ├── 180.png  192.png  256.png
│       │   ├── 512.png  1024.png
│       │   └── (splash screens)
│       └── windows/
│           └── (tiles + splash)
│
├── src/
│   ├── hooks/
│   │   └── usePWAInstall.js           ← Install logic hook
│   ├── components/
│   │   └── PWAInstallPrompt/
│   │       ├── PWAInstallPrompt.jsx   ← Install banner UI
│   │       └── PWAInstallPrompt.css   ← Banner styles
│   ├── App.jsx                        ← Mounts <PWAInstallPrompt />
│   └── main.jsx                       ← Registers service worker
│
└── index.html                         ← PWA meta tags
```

---

## 🧠 HOW PWA WORKS — THE FLOW

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   1. USER VISITS coursesguy.com                 │
│              ↓                                  │
│   2. index.html loads                           │
│      - reads manifest.json                      │
│      - finds icons + theme color                │
│              ↓                                  │
│   3. main.jsx runs                              │
│      - registers /sw.js                         │
│              ↓                                  │
│   4. Service Worker installs                    │
│      - caches static files (HTML, CSS, JS, icons)
│      - creates 3 caches (static/dynamic/api)    │
│              ↓                                  │
│   5. App becomes INSTALLABLE                    │
│      - Chrome fires 'beforeinstallprompt'       │
│      - usePWAInstall hook captures it           │
│              ↓                                  │
│   6. After 30s, banner appears                  │
│      - "Install CoursesGuy"                     │
│              ↓                                  │
│   7. User taps Install                          │
│      - Android/Desktop → native prompt          │
│      - iOS → manual instructions modal          │
│              ↓                                  │
│   8. APP INSTALLED on home screen               │
│      - opens fullscreen (standalone)            │
│              ↓                                  │
│   9. OFFLINE MODE works automatically           │
│      - SW serves cached pages                   │
│      - if page missing → offline.html           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 💾 WHERE DATA IS STORED

| Storage | What's Stored | Where | Lifetime |
|---------|--------------|-------|----------|
| **Cache Storage** | HTML, CSS, JS, images | Browser | Until cache version bumps |
| **Service Worker** | Runs in background | Browser | Persistent |
| **localStorage** | Dismiss timestamp (`coursesguy_pwa_dismissed`) | Browser | Until user clears |
| **Manifest** | App metadata (name, icons) | `/public/manifest.json` | Static file |
| **Icons** | PNG files | `/public/icons/` | Static files |

### Cache Names Created:
```
coursesguy-v1-static      ← JS, CSS, icons, fonts
coursesguy-v1-dynamic     ← HTML pages (runtime)
coursesguy-v1-api         ← API responses
```

---

## 🔄 CACHING STRATEGIES

| Content Type | Strategy | Why |
|--------------|----------|-----|
| **Images, fonts, icons** | Cache First | Fast load, rarely change |
| **JS, CSS** | Stale While Revalidate | Instant load + background update |
| **API calls** | Network First | Always fresh data |
| **HTML pages** | Network First + offline.html fallback | Best UX offline |

---

## 📝 STEP-BY-STEP IMPLEMENTATION (10 STEPS)

### **STEP 1: Generate PNG Icons**
- Tool: https://www.pwabuilder.com/imageGenerator
- Input: `app-icon.svg` (192x192 SVG)
- Output: All PNG sizes for Android, iOS, Windows
- Place in: `public/icons/`

### **STEP 2: Create `manifest.json`**
- Location: `public/manifest.json`
- Contains: name, short_name, icons, theme_color, start_url, shortcuts
- Referenced by: `index.html` via `<link rel="manifest">`

### **STEP 3: Update `index.html`**
- Add PWA meta tags:
  - `<link rel="manifest" href="/manifest.json" />`
  - `<link rel="apple-touch-icon" ...>`
  - `<meta name="apple-mobile-web-app-capable" content="yes" />`
  - `<meta name="theme-color" content="#E63946" />`

### **STEP 4: Create `sw.js` (Service Worker)**
- Location: `public/sw.js`
- Listens for: `install`, `activate`, `fetch`, `message`, `push`
- Handles: caching, offline fallback, updates
- Precache list: `/`, `/index.html`, `/offline.html`, icons

### **STEP 5: Create `offline.html`**
- Location: `public/offline.html`
- Shows when: user is offline AND page not cached
- Auto-reloads: when connection returns

### **STEP 6: Register SW in `main.jsx`**
- Production only (`import.meta.env.DEV` check)
- Handles update detection
- Auto-reload on new version

### **STEP 7: Create `usePWAInstall.js` Hook**
- Location: `src/hooks/usePWAInstall.js`
- Detects: iOS / Android / Desktop / Standalone
- Captures: `beforeinstallprompt` event
- Provides: `promptInstall()`, `dismissPrompt()`

### **STEP 8: Create `PWAInstallPrompt.jsx`**
- Location: `src/components/PWAInstallPrompt/`
- Shows: bottom banner after 30s
- Handles: Install click + dismiss (7-day memory)
- iOS: shows "Add to Home Screen" modal

### **STEP 9: Mount in `App.jsx`**
```jsx
<PWAInstallPrompt />
```

### **STEP 10: Build + Deploy**
```bash
npm run build
# Deploy dist/ to VPS
# Nginx must serve sw.js with correct MIME
```

---

## 🚀 DEPLOY COMMAND (VPS — Force Sync from GitHub)

```bash
cd /var/www/CoursVault && \
git reset --hard HEAD && \
git clean -fd && \
git fetch origin && \
git reset --hard origin/main && \
cd frontend && \
npm install && \
npm run build && \
nginx -t && systemctl reload nginx && \
curl -sI https://coursesguy.com/sw.js | grep -i "content-type"
```

**Expected:** `Content-Type: application/javascript`

---

## ⚙️ NGINX CONFIG (Required)

Inside your `server { }` block:

```nginx
# Service Worker — must be no-cache + correct MIME
location = /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Service-Worker-Allowed "/";
    default_type application/javascript;
    try_files $uri =404;
}

# Manifest — no-cache
location = /manifest.json {
    add_header Cache-Control "no-cache";
    default_type application/manifest+json;
    try_files $uri =404;
}

# Offline page — no-cache
location = /offline.html {
    add_header Cache-Control "no-cache";
    try_files $uri =404;
}

# Icons — long cache OK
location /icons/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
}
```

---

## ✅ VERIFICATION CHECKLIST

Open Chrome → https://coursesguy.com → F12 → **Application tab**

| Check | Where | Expected |
|-------|-------|----------|
| Service Worker | Application → SW | `sw.js` activated ✅ |
| Manifest | Application → Manifest | 13 icons, Installable ✅ |
| Cache Storage | Application → Cache | 3 `coursesguy-v1-*` caches |
| Install Banner | Homepage | Appears after 30s |
| Offline Page | Network → Offline + refresh | Shows CG offline page |
| Install Works | Address bar ⊕ | Installs app |

---

## 🐛 COMMON BUGS & FIXES

| Bug | Cause | Fix |
|-----|-------|-----|
| `vite: not found` | `node_modules` missing | `npm install` |
| SW returns `text/html` | Nginx not configured | Add `location = /sw.js` block |
| `git pull` fails | Local VPS changes | `git reset --hard && git clean -fd` |
| Banner not showing | Not 30s yet / dismissed | Wait 30s or clear localStorage |
| Icons missing | PWA Builder files not copied | Copy PNGs to `public/icons/` |
| Not installable | Missing SW or icons | Check DevTools warnings |

---

## 🎨 BRAND SPECIFICATIONS

| Item | Value |
|------|-------|
| Primary Color | `#E63946` (Red) |
| Background | `#080808` (Black) |
| Font Weight (Logo) | 800 |
| Border Radius | 12-24px |
| Logo Text | "CG" |
| Full Name | CoursesGuy |
| Short Name | CoursesGuy |

---

## 📦 KEY FILES SUMMARY

| File | Purpose | Size |
|------|---------|------|
| `sw.js` | Service worker (caching + offline) | ~7.6 KB |
| `offline.html` | Offline fallback page | ~4.8 KB |
| `manifest.json` | PWA metadata | ~2.8 KB |
| `usePWAInstall.js` | Install detection hook | ~3 KB |
| `PWAInstallPrompt.jsx` | Banner + iOS modal | ~5 KB |
| `PWAInstallPrompt.css` | Banner styles | ~4 KB |

---

## 🔑 ENVIRONMENT VARIABLES

**`frontend/.env`**
```env
VITE_BACKEND_URL=https://api.coursesguy.com/api
```

**`dashboord/.env`**
```env
VITE_API_URL=https://api.coursesguy.com/api
```

---

## 🧪 LOCAL TESTING

```bash
cd frontend
npm install
npm run build
npm run preview
# Open http://localhost:4173
# DevTools → Application → Service Workers ✅
```

**Note:** SW **won't** register with `npm run dev` (Vite HMR conflicts). Only works in `build` + `preview`.

---

## 🔄 UPDATE FLOW (When You Deploy New Version)

```
1. Developer edits code locally
2. git push origin main
3. VPS: git pull + npm run build
4. User opens app (online)
5. SW checks for new sw.js every 1 hour
6. New SW found → installs in background
7. Fires 'sw-update-available' event
8. Reloads page → new version active
```

**Manual cache bust:** Change `CACHE_VERSION` in `sw.js` from `'coursesguy-v1'` → `'coursesguy-v2'`.

---

## 📊 PWA SCORES (Lighthouse)

| Category | Score |
|----------|-------|
| Performance | 90+ |
| Accessibility | 90+ |
| Best Practices | 95+ |
| SEO | 100 |
| **PWA** | **100** ✅ |

---

## 🎓 QUICK REFERENCE

### Files to Modify for Brand Change:
- `index.html` — title, meta, theme color
- `manifest.json` — name, short_name, icons
- `sw.js` — CACHE_VERSION + cache names
- `offline.html` — logo + brand text
- `PWAInstallPrompt.jsx` — banner text

### Commands:
```bash
# Build
npm run build

# Preview locally
npm run preview

# Force sync from GitHub (VPS)
git reset --hard origin/main

# Check SW
curl -I https://coursesguy.com/sw.js

# Clear all caches (browser console)
caches.keys().then(k => k.forEach(n => caches.delete(n)))
```

---

## ✅ DONE — What You Now Have

- ✅ Installable PWA (Android, iOS, Desktop)
- ✅ Offline-capable (cached + fallback)
- ✅ Auto-updating service worker
- ✅ Custom install banner
- ✅ iOS install guide
- ✅ 7-day dismiss memory
- ✅ Branded icons
- ✅ SEO optimized
- ✅ Production-ready

---

**Last Updated:** 2026-09-17  
**Version:** 1.0.0  
**Maintainer:** CoursesGuy Team