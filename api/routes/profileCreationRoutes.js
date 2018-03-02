// route for Home-Page

const degree = require('../../models/degree');

module.exports = function (app, sessionChecker) {

    // set up the routes themselves
    // app.get('/', sessionChecker, (req, res) => {
    //     res.redirect('/login')
    // });

    app.get('/profile-create', (req, res) => {
       // if (req.session.profile && req.cookies.user_sid) {
            //res.sendFile('/views/UserProfileCreate.html', {root: './'});

            console.log('hey');

            console.log(degree.findAll().then(function (degree) {

                console.log(degree);

            }));


            //
            // res.render('signup.html', {
            //     degrees: degree.findAll(),
            //     emailErrors: emailErrors,
            //     passwordErrors: passwordErrors,
            //     validated: req.body
            // });


       // }
        // } else {
        //     res.redirect('/login');
        // }
    });
};