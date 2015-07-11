'use strict';

if (process.env.NODE_ENV == 'dev') {
  var dotenv = require('dotenv');
  dotenv.load();
}

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var engine = require('express-react-views');
var livereload = require('connect-livereload');
var morgan = require('morgan');
var session = require('express-session');

var passport = require('./controllers/passport');

var app = express();
module.exports = app;

/*
 * Application configuration
 */
app.set('view engine', 'jsx');
app.set('views', __dirname + '/views/pages');
app.engine('jsx', engine.createEngine());

app.use(morgan('dev'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({ secret: process.env.SERVER_SECRET }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
// app.use(require('./lib/middlewares/socket-aware'));
app.use(require('./controllers'));
app.use(require('express-error-handler'));

app.use(livereload());

require('./server');
