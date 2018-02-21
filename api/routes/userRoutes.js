var db = require('../../database/database')

module.exports = function (app,client) {
    // set up the routes themselves
    app.get('/create-user', function (req, res) {
        db.query('SELECT NOW() as now', (dberr, dbres) => {
            if (dberr) {
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