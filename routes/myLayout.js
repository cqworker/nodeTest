var express = require('express');

var http = require("http");
var log = require("log4js");
var router = express.Router();

var metaName = "";

router.get('/:metaName', function(req, res, next) {
    //获取cookies
    var rip = req.cookies.ip;
    var rtenement = req.cookies.tenement;
    var hostname = '';
    if(rip === '10.100.250.133'){
        hostname = "10.100.250.22";
    }else{
        hostname = rip
    }

    metaName = req.params.metaName;

    var options = {
        "method": "GET",
        "hostname": hostname,
        "port": "8555",
        "path": "/get_config?id="+rtenement+"&objName="+metaName,
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "aefc14ab-a3cf-1ec4-1fdd-eb240dfb89ee"
        }
    };

    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var body = Buffer.concat(chunks);
            //貌似无法传递太长的json
            res.render('myLayout', JSON.parse(body.toString()));
        });
    });

    req2.end();

});


router.get('/b/:kind', function(req, res, next) {
    //获取cookies
    var rip = req.cookies.ip;
    var rtenement = req.cookies.tenement;
    var hostname = '';
    if(rip === '10.100.250.133'){
        hostname = "10.100.250.22";
    }else{
        hostname = rip
    }

    var kind = req.params.kind;

    var options = {
        "method": "GET",
        "hostname": hostname,
        "port": "8555",
        "path": "/get_config?id="+rtenement+"&objName="+metaName,
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "aefc14ab-a3cf-1ec4-1fdd-eb240dfb89ee"
        }
    };

    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var body = Buffer.concat(chunks);
            if(metaName!==''){
                res.json(JSON.parse(body.toString()).data.AQACk5HxFIbeDgAAcL7r9bpS7hRuCQAA.obj_config[metaName][kind]);
            }
            });
    });

    req2.end();

});

router.post('/edit/:kind', function(req, res, next) {
    //获取cookies
    var rip = req.cookies.ip;
    var rtenement = req.cookies.tenement;
    //获取post参数
    var body = req.body;
    var jsonTemp = body.json;
    var userid =body.userid;

    var json ={};
    json[rtenement] = {};
    json[rtenement].obj_config ={};
    json[rtenement].obj_config[metaName]={};
    json[rtenement].obj_config[metaName].list = jsonTemp;
    // console.log(json);
    var pwd = body.pwd;

    var jsonObj = {};
    jsonObj.pwd = pwd;
    jsonObj.userid = userid;
    jsonObj.json = json;

    var hostname = '';
    if(rip === '10.100.250.133'){
        hostname = "10.100.250.22";
    }else{
        hostname = rip
    }

    var kind = req.params.kind;

    var http = require("http");

    var options = {
        "method": "POST",
        "hostname": hostname,
        "port": "8555",
        "path": "/abc",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "562dede2-aeb3-a978-98ec-6db349c1ece4"
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
            res.json(JSON.parse(body.toString()));
        });
    });
    console.log(JSON.stringify(jsonObj));
    req2.write(JSON.stringify(jsonObj));
    req2.end();
    //

});

module.exports = router;
