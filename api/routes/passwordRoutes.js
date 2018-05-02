/* Password resetting and changing routes.
* Written by Marcus Wallace April 2018.
*  Includes:
*  1. /resetpassword (POST)
*  2. /changepassword (GET & POST)
*  3. /profile-reset (GET & POST)
*  4. /verify/:hidden_token (POST)
*  5. /changepassword/:password_token (GET)
* */


var Profile = require('../../models/profile');
var bcrypt = require('bcrypt');
var mailer = require('./helpers/mailer');
var random = require('randomstring');
module.exports = function (app, sessionChecker) {
    function extend(dest, src) {
        for(var key in src) {
            dest[key] = src[key];
        }
        return dest;
    }
    app.route('/resetpassword')
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
                'to change the account password for '+ user.first_name + ' ' + user.last_name +
                '. If this is true click the link below, if not just ignore this message <br/>'+
                '<a href ="'+process.env.COLLAB_LINK+'/changepassword/'+password_token+'">http://backend-test-dept-comp523collaborate.cloudapps.unc.edu</a>' +
                'to change the account password for '+ user.first_name + " " + user.last_name +
                '. If this is true click the link below, if not just ignore this message.'+
                '<br/><br/><a href ="'+process.env.COLLAB_LINK+'/changepassword/'+password_token+'">'+process.env.COLLAB_LINK+'/changepassword/'+password_token+'</a>' +
                '<br/><br/> Have a nice day, <br/> CollabSeek Team';
            mailer.sendEmail("collabuncseek@gmail.com", email, "Password Reset", html);

            res.redirect('/login');
        })
    });

    app.route('/profile-reset')
    .post((req,res) =>{

        var password = req.body.current_password;
        var user = req.session.profile;
        Profile.findOne({where: {email: user.email}}).then(function (profile) {
            if(!profile){
                return;
            }
            if (!profile.validPassword(req.body.current_password)) {
                res.render('profile-password-change.html', {error: 'Current password incorrect.'});
                return;
            }
            if(req.body.new_password !== req.body.confirm_password){
                res.render('profile-password-change.html', {saved_password: req.body.current_password, error: 'New passwords do not match.'});
                return;
            }
            if(req.body.new_password.length < 8 || req.body.new_password.length > 25){
                res.render('profile-password-change.html', {saved_password: req.body.current_password, error: 'Password must be between 8 and 25 characters.'});
                return;
            }
            var newpassword = req.body.new_password;

            const salt = bcrypt.genSaltSync();
            profile.password = bcrypt.hashSync(newpassword, salt);
            const html = 'Dear CollabSeek User, <br/><br/>  You are receiving this email because the password ' +
                'was changed for the account '+ user.first_name + " " + user.last_name +
                '. If you recently changed your password, ignore this message. Otherwise, click the Forgot Password link on the login page to change your password.<br/> <br/>'
                +'Regards <br/> The CollabSeek Team';
            mailer.sendEmail("collabuncseek@gmail.com", user.email, "Password Reset", html);
            profile.save().then(res.redirect('/my-profile'));

        });
    });

    app.get('/verify/:hidden_token',(req,res)=>{
        if (req.session.profile && req.cookies.user_sid) {
            var hidden_token = req.params.hidden_token;
            console.log(hidden_token);
            // next find account that matches hidden token
            Profile.findOne({where:{'hidden_token': hidden_token}}).then(function(user) {
                if (!user) {
                    console.log("No user found");
                    res.redirect('/login');
                    return;
                }
                user.confirmed_user = true;
                user.hidden_token = "";
                user.save().then(res.redirect('/my-profile'));
            });

        }
    });

    app.get('/profile-reset', (req,res) =>{
        if (req.session.profile && req.cookies.user_sid) {
            res.render('profile-password-change.html');
        }
    });

    app.get('/changepassword/:password_token',(req,res)=>{
        var password_token = req.params.password_token;
        Profile.findOne({where:{'password_token':password_token}}).then(function(user) {
            if (!user) {
                console.log("No user found");
                res.redirect('/login');
                return;
            }
            res.render('change-password.html', user);
        });
    });

    app.post('/changepassword/:password_token', (req,res)=>{
        var password = req.body.new_password;
        Profile.findOne({where: {'password_token': req.params.password_token}}).then(function (user) {
            if(!user){
                console.log("Associated user not found.");
                res.redirect('/login');
                return;
            }
            if(req.body.new_password !== req.body.confirm_password){
                user.error = 'New passwords do not match.';
                res.render('change-password.html', user);
                return;
            }
            if(req.body.new_password.length < 8 || req.body.new_password.length > 25){
                user.error = 'Password must be between 8 and 25 characters.';
                res.render('change-password.html', user);
                return;
            }

            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);
            user.password_token = random.generate();
            user.save().then(function() {
                req.session.profile = user.dataValues;
                res.redirect('/my-profile')
            });
        });
    });

};