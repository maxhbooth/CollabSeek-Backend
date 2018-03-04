// route for Home-Page

const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.get('/', sessionChecker, (req, res) => {
        res.redirect('/welcome')
    });

    app.get('/welcome', sessionChecker, (req, res) => {
        res.sendFile('/views/welcome.html', {root: './'});
    });

    app.get('/index', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {

            let profileRepositiory = new ProfileRepository();

            profileRepositiory.getProfileInformation(req.session.profile.id).then(function (models){
                console.log(models);
                res.render('dashboard.html', models);
            });

            //res.sendFile('/views/dashboard.html', {root: './'});
        } else {
            res.redirect('/login');
        }
    });

    app.get('/dashboard', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {


            // let profileRepositiory = new ProfileRepository();
            //
            // profileRepositiory.getProfileInformation(req.session.profile.id).then(function (models){
            //     console.log(models);
            //     res.render('dashboard.html', models);
            // });

            res.sendFile('/views/dashboard.html', {root: './'});
        } else {
            res.redirect('/login');
        }
    });
};