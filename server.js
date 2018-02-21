var express = require('express'),
app = express(),
port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

var routes = require('./api/routes/userRoutes');
routes(app);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

module.exports = app;