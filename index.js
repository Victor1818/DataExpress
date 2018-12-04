var express = require('express'),
  pug = require('pug'),
  path = require('path'),
  route = require('./routes/routes.js'),
  bcrypt = require('bcrypt-nodejs'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session'),
  bodyParser = require('body-parser');


var app = express();

app.use(cookieParser());
app.use(expressSession({secret: 'toEverybody', saveUninitialized: true, resave: true}));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));

var urlencodedParser = bodyParser.urlencoded({
  extended: true
})



app.listen(3000);