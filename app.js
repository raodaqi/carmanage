'use strict';
var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');

var AS = require('api-send');
AS.config.APPID = "58f369a3a0bb9f006a9e2e2a";
// AS.config.HOST = "http://carmanage.leanapp.cn";
AS.config.HOST = "http://localhost:3000";
// AS = new AS();


// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('./cloud');

var app = express();
var LCT = require('lc-build');
var LCT = new LCT({
    path:"routes/history.js",
    name:"History"
})
// LCT.build();
// return;
// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

// 设置默认超时时间
app.use(timeout('15s'));

// 加载云引擎中间件
app.use(AV.express());

app.enable('trust proxy');
// 需要重定向到 HTTPS 可去除下一行的注释。
// app.use(AV.Cloud.HttpsRedirect());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(AV.Cloud.CookieSession({ secret: '<put random string here>', maxAge: 3600000, fetchUser: true }));

app.get('/', function(req, res) {
  res.render('index', { currentTime: new Date() });
});

app.get('/login', function(req, res) {
  console.log(req.currentUser);
  res.render('login', { currentTime: new Date() });
});
app.get('/list', function(req, res) {
    var user = req.currentUser;
  res.render('list', { user: user });
});
app.get('/spec', function(req, res) {
  res.render('spec', { currentTime: new Date() });
});
app.get('/type', function(req, res) {
  res.render('type', { currentTime: new Date() });
});
app.get('/detail', function(req, res) {
  res.render('detail', { currentTime: new Date() });
});
app.get('/mine', function(req, res) {
    res.render('mine', { currentTime: new Date() });
});
app.get('/history', function(req, res) {
    res.render('history', { currentTime: new Date() });
});
app.get('/search', function(req, res) {
    res.render('search', { currentTime: new Date() });
});

app.get('/pdf', function(req, res) {
    res.render('pdf', { currentTime: new Date() });
});

// 可以将一类的路由单独保存在一个文件中
// app.use('/car', require('./routes/car'));
app.use('/history', require('./routes/history'));
app.use('/carinfo', require('./routes/carinfo'));
app.use('/cartype', require('./routes/cartype'));
app.use('/carspec', require('./routes/carspec'));
app.use('/user', require('./routes/user'));

app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function(err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {}
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

// console.log(app._router);

// AS.do(app);
module.exports = app;
