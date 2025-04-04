// models/Order.js
// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant', // Reference to the Restaurant model (assumed Restaurant model exists)
      required: true,
    },
    items: [
      {
        name: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export default mongoose.model('Order', OrderSchema);
