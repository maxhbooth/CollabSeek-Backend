$(document).ready(function(){
    // function togglePassword(id) {
    //     var x = document.getElementById(id);
    //     if (x.type === "password") {
    //         x.type = "text";
    //     } else {
    //         x.type = "password";
    //     }
    // }
    // document.getElementById("eye3").addEventListener("click", togglePassword("password3"));

    $("#password").password('toggle');

});