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
        "port": "7020",
        "path": "/api/v1.0/" + rtenement + "/"+ req.params.metaName+"/meta/trigger",
        "headers": {
            "x-token": rtoken,
            "cache-control": "no-cache",
            "postman-token": "e605275e-9995-16ad-22b4-c138b60f87dd"
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
            res.render('trigger', JSON.parse(body.toString()));
        });
    });

    req2.end();

});

module.exports = router;
