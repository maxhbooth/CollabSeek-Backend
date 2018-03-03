
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

            //what should I validate??
            req.checkBody('first', "must enter a first name").notEmpty();
            req.checkBody('last', "must enter a last name").notEmpty();

            const errors = req.validationErrors();

            if(!errors){

                var profileRepository = new ProfileRepository();





                // profile_department;
                // profile_facility;
                // profile_skill;
                // profile_specialty;

            }

        } else {
            res.redirect('/login');
        }
    });
};