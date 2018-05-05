/* Attached to sign-up page
 * Adds selecting/searching capabilities
 * Tracks intro length
 * Allows addition of degrees
 */

$(document).ready(function() {
    var current_degrees = 1;

    // Add select functionality
    var disciplines = [];
    $("#discipline option").each(function()
        {disciplines.push($(this).val());});

    function matchStart(params, data) {
        params.term = params.term || '';
        if (data.text.toUpperCase().indexOf(params.term.toUpperCase()) == 0) {
            return data;
        }
        var i = -1;
        while ((i = data.text.indexOf(" ", i+1)) != -1){
            if (data.text.toUpperCase().indexOf(params.term.toUpperCase()) == i+1) {
                return data;
            }
        }
        return false;
    }

    $("#discipline").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select a Discipline",
    });
    $("#department").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select One or More Departments/Institutes",
        allowClear: true
    });
    $("#degree").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select A Degree"
    });
    $("#position").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select A Position"
    });

    // Degree and discipline handling
    $("#add_degree").click(function(e){ //on add input button click
        current_degrees++;
        var $newdegreeset = $('<div class="row" id="degree_set' + current_degrees.toString() + '"></div>');

        // Degree choosing section
        var deg_id = "degree" + current_degrees.toString();
        var $newdegree = $('<div class="form-group col-sm-4"></div>');
        var $degreeselect = $('<select id=' + deg_id +  ' name="degree" class="form-control"></select>');
        $degreeselect.append('<option></option>');
        $("#degree option").each(function()
        {$degreeselect.append('<option>' + $(this).val() + '</option>');});
        $newdegree.append($degreeselect);

        // Discipline choosing section
        var disc_id = "discipline" + current_degrees.toString();
        var $newdiscipline = $('<div class="form-group col-sm-4"></div>');
        var $disciplineselect = $('<select id=' + disc_id + ' name="discipline" class="form-control"></select>');
        $disciplineselect.append('<option></option>');
        disciplines.forEach(function(discipline)
        {$disciplineselect.append('<option>' + discipline + '</option>');});
        $newdiscipline.append($disciplineselect);

        // Wrap up
        $newdegreeset.append($newdegree);
        $newdegreeset.append($newdiscipline);
        $newdegreeset.append('<button type="button" id="degreedelete" class="btn btn-default">Delete</button>');
        $("#degree_set").append($newdegreeset);
        $('#' + disc_id).select2({
            matcher: function(params, data) {
                return matchStart(params, data);
            },
            placeholder: "Select A Discipline"
        });
        $('#' + deg_id).select2({
            matcher: function(params, data) {
                return matchStart(params, data);
            },
            placeholder: "Select A Degree"
        });
    });

    $(document).on('click', '#degreedelete', function () {
        $(this).parent().remove();
        current_degrees--;
    });

    //track number of characters remaining for intro.

    var text_max = 300;
    $('#intro_char_count').html(text_max + ' characters remaining');

    $('#intro').keyup(function() {
        var text_length = $('#intro').val().length;
        var text_remaining = text_max - text_length;

        $('#intro_char_count').html(text_remaining + ' characters remaining');
    });
});