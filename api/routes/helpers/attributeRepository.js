const async = require('asyncawait/async');
const await = require('asyncawait/await');
//asyncawait walkthrough at https://www.npmjs.com/package/asyncawait
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const degree = require('../../../models/degree');
const department = require('../../../models/department');
const discipline = require('../../../models/discipline');
const facility = require('../../../models/facility');
const position = require('../../../models/position');
const skill = require('../../../models/skill');
const specialty = require('../../../models/specialty');
const degree_discipline = require('../../../models/profile_degree');

const repository = function repository(){

    this.degree = degree;
    this.department = department;
    this.discipline = discipline;
    this.facility = facility;
    this.position = position;
    this.skill = skill;
    this.specialty = specialty;
    this.degree_discipline = degree_discipline;

};

// =====================================================================================================================
// GET ALL FUNCTIONS
// =====================================================================================================================

repository.prototype.getDegrees = async(function () {
    return await(this.degree.findAll()).map(degree => degree.dataValues.name);
});

repository.prototype.getDepartments = async(function () {
    return await(this.department.findAll()).map(department => department.dataValues.name)
});

repository.prototype.getDisciplines = async(function () {
    return await(this.discipline.findAll()).map(discipline => discipline.dataValues.name)
});

repository.prototype.getFacilities = async(function () {
    return await(this.facility.findAll({
            where: {parent_id: {[Op.ne]: 0}}
        }
    )).map(facility => facility.dataValues.name)
});

repository.prototype.getFacilitiesTree = async(function () {
    let facilities = await(this.facility.findAll());
    return facilities;
});

repository.prototype.getPositions = async(function () {
    return await(this.position.findAll()).map(position => position.dataValues.name)
});

repository.prototype.getSkills = async(function () {
    return await(this.skill.findAll({
            where: {parent_id: {[Op.ne]: 0}}
        }
    )).map(skill => skill.dataValues.name)
});

repository.prototype.getSkillsTree = async(function () {
    let skills = await(this.skill.findAll());
    return skills;
});

repository.prototype.getSpecialties = async(function () {
    return await(this.specialty.findAll()).map(specialty => specialty.dataValues.name)
});

repository.prototype.getSpecialtiesTree = async(function() {
       let specialties = await(this.specialty.findAll());
    return specialties;
});

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


// =====================================================================================================================
// GET ID BY NAME FUNCTIONS
// =====================================================================================================================
repository.prototype.getDegreeId = async(function (degreeName) {
    let degree = await(this.degree.findOne({where: {name: degreeName}}));

    if(degree!=null){
        return degree.id;
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

repository.prototype.getDisciplineId = async(function (disciplineName) {
    let discipline =  await(this.discipline.findOne({where: {name: disciplineName}}));

    if(discipline!=null){
        return discipline.id;
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

repository.prototype.getPositionId = async(function (positionName) {
    let position = await(this.position.findOne({where: {name: positionName}}));

    if(position!=null){
        return position.id;
    }
    return null;
});

repository.prototype.getSkillId = async(function (skillName) {
    let skill=await(this.skill.findOne({where: {name: skillName}}));

    if(skill!=null){
        return skill.id;
    }
    return null;
});

repository.prototype.getSpecialtyId = async(function (specialtyName) {
    let specialty = await(this.specialty.findOne({where: {name: specialtyName}}));

    if(specialty!=null){
        return specialty.id;
    }
    return null;
});


// =====================================================================================================================
// GET NAME BY ID FUNCTIONS
// =====================================================================================================================
repository.prototype.getDegreeName = async(function(degreeID) {
    let degree = await(this.degree.findOne({where: {id: degreeID}}));

    if(degree != null){
        return degree.name;
    }
    return null;
});

repository.prototype.getDepartmentName = async(function(departmentID) {
    let department = await(this.department.findOne({where: {id: departmentID}}));

    if(department != null){
        return department.name;
    }
    return null;
});

repository.prototype.getDisciplineName = async(function(disciplineID) {
    let discipline = await(this.discipline.findOne({where: {id: disciplineID}}));

    if(discipline != null){
        return discipline.name;
    }
    return null;
});

repository.prototype.getFacilityName = async(function(facilityID) {
    let facility = await(this.facility.findOne({where: {id: facilityID}}));

    if(facility != null){
        return facility.name;
    }
    return null;
});

repository.prototype.getSkillName = async(function(skillID) {
    let skill = await(this.skill.findOne({where: {id: skillID}}));

    if(skill != null){
        return skill.name;
    }
    return null;
});

repository.prototype.getSpecialtyName = async(function(specialtyID) {
    let specialty = await(this.specialty.findOne({where: {id: specialtyID}}));

    if(specialty != null){
        return specialty.name;
    }
    return null;
});

// =====================================================================================================================
// ADD TO DATABASE
// =====================================================================================================================

repository.prototype.addNewSpecialty = async(function(specialtyName, parentID){
    let specialty = await(this.specialty.create({name: specialtyName, parent_id: parentID}, {plain: true}));
});

repository.prototype.addNewSkill = async(function(skillName, parentID){
    let skill = await(this.skill.create({name: skillName, parent_id: parentID}, {plain: true}));
});

repository.prototype.addNewFacility = async(function(facilityName, parentID){
    let facility = await(this.facility.create({name: facilityName, parent_id: parentID}, {plain: true}));
})

module.exports = repository;
