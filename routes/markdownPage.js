//典型的使用express的.js
//1.导入相关模板
//app.set 设置内部参数
//app.use 注册函数(向tasks的数组进行push)
var express = require('express');

//2.通过http.createServer 用app来处理请求
//已经被封装到listen中了

var router = express.Router();

/* GET home page. */
router.get('/show', function(req, res, next) {
  res.render('markdownPage', { title: 'markdown' });
});

module.exports = router;
