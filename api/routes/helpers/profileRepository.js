const async = require('asyncawait/async');
const await = require('asyncawait/await');
//asyncawait walkthrough at https://www.npmjs.com/package/asyncawait

const Sequelize = require('sequelize');

const profile = require('../../../models/profile');
const profile_degree = require('../../../models/profile_degree');
const profile_department = require('../../../models/profile_department');
const profile_facility = require('../../../models/profile_facility');
const profile_skill = require('../../../models/profile_skill');
const profile_specialty = require('../../../models/profile_specialty');

const AttrRepository = require('./attributeRepository');

var profileRepository = function profileRepository(){

    this.attrRepository = new AttrRepository();

    this.profileSpecialty = profile_specialty;
    this.profileDegree = profile_degree;
    this.profileDepartment = profile_department;
    this.profileFacility = profile_facility;
    this.profileSkill = profile_skill;
    this.profile = profile;


    //create many-to-many relation between profile and skill.
    this.profile.belongsToMany(
        this.attrRepository.specialty, {through: {
                model: this.profileSpecialty,
                unique: true
            },
            foreignKey: 'profile_id',
            constraints: false});

    this.attrRepository.specialty.belongsToMany(
        this.profile, {through: {
                model: this.profileSpecialty,
                unique: true
            },
            foreignKey: 'specialty_id',
            constraints: false});

    this.profile.belongsToMany(
        this.attrRepository.skill, {through: {
                model: this.profileSkill,
                unique: true
            },
            foreignKey: 'profile_id',
            constraints: false});

    this.attrRepository.skill.belongsToMany(
        this.profile, {through: {
                model: this.profileSkill,
                unique: true
            },
            foreignKey: 'skill_id',
        constraints: false});

    this.profile.belongsToMany(
        this.attrRepository.department, {through: {
                model: this.profileDepartment,
                unique: true
            },
            foreignKey: 'profile_id',
            constraints: false});

    this.attrRepository.department.belongsToMany(
        this.profile, {through: {
                model: this.profileDepartment,
                unique: true
            },
            foreignKey: 'department_id',
            constraints: false});

    // this.profile.belongsToMany(
    //     this.attrRepository.degree, {through: {
    //             model: this.profileDegree,
    //             unique: true
    //         },
    //         foreignKey: 'profile_id',
    //         constraints: false});
    //
    // this.attrRepository.degree.belongsToMany(
    //     this.profile, {through: {
    //             model: this.profileDegree,
    //             unique: true
    //         },
    //         foreignKey: 'degree_id',
    //         constraints: false});
    //
    // this.profile.belongsToMany(
    //     this.attrRepository.discipline, {through: {
    //             model: this.profileDegree,
    //             unique: true
    //         },
    //         foreignKey: 'profile_id',
    //         constraints: false});
    //
    // this.attrRepository.discipline.belongsToMany(
    //     this.profile, {through: {
    //             model: this.profileDegree,
    //             unique: true
    //         },
    //         foreignKey: 'discipline_id',
    //         constraints: false});
};


profileRepository.prototype.addProfileDegree = async(function (profileId, degreeName, disciplineName) {
        let degreeId = await(this.attrRepository.getDegreeId(degreeName));
        let disciplineId = await(this.attrRepository.getDisciplineId(disciplineName));
        if(degreeId!=null && disciplineId!= null) {
                this.profileDegree.findOrCreate({
                    where: {
                        profile_id: profileId,
                        degree_id: degreeId,
                        discipline_id: disciplineId
                    },
                    defaults: {
                        profile_id: profileId,
                        degree_id: degreeId,
                        discipline_id: disciplineId
                    }
                    })
                    .catch(error => {
                    //db errors
                    //console.log(error);
                    });
        }
    return 0;
});

profileRepository.prototype.addProfileDepartment = async(function (profileId, departmentName) {

    let departmentId = await(this.attrRepository.getDepartmentId(departmentName));

    if(departmentId != null){
        this.profileDepartment.findOrCreate({
            where: {
                profile_id: profileId,
                department_id: departmentId
            },
            default: {
                profile_id: profileId,
                department_id: departmentId
            }
        })
            .catch(error => {
                //db errors
                //console.log(error);
            });
    }

    return 0;
});

profileRepository.prototype.addProfileSpecialty = async(function (profileId, specialtyName) {
    let specialtyId = await(this.attrRepository.getSpecialtyId(specialtyName));

    if(specialtyId !=null){
        this.profileSpecialty.findOrCreate({
            where: {
                profile_id: profileId,
                specialty_id: specialtyId
            },
            default: {
                profile_id: profileId,
                specialty_id: specialtyId
            }
        })
            .catch(error => {
            //db errors
            //console.log(error);
    });
    }

    return 0;
});

profileRepository.prototype.addProfileFacility = async(function (profileId, facilityName) {
    let facilityId = await(this.attrRepository.getFacilityId(facilityName));

    if(facilityId !=null){
        this.profileFacility.findOrCreate({
            where: {
                profile_id: profileId,
                facility_id: facilityId
            },
            default: {
                profile_id: profileId,
                facility_id: facilityId
            }
        })
        .catch(error => {
            //db errors
            //console.log(error);
        });
    }

    return 0;
});

profileRepository.prototype.addProfileSkill = async(function (profileId, skillName) {
    let skillId = await(this.attrRepository.getSkillId(skillName));

    if(skillId != null){
        this.profileSkill.findOrCreate({
            where: {
                profile_id: profileId,
                skill_id: skillId
            },
            default: {
                profile_id: profileId,
                skill_id: skillId
            }
        })
            .catch(error => {
                //db errors
                //console.log(error);
            });
    }

    return 0;
});

profileRepository.prototype.addImage = async(function(profileId, imagePath){

    this.profile.update(
        {imagepath : imagePath},
        {where : {id : profileId}}
    );

    return 0;
});

//not using right now.
profileRepository.prototype.updateProfile = async(function
    (profileId, first, last, degreeName, departmentName, disciplineName,
     positionName, facilityName, skills, specialtyName) {
    var i;
    if(Array.isArray(degreeName) && Array.isArray(disciplineName)){
        var min = Math.min(degreeName.length, disciplineName.length);
        for(i = 0; i < min; i++){
            this.addProfileDegree(profileId, degreeName[i], disciplineName[i]);
        }
    }
    else if(Array.isArray(degreeName) && !Array.isArray(disciplineName)){
        this.addProfileDegree(profileId, degreeName[0], disciplineName);
    }
    else if(!Array.isArray(degreeName) && Array.isArray(disciplineName)){
        this.addProfileDegree(profileId, degreeName, disciplineName[0]);
    }
    else{
        this.addProfileDegree(profileId, degreeName, disciplineName);
    }
    if(Array.isArray(departmentName)){
        for(i = 0; i < departmentName.length; i++){
            this.addProfileDepartment(profileId, departmentName[i]);
        }
    }
    else{
        this.addProfileDepartment(profileId, departmentName);
    }
    if(Array.isArray(facilityName)){
        for(i = 0; i < facilityName.length; i++){
            this.addProfileFacility(profileId, facilityName[i]);
        }
    }
    else{
        this.addProfileFacility(profileId, facilityName);
    }
    if(Array.isArray(specialtyName)){
        for(i = 0; i < specialtyName.length; i++){
            this.addProfileSpecialty(profileId, specialtyName[i]);
        }
    }
    else {
        this.addProfileSpecialty(profileId, specialtyName);
    }

    if(Array.isArray(skills)){
        for(i = 0; i < skills.length; i++){
            this.addProfileSkill(profileId, skills[i]);
        }
    }
    else{
        this.addProfileSkill(profileId, skills);
    }

    let positionId = await(this.attrRepository.getPositionId(positionName));

    this.profile.update({
        first_name: first,
        last_name: last,
        position: positionId
    }, {
        where: {id: profileId},
        returning: true,
        plain: true})
    .catch(error => {
        //db errors
        //console.log(error);
    });

    return 0;
});

profileRepository.prototype.createProfile = async(function
    (first, last, degreeName, departmentName, disciplineName,
     positionName, facilityName, skillName, specialtyName, username, email, password) {

    let positionId = await(this.attrRepository.getPositionId(positionName));

    console.log("this is the password:" + password);

    let profile = await(this.profile.create({
        first_name: first,
        last_name: last,
        position: positionId,
        username: username,
        email: email,
        password: password
    }, {
        returning: true,
        plain: true})
        .catch(errors => {
            //db errors
            //console.log(errors);
            return errors;
        }));
    let profileId = profile.id;
    var i;
    if(Array.isArray(degreeName) && Array.isArray(disciplineName)){
        var min = Math.min(degreeName.length, disciplineName.length);
        for(i = 0; i < min; i++){
            this.addProfileDegree(profileId, degreeName[i], disciplineName[i]);
        }
    }
    else if(Array.isArray(degreeName) && !Array.isArray(disciplineName)){
        this.addProfileDegree(profileId, degreeName[0], disciplineName);
    }
    else if(!Array.isArray(degreeName) && Array.isArray(disciplineName)){
        this.addProfileDegree(profileId, degreeName, disciplineName[0]);
    }
    else{
        this.addProfileDegree(profileId, degreeName, disciplineName);
    }
    if(Array.isArray(departmentName)){
        for(i = 0; i < departmentName.length; i++){
            this.addProfileDepartment(profileId, departmentName[i]);
        }
    }
    else{
        this.addProfileDepartment(profileId, departmentName);
    }
    if(Array.isArray(facilityName)){
        for(i = 0; i < facilityName.length; i++){
            this.addProfileFacility(profileId, facilityName[i]);
        }
    }
    else{
        this.addProfileFacility(profileId, facilityName);
    }
    if(Array.isArray(specialtyName)){
        for(i = 0; i < specialtyName.length; i++){
            this.addProfileSpecialty(profileId, specialtyName[i]);
        }
    }
    else {
        this.addProfileSpecialty(profileId, specialtyName);
    }

    if(Array.isArray(skillName)){
        for(i = 0; i < skillName.length; i++){
            this.addProfileSkill(profileId, skillName[i]);
        }
    }
    else{
        this.addProfileSkill(profileId, skillName);
    }

    this.profile.update({
        first_name: first,
        last_name: last,
        position: positionId
    }, {
        where: {id: profileId},
        returning: true,
        plain: true})
        .catch(error => {
        //db errors
        //console.log(error);
});
    return profile;
});

profileRepository.prototype.getProfileInformation = async(function (profileId){

    let profile = await(this.profile.findOne({where: {id:profileId}}));

    if(profile==null){
        return null;
    }

    let positionId = profile.position;

    let position = await(this.attrRepository.position.findOne({where:{id:positionId}}))

    let degrees_set = await(this.attrRepository.degree_discipline.findAll({
        where: {profile_id: profileId}
    }));

    var disciplines = [];
    var degrees = [];
    for(var i = 0; i < degrees_set.length; i++){
        let disc = await(this.attrRepository.getDisciplineName(degrees_set[i].dataValues.discipline_id));
        let deg = await(this.attrRepository.getDegreeName(degrees_set[i].dataValues.degree_id));
        disciplines[i] = disc;
        degrees[i] = deg;
    }

    let skills = await(this.attrRepository.skill.findAll({
        include: [{
            model: this.profile,
            where: {id: profileId},
            through: {}
        }]
    }));

    let departments = await(this.attrRepository.department.findAll({
        include: [{
            model: this.profile,
            where: {id: profileId},
            through: {}
        }]
    }));

    let specialties = await(this.attrRepository.specialty.findAll({
        include: [{
            model: this.profile,
            where: {id: profileId},
            through: {}
        }]
    }));




   return {username: profile.username, first: profile.first_name, last: profile.last_name, email: profile.email, position: position.name,
            imagePath: profile.imagepath, skills: skills, departments: departments, degrees: degrees, specialties: specialties,
                disciplines: disciplines};
});


/* getProfileIDBy___ functions added 3/22 by AC
    returns array of ints that correspond to profile IDs
    did basic testing here and console appears to be logging proper ids based on info in database
*/

profileRepository.prototype.getProfileIDByDepartment = async(function(departmentName){
    let deptID = await(this.attrRepository.getDepartmentId(departmentName));

    if(deptID!=null){
        let profiles = await(this.profileDepartment.findAll({
            where: {department_id: deptID}
        }));
        var profile_ids = [];
        for(var i = 0; i < profiles.length; i++){
            profile_ids.push(profiles[i].dataValues.profile_id);
        };
        //console.log(profile_ids);
        return profile_ids;
    }
    return null;
});

profileRepository.prototype.getProfileIDBySpecialty = async(function(specialtyName){
    let specialtyID = await(this.attrRepository.getSpecialtyId(specialtyName));

    if(specialtyID!=null){
        let profiles = await(this.profileSpecialty.findAll({
            where: {specialty_id: specialtyID}
        }));
        var profile_ids = [];
        for(var i = 0; i < profiles.length; i++){
            profile_ids.push(profiles[i].dataValues.profile_id);
        };
        //console.log(profile_ids);
        return profile_ids;
    }
    return null;
});

profileRepository.prototype.getProfileIDBySkill = async(function(skillName){
    let skillID = await(this.attrRepository.getSkillId(skillName));

    if(skillID!=null){
        let profiles = await(this.profileSkill.findAll({
            where: {skill_id: skillID}
        }));
        var profile_ids = [];
        for(var i = 0; i < profiles.length; i++){
            profile_ids.push(profiles[i].dataValues.profile_id);
        };
        //console.log(profile_ids);
        return profile_ids;
    }
    return null;
});

profileRepository.prototype.getProfileIDByFacility = async(function(facilityName){
    let facilityID = await(this.attrRepository.getFacilityId(facilityName));

    if(facilityID!=null){
        let profiles = await(this.profileFacility.findAll({
            where: {facility_id: facilityID}
        }));
        var profile_ids = [];
        for(var i = 0; i < profiles.length; i++){
            profile_ids.push(profiles[i].dataValues.profile_id);
        };
        //console.log(profile_ids);
        return profile_ids;
    }
    return null;
});

profileRepository.prototype.getProfileIDByDiscipline = async(function(disciplineName){
    let disciplineID = await(this.attrRepository.getDisciplineId(disciplineName));

    if(disciplineID!=null){
        let profiles = await(this.degree_discipline.findAll({
            where: {discipline_id: disciplineID}
        }));
        var profile_ids = [];
        for(var i = 0; i < profiles.length; i++){
            profile_ids.push(profiles[i].dataValues.profile_id);
        };
        //console.log(profile_ids);
        return profile_ids;
    }
    return null;
});



module.exports = profileRepository;