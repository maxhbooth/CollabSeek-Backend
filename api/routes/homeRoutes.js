// route for Home-Page

const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');


module.exports = function (app, sessionChecker) {
    // set up the routes themselves

    app.get('/', (req, res) => {
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
                console.log(models);
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
                console.log(models);
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

        attrRepository.getAll().then(function (models){
            //return {degrees, departments, disciplines, facilities, positions, skills, specialties};

            let searchData = models.departments.concat(models.disciplines, models.facilities, models.skills, models.specialties);
            console.log(searchData);
            res.send(searchData);
            res.render('signup.html', models);
        });

        profileRepositiory.getProfileInformation(req.session.profile.id).then(function (models){
            console.log(models);
            attrRepository.getAll().then(function (attributes){

            })
            res.render('my-profile.html', models);
        });

    }else {
        res.redirect('/login');
    }
});
};