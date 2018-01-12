meta = [];

$(function () {
    //zTree
    // 异步加载,发送数据必须要包含父id,第一次加载根id为null
    // 返回数据中必须要含有id name isParent
    var setting = {
        view: {
            selectedMulti: false
        }
        , async: {
            enable: true,
            type: 'get',
            url: "/meta/tree",
            autoParam: [],//自动提交父节点属性参数
            otherParam: [],//静态参数
            dataType: "text"
        }
        , callback: {
            beforeAsync: zTreeBeforeAsync
            , onAsyncSuccess: zTreeOnAsyncSuccess
            , onAsyncError: zTreeOnAsyncError
            , onClick: zTreeOnClick
        }
    };


    function zTreeBeforeAsync(treeId, treeNode) {
        return true;

    }

    function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {

    }

    function zTreeOnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
        alert(XMLHttpRequest);
    }

    function zTreeOnClick(event, treeId, treeNode) {
        meta.pop()
        meta.push(treeNode.id)

//            alert(treeNode.id);
        $.ajax({
            url: "/meta/detail/" + treeNode.id,
            type: 'get',
            dataType: 'json',
            success: function (data) {
//                    console.log(JSON.stringify(data.body.schema,null," "));
                var str = "";
                for (var p in data.body.schema) {
//                        console.log(p + " " + data.body.schema[p].display_name);
                    str += "<tr><td><input type='text' value=" + data.body.schema[p].display_name + " name=" + p + "></td>"
                    str += "<td>增<input type='checkbox' name='creatable' name='dd'/>删<input type='checkbox' name='dd' name='deletable'/>改<input type='checkbox' name='dd' name='readable'/>查<input type='checkbox' name='dd' name='readable'/>全选<input type='checkbox' name='all'/></td></tr>"
                }
                $('#myTbody').html(str);


            }
        })

    }

    $.fn.zTree.init($("#treeDemo"), setting);


    $(document).on("change", "input[name='all']", function () {
        if ($(this).is(':checked')) {
            for (var i = 0; i < this.parentNode.childNodes.length; i++) {
                if (this.parentNode.childNodes[i].nodeName === "INPUT") {
                    $(this.parentNode.childNodes[i]).attr("checked", true)
                }

            }
        }
    });

    $(document).on("change", "input[name='dd']", function () {
        if ($(this).is(':checked')) {
//                alert("!")
            for (var i = 0; i < this.parentNode.childNodes.length; i++) {
//                    alert(this.parentNode.childNodes[i])
                if (this.parentNode.childNodes[i].nodeName === "INPUT") {
                    if (!$(this.parentNode.childNodes[i]).is(':checked')) {
                        $(this.parentNode.childNodes[this.parentNode.childNodes.length - 1]).attr('checked', false)
                        break;
                    }
                }
            }
        }
    });

//
    $(document).on("click", "#createRole", function () {
        //创建json
        var role ={}
        var roleName = $('#roleName option:selected').val();
        role[roleName] = {};
        console.log(role)

        //获得角色
        var names = $('#roleNames').val();
        console.log(names);
        var nameArr = names.split(",");
        var members = [];
        //角色入组
        for (v in nameArr) {
            members.push(nameArr[v]);
        }
        console.log(members)
//
        var assign_users = [];
        var assign_usersObj = {};
        assign_usersObj.assign_type = "username";
        assign_usersObj.members = members;
        assign_users.push(assign_usersObj);


        role[roleName].assign_users = assign_users;
//            console.log(JSON.stringify(role,null,' '))
        role[roleName].profile_name = roleName;
        role[roleName].view_all_data= false;
        role[roleName].modify_all_data= false;


//默认对象级权限设置
        var OLA_Default = {}
        OLA_Default.creatable = true;
        OLA_Default.readable = true;
        OLA_Default.deletable = true;
        OLA_Default.updatable = true;
        OLA_Default.view_all = true;
        OLA_Default.modify_all = true;

        role[roleName]['OLA.Default']= OLA_Default;

//            console.log(JSON.stringify(role,null,' '))
//二级默认对象级权限OLA
        var OLA = [];
//         var OLA_Obj0 ={};
//         let object_name_zhcn = [];
//         OLA_Obj0.
        role[roleName]['OLA']= OLA;
// //            console.log($('form > #OLA_TD').serialize())
//
//        var OLA_roles =  $('#OLA_TD')[0].childNodes;
//        // console.log(OLA_roles);
//        for(v in OLA_roles){
//            if(OLA_roles[v].nodeName ==='INPUT'){
//                console.log($(OLA_roles[v]).val());
//                OLA_Default.creatable = true;
//                OLA_Default.readable = true;
//                OLA_Default.deletable = true;
//                OLA_Default.updatable = true;
//                OLA_Default.view_all = true;
//                OLA_Default.modify_all = true;
//            }
//        }




//FLA.Default
        var FLA_Default = {};
        FLA_Default.readable = true;
        FLA_Default.updatable = true;
        role[roleName]['FLA.Default']= FLA_Default;
//FLA 分三种情况 分别入三个的数组中
        var FLA = [];

        var obj0 = {};
        var object_name_zhcn = [];//            对象中文名入列
        console.log(meta[0])
        object_name_zhcn.push(meta[0]);

        var field_name0 = [];//英文字段入列
        obj0.readable = true;
        obj0.updatable = true;
        var field_name1 = [];//英文字段入列
        var obj1 = {};
        obj1.readable = false;
        obj1.updatable = true;
        var field_name2 = [];//英文字段入列
        var obj2 = {};
        obj2.readable = true;
        obj2.updatable = false;
        //序列化表格中的input 遍历每一行判断入哪个列
        console.log($('form').serializeArray());

        var trs =  $('#myTbody')[0].childNodes;
        if(trs.length>1){
            for(v in trs){
                // console.log(v)
                // console.log(trs[v])
                for(v1 in trs){
                    console.log(trs[v][0])
                }
                //
                // console.log(trs[v]);
                // console.log(typeof (trs[v]));
            }
        }




        //对象display_name
        var object_name_zhcn = [];
        object_name_zhcn.push("对账单");
        object_name_zhcn.push("质检单");
        OLA_Default.creatable = true;
        OLA_Default.readable = true;
        OLA_Default.deletable = true;
        OLA_Default.updatable = true;
        OLA_Default.view_all = true;
        OLA_Default.modify_all = true;
        //默认字段级权限
//            var FLA_Default = {}
//            FLA_Default.readable = true;
//            FLA_Default.updatable = true;
//            //每个对象对应一个  自定义字段级权限
//            var FLA = [];
//            var metaObject = {};
//            var object_name_zhcn = []
//            object_name_zhcn.push("日交收单")
//            //可读可写
//            var field_name = []
//            field_name.push("name")
//            field_name.push("display_name")
//            metaObject.readable = true;
//            metaObject.updatable = true;
//            //可读不可写
//            field_name.push("name")
//            field_name.push("display_name")
//            metaObject.readable = true;
//            metaObject.updatable = false;
//            //不可读可写
//            field_name.push("name")
//            field_name.push("display_name")
//            metaObject.readable = false;
//            metaObject.updatable = true;
//            // ----
//            object_name_zhcn.push("结算交收确认单")
//
//            $('#myJson').html()

    })


})