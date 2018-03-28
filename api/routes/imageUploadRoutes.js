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

            // gm( profilePath).resize(200, 200).write(profilePath, function (err) {
            //     if (!err) console.log('TOTALLY WORKED')
            //     else console.log(err);
            // });

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

            res.setHeader('Content-Type', 'image/jpg');
            res.sendFile("Images/ProfileImage_"+req.session.profile.id+".jpg", {root: './'});
        }
        //res.sendFile(profilePath);
        res.setHeader('Content-Type', 'image/jpg');
        res.sendFile('/views/resources/profile-icon.png', {root: './'});

    });
};