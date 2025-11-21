const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const passengerRoutes = require('./routes/passengerRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const trainRoutes = require('./routes/trainRoutes');
const routeRoutes = require('./routes/routeRoutes');
const stationRoutes = require('./routes/stationRoutes');
const smartcardRoutes = require('./routes/smartcardRoutes');
const pilotRoutes = require('./routes/pilotRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/smartcards', smartcardRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/schedules', scheduleRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚂 Train Reservation System API',
    version: '1.0.0',
    endpoints: {
      passengers: '/api/passengers',
      tickets: '/api/tickets',
      trains: '/api/trains',
      routes: '/api/routes',
      stations: '/api/stations',
      smartcards: '/api/smartcards'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
