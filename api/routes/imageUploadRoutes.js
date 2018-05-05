/* Upload profile images during signup and from profile edit. Also helper functions for image processing.
* Written by Max Booth April 2018.
*  Includes:
*  1. /upload-image (GET & POST)
*  2. /upload-image-signup (POST)
*  3. Helpers: image storage, image upload, image resize
* */

const path = require('path');
const fs = require('fs');

const multer = require('multer');
var Jimp = require("jimp");
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app) {

    app.get('/upload-image', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.render('upload-image.html',{});
        } else {
            res.redirect('/login');
        }
    });

    const storage = multer.diskStorage({
        destination: function(req, file, callback) {
            console.log("2");
            if (process.env.COLLAB_LINK == "http://localhost:8080")
                callback(null, 'views/Images')
            else
                callback(null, 'data')
        },
        filename: function(req, file, callback) {
            console.log("3");
            const profileId = req.session.profile.id;
            callback(null, "ProfileImage_" + profileId + path.extname(file.originalname))
        }
    });
    var upload = multer({
        storage: storage,
        fileFilter: function(req, file, callback) {
            if (req.session.profile && req.cookies.user_sid) {
                var ext = path.extname(file.originalname);
                console.log(ext);
                if (ext.toLowerCase() !== '.png' && ext.toLowerCase() !== '.jpg'
                    && ext.toLowerCase() !== '.gif' && ext.toLowerCase() !== '.jpeg') {
                    console.log("4");
                    return callback(new Error('Expected an image.'))
                }
                //add image to database then!
                console.log("5");
                const profileId = req.session.profile.id;
                const profileRepository = new ProfileRepository();
                profileRepository.addImage(profileId, "ProfileImage_" + profileId + ext);

                callback(null, true)
            }
            else{
                callback(null, false);
            }
        }
    });


    var resize = function(req, res) {
        if (req.session.profile && req.cookies.user_sid) {
            console.log("1");

            const profileId = req.session.profile.id;

            var profilePath = path.join(__dirname, "../../views/Images/ProfileImage_"
                + profileId + path.extname(req.file.originalname));

            var tempPath = path.join(__dirname, "../../views/Images/temp_"
                + profileId + path.extname(req.file.originalname));
            // resize image
            console.log(tempPath);
            console.log(fs.existsSync(tempPath));
            console.log(fs.existsSync(path.join(__dirname, "../../views/Images/")));
            Jimp.read(tempPath).then(function(image){
                console.log(image);
                console.log("sucessfully read");
                return image.resize(200, Jimp.AUTO, function(err, image) {
                            console.log("inside resize");
                            image.quality(60, function(err, image) {
                                console.log("inside quality");
                                    image.write(profilePath, function(err, image) {
                                        console.log("inside write");
                                        res.redirect('/my-profile');
                                    });
                            });
                        });
            }).catch(function(error){
                console.log("caught error:");
                console.log(error);
            });
            console.log("8");
        } else {
            res.redirect('/login');
        }
    };

    app.post('/upload-image',upload.single('imageUpload'), function(req,res){
        if (req.session.profile && req.cookies.user_sid) {
            res.redirect('/my-profile');
        } else {
            res.redirect('/login');
        }
    });

    app.post('/upload-image-signup',upload.single('imageUpload'), function(req, res){
        if (req.session.profile && req.cookies.user_sid) {
            res.redirect('/signup-trees');
        }else if(req.session.profile && req.cookies.user_sid){
            res.redirect('/signup-trees');
        }else {
            res.redirect('/login');
        }
    });
};