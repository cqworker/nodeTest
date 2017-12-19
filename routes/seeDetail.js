var express = require('express');

var http = require("http");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var options = {
        "method": "GET",
        "hostname": "10.100.250.133",
        "port": "7010",
        "path": "/api/v1.0/meiqia/Contract/meta",
        "headers": {
            "x-token": "AQsCAH4ZylkAAEFRQUNkNVZWa2M3UkNBQUFQU0xlNHhRYzVCUWVDQUFBQVFBQ2Q1VlZrYzdSQ0FBQUFNWE80eFFjNUJRZENBQUHpdByJItptku7_xrJZvPRPvw8ETwX8c74DTTHaq5ClR2ouJbEKqLDInLz-P_KmENSsJMTtcrOe0pjlIlTItpid",
            "cache-control": "no-cache",
            "postman-token": "863c4785-aa37-d20d-73f5-d83ca2b851fb"
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
        });
    });

    req2.end();



  res.render('seeDetail', { title: 'Express' });
});

module.exports = router;
