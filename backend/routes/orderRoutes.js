import express from 'express';
import Order from '../models/Order.js';
import protect from '../middleware/auth.js';
import { adminOnly, requirePermission } from '../middleware/roles.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { restaurantId, items, totalAmount } = req.body;

  try {
    if (!restaurantId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    for (const item of items) {
      if (!item.name || !item.quantity || !item.price) {
        return res.status(400).json({ message: 'Each item must have a name, quantity, and price' });
      }
    }

    const order = new Order({
      user: req.user.userId,
      restaurant: restaurantId,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get(
  '/admin/orders',
  protect,
  adminOnly,
  requirePermission('view_all_orders'),
  async (req, res) => {
    try {
      const orders = await Order.find().populate('user').populate('restaurant');
      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  }
);

router.put(
  '/admin/orders/:id',
  protect,
  adminOnly,
  requirePermission('update_order_status'),
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      if (!['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({ message: 'Order status updated', order });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/', protect, async (req, res) => {
  try {

    const orders = await Order.find({ user: req.user.userId }).populate('restaurant'); 

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

export default router;

