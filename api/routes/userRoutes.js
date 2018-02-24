var db = require('../../database/database')
var expressValidator = require('express-validator');
const bcrypt = require('bcrypt');

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

    app.post('/register', function(req, res) {

        req.checkBody('username', 'Username must be between 4 and 15 characters.').len(4,15);
        req.checkBody('email', 'Email must be a valid email.').isEmail();
        req.checkBody('email', 'Email must be from 4 to 50 characters.').len(4,50);
        req.checkBody('password', 'Password must be between 8 to 50 characters.').len(4,50);
        req.checkBody('repassword', 'Passwords must match.').equals(req.body.password);

        const errors = req.validationErrors();

        if(errors) {
            //console.log(`errors: ${JSON.stringify(errors)}`);
            res.send(`${JSON.stringify(errors)}`);
        }
        else{
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password
            
            bcrypt.hash(password, 10, function(err, hash) {
                // Store hash in your password DB.
                db.query('insert into users(username, email, password) \
                 values ($1, $2, $3)', [username, email, hash], function(dberr, dbres, fields){
                    if(dberr){
                        throw dberr;
                    }
                    res.send('registration complete');
                 });
                });
            }
    });

    app.get('/listUsers', function(req, res) {

        db.query('SELECT * from users', (dberr, dbres) => {
            if (dberr) {
                throw dberr;
            } else {
                res.send(dbres.rows);
            }
        });
    });

    app.post('/login', function (req, res) {
        res.send('Hello world!')
    });

};