var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const products = require('./routes/products');
const categories = require('./routes/categories');
const cartitems = require('./routes/cartitems');
const users = require('./routes/users');
const checkouts = require('./routes/checkouts');
const receipts = require('./routes/receipts');



mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://####:TdHPLjG3Y7a2gUGq@cluster0.vi5ia4s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('connection successfully!'))
  .catch((err) => console.log(err))



// const mongoUri = process.env.MONGODB_URI;

// mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('Connected to MongoDB Atlas'))
//   .catch(err => console.error('Failed to connect to MongoDB', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { log } = require('console');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', products);
app.use('/categories', categories);
app.use('/cartitems', cartitems);
app.use('/users', users);
app.use('/checkouts', checkouts);
app.use('/receipts', receipts);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
