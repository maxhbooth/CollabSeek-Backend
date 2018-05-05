// Add functionality to search button

$("#searchButton").click(function(){
    $(".error").hide();
    var hasError = false;
    var searchReg = /^[a-zA-Z0-9- ']{2,}$/;
    var searchVal = $("#searchBar").val();
    if(searchVal == '') {
        $(".instructions").after('<div class="error">Please enter a search term.</div>');
        $(".error");
        hasError = true;
    } else if(!searchReg.test(searchVal)) {
        $(".instructions").after('<div class="error">Please enter a valid search term - alphanumeric characters, spaces, dashes, and apostrophes, only.</div>');
        $(".error");
        hasError = true;
    }
    if(hasError == true) {return false;} else {
        return true;
    }
});