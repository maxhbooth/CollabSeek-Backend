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
});

repository.prototype.getSpecialtiesTree = async(function() {
    var _queryTreeSort = function(options) {
        var cfi, e, i, id, o, pid, rfi, ri, thisid, _i, _j, _len, _len1, _ref, _ref1;
        id = options.id || "id";
        pid = options.parentid || "parentid";
        ri = [];
        rfi = {};
        cfi = {};
        o = [];
        _ref = options.q;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            e = _ref[i];
            rfi[e[id]] = i;
            if (cfi[e[pid]] == null) {
                cfi[e[pid]] = [];
            }
            cfi[e[pid]].push(options.q[i][id]);
        }
        _ref1 = options.q;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            e = _ref1[_j];
            if (rfi[e[pid]] == null) {
                ri.push(e[id]);
            }
        }
        while (ri.length) {
            thisid = ri.splice(0, 1);
            o.push(options.q[rfi[thisid]]);
            if (cfi[thisid] != null) {
                ri = cfi[thisid].concat(ri);
            }
        }
        return o;
    };

    var _makeTree = function(options) {
        var children, e, id, o, pid, temp, _i, _len, _ref;
        id = options.id || "id";
        pid = options.parentid || "parentid";
        children = options.children || "children";
        temp = {};
        o = [];
        _ref = options.q;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            e[children] = [];
            temp[e[id]] = e;
            if (temp[e[pid]] != null) {
                temp[e[pid]][children].push(e);
            } else {
                o.push(e);
            }
        }
        return o;
    };
    let specialties = await(this.specialty.findAll());
    var specialty_format = [];
    for(i = 0; i < specialties.length; i++){
        specialty_format.push({"id": specialties[i].dataValues.id, "parentid": specialties[i].dataValues.parent_id, "text": specialties[i].dataValues.name});
    }
    var sorted = _queryTreeSort({q:specialty_format});
    var tree = _makeTree({q:sorted});
    return tree;
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
// HIERARCHICAL GETTING METHODS
// =====================================================================================================================



module.exports = repository;
