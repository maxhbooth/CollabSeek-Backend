var db = require('../../database/database')
var Profile = require('../../models/profile');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.route('/signup')
        .get(sessionChecker, (req, res) => {
            res.sendFile(__dirname + '/public/signup.html');
        })
        .post((req, res) => {
            Profile.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
                .then(profile => {
                    req.session.profile = profile.dataValues;
                    res.redirect('/dashboard');
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/signup');
                });
        });

    app.route('/login')
        .get(sessionChecker, (req, res) => {
            res.sendFile(__dirname + '/public/login.html');
        })
        .post((req, res) => {
            var username = req.body.username,
                password = req.body.password;

            Profile.findOne({where: {username: username}}).then(function (profile) {
                if (!profile) {
                    res.redirect('/login');
                } else if (!profile.validPassword(password)) {
                    res.redirect('/login');
                } else {
                    req.session.profile = profile.dataValues;
                    res.redirect('/dashboard');
                }
            });
        });

    app.get('/logout', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.clearCookie('user_sid');
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
};