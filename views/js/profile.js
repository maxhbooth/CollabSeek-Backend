// Add tree layout to specialties section

$(document).ready(function() {

    var database_data = (JSON.parse($("#test").text()));
    var sorted = _queryTreeSort({q: database_data});
    var tree_data = _makeTree({q: sorted});

    var tree = $('#specialty_tree').tree({
        primaryKey: 'id',
        dataSource: tree_data,
        uiLibrary: 'bootstrap'
    });
    tree.expandAll();
    for(var i = 0; i < database_data.length; i++){
        tree.getNodeById(database_data[i].id).css('background-color', '#f5f5f5');
    }

});