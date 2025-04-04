import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // Import the order-related routes
import webhookHandler from './routes/webhooks.js';


// Load environment variables
dotenv.config();

const app = express();
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => webhookHandler(req, res));

// Middleware
app.use(cors());
app.use(express.json()); // Built-in Express JSON parser

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/users', authRoutes);
app.use('/api/orders', orderRoutes); // Order-related routes (placing orders, viewing orders, etc.)

// Error handling for invalid routes (uses `req`)
app.all('*', (req, res) => {
  res.status(404).send({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// General error handler (optional but good to have)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
