//
// var substringMatcher = function(strs) {
//     return function findMatches(q, cb) {
//         var matches, substringRegex;
//
//         // an array that will be populated with substring matches
//         matches = [];
//
//         // regex used to determine if a string contains the substring `q`
//         substrRegex = new RegExp(q, 'i');
//
//         // iterate through the pool of strings and for any string that
//         // contains the substring `q`, add it to the `matches` array
//         $.each(strs, function(i, str) {
//             if (substrRegex.test(str)) {
//                 matches.push(str);
//             }
//         });
//
//         cb(matches);
//     };
// };

// var searchData = new Bloodhound({
//     local:newSearchData,
//     datumTokenizer: Bloodhound.tokenizers.whitespace,
//     queryTokenizer: Bloodhound.tokenizers.whitespace,
//     initialize: false
//     // url points to a json file that contains an array of country names, see
//     // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
// });
//
//
// searchData.clearPrefetchCache();
// var result = searchData.initialize();

// passing in `null` for the `options` arguments will result in the default
// options being used
// $('#prefetch .typeahead').typeahead(null, {
//     name: 'newSearchData',
//     source: substringMatcher(newSearchData)
// });

// $(document).ready(function(){
//     $('#prefetch').autocomplete({
//         hints: newSearchData
//     });
// });

//$.post('/search', $('#searchBar').serialize());

$("form").submit(function (e) {
    console.log("hello");
    var url = "/search"; // the script where you handle the form input.

    $.ajax({
        type: "POST",
        url: url,
        data: $("#searchBar").serialize(), // serializes the form's elements.
        success: function (data) {
            alert(data); // show response from the php script.
        }
    });

    e.preventDefault(); // avoid to execute the actual submit of the form.
});