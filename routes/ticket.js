//典型的使用express的.js
//1.导入相关模板
//app.set 设置内部参数
//app.use 注册函数(向tasks的数组进行push)
var express = require('express');
var router = express.Router();
var http = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/search', function(req, res, next) {
  //从ide中直接打开html端口和js3000端口不一致
    var body = req.body;
    var train_date = body.train_date;
    var from_station = body.from_station;
    var to_station = body.to_station;
    var adult = body.purpose_codes;

    // 解析地址
    var options = {
        "method": "GET",
        "hostname": "kyfw.12306.cn",
        "port": null,
        "path": "/otn/leftTicket/queryA?leftTicketDTO.train_date="+train_date+"&leftTicketDTO.from_station="+from_station+"&leftTicketDTO.to_station="+to_station+"&purpose_codes="+adult,
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "cadc0d6d-6fd8-925d-3ce5-2ec5345bde57"
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
            res.render('ticket', JSON.parse(body.toString()));
        });
    });
    req2.end();
//
});

module.exports = router;
