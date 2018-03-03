// route for Home-Page

const degree = require('../../models/degree');
const department = require('../../models/department');
const discipline = require('../../models/discipline');
const facility = require('../../models/facility');
const position = require('../../models/position');
const skill = require('../../models/skill');
const specialty = require('../../models/specialty');

const profile_degree = require('../../models/profile_degree');
const profile_department = require('../../models/profile_department');
const profile_facility = require('../../models/profile_facility');
const profile_skill = require('../../models/profile_skill');
const profile_specialty = require('../../models/profile_specialty');


module.exports = function (app, sessionChecker) {

    app.get('/create-profile', (req, res) => {
       if (req.session.profile && req.cookies.user_sid) {
            degree.findAll().then(function (degrees) {
                department.findAll().then(function (departments) {
                    discipline.findAll().then(function (disciplines){
                        facility.findAll().then(function (facilities){
                            position.findAll().then(function (positions){
                                skill.findAll().then(function(skills){

                                    console.log(req.session.profile);
                                    res.render('create-profile.html', {
                                        degrees: degrees.map(degree => degree.dataValues.name),
                                        departments: departments.map(department => department.dataValues.name),
                                        disciplines: disciplines.map(discipline => discipline.dataValues.name),
                                        facilities: facilities.map(facility => facility.dataValues.name),
                                        positions: positions.map(position => position.dataValues.name),
                                        skills: skills.map(skill => skill.dataValues.name)
                                    });
                                });
                            });
                        });
                    });
                });
            });
        } else {
            res.redirect('/login');
        }
    });
    app.post('/create-profile', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {





        } else {
            res.redirect('/login');
        }
    });
};