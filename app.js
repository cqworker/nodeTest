//类似于导包
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//处理post请求的库
var bodyParser = require('body-parser');
//express的消息提示中间件,用于传递登录失败的一些信息
var flash = require('express-flash');
var session = require('express-session');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

//log中间件
var log4js = require('log4js');
//console是默认的appender，使用cheese这个appender时会将日志记录文件中，日志文件名为cheese.log
log4js.configure({
    appenders: {common: {type: 'file', filename: 'logs/common.log'}},
    categories: {default: {appenders: ['common'], level: 'error'}}
});

//mysql中间件
var mysql = require('mysql')
    , myConnection = require('express-myconnection')
    , dbOptions = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'meiqia'
};

//模型
// var User = require('models/User');

//1.引入模块,类似于注册servlet
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var order = require('./routes/order');
var meta = require('./routes/meta');
var seeDetail = require('./routes/seeDetail');
var schema = require('./routes/schema');
var tenement = require('./routes/tenement');
var trigger = require('./routes/trigger');
var validation = require('./routes/validation');
var approve = require('./routes/approve');


//app注册
//在express内部，有一个函数的数组，暂时叫这个数组tasks，每来一个请求express内部会依次执行这个数组中的函数
//function(req,res，next){//...}
var app = express();

// 模板路径
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.set('view engine', 'jade');


// 中间件:过滤器,请求之前做的,执行链 function(req,rep,next){...}
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//权限--启用session
// app.use(express.session({secret: 'myCq', cookie: {maxAge: 60000}}));//60秒
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

//权限中间件 --本地验证策略passport-local
// passport.use(new LocalStrategy(
//     {
//         usernameField: 'name',
//         passwordField: 'pwd'
//     },
//     function (username, password, done) {
//         //调用方法查询用户
//             if (!User.name) {
//                 return done(null, false, {message: '用户不存在'});
//             }
//             if (!User.pwd) {
//                 return done(null, false, {message: '密码错误'});
//             }
//             return done(null, user);
//     }
// ));
// //保存user对象
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
// //删除user对象
// passport.deserializeUser(function (user, done) {
//     done(null, user);
// });
//


//设置日志级别
app.use(log4js.connectLogger(log4js.getLogger('common'), {level: log4js.levels.INFO}));
//添加mysql中间件
app.use(myConnection(mysql, dbOptions, 'single'));
//静态文件
app.use(express.static(path.join(__dirname, 'public')));


//路由
// 2.url对应模板 类似于servletMapping
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/order', order);
app.use('/meta', meta);
app.use('/see', seeDetail);
app.use('/schema', schema);
app.use('/tenement', tenement);
app.use('/trigger', trigger);
app.use('/validation', validation);
app.use('/approve', approve);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 错误中间件
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // 渲染响应
    res.render('error');
});


//抛出  --交给www
module.exports = app;

