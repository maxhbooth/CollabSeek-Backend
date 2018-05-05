

$(document).ready(function() {
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
        }
    });

    $("#discipline_del").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        }
    });

    $("#department").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        }
    });

    $("#department_del").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        }
    });

    $("#degree").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        }
    });

    $("#degree_del").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        }
    });

    $("#position").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        }
    });

    $("#position_del").select2({
        matcher: function(params, data) {
            return matchStart(params, data);
        }
    });

    $("#change_about").click(function(e){
        var text1 =  $("#about1").val();
        var text2 =  $("#about2").val();
        var text3 =  $("#about3").val();
        var text4 =  $("#about4").val();

        var data = {about1: text1, about2: text2, about3: text3, about4: text4};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/change-about/'
        });


    });



});