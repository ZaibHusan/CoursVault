import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderSuccess.css';
import { useCurrency } from '../../hooks/useCurrency';
import { 
  CheckCircle2, Clock, MessageSquare, Home, ShieldCheck, Mail, Phone, Copy, Check 
} from 'lucide-react';
import OrderSteps from '../../components/OrderSteps/OrderSteps';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const { formatPrice } = useCurrency();

  const order = location.state?.order || null;
  const course = location.state?.course || null;
  const userData = location.state?.userData || {};
  const orderId = location.state?.orderId || order?.orderId || 'ORD-UNKNOWN';

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSupport = () => {
    const text = encodeURIComponent(
      `Hi, I need help with my order ${orderId} for course: ${course?.title || 'Course'}`
    );
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
  };

  return (
    <div className="success-page">
      <div className="success-container">
        
        {/* Order Steps */}
        <OrderSteps currentStep={3} />

        <div className="success-card">
          
          {/* Success Icon */}
          <div className="success-icon-wrapper">
            <CheckCircle2 size={56} color="#22C55E" />
          </div>

          <div className="success-header">
            <div className="order-id-row">
              <span className="order-id-badge">Order ID: {orderId}</span>
              <button 
                className="copy-order-btn"
                onClick={handleCopyOrderId}
                title="Copy Order ID"
              >
                {copied ? <Check size={14} color="#22C55E" /> : <Copy size={14} />}
              </button>
            </div>
            
            <h1 className="success-title">
              Payment Proof <span>Received!</span>
            </h1>
            
            <p className="success-timing-highlight">
              <Clock size={16} color="#22C55E" />
              <span>
                Average time for course access: <strong>1 Hour</strong>
              </span>
            </p>
          </div>

          {/* Next Steps */}
          <div className="next-steps-box">
            <h3>What happens next?</h3>
            <div className="steps-list">
              <div className="step-item">
                <span className="step-number">1</span>
                <p>Our team verifies your payment screenshot</p>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <p>You receive Google Drive access link</p>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <p>Start learning immediately!</p>
              </div>
            </div>
            
            {/* Delivery Info */}
            <div className="delivery-info">
              <div className="delivery-item">
                <Mail size={14} />
                <span>Access will be sent to: <strong>{userData.email || 'your email'}</strong></span>
              </div>
              {userData.phone && (
                <div className="delivery-item">
                  <Phone size={14} />
                  <span>WhatsApp updates to: <strong>{userData.phone}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Course Preview */}
          {course && (
            <div className="ordered-course-preview">
              <img src={course.thumbnail} alt={course.title} />
              <div className="preview-info">
                <span>Enrolled Course:</span>
                <strong>{course.title}</strong>
                <span className="course-access">{course.access || 'Lifetime Access'}</span>
                <span className="course-amount">
                  Paid: {formatPrice(course.price || order?.amountPaid || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="success-cta-group">
            <button 
              className="btn-whatsapp-support"
              onClick={handleWhatsAppSupport}
            >
              <MessageSquare size={16} />
              <span>Contact Support</span>
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="btn-home-return"
            >
              <Home size={16} />
              <span>Return to Home</span>
            </button>
          </div>

          {/* Trust Badge */}
          <div className="success-footer-trust">
            <ShieldCheck size={14} color="#FFB800" />
            <span>Thank you for choosing CoursesGuy. Your future starts here.</span>
          </div>

        </div>

      </div>
    </div>
  );
}