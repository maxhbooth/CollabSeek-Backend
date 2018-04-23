/* Delete various attributes from profile association
* Written by Alden Caron-O'Neill April 2018
*  Includes:
*  1. /delete-department/:department (POST)
*  2. /delete-degree/:degree/:discipline (POST)
*  3. /delete-specialty/:specialty (POST), /delete-specialty-id/:id (POST)
*  4. /delete-skill/:skill (POST), /delete-skill-id/:id (POST)
*  5. /delete-facility/:facility (POST), /delete-facility-id/:id(POST)
* */

const ProfileRepository = require('./helpers/profileRepository');
module.exports = function (app, sessionChecker) {

    app.post('/delete-department/:department', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            var profileRepository = new ProfileRepository();
            profileRepository.removeProfileDepartment(req.session.profile.id, req.params.department).then(function () {
                res.redirect('/my-profile')
            });
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/delete-degree/:degree/:discipline', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.removeProfileDegree(req.session.profile.id, req.params.degree, req.params.discipline).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/delete-specialty/:specialty', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.removeProfileSpecialty(req.session.profile.id, req.params.specialty).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/delete-specialty-id/:id', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.removeProfileSpecialtyById(req.session.profile.id, req.params.id).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/delete-skill/:skill', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.removeProfileSkill(req.session.profile.id, req.params.skill).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/delete-skill-id/:id', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.removeProfileSkillById(req.session.profile.id, req.params.id).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/delete-facility/:facility', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.removeProfileFacility(req.session.profile.id, req.params.facility).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/delete-facility-id/:id', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.removeProfileFacilityById(req.session.profile.id, req.params.id).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

};