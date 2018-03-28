var db = require('../../database/database');
var Profile = require('../../models/profile');

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {


    app.route('/update-position').post((req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            let positionName = req.body.position;

            const profileRepository = new ProfileRepository();
            profileRepository.updatePosition(positionName, req.session.profile.profile_id);
    }else {
        res.redirect('/welcome');        }
    });
};
