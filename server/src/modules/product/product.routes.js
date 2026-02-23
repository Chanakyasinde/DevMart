const express = require('express');
const router = express.Router();

const { createProduct, getAllProducts, getProduct, getMyProducts, updateProduct, deleteProduct } = require('./product.controller');

const { protect, restrictTo } = require('../../middleware/auth');

router.get('/', getAllProducts);
router.get('/:id', getProduct);

router.use(protect); 

router.get('/seller/my-products', restrictTo('SELLER', 'ADMIN'), getMyProducts);
router.post('/', restrictTo('SELLER'), createProduct);
router.put('/:id', restrictTo('SELLER', 'ADMIN'), updateProduct);
router.delete('/:id', restrictTo('SELLER', 'ADMIN'), deleteProduct);

module.exports = router;
