$(document).ready(function() {

    //$('#specialty_search').select2();

    var database_data = (JSON.parse($("#test").text()));
    var sorted = _queryTreeSort({q:database_data});
    var tree_data = _makeTree({q:sorted});
    var tree = $('#tree').tree({
        primaryKey: 'id',
        dataSource: tree_data,
        cascadeCheck: false,
        checkboxes: true,
        uiLibrary: 'bootstrap',
        border: true
    });
    var spec_ids = ($("#test2").text());
    if(spec_ids) {
        var spec_ints = spec_ids.split(",");
        for (var i = 0; i < spec_ints.length; i++) {
            var node_id = parseInt(spec_ints[i], 10);
            tree.check(tree.getNodeById(node_id));
            while (tree.getDataById(node_id).parent_id !== 0) {
                node_id = tree.getDataById(node_id).parent_id;
                tree.expand(tree.getNodeById(node_id));
            }
        }
    }

    $("#toggle_instructions").click(function(e){
        if(document.getElementById("instruction_list").style.display === "none"){
            document.getElementById("instruction_list").style.display = "block";
            $("#plus_button").removeClass();
            $("#plus_button").addClass("glyphicon glyphicon-minus");
        }
        else{
            document.getElementById("instruction_list").style.display = "none";
            $("#plus_button").removeClass();
            $("#plus_button").addClass("glyphicon glyphicon-plus");
        }
    });

    $("#expand_all").click(function(e){
        tree.expandAll();
    });
    $("#collapse_all").click(function(e){
        tree.collapseAll();
    });
    $("#expand_mine").click(function(e){
        var ids = tree.getCheckedNodes();
        if(ids) {
            for (var i = 0; i < ids.length; i++) {
                var node_id = parseInt(ids[i], 10);
                tree.check(tree.getNodeById(node_id));
                while (tree.getDataById(node_id).parent_id !== 0) {
                    node_id = tree.getDataById(node_id).parent_id;
                    tree.expand(tree.getNodeById(node_id));
                }
            }
        }
    });

    $("#add_root_specialty").click(function(e){
        var text =  $("#root_specialty").val();
        if( !text){
            alert("Please fill in the field name!");
            e.preventDefault();
            return false;
        }
        else if(text.includes("/")){
            alert("Please do not use the slash character (/)!");
            e.preventDefault();
            return false;
        }
        else {
            var data = {specialty: text, parent:0};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/add-new-specialty/'
            });
        }
    });

    $("#add_other_specialty").click(function(e){
        var result = tree.getSelections();
        if(result.length === 0){
            alert("Please select a parent category!");
            e.preventDefault();
            return false;
        }
        if(result.length > 1){
            alert("Please select only one parent category!");
            e.preventDefault();
            return false;
        }
        var count = 0;
        var node_id  = result[0];
        while(tree.getDataById(node_id).parent_id !== 0){
            count++;
            node_id = tree.getDataById(node_id).parent_id;
        }
       if(count > 2){
            alert("There are too many levels here! Cannot create another subcategory!");
            e.preventDefault();
            return false;
       }
        else if( !$("#other_specialty").val()){
            alert("Please fill in the field name!")
            e.preventDefault();
            return false;
        }
        else if($("#other_specialty").val().includes("/")){
            alert("Please do not use the slash character (/)!")
            e.preventDefault();
            return false;
        }
        else {
            var data = {specialty: $("#other_specialty").val(), parent:result[0]};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/add-new-specialty/'
            });
        }
    });

    tree.on('checkboxChange', function (e, $node, record, state) {
        var id = record.id;
        if(state === "unchecked"){
            var url = '/delete-specialty-id/' + id + "/";
            $.ajax({
                type: 'POST',
                url: url
            });
            var checked = tree.getCheckedNodes();
            for(var i = 0; i < checked.length; i++){
                if(tree.getDataById(checked[i]).parent_id === id){
                    tree.uncheck(tree.getNodeById(checked[i]));
                }
            }
        }
        else if (state ==="checked"){
            var parent_id = record.parent_id;
            $.ajax({
                type: 'POST',
                url: '/add-specialty/' + id + "/"
            });
            if(parent_id !== 0){
                tree.check(tree.getNodeById(parent_id));
            }
        }
    });
});
