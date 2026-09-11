import express from 'express';
import {
  createOrder,
  uploadPaymentProof,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  deleteOrder,
  updateOrderCurrency,
} from '../controllers/orderController.js';
import upload from '../middlarwears/uploadMiddleware.js';
import uploadPaymentProofMiddleware from '../middlarwears/uploadPaymentProof.js';

const OrderRoute = express.Router();

// ============ PUBLIC ROUTES (No Auth) ============

// Create new order
OrderRoute.post('/create', createOrder);

// Upload payment proof
OrderRoute.post(
  '/upload-proof/:id',
  uploadPaymentProofMiddleware.single('screenshot'),
  uploadPaymentProof
);

// ============ ADMIN ROUTES (Must be BEFORE /:id) ============

// Get all orders (with filters) - MUST be before /:id
OrderRoute.get('/all', getAllOrders);


OrderRoute.patch('/currency/:id', updateOrderCurrency);

// Get single order (admin - full details) - MUST be before /:id
OrderRoute.get('/admin/:id', getAdminOrderById);

// Update order status
OrderRoute.patch('/status/:id', updateOrderStatus);

// Delete order
OrderRoute.delete('/delete/:id', deleteOrder);

// ============ PUBLIC ROUTE (Must be LAST) ============

// Get order by ID (user - check status)
OrderRoute.get('/:id', getOrderById);

export default OrderRoute;