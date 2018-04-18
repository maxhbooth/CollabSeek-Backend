const path = require('path');
const fs = require('fs');

const multer = require('multer');
var Jimp = require("jimp");
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
            console.log("1");
            const profileId = req.session.profile.id;

            var profileRepository = new ProfileRepository();

            const storage = multer.diskStorage({
                destination: function(req, file, callback) {
                    console.log("2");
                    callback(null, 'views/Images')
                },
                filename: function(req, file, callback) {
                    console.log("3");
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
                                console.log("4");
                                return callback(new Error('Expected an image.'))
                        }
                        //add image to database then!
                        console.log("5");
                        profileRepository.addImage(profileId,  "ProfileImage_" + profileId + ext);

                        callback(null, true)
                    }
            }).single('imageUpload');
            upload(req, res, function(err){
                if(err){
                    //there was an error uploading!
                    console.log("6");
                    console.log(err);
                }
                else{
                    var profilePath = path.join(__dirname, "../../views/images/ProfileImage_"
                        + profileId + path.extname(req.file.originalname));
                    // resize image
                    Jimp.read(profilePath, function (err, picture) {
                        if (err){
                            console.log(err);
                            throw err;
                        }
                        console.log("7");
                        
                        picture.resize(200, Jimp.AUTO)
                            .quality(60) // set JPEG quality
                            .exifRotate()
                            .write(profilePath); // save
                    });
                    console.log("8");
                }
            });

            console.log("9");
            res.redirect('/my-profile');
        } else {
            res.redirect('/login');
        }

    });
    app.post('/upload-image-signup', (req, res) => {
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
                if(err || !req.file){
                    console.log("ERROR IN IMAGEUPLOADROUTES: " + err);
                }
                else{
                    var profilePath = path.join(__dirname, "..\\..\\views\\images\\ProfileImage_"
                        + profileId + path.extname(req.file.originalname));
                    // resize image
                    Jimp.read(profilePath, function (err, picture) {
                        if (err) throw err;

                        picture.resize(200, Jimp.AUTO)
                            .quality(60) // set JPEG quality
                            .exifRotate()
                            .write(profilePath); // save
                    });
                }
            });
            res.redirect('/signup-trees');
        }else if(req.session.profile && req.cookies.user_sid){
            res.redirect('/signup-trees');
        }else {
            res.redirect('/login');
        }
    });
};