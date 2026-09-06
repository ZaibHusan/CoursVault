import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoursePricingCard.css';
import { ShieldCheck, Zap, Lock, ArrowRight, CheckCircle2, Sparkles, Gift, Clock, BadgePercent } from 'lucide-react';

export default function CoursePricingCard({ course }) {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const price = course?.price || 0;
  const originalPrice = course?.originalPrice || 0;
  const formattedPrice = course?.formattedPrice || `$${price}`;
  const formattedOriginalPrice = course?.formattedOriginalPrice || '';
  const currencySymbol = course?.currencySymbol || '$';
  
  const discountPercentage = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  
  const discountText = discountPercentage > 0 ? `${discountPercentage}% OFF` : null;

  const handleBuyNow = () => {
    const courseId = course?._id || course?.id || course?.slug || '1';
    navigate(`/checkout/${courseId}`, { state: { course } });
  };

  return (
    <div 
      className={`pricing-card ${isHovering ? 'pricing-card--hovering' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="pricing-card__ribbon">
        <BadgePercent size={14} />
        <span>LIMITED TIME OFFER</span>
      </div>

      {discountText && (
        <div className="pricing-card__discount-badge">
          <span className="pricing-card__discount-text">{discountText}</span>
        </div>
      )}

      <div className="pricing-card__price-section">
        {originalPrice > price && (
          <div className="pricing-card__original-price">
            <span className="pricing-card__original-label">Original Price</span>
            <span className="pricing-card__original-value">{formattedOriginalPrice}</span>
          </div>
        )}
        
        <div className="pricing-card__current-price">
          <span className="pricing-card__currency">{currencySymbol}</span>
          <span className="pricing-card__amount">
            {formattedPrice.replace(currencySymbol, '')}
          </span>
        </div>

        {discountPercentage > 0 && (
          <div className="pricing-card__savings">
            <Sparkles size={12} />
            <span>You save {discountPercentage}%</span>
          </div>
        )}

        <span className="pricing-card__gst">Inclusive of all taxes</span>
      </div>

      <div className="pricing-card__features">
        <div className="pricing-card__feature">
          <ShieldCheck size={14} />
          <span>{course?.access || 'Lifetime Access'}</span>
        </div>
        <div className="pricing-card__feature">
          <Zap size={14} />
          <span>Instant Access via Portal</span>
        </div>
        <div className="pricing-card__feature">
          <Lock size={14} />
          <span>Secure Encrypted Payment</span>
        </div>
        <div className="pricing-card__feature">
          <Gift size={14} />
          <span>Bonus Resources Included</span>
        </div>
      </div>

      <button 
        className="pricing-card__cta"
        onClick={handleBuyNow}
      >
        <span>Buy Now - {formattedPrice}</span>
        <ArrowRight size={16} />
      </button>

      <div className="pricing-card-footer-meta">
        <div className="pricing-card__trust">
          <CheckCircle2 size={12} />
          <span>100% Secure Checkout</span>
        </div>
        <div className="pricing-card__urgency">
          <Clock size={12} />
          <span>Offer ends soon</span>
        </div>
      </div>
    </div>
  );
}