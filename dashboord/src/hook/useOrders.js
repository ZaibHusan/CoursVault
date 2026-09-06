import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  setOrders,
  addOrder,
  updateOrderInList,
  removeOrder,
  setSingleOrder,
  clearSingleOrder,
  setError,
  clearError
} from "../redux/orderSlice";
import api from "../api/api";

export const useOrders = () => {
  const dispatch = useDispatch();
  const { orders, singleOrder, isLoading, error, stats } = useSelector(
    (state) => state.order
  );

  const extractId = (id) => {
    if (!id) return null;
    if (typeof id === 'string') return id;
    if (typeof id === 'object') return id._id || id.id || null;
    return String(id);
  };

  // Fetch all orders with filters (status, search, currency)
  const fetchOrders = async (filters = {}) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters.currency && filters.currency !== 'all') {
        queryParams.append('currency', filters.currency);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/orders/all?${queryString}` : '/orders/all';
      
      const response = await api.get(endpoint);
      
      if (response.data?.success) {
        dispatch(setOrders(response.data.orders));
        return { success: true, orders: response.data.orders };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch orders';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Fetch single order
  const fetchOrder = async (id) => {
    const orderId = extractId(id);
    if (!orderId) {
      dispatch(setError('Invalid order ID'));
      return { success: false, message: 'Invalid order ID' };
    }
    
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.get(`/orders/admin/${orderId}`);
      
      if (response.data?.success) {
        dispatch(setSingleOrder(response.data.order));
        return { success: true, order: response.data.order };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch order';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Update order status
  const updateOrderStatus = async (id, status, note = '') => {
    const orderId = extractId(id);
    if (!orderId) {
      dispatch(setError('Invalid order ID'));
      return { success: false, message: 'Invalid order ID' };
    }
    
    dispatch(clearError());
    
    try {
      const response = await api.patch(`/orders/status/${orderId}`, { status, note });
      
      if (response.data?.success) {
        dispatch(updateOrderInList(response.data.order));
        dispatch(setSingleOrder(response.data.order));
        return { success: true, order: response.data.order };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    const orderId = extractId(id);
    if (!orderId) {
      dispatch(setError('Invalid order ID'));
      return { success: false, message: 'Invalid order ID' };
    }
    
    dispatch(clearError());
    
    try {
      const response = await api.delete(`/orders/delete/${orderId}`);
      
      if (response.data?.success) {
        dispatch(removeOrder(orderId));
        if (singleOrder?._id === orderId) {
          dispatch(clearSingleOrder());
        }
        return { success: true };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete order';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Search orders
  const searchOrders = async (searchTerm) => {
    return fetchOrders({ search: searchTerm });
  };

  // Filter by status
  const filterOrders = async (status) => {
    return fetchOrders({ status });
  };

  // Filter by currency
  const filterByCurrency = async (currency) => {
    return fetchOrders({ currency });
  };

  return {
    orders,
    singleOrder,
    isLoading,
    error,
    stats,
    fetchOrders,
    fetchOrder,
    updateOrderStatus,
    deleteOrder,
    searchOrders,
    filterOrders,
    filterByCurrency,
    clearOrder: () => dispatch(clearSingleOrder()),
    dismissError: () => dispatch(clearError())
  };
};