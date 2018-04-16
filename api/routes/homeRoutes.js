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



    app.get('/verify/:hidden_token',(req,res)=>{
        if (req.session.profile && req.cookies.user_sid) {
            var hidden_token = req.params.hidden_token;
            console.log(hidden_token);
            // next find account that matches hidden token
            Profile.findOne({where:{'hidden_token': hidden_token}}).then(function(user) {
                if (!user) {
                    console.log("No user found");
                    res.redirect('/login');
                    return;
                }
                //change the user's properties if pass
                console.log(user.email);
                console.log(user.confirmed_user);
                user.confirmed_user = true;
                user.hidden_token = "";
                user.save().then(res.redirect('/my-profile'));
            });

        }
    });
    app.get('/changepassword/:password_token',(req,res)=>{

            var password_token = req.params.password_token;
            console.log(password_token);

            Profile.findOne({where:{'password_token':password_token}}).then(function(user)
            {
                if (!user) {
                    console.log("No user found");
                    res.redirect('/login');
                    return;
                }
                console.log(password_token);
               res.render('changepassword.html');


            });
        });
};