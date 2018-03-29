var db = require('../../database/database');
var Profile = require('../../models/profile');

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {
    app.get('/update-position', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.redirect('/my-profile');
        }else {
            res.redirect('/welcome');
        }
    });

    app.post('/update-position', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            let positionName = req.body.position;
            profileRepository = new ProfileRepository();
            profileRepository.updatePosition(req.session.profile.id, positionName).then(function(){res.redirect('/my-profile')});
        }else {
            res.redirect('/welcome');
        }
    });

    app.post('/update-name', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.updateName(req.session.profile.id, req.body.first, req.body.last).then(function(){res.redirect('/my-profile')});
        }
        else{
            res.redirect('/welcome');
        }
    });

};