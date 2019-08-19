const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Custom Middleware
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
  User.findById('5d5a83daad87162f78566e8d')
    .then(user => {
      // console.log(user);
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRouters);

app.use(errorController.get404);

// Connect to MongoDb Atlas
mongoose
  .connect(
    'mongodb+srv://samuele:node-36@node-h36-xglvv.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
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
