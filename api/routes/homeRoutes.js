// route for Home-Page

const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.get('/', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.sendFile('/views/homepage.html', {root: './'});
        } else {
            res.redirect('/welcome')
        }
    });

    app.get('/welcome', sessionChecker, (req, res) => {
        res.sendFile('/views/welcome.html', {root: './'});
    });

    app.get('/profile', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {

            let profileRepositiory = new ProfileRepository();

            profileRepositiory.getProfileInformation(req.session.profile.id).then(function (models){
                console.log(models);
                res.render('profile.html', models);
            });

        } else {
            res.redirect('/login');
        }
    });
};