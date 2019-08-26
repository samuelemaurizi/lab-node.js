const express = require('express');
const path = require('path');

// Custom middleware
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');

const router = express.Router();

// GET
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);

// POST
router.post('/add-product', isAuth, adminController.postAddProduct);

// Edit
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

// Delete
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
