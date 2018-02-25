// route for Home-Page

module.exports = function (app, sessionChecker) {
    // set up the routes themselves
    app.get('/', sessionChecker, (req, res) => {
        res.redirect('/login')
    });

    app.get('/dashboard', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.sendFile(__dirname + '/public/dashboard.html');
        } else {
            res.redirect('/login');
        }
    });
};