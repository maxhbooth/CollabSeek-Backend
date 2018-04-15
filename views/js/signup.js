$(document).ready(function() {
    var current_degrees = 1;

    // Add select functionality
    var disciplines = [];
    $("#discipline option").each(function()
        {disciplines.push($(this).val());});

    $('#discipline').select2();
    $('#department').select2();
    $('#degree').select2();
    $('#position').select2();

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
        $('#' + disc_id).select2();
    });

    $(document).on('click', '#degreedelete', function () {
        $(this).parent().remove();
        current_degrees--;
    });

});