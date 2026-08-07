const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const seedDatabase = require('./config/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'StayNepal REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/homestays', require('./routes/homestays.routes'));
app.use('/api/bookings', require('./routes/bookings.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/payments', require('./routes/payments.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route '${req.originalUrl}' not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

// Start Server & Seed Database automatically
if (process.env.NODE_ENV !== 'test') {
  seedDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🚀 StayNepal REST API Server running on port http://localhost:${PORT}`);
        console.log(`=======================================================`);
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
    });
}

module.exports = app;
