import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        
        <div className="not-found-card">
          <div className="not-found-icon-wrapper">
            <AlertTriangle size={48} color="#E63946" />
          </div>

          <div className="not-found-header">
            <span className="error-code-badge">404 Error</span>
            <h1 className="not-found-title">Page Not <span>Found</span></h1>
            <p className="not-found-desc">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>

          <div className="not-found-cta-group">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="btn-go-back"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="btn-home-return"
            >
              <Home size={16} />
              <span>Return to Homepage</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}