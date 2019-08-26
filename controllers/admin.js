const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('Products.js', req.body);
  const { title, price, imageUrl, description } = req.body;
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
      // console.log(result);
      console.log('PRODUCT CREATED!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

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
        product: product
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log('THIS IS THE BODY: ', req.body);
  const { title, price, imageUrl, description } = req.body;
  Product.findById(prodId)
    .then(product => {
      return product.updateOne({
        title,
        price,
        imageUrl,
        description
      });
    })
    .then(result => {
      console.log('PRODUCT UPDATED!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .populate('userId')
    .then(products => {
      // console.log(products);
      res.render('admin/products-list', {
        prods: products,
        pageTitle: 'Your Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findOneAndDelete({ _id: prodId })
    .then(() => {
      console.log('PRODUCT DELETED!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};
