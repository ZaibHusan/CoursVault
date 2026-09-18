import React from 'react'
import AppRoutes from './routes/AppRoutes'
import PWAInstallPrompt from './components/PWAInstallPrompt/PWAInstallPrompt'

export default function App() {
  return (
    <>
      <AppRoutes />
      <PWAInstallPrompt />
    </>
  )
}
