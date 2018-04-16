$(document).ready(function() {

    var database_data = (JSON.parse($("#test").text()));
    var sorted = _queryTreeSort({q: database_data});
    var tree_data = _makeTree({q: sorted});

    var $skill_search = $("#skill_search");
    tree_data.forEach(function(skill){
        $skill_search.append('<option>' + skill.text + '</option>');
        skill.children.forEach(function(child){
            var child_text = "&nbsp;&nbsp;&nbsp;&nbsp;" + child.text;
            $skill_search.append('<option>' + child_text + '</option>');
        })
    });

    $('#skill_search').select2();

    var tree = $('#tree').tree({
        primaryKey: 'id',
        dataSource: tree_data,
        cascadeCheck: false,
        checkboxes: true,
        uiLibrary: 'bootstrap',
        border: true,
        selectionType: 'single'
    });

    $('#skill_search').on('select2:select', function (e) {
        tree.unselectAll();
        var text = e.params.data.text;
        text = $.trim(text);
        tree.select(tree.getNodeByText(text));
        if(tree.getDataByText(text).parent_id !== 0){
            tree.expand(tree.getNodeById(tree.getDataByText(text).parent_id));
        }
    });

    var spec_ids = ($("#test2").text());
    if (spec_ids) {
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

    for(i = 0; i < $("#tree > ul > li").children().length; i++){
        $("#tree > ul > li:nth-child(" + i + ") > div > span:nth-child(3)").remove();
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
        if(spec_ids){
            for(var i = 0; i < spec_ints.length; i++) {
                var node_id = parseInt(spec_ints[i], 10);
                tree.check(tree.getNodeById(node_id));
                while(tree.getDataById(node_id).parent_id !== 0){
                    node_id = tree.getDataById(node_id).parent_id;
                    tree.expand(tree.getNodeById(node_id));
                }
            }
        }
    });
    $("#add_skill_category").click(function(e){
       var text =  $("#skill_category").val();
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
            var data = {skill: text, parent:0};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/add-new-skill/'
            });
        }
    });

    $("#add_skill").click(function(e){
        var result = tree.getSelections();
        if(result.length === 0){
            alert("Please select a parent category!");
            e.preventDefault();
            return false;
        }
        else if(result.length > 1){
            alert("Please select only one parent category!");
            e.preventDefault();
            return false;
        }
        else if(tree.getDataById(result[0]).parent_id !== 0){
            alert("Please select a top level category!");
            e.preventDefault();
            return false;
        }
        else if( !$("#skill").val()){
            alert("Please fill in the field name!");
            e.preventDefault();
            return false;
        }
        else if($("#skill").val().includes("/")){
            alert("Please do not use the slash character (/)!");
            e.preventDefault();
            return false;
        }
        else {
            var data = {skill: $("#skill").val(), parent:result[0]};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/add-new-skill/'
            });
        }
    });

    tree.on('checkboxChange', function (e, $node, record, state) {
        if(tree.getDataById(record.id).parent_id === 0){
            //pass
        }
        else if(state === "unchecked"){
            var url = '/delete-skill-id/' + record.id + "/";
            $.ajax({
                type: 'POST',
                url: url
            });
        }
        else if (state ==="checked"){
            $.ajax({
                type: 'POST',
                url: '/add-skill/' + record.id + "/"
            });
        }
    });
});