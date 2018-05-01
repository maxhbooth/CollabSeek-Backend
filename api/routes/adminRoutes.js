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
            profileRepository = new ProfileRepository();
            profileRepository.getAdmins().then(function(admins){
                models = {admins: admins};
                console.log(models);
                res.render('/admin', models);
            });
        }
        else{
            res.redirect("/logout");
        }
    });

    app.post('/add-new-admin', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            profileRepository = new ProfileRepository();
            profileRepository.addAdmin(req.body.email).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });

    app.post('/remove-admin', (req, res) => {
        if(req.session.profile && req.cookies.user_sid && req.session.profile.admin){
            profileRepository = new ProfileRepository();
            profileRepository.removeAdmin(req.body.email).then(function(){res.redirect('/admin')});
        }else{
            res.redirect('/welcome');
        }
    });


};