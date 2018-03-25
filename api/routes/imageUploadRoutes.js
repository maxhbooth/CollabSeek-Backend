const path = require('path');
const fs = require('fs');
const db = require('../../database/database');

module.exports = function (app) {
    // set up the routes themselves

    app.get('/upload-image', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.render('upload-image.html',{});
        } else {
            res.redirect('/welcome');        }
    });
    app.post('/upload-image', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            //save image somewhere i can find it.

            db.connect();
            db.query('insert into profile_image(profile_id, image) values('
                + req.session.profile.id + ',' + req.files.imageUpload+  ')');
            db.end();

            res.redirect('/profile');
        } else {
            res.redirect('/welcome');        }
    });

    app.get('/profile-image', function (req,res){
       res.sendFile('/views/resources/profile-icon.png', {root: './'});

    });
};