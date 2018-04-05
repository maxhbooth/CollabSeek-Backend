fuzzysort = require('fuzzysort');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const ProfileRepository = require('./helpers/profileRepository');
const AttributeRepository = require('./helpers/attributeRepository');


module.exports = function (app, sessionChecker) {
    let profileRepository = new ProfileRepository();

    app.get('/advanced-search', (req,res) => {
        if (req.session.profile && req.cookies.user_sid) {
            var attrRepository = new AttributeRepository();

            attrRepository.getAll().then(function (models) {
                console.log(models);
                models.degrees.sort();
                models.departments.sort();
                models.disciplines.sort();
                models.facilities.sort();
                models.positions.sort();
                models.skills.sort();
                models.specialties.sort();
                models.degrees.unshift("");
                models.departments.unshift("");
                models.disciplines.unshift("");
                models.facilities.unshift("");
                models.positions.unshift("");
                models.skills.unshift("");
                models.specialties.unshift("");
                res.render('advanced-search.html', models);
            });
        } else {
            res.redirect('/login');
        }
    });

    app.post('/advanced-search', (req,res) => {
        let attributeRepository = new AttributeRepository();

        attributeRepository.getAll().then(function (models) {

            let disciplines = [];
            let departments = [];
            let specialities = [];
            let skills = [];
            let facilities = [];
            let positions = [];

            if (req.body.discipline != '') {
                let fuzzyDisciplines = fuzzysort.go(req.body.discipline, models.disciplines);
                disciplines = fuzzyDisciplines.map(a => a.target);
            }
            if (req.body.position != '') {
                positions = positions.concat(req.body.position);
            }
            if (req.body.department != '') {
                let fuzzyDepartments = fuzzysort.go(req.body.department, models.departments);
                departments = fuzzyDepartments.map(a => a.target);
            }
            if (req.body.specialty != '') {
                let fuzzySpecialities = fuzzysort.go(req.body.specialty, models.specialties);
                specialities = fuzzySpecialities.map(a => a.target);
            }
            if (req.body.skill != '') {
                let fuzzySkills = fuzzysort.go(req.body.skill, models.skills);
                skills = fuzzySkills.map(a => a.target);
            }
            if (req.body.facility != '') {
                let fuzzyFacilities = fuzzysort.go(req.body.facility, models.facilities);
                facilities = fuzzyFacilities.map(a => a.target);
            }

            let response;

            var compoundOP = async(function() {
                if (req.body.first == ''){
                    if (req.body.last == ''){
                        response = await([profileRepository.getProfileIDByDepartment(departments),profileRepository.getProfileIDByDiscipline(disciplines),profileRepository.getProfileIDByFacility(facilities),profileRepository.getProfileIDBySkill(skills),profileRepository.getProfileIDBySpecialty(specialities), profileRepository.getProfileIDByPosition(positions), [],[], []]);
                    } else {
                        response = await([profileRepository.getProfileIDByDepartment(departments),profileRepository.getProfileIDByDiscipline(disciplines),profileRepository.getProfileIDByFacility(facilities),profileRepository.getProfileIDBySkill(skills),profileRepository.getProfileIDBySpecialty(specialities), profileRepository.getProfileIDByPosition(positions),[],profileRepository.getProfileIDByLastName(req.body.last), []]);
                    }
                } else {
                    if (req.body.last == ''){
                        response = await([profileRepository.getProfileIDByDepartment(departments),profileRepository.getProfileIDByDiscipline(disciplines),profileRepository.getProfileIDByFacility(facilities),profileRepository.getProfileIDBySkill(skills),profileRepository.getProfileIDBySpecialty(specialities), profileRepository.getProfileIDByPosition(positions), profileRepository.getProfileIDByFirstName(req.body.first),[], []]);
                    } else {
                        response = await([profileRepository.getProfileIDByDepartment(departments),profileRepository.getProfileIDByDiscipline(disciplines),profileRepository.getProfileIDByFacility(facilities),profileRepository.getProfileIDBySkill(skills),profileRepository.getProfileIDBySpecialty(specialities), profileRepository.getProfileIDByPosition(positions), [],[], profileRepository.getProfileIDByFirstLastName(req.body.first + " " + req.body.last)]);
                    }
                }
                let concatResponse = [];
                concatResponse = concatResponse.concat(response[0],response[1],response[2],response[3],response[4],response[5],response[6],response[7],response[8]);
                return concatResponse;
            });

            compoundOP().then(function (result) {
                result = filter_array(result);
                result = sortByFrequency(result);
                profileRepository.getProfileInformation(result).then(function (profiles) {
                    let orderedProfileArray = [];
                    let profileIds = profiles.map(a => a.id);
                    for (let i = 0; i<result.length; i++){
                        let endPlace = result.indexOf(profileIds[i]);
                        orderedProfileArray[endPlace] = profiles[i]
                    }
                    res.render('search.html', {
                        byClosestMatchProfiles: orderedProfileArray
                    });
                });
            });
        });
    });

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
        if (req.session.profile && req.cookies.user_sid) {
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

                let departments = fuzzyDepartments.map(a => a.target);
                let disciplines = fuzzyDisciplines.map(a => a.target);
                let facilities = fuzzyFacilities.map(a => a.target);
                let skills = fuzzySkills.map(a => a.target);
                let specialities = fuzzySpecialities.map(a => a.target);

                var compoundOP = async(function() {
                    let response = await([getDepartments(departments),getDisciplines(disciplines),getFacilities(facilities),getSkills(skills),getSpecialties(specialities), getFirstName(query),getLastName(query), getFirstAndLast(query)]);
                    return response;
                });

                compoundOP().then(function (result) {
                    console.log(result);
                    res.render('search.html', {
                        pastQuery: query,
                        departmentProfiles: result[0],
                        disciplineProfiles: result[1],
                        facilityProfiles: result[2],
                        skillProfiles: result[3],
                        specialtyProfiles: result[4],
                        firstNameProfiles: result[5],
                        lastNameProfiles: result[6],
                        fullNameProfiles: result[7]
                    });
                });

                // Promise.all(promises).then(function() {
                //
                // });

            });
        } else {
            res.redirect('/login');
        }
    });

    let getDepartments = async(function (departments){
        var count = 0;
        let departmentProfiles = [];
        if (departments.length == 0){
            return [];
        }
        for (var i = 0; i < departments.length; ++i){
            let id = await(profileRepository.getProfileIDByDepartment(departments[i]))
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null){
                departmentProfiles = departmentProfiles.concat(profile);
            }
            count++;
            if (count > departments.length - 1) return departmentProfiles;
        }
    });

    let getDisciplines = async(function (disciplines){
        var count = 0;
        let disciplineProfiles = [];

        if (disciplines.length == 0){
            return [];
        }
        for (var i = 0; i < disciplines.length; ++i){
            let id = await(profileRepository.getProfileIDByDiscipline(disciplines[i]))
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                disciplineProfiles = disciplineProfiles.concat(profile);
            }
            count++;
            if (count > disciplines.length - 1) return disciplineProfiles;
        }
    });

    let getFacilities = async(function (facilities){
        var count = 0;
        let facilityProfiles = [];

        if (facilities.length == 0){
            return [];
        }
        for (var i = 0; i < facilities.length; ++i){
            let id = await(profileRepository.getProfileIDByFacility(facilities[i]))
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                facilityProfiles = facilityProfiles.concat(profile);
            }
            count++;
            if (count > facilities.length - 1) return facilityProfiles;
        }
    });

    let getSkills = async(function (skills){
        var count = 0;
        let skillProfiles = [];

        if (skills.length == 0){
            return [];
        }
        for (var i = 0; i < skills.length; ++i){
            let id = await(profileRepository.getProfileIDBySkill(skills[i]))
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                skillProfiles = skillProfiles.concat(profile);
            }
            count++;
            if (count > skills.length - 1) return skillProfiles;
        }
    });

    let getSpecialties = async(function (specialties){
        var count = 0;
        let specialtyProfiles = [];

        if (specialties.length == 0){
            return [];
        }
        for (var i = 0; i < specialties.length; ++i){
            let id = await(profileRepository.getProfileIDBySpecialty(specialties[i]))
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                specialtyProfiles = specialtyProfiles.concat(profile);
            }
            count++;
            if (count > specialties.length - 1) return specialtyProfiles;
        }
    });

    let getPositions = async(function (positions){
        var count = 0;
        let positionProfiles = [];

        if (positions.length == 0){
            return [];
        }
        for (var i = 0; i < positions.length; ++i){
            let id = await(profileRepository.getProfileIDByPosition(positions[i]));
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                positionProfiles = positionProfiles.concat(profile);
            }
            count++;
            if (count > positions.length - 1) return positionProfiles;
        }
    });

    let getFirstName = async(function (query){
        let firstNameProfiles = [];
        let id = await(profileRepository.getProfileIDByFirstName(query));
        if (id.length == 0 || id == null){
            return [];
        }
        let count = 0;
        for(var i = 0; i<id.length; ++i) {
            let profile = await(profileRepository.getProfileInformation(id[i]));
            if (profile != null) {
                firstNameProfiles = firstNameProfiles.concat(profile);
            }
            count++;
            if (count > id.length - 1) return firstNameProfiles;
        }
    });

    let getLastName = async (function (query){
        let lastNameProfiles = [];
        let id = await(profileRepository.getProfileIDByLastName(query));
        if (id.length == 0 || id == null){
            return [];
        }
        let count = 0;
        for(var i = 0; i<id.length; ++i) {
            let profile = await(profileRepository.getProfileInformation(id[i]));
            if (profile != null) {
                lastNameProfiles = lastNameProfiles.concat(profile);
            }
            count++;
            if (count > id.length - 1) return lastNameProfiles;
        }
    });

    let getFirstAndLast = async(function (query){
        let fullNameProfiles = [];
        let id = await(profileRepository.getProfileIDByFirstLastName(query));
        if (id.length == 0){
            return [];
        }
        if (id.length >= 1) {
            let count = 0;
            for (var i = 0; i < id.length; ++i) {
                let profile = await(profileRepository.getProfileInformation(id[i]));
                if (profile != null) {
                    fullNameProfiles = fullNameProfiles.concat(profile);
                }
                count++;
                if (count > id.length - 1) return fullNameProfiles;
            }
        } else {
            return [];
        }
    });

    function sortByFrequency(array) {
        var frequency = {};

        array.forEach(function(value) { frequency[value] = 0; });

        var uniques = array.filter(function(value) {
            return ++frequency[value] == 1;
        });

        return uniques.sort(function(a, b) {
            return frequency[b] - frequency[a];
        });
    }

    function filter_array(test_array) {
        let index = -1;
        const arr_length = test_array ? test_array.length : 0;
        let resIndex = -1;
        const result = [];

        while (++index < arr_length) {
            const value = test_array[index];

            if (value) {
                result[++resIndex] = value;
            }
        }

        return result;
    }
};