const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const productRoutes = require('./product');
const recommendationRoutes = require('./recommendation'); // Add this line

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/recommend', recommendationRoutes); // Ensure this path matches your Postman request

module.exports = router;
