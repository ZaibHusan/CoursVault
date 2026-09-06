// Currency conversion rates (Base: USD)
const CURRENCY_RATES = {
  USD: 1,
  INR: 83,
  PKR: 280
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  INR: '₹',
  PKR: '₨'
};

// Convert USD to target currency
export const convertPrice = (usdPrice, currency = 'USD') => {
  if (!usdPrice || isNaN(usdPrice)) return 0;
  const rate = CURRENCY_RATES[currency] || 1;
  return Math.round(usdPrice * rate);
};

// Format price with currency symbol
export const formatPrice = (usdPrice, currency = 'USD') => {
  const converted = convertPrice(usdPrice, currency);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${converted.toLocaleString('en-IN')}`;
};

// Get currency symbol
export const getCurrencySymbol = (currency) => {
  return CURRENCY_SYMBOLS[currency] || '$';
};

// Check if currency is valid
export const isValidCurrency = (currency) => {
  return Object.keys(CURRENCY_RATES).includes(currency);
};