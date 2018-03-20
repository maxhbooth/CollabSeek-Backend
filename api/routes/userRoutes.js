var db = require('../../database/database');
var Profile = require('../../models/profile');

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves


    function extend(dest, src) {
        for(var key in src) {
            dest[key] = src[key];
        }
        return dest;
    }

    app.route('/signup')
        .get(sessionChecker, (req, res) => {
            if (!req.session.profile && !req.cookies.user_sid){

                var attrRepository = new AttrRepository();

                attrRepository.getAll().then(function (models){
                    //console.log(models); tbh this is annoying rn
                    res.render('signup.html', models);
                });

            }else {
                res.redirect('/profile');
            }
        })
        .post((req, res) => {
            req.checkBody('username', 'Username must be between 4 and 15 characters.').len(4, 15);
            req.checkBody('email', 'Email must be a valid email.').isEmail();
            req.checkBody('email', 'Email must be from 4 to 50 characters').len(4, 50);
            req.checkBody('password', 'Password must be between 8 to 50 characters.').len(4, 50);
            //req.checkBody('repassword', 'Passwords must match.').equals(req.body.password);

            //what should I validate??
            req.checkBody('first', "Must enter a first name.").notEmpty();
            req.checkBody('last', "Must enter a last name.").notEmpty();


            const errors = req.validationErrors();

            if (!errors) {

                console.log("this is req.body.password" + req.body.password);

                let username = req.body.username;
                let email = req.body.email;
                let password = req.body.password;

                let first = req.body.first;
                let last = req.body.last;
                let degreeName = req.body.degree;
                let departmentName = req.body.department;
                let disciplineName = req.body.discipline;
                let positionName = req.body.position;
                let facilityName = req.body.facility || null;
                let skillName = req.body.skill || null;
                let specialtyName = req.body.specialty || null;

                const profileRepository = new ProfileRepository();
                profileRepository.createProfile(first, last, degreeName, departmentName, disciplineName,
                    positionName, facilityName, skillName, specialtyName, username, email, password)
                    .then(profile => {
                        if(!profile.errors){
                            console.log(profile.errors);
                        }
                        req.session.profile = profile.dataValues;
                        res.redirect('/profile');
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

                var attrRepository = new AttrRepository();

                attrRepository.getAll().then(function (models){
                    //console.log(models); tbh this is annoying rn

                    var errors = {userErrors: userErrors,
                                    emailErrors: emailErrors,
                                    passwordErrors: passwordErrors,
                                    validated: req.body};
                    var data = extend(models, errors);
                    res.render('signup.html',
                        data );
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