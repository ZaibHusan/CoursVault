import React from 'react';
import './OfferBanner.css';
import { Sparkles, MessageCircle } from 'lucide-react';

export default function OfferBanner() {
  
  // Get WhatsApp number from env
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';
  
  const handleBuyBundle = () => {
    const message = encodeURIComponent("Hi, I want to buy the All Courses Bundle! Please share the details.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="offer-banner">
      <div className="offer-banner__content">
        <div className="offer-banner__badge">
          <Sparkles size={12} />
          <span>LIMITED TIME DEAL</span>
        </div>
        <h2 className="offer-banner__title">
          Get <span className="highlight">All Courses</span> in One Bundle
        </h2>
        <p className="offer-banner__subtitle">
          Lifetime access to the complete CoursesGuy library. Massive savings!
        </p>
      </div>
      <div className="offer-banner__action">
        <button 
          className="offer-banner__btn"
          onClick={handleBuyBundle}
        >
          <MessageCircle size={14} />
          Buy Bundle
        </button>
      </div>
    </div>
  );
}