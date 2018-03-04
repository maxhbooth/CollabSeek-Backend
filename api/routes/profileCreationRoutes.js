
//route for creating profiles

const AttrRepository = require('./helpers/attributeRepository');
const ProfileRepository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {

    app.get('/create-profile', (req, res) => {
       if (req.session.profile && req.cookies.user_sid) {

           //repository

           var attrRepository = new AttrRepository();

           attrRepository.getAll().then(function (models){
               console.log(models);
               res.render('create-profile.html', models);
           });

        } else {
            res.redirect('/login');
        }
    });
    app.post('/create-profile', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {

            console.log("creating profile from post to /create-profile");


            //what should I validate??
            req.checkBody('first', "must enter a first name").notEmpty();
            req.checkBody('last', "must enter a last name").notEmpty();

            const errors = req.validationErrors();

            if(!errors){


                console.log(req.session.profile);


                let profileId = req.session.profile.id;
                let first = req.body.first;
                let last = req.body.last;
                let degreeName = req.body.degree;
                let departmentName = req.body.department;
                let disciplineName = req.body.discipline;
                let positionName = req.body.position;
                let facilityName = req.body.facility || null;
                let skills = req.body.skill;

                var profileRepository = new ProfileRepository();
                profileRepository.updateProfile(profileId, first, last, degreeName, departmentName, disciplineName,
                    positionName, facilityName, skills);

                // profile_department;
                // profile_facility;
                // profile_skill;
                // profile_specialty;

            }
            else{
                console.log(errors);
                console.log('there were errors');
               // res.redirect('/create-profile');
            }

        } else {
            res.redirect('/login');
        }
    });
};