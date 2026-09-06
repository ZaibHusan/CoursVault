import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './Payment.css';
import { useOrders } from '../../hooks/useOrders';
import { useCurrency } from '../../hooks/useCurrency';
import { Upload, Clock, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import OrderSteps from '../../components/OrderSteps/OrderSteps';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadPaymentProof, updateOrderCurrency, isLoading, error, dismissError } = useOrders();
  const { currency, changeCurrency, convertAmount, formatPrice } = useCurrency();
  
  const order = location.state?.order || null;
  const course = location.state?.course || null;
  const userData = location.state?.userData || {};

  const [paymentProof, setPaymentProof] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [displayAmount, setDisplayAmount] = useState(order?.amountPaid || 0);

  // Real Payment Details
  const paymentDetails = {
    USD: { binanceId: '764197564' },
    INR: {
      upi: { id: 'devsain022-2@okicici', holderName: 'Dev Kumar Sain' },
      bank: { bankName: 'IndusInd Bank Ltd', accountHolder: 'Dev Kumar Sain', accountNumber: '157290079990', ifscCode: 'INDB0001978' }
    },
    PKR: {
      jazzcash: { number: '0320 9664846', holderName: 'Mir Maday Jan' },
      easypaisa: { number: '0334 5076175', holderName: 'Sherina' }
    }
  };

  const basePriceUSD = order?.coursePriceUSD || course?.priceUSD || 0;

  // Fetch converted amount when currency changes
  useEffect(() => {
    const fetchAmount = async () => {
      if (basePriceUSD > 0) {
        const converted = await convertAmount(basePriceUSD);
        setDisplayAmount(converted);
      }
    };
    fetchAmount();
  }, [currency, basePriceUSD, convertAmount]);

  // Handle currency change - Update global + backend order
  const handleCurrencyChange = async (newCurrency) => {
    changeCurrency(newCurrency);
    
    if (orderId) {
      await updateOrderCurrency(orderId, newCurrency);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationError('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setValidationError('Image size should be less than 5MB');
        return;
      }
      setPaymentProof(file);
      setValidationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProof) {
      setValidationError('Please upload your payment screenshot');
      return;
    }
    if (!orderId) {
      setValidationError('Order ID is missing');
      return;
    }

    const result = await uploadPaymentProof(orderId, paymentProof);
    if (result?.success) {
      navigate('/order-success', {
        state: { orderId, order: result.order, course, userData, currency }
      });
    }
  };

  if (!order && !course) {
    navigate('/courses');
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <OrderSteps currentStep={2} />
        
        <div className="payment-header">
          <div className="order-id-badge">Order ID: {order?.orderId || orderId}</div>
          <h1 className="payment-main-title">Complete <span>Payment</span></h1>
          <p className="payment-subtitle">Choose your payment method and upload proof</p>
        </div>

        {(validationError || error) && (
          <div className="payment-error-box">
            <AlertCircle size={16} color="#E63946" />
            <span>{validationError || error}</span>
            <button onClick={() => { setValidationError(''); dismissError(); }}>×</button>
          </div>
        )}

        {/* Currency Tabs */}
        <div className="region-tabs">
          <button type="button" className={`region-tab ${currency === 'USD' ? 'active' : ''}`} onClick={() => handleCurrencyChange('USD')}>
            🌐 USD ($)
          </button>
          <button type="button" className={`region-tab ${currency === 'INR' ? 'active' : ''}`} onClick={() => handleCurrencyChange('INR')}>
            🇮🇳 INR (₹)
          </button>
          <button type="button" className={`region-tab ${currency === 'PKR' ? 'active' : ''}`} onClick={() => handleCurrencyChange('PKR')}>
            🇵🇰 PKR (₨)
          </button>
        </div>

        <div className="payment-grid">
          <div className="payment-instructions-card">
            <h3 className="section-heading">Payment Details</h3>
            
            <div className="amount-display-box">
              <span>Amount to Pay:</span>
              <strong className="amount-highlight">
                {formatPrice(displayAmount)}
              </strong>
            </div>

            {/* USD */}
            {currency === 'USD' && (
              <div className="regional-content">
                <div className="transfer-method-block">
                  <span className="method-label">Binance Pay ID</span>
                  <div className="upi-id-box">
                    <span className="upi-text">{paymentDetails.USD.binanceId}</span>
                    <button type="button" onClick={() => handleCopy(paymentDetails.USD.binanceId)} className="copy-btn">
                      {copiedText === paymentDetails.USD.binanceId ? <Check size={14} color="#22C55E" /> : <Copy size={14} />}
                      {copiedText === paymentDetails.USD.binanceId ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <span className="holder-name">Send any currency to this Binance ID</span>
                </div>
              </div>
            )}

            {/* INR */}
            {currency === 'INR' && (
              <div className="regional-content">
                <div className="transfer-method-block">
                  <span className="method-label">UPI ID</span>
                  <div className="upi-id-box">
                    <span className="upi-text">{paymentDetails.INR.upi.id}</span>
                    <button type="button" onClick={() => handleCopy(paymentDetails.INR.upi.id)} className="copy-btn">
                      {copiedText === paymentDetails.INR.upi.id ? <Check size={14} color="#22C55E" /> : <Copy size={14} />}
                      {copiedText === paymentDetails.INR.upi.id ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <span className="holder-name">Holder: {paymentDetails.INR.upi.holderName}</span>
                </div>

                <div className="transfer-method-block" style={{ marginTop: '16px' }}>
                  <span className="method-label">Bank Transfer</span>
                  <div className="bank-details-grid">
                    <div className="bank-row"><span>Bank Name:</span><strong>{paymentDetails.INR.bank.bankName}</strong></div>
                    <div className="bank-row"><span>Account Holder:</span><strong>{paymentDetails.INR.bank.accountHolder}</strong></div>
                    <div className="bank-row"><span>Account Number:</span><strong>{paymentDetails.INR.bank.accountNumber}</strong></div>
                    <div className="bank-row"><span>IFSC Code:</span><strong>{paymentDetails.INR.bank.ifscCode}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* PKR */}
            {currency === 'PKR' && (
              <div className="regional-content">
                <div className="transfer-method-block">
                  <span className="method-label">JazzCash</span>
                  <div className="upi-id-box">
                    <span className="upi-text">{paymentDetails.PKR.jazzcash.number}</span>
                    <button type="button" onClick={() => handleCopy(paymentDetails.PKR.jazzcash.number)} className="copy-btn">
                      {copiedText === paymentDetails.PKR.jazzcash.number ? <Check size={14} color="#22C55E" /> : <Copy size={14} />}
                      {copiedText === paymentDetails.PKR.jazzcash.number ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <span className="holder-name">Holder: {paymentDetails.PKR.jazzcash.holderName}</span>
                </div>

                <div className="transfer-method-block" style={{ marginTop: '16px' }}>
                  <span className="method-label">EasyPaisa</span>
                  <div className="upi-id-box">
                    <span className="upi-text">{paymentDetails.PKR.easypaisa.number}</span>
                    <button type="button" onClick={() => handleCopy(paymentDetails.PKR.easypaisa.number)} className="copy-btn">
                      {copiedText === paymentDetails.PKR.easypaisa.number ? <Check size={14} color="#22C55E" /> : <Copy size={14} />}
                      {copiedText === paymentDetails.PKR.easypaisa.number ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <span className="holder-name">Holder: {paymentDetails.PKR.easypaisa.holderName}</span>
                </div>
              </div>
            )}
          </div>

          <div className="payment-action-wrapper">
            <div className="upload-proof-card">
              <h3 className="section-heading">Upload Payment Proof</h3>
              <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="paymentProof">Payment Screenshot *</label>
                  <div className="file-upload-box">
                    <input type="file" id="paymentProof" accept="image/*" onChange={handleFileChange} required />
                    <div className="file-upload-label">
                      <Upload size={22} color="#E63946" />
                      <span>{paymentProof ? paymentProof.name : "Click to upload screenshot"}</span>
                    </div>
                  </div>
                </div>
                <div className="status-notice-box">
                  <Clock size={18} color="#FFB800" />
                  <div>
                    <strong>Manual Verification:</strong>
                    <p>Our team will verify your payment within 1 hour. Course access will be sent to your email.</p>
                  </div>
                </div>
                <button type="submit" className="btn-submit-proof" disabled={isLoading}>
                  {isLoading ? 'Uploading...' : 'Submit Payment Proof'}
                </button>
              </form>
            </div>
            <div className="secure-trust-badge">
              <ShieldCheck size={16} color="#FFB800" />
              <span>Secure Payment System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}