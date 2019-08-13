const db = require('../util/db');
const Cart = require('./cart');

// Class
module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, description, imageUrl) VALUE (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static deleteById() {}

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }
};
