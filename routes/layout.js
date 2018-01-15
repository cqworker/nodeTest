var express = require('express');

var http = require("http");
var log = require("log4js");
var router = express.Router();

var metaName = "";

router.get('/:metaName', function(req, res, next) {

    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;
    var tenant_id = req.cookies._tenant_id;
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
        //TODO 添加tenant_id
        "path": "/get_config?id="+tenant_id+"&objName="+metaName,
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
            console.log(body.toString());
        });
    });

    req2.end();

});
/**
 * 修改validation
 */
router.post('/edit',function (req,res,netx) {
    //获取cookies
    var rip = req.cookies.ip;
    var rtoken = req.cookies.xToken;
    var rtenement = req.cookies.tenement;

    //组装json对象
    var jsonObj = req.body;
    var name = jsonObj.name;
    var expression = jsonObj.expression;
    var is_valid = jsonObj.is_valid;
    var description = jsonObj.description;
    var error_message = jsonObj.error_message;
    var position = jsonObj.position;
    var validation = {};
    validation.expression = expression;
    validation.is_valid = Boolean(is_valid);
    validation.description = description;
    validation.error_message = error_message;
    validation.position = position;

    var options = {
        "method": "POST",
        "hostname": rip,
        "port": "7020",
        "path": "/api/v1.0/"+rtenement+"/"+metaName+"/meta/validations",
        "headers": {
            "x-token": rtoken,
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "81ea3b19-f8bf-c726-849a-13445be4db39"
        }
    };

    var req2 = http.request(options, function (res2) {
        var chunks = [];

        res2.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res2.on("end", function () {
            var body = Buffer.concat(chunks);
            var logger = log.getLogger('common');
            logger.error(body.toString());
        });
    });

    req2.write(JSON.stringify({name:name,validation:validation}));
    req2.end();
})


module.exports = router;
