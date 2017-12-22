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

    var count = 0;

    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    for (var i = 0; i < metaArr.length; i++) {

         var options = {
            "method": "PUT",
            "hostname": rip,
            "port": "7010",
            "path": "/api/v2.0/" + rtenement + "/" + metaName + "/meta/add",
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
                // var body = Buffer.concat(chunks);
                count++;
                // console.log(body.toString());
            });
        });
        req2.write(JSON.stringify(metaArr[i]));
        req2.end();
    }
    console.log("成功个数: " + count);
});
/**
 * 创建自定义对象
 */
//接收get请求
router.get('/create/:display_name/:metaName', function (req, res, next) {
    var metaName = req.params.metaName;
    var display_name =req.params.display_name;
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

module.exports = router;