var express = require('express');
var pug = require('pug');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var route = require('./routes/routes.js');
var bodyParser = require('body-parser');


var app = express();

app.use(cookieParser());
app.use(expressSession({secret: 'toEverybody', saveUninitialized: true, resave: true}));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname + '/public')));

var urlencodedParser = bodyParser.urlencoded({
  extended: true
})

app.get('/', route.index);
app.get('/register', route.register);
app.post('/register', urlencodedParser, route.registerPerson);
app.get('/edit/:id', route.edit);
app.post('/edit/:id', urlencodedParser, route.editPerson);
app.get('/login/', route.login);
app.post('/login/', urlencodedParser, route.loginPerson);
app.get('/logout/:id', route.logout);

app.listen(3000);
