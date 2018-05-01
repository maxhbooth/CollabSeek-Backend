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



});