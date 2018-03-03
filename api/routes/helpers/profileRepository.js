const async = require('asyncawait/async');
const await = require('asyncawait/await');
//asyncawait walkthrough at https://www.npmjs.com/package/asyncawait

const profile_degree = require('../../../models/profile_degree');
const profile_department = require('../../../models/profile_department');
const profile_facility = require('../../../models/profile_facility');
const profile_skill = require('../../../models/profile_skill');
const profile_specialty = require('../../../models/profile_specialty');

const AttrRepository = require('./attributeRepository');

var profileRepository = function profileRepository(){

    this.attrRepository = new AttrRepository();

    this.profileDegree = profile_degree;
    this.profileDepartment = profile_department;
    this.profileFacility = profile_facility;
    this.profileSkill = profile_skill;

};

profileRepository.prototype.addProfileDegree = async(function (profileId, degreeName, disciplineName) {

    let degreeId = await(this.attrRepository.getDegreeId(degreeName));
    let disciplineId = await(this.attrRepository.getDegreeId(disciplineName));

    this.profileFacility.create({
        profile_id: profileId,
        degree_id: degreeId,
        discipline_id: disciplineId
    })
        .catch(error => {
            //db errors
            console.log(error);
        });

    return 0;
});

profileRepository.prototype.addProfileDepartment = async(function (profileId, departmentName) {

    let departmentId = await(this.attrRepository.getFacilityId(departmentName));

    this.profileFacility.create({
        profile_id: profileId,
        department_id: departmentId
    })
    .catch(error => {
        //db errors
        console.log(error);
    });

    return 0;
});

profileRepository.prototype.addProfileFacily = async(function (profileId, facilityName) {
    let facilityId = await(this.attrRepository.getFacilityId(facilityName));

    this.profileFacility.create({
        profile_id: profileId,
        facility_id: facilityId
    })
    .catch(error => {
        //db errors
        console.log(error);
    });

    return 0;
});

profileRepository.prototype.addProfileSkill = async(function (profileId, skillName) {
    let skillId = await(this.attrRepository.getSkillId(skillName));

    this.profileSkill.create({
        profile_id: profileId,
        skill_id: skillId
    })
    .catch(error => {
        //db errors
        console.log(error);
    });

    return 0;
});

profileRepository.prototype.getProfileInformation = async(function (){

   return 0;
});


module.exports = profileRepository;