import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../hook/useCourses';
import { useOrders } from '../../hook/useOrders';
import { 
  BookOpen, Package, Clock, CheckCircle2, ArrowRight, Plus, DollarSign, Globe 
} from 'lucide-react';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { courses, fetchCourses } = useCourses();
  const { orders, stats, fetchOrders } = useOrders();

  useEffect(() => {
    fetchCourses();
    fetchOrders();
  }, []);

  const recentOrders = orders.slice(0, 5);
  const recentCourses = courses.slice(0, 3);

  const getCurrencySymbol = (currency) => {
    const symbols = { USD: '$', INR: '₹', PKR: '₨' };
    return symbols[currency] || '$';
  };

  const getRegionFlag = (region) => {
    const flags = { india: '🇮🇳', pakistan: '🇵🇰', international: '🌐' };
    return flags[region] || '🌐';
  };

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening</p>
        </div>
        <button 
          className="btn-create"
          onClick={() => navigate('/courses/create')}
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon courses">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Total Courses</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Revenue & Region Stats */}
      <div className="revenue-stats">
        <div className="revenue-card">
          <DollarSign size={20} />
          <div>
            <span className="revenue-value">${stats.totalRevenueUSD || 0}</span>
            <span className="revenue-label">Total Revenue (USD)</span>
          </div>
        </div>
        <div className="region-mini-stats">
          <span className="mini-region-badge">🇮🇳 {stats.india} India</span>
          <span className="mini-region-badge">🇵🇰 {stats.pakistan} Pakistan</span>
          <span className="mini-region-badge">🌐 {stats.international} Intl</span>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button onClick={() => navigate('/orders')}>
            View All
            <ArrowRight size={14} />
          </button>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="orders-list">
            {recentOrders.map(order => (
              <div 
                key={order._id} 
                className="order-item"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="order-info">
                  <span className="order-id">{order.orderId}</span>
                  <span className="order-course">{order.courseTitle}</span>
                </div>
                <div className="order-meta">
                  <span className="order-customer">
                    {getRegionFlag(order.userInfo?.region)} {order.userInfo?.fullName}
                  </span>
                  <span className="order-amount">
                    {getCurrencySymbol(order.currency)}{order.amountPaid || order.coursePrice}
                  </span>
                  <span className={`order-status status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-text">No orders yet</p>
        )}
      </div>

      {/* Recent Courses */}
      <div className="section">
        <div className="section-header">
          <h2>Recent Courses</h2>
          <button onClick={() => navigate('/courses')}>
            View All
            <ArrowRight size={14} />
          </button>
        </div>
        
        {recentCourses.length > 0 ? (
          <div className="courses-list">
            {recentCourses.map(course => (
              <div 
                key={course._id} 
                className="course-item"
                onClick={() => navigate(`/courses/edit/${course._id}`)}
              >
                <img src={course.thumbnail} alt={course.title} />
                <div className="course-info">
                  <span className="course-title">{course.title}</span>
                  <span className="course-price">${course.priceUSD || course.price || 0}</span>
                </div>
                <span className={`course-status ${course.isPublished ? 'published' : 'draft'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-text">No courses yet</p>
        )}
      </div>
    </div>
  );
}