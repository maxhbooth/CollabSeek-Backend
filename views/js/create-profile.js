$(document).ready(function() {
    var current_degrees = 1;
    var current_departments = 1;
    var current_specialties = 1;
    var current_skills = 1;
    var current_facilities = 1;

    // Add select functionality
    var disciplines = [];
    $("#discipline option").each(function()
        {disciplines.push($(this).val());});
    var specialties = [];
    $("#specialty option").each(function()
        {specialties.push($(this).val());});
    var skills = [];
    $("#skill option").each(function()
        {skills.push($(this).val());});
    var departments = [];
    $("#department option").each(function()
        {departments.push($(this).val());});
    var facilities = [];
    $("#facility option").each(function(){
        facilities.push($(this).val());});
    $('#discipline').editableSelect();
    $('#specialty').editableSelect();
    $('#skill').editableSelect();
    $('#department').editableSelect();
    $('#facility').editableSelect();

    // Degree and discipline handling
    $("#add_degree").click(function(e){ //on add input button click
        current_degrees++;
        var $newdegreeset = $('<div class="row" id="degree_set' + current_degrees.toString() + '"></div>');

        // Degree choosing section
        var deg_id = "degree" + current_degrees.toString();
        var $newdegree = $('<div class="form-group col-sm-4"></div>');
        var $degreeselect = $('<select id=' + deg_id +  ' name="degree" class="form-control"></select>');

        $("#degree option").each(function()
        {$degreeselect.append('<option>' + $(this).val() + '</option>');});
        $newdegree.append($degreeselect);

        // Discipline choosing section
        var disc_id = "discipline" + current_degrees.toString();
        var $newdiscipline = $('<div class="form-group col-sm-4"></div>');
        var $disciplineselect = $('<select id=' + disc_id + ' name="discipline" class="form-control"></select>');

        disciplines.forEach(function(discipline)
        {$disciplineselect.append('<option>' + discipline + '</option>');});
        $newdiscipline.append($disciplineselect);

        // Wrap up
        $newdegreeset.append($newdegree);
        $newdegreeset.append($newdiscipline);
        $newdegreeset.append('<button type="button" id="degreedelete" class="btn btn-default">Delete</button>');
        $("#degree_set").append($newdegreeset);
        $('#' + disc_id).editableSelect();
    })

    $(document).on('click', '#degreedelete', function () {
        $(this).parent().remove();
        current_degrees--;
    });

    // Department handling
    $("#add_department").click(function(e){ //on add input button click
        current_departments++;
        var dept_id = "department" + current_departments.toString();
        var $newdept = $('<div class="row" id="dept_set' + current_departments.toString() + '"></div>');
        var $deptselect = $('<select id=' + dept_id + ' name="department" class="form-control"></select>');

        departments.forEach(function(department)
            {$deptselect.append('<option>' + department + '</option>');});
        $newdept.append($('<div class="form-group col-sm-6"></div>').append($deptselect));

        $newdept.append('<button type="button" id="deptdelete" class="btn btn-default">Delete</button>');
        $("#dept_set").append($newdept);
        $('#' + dept_id).editableSelect();
    })

    $(document).on('click', '#deptdelete', function () {
        $(this).parent().remove();
        current_departments--;
    });

    // Specialty handling
    $("#add_specialty").click(function(e){ //on add input button click
        current_specialties++;
        var specialty_id = "specialty" + current_specialties.toString();
        var $newspecialty = $('<div class="row" id="specialty_set' + current_specialties.toString() + '"></div>');
        var $specialtyselect = $('<select id=' + specialty_id + ' name="specialty" class="form-control"></select>');

        specialties.forEach(function(specialty)
            {$specialtyselect.append('<option>' + specialty + '</option>');});
        $newspecialty.append($('<div class="form-group col-sm-6"></div>').append($specialtyselect));

        $newspecialty.append('<button type="button" id="specialtydelete" class="btn btn-default">Delete</button>');
        $("#specialty_set").append($newspecialty);
        $('#' + specialty_id).editableSelect();
    })

    $(document).on('click', '#specialtydelete', function () {
        $(this).parent().remove();
        current_specialties--;
    });

    // Skill handling
    $("#add_skill").click(function(e){ //on add input button click
        current_skills++;
        var skill_id = "skill" + current_skills.toString();
        var $newskill = $('<div class="row" id="skill_set' + current_skills.toString() + '"></div>');
        var $skillselect = $('<select id=' + skill_id + ' name="skill" class="form-control"></select>');

        skills.forEach(function(skill)
        {$skillselect.append('<option>' + skill + '</option>');});
        $newskill.append($('<div class="form-group col-sm-6"></div>').append($skillselect));

        $newskill.append('<button type="button" id="skilldelete" class="btn btn-default">Delete</button>');
        $("#skill_set").append($newskill);
        $('#' + skill_id).editableSelect();
    })

    $(document).on('click', '#skilldelete', function () {
        $(this).parent().remove();
        current_skills--;
    });

    // Facility handling
    $("#add_facility").click(function(e){ //on add input button click
        current_facilities++;
        var facility_id = "skill" + current_facilities.toString();
        var $newfacility = $('<div class="row" id="facility_set' + current_facilities.toString() + '"></div>');
        var $facilityselect = $('<select id=' + facility_id + ' name="facility" class="form-control"></select>');

        facilities.forEach(function(facility)
        {$facilityselect.append('<option>' + facility + '</option>');});
        $newfacility.append($('<div class="form-group col-sm-6"></div>').append($facilityselect));

        $newfacility.append('<button type="button" id="facilitydelete" class="btn btn-default">Delete</button>');
        $("#facility_set").append($newfacility);
        $('#' + facility_id).editableSelect();
    })

    $(document).on('click', '#facilitydelete', function () {
        $(this).parent().remove();
        current_facilities--;
    });
});