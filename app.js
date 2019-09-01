const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

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
app.set('view options', { rmWhitespace: true });

// Get rid of the fiveicon req.url response middleware
app.get('/favicon.ico', (req, res) => res.status(204));

// DB URI
const MONGODB_URI =
  'mongodb+srv://samuele:node-36@node-h36-xglvv.mongodb.net/shop?retryWrites=true&w=majority';

// Store session in db
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// Set CSURF
const csurfProtection = csurf();

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

app.use(csurfProtection);
app.use(flash());

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

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRouters);
app.use(authRoutes);

app.use(errorController.get404);

// Connect to MongoDb Atlas
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    app.listen(3000, console.log('Listening on PORT: 3000'));
  })
  .catch(err => {
    console.log(err);
  });
