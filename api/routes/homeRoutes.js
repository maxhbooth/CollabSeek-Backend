// route for Home-Page

module.exports = function (app, sessionChecker) {
    // set up the routes themselves
    app.get('/', sessionChecker, (req, res) => {
        res.redirect('/login')
    });

    app.get('/dashboard', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.sendFile('/views/dashboard.html', {root: './'});
        } else {
            res.redirect('/login');
        }
    });
};