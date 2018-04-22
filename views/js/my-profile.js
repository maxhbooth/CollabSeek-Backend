$(document).ready(function(){
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


    $("#edit-degrees1").click(function(e){
        document.getElementById("degrees-edit").style.display = "block";
        document.getElementById("degrees-show").style.display = "none";
    });

    $("#edit-degrees2").click(function(e){
        document.getElementById("degrees-edit").style.display = "none";
        document.getElementById("degrees-show").style.display = "block";
    });

    $("#edit-info").click(function(e){
        var edit = document.getElementById("info-edit");
        var show = document.getElementById("info-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block";
            show.style.display = "none";
        }
    });

    $("#edit-intro").click(function(e){
        var edit = document.getElementById("intro-edit");
        var show = document.getElementById("intro-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block"
            show.style.display = "none";
        }
    });
});
