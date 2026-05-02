const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, pickupTime } = req.body;
    
    // items should be [{ food: foodId, quantity: num }]
    const order = new Order({
      student: req.user.id,
      items,
      totalAmount,
      pickupTime
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user.id }).populate('items.food').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOwnerOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('student', 'name email').populate('items.food').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getStudentOrders, getOwnerOrders, updateOrderStatus };
