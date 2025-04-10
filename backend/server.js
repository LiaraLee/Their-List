import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import webhookHandler from './routes/webhooks.js';

dotenv.config();

const app = express();

app.post('/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/users', authRoutes);
app.use('/api/orders', orderRoutes);

app.all('*', (req, res) => {
  res.status(404).send({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
