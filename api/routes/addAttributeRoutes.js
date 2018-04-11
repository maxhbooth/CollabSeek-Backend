const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');


module.exports = function (app, sessionChecker) {

    app.get('/create-skill', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            let attrRepository = new AttributeRepository();
            attrRepository.getSkillsTree().then(function (skill) {
                let profileRepository = new ProfileRepository();
                profileRepository.getSkillsIDs(req.session.profile.id).then(function (ids) {
                    profileRepository.getUserConfirmed(req.session.profile.id).then(function (user_confirmed) {
                        var models = {skill: skill, ids: ids, user_confirmed :user_confirmed};
                        res.render('create-skill.html', models);
                    });
                });
            });
        }else{
            res.redirect('/login');
        }
    });

    app.get('/create-specialty', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            let attrRepository = new AttributeRepository();
            attrRepository.getSpecialtiesTree().then(function (specialty) {
                let profileRepository = new ProfileRepository();
                profileRepository.getSpecialtiesIDs(req.session.profile.id).then(function (ids) {
                    profileRepository.getUserConfirmed(req.session.profile.id).then(function (user_confirmed){
                        var models = {specialty: specialty, ids: ids, user_confirmed: user_confirmed};
                        res.render('create-specialty.html', models);
                    });
                });
            });
        }else{
            res.redirect('/login');
        }
    });

    app.get('/create-facility', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            let attrRepository = new AttributeRepository();
            attrRepository.getFacilitiesTree().then(function (facility) {
                let profileRepository = new ProfileRepository();
                profileRepository.getFacilitiesIDs(req.session.profile.id).then(function (ids) {
                    profileRepository.getUserConfirmed(req.session.profile.id).then(function (user_confirmed){
                        var models = {facility: facility, ids: ids, user_confirmed: user_confirmed};
                        res.render('create-facility.html', models);
                    });
                });
            });
        }else{
            res.redirect('/login');
        }
    });

    app.post('/add-new-specialty', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            var attrRepository = new AttributeRepository();
            attrRepository.addNewSpecialty(req.body.specialty, req.body.parent).then(function(){res.redirect('/create-specialty/')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/add-new-skill', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            attrRepository = new AttributeRepository();
            attrRepository.addNewSkill(req.body.skill, req.body.parent).then(function(){res.redirect('/create-specialty')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/add-new-facility', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            attrRepository = new AttributeRepository();
            attrRepository.addNewFacility(req.body.facility, req.body.parent).then(function(){res.redirect('/create-facility')});
        }else{
            res.redirect('/welcome');
        }
    });

};