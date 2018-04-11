var db = require('../../database/database');
var Profile = require('../../models/profile');
var randomstring = require('randomstring');
const await = require('asyncawait/await');
var nodemailer = require('nodemailer');
const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');
var bcrypt = require('bcrypt');
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

            res.render('signup.html', models);
        });

        }else {
            res.redirect('/my-profile');
        }
    })
    .post((req, res) => {
        req.checkBody('email', 'Email must be a valid email.').isEmail();
        req.checkBody('email', 'Email must be from 8 to 50 characters.').len(8, 50);
        req.checkBody('password', 'Password must be between 8 to 50 characters.').len(4, 50);
        req.checkBody('password', 'Passwords must match.').equals(req.body.passwordconfirm);
        req.checkBody('first', "Must enter a first name.").notEmpty();
        req.checkBody('last', "Must enter a last name.").notEmpty();

        let errors = req.validationErrors();
        if(!req.body.email.endsWith("unc.edu") ){
            errors.push({msg:"Email must end with unc.edu", param:"email"});
        }
        if (!errors) {
            let hidden_token = randomstring.generate();
            let confirmed_user = false;

            var profileRepository = new ProfileRepository();
            profileRepository.createProfile(req.body.first, req.body.last, req.body.degree, req.body.department, req.body.discipline,
                req.body.position, null, null, null, req.body.email, req.body.password, hidden_token, confirmed_user).then(profile => {
                req.session.profile = profile.dataValues;
            console.log(req.session.profile);
            res.redirect('/signup-details');
        })
        .catch(profile_errors =>{
                var attrRepository = new AttrRepository();
            attrRepository.getAll().then(function (models){
                var errors = {userErrors: [profile_errors], validated: req.body};
                var data = extend(models, errors);
                res.render('signup.html', data);
            });
        });
        }
        else {
            console.log(errors);
            var userErrors = [];
            var emailErrors = [];
            var passwordErrors = [];
            for (var i = 0; i < errors.length; i++) {
                if (errors[i].param === 'email') {emailErrors.push(errors[i].msg);}
                else if (errors[i].param === 'password') {passwordErrors.push(errors[i].msg);}
                else{userErrors.push(errors[i].msg);}
            }
            attrRepository = new AttrRepository();
            attrRepository.getAll().then(function (models){
                var errors = {userErrors: userErrors, emailErrors: emailErrors,
                    passwordErrors: passwordErrors, validated: req.body};
                var data = extend(models, errors);
                res.render('signup.html', data);
            });
        }
    });

    app.get('/signup-details', (req, res) => {
        if (req.session.profile && req.cookies.user_sid){
        var attrRepository = new AttrRepository();
        attrRepository.getAll().then(function (attributes){
            var profileRepository = new ProfileRepository();
            profileRepository.getProfileInformation(req.session.profile.id).then(function (profile){
                var models = {attributes: attributes, profile: profile};
                if(!profile.confirmed_user) {
                    res.render('signup-details.html', models);
                }
                else{
                    res.redirect('/my-profile');
                }
            });
        });
    }else {
        res.redirect('/my-profile');
    }
});
    app.post('/signup-details', (req, res) => {
        if (req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.getProfileInformation(req.session.profile.id).then(models => {
            //email compose
            const url = "http://localhost:8080/verify/"+hidden_token;
        const html = 'Greetings, <br/> Thank you for registering for CollabSeek' +
            'Please verify you email by typing in the following hidden token <br/>' +
            '<b>Token:</b>'+ hidden_token +
            '<br/> in the following link ' +
            '<a href ="http://localhost:8080/verify/'+hidden_token+'">click here</a>';

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
            from: '"CollabSeek" <marcussw@cs.unc.edu>', // sender address
            to: email, // list of receivers
            subject: 'CollabSeek Email Verification', // Subject line
            text: 'Click on the Link below', // plain text body
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

        res.redirect('/verify');
    }).catch(profile_errors =>{
            console.log(profile_errors);
        res.redirect('/verify');
    });

    } else {
        console.log(errors);
        attrRepository = new AttrRepository();
        attrRepository.getAll().then(function (models){
            var errors = {userErrors: userErrors, emailErrors: emailErrors, passwordErrors: passwordErrors, validated: req.body};
            var data = extend(models, errors);
            res.render('signup.html', data);
        });
    }
});



};