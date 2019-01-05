var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');
var articleRouter = require('./routes/articleRouter');
var userRouter = require('./routes/userRouter');
var musicRouter = require('./routes/musicRouter');

var musicUploadRouter = require('./routes/musicUploadRouter');
var imageUploadRouter = require('./routes/imageUploadRouter');

var commentRouter = require('./routes/commentRouter');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


var Articles = require('./models/articles');

var url = config.mongoUrl;

var connect = mongoose.connect(url, {
  useMongoClient: true
});
connect.then((db) => {
  console.log("Connected to Mongo DB server");
}, (err) => {
  console.log(err);
});

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({limit: '100000000000'}));
app.use(bodyParser.urlencoded({limit: '100000000000', extended: true}));

app.use(passport.initialize());


app.use('/', index);
app.use('/users', users);


app.use(express.static(path.join(__dirname, 'public')));


app.use('/articles', articleRouter);
app.use('/users', userRouter);

app.use('/musicUploadRouter', musicUploadRouter);
app.use('/imageUploadRouter', imageUploadRouter);

app.use('/comments',commentRouter);
app.use('/musics',musicRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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