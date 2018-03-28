var db = require('../../database/database');
var Profile = require('../../models/profile');

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {
    app.get('/update-position', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.redirect('/my-profile');
        }else {
            res.redirect('/login');
        }
    });

    app.post('/update-position', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            let positionName = req.body.position;
            console.log(positionName);
            profileRepository = new ProfileRepository();
            profileRepository.updatePosition(positionName, req.session.profile.profile_id);
            console.log(positionName);
            res.redirect('/my-profile');
        }else {
            res.redirect('/welcome');
        }
    });
};
