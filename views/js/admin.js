$(document).ready(function() {


    $("#add_new_admin").click(function(e){
        var text =  $("#new_admin").val();
        if( !text){
            alert("Please fill in the email!");
            e.preventDefault();
            return false;
        }
        else {
            var data = {email: text};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/add-new-admin/'
            });
        }
        $("#new_admin").val('');

    });

    $("#remove_admin").click(function(e){
        var text =  $("#old_admin").val();
        if( !text){
            alert("Please fill in the email!");
            e.preventDefault();
            return false;
        }
        else {
            var data = {email: text};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/remove-admin/'
            });
        }
        $("#old_admin").val('');

    });

    $("#change_email_req").click(function(e){
        var text =  $("#email_req").val();
        if( !text){
            alert("Please fill in the email requirement!");
            e.preventDefault();
            return false;
        }
        else {
            var data = {email_req: text};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/change-email/'
            });
        }
        $("#email_req").val('');

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