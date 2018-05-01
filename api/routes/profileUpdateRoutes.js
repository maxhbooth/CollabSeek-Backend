/* Update various profile pieces, end points for editing on my-profile
* Written by Alden Caron-O'Neill April 2018
*  Includes:
*  1. /update-info (POST)
*  2. /update-position (POST)
*  3. /update-name (POST)
*  4. /update-intro (POST)
*  5. /add-department (POST)
*  6. /add-degree (POST)
*  7. /add-specialty (POST), /add-specialty/:id (POST)
*  8. /add-skill (POST), /add-skill/:id (POST)
*  9. .add-facility (POST), /add-facility/:id (POST)
* */

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