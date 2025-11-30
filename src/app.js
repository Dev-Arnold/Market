const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const posts = require('./routes/posts');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: [process.env.NODE_ENV === 'production' ? 'your-frontend-domain.com' : 'http://localhost:4500'],
  credentials: true
}));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/posts', posts);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;