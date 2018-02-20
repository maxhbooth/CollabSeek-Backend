var server =  require('../../server');
var client = server.client;
module.exports = function (app) {
    // set up the routes themselves
    app.get('/create-user', function (req, res) {
        client.query('SELECT NOW() as now', (dberr, dbres) => {
            if (err) {
                res.send('Hello world!');
            } else {
                res.send(dbres.rows[0]);
            }
        });
    });

    app.post('/login', function (req, res) {
        res.send('Hello world!')
    });
};