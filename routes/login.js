var express = require('express');
var logger = require('log4js');
var passport = require('passport');

var router = express.Router();




router.get('/',function(req, res,next) {
    res.render('login', {});
});

/**
 * 用户登录验证
 */
router.post('/a', function (req, res, next) {
//获得post参数 obj{ name: 'admin', pwd: 'admin' }
    var json = req.body;
    var name = json.name;
    var pwd = json.pwd;
//操作数据库
    req.getConnection(function (err, conn) {
        if (err) {
            return next(err);
        } else {
//nodejs sql防止注入  http://www.dengzhr.com/node-js/877
            conn.query('SELECT name,password FROM user WHERE name = ? AND password = ?', [name,pwd], function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    var str = JSON.stringify(result);
                    var jso = JSON.parse(str);
                    //jso [ { name: 'admin',password:'admin'} ]
                    //响应ajax
                    if (jso[0]) {
                        //添加cookies
                        res.cookie("myAuth", jso[0].password, {maxAge: 1000*60*60*24,httpOnly: true});
                        res.redirect('/tenement');
                    } else {
                        res.json({success: false});
                    }
                }
            });
        }
    });
});

module.exports = router;

