/* Test routes.
* Written by Mac Watrous April 2018.
*  Includes:
*  1. /deleteTest (GET)
* */


var Profile = require('../../models/profile');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves
    function extend(dest, src) {
        for(var key in src) {
            dest[key] = src[key];
        }
        return dest;
    }

    app.get('/deleteTest', (req,res) => {
        var profileRepository = new ProfileRepository();
        Profile.findOne({where: {email: 'macwatro@cs.unc.edu'}}).then(function (profile) {
            profileRepository.deleteProfile(profile.id)
        });
    });
};