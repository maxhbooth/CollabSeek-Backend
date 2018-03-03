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
    //this.specialty = specialty;

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

repository.prototype.getAll = async(function () {
    let degrees = await(this.getDegrees());
    let departments = await(this.getDepartments());
    let disciplines = await(this.getDisciplines());
    let facilities = await(this.getFacilities());
    let positions = await(this.getPositions());
    let skills = await(this.getSkills());

    return {degrees, departments, disciplines, facilities, positions, skills};
});

repository.prototype.getSkillId = async(function (skillName) {
    return await(this.skill.findOne({where: {name: skillName}})).id;
});

repository.prototype.getFacilityId = async(function (facilityName) {
    return await(this.facility.findOne({where: {name: facilityName}})).id;
});

repository.prototype.getDepartmentId = async(function (departmentName) {
    return await(this.department.findOne({where: {name: departmentName}})).id;
});

repository.prototype.getDegreeId = async(function (degreeName) {
    return await(this.degree.findOne({where: {name: degreeName}})).id;
});

repository.prototype.getDisciplineId = async(function (disciplineName) {
    return await(this.discipline.findOne({where: {name: disciplineName}})).id;
});


module.exports = repository;
