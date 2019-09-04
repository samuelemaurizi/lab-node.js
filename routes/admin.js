const express = require('express');
const path = require('path');
const { body } = require('express-validator');

// Custom middleware
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin');

const router = express.Router();

////////////////////
// GET
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);

////////////////////
// POST
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isCurrency(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct
);

////////////////////
// GET EDIT
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isCurrency(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
);

////////////////////
// POST DELETE
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
