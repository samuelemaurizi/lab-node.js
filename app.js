const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Custom Middleware
const mongoConnect = require('./util/db').mongoConnect;
const adminRoutes = require('./routes/admin');
const shopRouters = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

// Setting different Templating Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Get rid of the fiveicon req.url response middleware
app.get('/favicon.ico', (req, res) => res.status(204));

// // both urlencoded are good :) should give attention to extended property
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5d569dcebe9efc2474cd0ae8')
    .then(user => {
      console.log(user);
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRouters);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000, console.log('Listening on PORT: 3000'));
});
