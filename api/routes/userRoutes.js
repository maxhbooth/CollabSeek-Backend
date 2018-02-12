module.exports = function (app) {
    // set up the routes themselves
    app.get('/create-user', function (req, res) {
        res.send('Hello world!')
    });

    app.post('/login', function (req, res) {
        res.send('Hello world!')
    });
};