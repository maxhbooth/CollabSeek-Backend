var db = require('../../database/database');
var Profile = require('../../models/profile');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.route('/signup')
        .get(sessionChecker, (req, res) => {
            res.render('signup.html', {root: './'});
        })
        .post((req, res) => {
            req.checkBody('username', 'Username must be between 4 and 15 characters.').len(4, 15);
            req.checkBody('email', 'Email must be a valid email.').isEmail();
            req.checkBody('email', 'Email must be from 4 to 50 characters').len(4, 50);
            req.checkBody('password', 'Password must be between 8 to 50 characters.').len(4, 50);
            //req.checkBody('repassword', 'Passwords must match.').equals(req.body.password);

            const errors = req.validationErrors();

            if (!errors) {
                Profile.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                })
                    .then(profile => {
                        req.session.profile = profile.dataValues;
                        res.redirect('/create-profile');
                    })
                    .catch(error => {
                        //database error
                        console.log(error);
                        res.redirect('/signup');
                    });
            } else {
                console.log(errors);
                var userErrors = [];
                var emailErrors = [];
                var passwordErrors = [];
                for (var i = 0; i < errors.length; i++) {
                    if (errors[i].param === 'username') {
                        userErrors.push(errors[i].msg);
                    }
                    if (errors[i].param === 'email') {
                        emailErrors.push(errors[i].msg);
                    }
                    if (errors[i].param === 'password') {
                        passwordErrors.push(errors[i].msg);
                    }
                }
                res.render('signup.html', {
                    userErrors: userErrors,
                    emailErrors: emailErrors,
                    passwordErrors: passwordErrors,
                    validated: req.body
                });
            }
        });

    app.route('/login')
        .get(sessionChecker, (req, res) => {
            res.sendFile('/views/login.html', {root: './'});
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
                    res.redirect('/homepage.html');
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