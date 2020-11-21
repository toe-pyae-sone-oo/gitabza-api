'use strict'

require('dotenv').config()
require('./setup')
require('./auth/auth')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var indexRouter = require('./routes/index');
const songsRouter = require('./routes/songs')
const artistsRouter = require('./routes/artists')
const adminRouter = require('./routes/admin')

var app = express();

const { delay } = require('./common/utils')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(' ')

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)

    if (allowedOrigins.indexOf(origin) == -1) {
      const msg = `'${origin}' is not an allowed origin`
      return cb(new Error(msg), false)
    }
    return cb(null, true)
  }
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware to delay response
// for testing
// app.use(async (req, res, next) => {
//   await delay(1000)
//   next()
// })

app.use('/', indexRouter);
app.use('/songs', songsRouter)
app.use('/artists', artistsRouter)
app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');

  const message = err && err.message 
    ? err.message.toLowerCase() 
    : 'something went wrong'

  res.status(err.status || 500).json({ message })
});

module.exports = app;
