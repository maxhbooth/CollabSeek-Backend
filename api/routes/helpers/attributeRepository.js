const async = require('asyncawait/async');
const await = require('asyncawait/await');
//asyncawait walkthrough at https://www.npmjs.com/package/asyncawait

const degree = require('../../../models/degree');
const department = require('../../../models/department');
const discipline = require('../../../models/discipline');
const facility = require('../../../models/facility');
const position = require('../../../models/position');
const skill = require('../../../models/skill');
const specialty = require('../../../models/specialty');

const repository = function repository(){

    this.degree = degree;
    this.department = department;
    this.discipline = discipline;
    this.facility = facility;
    this.position = position;
    this.skill = skill;
    this.specialty = specialty;

};

repository.prototype.getDegrees = async(function () {
    return await(this.degree.findAll()).map(degree => degree.dataValues.name)
});

repository.prototype.getDepartments = async(function () {
    return await(this.department.findAll()).map(department => department.dataValues.name)
});

repository.prototype.getDisciplines = async(function () {
    return await(this.discipline.findAll()).map(discipline => discipline.dataValues.name)
});

repository.prototype.getFacilities = async(function () {
    return await(this.facility.findAll()).map(facility => facility.dataValues.name)
});

repository.prototype.getPositions = async(function () {
    return await(this.position.findAll()).map(position => position.dataValues.name)
});

repository.prototype.getSkills = async(function () {
    return await(this.skill.findAll()).map(skill => skill.dataValues.name)
});

repository.prototype.getSpecialties = async(function () {
    return await(this.specialty.findAll()).map(specialty => specialty.dataValues.name)
})

repository.prototype.getAll = async(function () {
    let degrees = await(this.getDegrees());
    let departments = await(this.getDepartments());
    let disciplines = await(this.getDisciplines());
    let facilities = await(this.getFacilities());
    let positions = await(this.getPositions());
    let skills = await(this.getSkills());
    let specialties = await(this.getSpecialties());

    return {degrees, departments, disciplines, facilities, positions, skills, specialties};
});



repository.prototype.getSkillId = async(function (skillName) {
    let skill=await(this.skill.findOne({where: {name: skillName}}));

    if(skill!=null){
        return skill.id;
    }
    return null;
});

repository.prototype.getFacilityId = async(function (facilityName) {
    let facility = await(this.facility.findOne({where: {name: facilityName}}));

    if(facility!=null){
        return facility.id;
    }
    return null;
});

repository.prototype.getDepartmentId = async(function (departmentName) {
    let department =  await(this.department.findOne({where: {name: departmentName}}));

    if(department!=null){
        return department.id;
    }
    return null;
});

repository.prototype.getDegreeId = async(function (degreeName) {
    let degree = await(this.degree.findOne({where: {name: degreeName}}));

    if(degree!=null){
        return degree.id;
    }
    return null;
});

repository.prototype.getDisciplineId = async(function (disciplineName) {
    let discipline =  await(this.discipline.findOne({where: {name: disciplineName}}));

    if(discipline!=null){
        return discipline.id;
    }
    return null;
});

repository.prototype.getPositionId = async(function (positionName) {
    let position = await(this.position.findOne({where: {name: positionName}}))

    if(position!=null){
        return position.id;
    }
    return null;
});

repository.prototype.getSpecialtyId = async(function (specialtyName) {
    let specialty = await(this.position.findOne({where: {name: specialtyName}}))

    if(specialty!=null){
        return specialty.id;
    }
    return null;
});


module.exports = repository;
