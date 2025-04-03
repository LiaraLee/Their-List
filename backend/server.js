const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // Use built-in Express JSON parser instead of body-parser

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Server listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
