$(document).ready(function() {
    var _queryTreeSort = function(options) {
        var cfi, e, i, id, o, pid, rfi, ri, thisid, _i, _j, _len, _len1, _ref, _ref1;
        id = options.id || "id";
        pid = options.parent_id || "parent_id";
        ri = [];
        rfi = {};
        cfi = {};
        o = [];
        _ref = options.q;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            e = _ref[i];
            rfi[e[id]] = i;
            if (cfi[e[pid]] == null) {
                cfi[e[pid]] = [];
            }
            cfi[e[pid]].push(options.q[i][id]);
        }
        _ref1 = options.q;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            e = _ref1[_j];
            if (rfi[e[pid]] == null) {
                ri.push(e[id]);
            }
        }
        while (ri.length) {
            thisid = ri.splice(0, 1);
            o.push(options.q[rfi[thisid]]);
            if (cfi[thisid] != null) {
                ri = cfi[thisid].concat(ri);
            }
        }
        return o;
    };

    var _makeTree = function(options) {
        var children, e, id, o, pid, temp, _i, _len, _ref;
        id = options.id || "id";
        pid = options.parent_id || "parent_id";
        children = options.children || "children";
        temp = {};
        o = [];
        _ref = options.q;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            e[children] = [];
            temp[e[id]] = e;
            if (temp[e[pid]] != null) {
                temp[e[pid]][children].push(e);
                temp[e[pid]][children].sort(function(a, b){
                    if(a.text < b.text) return -1;
                    if(a.text > b.text) return 1;
                    return 0;
                });
            } else {
                o.push(e);
            }
        }
        return (o.sort(function(a, b){
            if(a.text < b.text) return -1;
            if(a.text > b.text) return 1;
            return 0;
        }));
    };
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
    var spec_ints = spec_ids.split(",");
    for(var i = 0; i < spec_ints.length; i++) {
        var node_id = parseInt(spec_ints[i], 10);
        tree.check(tree.getNodeById(node_id));
        while(tree.getDataById(node_id).parent_id !== 0){
            node_id = tree.getDataById(node_id).parent_id;
            tree.expand(tree.getNodeById(node_id));
        }
    }

    $("#expand_all").click(function(e){
        tree.expandAll();
    });
    $("#collapse_all").click(function(e){
        tree.collapseAll();
    });
    $("#expand_mine").click(function(e){
        for(var i = 0; i < spec_ints.length; i++) {
            var node_id = parseInt(spec_ints[i], 10);
            tree.check(tree.getNodeById(node_id));
            while(tree.getDataById(node_id).parent_id !== 0){
                node_id = tree.getDataById(node_id).parent_id;
                tree.expand(tree.getNodeById(node_id));
            }
        }
    });

    $("#add_other_specialty").click(function(e){
        var result = tree.getSelections();
        if(result.length === 0){
            alert("Please select a parent category!");
        }
        else if(result.length > 1){
            alert("Please select only one parent category!")
        }
        // else if( !$("other_specialty").val()){
        //     alert("Please fill in the field name!")
        // }
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
        if(state === "unchecked"){
            var url = '/delete-specialty/' + record.text + "/";
            $.ajax({
                type: 'POST',
                url: url
            });
        }
        else if (state ==="checked"){
            $.ajax({
                type: 'POST',
                url: '/add-specialty/' + record.id + "/"
            });
        }
    });
});
