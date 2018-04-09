const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');


module.exports = function (app, sessionChecker) {

    app.get('/create-skill', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            let attrRepository = new AttributeRepository();
            attrRepository.getSkillsTree().then(function (skill) {
                let profileRepository = new ProfileRepository();
                profileRepository.getSkillsIDs(req.session.profile.id).then(function (ids) {
                    var models = {skill: skill, ids: ids};
                    res.render('create-skill.html', models);
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
                    var models = {specialty: specialty, ids: ids};
                    res.render('create-specialty.html', models);
                });
            });
        }else{
            res.redirect('/login');
        }
    });

    app.get('/create-facility', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            let profileRepositiory = new ProfileRepository();
            let attrRepository = new AttributeRepository();

            profileRepositiory.getProfileInformation(req.session.profile.id).then(function (models) {
                attrRepository.getAll().then(function (attributes) {
                    models.all_departments = attributes.departments;
                    models.all_positions = attributes.positions;
                    models.all_skills = attributes.skills;
                    models.all_specialties = attributes.specialties;
                    models.all_facilities = attributes.facilities;
                    models.all_degrees = attributes.degrees;
                    models.all_disciplines = attributes.disciplines;
                    res.render('create-facility.html', models);
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

};