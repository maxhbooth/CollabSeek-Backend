$(document).ready(function(){

    $('#skill').select2();
    $('#specialty').select2();
    $('#facility').select2();
    $('#department').select2();
    $('#discipline').select2();
    $('#degree').select2();

    $("#edit-departments1").click(function(e){
        document.getElementById("departments-edit").style.display = "block";
        document.getElementById("departments-show").style.display = "none";
    });

    $("#edit-departments2").click(function(e){
        document.getElementById("departments-edit").style.display = "none";
        document.getElementById("departments-show").style.display = "block";
    });

    $("#edit-degrees1").click(function(e){
        document.getElementById("degrees-edit").style.display = "block";
        document.getElementById("degrees-show").style.display = "none";
    });

    $("#edit-degrees2").click(function(e){
        document.getElementById("degrees-edit").style.display = "none";
        document.getElementById("degrees-show").style.display = "block";
    });

    $("#edit-position").click(function(e){
        var edit = document.getElementById("position-edit");
        var show = document.getElementById("position-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block";
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

    $("#edit-skills").click(function(e){
        var edit = document.getElementById("skills-edit");
        var show = document.getElementById("skills-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block"
            show.style.display = "none";
        }
    });

    $("#edit-specialties").click(function(e){
        var edit = document.getElementById("specialties-edit");
        var show = document.getElementById("specialties-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block"
            show.style.display = "none";
        }
    });

    $("#edit-facilities").click(function(e){
        var edit = document.getElementById("facilities-edit");
        var show = document.getElementById("facilities-show");
        if (show.style.display === "none") {
            show.style.display = "block";
            edit.style.display = "none";
        } else {
            edit.style.display = "block"
            show.style.display = "none";
        }
    });
});
