//route for creating profiles

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {

    app.get('/create-profile', (req, res) => {
       if (req.session.profile && req.cookies.user_sid){

           var attrRepository = new AttrRepository();

           attrRepository.getAll().then(function (models){
               //console.log(models); tbh this is annoying rn
               res.render('create-profile.html', models);
           });

        }else {
            res.redirect('/login');
        }
    });
    app.post('/create-profile', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {

            console.log("creating profile from post to /create-profile");

            //what should I validate??
            req.checkBody('first', "Must enter a first name.").notEmpty();
            req.checkBody('last', "Must enter a last name.").notEmpty();

            const errors = req.validationErrors();

            if(!errors){

                //console.log(req.session.profile);

                let profileId = req.session.profile.id;
                let first = req.body.first;
                let last = req.body.last;
                let degreeName = req.body.degree;
                let departmentName = req.body.department;
                let disciplineName = req.body.discipline;
                let positionName = req.body.position;
                let facilityName = req.body.facility || null;
                let skillName = req.body.skill || null;
                let specialtyName = req.body.specialty || null;

                const profileRepository = new ProfileRepository();
                profileRepository.updateProfile(profileId, first, last, degreeName, departmentName, disciplineName,
                    positionName, facilityName, skillName, specialtyName);
            }
            else{
                console.log(errors);
                console.log('There were errors in profileCreationRoutes.js');
            }
        }else {
            res.redirect('/login');
        }
    });
};