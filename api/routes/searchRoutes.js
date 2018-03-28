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
        let profileRepository = new ProfileRepository();

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

            let departmentProfiles = [];
            let disciplineProfiles = [];
            let facilityProfiles = [];
            let skillProfiles = [];
            let specialtyProfiles = [];
            let lastNameProfiles = [];
            let firstNameProfiles = [];
            let fullNameProfiles = [];

            var count = 0;
            if (fuzzyDepartments.length == 0){
                getDisciplines();
            }
            for (var i = 0; i < fuzzyDepartments.length; ++i){

                profileRepository.getProfileIDByDepartment(fuzzyDepartments[i].target).then(function(id) {
                    profileRepository.getProfileInformation(id).then(function(profile) {
                        if (profile!=null){
                            departmentProfiles = departmentProfiles.concat(profile);
                        }
                        count++;
                        if (count > fuzzyDepartments.length - 1) getDisciplines();
                    });
                });
            }
            
            function getDisciplines(){
                count = 0;
                if (fuzzyDisciplines.length == 0){
                    getFacilities();
                }
                for (var i = 0; i < fuzzyDisciplines.length; ++i){
                    profileRepository.getProfileIDByDiscipline(fuzzyDisciplines[i].target).then(function(id) {
                        profileRepository.getProfileInformation(id).then(function(profile) {
                            if (profile!=null) {
                                disciplineProfiles = disciplineProfiles.concat(profile);
                            }
                            count++;
                            if (count > fuzzyDisciplines.length - 1) getFacilities();
                        });
                    });
                }
            }

            function getFacilities(){
                count = 0;
                if (fuzzyFacilities.length == 0){
                    getSkills();
                }
                for (var i = 0; i < fuzzyFacilities.length; ++i){
                    profileRepository.getProfileIDByFacility(fuzzyFacilities[i].target).then(function(id) {
                        profileRepository.getProfileInformation(id).then(function(profile) {
                            if (profile!=null) {
                                facilityProfiles = facilityProfiles.concat(profile);
                            }
                            count++;
                            if (count > fuzzyFacilities.length - 1) getSkills();
                        });
                    });
                }
            }

            function getSkills(){
                count = 0;
                if (fuzzySkills.length == 0){
                    getSpecialties();
                }
                for (var i = 0; i < fuzzySkills.length; ++i){
                    profileRepository.getProfileIDBySkill(fuzzySkills[i].target).then(function(id) {
                        profileRepository.getProfileInformation(id).then(function(profile) {
                            if (profile!=null) {
                                skillProfiles = skillProfiles.concat(profile);
                            }
                            count++;
                            if (count > fuzzySkills.length - 1) getSpecialties();
                        });
                    });
                }
            }

            function getSpecialties(){
                count = 0;
                if (fuzzySpecialities.length == 0){
                    getFirstName();
                }
                for (var i = 0; i < fuzzySpecialities.length; ++i){
                    profileRepository.getProfileIDBySpecialty(fuzzySpecialities[i].target).then(function(id) {
                        profileRepository.getProfileInformation(id).then(function(profile) {
                            if (profile!=null) {
                                specialtyProfiles = specialtyProfiles.concat(profile);
                            }
                            count++;
                            if (count > fuzzySpecialities.length - 1) getFirstName();
                        });
                    });
                }
            }

            function getFirstName(){
                profileRepository.getProfileIDByFirstName(query).then(function(id) {
                    if (id.length == 0 || id == null){
                        getLastName();
                    }
                    count = 0;
                    for(var i = 0; i<id.length; ++i) {
                        profileRepository.getProfileInformation(id[i]).then(function (profile) {
                            if (profile != null) {
                                firstNameProfiles = firstNameProfiles.concat(profile);
                            }
                            count++;
                            if (count > id.length - 1) getLastName();

                        });
                    }
                });

            }
            function getLastName(){

                profileRepository.getProfileIDByLastName(query).then(function(id) {
                    if (id.length == 0 || id == null){
                        getFirstAndLast();
                    }
                    count = 0;
                    for(var i = 0; i<id.length; ++i) {
                        profileRepository.getProfileInformation(id[i]).then(function (profile) {
                            if (profile != null) {
                                lastNameProfiles = lastNameProfiles.concat(profile);
                            }
                            count++;
                            if (count > id.length - 1) getFirstAndLast();
                        });
                    }
                });
            }

            function getFirstAndLast(){
                var splitQuery = query.split(' ');
                if (splitQuery.length >= 2) {
                    profileRepository.getProfileIDByFirstName(splitQuery[0]).then(function(id){
                        if (id.length == 0){
                            doneSearch();
                        }
                        profileRepository.getProfileIDByLastName(splitQuery[1]).then(function(id2){
                            if (id2.length == 0){
                                doneSearch();
                            }
                            let searchIds = [];
                            for(var i in id){
                                if (id2.indexOf(id[i]) > -1) {
                                    searchIds.push(id[i]);
                                }
                            }
                            if (searchIds.length >= 1) {
                                count = 0;
                                for (var i = 0; i < searchIds.length; ++i) {
                                    profileRepository.getProfileInformation(searchIds[i]).then(function (profile) {
                                        if (profile != null) {
                                            fullNameProfiles = fullNameProfiles.concat(profile);
                                        }
                                        count++;
                                        if (count > searchIds.length - 1) doneSearch();
                                    });
                                }
                            } else {
                                doneSearch();
                            }
                        });
                    });
                }
                else doneSearch();
            }

            function doneSearch(){
                //res.send(fuzzyDepartments);
                res.render('search.html', {
                        pastQuery: query,
                        firstNameProfiles: firstNameProfiles,
                        lastNameProfiles: lastNameProfiles,
                        fullNameProfiles: fullNameProfiles,
                        departmentProfiles: departmentProfiles,
                        disciplineProfiles: disciplineProfiles,
                        facilityProfiles: facilityProfiles,
                        skillProfiles: skillProfiles,
                        specialtyProfiles: specialtyProfiles
                });
            }

            //Match first and last
            //Match last
            //Match first
            //console.log(searchData);
            //res.send(fuzzyResult);
        });
    });
};