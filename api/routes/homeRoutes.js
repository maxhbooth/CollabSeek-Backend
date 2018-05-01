/* Welcome, homepage, profile directions
* Written by Mac Watrous, Max Booth, Alden Caron-O'Neill April 2018.
*  Includes:
*  1. / (GET)
*  2. /welcome (GET)
*  3. /profile/:id (GET)
*  4. /my-profile (GET)
*  5. /about (GET)
*  6. /delete-profile (GET & POST)
* */

// route for Home-Page
var Profile = require('../../models/profile');
const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.get('/', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            res.render('homepage.html');
        } else {
            res.sendFile('/views/welcome.html', {root: './'});
        }
    });

    app.get('/welcome', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            let attributeRepository = new AttributeRepository();

            attributeRepository.getAll().then(function (models) {
                let searchData = models.departments.concat(models.disciplines, models.facilities, models.skills, models.specialties);
                res.render('homepage.html', {searchData: JSON.stringify(searchData)});
            });
        } else {
            res.sendFile('/views/welcome.html', {root: './'});
        }
    });

    app.get('/profile/:id', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            var id = req.params.id;
            let profileRepository = new ProfileRepository();

            profileRepository.getProfileInformation(id).then(function (models){
                if(models != null){
                    res.render('profile.html', models);
                }
                else{
                    res.render('404.html');
                }
            });

    }else {
        res.redirect('/login');
    }
});

    app.get('/my-profile', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {

        let profileRepositiory = new ProfileRepository();
        let attrRepository = new AttributeRepository();

        profileRepositiory.getProfileInformation(req.session.profile.id).then(function (models){
            attrRepository.getAll().then(function (attributes){
                models.all_departments = attributes.departments;
                models.all_positions = attributes.positions;
                models.all_skills = attributes.skills;
                models.all_specialties = attributes.specialties;
                models.all_facilities = attributes.facilities;
                models.all_degrees = attributes.degrees;
                models.all_disciplines = attributes.disciplines;
                res.render('my-profile.html', models);
            });
        });

        } else {
            res.redirect('/login');
        }
    });

    app.get('/about', (req, res) => {
       res.render('about.html');
    });

    app.get('/delete-profile', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            res.render('delete-profile.html');
        }
    });
    app.post('/delete-profile', (req, res) => {
        if(req.session.profile && req.cookies.user_sid){
            let profileRepository = new ProfileRepository();
            profileRepository.deleteProfile(req.session.profile.id).then(function() {
                res.redirect('/logout');
            });
        }
    });

};