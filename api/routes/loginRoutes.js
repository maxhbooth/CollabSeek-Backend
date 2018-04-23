/* Login, logout and verify email address routes.
* Written by Mac Watrous, Max Booth, Marcus Wallace April 2018.
*  Includes:
*  1. /login (GET & POST)
*  2. /verify (GET & POST)
*  3. /logout (GET)
* */

var Profile = require('../../models/profile');

module.exports = function (app, sessionChecker) {
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

    app.get('/logout', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.clearCookie('user_sid');
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
};