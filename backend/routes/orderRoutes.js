import express from 'express';
import Order from '../models/Order.js';
import protect from '../middleware/auth.js'; // Protect the route so only authenticated users can place orders
import { adminOnly, requirePermission } from '../middleware/roles.js';

const router = express.Router();

// Place an order (User Route)
router.post('/', protect, async (req, res) => {
  const { restaurantId, items, totalAmount } = req.body;

  try {
    // Validate order input (check for missing values)
    if (!restaurantId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Additional validation for items (ensure each item has required properties)
    for (const item of items) {
      if (!item.name || !item.quantity || !item.price) {
        return res.status(400).json({ message: 'Each item must have a name, quantity, and price' });
      }
    }

    // Create new order
    const order = new Order({
      user: req.user.userId, // Get userId from protected middleware (updated to 'user')
      restaurant: restaurantId, // Reference to restaurant ID
      items,
      totalAmount, // Match the new field name from Order schema
      status: 'pending', // Default status set to 'pending'
      paymentStatus: 'unpaid', // Initially set to 'unpaid'
    });

    // Save the order to the database
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
//Protect the /admin/orders route so only
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

// User Route: Get user orders
router.get('/', protect, async (req, res) => {
  try {
    // Fetch orders for the logged-in user
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

