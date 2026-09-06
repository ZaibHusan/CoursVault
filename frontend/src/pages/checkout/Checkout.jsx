import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';
import { useOrders } from '../../hooks/useOrders';
import { useCurrency } from '../../hooks/useCurrency';
import { ShieldCheck, MessageCircle, AlertCircle, User, Mail, Phone, FileText } from 'lucide-react';
import OrderSteps from '../../components/OrderSteps/OrderSteps';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrder, isLoading, error, dismissError } = useOrders();
  const { formatPrice, currency } = useCurrency();
  
  const course = location.state?.course || location.state?.courseData || null;

  // Get WhatsApp number from env
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    note: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationError) setValidationError('');
    if (error) dismissError();
  };

  // Validate form for both submit and WhatsApp
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setValidationError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      setValidationError('Please enter your email address');
      return false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    if (formData.phone && formData.phone.length < 10) {
      setValidationError('Please enter a valid phone number');
      return false;
    }
    if (!course?._id) {
      setValidationError('Course information is missing. Please go back and try again.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Create order
    const result = await createOrder(course._id, formData);

    if (result?.success) {
      const order = result.order;
      navigate(`/payment/${order._id}`, {
        state: {
          order,
          course,
          userData: formData
        }
      });
    }
  };

  // WhatsApp order - Requires validation first
  const handleWhatsAppOrder = () => {
    // Validate before allowing WhatsApp order
    if (!validateForm()) return;

    const message = encodeURIComponent(
      `🛒 *NEW ORDER REQUEST*\n\n` +
      `📚 *Course:* ${course?.title || 'N/A'}\n` +
      `💰 *Price:* ${formatPrice(course?.price || 0)}\n` +
      `💵 *Currency:* ${currency}\n\n` +
      `👤 *Customer Details:*\n` +
      `• Name: ${formData.fullName}\n` +
      `• Email: ${formData.email}\n` +
      `• Phone: ${formData.phone || 'Not provided'}\n` +
      `• Note: ${formData.note || 'None'}\n\n` +
      `Hi, I want to order this course via WhatsApp!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  // If no course data, redirect to courses
  if (!course) {
    navigate('/courses');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        {/* Order Steps */}
        <OrderSteps currentStep={1} />

        <div className="checkout-header">
          <h1 className="checkout-main-title">Secure <span>Checkout</span></h1>
          <p className="checkout-subtitle">Enter your details to get started</p>
        </div>

        <div className="checkout-grid">
          
          {/* Left Column: User Form */}
          <div className="checkout-form-wrapper">
            <h3 className="section-heading">Student Information</h3>
            
            {/* Error Messages */}
            {(validationError || error) && (
              <div className="checkout-error-box">
                <AlertCircle size={16} color="#E63946" />
                <span>{validationError || error}</span>
                <button onClick={() => {
                  setValidationError('');
                  dismissError();
                }}>×</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="fullName">
                  <User size={14} />
                  Full Name *
                </label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  placeholder="e.g., Alex Johnson" 
                  value={formData.fullName}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={14} />
                  Email Address (For Course Access) *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="e.g., alex@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
                <span className="form-hint">
                  Important: The Google Drive access link will be sent to this email.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={14} />
                  Contact Number (Optional)
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="e.g., +91 98765 43210" 
                  value={formData.phone}
                  onChange={handleChange}
                />
                <span className="form-hint">
                  For faster support via WhatsApp
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="note">
                  <FileText size={14} />
                  Note (Optional)
                </label>
                <textarea 
                  id="note" 
                  name="note" 
                  placeholder="Any special instructions..."
                  value={formData.note}
                  onChange={handleChange}
                  rows="2"
                />
              </div>

              <button 
                type="submit" 
                className="btn-proceed-payment"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Order...' : 'Proceed to Payment'}
              </button>

              <div className="whatsapp-alternative">
                <div className="divider-wrapper">
                  <span className="divider-line"></span>
                  <span className="divider-text">OR</span>
                  <span className="divider-line"></span>
                </div>
                <button 
                  type="button" 
                  className="btn-whatsapp-order" 
                  onClick={handleWhatsAppOrder}
                >
                  <MessageCircle size={20} />
                  Order via WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h3 className="section-heading">Order Summary</h3>
              
              <div className="summary-course-image">
                <img src={course.thumbnail} alt={course.title} />
              </div>

              <div className="summary-item-desc">
                <span className="summary-course-title">{course.title}</span>
                <span className="summary-access-tag">{course.access || 'Lifetime Access'}</span>
              </div>

              <div className="summary-pricing-breakdown">
                <div className="breakdown-row">
                  <span>Original Price</span>
                  <span className="strikethrough">{formatPrice(course.originalPrice || 0)}</span>
                </div>
                <div className="breakdown-row total-row">
                  <span>Total Amount</span>
                  <span className="final-price">{formatPrice(course.price || 0)}</span>
                </div>
                {course.originalPrice > course.price && (
                  <p className="savings-note">
                    You save {formatPrice(course.originalPrice - course.price)}!
                  </p>
                )}
              </div>

              <div className="summary-trust-badge">
                <ShieldCheck size={16} color="#FFB800" />
                <span>Secure & Encrypted Checkout</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}