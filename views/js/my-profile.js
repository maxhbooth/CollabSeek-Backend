$(document).ready(function(){
    $("#edit-position").click(function(e){
        var edit = document.getElementById("position-edit");
        var show = document.getElementById("position-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block"
            show.style.display = "none";
        }
    });

    $("#edit-name").click(function(e){
        var edit = document.getElementById("name-edit");
        var show = document.getElementById("name-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block"
            show.style.display = "none";
        }
    });
});
