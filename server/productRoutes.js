const express = require('express');
const router = express.Router();
const productController = require('../productController');

// Get product details (stub for future Shopify integration)
router.get('/:id', productController.getProductById);

// Get color palette from product image
router.post('/extract-colors', productController.extractColors);

module.exports = router;
