$(document).ready(function() {
    var max_degrees = 10;
    var current_degrees = 1;

    $("#add_degree").click(function(e){ //on add input button click
        if(current_degrees >= max_degrees){
            $("#add_degree").remove();
        }
        current_degrees++;
        var $newdegreeset = $('<div class="row" id="degset' + current_degrees.toString() + '"></div>');

        // Degree choosing section
        var $newdegree = $('<div class="form-group col-sm-4"></div>');
        $newdegree.append('<label for=' + deg_id + '>Degree:</label>');
        var $degreeselect = $('<select id=' + deg_id + ' name=' + deg_id + ' class="form-control"></select>');

        var deg_id = "degree" + current_degrees.toString();
        $("#degree option").each(function()
        {
            $degreeselect.append('<option>' + $(this).val() + '</option>');
        });
        $newdegree.append($degreeselect);

        // Discipline choosing section
        var $newdiscipline = $('<div class="form-group col-sm-4"></div>');
        $newdiscipline.append('<label for=' + disc_id + '>Discipline:</label>');
        var $disciplineselect = $('<select id=' + disc_id + 'name=' + disc_id + ' class="form-control"></select>');

        var disc_id = "discipline" + current_degrees.toString();
        $("#discipline option").each(function()
        {
            $disciplineselect.append('<option>' + $(this).val() + '</option>');
        });
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
});