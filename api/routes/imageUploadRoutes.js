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

            const storage = multer.diskStorage({
                destination: function(req, file, callback) {
                    callback(null, 'Images')
                },
                filename: function(req, file, callback) {
                    console.log(file);
                    callback(null, "ProfileImage_"+req.session.profile.id+ path.extname(file.originalname))
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

            upload(req, res, function(err){
                if(err){
                    //there was an error uploading!
                }
            });

            var profilePath = path.join(__dirname, "../../Images/ProfileImage_"+req.session.profile.id+".jpg");

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
            gm( profilePath).resize(200, 200).write(profilePath, function (err) {
                if (!err) console.log('TOTALLY WORKED')
                else console.log(err);
            });

            // gm( targetPath).resize(null, 50) .write(path.resolve('./public/assets/images/upload/new.jpg'),
            //     function (err) { if (!err) console.log('done'); });
            res.redirect('/profile');
        } else {
            res.redirect('/login');
        }



    });

    app.get('/profile-image', function (req,res){
        //"ProfileImage_"+req.session.profile.id+ path.extname(file.originalname)
        //var profilePath = "/Images/ProfileImage_"+req.session.profile.id+".jpg";
        //path.join(__dirname, '../templates')
        var profilePath = path.join(__dirname, "../../Images/ProfileImage_"+req.session.profile.id+".jpg");

        if (fs.existsSync(profilePath)) {

            res.sendFile("Images/ProfileImage_"+req.session.profile.id+".jpg", {root: './'});
        }
        //res.sendFile(profilePath);
        res.sendFile('/views/resources/profile-icon.png', {root: './'});

    });
};