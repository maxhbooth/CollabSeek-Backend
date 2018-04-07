// route for Home-Page

const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');


module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.get('/', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            //let attributeRepository = new AttributeRepository();

            //attributeRepository.getAll().then(function (models) {
               // let searchData = models.departments.concat(models.disciplines, models.facilities, models.skills, models.specialties);
                //res.render('homepage.html', {searchData: JSON.stringify(searchData)});
            res.render('homepage.html');
            //});
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

    app.get('/profile', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {

            let profileRepositiory = new ProfileRepository();

            profileRepositiory.getProfileInformation(req.session.profile.id).then(function (models){
                //console.log(models);
                res.render('profile.html', models);
            });

        } else {
            res.redirect('/login');
        }
    });

    app.get('/profile/:id', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            var id = req.params.id;
            let profileRepositiory = new ProfileRepository();

            profileRepositiory.getProfileInformation(id).then(function (models){
                //console.log(models);
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

    app.get('/create-skill', (req, res) => {
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
                res.render('create-skill.html', models);
            });
        });

    } else {
        res.redirect('/login');
    }
});

    app.get('/create-specialty', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {

        let attrRepository = new AttributeRepository();

        attrRepository.getSpecialtiesTree().then(function (specialty){
            var models = {"specialty": specialty};
            console.log(models);
            res.render('create-specialty.html', models);
        });
        } else {
        res.redirect('/login');
    }
});

    app.get('/create-facility', (req, res) => {
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
                res.render('create-facility.html', models);
            });
        });

    } else {
        res.redirect('/login');
    }
});
};