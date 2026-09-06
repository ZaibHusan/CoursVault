import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  setCurrentOrder,
  clearCurrentOrder,
  setError,
  clearError
} from "../redux/slices/orderSlice";
import api from "../../api/api.js";

export const useOrders = () => {
  const dispatch = useDispatch();
  const { currentOrder, isLoading, error } = useSelector(
    (state) => state.publicOrder
  );

  const getCurrency = () => localStorage.getItem('userCurrency') || 'USD';

  // Create order
  const createOrder = async (courseId, userInfo) => {
    const currency = getCurrency();
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.post('/orders/create', {
        courseId,
        currency,
        userInfo
      });
      
      if (response.data?.success) {
        dispatch(setCurrentOrder(response.data.order));
        return { success: true, order: response.data.order };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create order';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Update order currency
  const updateOrderCurrency = async (orderId, currency) => {
    try {
      const response = await api.patch(`/orders/currency/${orderId}`, { currency });
      if (response.data?.success) {
        dispatch(setCurrentOrder(response.data.order));
        return { success: true, order: response.data.order };
      }
      throw new Error('Invalid response');
    } catch (err) {
      console.error('Update currency error:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to update currency' };
    }
  };

  // Upload payment proof
  const uploadPaymentProof = async (orderId, file) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const formData = new FormData();
      formData.append('screenshot', file);
      
      const response = await api.post(`/orders/upload-proof/${orderId}`, formData);
      
      if (response.data?.success) {
        dispatch(setCurrentOrder(response.data.order));
        return { success: true, order: response.data.order };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload proof';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Get order by ID
  const getOrder = async (orderId) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.get(`/orders/${orderId}`);
      
      if (response.data?.success) {
        dispatch(setCurrentOrder(response.data.order));
        return { success: true, order: response.data.order };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch order';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  return {
    currentOrder,
    isLoading,
    error,
    createOrder,
    updateOrderCurrency,
    uploadPaymentProof,
    getOrder,
    clearOrder: () => dispatch(clearCurrentOrder()),
    dismissError: () => dispatch(clearError())
  };
};