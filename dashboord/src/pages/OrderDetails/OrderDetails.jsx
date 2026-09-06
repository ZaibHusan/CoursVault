import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../hook/useOrders';
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, Package, User, Mail, Phone, 
  MessageSquare, DollarSign, ExternalLink 
} from 'lucide-react';
import './OrderDetails.css';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    singleOrder, isLoading, error, fetchOrder, updateOrderStatus, dismissError 
  } = useOrders();

  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id]);

  const handleStatusUpdate = async (status) => {
    setUpdating(true);
    setSuccessMessage('');
    const result = await updateOrderStatus(id, status, adminNote);
    if (result?.success) {
      setSuccessMessage(`Order ${status} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setUpdating(false);
  };

  if (isLoading || !singleOrder) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="details-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-body"></div>
            <div className="skeleton-body"></div>
            <div className="skeleton-footer"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: <Clock size={20} />, label: 'Pending', className: 'status-pending' },
    approved: { icon: <CheckCircle2 size={20} />, label: 'Approved', className: 'status-approved' },
    rejected: { icon: <XCircle size={20} />, label: 'Rejected', className: 'status-rejected' },
    completed: { icon: <Package size={20} />, label: 'Completed', className: 'status-completed' }
  };

  const status = statusConfig[singleOrder.status] || statusConfig.pending;
  const currencySymbols = { USD: '$', INR: '₹', PKR: '₨' };
  const currencySymbol = currencySymbols[singleOrder.currency] || '$';

  return (
    <div className="order-details-page">
      <div className="container">
        {/* Header */}
        <div className="details-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/orders')}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1>Order Details</h1>
              <p>{singleOrder.orderId}</p>
            </div>
          </div>
          <span className={`status-badge ${status.className}`}>
            {status.icon}
            {status.label}
          </span>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={dismissError}>×</button>
          </div>
        )}
        {successMessage && (
          <div className="success-banner">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="details-grid">
          {/* Left Column */}
          <div className="details-main">
            {/* Customer Info */}
            <div className="info-section">
              <h3>Customer Information</h3>
              <div className="info-item">
                <User size={16} />
                <span>{singleOrder.userInfo?.fullName}</span>
              </div>
              <div className="info-item">
                <Mail size={16} />
                <span>{singleOrder.userInfo?.email}</span>
              </div>
              {singleOrder.userInfo?.phone && (
                <div className="info-item">
                  <Phone size={16} />
                  <span>{singleOrder.userInfo?.phone}</span>
                </div>
              )}
              {singleOrder.userInfo?.note && (
                <div className="info-item note">
                  <MessageSquare size={16} />
                  <span>{singleOrder.userInfo?.note}</span>
                </div>
              )}
            </div>

            {/* Payment Info */}
            <div className="info-section">
              <h3>Payment Information</h3>
              <div className="payment-breakdown">
                <div className="payment-row">
                  <span>Base Price (USD):</span>
                  <strong>${singleOrder.coursePriceUSD || 0}</strong>
                </div>
                <div className="payment-row">
                  <span>Currency:</span>
                  <strong>{singleOrder.currency}</strong>
                </div>
                <div className="payment-row">
                  <span>Amount Paid:</span>
                  <strong className="amount-highlight">
                    {currencySymbol}{singleOrder.amountPaid}
                  </strong>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="info-section">
              <h3>Course Information</h3>
              <div className="course-info">
                <h4>{singleOrder.courseTitle}</h4>
              </div>
            </div>

            {/* Payment Proof */}
            <div className="info-section">
              <h3>Payment Proof</h3>
              {singleOrder.paymentProof?.screenshotUrl ? (
                <div className="payment-proof">
                  <img 
                    src={singleOrder.paymentProof.screenshotUrl} 
                    alt="Payment Proof"
                    onClick={() => window.open(singleOrder.paymentProof.screenshotUrl, '_blank')}
                  />
                  <button 
                    className="view-full-btn"
                    onClick={() => window.open(singleOrder.paymentProof.screenshotUrl, '_blank')}
                  >
                    <ExternalLink size={14} />
                    View Full Image
                  </button>
                </div>
              ) : (
                <p className="no-proof">No payment proof uploaded yet</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="details-sidebar">
            <div className="action-section">
              <h3>Update Status</h3>
              <div className="form-group">
                <label>Admin Note (Optional)</label>
                <textarea 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows="3"
                  placeholder="Add a note..."
                />
              </div>

              <div className="action-buttons">
                {singleOrder.status === 'pending' && (
                  <>
                    <button className="btn-approve" onClick={() => handleStatusUpdate('approved')} disabled={updating}>
                      <CheckCircle2 size={16} />
                      Approve Payment
                    </button>
                    <button className="btn-reject" onClick={() => handleStatusUpdate('rejected')} disabled={updating}>
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                )}
                
                {singleOrder.status === 'approved' && (
                  <button className="btn-complete" onClick={() => handleStatusUpdate('completed')} disabled={updating}>
                    <Package size={16} />
                    Mark as Completed
                  </button>
                )}
                
                {(singleOrder.status === 'rejected' || singleOrder.status === 'completed') && (
                  <button className="btn-approve" onClick={() => handleStatusUpdate('approved')} disabled={updating}>
                    <CheckCircle2 size={16} />
                    Move to Approved
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-section">
              <h3>Order Timeline</h3>
              <div className="timeline">
                {singleOrder.timeline?.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-status">{event.status}</span>
                      <span className="timeline-date">
                        {new Date(event.at).toLocaleString('en-IN')}
                      </span>
                      {event.note && <p>{event.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}