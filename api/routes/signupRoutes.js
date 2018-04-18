var db = require('../../database/database');
const path = require('path');
const fs = require('fs');
var Profile = require('../../models/profile');
var randomstring = require('randomstring');
const await = require('asyncawait/await');
//var nodemailer = require('nodemailer');
var mailer = require('./helpers/mailer');
const multer = require('multer');
var Jimp = require("jimp");
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
            let password_token = randomstring.generate();


            var profileRepository = new ProfileRepository();
            profileRepository.createProfile(req.body.first, req.body.last, req.body.degree, req.body.department, req.body.discipline,
                req.body.position, null, null, null, req.body.email, req.body.password,
                hidden_token, confirmed_user, password_token, req.body.intro, req.body.pronouns, req.body.website,
                req.body.phone, req.body.availability).then(profile => {
                req.session.profile = profile.dataValues;
                var email = req.body.email;
                //email compose
                const html = 'Dear CollabSeek User, <br/><br/> Thank you for registering for CollabSeek' +
                    'In order to to view your profile you have to verify your account by clicking on the link below <br/>'+
                    '<a href ="'+process.env.COLLAB_LINK+'/verify/'+hidden_token+'">'+process.env.COLLAB_LINK+'/verify/'+hidden_token+' </a>';

                // var html;
               mailer.sendEmail("donotreply@collabseek.com",email, "Please Verify Account", html);
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
        } else {
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
        } else {
            res.redirect('/welcome');
        }
    });

    app.post('/signup-details', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
        const profileId = req.session.profile.id;
        var profileRepository = new ProfileRepository();
        const storage = multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, 'views\\Images')
            },
            filename: function(req, file, callback) {
                callback(null, "ProfileImage_" + profileId + path.extname(file.originalname))
            }
        });

        var upload = multer({
            storage: storage,
            fileFilter: function(req, file, callback) {
                var ext = path.extname(file.originalname);
                console.log(ext);
                if (ext.toLowerCase() !== '.png' && ext.toLowerCase() !== '.jpg'
                    && ext.toLowerCase() !== '.gif' && ext.toLowerCase() !== '.jpeg') {
                    return callback(new Error('Expected an image.'))
                }
                //add image to database then!
                profileRepository.addImage(profileId,  "ProfileImage_" + profileId + ext);
                callback(null, true)
            }
        }).single('imageUpload');
        upload(req, res, function(err){
            if(err){
                console.log("ERROR IN IMAGEUPLOADROUTES: " + err);
            }
            else{
                var profilePath = path.join(__dirname, "..\\..\\views\\images\\ProfileImage_"
                    + profileId + path.extname(req.files.originalname));
                // resize image
                Jimp.read(profilePath, function (err, picture) {
                    if (err) throw err;

                    picture.resize(200, Jimp.AUTO)
                        .quality(60) // set JPEG quality
                        .exifRotate()
                        .write(profilePath); // save
                });
            }
        });
        res.redirect('/signup-trees');
    } else {
        res.redirect('/login');
    }
    });

    app.get('/signup-trees', (req, res) => {
        if (req.session.profile && req.cookies.user_sid){
            var attrRepository = new AttrRepository();
            attrRepository.getAll().then(function (attributes){
                var profileRepository = new ProfileRepository();
                profileRepository.getProfileInformation(req.session.profile.id).then(function (profile){
                    var models = {attributes: attributes, profile: profile};
                    if(!profile.confirmed_user) {
                        res.render('signup-trees.html', models);
                    }
                    else{
                        res.redirect('/my-profile');
                    }
                });
            });
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/signup-trees', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            res.redirect('/verify');
        }else{
            res.redirect('/welcome');
        }
    });

};