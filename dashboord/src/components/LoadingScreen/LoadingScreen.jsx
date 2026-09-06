import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-wrapper">
      <div className="loading-core">
        {/* Outer rotating ring */}
        <div className="orbit-ring"></div>
        {/* Inner glowing ring */}
        <div className="orbit-ring-inner"></div>
        {/* Pulsing center icon */}
        <ShieldCheck size={32} color="#E63946" className="center-icon" />
      </div>
      <div className="loading-text-container">
        <h2 className="loading-title">CoursVault</h2>
      </div>
    </div>
  );
}