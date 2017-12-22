var express = require('express');

var http = require("http");

var router = express.Router();


router.get('/:metaName', function(req, res, next) {

    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    var options = {
        "method": "GET",
        "hostname": rip,
        "port": "7020",
        "path": "/api/v1.0/"+rtenement+"/"+req.params.metaName+"/meta/validations",
        "headers": {
            "x-token": rtoken,
            "cache-control": "no-cache",
            "postman-token": "2b93c463-921c-1e24-238e-50fe30443a11"
        }
    };

    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var result = Buffer.concat(chunks);
            var json = JSON.parse(result.toString());
            res.render('validation', json);

        });
    });

    req2.end();

});

module.exports = router;
