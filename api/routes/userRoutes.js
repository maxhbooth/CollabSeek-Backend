var db = require('../../database/database');
var Profile = require('../../models/profile');
var randomstring = require('randomstring');
const await = require('asyncawait/await');
//var mailer = require('../../views/js/mailer');
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





    app.route('/login')
        .get(sessionChecker, (req, res) => {
            res.render('login.html');
        })
        .post((req, res) => {
            var email = req.body.email, password = req.body.password;
            Profile.findOne({where: {email: email}}).then(function (profile) {
                if(profile==null){
                    res.render('login.html', {error: 'Invalid email.'});
                }
                let userConfirmed = profile.confirmed_user;

                if (!profile) {
                    res.render('login.html', {error: 'Invalid email.'});
                } else if (!profile.validPassword(password)) {

                    res.render('login.html', {error: 'Invalid password.'});
                } else if(!userConfirmed){
                    //check to see if profile has been activated return error message  //
                    console.log("Confirm your email address.");
                    res.redirect('/verify');
                } else {
                    req.session.profile = profile.dataValues;
                    res.redirect('/');
                }
            });
        });
    // ROUTING FOR verify page

    //app.route('/verify')
    app.get('/verify',(req,res) =>{
            res.sendFile('/views/verify.html', {root: './'});
        });

    app.post('/verify', ( req, res) =>{
            var hidden_token = req.body.token;
            console.log(hidden_token);
            // next find account that matches hidden token
            Profile.findOne({where:{'hidden_token': hidden_token}}).then(function(user) {
                if (!user) {
                    console.log("No user found");
                    res.redirect('/verify');
                }
                //change the user's properties if pass
                user.confirmed_user = true;
                user.hidden_token = "";
                user.save().then(res.redirect('/login'));
            }).catch(error => {
                console.log("Error:" + error);
            });
        });
    app.route('/resetpassword')
        .get(sessionChecker,(req,res) =>
        {
         //   res.sendFile('/views/verify.html', {root: './'});
        })
        .post((req,res)=> {
            var email = req.body.email;
            Profile.findOne({where:{'email': email}}).then(function(user) {
                if(!user){
                    console.log("No user found with the email");
                    res.redirect('/login');
                    return;
                }
                    let password_token = user.password_token;
               // console.log(password_token);

                    //else send an email to change password
                    const html = 'Greetings, <br/> Check the following link below to change password'+
                        '<a href ="http://localhost:8080/changepassword/'+password_token+'">click here</a>';
                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: process.env.NODE_EMAIL_SERVICE,
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.NODE_EMAIL,
                            pass: process.env.NODE_PASS
                        }
                    });
                    let mailOptions = {
                        from: '"CollabSeek " <marcussw@cs.unc.edu>', // sender address
                        to: email, // list of receivers
                        subject: 'CollabSeek Password Change Request', // Subject line
                        text: 'Please look at the link below', // plain text body
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
                    res.redirect('/login');

                });



            })
        });
    app.route('/changepassword')
        .get(sessionChecker,(req,res) =>{


        })

        .post((req,res)=>{
            var email = req.body.email;
            req.checkBody('new_password', 'Password must be between 8 to 50 characters.').len(4, 50);
            req.checkBody('new_password', 'Passwords must match.').equals(req.body.confirm_password);
            var password = req.body.new_password;
            Profile.findOne({where: {email: email}}).then(function (user) {
                if(!user){
                    console.log("No user found with the email");
                    res.redirect('/login');
                    return;
                }
                const salt = bcrypt.genSaltSync();
                user.password = bcrypt.hashSync(password, salt);
                user.save().then(res.redirect('/login'));
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

    app.get('/deleteTest', (req,res) => {
        var profileRepository = new ProfileRepository();
        Profile.findOne({where: {email: 'macwatro@cs.unc.edu'}}).then(function (profile) {
            profileRepository.deleteProfile(profile.id)
        });
    });
};