var express = require('express');

var http = require("http");

var router = express.Router();

router.get('/:metaName', function (req, res, next) {

    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    var options = {
        "method": "GET",
        "hostname": rip,
        "port": "7010",
        "path": "/api/v1.0/" + rtenement + "/service/approvals/template/object/" + req.params.metaName,
        "headers": {
            "x-token": rtoken,
            "cache-control": "no-cache",
            "postman-token": "e0036f4f-8225-d96e-4a77-7e5500e4d530"
        }
    };

    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var body = Buffer.concat(chunks);
            res.render('approve', JSON.parse(body.toString()));
        });
    });

    req2.end();

});

module.exports = router;
