const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, pickupTime, ownerId } = req.body;
    
    // items should be [{ food: foodId, quantity: num }]
    const order = new Order({
      student: req.user.id,
      items,
      totalAmount,
      pickupTime,
      ownerId // Frontend must send the ownerId based on the items in cart
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user.id })
      .populate('items.food')
      .populate('ownerId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOwnerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ ownerId: req.user.id })
      .populate('student', 'name email')
      .populate('items.food')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { status },
      { new: true }
    );
    
    if (!order) return res.status(404).json({ message: 'Order not found or unauthorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getStudentOrders, getOwnerOrders, updateOrderStatus };
