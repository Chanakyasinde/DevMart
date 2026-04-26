const express = require('express');
const cors = require('cors');
const AppError = require('./utils/AppError');

const userRoutes = require('./modules/user/user.routes');
const productRoutes = require('./modules/product/product.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'DevMart Backend is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('DevMart Backend Service');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
