fuzzysort = require('fuzzysort');

const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');


module.exports = function (app, sessionChecker) {
    app.get('/searchData', (req, res) => {
        let attributeRepository = new AttributeRepository();

        attributeRepository.getAll().then(function (models) {
            //return {degrees, departments, disciplines, facilities, positions, skills, specialties};

            let searchData = models.departments.concat(models.disciplines, models.facilities, models.skills, models.specialties);
            console.log(searchData);
            res.send(searchData);
        });
    });

    app.post('/search', (req, res) => {
        console.dir('body: ' + JSON.stringify(req.body));
        let query = req.body.query;
        let attributeRepository = new AttributeRepository();

        attributeRepository.getAll().then(function (models) {
            //return {degrees, departments, disciplines, facilities, positions, skills, specialties};

            let fuzzyDepartments = fuzzysort.go(query, models.departments);
            let fuzzyDisciplines = fuzzysort.go(query, models.disciplines);
            let fuzzyFacilities = fuzzysort.go(query, models.facilities);
            let fuzzySkills = fuzzysort.go(query, models.skills);
            let fuzzySpecialities = fuzzysort.go(query, models.specialties);

            let fuzzyResult = fuzzyDepartments.concat(fuzzyDisciplines, fuzzyFacilities, fuzzySkills, fuzzySpecialities);

            fuzzyResult.sort(function (a, b) {
                return b.score - a.score;
            }); //sort by least score

            //Match first and last
            //Match last
            //Match first
            //console.log(searchData);
            res.send(fuzzyResult);


        });
    });
};