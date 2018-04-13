var db = require('../../database/database');
var Profile = require('../../models/profile');

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {

    app.post('/update-info', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            profileRepository = new ProfileRepository();
            profileRepository.updateInfo(req.session.profile.id, req.body.position, req.body.first, req.body.last,
                req.body.pronouns, req.body.website, req.body.phone, req.body.availability).then(function(){
                res.redirect('/my-profile');
        });
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
        }else{
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

    app.post('/add-department', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
        profileRepository = new ProfileRepository();
        profileRepository.addProfileDepartment(req.session.profile.id, req.body.department).then(function(){res.redirect('/my-profile')});
    }else{
        res.redirect('/welcome');
    }
});

    app.post('/add-degree', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.addProfileDegree(req.session.profile.id, req.body.degree, req.body.discipline).then(function(){res.redirect('/my-profile')});
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

    app.post('/add-specialty/:id', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.addProfileSpecialtyById(req.session.profile.id, req.params.id).then(function(){
                res.redirect('/create_specialty')
            });
        }else{
            res.redirect('/welcome');
        }
});

    app.post('/add-skill', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            var profileRepository = new ProfileRepository();
            profileRepository.addProfileSkill(req.session.profile.id, req.body.skill).then(function(){res.redirect('/my-profile')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/add-skill/:id', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.addProfileSkillById(req.session.profile.id, req.params.id).then(function(){res.redirect('/create_skill')});
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

    app.post('/add-facility/:id', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            profileRepository = new ProfileRepository();
            profileRepository.addProfileFacilityById(req.session.profile.id, req.params.id).then(function(){res.redirect('/create_specialty')});
        }else{
            res.redirect('/welcome');
        }
    });




};