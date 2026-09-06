import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hook/useOrders';
import { 
  Search, X, Eye, Trash2, Clock, CheckCircle2, XCircle, Package, DollarSign 
} from 'lucide-react';
import './Order.css';

export default function Order() {
  const navigate = useNavigate();
  const { 
    orders, isLoading, error, stats, fetchOrders, deleteOrder, dismissError 
  } = useOrders();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCurrency, setFilterCurrency] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ? true : order.status === filterStatus;
    const matchesCurrency = filterCurrency === 'all' ? true : order.currency === filterCurrency;
    
    return matchesSearch && matchesFilter && matchesCurrency;
  });

  const handleDelete = (id) => setDeleteConfirm(id);

  const confirmDelete = async () => {
    await deleteOrder(deleteConfirm);
    setDeleteConfirm(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: <Clock size={12} />, label: 'Pending', className: 'status-pending' },
      approved: { icon: <CheckCircle2 size={12} />, label: 'Approved', className: 'status-approved' },
      rejected: { icon: <XCircle size={12} />, label: 'Rejected', className: 'status-rejected' },
      completed: { icon: <Package size={12} />, label: 'Completed', className: 'status-completed' }
    };
    return badges[status] || badges.pending;
  };

  const getCurrencySymbol = (currency) => {
    const symbols = { USD: '$', INR: '₹', PKR: '₨' };
    return symbols[currency] || '$';
  };

  const OrderSkeleton = () => (
    <div className="order-card-skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-body"></div>
      <div className="skeleton-footer"></div>
    </div>
  );

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-page-header">
        <div className="header-left">
          <h1>Order Management</h1>
          <p>Track and manage customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon approved">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">${stats.totalRevenueUSD}</span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="orders-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Name, Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
          onClick={() => setFilterStatus('approved')}
        >
          Approved
        </button>
        <button 
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </button>
      </div>

      {/* Currency Filter */}
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filterCurrency === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCurrency('all')}
        >
          All Currencies
        </button>
        <button 
          className={`filter-btn ${filterCurrency === 'USD' ? 'active' : ''}`}
          onClick={() => setFilterCurrency('USD')}
        >
          $ USD
        </button>
        <button 
          className={`filter-btn ${filterCurrency === 'INR' ? 'active' : ''}`}
          onClick={() => setFilterCurrency('INR')}
        >
          ₹ INR
        </button>
        <button 
          className={`filter-btn ${filterCurrency === 'PKR' ? 'active' : ''}`}
          onClick={() => setFilterCurrency('PKR')}
        >
          ₨ PKR
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={fetchOrders}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="orders-grid">
          {[1, 2, 3, 4, 5, 6].map(i => <OrderSkeleton key={i} />)}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="orders-grid">
          {filteredOrders.map(order => {
            const status = getStatusBadge(order.status);
            const symbol = getCurrencySymbol(order.currency);
            
            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">{order.orderId}</span>
                  <span className={`status-badge ${status.className}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>
                
                <div className="order-card-body">
                  <h3 className="order-course-title">{order.courseTitle}</h3>
                  
                  <div className="order-meta">
                    <span className="order-customer">
                      {order.userInfo?.fullName}
                    </span>
                    <span className="order-price">
                      {symbol}{order.amountPaid}
                    </span>
                  </div>
                  
                  <div className="order-meta-secondary">
                    <span className="order-currency">
                      {order.currency} • Base: ${order.coursePriceUSD}
                    </span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="order-card-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders found</h3>
          <p>{searchTerm || filterStatus !== 'all' ? 'Try adjusting filters' : 'Orders will appear here'}</p>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Order</h3>
            <p>Are you sure you want to delete this order? This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}