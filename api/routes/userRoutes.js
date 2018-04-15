var db = require('../../database/database');
var Profile = require('../../models/profile');
var randomstring = require('randomstring');
const await = require('asyncawait/await');
var mailer = require('./helpers/mailer');
//var nodemailer = require('nodemailer');
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
    //////////////////////////////////// ROUTING FOR VERIFY PAGE BY MARCUS/////////////////////////////////////////////
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

    //////////////////////////////////  ROUTE FOR RESET PASSWORD BY MARCUS/////////////////////////////////////////////
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


                    //else send an email to change password
                    const html = 'Dear CollabSeek User, <br/><br/>  You are receiving this email because there was a request ' +
                        'to change the account password for '+ user.first_name +user.last_name +
                        'if this is true click the link below, if not just ignore this message'+
                        '<a href ="'+process.env.COLLAB_LINK+'/changepassword/'+password_token+'">http://backend-test-dept-comp523collaborate.cloudapps.unc.edu</a>' +
                          '<br/><br/> Have a nice day, <br/> CollabSeek team';
                    mailer.sendEmail("collabuncseek@gmail.com", email, "Password Reset", html);

                    res.redirect('/login');





            })
        });
    /////////////////////////////////////////// ROUTE FOR CHANGING USER PASSWORD BY MARCUS///////////////////////////////////
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