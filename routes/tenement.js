var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log("get");

});

router.post('/', function (req, res, next) {
    // console.log("post");
    // 获取post 参数
    var rtenement = req.body.tenement;
    var rtoken = req.body.xToken;
    var rip = req.body.ip;
    //cookies不支持存放中文 使用base64编码再解码
    //判断是否含有中文
    var reg = /[\u4e00-\u9fa5]/g;
    if(reg.test(rtenement)){
        var base64Tenement = new Buffer(rtenement).toString('base64');
    }else{
          base64Tenement = rtenement
    }

    // 设置cookies 会把已存在的cookies覆盖
    res.setHeader("Set-Cookie", ["xToken=" + rtoken , "ip=" + rip , "tenement=" + base64Tenement ]);

    // 重定向 加工数据然后路由显示
    res.redirect('/meta/get');
    // 请求路由 本质是使用模板显示数据
    // res.render('meta');

});

module.exports = router;