var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log("get");

});

router.post('/', function (req, res, next) {
    console.log("post");
    // 获取post 参数
    var rtenement = req.body.tenement;
    var rtoken = req.body.xToken;
    var rip = req.body.ip;
    // 设置cookies
    res.setHeader("Set-Cookie", ["xToken=" + rtoken , "ip=" + rip , "tenement=" + rtenement ]);

    // 重定向
    res.redirect('/meta/get');
    // 请求路由
    // res.render('meta');

});

module.exports = router;