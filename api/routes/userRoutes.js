var db = require('../../database/database')
var expressValidator = require('express-validator');

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
        console.log('I ran')
        //validation
        //console.log(req.body.username);
        req.checkBody('username', 'Username must be between 4 and 15 characters.').len(4,15);
        req.checkBody('email', 'Email must be a valid email.').isEmail();
        req.checkBody('email', 'Email must be from 4 to 50 characters.').len(4,50);
        req.checkBody('password', 'Password must be between 8 to 50 characters.').len(4,50);
        req.checkBody('repassword', 'Passwords must match.').equals(req.body.password);

        const errors = req.validationErrors();

        if(errors) {
            console.log("found errors");
            //console.log(`errors: ${JSON.stringify(errors)}`);
            res.send(errors);
        }
        else{

             console.log('no errors');

            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

             res.send('registration complete');
        //     // db.query('insert into users(username, email, password) \
        //     //      values (?, ?, ?)', [username, email, password], function(dberr, dbres, fields){
        //     //         if(dberr){
        //     //             throw dberr;
        //     //         }
        //     //      });
         }

    });

    app.post('/login', function (req, res) {
        res.send('Hello world!')
    });

};