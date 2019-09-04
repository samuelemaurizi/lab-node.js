const Product = require('../models/product');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');

////////////////////
// GET ADD PRODUCT
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

////////////////////
// POST ADD PRODUCT
exports.postAddProduct = (req, res, next) => {
  console.log('Products.js', req.body);
  const { title, price, description } = req.body;
  const image = req.file;
  console.log(image);
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log('PRODUCT CREATED!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

////////////////////
// GET EDIT PRODUCT
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

////////////////////
// POST EDIT PRODUCT
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log('THIS IS THE BODY: ', req.body);
  const { title, price, description } = req.body;
  const image = req.file;
  console.log('IMAGE:', image);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title,
        price,
        description,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }

      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
        console.log('UPDATED IMG:', product.imageUrl);
      }
      return product
        .updateOne({
          title,
          price,
          image,
          description
        })
        .then(result => {
          console.log('PRODUCT UPDATED!');
          res.redirect('/admin/products');
        });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

////////////////////
// GET PRODUCTS
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      // console.log(products);
      res.render('admin/products-list', {
        prods: products,
        pageTitle: 'Your Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

////////////////////
// POST DELETE PRODUCT
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      // console.log(product.imageUrl);
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('PRODUCT DELETED!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
