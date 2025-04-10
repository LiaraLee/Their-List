import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: String,
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
    timestamps: true,
  }
);

export default mongoose.model('Order', OrderSchema);
