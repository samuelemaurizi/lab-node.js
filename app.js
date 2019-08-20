const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Custom Middleware
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRouters = require('./routes/shop');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

// Setting Templating Engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Get rid of the fiveicon req.url response middleware
app.get('/favicon.ico', (req, res) => res.status(204));

// DB URI
const MONGODB_URI =
  'mongodb+srv://samuele:node-36@node-h36-xglvv.mongodb.net/shop?retryWrites=true&w=majority';

// Store session on db
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

///// both urlencoded are good :) should give attention to extended property
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRouters);
app.use(authRoutes);

app.use(errorController.get404);

// Connect to MongoDb Atlas
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Johnny',
          email: 'johnny@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000, console.log('Listening on PORT: 3000'));
  })
  .catch(err => {
    console.log(err);
  });
