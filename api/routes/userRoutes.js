var db = require('../../database/database');
var Profile = require('../../models/profile');
var randomstring = require('randomstring');
const await = require('asyncawait/await');
var nodemailer = require('nodemailer');
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
                res.redirect('/my-profile');
            }
        })
        .post((req, res) => {
            req.checkBody('email', 'Email must be a valid email.').isEmail();
            req.checkBody('email', 'Email must be from 4 to 50 characters.').len(4, 50);
            req.checkBody('password', 'Password must be between 8 to 50 characters.').len(4, 50);
            req.checkBody('password', 'Passwords must match.').equals(req.body.passwordconfirm);

            //what should I validate??
            req.checkBody('first', "Must enter a first name.").notEmpty();
            req.checkBody('last', "Must enter a last name.").notEmpty();

            const errors = req.validationErrors();

            if (!errors) {
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
                let hidden_token = randomstring.generate();
                let confirmed_user = false;

                //email compose
                const html = 'Greetings, <br/> Thank you for registering for CollabSeek' +
                    'Please verify you email by typing in the following hidden token <br/>' +
                    '<b>Token:</b>'+ hidden_token +
                    '<br/> in the following link ' +
                    '<a href ="http://localhost:8080/verify">http://localhost:8080/verify</a>';

                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'marcussw@cs.unc.edu',
                            pass: 'kebab*heels1'
                        }
                    });
                    let mailOptions = {
                        from: '"Fred Foo 👻" <marcussw@cs.unc.edu>', // sender address
                        to: email, // list of receivers
                        subject: 'CollabSeek Verification', // Subject line
                        text: 'Hello', // plain text body
                        html: html // html body
                    };
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });
                });
                var profileRepository = new ProfileRepository();
                profileRepository.createProfile(first, last, degreeName, departmentName, disciplineName,
                    positionName, facilityName, skillName, specialtyName, email, password, hidden_token, confirmed_user)
                    .then(profile => {
                        if(!profile.errors){
                            console.log(profile.errors);
                        }
                        req.session.profile = profile.dataValues;
                        res.redirect('verify.html');
                    });
            }
            else {
                console.log(errors);
                var userErrors = [];
                var emailErrors = [];
                var passwordErrors = [];
                for (var i = 0; i < errors.length; i++) {
                    if (errors[i].param === 'email') {
                        emailErrors.push(errors[i].msg);
                    }
                    if (errors[i].param === 'password') {
                        passwordErrors.push(errors[i].msg);
                    }
                }
                var attrRepository = new AttrRepository();
                attrRepository.getAll().then(function (models){
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
            var email = req.body.email,
                password = req.body.password;
            Profile.findOne({where: {email: email}}).then(function (profile) {
                let userConfirmed = profile.confirmed_user;
                console.log("LOGIN");
                console.log(userConfirmed);
                console.log(profile.email);
                if (!profile) {
                    res.redirect('/login');
                } else if (!profile.validPassword(password)) {
                    res.redirect('/login');
                }
                //check to see if profile has been activated return error message  //
                else if(!userConfirmed){
                    console.log("Confirm your email address.");
                    res.redirect('/verify');
                }
                else {
                    req.session.profile = profile.dataValues;
                    res.redirect('/');
                }
            });
        });
    // ROUTING FOR verify page

    app.route('/verify')
        .get(sessionChecker,(req,res) =>{
            res.sendFile('/views/verify.html', {root: './'});
        })
        .post(async( req, res) =>{
            try{
                var hidden_token = req.body.token;
                console.log(hidden_token);
                // next find account that matches hidden token
                Profile.findOne({where:{'hidden_token': hidden_token}}).then(function(user) {
                    if (!user) {
                        console.log("No user found");
                        res.redirect('/verify');
                        return;
                    }
                    //change the user's properties if pass
                    console.log(user.email);
                    console.log(user.confirmed_user);
                    user.confirmed_user = true;
                    user.hidden_token = "";
                    user.save().then(res.redirect('/login'));
                });
            }catch(error){
                console.log("Error:"+error);
            }
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