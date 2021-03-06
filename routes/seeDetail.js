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
        "port": "7010",
        "path": "/api/v1.0/"+rtenement+"/"+req.params.metaName+"/meta",
        "headers": {
            "x-token": rtoken,
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
            var result = Buffer.concat(chunks);
            var json = JSON.parse(result.toString());
            //console.log(json);
            //console.log(json.body.schema);
            // var schema = json.body.schema;
            // for(var k in schema ){
            //     //console.log(k + " " + schema[k]);
            //     for(var v in schema[k]){
            //         console.log(v+""+schema[k][v])
            //     }
            // }
            res.render('seeDetail', json);

        });
    });

    req2.end();

});

module.exports = router;
