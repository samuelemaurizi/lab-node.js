const express = require('express');
const path = require('path');
const rootDir = require('../util/path.js');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  // console.log(req.url);
  // console.log(adminData.products);
  const products = adminData.products;
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop List',
    path: '/',
    hasProds: products.length > 0,
    activeShop: true,
    productCSS: true
  });
});

module.exports = router;
