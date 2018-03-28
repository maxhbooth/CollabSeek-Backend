const path = require('path');
const fs = require('fs');

const multer = require('multer');

const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app) {
    // set up the routes themselves

    app.get('/upload-image', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.render('upload-image.html',{});
        } else {
            res.redirect('/login');
        }
    });


    app.post('/upload-image', (req, res) => {
        const storage = multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, 'Images')
            },
            filename: function(req, file, callback) {
                console.log(file);
                callback(null, file.originalname)
            }
        });

        var upload = multer({
            storage: storage,
                fileFilter: function(req, file, callback) {
                    var ext = path.extname(file.originalname);
                    console.log(ext);
                    if (ext.toLowerCase() !== '.png' && ext.toLowerCase() !== '.jpg'
                        && ext.toLowerCase() !== '.gif' && ext.toLowerCase() !== '.jpeg') {
                            //res.render('upload-image.html',{errors: "Expected an Image."});
                            return callback(new Error('Expected an image.'))
                    }
                    callback(null, true)
                }
        }).single('imageUpload');


        if (req.session.profile && req.cookies.user_sid) {
            upload(req, res, function(err){
                if(err){
                    //there was an error uploading!
                }
            });

            res.redirect('/upload-image');
        } else {
            res.redirect('/login');
        }



    });

    app.get('/profile-image', function (req,res){
       res.sendFile('/views/resources/profile-icon.png', {root: './'});

    });
};