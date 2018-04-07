$(document).ready(function() {
    var _queryTreeSort = function(options) {
        var cfi, e, i, id, o, pid, rfi, ri, thisid, _i, _j, _len, _len1, _ref, _ref1;
        id = options.id || "id";
        pid = options.parentid || "parentid";
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
        pid = options.parentid || "parentid";
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
    console.log(tree_data);
    $('#tree').tree({
        uiLibrary: "bootstrap",
        dataSource: tree_data,
        primaryKey: "id",
        checkboxes: true,
        cascadeCheck: false,
        border: true,
        selectionType: "single"
    });
    // $('#btnSave').on('click', function () {
    //     var checkedIds = tree.getCheckedNodes();
    //     $.ajax({ url: '/Locations/SaveCheckedNodes', data: { checkedIds: checkedIds }, method: 'POST' })
    //         .fail(function () {
    //             alert('Failed to save.');
    //         });
    // });
});
