var express = require('express');
var router = express.Router();
//在js中发送http获得接口数据
var http = require("http");

// 第一个参数和app.js中的路由拼接为完成url
router.get('/get', function (req, res, next) {
    console.log("get")
//
    var options = {
        "method": "GET",
        "hostname": "10.100.250.133",
        "port": "7010",
        "path": "/api/v1.0/GuoXinLianCheng/all-metas?acl=true",
        "headers": {
            "x-token": "AQsCAH4ZylkAAEFRQUNkNVZWa2M3UkNBQUFQU0xlNHhRYzVCUWVDQUFBQVFBQ2Q1VlZrYzdSQ0FBQUFNWE80eFFjNUJRZENBQUHpdByJItptku7_xrJZvPRPvw8ETwX8c74DTTHaq5ClR2ouJbEKqLDInLz-P_KmENSsJMTtcrOe0pjlIlTItpid",
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
            console.log(body.toString());
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