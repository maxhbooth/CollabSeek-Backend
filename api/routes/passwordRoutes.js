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
            // console.log(password_token);

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
    app.route('/changepassword')
        .get(sessionChecker,(req,res) =>{
    })

    .post((req,res)=>{
        var email = req.body.email;
        req.checkBody('new_password', 'Password must be between 8 to 50 characters.').len(4, 50);
        req.checkBody('new_password', 'Passwords must match.').equals(req.body.confirm_password);
        var password = req.body.new_password;
        Profile.findOne({where: {'email': email}}).then(function (user) {
            if(!user){
                console.log("No user found with the email");
                res.redirect('/login');
                return;
            }
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);
            user.save().then(res.redirect('/my-profile'));
        });
    });

    app.route('/profile-reset')
    .post((req,res) =>{

        var password = req.body.current_password;
        var user = req.session.profile;
        req.checkBody('current_password', 'Wrong current password.').equals(user.password)
        req.checkBody('new_password', 'Password must be between 8 to 50 characters.').len(4, 50);
        req.checkBody('new_password', 'Passwords must match.').equals(req.body.confirm_password);
        var newpassword = req.body.new_password;
        Profile.findOne({where: {email: user.email}}).then(function (profile) {
            if(!profile){
                console.log("Error");
                return;
            }
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
            res.render('change-password.html');
        });
    });

};