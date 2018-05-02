/* Welcome, homepage, profile directions
* Written by Mac Watrous, Max Booth, Alden Caron-O'Neill April 2018.
*/

// route for Home-Page
var Profile = require('../../models/profile');
const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');

module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.get('/admin', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var profileRepository = new ProfileRepository();
            var attrRepo = new AttributeRepository();
            profileRepository.getAdmins().then(function(admins){
                attrRepo.getEmailRequirement().then(function(email){
                    attrRepo.getAboutSection().then(function(about){
                        profileRepository.getAllUsers().then(function(users){
                            attrRepo.getAll().then(function (attributes) {
                                var models = {admins: admins, email: email, about: about, users: users};
                                models.departments = attributes.departments;
                                models.positions = attributes.positions;
                                models.skills = attributes.skills;
                                models.specialties = attributes.specialties;
                                models.facilities = attributes.facilities;
                                models.degrees = attributes.degrees;
                                models.disciplines = attributes.disciplines;
                                console.log(models);
                                res.render('admin.html', models);
                            });
                        });
                    });
                });
            });
        }
        else{
            res.redirect("/logout");
        }
    });

    app.post('/add-new-admin', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var profileRepository = new ProfileRepository();
            profileRepository.addAdmin(req.body.email).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/remove-admin', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var profileRepository = new ProfileRepository();
            profileRepository.removeAdmin(req.body.email).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/change-email', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var attrRepo = new AttributeRepository();
            attrRepo.changeEmailRequirement(req.body.email_req).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/change-about', (req,res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var attrRepo = new AttributeRepository();
            attrRepo.changeAbout(req.body.about1, req.body.about2, req.body.about3, req.body.about4).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/add-new-position', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var attrRepository = new AttributeRepository();
            attrRepository.addNewPosition(req.body.position).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/add-new-department', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var attrRepository = new AttributeRepository();
            attrRepository.addNewDepartment(req.body.department).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/add-new-degree', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var attrRepository = new AttributeRepository();
            attrRepository.addNewDegree(req.body.degree).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/add-new-discipline', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            var attrRepository = new AttributeRepository();
            attrRepository.addNewDiscipline(req.body.discipline).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    })

    app.post('/delete-profile/:id', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            profileRepository = new ProfileRepository();
            profileRepository.deleteProfile(req.params.id).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });


};