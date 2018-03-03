// route for Home-Page

//asyncawait walkthrough at https://www.npmjs.com/package/asyncawait
var async = require('asyncawait/async');
var await = require('asyncawait/await');

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

const Repository = require('./helpers/profileRepository');

module.exports = function (app, sessionChecker) {

    app.get('/create-profile', (req, res) => {
       if (req.session.profile && req.cookies.user_sid) {

           //repository

           var repository = new Repository();

           repository.getAll().then(function (models){
               console.log(models);
               res.render('create-profile.html', models);
           })

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

            var profile_id = req.session.profile.id;
            var degree_id = degree.findOne({where: {name: req.body.degree}});

            if(!errors){
                profile_degree.create({
                    profile_id: req.session.profile.id,
                    degree_id: req.body.degree,
                    discipline_id: req.body.password
                }).catch(error => {
                    //database error
                    console.log(error);
                });
                // profile_department;
                // profile_facility;
                // profile_skill;
                // profile_specialty;


            }else{


            }

        } else {
            res.redirect('/login');
        }
    });
};