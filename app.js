'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var engine = require('express-react-views');
var http = require('http');
var livereload = require('connect-livereload');
var morgan = require('morgan');
var session = require('express-session');

var config = require('./config');
var controllers = require('./controllers');
var passport = require('./controllers/passport');
var socket = require('./lib/socket');

var app = express();
var server = http.createServer(app);

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

app.use(session({ secret: 'snowshoe cat, wilson\'s mustache rocks' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(controllers);

app.use(livereload());

/*
 * Server part
 */
server.on('listening', function () {
  var separator = new Array(81).join('=');

  console.log(separator);
  console.log('Server created at ' + server.address().address + ':' + server.address().port);
  console.log(separator);
});

server.listen(
  process.env.PORT || config.get('server:port'),
  process.env.ADRESS || config.get('server:hostname')
);

socket(server);
