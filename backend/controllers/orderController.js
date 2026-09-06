import Order from '../models/order.model.js';
import Course from '../models/course.model.js';
import { convertPrice, isValidCurrency } from '../utils/currencyHelper.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { courseId, userInfo, currency = 'USD' } = req.body;

    if (!isValidCurrency(currency)) {
      return res.status(400).json({ success: false, message: 'Invalid currency' });
    }

    if (!courseId || !userInfo?.fullName || !userInfo?.email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const basePriceUSD = course.priceUSD || 0;
    const amountInCurrency = convertPrice(basePriceUSD, currency);

    const orderId = 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);

    const order = await Order.create({
      orderId,
      courseId: course._id,
      courseTitle: course.title,
      coursePriceUSD: basePriceUSD,
      currency,
      amountPaid: amountInCurrency,
      userInfo: {
        fullName: userInfo.fullName.trim(),
        email: userInfo.email.trim().toLowerCase(),
        phone: userInfo.phone?.trim() || '',
        note: userInfo.note?.trim() || ''
      },
      timeline: [{ status: 'pending', note: `Order created (${currency})` }]
    });

    return res.status(201).json({ success: true, message: 'Order created', order });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

// Upload Payment Proof
export const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: 'No screenshot' });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentProof = { screenshotUrl: req.file.path, uploadedAt: new Date() };
    order.timeline.push({ status: 'pending', note: 'Payment proof uploaded' });
    await order.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Upload proof error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// Get Order by ID (Public)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select('-paymentProof.screenshotUrl');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, currency } = req.query;
    let query = {};

    if (status && status !== 'all') query.status = status;
    if (currency && currency !== 'all') query.currency = currency;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'userInfo.fullName': { $regex: search, $options: 'i' } },
        { 'userInfo.email': { $regex: search, $options: 'i' } },
        { courseTitle: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Get Single Order (Admin)
export const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Get admin order error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.timeline.push({ status, note: note || `Status: ${status}` });
    if (note) order.adminNote = note;
    await order.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update' });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};




// Update Order Currency
export const updateOrderCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { currency } = req.body;

    if (!isValidCurrency(currency)) {
      return res.status(400).json({ success: false, message: 'Invalid currency' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const basePriceUSD = order.coursePriceUSD || 0;
    const amountInCurrency = convertPrice(basePriceUSD, currency);

    order.currency = currency;
    order.amountPaid = amountInCurrency;
    order.timeline.push({ status: order.status, note: `Currency changed to ${currency}` });
    await order.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Update currency error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update currency' });
  }
};