const async = require('asyncawait/async');
const await = require('asyncawait/await');
//asyncawait walkthrough at https://www.npmjs.com/package/asyncawait

const profile = require('../../../models/profile');
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
    this.profile = profile;

};

profileRepository.prototype.addProfileDegree = async(function (profileId, degreeName, disciplineName) {

    let degreeId = await(this.attrRepository.getDegreeId(degreeName));
    let disciplineId = await(this.attrRepository.getDisciplineId(disciplineName));

    if(degreeId!=null && disciplineId!= null){
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
                console.log(error);
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
                console.log(error);
            });
    }

    return 0;
});

profileRepository.prototype.addProfileFacily = async(function (profileId, facilityName) {
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
            console.log(error);
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
                console.log(error);
            });
    }


    return 0;
});

profileRepository.prototype.updateProfile = async(function
    (profileId, first, last, degreeName, departmentName, disciplineName,
     positionName, facilityName, skills) {

    this.addProfileDegree(profileId, degreeName, disciplineName);
    this.addProfileDepartment(profileId, departmentName);
    this.addProfileFacily(profileId, facilityName);


    //need to work with multiple skills
    this.addProfileSkill(profileId, skills);



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
        console.log(error);
    });

    return 0;
});

profileRepository.prototype.getProfileInformation = async(function (profileId){

    let profile = await(this.profile.findOne({where: {id:profileId}}));

    if(profile==null){
        return null;
    }

    let skills = await(this.profileSkill.findAll({where: {profile_id:profileId}}))
        .forEach(function(skill){if(skill==null){return null} return await(this.attrRepository.skill.findOne({where:{id: skill.skill_id}}))
        });
    //let departments = await(this.profileDepartment.findAll({where: {profile_id:profileId}}));

   return {username: profile.username, first: profile.first_name, last: profile.last_name, email: profile.email, position: profile.position,
            skills: skills, department: departments};
});


module.exports = profileRepository;