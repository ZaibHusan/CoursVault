import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import Courses from '../pages/courses/Courses';
import Order from '../pages/order/Order';
import OrderDetails from '../pages/OrderDetails/OrderDetails';  // NEW
import AuthLayout from '../layouts/authlayout/Authlayout';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';
import ProtectedRoute from '../utils/ProtectRoutes';
import CourseCreate from '../pages/CourseCreate/CourseCreate';
import CourseEditModal from '../pages/CourseEditModal/CourseEditModal';

export default function Approutes() {
    return (
        <Routes>
            <Route path="/login" element={<AuthLayout />} />

            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                
                {/* Course Management Routes */}
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/create" element={<CourseCreate />} />
                <Route path="/courses/edit/:id" element={<CourseEditModal />} />
                
                {/* Order Management Routes */}
                <Route path="/orders" element={<Order />} />              // Changed from /order to /orders
                <Route path="/orders/:id" element={<OrderDetails />} />   // NEW
            </Route>
        </Routes>
    );
}