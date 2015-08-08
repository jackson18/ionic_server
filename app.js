var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var conf = require('./util/conf');

var options = {
  server: {
    auto_reconnect: true,
    poolSize: conf.poolSize
  }
};

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(conf.dburl, options, function(err, res) {
  if(err) {
    console.log('[mongoose log] Error connecting to: ' + conf.dburl + '. ' + err);
  } else {
    console.log('[mongoose log] Successfully connected to: ' + conf.dburl);
  }
});

app.use('/', routes);
app.use('/users', users);


module.exports = app;
