const path = require('path');
const fs = require('fs');

const multer = require('multer');
const im = require('imagemagick');
const gm = require('gm');

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

        if (req.session.profile && req.cookies.user_sid) {

            const profileId = req.session.profile.id;

            var profileRepository = new ProfileRepository();

            const storage = multer.diskStorage({
                destination: function(req, file, callback) {
                    callback(null, 'views\\Images')
                },
                filename: function(req, file, callback) {
                    callback(null, "ProfileImage_" + profileId + path.extname(file.originalname))
                }
            });

            var upload = multer({
                storage: storage,
                    fileFilter: function(req, file, callback) {
                        var ext = path.extname(file.originalname);
                        console.log(ext);
                        if (ext.toLowerCase() !== '.png' && ext.toLowerCase() !== '.jpg'
                            && ext.toLowerCase() !== '.gif' && ext.toLowerCase() !== '.jpeg') {
                                return callback(new Error('Expected an image.'))
                        }
                        //add image to database then!

                        profileRepository.addImage(profileId,  "ProfileImage_" + profileId + ext);

                        callback(null, true)
                    }
            }).single('imageUpload');

            upload(req, res, function(err){
                if(err){
                    //there was an error uploading!
                }
            });

            // var pathTemp = path.join(__dirname, "..\\..\\views\\images\\ProfileImage_11.JPG");
            // im.convert([pathTemp, '-resize', '200x200', pathTemp],
            //     function(err, stdout){
            //         if (err) throw err;
            //         console.log('stdout:', stdout);
            // });

            //resizing the input image.
            // im.resize({
            //     srcPath: profilePath,
            //     dstPath: profilePath,
            //     height:   200,
            //     width: 200
            // }, function(err, stdout, stderr){
            //     if (err) throw err;
            //     console.log('resize complete.');
            // });

            res.redirect('/my-profile');
        } else {
            res.redirect('/login');
        }

    });
};