var express = require('express');
var router = express.Router();
//在js中发送http获得接口数据
var http = require("http");

// 第一个参数和app.js中的路由拼接为完成url
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

router.post('/', function (req, res, next) {
    console.log("post")

});

module.exports = router;