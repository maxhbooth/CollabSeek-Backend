var db = require('../../database/database');
var Profile = require('../../models/profile');

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {

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

    app.post('/update-intro', (req, res) => {
        if(req.session.profile && req.cookies.user_sid) {
            profileRepository = new ProfileRepository();
            profileRepository.updateIntro(req.session.profile.id, req.body.intro).then(function(){res.redirect('/my-profile')});
        }else {
            res.redirect('/welcome');
        }
    });

    app.post('/delete-department/:department', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.removeProfileDepartment(req.session.profile.id, req.params.department).then(function(){res.redirect('/my-profile')});
    }else{
        res.redirect('/welcome');
    }
});

    app.post('/add-department', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.addProfileDepartment(req.session.profile.id, req.body.department).then(function(){res.redirect('/my-profile')});
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


    app.post('/add-degree', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            console.log(req.body.degree);
            console.log(req.body.discipline);
            profileRepository = new ProfileRepository();
            profileRepository.addProfileDegree(req.session.profile.id, req.body.degree, req.body.discipline).then(function(){res.redirect('/my-profile')});
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

    app.post('/add-specialty', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.addProfileSpecialty(req.session.profile.id, req.body.specialty).then(function(){res.redirect('/my-profile')});
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

    app.post('/add-skill', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.addProfileSkill(req.session.profile.id, req.body.skill).then(function(){res.redirect('/my-profile')});
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

    app.post('/add-facility', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.addProfileFacility(req.session.profile.id, req.body.facility).then(function(){res.redirect('/my-profile')});
    }else{
        res.redirect('/welcome');
    }
    });




};