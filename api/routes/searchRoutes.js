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
            let positions = req.body.positions;

            if (req.body.discipline != '') {
                let disciplineArray = [];
                disciplineArray = disciplineArray.concat(req.body.disciplines);
                disciplineArray.forEach(function (discipline){
                    if (discipline == ''){
                        return;
                    }
                    let fuzzyDisciplines = fuzzysort.go(discipline, models.disciplines);
                    disciplines = disciplines.concat(fuzzyDisciplines.map(a => a.target));
                });
            }
            if (req.body.position != '') {
                let positionArray = [];
                positionArray = positionArray.concat(req.body.positions);
                positionArray.forEach(function (position){
                    if (position == ''){
                        return;
                    }
                    let fuzzyPositions = fuzzysort.go(position, models.positions);
                    positions = positions.concat(fuzzyPositions.map(a => a.target));
                });
            }
            if (req.body.department != '') {
                let departmentArray = [];
                departmentArray = departmentArray.concat(req.body.departments);
                departmentArray.forEach(function (department){
                    if (department == ''){
                        return;
                    }
                    let fuzzyDepartments = fuzzysort.go(department, models.departments);
                    departments = departments.concat(fuzzyDepartments.map(a => a.target));
                });
            }
            if (req.body.specialty != '') {
                let specialityArray = [];
                specialityArray = specialityArray.concat(req.body.specialties);
                specialityArray.forEach(function (specialty){
                    if (specialty == ''){
                        return;
                    }
                    let fuzzySpecialties = fuzzysort.go(specialty, models.specialties);
                    specialities = specialities.concat(fuzzySpecialties.map(a => a.target));
                });
            }
            if (req.body.skill != '') {
                req.body.skill.forEach(function (skill){
                    if (skill == ''){
                        return;
                    }
                    let fuzzySkills = fuzzysort.go(skill, models.skills);
                    skills = skills.concat(fuzzySkills.map(a => a.target));
                });
            }
            if (req.body.facility != '') {
                let facilityArray = [];
                facilityArray = facilityArray.concat(req.body.facilities);
                facilityArray.forEach(function (facility){
                    if (facility == ''){
                        return;
                    }
                    let fuzzyFacilities = fuzzysort.go(facility, models.facilities);
                    facilities = facilities.concat(fuzzyFacilities.map(a => a.target));
                });
            }

            let response;

            var compoundOP = async(function() {
                if (req.body.first == ''){
                    if (req.body.last == ''){
                        response = await([getDepartmentsIDOnly(departments),getDisciplinesIDOnly(disciplines),getFacilitiesIDOnly(facilities),getSkillsIDOnly(skills),getSpecialtiesIDOnly(specialities), profileRepository.getProfileIDByPosition(positions), [],[], []]);
                    } else {
                        response = await([getDepartmentsIDOnly(departments),getDisciplinesIDOnly(disciplines),getFacilitiesIDOnly(facilities),getSkillsIDOnly(skills),getSpecialtiesIDOnly(specialities), profileRepository.getProfileIDByPosition(positions),[],profileRepository.getProfileIDByLastName(req.body.last), []]);
                    }
                } else {
                    if (req.body.last == ''){
                        response = await([getDepartmentsIDOnly(departments),getDisciplinesIDOnly(disciplines),getFacilitiesIDOnly(facilities),getSkillsIDOnly(skills),getSpecialtiesIDOnly(specialities), profileRepository.getProfileIDByPosition(positions), profileRepository.getProfileIDByFirstName(req.body.first),[], []]);
                    } else {
                        response = await([getDepartmentsIDOnly(departments),getDisciplinesIDOnly(disciplines),getFacilitiesIDOnly(facilities),getSkillsIDOnly(skills),getSpecialtiesIDOnly(specialities), profileRepository.getProfileIDByPosition(positions), [],[], profileRepository.getProfileIDByFirstLastName(req.body.first + " " + req.body.last)]);
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
                    let profileIds = [];
                    if (profiles.isArray) {
                        profileIds = profiles.map(a => a.id);
                    } else
                        profileIds = profiles;
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

    app.post('/search', (req, res) => {
        if (req.session.profile && req.cookies.user_sid) {
            console.dir('body: ' + JSON.stringify(req.body));
            let query = req.body.query;
            let attributeRepository = new AttributeRepository();

            attributeRepository.getAll().then(function (models) {
                //return {degrees, departments, disciplines, facilities, positions, skills, specialties};

                let fuzzyDepartments = fuzzysort.go(query, models.departments, {threshold: -999});
                let fuzzyDisciplines = fuzzysort.go(query, models.disciplines, {threshold: -999});
                let fuzzyFacilities = fuzzysort.go(query, models.facilities, {threshold: -999});
                let fuzzySkills = fuzzysort.go(query, models.skills, {threshold: -999});
                let fuzzySpecialities = fuzzysort.go(query, models.specialties, {threshold: -999});

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
            });
        } else {
            res.redirect('/login');
        }
    });

    let getDepartmentsIDOnly = async(function (departments){
        var count = 0;
        let departmentProfileIds = [];
        if (departments.length == 0){
            return [];
        }
        for (var i = 0; i < departments.length; ++i){
            let id = await(profileRepository.getProfileIDByDepartment(departments[i]));
            if (id !=null){
                departmentProfileIds = departmentProfileIds.concat(id);
            }
            count++;
            if (count > departments.length - 1) return departmentProfileIds;
        }
    });

    let getDisciplinesIDOnly = async(function (disciplines){
        var count = 0;
        let disciplineProfileIds = [];
        if (disciplines.length == 0){
            return [];
        }
        for (var i = 0; i < disciplines.length; ++i){
            let id = await(profileRepository.getProfileIDByDiscipline(disciplines[i]));
            if (id !=null){
                disciplineProfileIds = disciplineProfileIds.concat(id);
            }
            count++;
            if (count > disciplines.length - 1) return disciplineProfileIds;
        }
    });

    let getFacilitiesIDOnly = async(function (facilities){
        var count = 0;
        let facilityProfileIds = [];
        if (facilities.length == 0){
            return [];
        }
        for (var i = 0; i < facilities.length; ++i){
            let id = await(profileRepository.getProfileIDByFacility(facilities[i]));
            if (id !=null){
                facilityProfileIds = facilityProfileIds.concat(id);
            }
            count++;
            if (count > facilities.length - 1) return facilityProfileIds;
        }
    });

    let getSkillsIDOnly = async(function (skills){
        var count = 0;
        let skillProfileIds = [];
        if (skills.length == 0){
            return [];
        }
        for (var i = 0; i < skills.length; ++i){
            let id = await(profileRepository.getProfileIDBySkill(skills[i]));
            if (id !=null){
                skillProfileIds = skillProfileIds.concat(id);
            }
            count++;
            if (count > skills.length - 1) return skillProfileIds;
        }
    });

    let getSpecialtiesIDOnly = async(function (specialties){
        var count = 0;
        let specialtyProfileIds = [];
        if (specialties.length == 0){
            return [];
        }
        for (var i = 0; i < specialties.length; ++i){
            let id = await(profileRepository.getProfileIDBySpecialty(specialties[i]));
            if (id !=null){
                specialtyProfileIds = specialtyProfileIds.concat(id);
            }
            count++;
            if (count > specialties.length - 1) return specialtyProfileIds;
        }
    });

    let getDepartments = async(function (departments){
        var count = 0;
        let departmentProfiles = [];
        if (departments.length == 0){
            return [];
        }
        for (var i = 0; i < departments.length; ++i){
            let id = await(profileRepository.getProfileIDByDepartment(departments[i]));
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null){
                profile.forEach(function(singleProfile) {
                   singleProfile.matchedQuery = departments[i];
                });
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
            let id = await(profileRepository.getProfileIDByDiscipline(disciplines[i]));
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                profile.forEach(function(singleProfile) {
                    singleProfile.matchedQuery = disciplines[i];
                });
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
            let id = await(profileRepository.getProfileIDByFacility(facilities[i]));
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                profile.forEach(function(singleProfile) {
                    singleProfile.matchedQuery = facilities[i];
                });
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
                profile.forEach(function(singleProfile) {
                    singleProfile.matchedQuery = skills[i];
                });
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
            let id = await(profileRepository.getProfileIDBySpecialty(specialties[i]));
            let profile = await(profileRepository.getProfileInformation(id));
            if (profile!=null) {
                profile.forEach(function(singleProfile) {
                    singleProfile.matchedQuery = specialties[i];
                });
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
                profile.forEach(function(singleProfile) {
                    singleProfile.matchedQuery = positions[i];
                });
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