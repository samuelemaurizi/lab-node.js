const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Custom Middleware
const adminRoutes = require('./routes/admin');
const shopRouters = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require('./util/db');

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

app.use('/admin', adminRoutes);
app.use(shopRouters);

app.use(errorController.get404);

app.listen(3000, console.log('Listening on PORT: 3000'));
