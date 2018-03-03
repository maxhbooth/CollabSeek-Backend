var async = require('asyncawait/async');
var await = require('asyncawait/await');

const degree = require('../../../models/degree');
const department = require('../../../models/department');
const discipline = require('../../../models/discipline');
const facility = require('../../../models/facility');
const position = require('../../../models/position');
const skill = require('../../../models/skill');
const specialty = require('../../../models/specialty');

const profile_degree = require('../../../models/profile_degree');
const profile_department = require('../../../models/profile_department');
const profile_facility = require('../../../models/profile_facility');
const profile_skill = require('../../../models/profile_skill');
const profile_specialty = require('../../../models/profile_specialty');


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


// repository.prototype.getSpecialties = async(function () {
//     return await(this.degree.findAll()).map(degree => degree.dataValues.name)
// });


module.exports = repository;
