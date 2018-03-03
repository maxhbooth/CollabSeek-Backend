// route for Home-Page

const degree = require('../../models/degree');
const department = require('../../models/department');
const discipline = require('../../models/discipline');
const facility = require('../../models/facility');
const position = require('../../models/position');
const skill = require('../../models/skill');



module.exports = function (app, sessionChecker) {

    // set up the routes themselves
    // app.get('/', sessionChecker, (req, res) => {
    //     res.redirect('/login')
    // });

    app.get('/create-profile', (req, res) => {
       // if (req.session.profile && req.cookies.user_sid) {
            //res.sendFile('/views/UserProfileCreate.html', {root: './'});

            degree.findAll().then(function (degrees) {
                department.findAll().then(function (degrees) {
                    discipline.findAll().then(function (disciplines){
                        facility.findAll().then(function (facilities){
                            position.findAll().then(function (positions){
                                skill.findAll().then(function(skills){

                                    res.render('UserProfileCreate.html', {
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

       // }
        // } else {
        //     res.redirect('/login');
        // }
    });
};