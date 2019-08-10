const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('Products.js', req.body);
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  // console.log(req.url);
  Product.fetchAll(products => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop List',
      path: '/',
      hasProds: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};
