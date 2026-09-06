import { useState, useCallback, useEffect } from 'react';
import api from "../../api/api.js";

const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  PKR: '₨'
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('userCurrency');
    return saved && ['USD', 'INR', 'PKR'].includes(saved) ? saved : 'USD';
  });

  // Listen for currency changes
  useEffect(() => {
    const handleCurrencyChange = (e) => {
      const newCurrency = e.detail?.currency;
      if (newCurrency && ['USD', 'INR', 'PKR'].includes(newCurrency)) {
        setCurrency(newCurrency);
      }
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  const changeCurrency = useCallback((newCurrency) => {
    if (!['USD', 'INR', 'PKR'].includes(newCurrency)) return;
    
    setCurrency(newCurrency);
    localStorage.setItem('userCurrency', newCurrency);
    
    window.dispatchEvent(new CustomEvent('currencyChanged', { 
      detail: { currency: newCurrency } 
    }));
  }, []);

  // Convert amount using backend API
  const convertAmount = useCallback(async (usdAmount) => {
    try {
      const response = await api.get(`/courses/convert?amount=${usdAmount}&currency=${currency}`);
      if (response.data?.success) {
        return response.data.convertedAmount;
      }
      return usdAmount;
    } catch (err) {
      console.error('Conversion error:', err);
      return usdAmount;
    }
  }, [currency]);

  const getSymbol = useCallback(() => {
    return CURRENCY_SYMBOLS[currency] || '$';
  }, [currency]);

  const formatPrice = useCallback((amount) => {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
  }, [currency]);

  return {
    currency,
    changeCurrency,
    convertAmount,
    getSymbol,
    formatPrice
  };
};

export default useCurrency;