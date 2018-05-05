// Matches on all the parameters

$(document).ready(function() {
    // Add select functionality


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
        allowClear: true
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
        placeholder: "Select A Degree",
        allowClear: true
    });
    $("#position").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select A Position",
        allowClear: true
    });
    $("#skill").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select One or More Skills",
        allowClear: true
    });
    $("#specialty").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select One or More Specialties",
        allowClear: true
    });
    $("#facility").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        },
        placeholder: "Select One or More Facilities",
        allowClear: true
    });
});
