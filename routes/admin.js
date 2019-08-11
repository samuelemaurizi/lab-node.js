const express = require('express');
const path = require('path');

// Custom middleware
const adminController = require('../controllers/admin');

const router = express.Router();

// GET
router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getProducts);

// POST
router.post('/add-product', adminController.postAddProduct);

// Edit
router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product');

module.exports = router;
