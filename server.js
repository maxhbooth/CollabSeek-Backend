var express = require('express'),
app = express(),
port = process.env.PORT || 8080;

require('dotenv').config();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var expressValidator = require('express-validator');

app.engine('html', require('ejs').renderFile);



// set morgan to log info about our requests for development use.
app.use(morgan('dev'));
// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({extended: true}));
// for validating requests
app.use(expressValidator());
// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    res.locals.get = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        var path = args[0].split('.');
        var root = this;
        for (var i = 0; i < path.length; i++) {
            if (root[path[i]] === void 0) {
                return args[1] ? args[1] : null;
            } else {
                root = root[path[i]];
            }
        }
        ;
        return root;
    }

    if (req.cookies.user_sid && !req.session.profile) {
        res.clearCookie('user_sid');
    }
    next();
});
// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.profile && req.cookies.user_sid) {
        res.redirect('/welcome');
    } else {
        next();
    }
};

app.use(express.static(__dirname + '/views'));

var userRoutes = require('./api/routes/userRoutes');
var homeRoutes = require('./api/routes/homeRoutes');
//var profileCreationRoutes = require('./api/routes/profileCreationRoutes')
homeRoutes(app, sessionChecker);
userRoutes(app, sessionChecker);
//profileCreationRoutes(app, sessionChecker);

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

module.exports = app;
module.exports = sessionChecker;