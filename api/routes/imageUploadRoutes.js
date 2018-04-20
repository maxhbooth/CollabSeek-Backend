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

    const storage = multer.diskStorage({
        destination: function(req, file, callback) {
            console.log("2");
            callback(null, 'views/Images')
        },
        filename: function(req, file, callback) {
            console.log("3");
            const profileId = req.session.profile.id;
            callback(null, "temp_" + profileId + path.extname(file.originalname))
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
                return image.resize(200, Jimp.AUTO)
                    .quality(60) // set JPEG quality
                    .exifRotate()
                    .write(profilePath, function(){
                        fs.unlink(tempPath);
                        res.redirect('/my-profile');
                    }); // save
            }).catch(function(error){
                console.log(error);
            });
            console.log("8");
        } else {
            res.redirect('/login');
        }
    };

    app.post('/upload-image',upload.single('imageUpload'), resize, (req, res) => {

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