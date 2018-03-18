$(document).ready(function() {
    var current_degrees = 1;
    var current_departments = 1;
    var current_specialties = 1;
    var current_skills = 1;
    var current_facilities = 1;

    // Degree and discipline handling
    $("#add_degree").click(function(e){ //on add input button click
        current_degrees++;
        var $newdegreeset = $('<div class="row" id="degree_set' + current_degrees.toString() + '"></div>');

        // Degree choosing section
        var deg_id = "degree" + current_degrees.toString();
        var $newdegree = $('<div class="form-group col-sm-4"></div>');
        var $degreeselect = $('<select id=' + deg_id + ' name=' + deg_id + ' class="form-control"></select>');

        $("#degree option").each(function()
        {$degreeselect.append('<option>' + $(this).val() + '</option>');});
        $newdegree.append($degreeselect);

        // Discipline choosing section
        var disc_id = "discipline" + current_degrees.toString();
        var $newdiscipline = $('<div class="form-group col-sm-4"></div>');
        var $disciplineselect = $('<select id=' + disc_id + 'name=' + disc_id + ' class="form-control"></select>');

        $("#discipline option").each(function()
        {$disciplineselect.append('<option>' + $(this).val() + '</option>');});
        $newdiscipline.append($disciplineselect);

        // Wrap up
        $newdegreeset.append($newdegree);
        $newdegreeset.append($newdiscipline);
        $newdegreeset.append('<button type="button" id="degreedelete" class="btn btn-default">Delete</button>');
        $("#degree_set").append($newdegreeset);
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
        var $deptselect = $('<select id=' + dept_id + ' name=' + dept_id + ' class="form-control"></select>');

        $("#department option").each(function()
        {$deptselect.append('<option>' + $(this).val() + '</option>');});
        $newdept.append($('<div class="form-group col-sm-6"></div>').append($deptselect));

        $newdept.append('<button type="button" id="deptdelete" class="btn btn-default">Delete</button>');
        $("#dept_set").append($newdept);
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
        var $specialtyselect = $('<select id=' + specialty_id + ' name=' + specialty_id + ' class="form-control"></select>');

        $("#specialty option").each(function()
        {$specialtyselect.append('<option>' + $(this).val() + '</option>');});
        $newspecialty.append($('<div class="form-group col-sm-6"></div>').append($specialtyselect));

        $newspecialty.append('<button type="button" id="specialtydelete" class="btn btn-default">Delete</button>');
        $("#specialty_set").append($newspecialty);
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
        var $skillselect = $('<select id=' + skill_id + ' name=' + skill_id + ' class="form-control"></select>');

        $("#skill option").each(function()
        {$skillselect.append('<option>' + $(this).val() + '</option>');});
        $newskill.append($('<div class="form-group col-sm-6"></div>').append($skillselect));

        $newskill.append('<button type="button" id="skilldelete" class="btn btn-default">Delete</button>');
        $("#skill_set").append($newskill);
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
        var $facilityselect = $('<select id=' + facility_id + ' name=' + facility_id + ' class="form-control"></select>');

        $("#facility option").each(function()
        {$facilityselect.append('<option>' + $(this).val() + '</option>');});
        $newfacility.append($('<div class="form-group col-sm-6"></div>').append($facilityselect));

        $newfacility.append('<button type="button" id="facilitydelete" class="btn btn-default">Delete</button>');
        $("#facility_set").append($newfacility);
    })

    $(document).on('click', '#facilitydelete', function () {
        $(this).parent().remove();
        current_facilities--;
    });
});