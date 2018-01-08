var express = require('express');
var router = express.Router();
//在js中发送http获得接口数据
var http = require("http");

// 第一个参数和app.js中的路由拼接为完成url
/**
 * 获取所有meta
 */
router.get('/get', function (req, res, next) {
    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;


    var options = {
        "method": "GET",
        "hostname": rip,
        "port": "7010",
        "path": "/api/v1.0/" + rtenement + "/all-metas?acl=true",
        "headers": {
            "x-token": rtoken,
            "cache-control": "no-cache",
            "postman-token": "6102c801-da94-8ab7-e4f9-ca888864b3d4"
        }
    };
    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var body = Buffer.concat(chunks);
            res.render('meta', JSON.parse(body.toString()));
        });
    });
    req2.end();
    //

});


router.get('/tree', function (req, res, next) {
    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    var options = {
        "method": "GET",
        "hostname": rip,
        "port": "7010",
        "path": "/api/v1.0/" + rtenement + "/all-metas?acl=true",
        "headers": {
            "x-token": rtoken,
            "cache-control": "no-cache",
            "postman-token": "6102c801-da94-8ab7-e4f9-ca888864b3d4"
        }
    };
    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var body = Buffer.concat(chunks);
            // console.log(body.toString());
            var jsonBody = JSON.parse(body.toString()).body;
            var respBody = {};
            var str = "{\"id\": \"StandardObjects\", \"name\": \"标准对象\",\"children\":[";
            //{id:"xxx",name: "日交收单"},
            for (var k in jsonBody) {
                respBody.id = k;
                respBody.name = jsonBody[k].display_name;
                respBody.isParent = true;
                var strOne = JSON.stringify(respBody);
                var strTwo = strOne.substring(0, strOne.length - 1);
                str += strTwo + ",\"children\":[{\"id\":\"" + k + "_validation\",\"name\":\"验证器\",\"isParent\":false},{\"id\":\"" + k + "_trigger\",\"name\":\"触发器\",\"isParent\":false}]},";
            }
            str = str.substring(0, str.length - 1) + "]}";
            res.json(JSON.parse(str));
        });
    });
    req2.end();
    //

});

/**
 * 获得每个对象的字段数
 */
router.get('/count', function (req, res, next) {
    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    var options = {
        "method": "GET",
        "hostname": rip,
        "port": "7010",
        "path": "/api/v1.0/" + rtenement + "/all-metas?acl=false",
        "headers": {
            "x-token": rtoken,
            "cache-control": "no-cache",
            "postman-token": "6102c801-da94-8ab7-e4f9-ca888864b3d4"
        }
    };
    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {

            //X [,,,,]
            //Y [,,,,]

            var body = Buffer.concat(chunks);
            // console.log(body.toString());
            var jsonBody = JSON.parse(body.toString()).body;
            var Xstr = "[";
            var Ystr = "[";
            //{id:"xxx",name: "日交收单"},
            for (var k in jsonBody) {
                Xstr += "\""+jsonBody[k].display_name+"\",";
                var i = 0 ;
                for (var j in jsonBody[k].schema) {
                    i++;
                }
                Ystr += i+",";
            }
            var ystr = Ystr.substring(0, Ystr.length - 1);
            ystr +=  "]";
            var xstr = Xstr.substring(0, Xstr.length - 1);
            xstr +=  "]";
            // console.log(xstr)
            // console.log(ystr)
            var str = "{\"xstr\":"+xstr+",\"ystr\":"+ystr+"}"
            res.json(JSON.parse(str));
        });
    });
    req2.end();
    //

});




/**
 * 创建多行
 */
router.post('/create', function (req, res, next) {
    //获得post参数
    var json = req.body;
    var meta = Object.keys(json)[0];
    var metaJson = JSON.parse(meta.toString());
    var metaName = Object.keys(metaJson)[0];
    // console.log(metaName);
    // console.log(metaJson);
    //eval 的用法
    // console.log(eval('metaJson.'+metaName));
    var metaArr = metaJson[metaName];
    //console.log(metaArr);

    var count = 0;

    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    for (var i = 0; i < metaArr.length; i++) {

        var options = {
            "method": "PUT",
            "hostname": rip,
            "port": "7020",
            "path": "/api/v1.0/" + rtenement + "/" + metaName + "/meta/add",
            "headers": {
                "x-token": rtoken,
                "content-type": "application/json",
                "cache-control": "no-cache",
                "postman-token": "0a661c6d-638b-19e2-70e5-37ddd87d9768"
            }
        };
        var req2 = http.request(options, function (res2) {
            var chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                var body = Buffer.concat(chunks);
                count++;
            });
        });
        req2.write(JSON.stringify(metaArr[i]));
        req2.end();
    }
    //count 无法实现统计
    //console.log("成功个数: " + count);

});
/**
 * 创建自定义对象
 */
//接收get请求
router.get('/create/:display_name/:metaName', function (req, res, next) {
    var metaName = req.params.metaName;
    var display_name = req.params.display_name;
    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    var options = {
        "method": "POST",
        "hostname": rip,
        "port": "7020",
        "path": "/api/v1.0/" + rtenement + "/" + metaName + "/meta",
        "headers": {
            "x-token": rtoken,
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "4ffdbd17-af32-970e-2fc1-9fd003ccf8ee"
        }
    };

    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            console.log(metaName + "创建成功!");
        });
    });
    req2.write(JSON.stringify({display_name: metaName, description: ''}));
    req2.end();

});
/**
 * 判断是否已经存在
 */
router.get('/:metaName', function (req, res, next) {
    var metaName = req.params.metaName;
    var result = false;
    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    var options = {
        "method": "GET",
        "hostname": rip,
        "port": "7010",
        "path": "/api/v1.0/" + rtenement + "/all-metas?acl=false",
        "headers": {
            "x-token": rtoken,
            "cache-control": "no-cache",
            "postman-token": "6102c801-da94-8ab7-e4f9-ca888864b3d4"
        }
    };
    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var body = Buffer.concat(chunks);
            var metaList = JSON.parse(body.toString());
            var data = Object.keys(metaList.body);
            console.log(data.length);
            for (var i = 0; i < data.length; i++) {
                if (metaName === data[i]) {
                    result = true;
                    break;
                }
            }
            if (result) {
                res.json({success: false});
            } else {
                res.json({success: true});
            }


        });
    });
    req2.end();
    //

});

/**
 * 对象详情
 */
router.get('/detail/:metaName', function (req, res, next) {
    var metaName = req.params.metaName;
    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;
    //判断字符串是否包含一个子字符串
    if (metaName.indexOf("_") > -1) {//查询对象的trigger,validation
        var arr = metaName.split("_");
        var metaObj = arr[0];
        if(arr[1]==="trigger"){
            var options = {
                "method": "GET",
                "hostname": rip,
                "port": "7020",
                "path": "/api/v1.0/"+rtenement+"/"+metaObj+"/meta/trigger",
                "headers": {
                    "x-token": rtoken,
                    "cache-control": "no-cache",
                    "postman-token": "f0794dfa-f40c-9e61-e045-54f1111d3081"
                }
            };

            var req2 = http.request(options, function (res2) {
                var chunks = [];

                res2.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res2.on("end", function () {
                    var body = Buffer.concat(chunks);
                    res.json(JSON.parse(body.toString()));
                });
            });

            req2.end();
        }else{
            var options = {
                "method": "GET",
                "hostname": rip,
                "port": "7020",
                "path": "/api/v1.0/"+rtenement+"/"+metaObj+"/meta/validations",
                "headers": {
                    "x-token": rtoken,
                    "cache-control": "no-cache",
                    "postman-token": "8abe4e2f-bf7c-42cb-9b91-28ca9b4569ce"
                }
            };

            var req2 = http.request(options, function (res2) {
                var chunks = [];

                res2.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res2.on("end", function () {
                    var body = Buffer.concat(chunks);
                    // console.log(body.toString());
                    res.json(JSON.parse(body.toString()));
                });
            });

            req2.end();
            //
        }
    } else {// 查询标准对象
        var options = {
            "method": "GET",
            "hostname": rip,
            "port": "7010",
            "path": "/api/v1.0/meta/" + metaName + "/meta",
            "headers": {
                "x-token": rtoken,
                "cache-control": "no-cache",
                "postman-token": "4c3e3589-03d9-a309-df49-d7a7926bcfc9"
            }
        };

        var req2 = http.request(options, function (res2) {
            var chunks = [];

            res2.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res2.on("end", function () {
                var body = Buffer.concat(chunks);
                res.json(JSON.parse(body.toString()));
            });
        });
        req2.end();
    }


    //

});


module.exports = router;