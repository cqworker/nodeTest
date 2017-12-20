var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//mysql中间件
var mysql = require('mysql'),
    myConnection = require('express-myconnection'),
    dbOptions = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: 3306,
        database: 'meiqia'
    };


//1.引入模块,类似于注册servlet
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var order = require('./routes/order');
var meta = require('./routes/meta');
var seeDetail = require('./routes/seeDetail');
var schema = require('./routes/schema');
var tenement = require('./routes/tenement');


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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误中间件
app.use(function(err, req, res, next) {
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

